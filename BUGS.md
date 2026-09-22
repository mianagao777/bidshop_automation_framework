# BUG-001: cart and order GST disagree

The README and Swagger specify 15% GST. `backend/src/routes/cart.ts` calculates
12.5%, while `backend/src/routes/orders.ts` calculates 15%. Product code is unchanged.

Reproduction: register a customer, add two units of p-001, then check out with valid
delivery details. The cart quotes subtotal 29.00, GST 3.63, total 32.63; the order
confirms GST 4.35 and total 33.35. Expected: both quote and order use 15%, total 33.35.
This is a high-priority customer-facing price discrepancy.

This defect remains open. Two focused tests tagged `@known-bug` assert the correct
cart GST and quote-versus-confirmation equality. Setup and ordinary HTTP/UI checks
run before `test.fail()` marks only the final monetary assertion as expected to fail.

Run `npm test -- --grep @known-bug`. Both tests execute and are expected to fail,
so a green suite does not mean the defect is fixed. After a product fix, an
unexpected pass will fail the run until the annotations are removed.
