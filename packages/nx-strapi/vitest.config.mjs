import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/nx-strapi",
  plugins: [],
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/nx-strapi",
      provider: "v8",
    },
  },
});
