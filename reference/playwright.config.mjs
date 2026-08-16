import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4321",
    browserName: "chromium",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "bun run build && bun run preview -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
