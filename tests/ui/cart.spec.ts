import { test, expect } from "../../src/fixtures/authenticated.fixture";
import type { Cart } from "../../src/api.types";

test.describe("Cart UI", () => {
  test(
    "updates quantity, removes an item and clears the cart",
    { tag: "@regression" },
    async ({ cart, cartPage, nav }) => {
      const firstAdd = await cart.add("p-001");
      expect(firstAdd.status()).toBe(201);

      const secondAdd = await cart.add("p-008");
      expect(secondAdd.status()).toBe(201);

      await cartPage.goto();
      await expect(cartPage.quantityInput("p-001")).toHaveValue("1");

      await cartPage.quantity("p-001", 3);
      await expect(cartPage.lineTotal("p-001")).toHaveText("$43.50");
      await expect(cartPage.subtotal).toHaveText("$48.90");

      await cartPage.remove("p-008");
      await expect(cartPage.row("p-008")).toHaveCount(0);
      await expect(nav.cartCount).toHaveText("3");

      await cartPage.clear();
      await expect(cartPage.empty).toBeVisible();

      const response = await cart.get();
      expect(response.status()).toBe(200);

      const body: Cart = await response.json();
      expect(body).toMatchObject({ items: [], total: 0 });
    },
  );
});
