import { test, expect } from "../../src/fixtures/authenticated.fixture";
import { CartClient } from "../../src/clients/CartClient";
import { OrderClient } from "../../src/clients/OrderClient";
import { newUser, shippingDetails as customer } from "../../src/utils/testdata";
import type { AuthResponse, Cart, Product } from "../../src/api.types";

test.describe("Order API", () => {
  test(
    "rrejects invalid delivery details and keeps the order state unchanged",
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

  test(
    "rejects checkout when stock is no longer available",
    { tag: "@regression" },
    async ({ cart, orders, products, auth, api }) => {
      // Dedicated SKU: other tests never purchase p-003. Read stock to allow repeats.
      const scarceResponse = await products.get("p-003");
      expect(scarceResponse.status()).toBe(200);
      const scarce: Product = await scarceResponse.json();
      expect(scarce.stock).toBeGreaterThan(1);

      const untouchedResponse = await products.get("p-004");
      expect(untouchedResponse.status()).toBe(200);
      const untouched: Product = await untouchedResponse.json();

      const addUntouched = await cart.add("p-004", 1);
      expect(addUntouched.status()).toBe(201);

      const addScarce = await cart.add("p-003", scarce.stock);
      expect(addScarce.status()).toBe(201);

      const cartResponse = await cart.get();
      expect(cartResponse.status()).toBe(200);
      const beforeCart: Cart = await cartResponse.json();

      const registration = await auth.register(newUser());
      expect(registration.status()).toBe(201);
      const otherAccount: AuthResponse = await registration.json();

      const otherCart = new CartClient(api, otherAccount.token);
      const competingAdd = await otherCart.add("p-003", 1);
      expect(competingAdd.status()).toBe(201);

      const otherOrders = new OrderClient(api, otherAccount.token);
      const competingOrder = await otherOrders.create(customer);
      expect(competingOrder.status()).toBe(201);

      const rejected = await orders.create(customer);
      expect(rejected.status()).toBe(400);
      expect(await rejected.json()).toEqual({
        error: expect.stringContaining("available"),
      });

      const updatedScarce = await products.get("p-003");
      expect(updatedScarce.status()).toBe(200);
      expect((await updatedScarce.json()).stock).toBe(scarce.stock - 1);

      const updatedUntouched = await products.get("p-004");
      expect(updatedUntouched.status()).toBe(200);
      expect(await updatedUntouched.json()).toEqual(untouched);

      const afterCart = await cart.get();
      expect(afterCart.status()).toBe(200);
      expect(await afterCart.json()).toEqual(beforeCart);

      const orderList = await orders.list();
      expect(orderList.status()).toBe(200);
      expect(await orderList.json()).toEqual({ count: 0, items: [] });
    },
  );
});
