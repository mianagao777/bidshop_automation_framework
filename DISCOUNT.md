# Plan: 10% off orders with subtotal over NZD 100

This is a proposed feature, not an implemented change. Resolve BUG-001 before
adding more pricing logic.

## Clarify before development

- Does “over 100” mean strictly >100, and is subtotal before GST, delivery and other
  discounts? Proposed assumption: merchandise subtotal excluding GST, strictly >100.
- Does 10% apply to the entire qualifying subtotal or only the amount above 100?
  Proposed assumption: entire merchandise subtotal.
- Is the benefit automatic, for all customers and products, with no cap? Can it
  stack with coupons, negotiated prices or future promotions?
- Does GST apply to the discounted subtotal? Agree rounding per line versus order,
  tie-breaking and the order of rounding with product/finance stakeholders.
- Is eligibility recalculated at checkout after stock/price changes? How should
  refunds, partial cancellations, promotion dates and existing carts behave?
- What should the UI show when cart changes cross the threshold? Who approves a
  changed quote before submission?

## Proposed changes (subject to those decisions)

API: centralize authoritative pricing for GET/mutations of cart and POST order.
Recompute eligibility server-side at checkout; never trust a client discount.
Use integer cents or a decimal money library with one agreed rounding rule.
Expose `subtotal`, `discountRate`, `discountAmount`, `discountedSubtotal`, `gst`,
`total` and pricing/promotion version. Update OpenAPI schemas and examples.
Preserve the meaning of existing `subtotal` as pre-discount to avoid silent drift.
Validate stock before any mutation; keep checkout atomic.

Data: persist the order's applied rate, discount amount, taxable base, GST, total
and promotion/version as immutable purchase-time snapshots. Old orders stay
unchanged; any future persistent storage migration defaults missing discount to
zero. This demo has in-memory storage, so there is currently no DB migration.

UI: render a distinct discount line and matching amounts on cart, checkout and
confirmation; explain qualification and update immediately after quantity changes.
Use server pricing instead of reimplementing eligibility in React. Handle changed
quotes explicitly if checkout reprices an order.

Example under the proposed assumptions: subtotal 120.00 → discount 12.00 →
taxable subtotal 108.00 → GST 16.20 → total 124.20. This example requires product
approval and is not a claim that the current application supports discounts.

## Test strategy

API boundaries: 99.99 and 100.00 receive zero discount; 100.01 qualifies. Use
explicit test fixtures capable of producing exact cent values; do not assume the
existing seed catalogue can produce every boundary. Test an ordinary 120.00
order, rounding-sensitive values, multiple lines, quantity changes crossing the
threshold in both directions, empty cart, invalid inputs and insufficient stock.
Assert discount, GST and total against independently calculated expected values.
Verify the persisted snapshot, cleared cart and exact inventory decrement;
rejected checkout must change none of those. Test tampered client-supplied discount
fields, order ownership and unchanged history after a later promotion change.

UI: below-threshold purchase, qualifying purchase and quantity adjustment across
the boundary. Assert displayed discount/quote/confirmation match server values;
retain a full browser purchase rather than duplicating every API edge case.

Regression: run existing auth/catalogue/cart/checkout/stock tests; assert unchanged
pricing for nonqualifying orders and unchanged stock quantities for qualifying
ones. Existing purchase fixtures are below 100 and must continue to pass after
BUG-001 is fixed. Update schemas and consumers together with compatibility checks.

## Before shipping

Agree acceptance examples, rounding and rollout ownership. Require BUG-001 and
all new pricing tests to pass without expected-failure annotations. Review UI
wording and backward compatibility. Add a feature flag/kill switch if the real
service supports staged rollout, observe quote-versus-order discrepancies and
redemption totals, and define rollback: disable future discounts while preserving
already-confirmed order snapshots. Release only after acceptance review.
