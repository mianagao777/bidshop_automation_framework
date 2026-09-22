import type { Locator, Page } from "@playwright/test";

export class OrderConfirmation {
  readonly heading: Locator;
  readonly total: Locator;
  readonly orderIdText: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Order confirmed" });
    this.total = page.getByTestId("order-total");
    this.orderIdText = page.getByTestId("order-id");
  }

  async orderId() {
    return (await this.orderIdText.innerText()).replace(/^#/, "");
  }
}
