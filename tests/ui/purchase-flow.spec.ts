import { test, expect } from "../../src/fixtures/authenticated.fixture";
import { shippingDetails as customer } from "../../src/utils/testdata";
import type { Cart, Product } from "../../src/api.types";

test.describe("Purchase flow UI", () => {
  test(
    "buys a product and shows a persisted order with a cleared cart",
    { tag: ["@regression", "@smoke"] },
    async ({
      home,
      cartPage,
      checkout,
      orders,
      cart,
      products,
      nav,
      confirmation,
    }) => {
      await home.goto();
      await expect(nav.userName).toBeVisible();

      const beforeResponse = await products.get("p-008");
      expect(beforeResponse.status()).toBe(200);
      const before: Product = await beforeResponse.json();

      await home.search("Anchor Full Cream Milk");
      await expect(home.summary).toHaveText("1 product");

      await home.product("p-008").add();
      await expect(home.product("p-008").message).toHaveText("Added to cart");

      await nav.openCart();
      await expect(cartPage.subtotal).toHaveText("$5.40");

      await cartPage.checkout();
      await checkout.fill(customer);
      await checkout.submit();

      await expect(confirmation.heading).toBeVisible();
      await expect(confirmation.total).toHaveText("$6.21");

      const id = await confirmation.orderId();
      const response = await orders.get(id);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({
        status: "CONFIRMED",
        customer,
        subtotal: 5.4,
        gst: 0.81,
        total: 6.21,
        items: [{ productId: "p-008", quantity: 1 }],
      });

      const updatedProduct = await products.get("p-008");
      expect(updatedProduct.status()).toBe(200);
      expect((await updatedProduct.json()).stock).toBe(before.stock - 1);

      const emptiedCart = await cart.get();
      expect(emptiedCart.status()).toBe(200);
      const cartBody: Cart = await emptiedCart.json();
      expect(cartBody).toMatchObject({ items: [], total: 0 });

      await nav.openCart();
      await expect(cartPage.empty).toBeVisible();
    },
  );

  test(
    "KNOWN BUG-001: checkout quote should match final charge",
    { tag: ["@regression", "@known-bug"] },
    async ({ cart, cartPage, checkout, confirmation }) => {
      const addResponse = await cart.add("p-001", 2);
      expect(addResponse.status()).toBe(201);

      await cartPage.goto();
      await cartPage.checkout();
      await expect(checkout.subtotal).toHaveText("$29.00");
      const quoted = await checkout.total.innerText();

      await checkout.fill(customer);
      await checkout.submit();
      await expect(confirmation.heading).toBeVisible();
      await expect(confirmation.total).toHaveText("$33.35");
      const charged = await confirmation.total.innerText();

      test.fail(true, "BUG-001: checkout quote and order total do not match");
      expect(quoted).toBe(charged);
    },
  );
});
