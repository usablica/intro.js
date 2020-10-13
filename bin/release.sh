#!/bin/bash

set -xe

#
# Script for releasing new versions
# Handles version updating and publishing to:
# 	- GitHub
# 	- NPM
#

DIST_FOLDER="./dist"

function cleanup() {
    rm -rf "$DIST_FOLDER"
}

trap cleanup EXIT

mkdir -p "$DIST_FOLDER"
npm run build

# check package version
VERSION=$(node --eval "console.log(require('./package.json').version);")

LAST=$(git describe --abbrev=0)

if [[ v$VERSION == "$LAST" ]]; then
	echo "Update version in package.json!"
	exit 1
fi

# check javascript version
VERSION=$(node --eval "console.log(require('$DIST_FOLDER/intro.js').version);")

if [[ v$VERSION == "$LAST" ]]; then
	echo "Update version in ./intro.js!"
	exit 1
fi

npm test

# this is an attempt to preserve backward compatibility
# it can be replaced with package.json "exports" once it's stable
cp "./package.json" "$DIST_FOLDER"
cp ./*.md "$DIST_FOLDER"
cp -r "themes" "$DIST_FOLDER"

pushd $DIST_FOLDER

echo "New Version: $LAST => v$VERSION"
echo "---"

npm publish --dry-run

echo "Publish? (type yes or no)"
read confirm

if [[ $confirm == "yes" ]]; then
    echo "Publishing..."

    git tag "v$VERSION"
    git push --tags

    npm publish
else
  echo "Skipping the publish procedure"
fi

popd