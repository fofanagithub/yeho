import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { HeartOff } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useToast } from "@/context/ToastContext";

export default function FavoritesScreen() {
  return (
    <RequireAuth>
      <Favorites />
    </RequireAuth>
  );
}

function Favorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    api
      .favorites()
      .then(({ products }) => setProducts(products))
      .finally(() => setLoading(false));
  }, []);

  async function remove(product: Product) {
    setProducts((list) => list.filter((p) => p.id !== product.id));
    try {
      await api.removeFavorite(product.id);
    } catch {
      toast("Impossible de retirer ce favori", "error");
    }
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Mes favoris" subtitle={`${products.length} produit${products.length > 1 ? "s" : ""}`} />
      <ScrollView contentContainerClassName="p-5">
        {loading ? (
          <View className="flex-row flex-wrap gap-y-3 justify-between">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56" style={{ width: "48%" }} />
            ))}
          </View>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<HeartOff size={24} color="#8e8e98" />}
            title="Aucun favori"
            description="Touchez le cœur sur une annonce pour la retrouver ici."
            action={
              <Button size="sm" variant="soft" onPress={() => router.push("/(tabs)/search")}>
                Parcourir les produits
              </Button>
            }
          />
        ) : (
          <View className="flex-row flex-wrap gap-y-3 justify-between">
            {products.map((p) => (
              <View key={p.id} style={{ width: "48%" }}>
                <ProductCard product={p} onToggleFavorite={remove} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
