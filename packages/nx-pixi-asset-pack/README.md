# @plastic-ant/nx-pixi-asset-pack

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-cdk)](https://npmjs.com/package/@plastic-ant/nx-cdk)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-cdk.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk)

An Nx (Project Crystal) plugin for developing with the [Pixi AssetPack](https://pixijs.io/assetpack/)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-pixi-asset-pack-app)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-pixi-asset-pack

# yarn
yarn add --dev @plastic-ant/nx-pixi-asset-pack
```

## Usage

For using the inferred tasks (Project Crystal) add the plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-pixi-asset-pack",
      "options": {
          targetName     (optional) generated target, default assetpack
       }
    }
]
```

Included executors

Each executor has options that mirror the same assetpack CLI command with the addtional of `postTargets` to be run synchronously.

```
"targets": {
      "pack": {
        "executor": "@plastic-ant/nx-pixi-asset-pack:pack",
        "options": {
          "postTargets": []
        }
      }
    }
    ...
```

## License

This project is MIT licensed 2024 Plastic Ant Software
