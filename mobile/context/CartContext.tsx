import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CartLine, Product } from "@/lib/types";

const STORAGE_KEY = "yehoo.cart";

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  unitPrice: (line: CartLine) => number;
  bySeller: { seller_id: number; seller_name: string; lines: CartLine[]; subtotal: number }[];
}

const CartContext = createContext<CartValue | null>(null);

/** Applique le palier de prix dégressif correspondant à la quantité. */
function priceFor(line: CartLine) {
  if (!line.tiers?.length) return line.price;
  const tier = [...line.tiers]
    .sort((a, b) => a.min_qty - b.min_qty)
    .filter((t) => t.min_qty <= line.quantity)
    .pop();
  return tier?.price ?? line.price;
}

/** Borne une quantite entre le minimum de commande et le stock connu. */
function clampQty(qty: number, line: Pick<CartLine, "min_order" | "stock">) {
  const max = line.stock && line.stock > 0 ? line.stock : Infinity;
  return Math.min(max, Math.max(line.min_order, Math.floor(qty) || line.min_order));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
      })
      .catch(() => {})
      .finally(() => {
        hydrated.current = true;
      });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((product: Product, quantity?: number) => {
    const qty = Math.max(quantity ?? product.min_order, product.min_order);
    setLines((prev) => {
      const existing = prev.find((l) => l.product_id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product_id === product.id
            ? { ...l, stock: product.stock, quantity: clampQty(l.quantity + qty, { ...l, stock: product.stock }) }
            : l,
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          title: product.title,
          image_url: product.image_url,
          unit: product.unit,
          price: product.price,
          min_order: product.min_order,
          quantity: clampQty(qty, product),
          stock: product.stock,
          seller_id: product.seller_id,
          seller_name: product.seller_company || product.seller_name || "Vendeur",
          tiers: product.tiers,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setLines((prev) =>
      prev.map((l) => (l.product_id === productId ? { ...l, quantity: clampQty(quantity, l) } : l)),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setLines((prev) => prev.filter((l) => l.product_id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const subtotal = lines.reduce((sum, l) => sum + priceFor(l) * l.quantity, 0);
    const groups = new Map<number, { seller_id: number; seller_name: string; lines: CartLine[]; subtotal: number }>();
    for (const l of lines) {
      const g = groups.get(l.seller_id) || {
        seller_id: l.seller_id,
        seller_name: l.seller_name,
        lines: [],
        subtotal: 0,
      };
      g.lines.push(l);
      g.subtotal += priceFor(l) * l.quantity;
      groups.set(l.seller_id, g);
    }
    return {
      lines,
      count: lines.length,
      subtotal,
      add,
      setQuantity,
      remove,
      clear,
      unitPrice: priceFor,
      bySeller: [...groups.values()],
    };
  }, [lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}
