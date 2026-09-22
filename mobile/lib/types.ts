export type Role = "importateur" | "agriculteur" | "industriel" | "detaillant" | "particulier";

export interface User {
  id: number;
  phone: string;
  name: string;
  role: Role;
  company: string | null;
  category: string | null;
  region: string | null;
  prefecture: string | null;
  address: string | null;
  description: string | null;
  avatar_url: string | null;
  email: string | null;
  verified: boolean;
  rating: number;
  rating_count: number;
  created_at: string;
  meta?: Record<string, unknown> | null;
}

export interface PriceTier {
  min_qty: number;
  price: number;
}

export interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string | null;
  category: string;
  unit: string;
  price: number;
  min_order: number;
  stock: number;
  region: string | null;
  prefecture: string | null;
  image_url: string | null;
  negotiable: boolean;
  delivery: string | null;
  status: "active" | "paused" | "sold";
  views: number;
  created_at: string;
  seller_name?: string;
  seller_company?: string | null;
  seller_role?: Role;
  seller_region?: string | null;
  seller_verified?: boolean;
  seller_rating?: number;
  seller_avatar?: string | null;
  tiers?: PriceTier[];
  is_favorite?: boolean;
}

export type OrderStatus =
  | "en_attente"
  | "confirmee"
  | "en_preparation"
  | "en_route"
  | "livree"
  | "annulee";

export interface OrderItem {
  id: number;
  product_id: number | null;
  title: string;
  image_url: string | null;
  unit: string | null;
  quantity: number;
  unit_price: number;
}

export interface OrderEvent {
  id: number;
  status: OrderStatus;
  label: string;
  detail: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  reference: string;
  buyer_id: number;
  seller_id: number;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_mode: string;
  payment_method: string;
  region: string | null;
  prefecture: string | null;
  address: string | null;
  contact_phone: string | null;
  note: string | null;
  created_at: string;
  items: OrderItem[];
  events: OrderEvent[];
  seller: Partial<User> & { id: number; name: string };
  buyer: Partial<User> & { id: number; name: string };
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number | null;
  created_at: string;
  partner: Pick<User, "id" | "name" | "company" | "role" | "avatar_url" | "verified" | "region">;
  last_message: Message | null;
  unread: number;
  product: Pick<Product, "id" | "title" | "image_url" | "price" | "unit"> | null;
}

export interface CartLine {
  product_id: number;
  title: string;
  image_url: string | null;
  unit: string;
  price: number;
  min_order: number;
  quantity: number;
  seller_id: number;
  seller_name: string;
  tiers?: PriceTier[];
}

export interface SellerStats {
  listings: number;
  active: number;
  views: number;
  pending: number;
  delivered: number;
  revenue: number;
  unread: number;
  monthly: { month: string; orders: number; revenue: number }[];
}
