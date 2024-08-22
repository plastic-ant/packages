/* eslint-disable */
export default {
  displayName: "nx-msbuild",
  preset: "../../jest.preset.js",
  moduleFileExtensions: ["ts", "js", "html"],
  testEnvironment: "node",
  globals: {},
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
};
