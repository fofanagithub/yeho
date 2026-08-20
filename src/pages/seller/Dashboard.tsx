import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Eye,
  MessageCircle,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Order, SellerStats } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/constants";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { cn, formatGNF, formatNumber, timeAgo } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.receivedOrders()])
      .then(([s, o]) => {
        setStats(s.stats);
        setOrders(o.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = orders.filter((o) => !["livree", "annulee"].includes(o.status));
  const maxRevenue = Math.max(1, ...(stats?.monthly || []).map((m) => m.revenue));

  return (
    <PhoneShell padBottom={false}>
      <TopBar title="Espace vendeur" subtitle={user?.company || user?.name} />

      <div className="flex flex-col gap-5 p-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              icon={<Wallet className="size-4" />}
              label="Chiffre d'affaires"
              value={formatGNF(stats.revenue, { short: true })}
              hint={`${stats.delivered} commande${stats.delivered > 1 ? "s" : ""} livrée${stats.delivered > 1 ? "s" : ""}`}
              accent
            />
            <KpiCard
              icon={<ShoppingBag className="size-4" />}
              label="À traiter"
              value={formatNumber(stats.pending)}
              hint="commandes en cours"
            />
            <KpiCard
              icon={<Package className="size-4" />}
              label="Annonces actives"
              value={formatNumber(stats.active)}
              hint={`${stats.listings} au total`}
            />
            <KpiCard
              icon={<Eye className="size-4" />}
              label="Vues cumulées"
              value={formatNumber(stats.views)}
              hint="sur vos annonces"
            />
          </div>
        ) : null}

        <div className="flex gap-3">
          <Link to="/publier" className="flex-1">
            <Button className="w-full">
              <PlusCircle className="size-4" />
              Publier
            </Button>
          </Link>
          <Link to="/espace-vendeur/annonces" className="flex-1">
            <Button variant="outline" className="w-full">
              Mes annonces
            </Button>
          </Link>
        </div>

        {/* Évolution mensuelle */}
        {stats?.monthly?.length ? (
          <section className="rounded-2xl border border-line p-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-brand" />
              <h2 className="font-semibold text-sm">Ventes des derniers mois</h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-28">
              {[...stats.monthly].reverse().map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] text-muted">{formatGNF(m.revenue, { short: true })}</span>
                  <div
                    className="w-full rounded-t-md bg-brand/80"
                    style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 72)}px` }}
                  />
                  <span className="text-[10px] text-faint">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Commandes à traiter */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base">Commandes à traiter</h2>
            <Link to="/espace-vendeur/commandes" className="flex items-center text-xs font-medium text-brand">
              Tout voir <ChevronRight className="size-3.5" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <p className="rounded-2xl bg-subtle-soft p-4 text-sm text-muted">
              Aucune commande en attente. Publiez de nouvelles annonces pour attirer des acheteurs.
            </p>
          ) : (
            pending.slice(0, 4).map((order) => (
              <Link
                key={order.id}
                to={`/commande/${order.id}`}
                className="flex items-center gap-3 rounded-2xl border border-line p-3.5 hover:border-brand/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-faint">{order.reference}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        ORDER_STATUS_STYLE[order.status],
                      )}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <p className="truncate text-sm font-semibold">{order.buyer?.company || order.buyer?.name}</p>
                  <p className="text-xs text-muted">
                    {order.items.length} article{order.items.length > 1 ? "s" : ""} · {timeAgo(order.created_at)}
                  </p>
                </div>
                <span className="font-bold text-brand text-sm">{formatGNF(order.total, { short: true })}</span>
              </Link>
            ))
          )}
        </section>

        {stats?.unread ? (
          <Link
            to="/messages"
            className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4"
          >
            <MessageCircle className="size-5 text-brand" />
            <span className="flex-1 text-sm">
              <span className="font-semibold">{stats.unread} message non lu{stats.unread > 1 ? "s" : ""}</span>
              <span className="block text-xs text-muted">Répondez vite pour ne pas perdre la vente</span>
            </span>
            <ChevronRight className="size-4 text-faint" />
          </Link>
        ) : null}
      </div>
    </PhoneShell>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        accent ? "border-brand/20 bg-brand/5" : "border-line bg-surface",
      )}
    >
      <div className="flex items-center gap-1.5 text-muted">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className={cn("mt-1 font-extrabold text-lg leading-6", accent ? "text-brand" : "text-fg")}>
        {value}
      </p>
      {hint ? <p className="text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}
