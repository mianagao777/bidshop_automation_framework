import { test as base, expect, type APIRequestContext } from "@playwright/test";
import { apiURL } from "../../env";
import { AuthClient } from "../clients/AuthClient";
import { ProductClient } from "../clients/ProductClient";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { NavBar } from "../pages/NavBar";
import { OrderConfirmation } from "../pages/OrderConfirmation";

type Fixtures = {
  api: APIRequestContext;
  auth: AuthClient;
  products: ProductClient;
  authPage: AuthPage;
  home: HomePage;
  cartPage: CartPage;
  checkout: CheckoutPage;
  nav: NavBar;
  confirmation: OrderConfirmation;
};

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: apiURL,
    });

    await use(api);

    await api.dispose();
  },

  auth: async ({ api }, use) => {
    await use(new AuthClient(api));
  },

  products: async ({ api }, use) => {
    await use(new ProductClient(api));
  },

  authPage: async ({ page, nav }, use) => {
    await use(new AuthPage(page, nav));
  },

  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  nav: async ({ page }, use) => {
    await use(new NavBar(page));
  },

  confirmation: async ({ page }, use) => {
    await use(new OrderConfirmation(page));
  },
});

export { expect };
