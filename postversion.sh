#!/bin/bash -e

name=$(cat package.json | jq .name -r)
version=$(cat package.json | jq .version -r)
tag="$name@$version"

(cd ..; npm i;)

git add ..
git commit -m $tag
git tag -a $tag -m "Publied version $version of $name"

git push origin --follow-tags