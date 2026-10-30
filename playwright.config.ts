import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const systemChrome = "/opt/google/chrome/chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined);

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/domain.spec.ts", "**/browser-store.spec.ts"],
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3010",
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage"] },
  },
  webServer: { command: "npm start", url: "http://127.0.0.1:3010", reuseExistingServer: false, timeout: 60000, env: { PORT: "3010" } },
});
