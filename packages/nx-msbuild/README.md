# @plastic-ant/nx-msbuild

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Npm package version](https://badgen.net/npm/v/@plastic-ant/nx-msbuild)](https://npmjs.com/package/@plastic-ant/nx-msbuild)
[![Downloads](https://img.shields.io/npm/dm/@plastic-ant/nx-msbuild.svg)](https://npmjs.com/package/@plastic-ant/nx-msbuild)

An Nx (Project Crystal) plugin for developing with the [msbuild](https://learn.microsoft.com/en-us/visualstudio/msbuild/msbuild?view=vs-2022)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example App](https://github.com/plastic-ant/packages/tree/main/examples/nx-msbuild-app)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @plastic-ant/nx-msbuild

# yarn
yarn add --dev @plastic-ant/nx-msbuild
```

## Usage

Add this plugin to your `nx.json` config:

```
"plugins": [
    {
      "plugin": "@plastic-ant/nx-msbuild",
      "options": { ... }
    }
]
```

```
options:
  targetName  (optional) generated target, default msbuild
  msbuildPath (optional) default "C:/Program Files (x86)/Microsoft Visual Studio/2022/BuildTools/MSBuild/Current/Bin/MSBuild.exe"
```

## License

This project is MIT licensed 2024 Plastic Ant Software
