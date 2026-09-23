# Discount Feature Plan

## Questions

Before testing, I would confirm a few things with Product and developers:

- Does "over $100" mean $100.00 itself does not get the discount?
- Is the discount applied before or after GST?
- Does the discount apply to all products?
- Can it be combined with other discounts?
- What rounding rule should be used?
- If an order is partially refunded or returned, how should the discount be recalculated?

## Changes

### API

The backend should calculate the discount because it should be the source of truth for pricing.

The cart and order responses should include the discount separately, such as `discountRate` and `discountAmount`, alongside `subtotal`, `gst` and `total`.

The exact GST calculation would depend on the agreed rule. For monetary calculations, I would avoid relying on floating-point values and agree the rounding rule before implementation.

### Data model

For completed orders, I would store `discountAmount` and `discountRate` with the pricing breakdown.

### UI

The discount should be shown clearly in the cart, checkout and order confirmation.

The displayed pricing should update when the customer changes the cart quantity.

## Test strategy

I would cover most pricing rules at API level and keep the UI coverage smaller.

Main cases:

- below $100 -> no discount
- exactly $100 -> no discount
- just over $100 -> 10% discount
- over $100 -> correct discount, GST and total
- reduce quantity below the threshold -> discount removed
- increase quantity above the threshold -> discount applied

I would also verify that the applied discount, GST and final total are stored correctly in the final order.

For UI, I would keep the coverage smaller:

- one order that gets the discount
- one order that does not
- checkout total matches the final order total

## Regression

I would rerun the existing pricing and checkout coverage, especially:

- cart totals
- GST calculation
- quantity changes
- checkout
- stock reduction
- cart clearing
- order details

Orders below $100 should still work the same as before.

## Before release

Before shipping, I would want:

- calculation and rounding rules confirmed
- API boundary tests automated
- at least one UI end-to-end discount test
- existing pricing regression passing
- enough logging to investigate pricing or discount issues
