build:
	rm -rf dist
	tsc
	cp README.md dist/

rc: build
	node ./configs/pkg.rc.js

publish: build
	node ./configs/pkg.publish.js