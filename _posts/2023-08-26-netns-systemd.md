---
layout: post
title: 'Private Mounts in systemd and netns'
tags: [tech, linux]
description: Fixing breakage due to systemd updates

---

My [previous post][prev] originally used bind mounts (`mount --bind /proc/self/ns/net /var/run/netns/vpn`) instead of
symbolic links (`ln -sf /proc/self/ns/net /var/run/netns/vpn`) to name the private namespace. The `mount` method created
two complications:

1. The `/var/run/netns/vpn` had to exist (the old unit ran `ip netns add vpn` to create yet another namespace).
2. Mounts are problematic with `PrivateMounts=yes`.

The latter only became a problem with [systemd's v254 release][systemd-v254]:

>     * PrivateNetwork=yes and NetworkNamespacePath= now imply
>       PrivateMounts=yes unless PrivateMounts=no is explicitly specified.

Since I run Arch Linux, I get the latest versions of systemd, and one day this setup just started failing, because:

> File system namespaces are set up individually for each process forked off by the service manager. Mounts established
> in the namespace of the process created by `ExecStartPre=` will hence be cleaned up automatically as soon as that
> process exits and will not be available to subsequent processes forked off for `ExecStart=` (and similar applies to
> the various other commands configured for units).
>
>  &mdash; _[`man 5 systemd.exec`][systemd.exec]_, `PrivateMounts=`

This meant that while I had a `vpn` netns created, the commands that I was running assuming that it was in the `vpn`
netns were actually being run in the unit's private namespace. So, when the VPN interface started up, there was nothing
useful in the netns. No `veth` devices, no route to the internet.

I solved this problem by:

1. Using symbolic links to name the namespace, and
2. Using `JoinsNamespaceOf` instead of using name for the namespace in the other units.

This actually improved and simplified the setup, in addition to not having to create the `vpn` netns unnecessarily:

1. `JoinsNamespaceOf` directly expresses the relationship between the VPN service and the netns service.
2. Any other services that should be in the namespace of the VPN service can now use
   `JoinsNamespaceOf=openvpn-client@<whatever>`, instead of having to join some arbitrary namespace.

This creates a nice tree of namespace relationships. The `vpn` name for the netns now exists only for convenience, for
when (if) I need to run `ip netns exec` to do something in it.

(Note that each unit that uses `JoinsNamespaceOf` must also have `PrivateNetwork` enabled.)

[systemd-v254]: https://github.com/systemd/systemd/releases/tag/v254
[systemd.exec]: https://www.freedesktop.org/software/systemd/man/systemd.exec.html#PrivateMounts=
[prev]: {% post_url 2020-12-03-poking-pi-ii %} "VPNs and Network Namespaces"
