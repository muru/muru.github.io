The site is written for Jekyll as used by Github Pages, and that is installed
on mars. The site used to be updated on www.cse.iitb.ac.in using:

```sh 
cd ~/devel/web && 
  /usr/local/bin/jekyll build -d /users/pg13/murukesh/public_html -w --config _config.yml,_sitename.yml
```

Now, I just rely on Gitlab. The CSE homepage redirects to my main site using a
simple `.htaccess`:

    Redirect 301 /~murukesh/ https://murukesh.me/

---

`_sitename.yml` is a way of tricking Jekyll into adding a `base-url` to
the generated URLs.  On Github, the file isn't read and `base-url` is
empty, leading to absolute URLs from the root of the site. On the CSE
home folder, `_sitename.yml` defines `base-url` to be `~murukesh`,
making the URLs relative to my home directory.

----

The site was originally tested in Firefox 22.0 (Desktop), Chrome 28.0
(Desktop), Chrome 28.0 (Android 4.3), Firefox 22.0 (Android 4.3), Opera
Mini 7.5 (Android 4.3). Opera Mini faired well, but missed a few steps.
Probably won't work well in IE < 9. Now I just look at it occasionally on
Chrome on Ubuntu and my Nexus 5.

---

The weird font sizes on Chrome and Firefox on Android are due to font
boosting. I'll keep it enabled because it does vastly improve
legibility, and also fits the page (horizontally) within the screen.  To
disable it, add this meta tag to the head element in each page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Or, alternatively:

```html
<meta name="HandheldFriendly" content="true">
```
