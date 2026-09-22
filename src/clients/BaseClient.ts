import type { APIRequestContext } from "@playwright/test";
export class BaseClient {
  constructor(
    protected readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  // Supply bearer authentication when this client has a token.
  protected get authHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
