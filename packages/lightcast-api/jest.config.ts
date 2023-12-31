/* eslint-disable */
export default {
  displayName: "lightcast-api",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: { "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }] },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/lightcast-api",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
