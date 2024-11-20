const { readJsonFile, writeJsonFile } = require("nx/src/devkit-exports");

module.exports = ({ packagePath }) => {
  return {
    name: "rollup-plugin-tidy-package-json",
    closeBundle: {
      sequential: true,
      async handler() {
        const pkg = readJsonFile(packagePath);
        delete pkg["nx"];
        writeJsonFile(packagePath, pkg);
      },
    },
  };
};
