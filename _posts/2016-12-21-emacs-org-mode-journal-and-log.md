---
layout: post
title: Going paperless, replacing my notebooks and journals with 1's and 0's
author: Aqeel Akber
comments: true
date: 2016-12-21 15:00 +1000
mathjax: false
tags:
  - lifehack
  - emacs
---

The motivation is always clear but the execution almost always falls
short. At least, that has been my experience with trying to go
paperless in the past. I just couldn't find anything that could beat
the simple, intuitive, and fast user experience of picking up a pen
and scribbling in a hard covered notebook.

Not only is paper easy to use for the person creating the material, it
is also easy to share, or keep secure. But, *"insert all obvious
motivations for going paperless"*, so I rolled my own solution that
addresses the above shortcomings. I have been using this setup for 8
months now with mostly positive results, this is the full story.

### What is it?

As simple as pen and paper but not, then what is it?  I mostly use
paper to write and read words and numbers--isn't it obvious that plain
text files the answer? I usually have a different book for each
topic--easy, I just need a folder for each book. I usually rule off or
start a new page for each day--again easy, a file for each day. That's
the back end sorted: easy to write, easy to read, easy to share. Now
how do I make interacting with it just as easy?

### Making it natural

At this point I must mention that having my computer at hand is as
natural to me as having a paper and pen. Enter
[emacs](https://www.gnu.org/software/emacs/), a (great) text editor
that is free, extensible, and customizable. An obvious solution, a
text editor as a front end to a collection of text files. There's one
more thing though, and that's a feature of emacs itself; [org
mode](http://orgmode.org/) is what's called a "major mode" that comes
with emacs. Skip the technicalities, it's what gives you all the fancy
features that are part of the *"obvious motivations for going
paperless"* but still using plain text files.

Both emacs and org mode are mature and [philosophically free
software](https://www.gnu.org/philosophy/free-sw.html), I have no
hesitation intimately integrating them into my life. This is quite
important to me, as anyone who writes their thoughts on paper a lot
would tell you--a rapport between you and your notebook and pen
grows. Also related is the encoding of the plain text files, after
all--I am actually storing 1's and 0's now, they just happen to look
like letters when decoded in a certain way. I am happy to use the ever
ubiquitous UTF-8 encoding standard, 10, 20, 30 years down the track I
or someone else could probably make whatever machines we would be
using by then decode this format.

# Setting it up

Some setup is required of both emacs and org mode before becomes the
paperless solution of my dreams. Luckily, [Howard Abrams has done most
the work](http://howardism.org/Technical/Emacs/journaling-org.html), I
have built and modified this setup to behave how I described above
i.e. emulating the paper experience.

For reference, when hotkeys are mentioned `C`, `M`, and `S` correspond
to Control, Meta (alt), and Super (win key) respectively. Here on in,
I assume you have emacs installed and functioning. I am using a
GNU/Linux based operating system, however it should be operating
system agnostic up to file paths.

### Two files for clarity

I use two configuration files: `~/.emacs.d/init.el` for global emacs
settings and `~/.emacs.d/modules/org-init.el` for my org mode
settings. I have separated them for clarity only. The following code
snippets go in these files.

#### `~/emacs.d/init.el`

Starting with the aesthetics, first and foremost, I want emacs to be
less distracting.

``` elisp
;; Disable the toolbar/menu/scrollbar/tooltips
(tool-bar-mode -1)
(menu-bar-mode -1)
(scroll-bar-mode -1)
(tooltip-mode -1)

;; Disable the welcome, give me scratch space
(setq inhibit-startup-screen 1)
```

Just me and the words now. You can always access the menu by `C-<mouse
2>` i.e. control + right click, inside the emacs window. Next, I
prefer to write on ruled paper.

``` elisp
;; Line highlighting/numbering
(global-linum-mode 1)
(global-hl-line-mode 1)
```

Furthermore, when nearing the end of a line, wrapping at the word is a
lot more natural.

``` elisp
;; Natural reading, wrap at the word
(setq-default word-wrap 1)
```

When I am writing a paragraph in emacs I "manually" force the text
onto the next line if it extends beyond 72 characters wide. I do this
with the `M-q` keybinding. I think of it like the carriage return on a
mechanical typewriter, I want my notes and journal entries to always
fit within a certain width "paper". That's the aesthetic side of
things sorted, apart from a colour theme of your choice, it now gets a
little more interesting.

Part of being a scientist is being honest, transparent, and
accountable about of thoughts, methods, and results to myself and to
others. Discipline and trust has traditionally made a paper log book
with entries written in indelible more than good enough for this
purpose. In digital document there is no such security--files can be
overwritten and you could find it very difficult to determine if it
was edited, let alone what was changed. However, this ease of editing
also means that the records can be re-written to be more clear and
ultimately of higher quality.

A simple solution to this problem is to keep a record of the changes,
and the simplest way to do that just keep a backup of each file when
it's edited. Sure, it'll take up more space but disk is cheap and
plain text is easily compressible.

``` elisp
;; Change backup settings
(setq version-control t        ;; OpenVMS-esque
      backup-by-copying t      ;; Copy-on-write-esque
      kept-new-versions 64     ;; Indeliable-ink-esque
      kept-old-versions 0      ;;
      delete-old-versions nil  ;;
      )
(setq backup-directory-alist   ;; Save backups in $(pwd)/.bak
      '(("." . ".bak"))        ;;
      )
```

With this configuration, emacs will keep up to 64 previous iterations
of a file instead of overwriting it and losing all the existing
information. The backed up versions are saved in a hidden folder
created called `.bak` at the location of the file. Of course this
isn't bulletproof accountability, trust and discipline is still
necessary and must be accepted.

For sensitive notes and journal entries, I want to employ
encryption. Auto-saving is a security hazard for these files as it
will write a decrypted version of the file temporarily to disk.

``` elisp
;; Disable auto-saving
(setq auto-save-default nil)
```

Now, moving onto configuring org mode, I need to tell emacs where this
other file is.

``` elisp
;; Load other module / package settings
(add-to-list 'load-path "~/.emacs.d/modules")
(load-library "org-init")
```

All the above can be put in your `~/emacs.d/init.el` file in any order
and along with other code.

#### `~/.emacs.d/modules/org-init.el`

Moving on, first some key bindings for use later, enable encrypted
files support, UTF-8 encoding, and some minor (optional) usability
features.

``` elisp
;; Initialize Org Mode
(require 'org)

;; Simple org key bindings
(define-key global-map "\C-cl" 'org-store-link)
(define-key global-map "\C-ca" 'org-agenda)
(setq org-log-done t)

;; ------------------------
;; ADVANCED CUSTOMISATION !
;; ------------------------

;; Enable symmetric encrpytion support
(require 'org-crypt)
(setq epg-gpg-program "gpg2")
(org-crypt-use-before-save-magic)
(setq org-tags-exclude-from-inheritance (quote ("crypt")))
;; GPG key to use for encryption
;; Either the Key ID or set to nil to use symmetric encryption.
(setq org-crypt-key nil)

;; Set the encoding to utf-8
(setq org-export-coding-system 'utf-8)
(prefer-coding-system 'utf-8)
(set-charset-priority 'unicode)
(setq default-process-coding-system '(utf-8-unix . utf-8-unix))

;; Don't allow editing of folded regions
(setq org-catch-invisible-edits 'error)

;; Start the weekly agenda on Monday
(setq org-agenda-start-on-weekday 1)

;; Enable indentation view, does not effect file.
(setq org-startup-indented t)
```

Not everything can be described in plain text, however using org mode
human readable soft links are supported; thus, attachments are
supported as soft links to an external file. I like to make org mode
copy any attachment into a folder called `attach` that gets created
along side the plain text file.

``` elisp
;; Make attachments be copied / assigned a uuid
;; and placed in a appropiate folder
(setq org-id-method (quote uuidgen))
(setq org-attach-directory "attach/")
```

This is the part we've all been waiting for--making opening a plain
text file as intuitive as opening a book onto a new page. Edit the
variables `journal-author`, `journal-base-dir`, and `journal-books`
here to suit your needs.

``` elisp
;; ----------------
;; JOURNAL SYSTEM !
;; ----------------

;; SETUP A ROBUST / GENERAL JOURNAL SYSTEM
;; I have modified this from:
;; http://www.howardism.org/Technical/Emacs/journaling-org.htm
;; Aqeel Akber, 2016 (@AdmiralAkber)

;; Author name to be auto inserted in entries
(setq journal-author "Aqeel Akber")

;; This is the base folder where all your "books"
;; will be stored.
(setq journal-base-dir "~/ORG/")


;; These are your "books" (folders), add as many as you like.
;; Note: "sub volumes" are acheivable with sub folders.
(setq journal-books '("nuclphys"
          "nuclphys/labr"
          "personal"
          "saferad"))

;; Functions for journal
(defun get-journal-file-today (book)
  "Return today's filename for a books journal file."
  (interactive (list (completing-read "Book: " journal-books) ))
  (expand-file-name
   (concat journal-base-dir book "/J"
     (format-time-string "%Y%m%d") ".org" )) )

(defun journal-today ()
  "Load todays journal entry for book"
  (interactive)
  (find-file (call-interactively 'get-journal-file-today)) )

(defun journal-entry-date ()
  "Inserts the journal heading based on the file's name."
  (when (string-match
   "\\(J\\)\\(20[0-9][0-9]\\)\\([0-9][0-9]\\)\\([0-9][0-9]\\)\\(.org\\)"
   (buffer-name))
    (let ((year  (string-to-number (match-string 2 (buffer-name))))
          (month (string-to-number (match-string 3 (buffer-name))))
          (day   (string-to-number (match-string 4 (buffer-name))))
          (datim nil))
      (setq datim (encode-time 0 0 0 day month year))
      (format-time-string "%Y-%m-%d (%A)" datim))))

;; Auto-insert journal header
(auto-insert-mode)
(eval-after-load 'autoinsert
  '(define-auto-insert
     '("\\(J\\)\\(20[0-9][0-9]\\)\\([0-9][0-9]\\)\\([0-9][0-9]\\)\\(.org\\)" . "Journal Header")
     '("Short description: "
       "#+TITLE: Journal Entry - "
       (car
  (last
   (split-string
    (file-name-directory buffer-file-name) "/ORG/"))) \n
       (concat "#+AUTHOR: " journal-author) \n
       "#+DATE: " (journal-entry-date) \n
       "#+FILETAGS: "
       (car
  (last
   (split-string
    (file-name-directory buffer-file-name) "/ORG/"))) \n \n
       > _ \n
       )))

;; Journal Key bindings
(global-set-key (kbd "C-c j") 'journal-today)
```

There is one more thing left to do, make org mode aware of the files
stored in these folders. Remember those fancy features? This enables
it and that's the setup done.

``` elisp
;; Set Org directories [Remember to update with journal books]
(setq org-agenda-files (list "~/ORG/nuclphys"
           "~/ORG/nuclphys/labr"
           "~/ORG/personal"
                             "~/ORG/saferad"))
```

# Usage and workflow

The crux of this system relies on emacs and org-mode, both of which
are very well documented. What I have focused on describing in this
section is the small subset of capabilities that are relevant to this
article. If it looks like something you like, then I strongly
encourage you look up other org-mode tutories to get a taste of what
else can be done.

### Quick start

In the video:

* Open book, `personal`, to today's page `C-c j`
* Insert a header as file hasn't been created yet `y`
* Add a entry headline by starting line with *
* Clock in `C-c C-x C-i`
* Expanded "LOGBOOK" `TAB`
* Moved to end of file `M->`
* Forced wrap on final sentence `M-q`
* Clock out `C-c C-x C-o`
* Saving `C-c C-s`
* Exit emacs `C-c C-x`

<script type="text/javascript"
src="https://asciinema.org/a/50dizk0qx6t9eyv85dy5g7jvn.js"
id="asciicast-50dizk0qx6t9eyv85dy5g7jvn" async></script>

### Searching

In the video:

* Open `org-agenda` with `C-c a`
* Select search with `s`
* Type keyword/regex pattern and press `RET`
* Select file from the list to open it, or press `x` to exit the search.

<script type="text/javascript"
src="https://asciinema.org/a/849yxsk7bo4ow6drdhuqs8j1q.js"
id="asciicast-849yxsk7bo4ow6drdhuqs8j1q" async></script>

I didn't open any files in the video for privacy reasons. The point of
notice is that org-mode can actually search through the body of your
files.

### Tasks

Now that you know the basics, let's get fancy. This may be a
little complicated at first, the basic principle is that org-mode will
treat any headlines in your files that start with "TODO" or "DONE" as
special items. These then can be listed elegantly with
`org-agenda`. Other than that, you can treat these entries like any
other.

In the video:

* Toggled a headline into a TODO item with `C-c C-t`
* Added a deadline with `C-c C-d`
* You can also just manually type TODO at the start of a headline.
* Clocking in / Clocking out is always good. I could write the whole
  paper here.
* `Shift-TAB` can toggle visibility of all headlines, or `TAB` on a
  single one.
* Saved the file, and closed the buffer with `C-x k RET`
* Now entering `org-agenda` but pressing `t` shows TODO items
* Selecting an item and pressing `t` toggles its completion status
* As usual, `x` to quit `org-agenda` and saved any changes
* Back to `org-agenda` press `a` to get the agenda for the current
  week. Use `f` and `b` to go forward / back a week.
* Selecting the file and pressing `RET` opens it, use `C-x 1` to
  get rid of the split buffer.

<script type="text/javascript"
src="https://asciinema.org/a/c559z4a318knm9laii83oa6zc.js"
id="asciicast-c559z4a318knm9laii83oa6zc" async></script>

### Password protection / Encryption

A very handy feature and very easy to use.

In the video:

* Added a sub-heading by using ** (you can do this anywhere)
* Put the magic words `:crypt:` at the end of the headline
* Saved the file, followed the prompts for a password, closed emacs.
* Shown that the file is indeed encrypted on disk
* Opened file and decrypted the headline with `M-x org-decrypt-entry`
* Can now view and edit as per normal, upon saving it encrypts again.

<script type="text/javascript"
src="https://asciinema.org/a/303jfq2q6mqyopoxyii93ybx8.js"
id="asciicast-303jfq2q6mqyopoxyii93ybx8" async></script>

### Attachments / Cross-links

This really doesn't need a video, just press `C-c C-a` in any org-mode
file and follow the prompts to add an attachment. For cross-links,
select any headline and press `C-c l` to store a link, then `C-c C-l`
to paste it in another org-mode file. To follow any of these links use
the binding `C-c C-o`

### Other tips

#### Make lots of books!

It costs nothing and will make your life easier. Have a book
specifically for conferences, make a new one for each project. It'll
make your life easier when you're trying to look up past entries.

#### Keep customizing emacs!

Make it your own, enjoy it! There are thousands of packages available
on [MELPA](https://melpa.org/). You can install them directly from
within emacs with `list-packages`, and all of the ones that I've tried
have been awesome. My favourite one that might be relevant to mention
here is `org-gcal`. This synchronized my google calendar into an
org-mode file, I can then view it via the org agenda. Other favourites
of mine that you have seen in the vidoes are `company` (auto
completion) and `helm` (fancy `M-x`).


# Conclusions

As I said earlier, I have been using this setup for 8 months. I can
comfortably say it has completely replaced paper for my memoirs and
has encouraged good habits. For a replacement to my science log book,
I would say it has been about 90% successful. It fails in two things,
mathematics and sketching. Yes, [org-mode does support
LaTeX](http://orgmode.org/manual/LaTeX-fragments.html) and there is
[Artist mode](https://www.emacswiki.org/emacs/ArtistMode) but it's not
quite as good as paper and pen, yet. Other than that, I'm paperless.

### Contact Aqeel

Find me on [twitter](https://twitter.com/AdmiralAkber) or leave a
comment below.
