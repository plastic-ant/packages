/* eslint-disable */
export default {
  displayName: "nx-cdktf",
  preset: "../../jest.preset.js",
  moduleFileExtensions: ["ts", "js", "html"],
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
