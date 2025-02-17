# @plastic-ant/nx-react-router

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-react-router)](https://npmjs.com/package/@plastic-ant/nx-cdk)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-react-router.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk)

An Nx (Project Crystal) plugin for developing with the [react-router](reactrouter.com)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-react-router-app)
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
          buildTargetName  (optional) generated target synth, default rr-build
          devTargetName    (optional) generated target deploy, default rr-dev
          startTargetName    (optional) generated target deploy, default rr-start
          typecheckTargetName    (optional) generated target deploy, default rr-typecheck
       }
    }
]
```

## License

This project is MIT licensed 2024 Plastic Ant Software

## Links

- [Nx](https://github.com/nrwl/nx)
- [React Router](https://reactrouter.com)
