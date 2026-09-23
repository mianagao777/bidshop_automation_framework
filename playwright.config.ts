import { defineConfig, devices } from "@playwright/test";
import { apiURL, uiURL } from "./env";

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
});
