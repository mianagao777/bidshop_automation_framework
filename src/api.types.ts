// Test-owned contract types: do not import implementation types as the oracle.
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
}
export interface CartLine {
  productId: string;
  quantity: number;
  name: string;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
}
export interface Cart {
  userId: string;
  items: CartLine[];
  subtotal: number;
  gst: number;
  total: number;
  updatedAt: string;
}
export type OrderStatus = "PENDING" | "CONFIRMED";

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartLine[];
  status: OrderStatus;
  customer: CustomerInfo;
  subtotal: number;
  gst: number;
  total: number;
  createdAt: string;
}
