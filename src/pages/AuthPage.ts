import type { Locator, Page } from "@playwright/test";
import type { NavBar } from "./NavBar";

export class AuthPage {
  readonly registerNameInput: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  constructor(
    private readonly page: Page,
    private readonly navBar: NavBar,
  ) {
    this.registerNameInput = page.getByTestId("register-name");
    this.registerEmailInput = page.getByTestId("register-email");
    this.registerPasswordInput = page.getByTestId("register-password");
    this.registerButton = page.getByTestId("register-submit");
    this.loginEmailInput = page.getByTestId("login-email");
    this.loginPasswordInput = page.getByTestId("login-password");
    this.loginButton = page.getByTestId("login-submit");
    this.loginError = page.getByTestId("login-error");
  }

  async register(user: { name: string; email: string; password: string }) {
    await this.page.goto("/register");
    await this.registerNameInput.fill(user.name);
    await this.registerEmailInput.fill(user.email);
    await this.registerPasswordInput.fill(user.password);
    await this.registerButton.click();
    await this.page.waitForURL("/");
  }

  async login(user: { email: string; password: string }) {
    await this.page.goto("/login");
    await this.loginEmailInput.fill(user.email);
    await this.loginPasswordInput.fill(user.password);
    await this.loginButton.click();
  }

  async logout() {
    await this.navBar.logout.click();
  }
}
