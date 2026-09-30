import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Inbox } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, ORDER_STATUS_TEXT } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useToast } from "@/context/ToastContext";
import { cn, formatGNF, timeAgo } from "@/lib/utils";

const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  en_attente: { status: "confirmee", label: "Confirmer" },
  confirmee: { status: "en_preparation", label: "Préparer" },
  en_preparation: { status: "en_route", label: "Expédier" },
  en_route: { status: "livree", label: "Marquer livrée" },
};

const TABS = [
  { value: "a_traiter", label: "À traiter" },
  { value: "livree", label: "Livrées" },
  { value: "annulee", label: "Annulées" },
];

export default function SellerOrdersScreen() {
  return (
    <RequireAuth seller>
      <SellerOrders />
    </RequireAuth>
  );
}

function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("a_traiter");
  const [busy, setBusy] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    api
      .receivedOrders()
      .then(({ orders }) => setOrders(orders))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "livree") return orders.filter((o) => o.status === "livree");
    if (tab === "annulee") return orders.filter((o) => o.status === "annulee");
    return orders.filter((o) => !["livree", "annulee"].includes(o.status));
  }, [orders, tab]);

  async function advance(order: Order) {
    const next = NEXT[order.status];
    if (!next) return;
    setBusy(order.id);
    try {
      const { order: updated } = await api.updateOrderStatus(order.id, next.status);
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)));
      toast(`Commande ${ORDER_STATUS_LABEL[next.status].toLowerCase()}`);
    } catch {
      toast("Mise à jour impossible", "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Commandes reçues" subtitle={`${orders.length} au total`} />

      <View className="flex-row gap-2 border-b border-line-soft dark:border-line-soft-dark px-5 py-3">
        {TABS.map((t) => (
          <Pressable
            key={t.value}
            onPress={() => setTab(t.value)}
            className={cn("rounded-full px-3.5 py-1.5", tab === t.value ? "bg-brand" : "bg-subtle dark:bg-subtle-dark")}
          >
            <Text className={cn("text-xs font-medium", tab === t.value ? "text-white" : "text-muted dark:text-muted-dark")}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerClassName="flex-col gap-3 p-5">
        {loading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Inbox size={24} color="#8e8e98" />} title="Aucune commande dans cet onglet" description="Les commandes de vos acheteurs apparaîtront ici." />
        ) : (
          filtered.map((order) => {
            const next = NEXT[order.status];
            return (
              <View key={order.id} className="rounded-2xl border border-line dark:border-line-dark p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="font-mono text-[11px] text-faint dark:text-faint-dark">{order.reference}</Text>
                  <View className={cn("rounded-full px-2.5 py-0.5", ORDER_STATUS_STYLE[order.status])}>
                    <Text className={cn("text-[11px] font-semibold", ORDER_STATUS_TEXT[order.status])}>{ORDER_STATUS_LABEL[order.status]}</Text>
                  </View>
                </View>

                <Pressable onPress={() => router.push(`/orders/${order.id}`)} className="mt-2">
                  <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{order.buyer?.company || order.buyer?.name}</Text>
                  <Text className="text-xs text-muted dark:text-muted-dark">
                    {order.contact_phone} · {timeAgo(order.created_at)}
                  </Text>
                  <View className="mt-2 flex-col gap-1">
                    {order.items.map((item) => (
                      <View key={item.id} className="flex-row items-center justify-between">
                        <Text numberOfLines={1} className="flex-1 text-xs text-muted dark:text-muted-dark pr-2">
                          {item.quantity} × {item.title}
                        </Text>
                        <Text className="shrink-0 text-xs font-medium text-fg dark:text-fg-dark">{formatGNF(item.unit_price * item.quantity, { short: true })}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="mt-2 text-xs text-muted dark:text-muted-dark">
                    {order.delivery_mode === "retrait" ? "Retrait sur place" : `Livraison — ${order.address}`}
                  </Text>
                </Pressable>

                <View className="mt-3 flex-row items-center gap-2 border-t border-line-soft dark:border-line-soft-dark pt-3">
                  <Text className="flex-1 font-extrabold text-brand">{formatGNF(order.total)}</Text>
                  {next ? (
                    <Button size="sm" loading={busy === order.id} onPress={() => advance(order)}>
                      {next.label}
                    </Button>
                  ) : null}
                  <Button size="sm" variant="secondary" onPress={() => router.push(`/orders/${order.id}`)}>
                    Détails
                  </Button>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
