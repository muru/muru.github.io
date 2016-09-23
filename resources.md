---
title: Resources
pagestyle: cann-table
permalink: /resources/
description: General stuff
---
# Vim: `vimrc` and plugins [![gitlab]](https://git.cse.iitb.ac.in/murukesh/vimrc){:.git} [![github]](https://github.com/murukeshm/vimrc){:.git} {#vim}

Currently contains a nifty `vimrc`, and some plugins:

- [vim-plug](https://github.com/junegunn/vim-plug)
- [ctrlp.vim](https://github.com/ctrlpvim/ctrlp.vim.git)
- [diffchar.vim](https://github.com/vim-scripts/diffchar.vim)
- [molokai](https://github.com/tomasr/molokai.git)
- [nerdtree](https://github.com/scrooloose/nerdtree.git)
- [supertab](https://github.com/ervandew/supertab)
- [syntastic](https://github.com/scrooloose/syntastic)
- [tabular](https://github.com/godlygeek/tabular.git)
- [tagbar](https://github.com/majutsushi/tagbar.git)
- [vim2hs](https://github.com/dag/vim2hs)
- [vim-airline](https://github.com/bling/vim-airline)
- [vim-fugitive](https://github.com/tpope/vim-fugitive.git)
- [vim-go](https://github.com/fatih/vim-go.git)
- [vim-markdown](https://github.com/gabrielelana/vim-markdown)
- [vim-surround](https://github.com/tpope/vim-surround.git)
- [vimtex](https://github.com/lervag/vimtex)
- [YouCompleteMe](https://github.com/Valloric/YouCompleteMe.git)
{: #plugins-list}

In addition, I'm writing my own plugin for using [Vim as a
`MANPAGER`](/2015/08/28/vim-for-man.html):

- [vim-manpager](https://github.com/murukesh/vim-manpager)

Old plugins:

- [Pathogen](http://www.vim.org/scripts/script.php?script_id=2332): superseded
  by `vim-plug`
- [vim-colorschemes](https://github.com/flazz/vim-colorschemes.git): replaced
  with just the `molokai` scheme
- [eregex.vim](https://github.com/othree/eregex.vim.git): didn't use it enough
- [ctrlp.vim](https://github.com/kien/ctrlp.vim): superseded by `ctrlp/ctrlp.vim`
- [LaTeX-Box](https://github.com/LaTeX-Box-Team/LaTeX-Box.git): superseded by `vimtex`

Once cloned to `~/.vim`, do:

    vim -c PlugUpdate

And optionally:

    vim -c PlugUpgrade

**Bonus**: My dotfiles repo [![gitlab]](https://git.cse.iitb.ac.in/murukesh/home){:.git}

<!-- section -->

# Some scripts {#scripts}

- [`curlwc.sh`](https://github.com/murukeshm/scripts/blob/master/curlwc.sh):
This script uses [curl(1)](http://manpages.ubuntu.com/curl.1) to download the
target file in parts. Not very robust.
- [`mtcd.sh`](https://github.com/murukeshm/scripts/blob/master/mtcd.sh):
This script mounts all arguments in directories within `~/cdrom` (as ISO9660
images), and also handles unmounting.

These and more can be found on my scripts repo. [![github]](https://github.com/murukeshm/scripts){:.git}

<!-- section -->

# CV
A CV template in LaTeX (modified from one obtained online, original included):
[![gitlab]](https://git.cse.iitb.ac.in/murukesh/cv){:.git}

- (outdated) tarball: [CV-LaTeX.tar.gz]({{ site.base-url }}/files/CV-LaTeX.tar.gz)

<!-- section -->

# [A Cann Table][cann-table] {#cann}

<div id="cann-table-area">
{% include_relative cann-table.html %}
</div>

I have followed the banding used by [@7amkickoff][7amkickoff].  This table was
updated weekly via a cronjob.  The data is scraped from [the PL site][epl]
without any permission.  Hopefully this will count as personal use. :)

I need to fix the script now that the PL site has changed. :frown:

[cann-table]: https://www.sussex.ac.uk/Users/iane/cannyclubs.php
[7amkickoff]: http://www.7amkickoff.com/2012/cann-tables-show-the-gap-between-arsenal-and-the-top-is-smaller-than-you-think/
[epl]: http://www.premierleague.com/en-gb/matchday/league-table.html

[gitlab]: ../images/gitlab.png
[github]: ../images/github.png
