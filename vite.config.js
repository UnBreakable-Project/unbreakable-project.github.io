import { defineConfig } from "vitest/config";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [mdx(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
