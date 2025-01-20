# @plastic-ant/nx-cdk-local

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-cdk-local)](https://npmjs.com/package/@plastic-ant/nx-cdk-local)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-cdk-local;.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk-local)

An Nx (Project Crystal) plugin for developing with the [AWS CDK Local(Stack)](https://github.com/localstack/aws-cdk-local)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-cdk-app)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-cdk-local

# yarn
yarn add --dev @plastic-ant/nx-cdk-local
```

## Usage

For using the inferred tasks (Project Crystal) add the plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-cdk-local",
      "options": {
          synthTargetName     (optional) generated target synth, default cdk-local-synth
          deployTargetName    (optional) generated target deploy, default cdk-local-deploy
          bootstrapTargetName (optional) generated target bootstrap, default cdk-local-bootstrap
       }
    }
]
```

Included executors

Each executor has options that mirror the same cdk CLI command with the addtional of `postTargets` to be run synchronously.

```
"targets": {
      "bootstrap": {
        "executor": "@plastic-ant/nx-cdk-local:bootstrap",
        "options": {
          "postTargets": []
        }
      },
      "synth": {
        "executor": "@plastic-ant/nx-cdk-local:synth",
        "options": {
          "postTargets": ["{projectName}:postSynth"]
        }
      },
      "deploy": {
        "executor": "@plastic-ant/nx-cdk-local:deploy",
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
- [AWS CDK Local(Stack)](https://github.com/localstack/aws-cdk-local)
- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
