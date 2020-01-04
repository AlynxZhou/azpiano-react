#!/bin/bash

npm run build

rm -rf docs
cp -r build docs
echo 'piano.alynx.moe' > docs/CNAME

git add --all
git commit --message "Updated site."
git push --set-upstream origin master
