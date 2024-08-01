const path = require("path");
const nxPreset = require("@nx/jest/preset").default;

/** @type {import('jest').Config} */
const globalConf = {
  collectCoverage: true,
  bail: true,
  testTimeout: 70000,
  coverageDirectory: path.join(__dirname, `/coverage/${process.env["NX_TASK_TARGET_PROJECT"]}`),
  setupFiles: [path.join(__dirname, "./tools/scripts/nx-unit-tests-setup.js")],
};

module.exports = { ...nxPreset, ...globalConf };
