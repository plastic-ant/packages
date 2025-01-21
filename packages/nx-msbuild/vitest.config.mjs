import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    watch: false,
    globals: true,
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
  },
});
