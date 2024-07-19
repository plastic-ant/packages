/* eslint-disable */
export default {
  displayName: "nx-cdktf",
  preset: "../../jest.preset.js",
  globals: {},
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  //coverageDirectory: "../../../coverage/packages/libs/nx-plugins/cdk-aws-plugin",
};