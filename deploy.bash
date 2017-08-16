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
export NODE_PATH="${NODE_PATH:-}:static/js"
for target in index.js plot.js
do
    browserify static/js/$target -o $target -t [ babelify --presets [ es2015 ] ]
    key=$(git hash-object -w $target)
    git update-index --add --cacheinfo 100644 $key js/$target
done

tree=$(git write-tree)
parent=$(git rev-parse origin/gh-pages)
comment="from $(git rev-parse origin/master)"
commit=$(echo $comment | git commit-tree $tree -p $parent)
git push origin $commit:gh-pages
