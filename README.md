# Bidshop Test Automation

## Framework

This project uses **Playwright with TypeScript** for both API and UI testing.

I chose Playwright because it supports both in a single framework and provides built-in auto-waiting, fixtures, assertions, tracing, and reporting. The auto-waiting is especially useful for UI testing because it reduces the need for manual waits and helps make the tests more stable.

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

This repository contains the automation tests only.The Bidshop backend and frontend should be started from the original application repository provided with the exercise.

The test suite is configured to use `http://localhost:4000` for the API and `http://localhost:5173` for the UI.

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
npm run report            # open Playwright HTML report
```

`@smoke` covers the main critical flows, while `@regression` is used for broader test coverage. Known product issues are marked with `@known-bug` and handled using `test.fail()`.

## Test Isolation

- Tests that require an account register a new user with a unique email, keeping cart and order data isolated between tests.
- Product stock is shared state, so `playwright.config.ts` uses `workers: 1` and `retries: 0` to keep stock-changing tests sequential and avoid test interference.
- Authenticated UI tests reuse a login token through `storageState` to keep setup fast, while the login flow itself is tested end-to-end separately in `storefront.spec.ts`.

## Trade-offs / With More Time

I kept the suite focused on the main business flows rather than trying to cover every possible scenario.

With more time, I would extend the API coverage with additional boundary and error cases, add more negative UI scenarios, response schema validation, and broader browser coverage. I would also add some focused reliability tests, for example, two customers attempting to purchase the last available item at the same time, verifying that only one checkout succeeds and the rejected checkout leaves no partial state behind.
