import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronRight, MapPin, Search, ShoppingCart, Sprout, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();
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
      const apply = (list: Product[]) =>
        list.map((p) => (p.id === product.id ? { ...p, is_favorite: next } : p));
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
    <div className="flex flex-col">
      {/* En-tête */}
      <header className="rounded-b-3xl bg-linear-to-b from-emerald-700 to-brand px-5 pb-6 pt-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sprout className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-xs text-white/80">
                {user ? `Bonjour ${user.name.split(" ")[0]}` : "Bienvenue sur"}
              </p>
              <p className="font-bold">SooniGN</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/panier"
              className="relative size-9 rounded-full bg-white/15 flex items-center justify-center"
              aria-label="Panier"
            >
              <ShoppingCart className="size-4" />
              {count > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-emerald-900 text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              ) : null}
            </Link>
            <Link
              to={user ? "/commandes" : "/connexion"}
              className="size-9 rounded-full bg-white/15 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </Link>
          </div>
        </div>

        {user?.region ? (
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs">
            <MapPin className="size-3" />
            {user.prefecture ? `${user.prefecture}, ` : ""}
            {user.region}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => navigate("/recherche")}
          className="mt-4 flex w-full items-center gap-2 rounded-xl bg-white px-4 py-3 text-left text-sm text-zinc-400 shadow-sm"
        >
          <Search className="size-4" />
          Riz, ciment, ananas, jus…
        </button>
      </header>

      {/* Catégories */}
      <section className="px-5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-base">Catégories</h2>
          <Link to="/recherche" className="text-xs font-medium text-brand flex items-center">
            Tout voir <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to={`/recherche?category=${c.value}`}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={cn("size-14 rounded-2xl flex items-center justify-center", c.color)}>
                <c.icon className="size-6" />
              </span>
              <span className="text-[11px] font-medium text-center leading-tight">{c.label}</span>
              <span className="-mt-1 text-[10px] text-zinc-400">{counts[c.value] || 0}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bandeau vendeur */}
      {isSeller ? (
        <section className="px-5 pt-5">
          <Link
            to="/espace-vendeur"
            className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4"
          >
            <span className="size-10 rounded-xl bg-brand text-white flex items-center justify-center">
              <TrendingUp className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-sm">Mon espace vendeur</span>
              <span className="block text-xs text-zinc-500">Annonces, commandes reçues et statistiques</span>
            </span>
            <ChevronRight className="size-4 text-zinc-400" />
          </Link>
        </section>
      ) : null}

      {/* En vedette */}
      <section className="pt-6">
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="font-bold text-base">Les plus demandés</h2>
          <Link to="/recherche?sort=populaire" className="text-xs font-medium text-brand flex items-center">
            Tout voir <ChevronRight className="size-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-3 px-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-56 w-44 shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-5 pb-2">
            {featured.map((p) => (
              <div key={p.id} className="w-44 shrink-0">
                <ProductCard product={p} onToggleFavorite={toggleFavorite} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Près de chez vous */}
      {nearby.length ? (
        <section className="px-5 pt-6">
          <h2 className="mb-3 font-bold text-base">
            Près de chez vous <span className="font-normal text-zinc-400 text-sm">· {user?.region}</span>
          </h2>
          <div className="flex flex-col gap-3">
            {nearby.map((p) => (
              <ProductCard key={p.id} product={p} variant="row" onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Nouveautés */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 font-bold text-base">Nouvelles annonces</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </section>

      {!user ? (
        <section className="px-5 py-8">
          <div className="rounded-2xl bg-zinc-900 p-5 text-white">
            <p className="font-bold">Vendez ou achetez en gros</p>
            <p className="mt-1 text-sm text-white/70">
              Créez votre compte pour commander, discuter avec les vendeurs et suivre vos livraisons.
            </p>
            <Button className="mt-4 w-full" onClick={() => navigate("/inscription")}>
              Créer un compte gratuitement
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
