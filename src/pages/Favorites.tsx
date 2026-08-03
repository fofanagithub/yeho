import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useToast } from "@/context/ToastContext";

export default function Favorites() {
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
    <PhoneShell padBottom={false}>
      <TopBar title="Mes favoris" subtitle={`${products.length} produit${products.length > 1 ? "s" : ""}`} />
      <div className="p-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<HeartOff className="size-6" />}
            title="Aucun favori"
            description="Touchez le cœur sur une annonce pour la retrouver ici."
            action={
              <Link to="/recherche">
                <Button size="sm" variant="soft">
                  Parcourir les produits
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onToggleFavorite={remove} />
            ))}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}
