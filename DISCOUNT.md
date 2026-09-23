## Discount Feature Plan

### Clarifying questions

Before testing, I would confirm:

- Does "over $100" mean $100.00 itself does not qualify?
- Is the threshold based on subtotal before GST?
- Is GST calculated before or after the discount?
- Can the discount be combined with other discounts?
- What rounding rule should be used?
- Should the discount be shown separately in the cart, order details and invoice?
- How should future returns or refunds affect the discount?

### Changes

**API / backend**

The backend should calculate the discount so pricing has one source of truth. Cart and order responses should expose `subtotal`, `discount`, `gst` and `total`. The pricing logic should be kept in one reusable backend calculation rather than duplicated in the UI.

**Data model**

Add the discount amount to the cart/order pricing model so the applied discount is persisted and can be shown consistently later.

**UI**

Show the discount as a separate line in the cart/checkout summary and use the values returned by the API rather than recalculating pricing in the browser.

### Test strategy

At API level, I would focus on pricing boundaries and calculation accuracy:

- $99.99 → no discount
- $100.00 → no discount, assuming "over $100" is strict
- $100.01 → 10% discount
- Verify subtotal, discount, GST and total use the agreed calculation and rounding rules.
- Verify changing cart quantity recalculates the discount correctly.

At UI level, I would keep coverage small:

- Verify the discount appears/disappears when the cart crosses the threshold.
- Verify the displayed total matches the API result.
- Cover one end-to-end discounted purchase and confirm the final order keeps the same pricing.

### Regression and release

I would rerun the existing cart, order and purchase-flow tests to make sure non-qualifying orders still calculate correctly and that stock deduction, cart clearing and order persistence are unchanged.

Before release, I would want the pricing and rounding rules agreed, automated regression passing, and enough logging/monitoring to investigate incorrect discount calculations.

For existing orders, the new field should have a default value or migration strategy so older records remain backward-compatible.
