import { test, expect } from "../../src/fixtures/test.fixture";
import { newUser, SEED } from "../../src/utils/testdata";

test.describe("Storefront UI", () => {
  test(
    "filters products by category and search, including no results",
    { tag: ["@regression", "@smoke"] },
    async ({ home }) => {
      await home.goto();
      await expect(home.summary).toHaveText(`${SEED.productCount} products`);
      await expect(home.cards).toHaveCount(SEED.productCount);

      await home.selectCategory("Dairy");
      await expect(home.summary).toHaveText(`${SEED.dairyCount} products`);

      await home.search("MILK");
      await expect(home.summary).toHaveText("1 product");
      await expect(home.product("p-008").card).toBeVisible();
      await expect(home.product("p-008").loginLink).toBeVisible();

      await home.search("no-such-food-123");
      await expect(home.emptyState).toBeVisible();
      await expect(home.cards).toHaveCount(0);
    },
  );

  test(
    "supports registration, logout and login",
    { tag: "@regression" },
    async ({ authPage, page, nav }) => {
      const user = newUser();

      await test.step("Register a new customer", async () => {
        await authPage.register(user);
        await expect(nav.userName).toHaveText(
          `Kia ora, ${user.name.split(" ")[0]}`,
        );
      });

      await test.step("Log out", async () => {
        await authPage.logout();
        await expect(nav.login).toBeVisible();
      });

      await test.step("Reject an incorrect password", async () => {
        await authPage.login({ ...user, password: "incorrect" });
        await expect(authPage.loginError).toHaveText(
          "Invalid email or password",
        );
      });

      await test.step("Log in and persist the session after reload", async () => {
        await authPage.login(user);
        await expect(nav.userName).toBeVisible();
        await page.reload();
        await expect(nav.userName).toBeVisible();
      });
    },
  );
});
