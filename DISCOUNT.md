# Discount Feature Plan

## Questions

Before testing, I would confirm a few things with Product and developers:

- Does "over $100" mean $100.00 itself does not get the discount?
- Is the $100 based on subtotal before GST?
- Is the discount applied before or after GST?
- Does the discount apply to all products?
- Can it be combined with other discounts in future?
- What rounding rule should be used?

## Changes

### API

The backend should calculate the discount because it should be the source of truth for pricing.

For a qualifying order, the cart/order response should include the discount separately, for example:

```json
{
  "subtotal": 120,
  "discount": 12,
  "gst": 16.2,
  "total": 124.2
}
```

The exact GST calculation would depend on the agreed rule.

### Data model

For orders, I would store the discount value so the final price is kept with the order.

For example:

- `discountAmount`
- `discountRate`

### UI

The discount should be shown clearly in the cart, checkout and order confirmation.

For example:

```text
Subtotal        $120.00
Discount 10%    -$12.00
GST             $16.20
Total           $124.20
```

The amount should update if the customer changes the cart quantity.

## Test strategy

I would cover most of the calculation rules at API level.

Main cases:

- below $100 -> no discount
- exactly $100 -> no discount
- just over $100 -> 10% discount
- over $100 -> correct discount and total
- reduce quantity below $100 -> discount removed
- increase quantity over $100 -> discount applied

I would also check that the discount, GST and final total are saved correctly in the order.

For UI, I would keep the coverage smaller:

- one order that gets the discount
- one order that does not
- checkout total matches the final order total

## Regression

I would rerun the existing cart and order tests, especially:

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

- the calculation and rounding rules confirmed
- API boundary tests automated
- at least one UI end-to-end discount test
- existing pricing regression passing
