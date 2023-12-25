---
title: Resources
pagestyle: cann-table
permalink: /resources/
description: General stuff
---
# Home: dotfiles, including `.vim` and plugins [![gitlab]](https://git.cse.iitb.ac.in/murukesh/home){:.git} [![github]](https://github.com/muru/home){:.git} {#vim}

Currently contains a nifty `.zshrc`, `vimrc`, and some plugins:

- zsh
  - [grml](https://grml.org/zsh/grmlzshrc.html) (not a plugin *per se*)
  - [zdharma/fast-syntax-highlighting](https://github.com/zdharma/fast-syntax-highlighting)
  - [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
- vim
  - [vim-plug](https://github.com/junegunn/vim-plug)
  - [ctrlp.vim](https://github.com/ctrlpvim/ctrlp.vim.git)
  - [molokai](https://github.com/tomasr/molokai.git)
  - [supertab](https://github.com/ervandew/supertab)
  - [syntastic](https://github.com/scrooloose/syntastic)
  - [tabular](https://github.com/godlygeek/tabular.git)
  - [vim-airline](https://github.com/bling/vim-airline)
  - [vim-fugitive](https://github.com/tpope/vim-fugitive.git)
  - [vim-go](https://github.com/fatih/vim-go.git)
  - [vim-markdown](https://github.com/gabrielelana/vim-markdown)
  - [vim-surround](https://github.com/tpope/vim-surround.git)
  - and others &hellip;
  {: #plugins-list}

In addition, I wrote my own plugin for using [Vim as a
`MANPAGER`](/2015/08/28/vim-for-man.html): [vim-manpager](https://github.com/muru/vim-manpager).

Setting up usually goes:

1. Clone to a folder, say `~/home` (recursively, so that the zsh plugin is pulled in)
2. Copy files from there: `cp ~/home/. ~/ -ar`

Once done:

    vim -c PlugUpdate

And optionally:

    vim -c PlugUpgrade

The `.vim` used to be in a separate repo, then I merged it into home.

<!-- section -->

# Some scripts {#scripts}

Some utility scripts I wrote can be found on my scripts repo. [![github]](https://github.com/muru/scripts){:.git}

<!-- section -->

# CV
A CV template in LaTeX (modified from one obtained online), then re-written in Markdown:
[![gitlab]](https://gitlab.com/murukesh/cv){:.git}

<!-- section -->

# [A Cann Table][cann-table] {#cann}

<div id="cann-table-area">
{% include_relative cann-table.html %}
</div>

I have followed the banding used by [@7amkickoff][7amkickoff].  This table will
be updated during the season. The data is scraped from [BBC][bbc]
without any permission. Hopefully this will count as personal use. :)

[cann-table]: https://www.sussex.ac.uk/Users/iane/cannyclubs.php
[7amkickoff]: http://www.7amkickoff.com/2012/cann-tables-show-the-gap-between-arsenal-and-the-top-is-smaller-than-you-think/
[epl]: http://www.premierleague.com/en-gb/matchday/league-table.html
[bbc]: https://www.bbc.com/sport/football/tables

[gitlab]: ../images/gitlab.png
[github]: ../images/github.png
