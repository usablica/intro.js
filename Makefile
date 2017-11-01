BASE = .

.PHONY: build
build:
	cd BUILD && node BUILD.js

.PHONY: test
test:
	npm test
