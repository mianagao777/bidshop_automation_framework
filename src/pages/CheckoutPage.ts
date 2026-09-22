import type { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly postcodeInput: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByTestId("checkout-name");
    this.emailInput = page.getByTestId("checkout-email");
    this.addressInput = page.getByTestId("checkout-address");
    this.cityInput = page.getByTestId("checkout-city");
    this.postcodeInput = page.getByTestId("checkout-postcode");
    this.subtotal = page.getByTestId("checkout-subtotal");
    this.total = page.getByTestId("checkout-total");
    this.submitButton = page.getByTestId("checkout-submit");
  }

  async fill(customer: Record<string, string>) {
    await this.nameInput.fill(customer.name);
    await this.emailInput.fill(customer.email);
    await this.addressInput.fill(customer.address);
    await this.cityInput.fill(customer.city);
    await this.postcodeInput.fill(customer.postcode);
  }

  async submit() {
    await this.submitButton.click();
  }
}
