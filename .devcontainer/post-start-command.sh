#!/usr/bin/env bash
sudo apt-get update && sudo apt-get -y upgrade

yarn

ESLINT_VERSION=$(node -p "require('./node_modules/eslint/package.json').version")
NX_VERSION=$(node -p "require('./node_modules/nx/package.json').version")
HUSKY_VERSION=$(node -p "require('./node_modules/husky/package.json').version")
JS2TS_VERSION=$(node -p "require('./node_modules/json-schema-to-typescript/package.json').version")

npm i -g npm nx@$NX_VERSION eslint@$ESLINT_VERSION husky@$HUSKY_VERSION json-schema-to-typescript@$JS2TS_VERSION

npx husky
