---
layout: post
title: 'Poking around a Pi: Part II'
subtitle: 'VPNs and Network Namespaces'
tags: [tech, linux]
description: Using a VPN only for a select group of applications (updated August 2023)

---

A few weeks ago, I had occasion to find out how Docker overlay networks could be created manually, which led me to learn
more about network namespaces in Linux. I already knew the concepts behind various namespaces (user, PID, mount, etc.),
but this was the first time in a long time that I had occasion to set one up myself. In the process, I came up on one
solution to a problem that I'd been having recently: applying a VPN only to some applications.

<!-- section -->

<aside>I know I promised to talk about Nextcloud in my last post over a year ago. However, in the months since, I had to
wipe and reinstall the Pi, and I ended up choosing not to install Nextcloud this time around. Instead, I connected it to
my TV, and installed Kodi. That has turned out to be far more useful for my purposes than Nextcloud ever was.</aside>

Some time ago, I bought a subscription for Tunnelbear, and they support [Linux via OpenVPN][tb-linux]. I started using
it on my Pi, but to my dismay, I found that the VPN routing prevented incoming connections from the internet from being
properly handled. This caused a couple of problems:

1. This broke SSH from outside.
2. I could no longer run an externally-accessible web server from the Pi. As a side-effect, Let's Encrypt certificate
   renewal via certbot could no longer be automated, since it would only work when the VPN was off.

The first could have been something of a deal-breaker, but since I accessed the Pi via SSH from the internet only
rarely, I was willing to let the VPN run as-is for the time being. I investigated online, and most solutions seemed to
recommend setting up another routing table and using `iptables` to mark the traffic (via, e.g., matching the user) to
use the new routing table. I didn't find this particularly appealing - I didn't want to go about running some process
under a different group or user, and I didn't want to mess with whatever routing OpenVPN deemed appropriate. Different
strokes and all...

<!-- section -->

Enter network namespaces aka netns. The idea itself is old (see, for example, [this 7-year-old
post](http://www.evolware.org/?p=293));  I just happened to stumble upon it recently. In short, the key element driving
the netns solution is the Virtual Ethernet Device aka [`veth`]. These are pairs of linked devices, where:

> Packets transmitted on one device in the pair are immediately received on the other device.

By keeping each interface of a `veth` pair in different namespaces, we can have easy communication between the two. So,
we'll have the default namespace, which is where we normally operate, and we will have a new namespace where the VPN
(and any applications that need the VPN) will operate.

<!-- section -->

The arcane incantations (to be invoked as root) involved are:

{% highlight shell linenos %}
NS_NAME=vpn
ip netns add "$NS_NAME"
ip netns exec "$SHELL"
ln -s /proc/1/ns/net /var/run/netns/default
ip link add dev veth1 mtu 1500 type veth peer name veth2 mtu 1500
ip link set dev veth2 netns default
ip addr add dev veth1 10.0.0.1/24
ip link set veth1 up
ip netns exec default ip link set veth2 up
ip route add 192.168.1.2/32 dev veth1
ip route add default via 192.168.1.2
ip netns exec default ip route add 10.0.0.0/24 dev veth2
ip netns exec default iptables -A FORWARD -i veth2 -o eth0 -j ACCEPT
ip netns exec default iptables -A FORWARD -o veth2 -i eth0 -j ACCEPT
ip netns exec default iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE
sysctl -w net.ipv4.ip_forward=1
{% endhighlight %}

What do these commands do? Let's examine them block by block.

1. Set up the namespace and enter it:

    ```sh
    NS_NAME=vpn
    ip netns add "$NS_NAME"
    ip netns exec "$SHELL"
    ln -s /proc/1/ns/net /var/run/netns/default
    ```
    Here, we create a new network namespace named "`vpn`", and start a shell in it. Since the default namespace probably
    doesn't have a name, we set a name for it (oddly enough, `default`).

2. Create the veth pair and move one to the default namespace (we're already in a shell in the new namespace, remember):

    ```
    ip link add dev veth1 mtu 1500 type veth peer name veth2 mtu 1500
    ip link set dev veth2 netns default
    ```
3. Bring up our veth interfaces and assign them IPs:

    ```
    ip addr add dev veth1 10.0.0.1/24
    ip link set veth1 up
    ip netns exec default ip link set veth2 up
    ```
4. Route to the external network via your proper network interface (here, I'm assuming its IP is 192.168.1.2) and
   route back:

    ```
    ip route add 192.168.1.2/32 dev veth1
    ip route add default via 192.168.1.2
    ip netns exec default ip route add 10.0.0.0/24 dev veth2
    ```
5. Set up packet forwarding using iptables:

    ```
    ip netns exec default iptables -A FORWARD -i veth2 -o eth0 -j ACCEPT
    ip netns exec default iptables -A FORWARD -o veth2 -i eth0 -j ACCEPT
    ip netns exec default iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE
    ```

6. Enable IPv4 forwarding using `sysctl`:

    ```
    sysctl -w net.ipv4.ip_forward=1
    ```

Then run OpenVPN in this network namespace (for example, by running the `openvpn` command itself here, or by using
systemd to link it to this namespace).

<!-- section -->

I personally use systemd to set the whole thing up at boot. First, there's the one-shot service to set up the
namespace:

{% highlight shell linenos %}
# /etc/systemd/system/netns-vpn.service
[Unit]
Description=VPN network namespace
ConditionPathExists=!/tmp/netns-vpn-concluded

[Service]
Type=oneshot
RemainAfterExit=yes

# Ask systemd to create a network namespace
PrivateNetwork=yes
# But not private mounts
PrivateMounts=no

ExecStartPre=/usr/sbin/ip netns attach default 1
ExecStartPre=:/bin/sh -c 'ip netns attach vpn $$'
ExecStartPre=/usr/sbin/ip link add dev veth1 mtu 1500 type veth peer name veth2 mtu 1500
ExecStartPre=/usr/sbin/ip link set dev veth2 netns default
ExecStartPre=/usr/sbin/ip addr add dev veth1 10.0.0.1/24
ExecStartPre=/usr/sbin/ip link set veth1 up
ExecStartPre=/usr/sbin/ip netns exec default /usr/sbin/ip link set veth2 up
ExecStartPre=/usr/sbin/ip route add 192.168.1.2/32 dev veth1
ExecStartPre=/usr/sbin/ip route add default via 192.168.1.2
ExecStartPre=/usr/sbin/ip netns exec default /usr/sbin/ip route add 10.0.0.0/24 dev veth2
ExecStartPre=/usr/sbin/ip netns exec default /usr/sbin/iptables -A FORWARD -i veth2 -o eth0 -j ACCEPT
ExecStartPre=/usr/sbin/ip netns exec default /usr/sbin/iptables -A FORWARD -o veth2 -i eth0 -j ACCEPT
ExecStartPre=/usr/sbin/ip netns exec default /usr/sbin/iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE

ExecStart=/usr/bin/touch /tmp/netns-vpn-concluded
{% endhighlight %}

It differs a bit from the code above, because this uses the network namespace that systemd can set up for a service. The
`sysctl` knob can be set at boot using a file in `/etc/sysctl.d`.

Then use a drop-in to modify the OpenVPN service to use the same namespace:

{% highlight shell linenos %}
==> /etc/systemd/system/openvpn-client@/override.conf <==
[Service]
PrivateNetwork=yes

[Unit]
JoinsNamespaceOf=netns-vpn.service
Requires=netns-vpn.service
After=netns-vpn.service
{% endhighlight %}

This runs all instances of the `openvpn-client` template service in the namespace created for the one-shot service.
You can, of course, make a template of the network namespace setup service, and have one for each instance of the
OpenVPN client.

A similar drop-in override can be used for other services (e.g., Kodi or a desktop session).

This doesn't protect against the VPN dying and leaving your services directly connected via your network. I
think that can be bluntly handled by having an `ExecStopPost` for the OpenVPN client which removes the default route
altogether (and correspondingly have an `ExecStartPre` set up the default route instead of setting it in the one-shot
service).
{: .danger}

<!-- section -->

## Updates

Since the time this post was originally published, I have updated the unit files above twice. Details on the updates can
be found in these follow-up posts:

1. [Network Namespaces and systemd Private Mounts]({% post_url 2023-08-26-netns-systemd %})
2. [Naming Network Namespaces in systemd Private Mounts]({% post_url 2024-03-25-netns-systemd-ii %})


[tb-linux]: https://www.tunnelbear.com/blog/linux_support/ "TunnelBear Befriends Penguins with Limited Linux Support"
[`veth`]: https://man7.org/linux/man-pages/man4/veth.4.html
