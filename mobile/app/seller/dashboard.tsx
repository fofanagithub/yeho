import { useEffect, useState, type ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ChevronRight, Eye, MessageCircle, Package, PlusCircle, ShoppingBag, TrendingUp, Wallet } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Order, SellerStats } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, ORDER_STATUS_TEXT } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { cn, formatGNF, formatNumber, timeAgo } from "@/lib/utils";

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export default function DashboardScreen() {
  return (
    <RequireAuth seller>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.receivedOrders()])
      .then(([s, o]) => {
        setStats(s.stats);
        setOrders(o.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = orders.filter((o) => !["livree", "annulee"].includes(o.status));
  const maxRevenue = Math.max(1, ...(stats?.monthly || []).map((m) => m.revenue));

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Espace vendeur" subtitle={user?.company || user?.name} />

      <ScrollView contentContainerClassName="flex-col gap-5 p-5">
        {loading ? (
          <View className="flex-row flex-wrap gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" style={{ width: "48%" }} />
            ))}
          </View>
        ) : stats ? (
          <View className="flex-row flex-wrap gap-3">
            <KpiCard
              icon={<Wallet size={16} color="#71717b" />}
              label="Chiffre d'affaires"
              value={formatGNF(stats.revenue, { short: true })}
              hint={`${stats.delivered} commande${stats.delivered > 1 ? "s" : ""} livrée${stats.delivered > 1 ? "s" : ""}`}
              accent
            />
            <KpiCard icon={<ShoppingBag size={16} color="#71717b" />} label="À traiter" value={formatNumber(stats.pending)} hint="commandes en cours" />
            <KpiCard icon={<Package size={16} color="#71717b" />} label="Annonces actives" value={formatNumber(stats.active)} hint={`${stats.listings} au total`} />
            <KpiCard icon={<Eye size={16} color="#71717b" />} label="Vues cumulées" value={formatNumber(stats.views)} hint="sur vos annonces" />
          </View>
        ) : null}

        <View className="flex-row gap-3">
          <Button className="flex-1" onPress={() => router.push("/(tabs)/publish")}>
            <PlusCircle size={16} color="#ffffff" />
            <Text className="text-white font-semibold text-sm ml-2">Publier</Text>
          </Button>
          <Button variant="outline" className="flex-1" onPress={() => router.push("/seller/listings")}>
            Mes annonces
          </Button>
        </View>

        {stats?.monthly?.length ? (
          <View className="rounded-2xl border border-line dark:border-line-dark p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <TrendingUp size={16} color="#00c950" />
              <Text className="font-semibold text-sm text-fg dark:text-fg-dark">Ventes des derniers mois</Text>
            </View>
            <View className="flex-row items-end justify-between gap-2" style={{ height: 112 }}>
              {[...stats.monthly].reverse().map((m) => (
                <View key={m.month} className="flex-1 items-center gap-1.5">
                  <Text className="text-[10px] text-muted dark:text-muted-dark">{formatGNF(m.revenue, { short: true })}</Text>
                  <View className="w-full rounded-t-md bg-brand/80" style={{ height: Math.max(4, (m.revenue / maxRevenue) * 72) }} />
                  <Text className="text-[10px] text-faint dark:text-faint-dark">{MOIS[Number(m.month.slice(5)) - 1]}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="flex-col gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-base text-fg dark:text-fg-dark">Commandes à traiter</Text>
            <Pressable onPress={() => router.push("/seller/orders")}>
              <Text className="text-xs font-medium text-brand">Tout voir</Text>
            </Pressable>
          </View>
          {pending.length === 0 ? (
            <Text className="rounded-2xl bg-subtle-soft dark:bg-subtle-soft-dark p-4 text-sm text-muted dark:text-muted-dark">
              Aucune commande en attente. Publiez de nouvelles annonces pour attirer des acheteurs.
            </Text>
          ) : (
            pending.slice(0, 4).map((order) => (
              <Pressable
                key={order.id}
                onPress={() => router.push(`/orders/${order.id}`)}
                className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-3.5"
              >
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-mono text-[11px] text-faint dark:text-faint-dark">{order.reference}</Text>
                    <View className={cn("rounded-full px-2 py-0.5", ORDER_STATUS_STYLE[order.status])}>
                      <Text className={cn("text-[10px] font-semibold", ORDER_STATUS_TEXT[order.status])}>{ORDER_STATUS_LABEL[order.status]}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} className="text-sm font-semibold text-fg dark:text-fg-dark">
                    {order.buyer?.company || order.buyer?.name}
                  </Text>
                  <Text className="text-xs text-muted dark:text-muted-dark">
                    {order.items.length} article{order.items.length > 1 ? "s" : ""} · {timeAgo(order.created_at)}
                  </Text>
                </View>
                <Text className="font-bold text-brand text-sm">{formatGNF(order.total, { short: true })}</Text>
              </Pressable>
            ))
          )}
        </View>

        {stats?.unread ? (
          <Pressable onPress={() => router.push("/(tabs)/messages")} className="flex-row items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4">
            <MessageCircle size={20} color="#00c950" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-fg dark:text-fg-dark">
                {stats.unread} message non lu{stats.unread > 1 ? "s" : ""}
              </Text>
              <Text className="text-xs text-muted dark:text-muted-dark">Répondez vite pour ne pas perdre la vente</Text>
            </View>
            <ChevronRight size={16} color="#8e8e98" />
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

function KpiCard({ icon, label, value, hint, accent }: { icon: ReactNode; label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <View className={cn("rounded-2xl border p-4", accent ? "border-brand/20 bg-brand/5" : "border-line dark:border-line-dark bg-surface dark:bg-surface-dark")} style={{ width: "48%" }}>
      <View className="flex-row items-center gap-1.5">
        {icon}
        <Text className="text-[11px] text-muted dark:text-muted-dark">{label}</Text>
      </View>
      <Text className={cn("mt-1 font-extrabold text-lg leading-6", accent ? "text-brand" : "text-fg dark:text-fg-dark")}>{value}</Text>
      {hint ? <Text className="text-[11px] text-faint dark:text-faint-dark">{hint}</Text> : null}
    </View>
  );
}
