import type {
  Conversation,
  Message,
  Order,
  OrderStatus,
  Product,
  SellerStats,
  User,
} from "./types";

const TOKEN_KEY = "sooni.token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`/api${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) throw new ApiError(data?.error || "Une erreur est survenue", res.status);
  return data as T;
}

const qs = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
};

export const api = {
  /* --- Auth --- */
  register: (payload: Record<string, unknown>) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (phone: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    }),
  me: () => request<{ user: User }>("/auth/me"),
  updateMe: (payload: Record<string, unknown>) =>
    request<{ user: User }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),

  /* --- Produits --- */
  products: (params: Record<string, string | number | undefined> = {}) =>
    request<{ products: Product[] }>(`/products${qs(params)}`),
  product: (id: number | string) =>
    request<{ product: Product; similar: Product[] }>(`/products/${id}`),
  productCategories: () =>
    request<{ categories: { category: string; count: number }[] }>("/products/categories"),
  createProduct: (payload: Record<string, unknown>) =>
    request<{ product: Product }>("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id: number, payload: Record<string, unknown>) =>
    request<{ product: Product }>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteProduct: (id: number) => request<{ ok: true }>(`/products/${id}`, { method: "DELETE" }),

  /* --- Vendeurs --- */
  seller: (id: number | string) =>
    request<{
      seller: User;
      products: Product[];
      reviews: { id: number; rating: number; comment: string | null; author_name: string; created_at: string }[];
      sales: number;
    }>(`/sellers/${id}`),
  reviewSeller: (id: number, rating: number, comment?: string) =>
    request<{ ok: true }>(`/sellers/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    }),

  /* --- Commandes --- */
  createOrder: (payload: Record<string, unknown>) =>
    request<{ orders: Order[] }>("/orders", { method: "POST", body: JSON.stringify(payload) }),
  orders: () => request<{ orders: Order[] }>("/orders"),
  receivedOrders: () => request<{ orders: Order[] }>("/orders/received"),
  order: (id: number | string) => request<{ order: Order }>(`/orders/${id}`),
  updateOrderStatus: (id: number, status: OrderStatus, detail?: string) =>
    request<{ order: Order }>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, detail }),
    }),

  /* --- Messagerie --- */
  conversations: () => request<{ conversations: Conversation[] }>("/conversations"),
  startConversation: (payload: { seller_id: number; product_id?: number; body?: string }) =>
    request<{ conversation: Conversation }>("/conversations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  messages: (id: number | string) =>
    request<{ conversation: Conversation; messages: Message[] }>(`/conversations/${id}/messages`),
  sendMessage: (id: number, body: string) =>
    request<{ message: Message }>(`/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  /* --- Divers --- */
  favorites: () => request<{ products: Product[] }>("/favorites"),
  addFavorite: (productId: number) =>
    request<{ is_favorite: boolean }>(`/favorites/${productId}`, { method: "POST" }),
  removeFavorite: (productId: number) =>
    request<{ is_favorite: boolean }>(`/favorites/${productId}`, { method: "DELETE" }),
  stats: () => request<{ stats: SellerStats }>("/stats"),
  upload: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<{ url: string }>("/upload", { method: "POST", body: form });
  },
};
