#!/bin/sh

pnpm install --frozen-lockfile

echo "💾 Installing Global dependencies (e.g eslint, nx, husky)..."
ESLINT_VERSION=$(node -p "require('./node_modules/eslint/package.json').version")
NX_VERSION=$(node -p "require('./node_modules/nx/package.json').version")
HUSKY_VERSION=$(node -p "require('./node_modules/husky/package.json').version")
JS2TS_VERSION=$(node -p "require('./node_modules/json-schema-to-typescript/package.json').version")

pnpm add --global nx@$NX_VERSION eslint@$ESLINT_VERSION husky@$HUSKY_VERSION json-schema-to-typescript@$JS2TS_VERSION
