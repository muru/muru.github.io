---
title: Resources
pagestyle: cann-table
permalink: /resources/
---
<div markdown="1" class="section">
A CV template in LaTeX (modified from one obtained online, original included):  
[CV-LaTeX.tar.gz](files/CV-LaTeX.tar.gz)
</div>

<div markdown="1" class="section">
Some stuff that I drag around with me on my various Linux boxes:

## Vimrc and vim plugins {#vim}

### [vim.tar.bz2](files/vim.tar.bz2) {#vim-archive}

<div markdown="1" class="resources-list" id="plugins-list">

Currently contains a nifty `vimrc`, and some plugins:

- [Pathogen](http://www.vim.org/scripts/script.php?script_id=2332) 
- [Syntastic](http://www.vim.org/scripts/script.php?script_id=2736) 
- [SuperTab](http://www.vim.org/scripts/script.php?script_id=1643) 
- [Align](http://www.vim.org/scripts/script.php?script_id=294) 
- [AutoAlign](http://www.vim.org/scripts/script.php?script_id=884) 
- [Latex-Box](http://www.vim.org/scripts/script.php?script_id=3109) 
- [Surround.vim](http://www.vim.org/scripts/script.php?script_id=1697) 
- [Haskell Cuteness](http://www.vim.org/scripts/script.php?script_id=2603) 
- [Extended Regex](http://www.vim.org/scripts/script.php?script_id=3282) 
- [Haskell Mode - Vim](https://github.com/lukerandall/haskellmode-vim) 
- [Vim to Haskell](https://github.com/dag/vim2hs) 

</div>
You might wanna do a `git pull` on some of the plugins inside `.vim/bundle`.

---

## Some scripts {#scripts}

<div markdown="1" class="resources-list">
- [curlwc.sh](files/curlwc.sh):
This script uses [curl(1)](http://linux.die.net/man/1/curl) to download the target file in parts. Not very robust.
- [mtcd.sh](files/mtcd.sh):
This script mounts all arguments in directories within `~/cdrom` (as ISO9660 images), and also handles unmounting.
</div>

These and more can be found on my [Github scrips repo](https://github.com/murukeshm/scripts).
</div>

<div markdown="1" class="section">
## [A Cann Table][cann-table] {#cann}

{% include_relative cann-table.html %}

I have followed the banding used by [@7amkickoff][7amkickoff].
This table is updated weekly via a cronjob.  
The data is scraped from [the PL site][epl]
without any permission.  
Hopefully this will count as personal use. :)

[cann-table]: http://www.sussex.ac.uk/Users/iane/cannyclubs.php
[7amkickoff]: http://www.7amkickoff.com/2012/cann-tables-show-the-gap-between-arsenal-and-the-top-is-smaller-than-you-think/
[epl]: http://www.premierleague.com/en-gb/matchday/league-table.html
</div>
