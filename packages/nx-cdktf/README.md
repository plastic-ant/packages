# @plastic-ant/nx-cdktf

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-cdktf)](https://npmjs.com/package/@plastic-ant/nx-cdktf)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-cdktf.svg)](https://npmjs.com/package/@plastic-ant/nx-cdktf)

An Nx (Project Crystal) plugin for developing with the [cdktf](https://developer.hashicorp.com/terraform/cdktf)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-cdktf-app)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-cdktf

# yarn
yarn add --dev @plastic-ant/nx-cdktf
```

## Usage

For using the inferred tasks (Project Crystal) add the plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-cdktf",
      "options": {
          synthTargetName  (optional) generated target synth, default cdktf-synth
          deployTargetName (optional) generated target deploy, default cdktf-deploy
          getTargetName    (optional) generated target get, default cdktf-get
       }
    }
]
```

Included executors

Each executor has options that mirror the same cdktf CLI command with the addtional of `postTargets` to be run synchronously.

```
"targets": {
      "get": {
        "executor": "@plastic-ant/nx-cdktf:get",
        "options": {
          "postTargets": []
        }
      },
      "synth": {
        "executor": "@plastic-ant/nx-cdktf:synth",
        "options": {
          "postTargets": ["{projectName}:postSynth"]
        }
      },
      "deploy": {
        "executor": "@plastic-ant/nx-cdktf:deploy",
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
- [Terraform CDK](https://developer.hashicorp.com/terraform/cdktf)
