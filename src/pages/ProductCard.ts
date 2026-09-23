import type { Locator, Page } from "@playwright/test";

// A product card component, not a separate route.
export class ProductCard {
  readonly loginLink: Locator;
  readonly card: Locator;
  readonly message: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page, readonly id: string) {
    this.loginLink = page.getByTestId(`product-login-${id}`);
    this.card = page.getByTestId(`product-card-${id}`);
    this.message = page.getByTestId(`product-message-${id}`);
    this.addButton = page.getByTestId(`product-add-${id}`);
  }

  async add() {
    await this.addButton.click();
  }
}
