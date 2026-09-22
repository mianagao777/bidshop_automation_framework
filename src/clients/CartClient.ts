import type { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient";

export class CartClient extends BaseClient {
  get(): Promise<APIResponse> {
    return this.request.get("/cart", { headers: this.authHeaders });
  }
  add(productId: string, quantity?: number): Promise<APIResponse> {
    return this.request.post("/cart/items", {
      headers: this.authHeaders,
      data: { productId, quantity },
    });
  }
  update(productId: string, quantity: number): Promise<APIResponse> {
    return this.request.patch(`/cart/items/${encodeURIComponent(productId)}`, {
      headers: this.authHeaders,
      data: { quantity },
    });
  }
  remove(productId: string): Promise<APIResponse> {
    return this.request.delete(`/cart/items/${encodeURIComponent(productId)}`, {
      headers: this.authHeaders,
    });
  }
  clear(): Promise<APIResponse> {
    return this.request.delete("/cart", { headers: this.authHeaders });
  }
}
