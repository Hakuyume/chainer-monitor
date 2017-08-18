#! /usr/bin/env bash
set -eu

export GIT_AUTHOR_NAME=anonymous
export GIT_AUTHOR_EMAIL=
export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME
export GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL

echo 'check project directory ...'
cd $(dirname $0)
sha256sum -c dummy_data/checksum
rm -rf dist

echo 'setup build directory ...'
mkdir -p build/lib
trap "rm -rf build" EXIT
function compile_js() {
    NODE_PATH="${NODE_PATH:-}:build/lib" browserify $1 -o $2 \
               -t [ babelify --presets [ es2015 react ] ]
}

# gh-pages
echo 'build gh-pages ...'
dist=build/dist/gh-pages
mkdir -p $dist $dist/{api,js}

cp static/*.html $dist/
cp dummy_data/{log,plot}.json $dist/api/

cp static/js/*.js build/lib/
mv build/lib/{dummy-,}api.js
perl -pe "s{'./plot\?'}{'./plot.html?'}" -i build/lib/index.js
for target in {index,plot}.js
do
    compile_js build/lib/$target $dist/js/$target
done

# release
echo 'build release ...'
dist=build/dist/release
mkdir -p $dist $dist/static $dist/static/js

cp README.md $dist/
cp *.py $dist/
cp static/*.html $dist/static/

cp static/js/*.js build/lib/
for target in {index,plot}.js
do
    compile_js build/lib/$target $dist/static/js/$target
done

echo 'deploy ...'
cp -vr build/dist .

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
