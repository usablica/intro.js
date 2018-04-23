#!/bin/bash

#
# Script for releasing new versions
# Handles version updating and publishing to:
# 	- GitHub 
#
# TODO:
#	- Publish to npm
#	- Publish to bower
#

# check package version
VERSION=$(node --eval "console.log(require('./package.json').version);")

LAST=$(git describe --abbrev=0)

if [[ v$VERSION == $LAST ]]; then
	echo "Update version in package.json!"
	exit 1
fi

# check javascript version
VERSION=$(node --eval "console.log(require('./intro.js').version);")

if [[ v$VERSION == $LAST ]]; then
	echo "Update version in ./intro.js!"
	exit 1
fi

npm test || exit 1
npm run minify

echo "New Version: $LAST => v$VERSION"
echo "---"
echo "Add a comment?"
read comment

if [[ $comment ]]; then
	git commit -am "v$VERSION - $comment"
	git tag -a v$VERSION -m "$comment" -f
else
	git commit -am "v$VERSION"
	git tag v$VERSION -f
fi
	
git push --tags -f
git push