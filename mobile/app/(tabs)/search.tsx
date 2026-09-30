import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LayoutGrid, List, PackageSearch, SlidersHorizontal, Search as SearchIcon, X } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "recent", label: "Plus récents" },
  { value: "prix_croissant", label: "Prix croissant" },
  { value: "prix_decroissant", label: "Prix décroissant" },
  { value: "populaire", label: "Les plus vus" },
];

export default function Search() {
  const params = useLocalSearchParams<{
    q?: string;
    category?: string;
    region?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const toast = useToast();

  const [query, setQuery] = useState(params.q || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<"grid" | "row">("row");

  const category = params.category || "";
  const region = params.region || "";
  const sort = params.sort || "pertinence";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";

  const activeFilters = useMemo(
    () => [category, region, minPrice, maxPrice].filter(Boolean).length,
    [category, region, minPrice, maxPrice],
  );

  const updateParam = useCallback(
    (key: string, value: string) => {
      router.setParams({ [key]: value || undefined } as never);
    },
    [],
  );

  // Recherche au fil de la frappe, une fois que l'utilisateur marque une pause.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === (params.q || "")) return;
    const timer = setTimeout(() => updateParam("q", trimmed), 450);
    return () => clearTimeout(timer);
  }, [query, params.q, updateParam]);

  const resetFilters = useCallback(() => {
    setQuery("");
    router.setParams({ q: undefined, category: undefined, region: undefined, sort: undefined, minPrice: undefined, maxPrice: undefined } as never);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .products({
        q: params.q || undefined,
        category: category || undefined,
        region: region || undefined,
        sort,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      })
      .then(({ products }) => {
        if (alive) setProducts(products);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [params.q, category, region, sort, minPrice, maxPrice]);

  const toggleFavorite = useCallback(
    async (product: Product) => {
      if (!user) return toast("Connectez-vous pour enregistrer vos favoris", "info");
      const next = !product.is_favorite;
      setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, is_favorite: next } : p)));
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
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <View style={{ paddingTop: insets.top + 12 }} className="border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-4 pb-3">
        <View className="flex-row items-center gap-2">
          <View className="relative flex-1 justify-center">
            <View className="absolute left-3 z-10">
              <SearchIcon size={16} color="#8e8e98" />
            </View>
            <Input
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => updateParam("q", query.trim())}
              placeholder="Rechercher un produit, un vendeur…"
              className="pl-9 pr-9"
            />
            {query ? (
              <Pressable
                onPress={() => {
                  setQuery("");
                  updateParam("q", "");
                }}
                className="absolute right-3"
                hitSlop={8}
              >
                <X size={16} color="#8e8e98" />
              </Pressable>
            ) : null}
          </View>
          <Button variant={activeFilters ? "primary" : "secondary"} size="icon" onPress={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal size={16} color={activeFilters ? "#ffffff" : "#09090b"} />
          </Button>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mt-3 gap-2 pb-1">
          <Chip active={!category} onPress={() => updateParam("category", "")}>
            Toutes
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.value} active={category === c.value} onPress={() => updateParam("category", category === c.value ? "" : c.value)}>
              {c.label}
            </Chip>
          ))}
        </ScrollView>

        {showFilters ? (
          <View className="mt-3 flex-col gap-3 rounded-2xl border border-line dark:border-line-dark bg-subtle-soft dark:bg-subtle-soft-dark p-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Field label="Région">
                  <Select
                    value={region}
                    onValueChange={(v) => updateParam("region", v)}
                    placeholder="Toute la Guinée"
                    options={REGIONS.map((r) => ({ value: r, label: r }))}
                  />
                </Field>
              </View>
              <View className="flex-1">
                <Field label="Trier par">
                  <Select value={sort} onValueChange={(v) => updateParam("sort", v)} options={SORTS} />
                </Field>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Field label="Prix min (GNF)">
                  <Input keyboardType="numeric" value={minPrice} onChangeText={(v) => updateParam("minPrice", v)} placeholder="0" />
                </Field>
              </View>
              <View className="flex-1">
                <Field label="Prix max (GNF)">
                  <Input keyboardType="numeric" value={maxPrice} onChangeText={(v) => updateParam("maxPrice", v)} placeholder="5 000 000" />
                </Field>
              </View>
            </View>
            <Button variant="ghost" size="sm" className="self-start" onPress={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between px-5 py-3">
        <Text className="text-sm text-muted dark:text-muted-dark">
          {loading ? "Recherche…" : `${products.length} résultat${products.length > 1 ? "s" : ""}`}
        </Text>
        <View className="flex-row items-center gap-1 rounded-lg bg-subtle dark:bg-subtle-dark p-0.5">
          <Pressable onPress={() => setLayout("row")} className={cn("rounded-md p-1.5", layout === "row" && "bg-surface dark:bg-surface-dark")}>
            <List size={16} color={layout === "row" ? "#09090b" : "#8e8e98"} />
          </Pressable>
          <Pressable onPress={() => setLayout("grid")} className={cn("rounded-md p-1.5", layout === "grid" && "bg-surface dark:bg-surface-dark")}>
            <LayoutGrid size={16} color={layout === "grid" ? "#09090b" : "#8e8e98"} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-6">
        {loading ? (
          <View className="flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </View>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={24} color="#8e8e98" />}
            title="Aucun produit trouvé"
            description="Essayez d'élargir votre recherche ou de retirer certains filtres."
            action={
              <Button variant="soft" size="sm" onPress={resetFilters}>
                Réinitialiser
              </Button>
            }
          />
        ) : layout === "row" ? (
          <View className="flex-col gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} variant="row" onToggleFavorite={toggleFavorite} />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-y-3 justify-between">
            {products.map((p) => (
              <View key={p.id} style={{ width: "48%" }}>
                <ProductCard product={p} onToggleFavorite={toggleFavorite} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Chip({ active, onPress, children }: { active: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn("shrink-0 rounded-full px-3.5 py-1.5", active ? "bg-brand" : "bg-subtle dark:bg-subtle-dark")}
    >
      <Text className={cn("text-xs font-medium", active ? "text-white" : "text-muted dark:text-muted-dark")}>{children}</Text>
    </Pressable>
  );
}
