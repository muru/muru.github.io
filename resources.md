---
title: Resources
pagestyle: cann-table
permalink: /resources/
---
<section markdown="1">
A CV template in LaTeX (modified from one obtained online, original included):  

- (outdated) tarball: [CV-LaTeX.tar.gz]({{ site.root_url }}/files/CV-LaTeX.tar.gz)
- [CSE Git](https://git.cse.iitb.ac.in/murukesh/cv)

</section>

<section markdown="1">
Some stuff that I drag around with me on my various Linux boxes:

## Vimrc and vim plugins {#vim}

- (outdated) tarball: [vim.tar.bz2]({{ site.root_url }}/files/vim.tar.bz2)
- [CSE Git](https://git.cse.iitb.ac.in/murukesh/vimrc)
- [Github](https://github.com/murukeshm/vimrc)

<div markdown="1" class="resources-list" id="plugins-list">

Currently contains a nifty `vimrc`, and some plugins:

- [Pathogen](http://www.vim.org/scripts/script.php?script_id=2332) 
- [diffchar.vim](https://github.com/vim-scripts/diffchar.vim)
- [eregex.vim](https://github.com/othree/eregex.vim.git)
- [nerdtree](https://github.com/scrooloose/nerdtree.git)
- [supertab](https://github.com/ervandew/supertab.git)
- [syntastic](https://github.com/scrooloose/syntastic.git)
- [vim2hs](https://github.com/dag/vim2hs)
- [vim-surround](https://github.com/tpope/vim-surround.git)
- [LaTeX-Box](https://github.com/LaTeX-Box-Team/LaTeX-Box.git)
- [ctrlp.vim](https://github.com/kien/ctrlp.vim)
- [vim-airline](https://github.com/bling/vim-airline)
- [vim-colorschemes](https://github.com/flazz/vim-colorschemes.git)
- [vim-fugitive](https://github.com/tpope/vim-fugitive.git)
- [AnsiEsc.vim](https://github.com/vim-scripts/AnsiEsc.vim)

</div>
You might wanna do a `git pull` on some of the plugins inside `.vim/bundle`:

    git submodule foreach git pull -u origin master

**Bonus**: My dotfile repos:

- [CSE Git](https://git.cse.iitb.ac.in/murukesh/home)
- [Github](https://github.com/murukeshm/home)

---

## Some scripts {#scripts}

<div markdown="1" class="resources-list">
- [curlwc.sh](files/curlwc.sh):
This script uses [curl(1)](http://linux.die.net/man/1/curl) to download the target file in parts. Not very robust.
- [mtcd.sh](files/mtcd.sh):
This script mounts all arguments in directories within `~/cdrom` (as ISO9660 images), and also handles unmounting.
</div>

These and more can be found on my [Github scrips repo](https://github.com/murukeshm/scripts).
</section>

<section markdown="1">
## [A Cann Table][cann-table] {#cann}

<div id="cann-table-area">
{% include_relative cann-table.html %}
</div>

I have followed the banding used by [@7amkickoff][7amkickoff].
This table is updated weekly via a cronjob.  
The data is scraped from [the PL site][epl]
without any permission.  
Hopefully this will count as personal use. :)

[cann-table]: http://www.sussex.ac.uk/Users/iane/cannyclubs.php
[7amkickoff]: http://www.7amkickoff.com/2012/cann-tables-show-the-gap-between-arsenal-and-the-top-is-smaller-than-you-think/
[epl]: http://www.premierleague.com/en-gb/matchday/league-table.html
</section>
