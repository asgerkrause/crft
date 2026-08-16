import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: {
    server: {
      fs: {
        allow: [fileURLToPath(new URL("..", import.meta.url))],
      },
    },
  },
});
