import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    // coverage: {
    //   reportsDirectory: "../../coverage/packages/nx-cdk",
    //   provider: "v8",
    // },
  },
});
