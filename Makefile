BROWSERIFY = node_modules/.bin/browserify
UGLIFY = ./node_modules/.bin/uglifyjs

all: assets/site.js

dist:
	mkdir -p assets

assets/site.js: $(shell $(BROWSERIFY) --list index.js)
	$(BROWSERIFY) index.js > $@

clean:
	rm -f assets/site.js