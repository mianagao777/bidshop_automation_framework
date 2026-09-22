import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { apiPort, uiPort, apiURL, uiURL } from "./env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  // Inventory is shared across users. Keep mutations sequential and do not retry them.
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "api", testMatch: "**/api/*.spec.ts", use: { baseURL: apiURL } },
    {
      name: "ui",
      testMatch: "**/ui/*.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: uiURL },
    },
  ],
  webServer: [
    {
      command: "node -r ts-node/register src/index.ts",
      cwd: path.resolve(__dirname, "../backend"),
      env: { PORT: String(apiPort), CORS_ORIGIN: uiURL },
      url: `${apiURL}/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npm run dev -- --host localhost --port ${uiPort} --strictPort`,
      cwd: path.resolve(__dirname, "../frontend"),
      env: { VITE_API_BASE_URL: apiURL },
      url: uiURL,
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
