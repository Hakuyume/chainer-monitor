#! /usr/bin/env bash
set -eu

export GIT_AUTHOR_NAME=anonymous
export GIT_AUTHOR_EMAIL=
export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME
export GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL

project=$(cd $(dirname $0); pwd)
cd $project
sha256sum -c dummy_data/checksum
rm -rf $project/dist

builddir=$(mktemp -d)
trap "rm -rf $builddir" EXIT
cd $builddir
npm install \
    browserify \
    babelify \
    babel-preset-es2015 \
    babel-polyfill \
    uglifyify
mkdir js
export NODE_PATH="${NODE_PATH:-}:js"

# gh-pages
dist=dist/gh-pages
mkdir -p $dist $dist/{api,js}

cp $project/static/*.html $dist/
cp $project/dummy_data/{log,plot}.json $dist/api/

cp $project/static/js/*.js js/
perl -pe "s{'./plot\?'}{'./plot.html?'}" -i js/index.js
mv js/{dummy-,}api.js
for target in {index,plot}.js
do
    perl -0pe 's{^}{import "babel-polyfill";}' -i js/$target
    browserify js/$target -o $dist/js/$target \
               -g uglifyify -t [ babelify --presets [ es2015 ] ]
done

# release
dist=dist/release
mkdir -p $dist $dist/static $dist/static/js

cp $project/README.md $dist/
cp $project/*.py $dist/
cp $project/static/*.html $dist/static/

cp $project/static/js/*.js js/
for target in {index,plot}.js
do
    perl -0pe 's{^}{import "babel-polyfill";}' -i js/$target
    browserify js/$target -o $dist/static/js/$target \
               -g uglifyify -t [ babelify --presets [ es2015 ] ]
done

cp -r dist $project/

cd $project
if git diff-index --quiet HEAD -- && git ls-files . --exclude-standard --others | grep ''; then
    cd dist
    for branch in *
    do
        git read-tree --empty
        for file in $(find $branch -type f -printf '%P ')
        do
            key=$(git hash-object -w $branch/$file)
            git update-index --add --cacheinfo 100644 $key $file
        done
        tree=$(git write-tree)
        parent=$(git rev-parse $branch)
        comment="from $(git rev-parse HEAD)"
        commit=$(git commit-tree $tree -p $parent -m "$comment")
        git branch -f $branch $commit
    done

    git reset
fi
