import { test, expect } from "../../src/fixtures/authenticated.fixture";
import { shippingDetails as customer } from "../../src/utils/testdata";
import type { Cart, Product } from "../../src/api.types";

test.describe("Order API", () => {
  test(
    "rejects invalid delivery details and keeps the order state unchanged",
    { tag: "@regression" },
    async ({ cart, orders, products }) => {
      const productResponse = await products.get("p-001");
      expect(productResponse.status()).toBe(200);
      const beforeProduct: Product = await productResponse.json();

      const addResponse = await cart.add("p-001", 2);
      expect(addResponse.status()).toBe(201);

      const cartResponse = await cart.get();
      expect(cartResponse.status()).toBe(200);
      const beforeCart: Cart = await cartResponse.json();

      for (const invalid of [{ address: "" }, { postcode: "123" }]) {
        await test.step(`Reject delivery details ${JSON.stringify(invalid)}`, async () => {
          const response = await orders.create({ ...customer, ...invalid });
          expect(response.status()).toBe(400);

          const unchangedProduct = await products.get("p-001");
          expect(unchangedProduct.status()).toBe(200);
          expect(await unchangedProduct.json()).toEqual(beforeProduct);

          const unchangedCart = await cart.get();
          expect(unchangedCart.status()).toBe(200);
          expect(await unchangedCart.json()).toEqual(beforeCart);

          const emptyOrders = await orders.list();
          expect(emptyOrders.status()).toBe(200);
          expect(await emptyOrders.json()).toEqual({ count: 0, items: [] });
        });
      }
    },
  );

  test(
    "confirms an order, decrements stock and clears the cart",
    { tag: ["@regression", "@smoke"] },
    async ({ cart, orders, products, account }) => {
      const productResponse = await products.get("p-001");
      expect(productResponse.status()).toBe(200);
      const before: Product = await productResponse.json();

      const addResponse = await cart.add("p-001", 2);
      expect(addResponse.status()).toBe(201);

      const response = await orders.create(customer);
      expect(response.status()).toBe(201);

      const order = await response.json();
      expect(order).toMatchObject({
        id: expect.any(String),
        userId: account.user.id,
        status: "CONFIRMED",
        customer,
        subtotal: 29,
        gst: 4.35,
        total: 33.35,
        items: [
          { productId: "p-001", quantity: 2, unitPrice: 14.5, lineTotal: 29 },
        ],
      });

      const updatedProduct = await products.get("p-001");
      expect(updatedProduct.status()).toBe(200);
      expect((await updatedProduct.json()).stock).toBe(before.stock - 2);

      const emptiedCart = await cart.get();
      expect(emptiedCart.status()).toBe(200);
      expect(await emptiedCart.json()).toMatchObject({ items: [], total: 0 });

      const detail = await orders.get(order.id);
      expect(detail.status()).toBe(200);
      expect(await detail.json()).toEqual(order);

      const listed = await orders.list();
      expect(listed.status()).toBe(200);
      expect(await listed.json()).toEqual({ count: 1, items: [order] });
    },
  );

});
