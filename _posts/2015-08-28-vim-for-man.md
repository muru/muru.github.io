---
layout: post
title: Vim as $MANPAGER
tags: [vim, config]
---

Long, long ago, in a hostel room far, far away, I once read about using Vim as
the pager for `man`. It involved using some script which made `vim` behave like
`less` (or something like that). I'd stumbled upon it while trying to make
reading manpages more comfortable, with syntax colouring, navigation, etc.

Of late, with [Vim.SE] for support, I've been customizing Vim more and more.
I've made a Git repo of my Vim files, taken baby steps in automating tasks I
often do, and so on. While looking through the recent posts in [Unix.SE], I came
across [this post][1] which suggested using your editor as the pager. That
kicked up the dusty cobwebs in my decrepit memory module, and I remembered that
old attempt at using Vim for reading manpages. So, I set about trying to make
Vim `man`'s pager. Why did I submit myself to such cruel and unusual punishment?

1. I *like* Vim.
2. I have it customized to my liking.
3. It is powerful. The search is way better than anything `less` or your average
   manpage browser (like `yelp`) can offer.
4. It can browse to other manpages mentioned using tag navigation (`<c-]>`,
   `<c-t>`).

The post suggested setting `$MANPAGER` to a combination of `col` and `vim`:

	export MANPAGER="col -b | vim -c 'set ft=man nomod nolist ignorecase' -"

For decidedly non-obvious reasons, it's not likely to work for you. Why?
Because GNU `man` doesn't support piped commands in `$MANPAGER` -- BSD's `man`
does (that's +1 for you OSX folks). From [`man man`][man]:

<pre><code>MANPAGER, PAGER
   If $MANPAGER or $PAGER is set ($MANPAGER is used in preference),
   its value is used as the name of the program used to display the
   manual page.  By default, pager -s is used.

   The  value  may  be  a  simple  command  name  or a command with
   arguments,  and  may  use  shell  quoting  (backslashes,  single
   quotes,  or  double  quotes).   <strong>It  may not use pipes to connect
   multiple commands</strong>; if you need that, use a wrapper script, which
   may  take  the  file  to  display  either  as  an argument or on
   standard input.
</code></pre>

I tried the suggested solution (using a wrapper script), which worked fine.
However, it created a problem: I use Git to manage my dotfiles. I'd rather *not*
rely on stuff outside the repo. Stuff installed by package managers and
differences per distro are a fact of life and have to be handled, but I'd rather
not take pains over what I add to it. One obvious solution is to wrap the
command in `sh -c`:

```sh
MANPAGER='sh -c "col -b | vim -c \'set ft=man nomod nolist ignorecase\' -"'
```

**Ugly.** I also hate having to deal with quoting.

<!-- section -->

At this point, it struck me: Why should I run this via a pipe? Once Vim starts,
I can perfectly well use `%! col -b` to do the job. So:

```sh
MANPAGER='vim -c "%! col -b" -c "set ft=man nomod nolist ignorecase" -'
```
Nice!

Now, other considerations started popping up. You can easily quite `less` (and
by extension, `man`), by pressing <kbd>q</kbd>, or <kbd>Ctrl</kbd><kbd>C</kbd>.
Vim usually considers a buffer read from `stdin` to be modified. Therefore, to
quit a manpage, you'd have to do `:q!`, not just `:q`. Thankfully, one of the
options set ([`nomod`][nomod]) tells Vim that the buffer hasn't been modified.
Therefore, we can just use `:q`:

```vim
nnoremap q :q<CR>
```

Other considerations arise:

- The buffer is modifiable. There's no reason for it to be so.
- The buffer doesn't have a name. It would be convenient to see the name of the
  manpage.
- You don't want swapfiles hanging around from manpages.

As I pondered over this, I realised that these are settings I'd want to apply to
a manpage no matter how I opened it. Hence, they should really be in Vim's
filetype settings for `man`. So, I created a `~/.vim/ftplugin/man.vim`,
containing:

{% highlight vim linenos %}
function! PrepManPager()
	if !empty ($MAN_PN)
		silent %! col -b
		file $MAN_PN
	endif
	setlocal nomodified
	setlocal nomodifiable
	setlocal readonly
	setlocal nolist
	setlocal noswapfile
endfunction
autocmd VimEnter * PrepMan()
{% endhighlight %}

I picked [`VimEnter`][vimenter] since it runs after any commands specified using
`-c` are run, so I can get it to run after the filetype has been set.

However, I realised that:

- I wanted to apply some of these settings to manpages irrespective of how they
  were opened; and
- I'd rather not specify `set ft=man` from the command line, keeping an eye on
  using Vim as a general-purpose pager;
- Using `VimEnter *` felt *wrong*.

A bit of experimentation later, I found that:

1. `man` doesn't seem to ever provide a filename as an argument, irrespective of
   what the manpage says.
2. `man` sets `MAN_PN` to the manpage name (`man(1)`, for example)

<aside markdown="1">
Git does something similar. When opening logs via `PAGER='vim -' git log`, for
example, you'll find that an environment variable name `GIT_PREFIX` exists
(though, oddly enough, possibly empty).
</aside>

<!-- section -->

Knowing that I'm reading from `stdin` and that `MAN_PN` is set (to the manpage
name!), I came up with this version:

{% highlight vim linenos %}
" vimrc
if !empty($MAN_PN)
	autocmd StdinReadPost * set ft=man | file $MAN_PN
endif

" ftplugin/man.vim
setlocal nolist
setlocal readonly
setlocal buftype=nofile
setlocal bufhidden=hide
setlocal noswapfile
setlocal nomodifiable

function! PrepManPager()
	setlocal modifiable
	if !empty ($MAN_PN)
		silent %! col -b -x
	endif
	setlocal nomodified
	setlocal nomodifiable
endfunction

autocmd BufWinEnter $MAN_PN call PrepManPager()
nnoremap q :qa<CR>
nnoremap <Space> <PageDown>
map <expr> <CR> winnr('$') == 1 ? ':vs<CR><C-]>' : '<C-]>'
{% endhighlight %}

with:
```sh
MANPAGER="vim -"
```
Beautiful!

What does this do?

1. In the main `vimrc`, I check if I'm reading from `stdin` and if `MAN_PN` is
   set. If so, set the filetype to `man` *and the filename to the contents of
   `MAN_PN`*.
2. In the filetype-specific setting, use an `autocmd` the relies on the filename
   being `$MAN_PN` to apply `col -b`.
3. Set `nomodified` to tell Vim that the buffer hasn't been modified, and
   make it a read-only, non-modifiable, scratch buffer.
4. Also, map `q` to `:qa`, so that I can quit all opened manpages, and
   <kbd>Space</kbd> to <kbd>Page&nbsp;Down</kbd>, in keeping with the usual behaviour
   of `less`.
5. `col -b`'s use of tabs led to messed up alignment. I had to use `-x` (replace
   tabs with spaces) so that, for example, `man ascii` showed up properly.

Finally, `man man` opens up pretty much as I'd like it to.

Why "pretty much"? `man` obeys `MANWIDTH`, so I can get a manpage formatted
exactly as wide as I want. If open a manpage within Vim, however (by navigating
the tags, for example), the page is formatted for the full width of Vim. :(
Secondly, Vim leaves this annoying message:

```
$ man man
Vim: Reading from stdin...

$
```

For the moment, I've adopted the decidedly un-Vim-like solution of opening a
split before navigating to any tags - half the terminal width is fine for me.
That's what the last mapping in the above snippet does: check if I have only one
window open, and if so, open a new window before jumping to the tag - with the
added benefit using to the thoroughly intuitive (to me) <kbd>Enter</kbd> key for
jumping to the named page. As a happy side effect, I get to see exactly where I
was in the new window! :)

I have no idea how to suppress the `stdin` message from Vim itself.

---
All told:

[![man in Vim][man-in-vim]][man-in-vim]

---

<!-- section -->

## Footnote

This is my first blog post using [Jekyll](http://jekyllrb.com/). Writing it, I
have learned quite a bit, which I will write about in another post soon.

 [Unix.SE]: http://unix.stackexchange.com
 [Vim.SE]: http://vi.stackexchange.com
 [man]: http://man7.org/linux/man-pages/man1/man.1.html
 [1]: http://unix.stackexchange.com/a/1853/70524
 [nomod]: http://vimhelp.appspot.com/options.txt.html#%27nomod%27
 [vimenter]: http://vimhelp.appspot.com/autocmd.txt.html#VimEnter
 [man-in-vim]: {{ site.base-url }}/images/vim-man.png
