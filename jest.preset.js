const path = require("path");
const nxPreset = require("@nx/jest/preset").default;

/** @type {import('jest').Config} */
const config = {
  ...nxPreset,
  testMatch: ["**/+(*.)+(spec|test).+(ts|js)?(x)"],
  transform: { "^.+\\.(ts|js|html)$": "ts-jest" },
  resolver: "@nx/jest/plugins/resolver",
  moduleFileExtensions: ["ts", "js", "html"],
  coverageReporters: ["html"],
  collectCoverage: true,
  bail: true,
  testTimeout: 70000,
  coverageDirectory: path.join(__dirname, `/coverage/${process.env["NX_TASK_TARGET_PROJECT"]}`),
  setupFiles: [path.join(__dirname, "./tools/scripts/nx-unit-tests-setup.js")],
};

module.exports = config;
