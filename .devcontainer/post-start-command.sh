#!/usr/bin/env bash
sudo apt-get update && sudo apt-get -y upgrade

yarn

NX_VERSION=$(node -p "require('./node_modules/nx/package.json').version")

npm i -g npm nx@$NX_VERSION

npx husky
