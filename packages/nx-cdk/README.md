# @plastic-ant/nx-cdk

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-cdk)](https://npmjs.com/package/@plastic-ant/nx-cdk)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-cdk.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk)

An Nx (Project Crystal) plugin for developing with the [aws-cdk](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-cdk-app)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-cdk

# yarn
yarn add --dev @plastic-ant/nx-cdk
```

## Usage

Add this plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-cdk",
      "options": { ... }
    }
]
```

Inferred tasks options (Project Crystal)

```
options:
  synthTargetName        (optional) generated target synth, default cdk-synth
  deployTargetName       (optional) generated target deploy, default cdk-deploy
  bootstrapTargetName    (optional) generated target bootstrap, default cdk-bootstrap
```

Executors

Each executor takes the same CLI options with the addtional of `postTargets` to be run synchronously.

```
"targets": {
      "bootstrap": {
        "executor": "@plastic-ant/nx-cdk:bootstrap",
        "options": {
          "postTargets": []
        }
      },
      "synth": {
        "executor": "@plastic-ant/nx-cdk:synth",
        "options": {
          "postTargets": ["{projectName}:postSynth"]
        }
      },
      "deploy": {
        "executor": "@plastic-ant/nx-cdk:deploy",
        "options": {
          "postTargets": ["sendSQS"]
        }
      }
    }
    ...
```

## License

This project is MIT licensed 2024 Plastic Ant Software

## Links

- [Nx](https://github.com/nrwl/nx)
- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
