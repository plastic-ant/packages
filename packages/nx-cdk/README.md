# @plastic-ant/nx-cdk

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-cdk)](https://npmjs.com/package/@plastic-ant/nx-cdk)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-cdk.svg)](https://npmjs.com/package/@plastic-ant/nx-cdk)

An Nx (Project Crystal) plugin for developing with the [aws-cdk](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
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

```
options:
  synthTargetName        (optional) generated target synth, default cdk-synth
  deployTargetName       (optional) generated target deploy, default cdk-deploy
  bootstrapTargetName    (optional) generated target bootstrap, default cdk-bootstrap
```

## License

This project is MIT licensed 2024 Plastic Ant Software

## Links

- [Nx](https://github.com/nrwl/nx)
- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
