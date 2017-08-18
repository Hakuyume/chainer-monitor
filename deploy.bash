#! /usr/bin/env bash
set -eu

export GIT_AUTHOR_NAME=anonymous
export GIT_AUTHOR_EMAIL=
export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME
export GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL

echo 'check project directory ...'
project=$(cd $(dirname $0); pwd)
cd $project
sha256sum -c dummy_data/checksum
rm -rf $project/dist

echo 'setup build directory ...'
builddir=$(mktemp -d)
trap "rm -rf $builddir" EXIT
cd $builddir
npm install \
    browserify \
    babelify \
    babel-preset-es2015 \
    babel-preset-react
mkdir js
export NODE_PATH="${NODE_PATH:-}:js"
function compile_js() {
    browserify $1 -o $2 \
               -t [ babelify --presets [ es2015 react ] ]
}

# gh-pages
echo 'build gh-pages ...'
dist=dist/gh-pages
mkdir -p $dist $dist/{api,js}

cp $project/static/*.html $dist/
cp $project/dummy_data/{log,plot}.json $dist/api/

cp $project/static/js/*.js js/
perl -pe "s{'./plot\?'}{'./plot.html?'}" -i js/index.js
mv js/{dummy-,}api.js
for target in {index,plot}.js
do
    compile_js js/$target $dist/js/$target
done

# release
echo 'build release ...'
dist=dist/release
mkdir -p $dist $dist/static $dist/static/js

cp $project/README.md $dist/
cp $project/*.py $dist/
cp $project/static/*.html $dist/static/

cp $project/static/js/*.js js/
for target in {index,plot}.js
do
    compile_js js/$target $dist/static/js/$target
done

echo 'deploy ...'
cp -vr dist $project/

cd $project
if git diff-index --quiet HEAD -- && test -z "$(git ls-files . --exclude-standard --others)"; then
    cd dist
    for branch in *
    do
        echo "commit to $branch ..."

        git read-tree --empty
        for file in $(find $branch -type f -printf '%P ')
        do
            key=$(git hash-object -w $branch/$file)
            if [[ -x $branch/$file ]]; then
                git update-index --add --cacheinfo 100755 $key $file
            else
                git update-index --add --cacheinfo 100644 $key $file
            fi
        done
        tree=$(git write-tree)
        parent=$(git rev-parse $branch)
        comment="from $(git rev-parse HEAD)"
        commit=$(git commit-tree $tree -p $parent -m "$comment")
        git branch -f $branch $commit
    done

    git reset
else
    echo 'skip commiting (project directory is dirty)'
fi
