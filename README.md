# Bidshop acceptance tests

Playwright + TypeScript provides one runner for API tests and real-browser UI
journeys. The suite has **18 tests: 13 API and 5 UI**, including two known-bug checks.
Product source code is unchanged.

## Install and run

Use Node.js 22. From the repository root:

```sh
npm ci --prefix backend
npm ci --prefix frontend
cd bidshop_automation
npm ci
npx playwright install chromium
npm run typecheck
npm run test:api
npm run test:ui
```

On Linux use `npx playwright install --with-deps chromium`.
Run subsequent commands inside `bidshop_automation`:

```sh
npm test                  # all 18 tests
npm run test:smoke        # 5 critical-path tests
npm run test:regression   # all 18 tests, including smoke
npm run test:smoke -- --project=api
npm test -- --grep @known-bug  # 2 focused defect checks
npm run report            # latest HTML report
```

Playwright starts fresh services on **4100/5180** and stops them after each run.
No manual service startup is needed. Existing services on these ports are not
reused. Development services on 4000/5173 are unaffected. To change test ports:

```sh
TEST_API_PORT=4200 TEST_UI_PORT=5280 npm test
```

## Coverage

| API scenarios | UI scenarios |
| --- | --- |
| Auth happy path: register, login, current user | Storefront, search and category filter |
| Auth negative: duplicate user and wrong password | Register, logout, rejected and successful login |
| Combined product filters and no matches | Update quantity, remove and clear cart |
| Cart mutation and invalid/overstock quantity rejection | Purchase, confirmation and persisted order |
| Delivery validation and order lifecycle with stock/cart checks | |
| Stale-stock rejection without partial inventory changes | |

Two additional `@known-bug` cases check cart GST and checkout quote consistency.
Every test has `@regression`; auth happy path, product filtering, order lifecycle,
UI storefront and UI purchase also have `@smoke`. Purchase starts authenticated via
its fixture; login form behavior is covered separately.

## Structure and isolation

- `src/clients/`: request methods that return raw API responses.
- `src/api.types.ts`: test-owned response types.
- `src/pages/`: page/component actions and locators; assertions stay in tests.
- `src/fixtures/`: unique users, request contexts and browser-local authentication.
- `env.ts` and `src/utils/`: ports and test data.
- `tests/api/` and `tests/ui/`: business scenarios.

One worker, no retries: stock is shared across users. Each new run resets the
in-memory store. Do not override the worker count or run concurrent suites on the
same ports. Catalogue counts and explicit price examples depend on the provided
seed data. Test data uses synthetic accounts; request contexts are disposed.

## Known defect and trade-offs

**BUG-001 is still open:** cart/checkout quotes use 12.5% GST, confirmed orders use
15%. See [BUGS.md](BUGS.md) for reproduction. Two dedicated `@known-bug` tests
assert correct pricing. Each calls `test.fail()` immediately before its final
monetary assertion, after setup and normal HTTP/UI checks have succeeded. The
main purchase and order lifecycle cases are not marked as expected failures.

A normal run includes two expected failures. If the bug is fixed, those tests
unexpectedly pass and fail the run until their annotations are removed.

Post-fix rows describe expected behavior, not a product fix performed here. Update
known-bug titles/tags when closing the defect. The UI quote-versus-charge test is
in `tests/ui/purchase-flow.spec.ts`; run the full suite or `--project=ui` to include
it. `test:api` reports contain API tests only.

The suite deliberately omits exhaustive validation matrices, schema validation,
order ownership checks and cross-browser coverage. These are future extensions,
along with removing the expected-failure annotations after BUG-001 is addressed. The discount feature
is a plan only: see [DISCOUNT.md](DISCOUNT.md).

Reports are written to `playwright-report/` and `test-results/`. Submit the
application, automation and lockfiles together; the automation folder requires
its sibling services.
