import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  CircleDot,
  Copy,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, PAYMENT_METHODS } from "@/lib/constants";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatDate, formatGNF, formatTime } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "en_attente", label: "Commande reçue" },
  { status: "confirmee", label: "Confirmée par le vendeur" },
  { status: "en_preparation", label: "En préparation" },
  { status: "en_route", label: "En route" },
  { status: "livree", label: "Livrée" },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .order(id!)
      .then(({ order }) => alive && setOrder(order))
      .catch(() => toast("Commande introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, toast]);

  async function changeStatus(status: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      const { order: updated } = await api.updateOrderStatus(order.id, status);
      setOrder(updated);
      toast(`Commande ${ORDER_STATUS_LABEL[status].toLowerCase()}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Mise à jour impossible", "error");
    } finally {
      setUpdating(false);
    }
  }

  async function openChat() {
    if (!order) return;
    const partnerId = user?.id === order.buyer_id ? order.seller_id : order.buyer_id;
    try {
      const { conversation } = await api.startConversation({ seller_id: partnerId });
      navigate(`/messages/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    }
  }

  if (loading) {
    return (
      <PhoneShell padBottom={false}>
        <Spinner className="min-h-screen" />
      </PhoneShell>
    );
  }
  if (!order) {
    return (
      <PhoneShell padBottom={false}>
        <TopBar title="Commande" />
        <p className="p-8 text-center text-sm text-zinc-500">Cette commande n'existe pas.</p>
      </PhoneShell>
    );
  }

  const isSeller = user?.id === order.seller_id;
  const partner = isSeller ? order.buyer : order.seller;
  const currentIndex = STEPS.findIndex((s) => s.status === order.status);
  const cancelled = order.status === "annulee";
  const payment = PAYMENT_METHODS.find((p) => p.value === order.payment_method)?.label || order.payment_method;
  const nextStep = STEPS[currentIndex + 1];

  return (
    <PhoneShell>
      <TopBar
        title="Suivi de livraison"
        subtitle={`Commande ${order.reference}`}
        right={
          <button
            onClick={() => {
              navigator.clipboard?.writeText(order.reference);
              toast("Référence copiée");
            }}
            className="text-zinc-400"
            aria-label="Copier la référence"
          >
            <Copy className="size-4" />
          </button>
        }
      />

      <div className="flex flex-col gap-5 p-5">
        {/* Statut */}
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4">
          <span
            className={cn(
              "size-12 shrink-0 rounded-2xl flex items-center justify-center",
              cancelled ? "bg-rose-100 text-rose-600" : "bg-brand/10 text-brand",
              order.status === "en_route" && "animate-pulse-ring",
            )}
          >
            {cancelled ? <XCircle className="size-6" /> : <Truck className="size-6" />}
          </span>
          <div className="flex-1">
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                ORDER_STATUS_STYLE[order.status],
              )}
            >
              {ORDER_STATUS_LABEL[order.status]}
            </span>
            <p className="mt-1 text-sm font-semibold">
              {cancelled
                ? "Commande annulée"
                : order.status === "livree"
                  ? "Colis livré, merci !"
                  : "Livraison estimée sous 2 à 5 jours"}
            </p>
            <p className="text-xs text-zinc-500">Commandé le {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Étapes */}
        {!cancelled ? (
          <div className="rounded-2xl border border-zinc-200 p-5">
            <h2 className="mb-4 font-bold text-base">Étapes</h2>
            <ol className="flex flex-col">
              {STEPS.map((step, i) => {
                const done = i <= currentIndex;
                const active = i === currentIndex;
                const event = order.events.find((e) => e.status === step.status);
                return (
                  <li key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "size-7 shrink-0 rounded-full flex items-center justify-center border-2",
                          done ? "border-brand bg-brand text-white" : "border-zinc-200 bg-white text-zinc-300",
                        )}
                      >
                        {active ? <CircleDot className="size-3.5" /> : done ? <Check className="size-3.5" /> : null}
                      </span>
                      {i < STEPS.length - 1 ? (
                        <span className={cn("w-0.5 flex-1 min-h-8", i < currentIndex ? "bg-brand" : "bg-zinc-200")} />
                      ) : null}
                    </div>
                    <div className="pb-6">
                      <p className={cn("text-sm", done ? "font-semibold" : "text-zinc-400")}>{step.label}</p>
                      {event ? (
                        <p className="text-xs text-zinc-500">
                          {formatDate(event.created_at)} · {formatTime(event.created_at)}
                        </p>
                      ) : null}
                      {event?.detail ? <p className="text-xs text-zinc-500">{event.detail}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        {/* Interlocuteur */}
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4">
          <Avatar name={partner.company || partner.name} size={44} verified={partner.verified} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500">{isSeller ? "Acheteur" : "Vendeur"}</p>
            <p className="truncate font-semibold text-sm">{partner.company || partner.name}</p>
          </div>
          <div className="flex gap-2">
            {partner.phone ? (
              <a
                href={`tel:${partner.phone}`}
                className="size-9 rounded-full bg-zinc-100 flex items-center justify-center"
                aria-label="Appeler"
              >
                <Phone className="size-4" />
              </a>
            ) : null}
            <button
              onClick={openChat}
              className="size-9 rounded-full bg-brand text-white flex items-center justify-center"
              aria-label="Message"
            >
              <MessageCircle className="size-4" />
            </button>
          </div>
        </div>

        {/* Articles */}
        <div className="rounded-2xl border border-zinc-200">
          <h2 className="border-b border-zinc-100 px-4 py-3 font-bold text-base">Articles</h2>
          <div className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3.5">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="size-14 rounded-lg object-cover" />
                ) : (
                  <span className="size-14 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center">
                    <Package className="size-5" />
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  {item.product_id ? (
                    <Link to={`/produit/${item.product_id}`} className="line-clamp-2 text-sm font-medium">
                      {item.title}
                    </Link>
                  ) : (
                    <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    {item.quantity} {item.unit} × {formatGNF(item.unit_price)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatGNF(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 p-4 text-sm">
            <div className="flex justify-between py-0.5 text-zinc-500">
              <span>Sous-total</span>
              <span>{formatGNF(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-zinc-500">
              <span>Livraison</span>
              <span>{formatGNF(order.delivery_fee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-zinc-100 pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-extrabold text-brand">{formatGNF(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Livraison */}
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 p-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
            <div>
              <p className="font-medium">{order.delivery_mode === "retrait" ? "Retrait chez le vendeur" : "Livraison"}</p>
              <p className="text-xs text-zinc-500">
                {order.address}
                {order.prefecture ? `, ${order.prefecture}` : ""}
                {order.region ? `, ${order.region}` : ""}
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Paiement : {payment}</p>
          {order.note ? <p className="text-xs text-zinc-500">Note : {order.note}</p> : null}
        </div>

        {/* Actions */}
        {!cancelled ? (
          <div className="flex flex-col gap-2">
            {isSeller && nextStep ? (
              <Button size="lg" loading={updating} onClick={() => changeStatus(nextStep.status)}>
                Marquer comme « {nextStep.label} »
              </Button>
            ) : null}
            {!isSeller && order.status === "en_route" ? (
              <Button size="lg" loading={updating} onClick={() => changeStatus("livree")}>
                <Check className="size-5" />
                Confirmer la réception
              </Button>
            ) : null}
            {order.status === "en_attente" ? (
              <Button variant="ghost" className="text-rose-600" loading={updating} onClick={() => changeStatus("annulee")}>
                Annuler la commande
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </PhoneShell>
  );
}
