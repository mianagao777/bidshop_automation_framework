# Bidshop Test Automation

## Framework

This project uses **Playwright with TypeScript** for both API and UI testing.

I chose Playwright because it supports API and browser testing in the same framework, with built-in fixtures, assertions, tracing and HTML reporting.

## Project Structure

```text
├── src/
│   ├── clients/       # API clients
│   ├── fixtures/      # Shared test setup
│   ├── pages/         # Page objects and UI components
│   ├── utils/         # Test data helpers
│   └── api.types.ts   # Test-owned API response types
├── tests/
│   ├── api/           # API tests
│   └── ui/            # UI tests
├── env.ts                # Test service URLs
├── playwright.config.ts  # Playwright test configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── README.md
└── DISCOUNT.md
```

## Getting Started

Prerequisite: **Node.js 20+**

This repository contains the automation tests only.

Start the Bidshop services from the original application repository:

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

The tests expect the API at `http://localhost:4000` and the UI at `http://localhost:5173`.

Install the automation dependencies:

````bash
npm install
npx playwright install chromium


## Running the Tests

```bash
npm test                  # run all tests
npm run test:api          # run API tests
npm run test:ui           # run UI tests
npm run test:smoke        # run smoke tests
npm run test:regression   # run regression tests
npm run typecheck         # TypeScript check
npm run report            # open Playwright HTML report
````

`@smoke` covers the main critical flows, while `@regression` covers the wider suite. Known product issues use `@known-bug` with `test.fail()`.

## Test Isolation & Concurrency

- Each test that needs an account registers a new user with a unique email, isolating per-user cart and order data.
- Product stock is shared global state, so `playwright.config.ts` sets `workers: 1` and `retries: 0` to keep stock-mutating tests sequential and avoid flaky interference.
- Authenticated UI tests inject a login token via `storageState` for speed; the login form itself is verified end-to-end separately in `storefront.spec.ts`.

## Trade-offs / With More Time

I kept the suite focused on the main business flows rather than trying to cover every possible case.

With more time, I would add more API boundary and error scenarios, more UI negative coverage, response schema validation, and broader browser coverage. I would also add a focused reliability test for two customers competing for the last available stock, verifying that a rejected checkout causes no partial side effects.
