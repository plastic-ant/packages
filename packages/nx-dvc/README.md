# @plastic-ant/nx-dvc

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-dvc)](https://npmjs.com/package/@plastic-ant/nx-dvc)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-dvc.svg)](https://npmjs.com/package/@plastic-ant/nx-dvc)

An Nx (Project Crystal) plugin for developing with the [dvc](https://dvc.org/)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-dvc-app)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-dvc

# yarn
yarn add --dev @plastic-ant/nx-dvc
```

## Usage

Add this plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-dvc",
      "options": { ... }
    }
]
```

```
options:
  reproTargetName  (optional) generated target, default dvc-repro
```

## License

This project is MIT licensed 2024 Plastic Ant Software
