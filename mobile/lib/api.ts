import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

import type {
  Conversation,
  Message,
  Order,
  OrderStatus,
  Product,
  SellerStats,
  User,
} from "./types";

const TOKEN_KEY = "yehoo.token";

/**
 * En dev, Expo Go connait deja l'IP locale du poste qui fait tourner
 * `expo start` (hostUri, ex. "192.168.1.23:8081") : on la reutilise pour
 * joindre l'API Express sur le port 4000, sans configuration manuelle.
 * `extra.apiUrl` (app.json) prend le dessus si defini, pour un build de prod.
 */
function resolveApiUrl() {
  // `extra.apiUrl` peut atterrir en `{}` (et non `undefined`/`null`) selon la
  // plateforme de build : ne jamais se fier a la seule verite de l'objet.
  const extra = Constants.expoConfig?.extra as { apiUrl?: unknown } | undefined;
  if (typeof extra?.apiUrl === "string" && extra.apiUrl) return extra.apiUrl;

  // `expo start --web` : pas de hostUri Expo Go, mais l'origine du navigateur
  // convient (meme machine que le serveur API en dev).
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:4000`;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as unknown as { expoGoConfig?: { debuggerHost?: string } }).expoGoConfig
      ?.debuggerHost;
  const host = hostUri?.split(":")[0];
  if (host) return `http://${host}:4000`;

  return "http://localhost:4000";
}

export const API_URL = resolveApiUrl();

/** Prefixe une image relative (/uploads/...) renvoyee par l'API avec l'URL du serveur. */
export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${API_URL}${url}`;
}

// Cache memoire pour un acces synchrone au token (comme localStorage sur le
// web) : hydrate une fois au demarrage par `loadToken()` (voir AuthContext).
let memoryToken: string | null = null;

export async function loadToken() {
  memoryToken = await AsyncStorage.getItem(TOKEN_KEY);
  return memoryToken;
}

export function getToken() {
  return memoryToken;
}

export function setToken(token: string | null) {
  memoryToken = token;
  if (token) AsyncStorage.setItem(TOKEN_KEY, token);
  else AsyncStorage.removeItem(TOKEN_KEY);
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

  const res = await fetch(`${API_URL}/api${path}`, { ...options, headers });
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

/** Image issue d'expo-image-picker, prete a etre envoyee en multipart. */
export interface UploadableImage {
  uri: string;
  name?: string;
  type?: string;
}

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
  /** Verifie qu'un numero est bien forme et encore libre, avant de valider l'inscription. */
  checkPhone: (phone: string) =>
    request<{ phone: string; valid: boolean; available: boolean }>(
      `/auth/check-phone${qs({ phone })}`,
    ),
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
  upload: (image: UploadableImage) => {
    const form = new FormData();
    form.append("image", {
      uri: image.uri,
      name: image.name ?? "upload.jpg",
      type: image.type ?? "image/jpeg",
    } as unknown as Blob);
    return request<{ url: string }>("/upload", { method: "POST", body: form });
  },
};
