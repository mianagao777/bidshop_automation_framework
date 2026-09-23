import { test, expect } from "../../src/fixtures/authenticated.fixture";
import type { Cart, Product } from "../../src/api.types";

test.describe("Cart API", () => {
  test("adds, updates and removes a cart item", { tag: "@regression" }, async ({ cart }) => {
    const firstAdd = await cart.add("p-001");
    expect(firstAdd.status()).toBe(201);

    const secondAdd = await cart.add("p-001", 2);
    expect(secondAdd.status()).toBe(201);

    const initialResponse = await cart.get();
    expect(initialResponse.status()).toBe(200);

    const initialCart: Cart = await initialResponse.json();
    expect(initialCart).toMatchObject({
      items: [{ productId: "p-001", quantity: 3, lineTotal: 43.5 }],
      subtotal: 43.5,
    });

    const updateResponse = await cart.update("p-001", 2);
    expect(updateResponse.status()).toBe(200);

    const updatedResponse = await cart.get();
    expect(updatedResponse.status()).toBe(200);
    expect(await updatedResponse.json()).toMatchObject({
      items: [{ quantity: 2 }],
      subtotal: 29,
    });

    const removeResponse = await cart.remove("p-001");
    expect(removeResponse.status()).toBe(200);

    const emptyResponse = await cart.get();
    expect(emptyResponse.status()).toBe(200);
    expect(await emptyResponse.json()).toMatchObject({
      items: [],
      subtotal: 0,
      total: 0,
    });
  });

  test("rejects invalid quantities without changing the cart", { tag: "@regression" }, async ({
    cart,
    products,
  }) => {
    const addResponse = await cart.add("p-001", 3);
    expect(addResponse.status()).toBe(201);

    const beforeResponse = await cart.get();
    expect(beforeResponse.status()).toBe(200);
    const before: Cart = await beforeResponse.json();

    const productResponse = await products.get("p-001");
    expect(productResponse.status()).toBe(200);
    const product: Product = await productResponse.json();

    for (const quantity of [0, product.stock + 1]) {
      await test.step(`Reject quantity ${quantity}`, async () => {
        const rejectedAdd = await cart.add("p-001", quantity);
        expect(rejectedAdd.status()).toBe(400);

        const afterAdd = await cart.get();
        expect(afterAdd.status()).toBe(200);
        expect(await afterAdd.json()).toEqual(before);

        const rejectedUpdate = await cart.update("p-001", quantity);
        expect(rejectedUpdate.status()).toBe(400);

        const afterUpdate = await cart.get();
        expect(afterUpdate.status()).toBe(200);
        expect(await afterUpdate.json()).toEqual(before);
      });
    }
  });

  test(
    "KNOWN BUG-001: cart GST should be 15% (currently 12.5%)",
    { tag: ["@regression", "@known-bug"] },
    async ({ cart }) => {
      const addResponse = await cart.add("p-001", 2);
      expect(addResponse.status()).toBe(201);

      const response = await cart.get();
      expect(response.status()).toBe(200);

      const quote: Cart = await response.json();
      expect(quote.subtotal).toBe(29);

      test.fail(true, "BUG-001: cart calculates 12.5% instead of 15%");
      expect({ gst: quote.gst, total: quote.total }).toEqual({
        gst: 4.35,
        total: 33.35,
      });
    },
  );
});
