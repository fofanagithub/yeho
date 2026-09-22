import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";
import { Check, CircleDot, Copy, MapPin, MessageCircle, Package, Phone, Truck, XCircle } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, PAYMENT_METHODS } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { imageUrl } from "@/lib/image";
import { cn, formatDate, formatGNF, formatTime } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "en_attente", label: "Commande reçue" },
  { status: "confirmee", label: "Confirmée par le vendeur" },
  { status: "en_preparation", label: "En préparation" },
  { status: "en_route", label: "En route" },
  { status: "livree", label: "Livrée" },
];

export default function OrderTrackingScreen() {
  return (
    <RequireAuth>
      <OrderTracking />
    </RequireAuth>
  );
}

function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .order(id)
      .then(({ order }) => alive && setOrder(order))
      .catch(() => toast("Commande introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

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
      router.push(`/chat/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    }
  }

  if (loading) return <Spinner className="flex-1 bg-canvas dark:bg-canvas-dark" />;

  if (!order) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <TopBar title="Commande" />
        <Text className="p-8 text-center text-sm text-muted dark:text-muted-dark">Cette commande n'existe pas.</Text>
      </View>
    );
  }

  const isSeller = user?.id === order.seller_id;
  const partner = isSeller ? order.buyer : order.seller;
  const currentIndex = STEPS.findIndex((s) => s.status === order.status);
  const cancelled = order.status === "annulee";
  const payment = PAYMENT_METHODS.find((p) => p.value === order.payment_method)?.label || order.payment_method;
  const nextStep = STEPS[currentIndex + 1];

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        title="Suivi de livraison"
        subtitle={`Commande ${order.reference}`}
        right={
          <Pressable
            onPress={async () => {
              await Clipboard.setStringAsync(order.reference);
              toast("Référence copiée");
            }}
            hitSlop={8}
          >
            <Copy size={16} color="#8e8e98" />
          </Pressable>
        }
      />

      <ScrollView contentContainerClassName="flex-col gap-5 p-5">
        <View className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-4">
          <View className={cn("size-12 shrink-0 rounded-2xl items-center justify-center", cancelled ? "bg-rose-100 dark:bg-rose-500/15" : "bg-brand/10")}>
            {cancelled ? <XCircle size={24} color="#e11d48" /> : <Truck size={24} color="#00c950" />}
          </View>
          <View className="flex-1">
            <View className={cn("self-start rounded-full px-2.5 py-0.5", ORDER_STATUS_STYLE[order.status])}>
              <Text className="text-[11px] font-semibold">{ORDER_STATUS_LABEL[order.status]}</Text>
            </View>
            <Text className="mt-1 text-sm font-semibold text-fg dark:text-fg-dark">
              {cancelled ? "Commande annulée" : order.status === "livree" ? "Colis livré, merci !" : "Livraison estimée sous 2 à 5 jours"}
            </Text>
            <Text className="text-xs text-muted dark:text-muted-dark">Commandé le {formatDate(order.created_at)}</Text>
          </View>
        </View>

        {!cancelled ? (
          <View className="rounded-2xl border border-line dark:border-line-dark p-5">
            <Text className="mb-4 font-bold text-base text-fg dark:text-fg-dark">Étapes</Text>
            <View className="flex-col">
              {STEPS.map((step, i) => {
                const done = i <= currentIndex;
                const active = i === currentIndex;
                const event = order.events.find((e) => e.status === step.status);
                return (
                  <View key={step.status} className="flex-row gap-3">
                    <View className="items-center">
                      <View
                        className={cn(
                          "size-7 shrink-0 rounded-full items-center justify-center border-2",
                          done ? "border-brand bg-brand" : "border-line dark:border-line-dark bg-surface dark:bg-surface-dark",
                        )}
                      >
                        {active ? <CircleDot size={14} color="#ffffff" /> : done ? <Check size={14} color="#ffffff" /> : null}
                      </View>
                      {i < STEPS.length - 1 ? (
                        <View className={cn("w-0.5 flex-1", i < currentIndex ? "bg-brand" : "bg-subtle-strong dark:bg-subtle-strong-dark")} style={{ minHeight: 32 }} />
                      ) : null}
                    </View>
                    <View className="pb-6 flex-1">
                      <Text className={cn("text-sm", done ? "font-semibold text-fg dark:text-fg-dark" : "text-faint dark:text-faint-dark")}>{step.label}</Text>
                      {event ? (
                        <Text className="text-xs text-muted dark:text-muted-dark">
                          {formatDate(event.created_at)} · {formatTime(event.created_at)}
                        </Text>
                      ) : null}
                      {event?.detail ? <Text className="text-xs text-muted dark:text-muted-dark">{event.detail}</Text> : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-4">
          <Avatar name={partner.company || partner.name} size={44} verified={partner.verified} />
          <View className="flex-1">
            <Text className="text-xs text-muted dark:text-muted-dark">{isSeller ? "Acheteur" : "Vendeur"}</Text>
            <Text numberOfLines={1} className="font-semibold text-sm text-fg dark:text-fg-dark">
              {partner.company || partner.name}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {partner.phone ? (
              <Pressable onPress={() => Linking.openURL(`tel:${partner.phone}`)} className="size-9 rounded-full bg-subtle dark:bg-subtle-dark items-center justify-center">
                <Phone size={16} color="#09090b" />
              </Pressable>
            ) : null}
            <Pressable onPress={openChat} className="size-9 rounded-full bg-brand items-center justify-center">
              <MessageCircle size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <View className="rounded-2xl border border-line dark:border-line-dark">
          <Text className="border-b border-line-soft dark:border-line-soft-dark px-4 py-3 font-bold text-base text-fg dark:text-fg-dark">Articles</Text>
          <View>
            {order.items.map((item, i) => (
              <Pressable
                key={item.id}
                disabled={!item.product_id}
                onPress={() => item.product_id && router.push(`/product/${item.product_id}`)}
                className={cn("flex-row items-center gap-3 p-3.5", i > 0 && "border-t border-line-soft dark:border-line-soft-dark")}
              >
                {item.image_url ? (
                  <Image source={{ uri: imageUrl(item.image_url, 56) }} style={{ width: 56, height: 56, borderRadius: 8 }} contentFit="cover" />
                ) : (
                  <View className="size-14 rounded-lg bg-subtle dark:bg-subtle-dark items-center justify-center">
                    <Package size={20} color="#8e8e98" />
                  </View>
                )}
                <View className="flex-1">
                  <Text numberOfLines={2} className="text-sm font-medium text-fg dark:text-fg-dark">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-muted dark:text-muted-dark">
                    {item.quantity} {item.unit} × {formatGNF(item.unit_price)}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{formatGNF(item.unit_price * item.quantity)}</Text>
              </Pressable>
            ))}
          </View>
          <View className="border-t border-line-soft dark:border-line-soft-dark p-4">
            <View className="flex-row justify-between py-0.5">
              <Text className="text-muted dark:text-muted-dark">Sous-total</Text>
              <Text className="text-muted dark:text-muted-dark">{formatGNF(order.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between py-0.5">
              <Text className="text-muted dark:text-muted-dark">Livraison</Text>
              <Text className="text-muted dark:text-muted-dark">{formatGNF(order.delivery_fee)}</Text>
            </View>
            <View className="mt-2 flex-row justify-between border-t border-line-soft dark:border-line-soft-dark pt-2">
              <Text className="font-semibold text-fg dark:text-fg-dark">Total</Text>
              <Text className="font-extrabold text-brand">{formatGNF(order.total)}</Text>
            </View>
          </View>
        </View>

        <View className="flex-col gap-2 rounded-2xl bg-subtle-soft dark:bg-subtle-soft-dark p-4">
          <View className="flex-row items-start gap-2">
            <MapPin size={16} color="#00c950" />
            <View className="flex-1">
              <Text className="font-medium text-sm text-fg dark:text-fg-dark">{order.delivery_mode === "retrait" ? "Retrait chez le vendeur" : "Livraison"}</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">
                {order.address}
                {order.prefecture ? `, ${order.prefecture}` : ""}
                {order.region ? `, ${order.region}` : ""}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-muted dark:text-muted-dark">Paiement : {payment}</Text>
          {order.note ? <Text className="text-xs text-muted dark:text-muted-dark">Note : {order.note}</Text> : null}
        </View>

        {!cancelled ? (
          <View className="flex-col gap-2">
            {isSeller && nextStep ? (
              <Button size="lg" loading={updating} onPress={() => changeStatus(nextStep.status)}>
                Marquer comme « {nextStep.label} »
              </Button>
            ) : null}
            {!isSeller && order.status === "en_route" ? (
              <Button size="lg" loading={updating} onPress={() => changeStatus("livree")}>
                <Check size={20} color="#ffffff" />
                <Text className="font-semibold text-white text-base ml-2">Confirmer la réception</Text>
              </Button>
            ) : null}
            {order.status === "en_attente" ? (
              <Button variant="ghost" textClassName="text-rose-600" loading={updating} onPress={() => changeStatus("annulee")}>
                Annuler la commande
              </Button>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
