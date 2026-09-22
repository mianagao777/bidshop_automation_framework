import { test, expect } from "../../src/fixtures/test.fixture";
import { AuthClient } from "../../src/clients/AuthClient";
import { newUser } from "../../src/utils/testdata";
import type { AuthResponse } from "../../src/api.types";

test.describe("Auth API", () => {
  test(
    "registers a new user and returns a token",
    { tag: ["@regression", "@smoke"] },
    async ({ auth }) => {
      const credentials = newUser();

      const response = await auth.register(credentials);

      expect(response.status()).toBe(201);

      const body: AuthResponse = await response.json();

      expect(body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(String),
          name: credentials.name,
          email: credentials.email,
        },
      });
    },
  );

  test("logs in and returns the same user as registration", { tag: "@regression" }, async ({
    auth,
  }) => {
    const credentials = newUser();

    const registerResponse = await auth.register(credentials);
    expect(registerResponse.status()).toBe(201);

    const registered: AuthResponse = await registerResponse.json();

    const loginResponse = await auth.login(credentials);
    expect(loginResponse.status()).toBe(200);

    const session: AuthResponse = await loginResponse.json();

    expect(session.user).toEqual(registered.user);
  });

  test("returns the authenticated user with a valid token", { tag: "@regression" }, async ({
    api,
    auth,
  }) => {
    const credentials = newUser();

    const registerResponse = await auth.register(credentials);
    expect(registerResponse.status()).toBe(201);

    const registered: AuthResponse = await registerResponse.json();

    const authedClient = new AuthClient(api, registered.token);

    const response = await authedClient.me();

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(registered.user);
  });

  test("rejects duplicate registration", { tag: "@regression" }, async ({ auth }) => {
    const credentials = newUser();

    const firstResponse = await auth.register(credentials);

    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await auth.register(credentials);

    expect(duplicateResponse.status()).toBe(409);
  });

  test("rejects wrong password without issuing a token", { tag: "@regression" }, async ({ auth }) => {
    const credentials = newUser();

    const registerResponse = await auth.register(credentials);

    expect(registerResponse.status()).toBe(201);

    const response = await auth.login({
      ...credentials,
      password: "wrong-password",
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.token).toBeUndefined();
  });
});
