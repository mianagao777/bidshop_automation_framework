import { test, expect } from "../../src/fixtures/test.fixture";
import type { Product } from "../../src/api.types";

test.describe("Product API", () => {
  test(
    "filters products by description and inclusive price boundaries",
    { tag: ["@regression", "@smoke"] },
    async ({ products }) => {
      const response = await products.list({
        search: "CANTERBURY",
        category: "Meat & Poultry",
        minPrice: 14.5,
        maxPrice: 14.5,
        inStock: true,
      });

      expect(response.status()).toBe(200);

      const body: { count: number; items: Product[] } = await response.json();

      expect(body.count).toBe(1);
      expect(body.items).toEqual([
        expect.objectContaining({ id: "p-001", price: 14.5 }),
      ]);
    },
  );

  test(
    "returns an empty list when no products match",
    { tag: "@regression" },
    async ({ products }) => {
      const response = await products.list({ search: "no-such-food-123" });

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({ count: 0, items: [] });
    },
  );
});
