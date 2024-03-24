---
layout: post
title: 'Naming a netns with systemd Private Mounts'
tags: [tech, linux]
description: Wrestling with private mounts to name a netns

---

In [my previous update][prev], I used a symbolic link to set up the name for new namespace, like so:

```
ln -sf /proc/self/ns/net /var/run/netns/vpn
```

Months later, this resulted in a face-meet-palm moment as I realized that since `/proc/self` changes for every process,
this link was meaningless. It didn't prevent the rest of the setup from working fine, of course, as none of that uses
the `vpn` name to refer to the netns. However, if I wanted to run a command inside, then I had a problem. I embarked
upon yet another journey to see how I could name if `/proc/self` wasn't option. A couple of ways came to mind:

```
/bin/sh -c 'ln -sf /proc/$$/ns/net /var/run/netns/vpn'
/bin/sh -c 'ip netns attach vpn $$'
```

The first option didn't work. Since the process in question died immediately, the link would become invalid. The second
option, in which `ip netns attach` does [`mount` shenanigans], seemed like it should work. Apparently, it remounts
`/var/run/netns` as a bind-mount to itself, making it shared in the process, so that mounts in it are propagated to
child namespaces. Then it mounts the netns in a subdirectory there, so it can be accessed independently of any process.
However, once systemd starts our services in private namespaces, it is too late - even using [the `+` prefix][table 2]
to elevate our commands beyond these namespaces doesn't seem to work, and the mounts aren't propagated correctly.

So this should be something that's done before our services start. I first tried using a separate `netns-default`
service just for naming the original netns. Once the initial setup was done, one would think that `ip netns attach`
should then start working even in restricted services if run with elevated privileges. _Quelle surprise_, `ip` tries to
do the `mount` shenanigans all over again and fails:

```
ip[471]: mount --make-shared /var/run/netns failed: Operation not permitted
```

Then I fell back to using this in the VPN service override:

```
ExecStartPost=/usr/bin/ln -sf /proc/${MAINPID}/ns/net /var/run/netns/vpn
```

This way, the netns will be accessible at least as long as the VPN process stays alive.  After thinking a bit more, I
decided to go for a _third_ service:

{% highlight shell linenos %}
# /etc/systemd/system/netns-vpn-post.service
[Unit]
Description=VPN network namespace (post)
ConditionPathExists=!/var/run/netns/vpn
After=<vpn>.service

[Install]
WantedBy=<vpn>.service

[Service]
Type=oneshot
RemainAfterExit=yes
# Hat-tip to A.B. here: https://serverfault.com/a/1097323/229499
ExecStartPre=:/bin/bash -c 'declare $(systemctl show --property MainPID <vpn>.service); ip netns attach vpn $MainPID'
{% endhighlight %}

This service doesn't have to deal with private namespaces, and just sets up the name using `ip netns attach`. Note the
`:` at the start of the command so that systemd leaves `$` alone. Now everything looks nice:

```
% ip netns list
default
vpn (id: 0)
```

In the end, though, I went with just disabling `PrivateMounts` for the netns setup service, for which it doesn't really
matter, and running the `ip netns attach` commands there. Having `PrivateMounts` for the services run in that service
might be fine, but for this one, it really was more trouble than it was worth.

[`mount` shenanigans]: https://7bits.nl/journal/posts/what-does-ip-netns-add-actually-do/ "What does ip netns add actually do? - Peter van Dijk"
[table 2]: https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#id-1.9.8 "man systemd.service — Table 2. Special executable prefixes"
[prev]: {% post_url 2023-08-26-netns-systemd %} "Private Mounts in systemd and netns"
