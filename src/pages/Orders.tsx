import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/constants";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { imageUrl } from "@/lib/image";
import { cn, formatDate, formatGNF } from "@/lib/utils";

const TABS = [
  { value: "en_cours", label: "En cours" },
  { value: "livree", label: "Livrées" },
  { value: "annulee", label: "Annulées" },
];

export default function Orders() {
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
    <PhoneShell padBottom={false}>
      <TopBar title="Mes commandes" subtitle={`${orders.length} commande${orders.length > 1 ? "s" : ""}`} />

      <div className="flex gap-2 border-b border-line-soft px-5 py-3">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              tab === t.value ? "bg-brand text-white" : "bg-subtle text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 p-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="size-6" />}
          title="Aucune commande ici"
          description="Vos commandes apparaîtront dans cet onglet dès que vous en aurez passé une."
          action={
            <Link to="/recherche">
              <Button size="sm" variant="soft">
                Découvrir les produits
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3 p-5">
          {filtered.map((order) => (
            <Link
              key={order.id}
              to={`/commande/${order.id}`}
              className="rounded-2xl border border-line p-4 hover:border-brand/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">{order.reference}</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    ORDER_STATUS_STYLE[order.status],
                  )}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold">{order.seller?.company || order.seller?.name}</p>
              <p className="text-xs text-muted">
                {order.items.length} article{order.items.length > 1 ? "s" : ""} · {formatDate(order.created_at)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {order.items.slice(0, 4).map((item) =>
                  item.image_url ? (
                    <img key={item.id} src={imageUrl(item.image_url, 44)} alt="" loading="lazy" decoding="async" className="size-11 rounded-lg object-cover" />
                  ) : (
                    <span key={item.id} className="size-11 rounded-lg bg-subtle" />
                  ),
                )}
                <span className="ml-auto font-extrabold text-brand">{formatGNF(order.total, { short: true })}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PhoneShell>
  );
}
