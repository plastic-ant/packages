# @plastic-ant/nx-react-router

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-react-router)](https://npmjs.com/package/@plastic-ant/nx-cdk)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-react-router.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk)

An Nx (Project Crystal) plugin for developing with the [react-router >= v7](reactrouter.com)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-react-router

# yarn
yarn add --dev @plastic-ant/nx-react-router
```

## Usage

For using the inferred tasks (Project Crystal) add the plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-react-router",
      "options": {
          buildTargetName  (optional) generated target build, default rr-build
          devTargetName    (optional) generated target dev, default rr-dev
          startTargetName    (optional) generated target start, default rr-start
          typegenTargetName    (optional) generated target typegen, default rr-typegen
       }
    }
]
```

Included executors

```
"targets": {
      "build": {
        "executor": "@plastic-ant/nx-react-router:build",
        "options": {}
      },
      "dev": {
        "executor": "@plastic-ant/nx-react-router:dev",
        "options": {}
      },
      "typegen": {
        "executor": "@plastic-ant/nx-react-router:typegen",
        "options": {}
      },
    }
    ...
```

## License

This project is MIT licensed 2024 Plastic Ant Software

## Links

- [Nx](https://github.com/nrwl/nx)
- [React Router](https://reactrouter.com)
