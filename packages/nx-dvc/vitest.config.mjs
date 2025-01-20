import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/nx-dvc",
  plugins: [],
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/nx-dvc",
      provider: "v8",
    },
  },
});
