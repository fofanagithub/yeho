import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, PackagePlus, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatGNF, formatNumber, timeAgo } from "@/lib/utils";

export default function Listings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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

  async function remove(product: Product) {
    if (!confirm(`Supprimer définitivement « ${product.title} » ?`)) return;
    setProducts((list) => list.filter((p) => p.id !== product.id));
    try {
      await api.deleteProduct(product.id);
      toast("Annonce supprimée");
    } catch {
      toast("Suppression impossible", "error");
      load();
    }
  }

  const filtered = products.filter((p) => p.status === filter);

  return (
    <PhoneShell padBottom={false}>
      <TopBar
        title="Mes annonces"
        subtitle={`${products.length} annonce${products.length > 1 ? "s" : ""}`}
        right={
          <Button size="sm" onClick={() => navigate("/publier")}>
            <PackagePlus className="size-4" />
            Nouvelle
          </Button>
        }
      />

      <div className="flex gap-2 border-b border-zinc-100 px-5 py-3">
        {(["active", "paused"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              filter === f ? "bg-brand text-white" : "bg-zinc-100 text-zinc-600",
            )}
          >
            {f === "active" ? "Actives" : "En pause"} (
            {products.filter((p) => p.status === f).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-5">
        {loading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<PackagePlus className="size-6" />}
            title={filter === "active" ? "Aucune annonce active" : "Aucune annonce en pause"}
            description="Publiez vos produits pour être visible auprès des détaillants de toute la Guinée."
            action={
              <Button size="sm" onClick={() => navigate("/publier")}>
                Publier une annonce
              </Button>
            }
          />
        ) : (
          filtered.map((product) => (
            <div key={product.id} className="rounded-2xl border border-zinc-200 p-3.5">
              <div className="flex gap-3">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="size-20 shrink-0 rounded-xl bg-zinc-100" />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/produit/${product.id}`} className="line-clamp-2 text-sm font-semibold leading-5">
                    {product.title}
                  </Link>
                  <p className="mt-0.5 text-sm font-bold text-brand">
                    {formatGNF(product.price)}
                    <span className="text-xs font-normal text-zinc-500"> / {product.unit}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3" />
                      {formatNumber(product.views)}
                    </span>
                    <span>stock {formatNumber(product.stock)}</span>
                    <span>{timeAgo(product.created_at)}</span>
                    {product.status === "paused" ? <Badge>En pause</Badge> : null}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate(`/publier/${product.id}`)}>
                  <Pencil className="size-3.5" />
                  Modifier
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => toggleStatus(product)}>
                  {product.status === "active" ? (
                    <>
                      <Pause className="size-3.5" />
                      Mettre en pause
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5" />
                      Réactiver
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600"
                  onClick={() => remove(product)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </PhoneShell>
  );
}
