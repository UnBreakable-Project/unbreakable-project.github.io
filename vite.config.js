import { defineConfig } from "vitest/config";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";
import { watch } from "node:fs";

function visualIdentityManifestPlugin() {
  const generateManifest = () => {
    execFileSync("node", ["scripts/generate-visual-identity-manifest.mjs"], {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  };

  return {
    name: "visual-identity-manifest",
    buildStart() {
      generateManifest();
    },
    configureServer(server) {
      generateManifest();

      const watcher = watch(
        "public/identidade-visual",
        { recursive: true },
        (_, filename) => {
          if (!filename) return;
          generateManifest();
          server.ws.send({ type: "full-reload", path: "/" });
        },
      );

      server.middlewares.use((_req, _res, next) => {
        next();
      });

      return () => watcher.close();
    },
  };
}

export default defineConfig({
  plugins: [mdx(), react(), visualIdentityManifestPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
