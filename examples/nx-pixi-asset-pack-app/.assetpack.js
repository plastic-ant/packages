export default {
  entry: "./raw-assets",
  output: "./public",
  ignore: ["**/*.html"],
  cache: true,
  cacheLocation: "./.assetpack",
  logLevel: "info",
  pipes: [
    // Pipes go here
  ],
  assetSettings: [
    {
      files: ["**/*.png"],
      settings: {
        compress: {
          jpg: true,
          png: true,
          // all png files will be compressed to avif format but not webp
          webp: false,
          avif: true,
        },
      },
    },
  ],
};
