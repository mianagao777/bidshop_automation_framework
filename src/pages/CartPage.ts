import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly subtotal: Locator;
  readonly empty: Locator;
  readonly checkoutButton: Locator;
  readonly clearButton: Locator;

  constructor(private readonly page: Page) {
    this.subtotal = page.getByTestId("cart-subtotal");
    this.empty = page.getByTestId("cart-empty");
    this.checkoutButton = page.getByTestId("cart-checkout");
    this.clearButton = page.getByTestId("cart-clear");
  }

  quantityInput(id: string) {
    return this.page.getByTestId(`cart-qty-${id}`);
  }

  lineTotal(id: string) {
    return this.page.getByTestId(`cart-line-total-${id}`);
  }

  row(id: string) {
    return this.page.getByTestId(`cart-row-${id}`);
  }

  removeButton(id: string) {
    return this.page.getByTestId(`cart-remove-${id}`);
  }

  async goto() {
    await this.page.goto("/cart");
  }

  async quantity(id: string, quantity: number) {
    await this.quantityInput(id).fill(String(quantity));
  }

  async remove(id: string) {
    await this.removeButton(id).click();
  }

  async clear() {
    await this.clearButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
