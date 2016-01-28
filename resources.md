---
title: Resources
pagestyle: cann-table
permalink: /resources/
---
# Vim: `vimrc` and plugins [CSE Git](https://git.cse.iitb.ac.in/murukesh/vimrc) [Github](https://github.com/murukeshm/vimrc) {#vim}

<div markdown="1" id="plugins-list">

Currently contains a nifty `vimrc`, and some plugins:

- [Pathogen](http://www.vim.org/scripts/script.php?script_id=2332) 
- [supertab](https://github.com/ervandew/supertab)
- [syntastic](https://github.com/scrooloose/syntastic)
- [YouCompleteMe](https://github.com/Valloric/YouCompleteMe.git)
- [vim-airline](https://github.com/bling/vim-airline)
- [ctrlp.vim](https://github.com/ctrlpvim/ctrlp.vim.git)
- [diffchar.vim](https://github.com/vim-scripts/diffchar.vim)
- [molokai](https://github.com/tomasr/molokai.git)
- [nerdtree](https://github.com/scrooloose/nerdtree.git)
- [tabular](https://github.com/godlygeek/tabular.git)
- [tagbar](https://github.com/majutsushi/tagbar.git)
- [vim-fugitive](https://github.com/tpope/vim-fugitive.git)
- [vim-go](https://github.com/fatih/vim-go.git)
- [vim-markdown](https://github.com/gabrielelana/vim-markdown)
- [vim-surround](https://github.com/tpope/vim-surround.git)
- [vimtex](https://github.com/lervag/vimtex)
- [vim2hs](https://github.com/dag/vim2hs)

</div>

Old plugins:

- [vim-colorschemes](https://github.com/flazz/vim-colorschemes.git) - replaced with just the `molokai` scheme
- [eregex.vim](https://github.com/othree/eregex.vim.git) - didn't use it enough
- [ctrlp.vim](https://github.com/kien/ctrlp.vim) - superseded by `ctrlp/ctrlp.vim`
- [LaTeX-Box](https://github.com/LaTeX-Box-Team/LaTeX-Box.git) - superseded by `vimtex`

You might wanna update some of the plugins inside `.vim/bundle`:

    git submodule update --remote --recursive --init 

**Bonus**: My dotfile repos [CSE Git](https://git.cse.iitb.ac.in/murukesh/home)

<!-- section -->

# Some scripts {#scripts}

- [`curlwc.sh`](https://github.com/murukeshm/scripts/blob/master/curlwc.sh):
This script uses [curl(1)](http://manpages.ubuntu.com/curl.1) to download the target file in parts. Not very robust.
- [`mtcd.sh`](https://github.com/murukeshm/scripts/blob/master/mtcd.sh):
This script mounts all arguments in directories within `~/cdrom` (as ISO9660 images), and also handles unmounting.

These and more can be found on my scripts repo. [Github](https://github.com/murukeshm/scripts)

<!-- section -->

# CV [CSE Git](https://git.cse.iitb.ac.in/murukesh/cv)
A CV template in LaTeX (modified from one obtained online, original included):  

- (outdated) tarball: [CV-LaTeX.tar.gz]({{ site.base-url }}/files/CV-LaTeX.tar.gz)

<!-- section -->

# [A Cann Table][cann-table] {#cann}

<div id="cann-table-area">
{% include_relative cann-table.html %}
</div>

I have followed the banding used by [@7amkickoff][7amkickoff].  This table is
updated weekly via a cronjob.  The data is scraped from [the PL site][epl]
without any permission.  Hopefully this will count as personal use. :)

[cann-table]: http://www.sussex.ac.uk/Users/iane/cannyclubs.php
[7amkickoff]: http://www.7amkickoff.com/2012/cann-tables-show-the-gap-between-arsenal-and-the-top-is-smaller-than-you-think/
[epl]: http://www.premierleague.com/en-gb/matchday/league-table.html
