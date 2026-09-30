import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { Eye, PackagePlus, Pause, Pencil, Play, Trash2 } from "lucide-react-native";
import { api } from "@/lib/api";
import { useIconColor } from "@/lib/useIconColor";
import { confirmAction } from "@/lib/confirm";
import type { Product } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { imageUrl } from "@/lib/image";
import { cn, formatGNF, formatNumber, timeAgo, unitLabel } from "@/lib/utils";

export default function ListingsScreen() {
  return (
    <RequireAuth seller>
      <Listings />
    </RequireAuth>
  );
}

function Listings() {
  const { user } = useAuth();
  const toast = useToast();
  const iconColor = useIconColor();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "paused">("active");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [active, paused] = await Promise.all([
        api.products({ seller: user.id, status: "active" }),
        api.products({ seller: user.id, status: "paused" }),
      ]);
      setProducts([...active.products, ...paused.products]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(product: Product) {
    const next = product.status === "active" ? "paused" : "active";
    setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, status: next } : p)));
    try {
      await api.updateProduct(product.id, { status: next });
      toast(next === "paused" ? "Annonce mise en pause" : "Annonce réactivée");
    } catch {
      toast("Mise à jour impossible", "error");
      load();
    }
  }

  function remove(product: Product) {
    confirmAction({
      title: "Supprimer l'annonce",
      message: `Supprimer définitivement « ${product.title} » ?`,
      confirmLabel: "Supprimer",
      onConfirm: async () => {
        setProducts((list) => list.filter((p) => p.id !== product.id));
        try {
          await api.deleteProduct(product.id);
          toast("Annonce supprimée");
        } catch {
          toast("Suppression impossible", "error");
          load();
        }
      },
    });
  }

  const filtered = products.filter((p) => p.status === filter);

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        title="Mes annonces"
        subtitle={`${products.length} annonce${products.length > 1 ? "s" : ""}`}
        right={
          <Button size="sm" onPress={() => router.push("/(tabs)/publish")}>
            <PackagePlus size={16} color="#ffffff" />
            <Text className="text-white font-semibold text-sm ml-1">Nouvelle</Text>
          </Button>
        }
      />

      <View className="flex-row gap-2 border-b border-line-soft dark:border-line-soft-dark px-5 py-3">
        {(["active", "paused"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={cn("rounded-full px-3.5 py-1.5", filter === f ? "bg-brand" : "bg-subtle dark:bg-subtle-dark")}
          >
            <Text className={cn("text-xs font-medium", filter === f ? "text-white" : "text-muted dark:text-muted-dark")}>
              {f === "active" ? "Actives" : "En pause"} ({products.filter((p) => p.status === f).length})
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerClassName="flex-col gap-3 p-5">
        {loading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<PackagePlus size={24} color="#8e8e98" />}
            title={filter === "active" ? "Aucune annonce active" : "Aucune annonce en pause"}
            description="Publiez vos produits pour être visible auprès des détaillants de toute la Guinée."
            action={
              <Button size="sm" onPress={() => router.push("/(tabs)/publish")}>
                Publier une annonce
              </Button>
            }
          />
        ) : (
          filtered.map((product) => (
            <View key={product.id} className="rounded-2xl border border-line dark:border-line-dark p-3.5">
              <View className="flex-row gap-3">
                {product.image_url ? (
                  <Image source={{ uri: imageUrl(product.image_url, 80) }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                ) : (
                  <View className="size-20 shrink-0 rounded-xl bg-subtle dark:bg-subtle-dark" />
                )}
                <View className="flex-1">
                  <Pressable onPress={() => router.push(`/product/${product.id}`)}>
                    <Text numberOfLines={2} className="text-sm font-semibold leading-5 text-fg dark:text-fg-dark">
                      {product.title}
                    </Text>
                  </Pressable>
                  <Text className="mt-0.5 text-sm font-bold text-brand">
                    {formatGNF(product.price)}
                    <Text className="text-xs font-normal text-muted dark:text-muted-dark"> / {unitLabel(product.unit)}</Text>
                  </Text>
                  <View className="mt-1 flex-row flex-wrap items-center gap-2">
                    <View className="flex-row items-center gap-1">
                      <Eye size={12} color="#71717b" />
                      <Text className="text-[11px] text-muted dark:text-muted-dark">{formatNumber(product.views)}</Text>
                    </View>
                    <Text className="text-[11px] text-muted dark:text-muted-dark">stock {formatNumber(product.stock)}</Text>
                    <Text className="text-[11px] text-muted dark:text-muted-dark">{timeAgo(product.created_at)}</Text>
                    {product.status === "paused" ? <Badge>En pause</Badge> : null}
                    {product.hidden_at ? (
                      <Badge className="bg-rose-100 dark:bg-rose-500/15" textClassName="text-rose-700 dark:text-rose-300">
                        Masquée après signalements
                      </Badge>
                    ) : null}
                  </View>
                </View>
              </View>

              <View className="mt-3 flex-row items-center gap-2 border-t border-line-soft dark:border-line-soft-dark pt-3">
                <Button variant="ghost" size="sm" className="flex-1" onPress={() => router.push(`/publish/${product.id}`)}>
                  <Pencil size={14} color={iconColor} />
                  <Text className="text-fg-soft dark:text-fg-soft-dark text-sm ml-1.5">Modifier</Text>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onPress={() => toggleStatus(product)}>
                  {product.status === "active" ? (
                    <>
                      <Pause size={14} color={iconColor} />
                      <Text className="text-fg-soft dark:text-fg-soft-dark text-sm ml-1.5">Pause</Text>
                    </>
                  ) : (
                    <>
                      <Play size={14} color={iconColor} />
                      <Text className="text-fg-soft dark:text-fg-soft-dark text-sm ml-1.5">Réactiver</Text>
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onPress={() => remove(product)}>
                  <Trash2 size={14} color="#e11d48" />
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
