import { defineConfig, devices } from "@playwright/test";
import { uiURL } from "./env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "api", testMatch: "**/api/*.spec.ts" },
    {
      name: "ui",
      testMatch: "**/ui/*.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: uiURL },
    },
  ],
});
