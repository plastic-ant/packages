# @plastic-ant/nx-strapi

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-strapi)](https://npmjs.com/package/@plastic-ant/nx-strapi)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-strapi.svg)](https://npmjs.com/package/@plastic-ant/nx-strapi)

An Nx (Project Crystal) plugin for developing with the [Strapi](https://strapi.io/) CLI

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-strapi

# yarn
yarn add --dev @plastic-ant/nx-strapi
```

## Usage

Add this plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-strapi",
      "options": { ... }
    }
]
```

```
options:
  buildTargetName       (optional) target name for 'strapi build', default strapi-build
  deployTargetName      (optional) target name for 'strapi deploy', default strapi-deploy
  developTargetName     (optional) target name for 'strapi develop', default strapi-develop
  startTargetName       (optional) target name for 'strapi start', default strapi-start
```

## License

This project is MIT licensed 2024 Plastic Ant Software

## Links

- [Nx](https://github.com/nrwl/nx)
- [Strapi](https://strapi.io/)
