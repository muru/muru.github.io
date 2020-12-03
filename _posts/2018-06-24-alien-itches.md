---
layout: post
title: 'Arch on Alienware: Part II'
subtitle: Scratching itches
tags: [tech, linux]
---

So, it's been [half a year since][alien] I got the Alienware Aurora R7, and I
have had my fair share of bugs and annoyances. Today, I'll talk about a few of
those.

<!-- section -->

<aside markdown="1">

> Every good work of software starts by scratching a developer's personal itch.

&mdash; [*The Cathedral and the Bazaar*][esr],  
Eric S. Raymond.

</aside>

# Shutting down

The Alienware series apparently has a fairly common  issue of panicking on
shutdown ([1], [2], [3], [4], [5]). The apparent cause is something in the I2C
Designware module. The solution used to be [disabling it][21], but things have
changed since then, and now the Arch Linux kernel has it baked in instead of as
a module that could be blacklisted. With some help from [the Unix & Linux Stack
Exchange][unix], that problem has been overcome. The solution is to blacklist a
kernel function, as Stephen Kitt suggested in February, and the correct function
was identified by Yurij Mikhalevich right around the end of May.

So, to fix the panic issue, I needed to add the following to the kernel boot
parameters:

    initcall_blacklist=dw_i2c_init_driver

In the intervening months, I had my own hack around this: while trying to figure
out when exactly the offending driver was loaded, noticed that shutting down
worked fine if I booted directly to the systemd `poweroff.target`.  So I added
an additional EFI boot entry, which started the kernel with
`systemd.unit=poweroff.target`, and then wrote a short script that enabled a
one-time boot to that entry and restarted. So shutting down took a while longer,
but worked fine as long as I called that script.

<!-- section -->

# Multi-monitor and audio

So my setup looks something like this[^1]  &mdash; with a horrible mess of
cables connecting the whole lot:

```
     +--------------------+
     |     Alien          |
     |                    |                                         +--------+
     +--------------------+                                         |        |
                                                                    |        |
  +-------------------+                                             |        |
  |                   |                                             |        |
  |                   |                                        +----+---+    |
  |                   |   +---+                                |Speakers|    |
  |                   |   |   |                                +----+---+    |
  |                   |   | M |                                     |        |
  |                   |   | o |                                     |        |
  |                   |   | n |                                     |        |
  |         Table     |   | i |                                     |   TV   |
  |                   |   | t |                                     |        |
  |                   |   | o |                                     |        |
  |                   |   | r |                                     |        |
  |                   |   |   |                                +----+---+    |
  |                   |   +---+                                |Speakers|    |
  |                   |                                        +----+---+    |
  |                   |                                             |        |
  +-------------------+                                             |        |
                                                                    |        |
                                                                    |        |
                                                                    +--------+
```

So my monitor, a 24" BenQ, is visually below the 46" Sony TV. The monitor is
smaller, but much closer than the TV, so reading is far easier on it.  As a
result, it is my primary display when using the PC. However, the speakers are
connected to the TV's audio out, since I also use the TV via a Chromecast, and in
the past via an HDMI switch that connected it to my laptop. So it makes sense
for whatever's using the TV to have its audio go via the speakers.

This is where the annoyance begins. Since both displays are connected via
HDMI[^2], both are available for sound output (and the monitor has a built-in
speaker). Since the monitor is the primary, sound is usually preferentially
routed through it, on both Windows and Linux (with PulseAudio). Windows does a
better job of remembering after I select the TV as the output once. However, on
Linux, every time I switch display configuration (from mirror to extend and
*vice  versa*), which I do quite often depending on whether I am gaming (mirror)
or watching videos (extend), output is reset to the monitor. (Or worse, sometimes
it picks the PC's S/PDIF output, which has nothing connected to it at all!)

Worse still, the sound settings are not at all helpful here:

![Sound Settings](https://i.imgur.com/eri1Grj.png)

Quick: which would be the TV and which would be the monitor? :unamused:

<!-- section -->

Thus, I have two problems (and regex ain't one of them):

1. Quick switching between display arrangements (GNOME Shell doesn't have
anything built-in for that, as far as I know).
2. Ensuring that the TV is the sound source, no matter what the arrangement is.

I tried fiddling with `~/.config/monitors.xml`, but it seems that file isn't
watched for changes. So modifying that file doesn't help. I tried an extension
for GNOME Shell, but I quickly ran in to problem (2) above. So once I again, I
settled on writing up scripts. Setting arrangements is  easy enough with
`xrandr`:

```sh
xrandr --output DP-1 --primary --below HDMI-0     # extend above
xrandr --output DP-1 --same-as HDMI-0             # mirror
```

Here, DP-1 is the monitor connected on the DisplayPort, and HDMI-0 is the TV on
(surprise, surprise!) HDMI. It's not difficult to see which is which:

```
% xrandr                                                                                                                                                                                        :(
Screen 0: minimum 8 x 8, current 1920 x 2160, maximum 32767 x 32767
HDMI-0 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1920x1080     60.00*+  59.94    60.05    60.00
   1440x480      60.05
   1280x720      60.00    59.94
   720x480       59.94
   640x480       59.93
DP-0 disconnected (normal left inverted right x axis y axis)
DP-1 connected primary 1920x1080+0+1080 (normal left inverted right x axis y axis) 527mm x 296mm
   1920x1080     60.00*+  59.94    50.00    60.05    60.00    50.04
   1680x1050     59.95
   1600x900      60.00
   1280x1024     75.02    60.02
   1280x800      59.81
   1280x720      60.00    59.94    50.00
   1024x768      75.03    60.00
   800x600       75.00    60.32
   720x576       50.00
   720x480       59.94
   640x480       75.00    59.94    59.93
DP-2 disconnected (normal left inverted right x axis y axis)
DP-3 disconnected (normal left inverted right x axis y axis)
DP-4 disconnected (normal left inverted right x axis y axis)
DP-5 disconnected (normal left inverted right x axis y axis)
DP-1-1 disconnected (normal left inverted right x axis y axis)
HDMI-1-1 disconnected (normal left inverted right x axis y axis)
```

The (far newer) monitor has far more supported modes. So it's easy to parse them
out and see which is which:

```sh
% xrandr |
   awk '/connected/{name=$1; next} name && /x/{count[name]++} END {for (i in count) print i, count[i]}'
HDMI-0 5
DP-1 11
```

<!-- section -->

## PulseAudio

The tricky part, however, was PulseAudio. I find it confusing. There's
[`pactl`][pactl] and [`pacmd`][pacmd]. There's all those configuration files,
`default.pa` and whatever else, written in a custom format, from what I can tell.
Sinks, sources, ports, cards, …! 'Tis enough to make one throw up their hands in
despair!

Also, looking at the `pamcd` and `pactl` outputs, it's obvious that trying to
parse that deeply-nested structure using regex is just asking for trouble.
However, PA doesn't have first-party libraries for accessing this data from
friendly languages like Python. There have been a few projects trying to expose
such an API, but they don't seem well-maintained or extensive in coverage.
Worse yet, even though the `pactl` manpage says:

     pactl  only  exposes  a  subset  of  the  available  operations.  For the
     full set use the pacmd(1).

`pactl` actually seems to expose more information than  `pacmd`. For example,
here's part of the output for `pactl list cards`:

```
        Active Profile: output:hdmi-stereo-extra1
        Ports:
                hdmi-output-0: HDMI / DisplayPort (priority: 5900, latency offset: 0 usec, available)
                        Properties:
                                device.icon_name = "video-display"
                                device.product.name = "BenQ GW2480
 "
                        Part of profile(s): output:hdmi-stereo
                hdmi-output-1: HDMI / DisplayPort 2 (priority: 5800, latency offset: 0 usec, available)
                        Properties:
                                device.icon_name = "video-display"
                                device.product.name = "SONY TV
     "
                        Part of profile(s): output:hdmi-stereo-extra1
```

The equivalent on `pacmd list-cards`:

```
        ports:
                hdmi-output-0: HDMI / DisplayPort (priority 5900, latency offset 0 usec, available: yes)
                        properties:
                                device.icon_name = "video-display"
                                device.product.name = "BenQ GW2480
 "
                hdmi-output-1: HDMI / DisplayPort 2 (priority 5800, latency offset 0 usec, available: yes)
                        properties:
                                device.icon_name = "video-display"
                                device.product.name = "SONY TV
     "
```

Two things of note:

1. A human-grokkable name (the product name) is available[^3] from PulseAudio!
(Those are, in fact, what Windows shows!) Why TF doesn't the sound settings use
those?
2. `pacmd`, ostensibly the more "powerful" command, doesn't show the profile
associated with each port. It's probably hidden away in some other sub-command,
and I'd need to parse out the port name matching the product name and then go
hunting.

At any rate, getting the correct profile for the output I want to use is now
easy with `pactl`:

```sh
tv="SONY"
pactl list cards |
  awk -v "tv=$tv" '$1 ~ /Name:/ {name = $2} /device.product.name/ && ($0 ~ tv) {p = 1} p && /Part of profile/ {print name, $NF; exit}'
```

This gives the card name and the profile name, then I can do:

```sh
tv="SONY"
read -r card profile < <(pactl list cards | awk -v "tv=$tv" '$1 ~ /Name:/ {name = $2} /device.product.name/ && ($0 ~ tv) {p = 1} p && /Part of profile/ {print name, $NF; exit}')
pacmd set-card-profile "$card" "$profile"
```

<!-- section -->

Now all I need to do is wrap these up in scripts, have the display arrangement
script set the sound output as well[^4], and use [this neat extension][tbse] to add
a couple of icons to my panel, and bam! A click is all I need to switch profiles
or fix sound if some bug caused the sound to go wandering around.

---

I think, all said and done, a better way would have been to use PA configuration
files to set a higher priority for the TV. But I can't be arsed to learn the
configuration language. So: `¯\_(ツ)_/¯` My scripts work and I postpone PA for a
time when I have far more free time.


<!-- section -->

[^1]: ASCII boxes thanks to <http://asciiflow.com/>!
[^2]: Well, one via DisplayPort (/HDMI adaptor) and the other by HDMI,
      technically, but both interfaces can do audio out, so both show up in the
      sound settings.

[^3]: What's with the traling newline and other whitsepace there, though?

[^4]: With a 2-second `sleep` in between, to give time for PA to settle after
      display rearrangement.

[alien]: {% post_url 2017-12-12-alien %}
[esr]: http://www.catb.org/esr/writings/homesteading/cathedral-bazaar/ar01s02.html
[unix]: https://unix.stackexchange.com/q/423797/70524
[pactl]: http://manpages.ubuntu.com/manpages/bionic/man1/pactl.1.html
[pacmd]: http://manpages.ubuntu.com/manpages/bionic/man1/pacmd.1.html
[tbse]: https://extensions.gnome.org/extension/1154/top-bar-script-executor/

[1]: https://helloworldproject.blogspot.jp/2016/11/installing-ubuntu-1610-on-alienware.html
[2]: https://forum.manjaro.org/t/kernel-panic-at-shutdown/11054/6
[3]: https://askubuntu.com/q/1008685/158442
[4]: https://www.dell.com/community/Alienware-General/Alienware-Aurora-R6-Booting-Linux-on-PCIe-M-2/td-p/5520641/page/2
[5]: https://www.reddit.com/r/Dell/comments/7j38lr/dell_aurora_r6_linux_mint_and_shutdown_issues/
