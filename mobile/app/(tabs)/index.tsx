import { useCallback, useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, ChevronRight, MapPin, Search, ShoppingCart, Sprout, TrendingUp } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { user, isSeller } = useAuth();
  const { count } = useCart();
  const toast = useToast();

  const [featured, setFeatured] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [nearby, setNearby] = useState<Product[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pop, rec, cats] = await Promise.all([
        api.products({ sort: "populaire" }),
        api.products({ sort: "recent" }),
        api.productCategories(),
      ]);
      setFeatured(pop.products.slice(0, 8));
      setRecent(rec.products.slice(0, 12));
      setCounts(Object.fromEntries(cats.categories.map((c) => [c.category, c.count])));
      if (user?.region) {
        const near = await api.products({ region: user.region });
        setNearby(near.products.slice(0, 6));
      } else {
        setNearby([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.region]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = useCallback(
    async (product: Product) => {
      if (!user) {
        toast("Connectez-vous pour enregistrer vos favoris", "info");
        return;
      }
      const next = !product.is_favorite;
      const apply = (list: Product[]) => list.map((p) => (p.id === product.id ? { ...p, is_favorite: next } : p));
      setFeatured(apply);
      setRecent(apply);
      setNearby(apply);
      try {
        if (next) await api.addFavorite(product.id);
        else await api.removeFavorite(product.id);
      } catch {
        toast("Impossible de mettre à jour les favoris", "error");
      }
    },
    [user, toast],
  );

  return (
    <ScrollView className="flex-1 bg-canvas dark:bg-canvas-dark" showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#047857", "#00c950"]}
        className="rounded-b-3xl px-5 pb-6"
        style={{ paddingTop: insets.top + 20 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View className="size-9 rounded-xl bg-white/20 items-center justify-center">
              <Sprout size={20} color="#ffffff" />
            </View>
            <View>
              <Text className="text-xs text-white/80">{user ? `Bonjour ${user.name.split(" ")[0]}` : "Bienvenue sur"}</Text>
              <Text className="font-bold text-white">Yehoo</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable onPress={() => router.push("/cart")} className="relative size-9 rounded-full bg-white/15 items-center justify-center">
              <ShoppingCart size={16} color="#ffffff" />
              {count > 0 ? (
                <View className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-amber-400 items-center justify-center">
                  <Text className="text-emerald-900 text-[10px] font-bold">{count}</Text>
                </View>
              ) : null}
            </Pressable>
            <Pressable
              onPress={() => router.push(user ? "/orders" : "/login")}
              className="size-9 rounded-full bg-white/15 items-center justify-center"
            >
              <Bell size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {user?.region ? (
          <View className="mt-3 self-start flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
            <MapPin size={12} color="#ffffff" />
            <Text className="text-xs text-white">
              {user.prefecture ? `${user.prefecture}, ` : ""}
              {user.region}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push("/(tabs)/search")}
          className="mt-4 flex-row items-center gap-2 rounded-xl bg-surface px-4 py-3"
        >
          <Search size={16} color="#8e8e98" />
          <Text className="text-sm text-faint">Riz, ciment, ananas, jus…</Text>
        </Pressable>
      </LinearGradient>

      <View className="px-5 pt-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-base text-fg dark:text-fg-dark">Catégories</Text>
          <Link href="/(tabs)/search" className="text-xs font-medium text-brand">
            Tout voir
          </Link>
        </View>
        <View className="flex-row flex-wrap gap-y-3 justify-between">
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.value}
              onPress={() => router.push({ pathname: "/(tabs)/search", params: { category: c.value } })}
              className="items-center gap-1.5"
              style={{ width: "23%" }}
            >
              <View className={`size-14 rounded-2xl items-center justify-center ${c.color}`}>
                <c.icon size={24} color="#374151" />
              </View>
              <Text className="text-[11px] font-medium text-center leading-tight text-fg dark:text-fg-dark">{c.label}</Text>
              <Text className="-mt-1 text-[10px] text-faint dark:text-faint-dark">{counts[c.value] || 0}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isSeller ? (
        <View className="px-5 pt-5">
          <Pressable
            onPress={() => router.push("/seller/dashboard")}
            className="flex-row items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4"
          >
            <View className="size-10 rounded-xl bg-brand items-center justify-center">
              <TrendingUp size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-sm text-fg dark:text-fg-dark">Mon espace vendeur</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">Annonces, commandes reçues et statistiques</Text>
            </View>
            <ChevronRight size={16} color="#8e8e98" />
          </Pressable>
        </View>
      ) : null}

      <View className="pt-6">
        <View className="mb-3 flex-row items-center justify-between px-5">
          <Text className="font-bold text-base text-fg dark:text-fg-dark">Les plus demandés</Text>
          <Link href={{ pathname: "/(tabs)/search", params: { sort: "populaire" } }} className="text-xs font-medium text-brand">
            Tout voir
          </Link>
        </View>
        {loading ? (
          <View className="flex-row gap-3 px-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-56 w-44 shrink-0" />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 px-5 pb-2">
            {featured.map((p) => (
              <View key={p.id} className="w-44 shrink-0">
                <ProductCard product={p} onToggleFavorite={toggleFavorite} />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {nearby.length ? (
        <View className="px-5 pt-6">
          <Text className="mb-3 font-bold text-base text-fg dark:text-fg-dark">
            Près de chez vous <Text className="font-normal text-faint dark:text-faint-dark text-sm">· {user?.region}</Text>
          </Text>
          <View className="flex-col gap-3">
            {nearby.map((p) => (
              <ProductCard key={p.id} product={p} variant="row" onToggleFavorite={toggleFavorite} />
            ))}
          </View>
        </View>
      ) : null}

      <View className="px-5 pt-6">
        <Text className="mb-3 font-bold text-base text-fg dark:text-fg-dark">Nouvelles annonces</Text>
        {loading ? (
          <View className="flex-row flex-wrap gap-3 justify-between">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56" style={{ width: "48%" }} />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-y-3 justify-between">
            {recent.map((p) => (
              <View key={p.id} style={{ width: "48%" }}>
                <ProductCard product={p} onToggleFavorite={toggleFavorite} />
              </View>
            ))}
          </View>
        )}
      </View>

      {!user ? (
        <View className="px-5 py-8">
          <View className="rounded-2xl bg-zinc-900 p-5">
            <Text className="font-bold text-white">Vendez ou achetez en gros</Text>
            <Text className="mt-1 text-sm text-white/70">
              Créez votre compte pour commander, discuter avec les vendeurs et suivre vos livraisons.
            </Text>
            <Button className="mt-4 w-full" onPress={() => router.push("/register")}>
              Créer un compte gratuitement
            </Button>
          </View>
        </View>
      ) : null}
      <View className="h-6" />
    </ScrollView>
  );
}
