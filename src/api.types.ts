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
  stock: number;
}
export interface CartLine {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
export interface Cart {
  userId: string;
  items: CartLine[];
  subtotal: number;
  gst: number;
  total: number;
}
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
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
}
