# Bidshop Test Automation

## Framework

This project uses **Playwright with TypeScript** for both API and UI testing.

I chose Playwright because it supports both API and UI testing in one toolchain, so the suites can share configuration, fixtures, assertions, reporting and TypeScript types. The auto-waiting is especially useful for UI testing because it reduces the need for manual waits and helps make the tests more stable.

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

Prerequisite: **Node.js 20+**.

This repository contains the automation tests only. The Bidshop backend and frontend should be started from the original application repository provided with the exercise.

The test suite uses `http://localhost:4000` for the API and `http://localhost:5173` for the UI by default. Set `API_URL` and `UI_URL` to run against another environment.

#### Start the Bidshop services from the original application repository:

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

#### Install the automation dependencies:

```bash
npm install
npx playwright install chromium
```

#### Running the Tests

```bash
npm test                  # run all tests
npm run test:api          # run API tests
npm run test:ui           # run UI tests
npm run test:smoke        # run smoke tests
npm run test:regression   # run regression tests
npm run typecheck         # TypeScript check
npm run report            # open Playwright HTML report
```

`@smoke` covers the main critical flows, while `@regression` is used for broader test coverage. Known product issues are marked with `@known-bug` so they remain visible without being mistaken for automation failures.
Tests use unique users for isolation, and the suite runs with a single worker because product stock is shared in memory.

## Test Strategy

The suite focuses on a small number of high-value scenarios rather than exhaustive coverage.

- API tests cover authentication, product queries, cart rules, order creation and state changes.
- UI tests cover key customer journeys such as browsing, cart updates and checkout.
- Detailed response validation is mainly covered at API level, while UI tests focus on customer-visible behaviour and critical journeys.

## Trade-offs / With More Time

I kept the suite focused on the main business flows rather than trying to cover every possible scenario.

With more time, I would extend authorization coverage beyond the existing cross-user order access test, then add more API boundary and error cases, negative UI scenarios, response schema validation, broader browser coverage and CI execution. I would also add focused reliability tests, such as two customers attempting to purchase the last available item at the same time, verifying that only one checkout succeeds and the rejected checkout leaves no partial state behind.
