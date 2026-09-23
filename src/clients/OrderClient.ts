import type { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient";
import type { CustomerInfo } from "../api.types";

export class OrderClient extends BaseClient {
  create(customer: CustomerInfo): Promise<APIResponse> {
    return this.request.post("/orders", {
      headers: this.authHeaders,
      data: { customer },
    });
  }
  list(): Promise<APIResponse> {
    return this.request.get("/orders", { headers: this.authHeaders });
  }
  get(id: string): Promise<APIResponse> {
    return this.request.get(`/orders/${encodeURIComponent(id)}`, {
      headers: this.authHeaders,
    });
  }
}
