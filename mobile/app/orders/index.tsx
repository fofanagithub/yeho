import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { PackageOpen } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, ORDER_STATUS_TEXT } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { imageUrl } from "@/lib/image";
import { cn, formatDate, formatGNF } from "@/lib/utils";

const TABS = [
  { value: "en_cours", label: "En cours" },
  { value: "livree", label: "Livrées" },
  { value: "annulee", label: "Annulées" },
];

export default function OrdersScreen() {
  return (
    <RequireAuth>
      <Orders />
    </RequireAuth>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("en_cours");

  useEffect(() => {
    api
      .orders()
      .then(({ orders }) => setOrders(orders))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "livree") return orders.filter((o) => o.status === "livree");
    if (tab === "annulee") return orders.filter((o) => o.status === "annulee");
    return orders.filter((o) => !["livree", "annulee"].includes(o.status));
  }, [orders, tab]);

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Mes commandes" subtitle={`${orders.length} commande${orders.length > 1 ? "s" : ""}`} />

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

      {loading ? (
        <View className="flex-col gap-3 p-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PackageOpen size={24} color="#8e8e98" />}
          title="Aucune commande ici"
          description="Vos commandes apparaîtront dans cet onglet dès que vous en aurez passé une."
          action={
            <Button size="sm" variant="soft" onPress={() => router.push("/(tabs)/search")}>
              Découvrir les produits
            </Button>
          }
        />
      ) : (
        <ScrollView contentContainerClassName="flex-col gap-3 p-5">
          {filtered.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => router.push(`/orders/${order.id}`)}
              className="rounded-2xl border border-line dark:border-line-dark p-4"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-mono text-xs text-muted dark:text-muted-dark">{order.reference}</Text>
                <View className={cn("rounded-full px-2.5 py-0.5", ORDER_STATUS_STYLE[order.status])}>
                  <Text className={cn("text-[11px] font-semibold", ORDER_STATUS_TEXT[order.status])}>{ORDER_STATUS_LABEL[order.status]}</Text>
                </View>
              </View>
              <Text className="mt-2 text-sm font-semibold text-fg dark:text-fg-dark">{order.seller?.company || order.seller?.name}</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">
                {order.items.length} article{order.items.length > 1 ? "s" : ""} · {formatDate(order.created_at)}
              </Text>
              <View className="mt-3 flex-row items-center gap-2">
                {order.items.slice(0, 4).map((item) =>
                  item.image_url ? (
                    <Image key={item.id} source={{ uri: imageUrl(item.image_url, 44) }} style={{ width: 44, height: 44, borderRadius: 8 }} contentFit="cover" />
                  ) : (
                    <View key={item.id} className="size-11 rounded-lg bg-subtle dark:bg-subtle-dark" />
                  ),
                )}
                <Text className="ml-auto font-extrabold text-brand">{formatGNF(order.total, { short: true })}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
