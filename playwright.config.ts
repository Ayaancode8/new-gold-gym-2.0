import { defineConfig } from "@playwright/test";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const systemChrome = "/opt/google/chrome/chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined);
const adminDataPath = join(mkdtempSync(join(tmpdir(), "gold-gym-e2e-")), "admin.json");

export default defineConfig({
  testDir: "./tests",
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
  webServer: { command: "node scripts/admin-test-server.mjs", url: "http://127.0.0.1:3010", reuseExistingServer: false, timeout: 60000, env: { ADMIN_DATA_PATH: adminDataPath } },
});
