import type { Locator, Page } from "@playwright/test";

export class NavBar {
  readonly userName: Locator;
  readonly login: Locator;
  readonly logout: Locator;
  readonly cartCount: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.userName = page.getByTestId("nav-user-name");
    this.login = page.getByTestId("nav-login");
    this.logout = page.getByTestId("nav-logout");
    this.cartCount = page.getByTestId("nav-cart-count");
    this.cartLink = page.getByTestId("nav-cart");
  }

  async openCart() {
    await this.cartLink.click();
  }
}
