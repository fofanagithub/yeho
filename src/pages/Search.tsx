import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, PackageSearch, SlidersHorizontal, Search as SearchIcon, X } from "lucide-react";
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
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [query, setQuery] = useState(params.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<"grid" | "row">("row");

  const category = params.get("category") || "";
  const region = params.get("region") || "";
  const sort = params.get("sort") || "pertinence";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";

  const activeFilters = useMemo(
    () => [category, region, minPrice, maxPrice].filter(Boolean).length,
    [category, region, minPrice, maxPrice],
  );

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .products({
        q: params.get("q") || undefined,
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
  }, [params, category, region, sort, minPrice, maxPrice]);

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
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white px-4 pb-3 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam("q", query.trim());
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, un vendeur…"
              className="pl-9 pr-9"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  updateParam("q", "");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
          <Button
            type="button"
            variant={activeFilters ? "primary" : "secondary"}
            size="icon"
            onClick={() => setShowFilters((s) => !s)}
            aria-label="Filtres"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </form>

        <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip active={!category} onClick={() => updateParam("category", "")}>
            Toutes
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.value}
              active={category === c.value}
              onClick={() => updateParam("category", category === c.value ? "" : c.value)}
            >
              {c.label}
            </Chip>
          ))}
        </div>

        {showFilters ? (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Région">
                <Select value={region} onChange={(e) => updateParam("region", e.target.value)}>
                  <option value="">Toute la Guinée</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Trier par">
                <Select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix min (GNF)">
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => updateParam("minPrice", e.target.value)}
                  placeholder="0"
                />
              </Field>
              <Field label="Prix max (GNF)">
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => updateParam("maxPrice", e.target.value)}
                  placeholder="5 000 000"
                />
              </Field>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : null}
      </header>

      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-sm text-zinc-500">
          {loading ? "Recherche…" : `${products.length} résultat${products.length > 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
          <button
            onClick={() => setLayout("row")}
            className={cn("rounded-md p-1.5", layout === "row" ? "bg-white shadow-sm" : "text-zinc-400")}
            aria-label="Vue liste"
          >
            <List className="size-4" />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={cn("rounded-md p-1.5", layout === "grid" ? "bg-white shadow-sm" : "text-zinc-400")}
            aria-label="Vue grille"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>
      </div>

      <div className="px-5 pb-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<PackageSearch className="size-6" />}
            title="Aucun produit trouvé"
            description="Essayez d'élargir votre recherche ou de retirer certains filtres."
            action={
              <Button variant="soft" size="sm" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Réinitialiser
              </Button>
            }
          />
        ) : layout === "row" ? (
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} variant="row" onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
        active ? "bg-brand text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
