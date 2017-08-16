#! /usr/bin/env bash
set -eu

origin=$(cd $(dirname $0); pwd)
commit=$(git rev-parse master)

tempdir=$(mktemp -d)
trap "rm -rf $tempdir" EXIT
cd $tempdir

npm install -D babel-preset-es2015
git clone $origin gh-pages -b gh-pages
cd gh-pages
git config user.name 'anonymous'
git config user.email ''
git checkout origin/master -- static/
git reset static/*
mv -v static/*.html .
mv -v static/js/{dummy-,}api.js
perl -pe "s{'./plot\?'}{'./plot.html?'}" -i static/js/index.js
babel static/js -d js --presets es2015 --compact true
git add *.html js/*
git commit -m "from $commit"
git push origin gh-pages
