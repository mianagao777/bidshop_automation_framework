import { randomUUID } from "node:crypto";

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export const newUser = (overrides: Partial<NewUser> = {}): NewUser => ({
  name: "Automation Customer",
  email: `user-${randomUUID()}@example.com`,
  password: "Test-only-123!",
  ...overrides,
});

export const shippingDetails = {
  name: "Automation Customer",
  email: "delivery@example.com",
  address: "1 Queen Street",
  city: "Auckland",
  postcode: "1010",
} as const;

// Stable catalogue expectations from backend/src/data/seed.ts.
export const SEED = { productCount: 18, dairyCount: 3 } as const;
