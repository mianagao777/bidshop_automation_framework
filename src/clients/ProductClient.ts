import type { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient";

export class ProductClient extends BaseClient {
  list(
    params: Record<string, string | number | boolean> = {},
  ): Promise<APIResponse> {
    return this.request.get("/products", { params });
  }
  get(id: string): Promise<APIResponse> {
    return this.request.get(`/products/${encodeURIComponent(id)}`);
  }
}
