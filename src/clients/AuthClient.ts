import type { APIResponse } from "@playwright/test";
import { BaseClient } from "./BaseClient";

export class AuthClient extends BaseClient {
  register(data: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post("/auth/register", { data });
  }

  login(data: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post("/auth/login", { data });
  }
  me(): Promise<APIResponse> {
    return this.request.get("/auth/me", { headers: this.authHeaders });
  }
}
