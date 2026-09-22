# Bidshop Test Automation

## Framework

This project uses **Playwright with TypeScript** for both API and UI testing.

I chose Playwright because it supports API and browser testing in the same framework, with built-in fixtures, assertions, tracing and HTML reporting.

## Project Structure

```text
├── src/
│   ├── clients/       # API clients
│   ├── fixtures/      # Shared test setup
│   ├── pages/         # Page Object Model classes
│   ├── utils/         # Test data helpers
│   └── api.types.ts   # Test-owned API response types
├── tests/
│   ├── api/           # API tests
│   └── ui/            # UI tests
│
├── env.ts             # Test service ports and URLs
├── playwright.config.ts
├── package.json
├── BUGS.md
├── README.md
└── DISCOUNT.md
```

## Getting Started

Prerequisite: **Node.js 22+**

```bash
npm install
npx playwright install chromium
```

The Bidshop backend and frontend should be running before executing the tests.

## Running the Tests

```bash
npm test                  # run all tests
npm run test:api          # run API tests
npm run test:ui           # run UI tests
npm run test:smoke        # run smoke tests
npm run test:regression   # run regression tests
npm run typecheck         # TypeScript check
npm run report            # open Playwright HTML report
```

## Trade-offs / With More Time

I kept the suite focused on the main business flows rather than trying to cover every possible case.

With more time, I would add more API boundary and error scenarios, more UI negative coverage, response schema validation, and broader browser coverage.
