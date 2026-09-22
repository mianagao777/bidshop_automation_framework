import { test as base, expect } from "./test.fixture";
import { newUser, type NewUser } from "../utils/testdata";
import type { AuthResponse } from "../api.types";
import { CartClient } from "../clients/CartClient";
import { OrderClient } from "../clients/OrderClient";

import { uiURL } from "../../env";

const TOKEN_KEY = "bidshop.token"; // Must match the frontend localStorage key.

type Account = AuthResponse & { credentials: NewUser };

type AuthenticatedFixtures = {
  account: Account;
  cart: CartClient;
  orders: OrderClient;
};

const loggedInState = (token: string) => ({
  cookies: [],
  origins: [
    {
      origin: uiURL,
      localStorage: [{ name: TOKEN_KEY, value: token }],
    },
  ],
});

export const test = base.extend<AuthenticatedFixtures>({
  account: async ({ auth }, use) => {
    const credentials = newUser();
    const response = await auth.register(credentials);
    expect(response.status()).toBe(201);
    const registered: AuthResponse = await response.json();
    await use({ ...registered, credentials });
  },

  cart: async ({ api, account }, use) => {
    await use(new CartClient(api, account.token));
  },

  orders: async ({ api, account }, use) => {
    await use(new OrderClient(api, account.token));
  },

  // Fixtures are lazy: API-only tests never request storageState,
  // so they stay browser-free.
  storageState: async ({ account }, use) => {
    await use(loggedInState(account.token));
  },
});

export { expect };
