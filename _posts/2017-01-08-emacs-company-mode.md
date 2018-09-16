---
layout: post
title: Auto complete anything with company mode
author: Aqeel Akber
comments: true
date: 2017-01-08 22:30 +1100
mathjax: false
tags:
  - emacs
---

This post is in response to a [comment left on my last emacs
post](http://disq.us/p/1f0dxx9) regarding my auto completion
setup, which is visible in the screencasts.

The setup is simple with a few quirks. At the crux of it is
`company-mode`. As usual, I use two configuration files:
`~/emacs.d/init.el` and
`~/.emacs.d/modules/company-mode-init.el`. This makes managing
different emacs modules a lot easier.

### `~/.emacs.d/init.el`

The emacs package manager makes installing `company-mode` a piece of
cake. I personally like using the slightly more experimental
[MELPA](https://melpa.org/) rather than the standard
[ELPA](https://elpa.gnu.org/) repository. The best way I've found to
use the package manager is to run `M-x list-packages` within emacs or
via the code below.

```elisp
;; --------------------
;; PACKAGES / MODULES !
;; --------------------

;; Load package manager / packages
(require 'package)
(add-to-list 'package-archives
	     '("melpa" . "http://melpa.org/packages/"))
(package-initialize)

;; Make sure the packages I want are installed
(setq my-package-list '(company <<+ other (M)ELPA packages>> ))
(mapc #'package-install my-package-list)
```

Next, you need to let emacs know where these extra configuration files
are and load it.

```elisp
;; Load other module / package settings
(add-to-list 'load-path "~/.emacs.d/modules")
(load-library "company-mode-init")
```

### `~/emacs.d/modules/company-mode-init.el`

Even though I rarely use auto complete unless coding, I enjoy seeing a
list of items appear as I type. Typing at 100+ WPM (broke the barrier
after recently switching to the Colemak keyboard layout!) means I
don't want any delay before suggestions appear. This is a combination
of changing the idle time delay and the amount of prefix characters
before showing suggestions.

```elisp
;; Intialize Company Mode
(add-hook 'after-init-hook 'global-company-mode)

(setq company-idle-delay 0)
(setq company-minimum-prefix-length 2)
```

That would be enough for most people, but I also use another emacs
module called `yasnippet` that conflicts with auto complete expansion
as it stands. To work around this, I found the following bit of code
makes everything work as expected.

```elisp
(defun check-expansion ()
  (save-excursion
    (if (looking-at "\\_>") t
      (backward-char 1)
      (if (looking-at "\\.") t
	(backward-char 1)
	(if (looking-at "->") t nil)))))

(defun do-yas-expand ()
  (let ((yas/fallback-behavior 'return-nil))
    (yas/expand)))

(defun tab-indent-or-complete ()
  (interactive)
  (if (minibufferp)
      (minibuffer-complete)
    (if (or (not yas/minor-mode)
	    (null (do-yas-expand)))
	(if (check-expansion)
	    (company-complete-common)
	  (indent-for-tab-command)))))


(global-set-key [tab] 'tab-indent-or-complete)
```

### Contact Aqeel

Find me on [twitter](https://twitter.com/AdmiralAkber) or leave a
comment below.
