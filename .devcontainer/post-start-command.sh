#!/bin/sh

sudo apt-get update && sudo apt-get -y upgrade

npm install -g npm@latest
npm uninstall -g eslint typescript yarn

pnpm install

echo "### Installing correct global dependencies (eslint, nx, husky, js2ts)..."
ESLINT_VERSION=$(node -p "require('./node_modules/eslint/package.json').version")
NX_VERSION=$(node -p "require('./node_modules/nx/package.json').version")
HUSKY_VERSION=$(node -p "require('./node_modules/husky/package.json').version")
JS2TS_VERSION=$(node -p "require('./node_modules/json-schema-to-typescript/package.json').version")

npm i -g nx@$NX_VERSION eslint@$ESLINT_VERSION husky@$HUSKY_VERSION json-schema-to-typescript@$JS2TS_VERSION

npx husky