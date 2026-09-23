import type { Locator, Page } from "@playwright/test";
import { ProductCard } from "./ProductCard";

export class HomePage {
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly summary: Locator;
  readonly emptyState: Locator;
  readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId("filter-search");
    this.categorySelect = page.getByTestId("filter-category");
    this.summary = page.getByTestId("filter-summary");
    this.emptyState = page.getByTestId("empty-state");
    this.cards = page.getByTestId(/^product-card-/);
  }

  async goto() {
    await this.page.goto("/");
  }

  async search(value: string) {
    await this.searchInput.fill(value);
  }

  async selectCategory(value: string) {
    await this.categorySelect.selectOption(value);
  }

  product(id: string) {
    return new ProductCard(this.page, id);
  }
}
