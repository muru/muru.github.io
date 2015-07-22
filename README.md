The site has been tested in Firefox 22.0 (Desktop), Chrome 28.0
(Desktop), Chrome 28.0 (Android 4.3), Firefox 22.0 (Android 4.3), Opera
Mini 7.5 (Android 4.3). Opera Mini faired well, but missed a few steps.
Probably won't work well in IE < 9.

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

The site is written for Jekyll as used by Github Pages, and that is
installed on mars. The site is updated using:

```sh 
cd ~/devel/web && /usr/local/bin/jekyll build -d
/users/pg13/murukesh/public_html -w --config _config.yml,_sitename.yml
```

`_sitename.yml` is my way of tricking Jekyll into adding a `root_url` to
the generated URLs.  On Github, the file isn't read and `root_url` is
empty, leading to absolute URLs from the root of the site. On the CSE
home folder, `_sitename.yml` defines `root_url` to be `~murukesh`,
making the URLs relative to my home directory.
