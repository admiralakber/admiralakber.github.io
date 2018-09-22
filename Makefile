#export PATH := ${HOME}/.gem/ruby/2.5.0/bin:${PATH}

site:
	jekyll build

serve:
	jekyll serve --future

clean:
	rm -rf _site

upload:
	aws s3 sync _site s3://aqeel.cc --acl public-read --delete

.PHONY:
	site clean upload
