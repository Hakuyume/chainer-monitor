#! /usr/bin/env bash
set -eu

origin=$(cd $(dirname $0); pwd)

tempdir=$(mktemp -d)
trap "rm -rf $tempdir" EXIT
cd $tempdir

git clone $origin repo
cd repo
git config user.name 'anonymous'
git config user.email ''

git read-tree --empty

for target in static/*.html
do
    key=$(git hash-object -w $target)
    git update-index --add --cacheinfo 100644 $key $(basename $target)
done

perl -pe "s{'./plot\?'}{'./plot.html?'}" -i static/js/index.js
mv -v static/js/{dummy-,}api.js
mkdir -p babel browserify
babel static/js -d babel --presets es2015 --compact true
for target in index.js plot.js
do
    NODE_PATH=babel browserify babel/$target -o browserify/$target
    key=$(git hash-object -w browserify/$target)
    git update-index --add --cacheinfo 100644 $key js/$target
done

tree=$(git write-tree)
parent=$(git rev-parse origin/gh-pages)
comment="from $(git rev-parse origin/master)"
commit=$(echo $comment | git commit-tree $tree -p $parent)
git push origin $commit:gh-pages
