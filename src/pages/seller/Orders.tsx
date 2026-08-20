import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/constants";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { useToast } from "@/context/ToastContext";
import { cn, formatGNF, timeAgo } from "@/lib/utils";

const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  en_attente: { status: "confirmee", label: "Confirmer" },
  confirmee: { status: "en_preparation", label: "Préparer" },
  en_preparation: { status: "en_route", label: "Expédier" },
  en_route: { status: "livree", label: "Marquer livrée" },
};

const TABS = [
  { value: "a_traiter", label: "À traiter" },
  { value: "livree", label: "Livrées" },
  { value: "annulee", label: "Annulées" },
];

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("a_traiter");
  const [busy, setBusy] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    api
      .receivedOrders()
      .then(({ orders }) => setOrders(orders))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "livree") return orders.filter((o) => o.status === "livree");
    if (tab === "annulee") return orders.filter((o) => o.status === "annulee");
    return orders.filter((o) => !["livree", "annulee"].includes(o.status));
  }, [orders, tab]);

  async function advance(order: Order) {
    const next = NEXT[order.status];
    if (!next) return;
    setBusy(order.id);
    try {
      const { order: updated } = await api.updateOrderStatus(order.id, next.status);
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)));
      toast(`Commande ${ORDER_STATUS_LABEL[next.status].toLowerCase()}`);
    } catch {
      toast("Mise à jour impossible", "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <PhoneShell padBottom={false}>
      <TopBar title="Commandes reçues" subtitle={`${orders.length} au total`} />

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

      <div className="flex flex-col gap-3 p-5">
        {loading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-6" />}
            title="Aucune commande dans cet onglet"
            description="Les commandes de vos acheteurs apparaîtront ici."
          />
        ) : (
          filtered.map((order) => {
            const next = NEXT[order.status];
            return (
              <div key={order.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-faint">{order.reference}</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      ORDER_STATUS_STYLE[order.status],
                    )}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>

                <Link to={`/commande/${order.id}`} className="mt-2 block">
                  <p className="text-sm font-semibold">{order.buyer?.company || order.buyer?.name}</p>
                  <p className="text-xs text-muted">
                    {order.contact_phone} · {timeAgo(order.created_at)}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-xs text-muted">
                        <span className="truncate pr-2">
                          {item.quantity} × {item.title}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatGNF(item.unit_price * item.quantity, { short: true })}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted">
                    {order.delivery_mode === "retrait" ? "Retrait sur place" : `Livraison — ${order.address}`}
                  </p>
                </Link>

                <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3">
                  <span className="flex-1 font-extrabold text-brand">{formatGNF(order.total)}</span>
                  {next ? (
                    <Button size="sm" loading={busy === order.id} onClick={() => advance(order)}>
                      {next.label}
                    </Button>
                  ) : null}
                  <Link to={`/commande/${order.id}`}>
                    <Button size="sm" variant="secondary">
                      Détails
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PhoneShell>
  );
}
