import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, MapPin, Package, Smartphone, Store, Truck } from "lucide-react-native";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Field, Input, RadioRow, Select, Textarea } from "@/components/ui/form";
import { ErrorNote } from "@/components/ui/feedback";
import { PAYMENT_METHODS, PREFECTURES, REGIONS } from "@/lib/constants";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { imageUrl } from "@/lib/image";
import { formatGNF } from "@/lib/utils";

const DELIVERY_FEE = 150000;

export default function CheckoutScreen() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}

function Checkout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { lines, bySeller, subtotal, clear, unitPrice } = useCart();
  const toast = useToast();

  const [mode, setMode] = useState<"livraison" | "retrait">("livraison");
  const [payment, setPayment] = useState("orange_money");
  const [region, setRegion] = useState(user?.region || "");
  const [prefecture, setPrefecture] = useState(user?.prefecture || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const prefectures = useMemo(() => PREFECTURES[region] || [], [region]);
  const fees = mode === "livraison" ? bySeller.length * DELIVERY_FEE : 0;
  const total = subtotal + fees;

  // `clear()` a la fin d'une commande reussie vide aussi `lines` : cette ref
  // empeche la garde ci-dessous de rediriger vers /panier juste avant que la
  // navigation vers /orders/:id ne prenne effet (sinon, course entre les deux).
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!lines.length && !submittedRef.current) router.replace("/cart");
  }, [lines.length]);

  if (!lines.length && !submittedRef.current) return null;

  async function submit() {
    setError("");
    if (mode === "livraison" && !address.trim()) return setError("Indiquez une adresse de livraison");
    if (mode === "livraison" && !region) return setError("Choisissez une région de livraison");
    if (!phone.trim()) return setError("Indiquez un numéro de contact");

    setLoading(true);
    try {
      const { orders } = await api.createOrder({
        items: lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
        delivery_mode: mode,
        payment_method: payment,
        region,
        prefecture,
        address: mode === "livraison" ? address : "Retrait chez le vendeur",
        contact_phone: phone,
        note,
        delivery_fee: mode === "livraison" ? DELIVERY_FEE : 0,
      });
      submittedRef.current = true;
      clear();
      toast(orders.length > 1 ? `${orders.length} commandes envoyées` : "Commande envoyée au vendeur");
      router.replace(`/orders/${orders[0].id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Commande impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Livraison & validation" subtitle="Étape 2 sur 2" />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} contentContainerClassName="gap-6 p-5" keyboardShouldPersistTaps="handled">
        <ErrorNote>{error}</ErrorNote>

        <View className="flex-col gap-3">
          <Text className="font-semibold text-base text-fg dark:text-fg-dark">Mode de réception</Text>
          <RadioRow
            checked={mode === "livraison"}
            onSelect={() => setMode("livraison")}
            title="Livraison à mon adresse"
            subtitle={`${formatGNF(DELIVERY_FEE)} par vendeur`}
            icon={<Truck size={20} color="#00c950" />}
          />
          <RadioRow
            checked={mode === "retrait"}
            onSelect={() => setMode("retrait")}
            title="Retrait chez le vendeur"
            subtitle="Gratuit — vous organisez le transport"
            icon={<Store size={20} color="#00c950" />}
          />
        </View>

        {mode === "livraison" ? (
          <View className="flex-col gap-3">
            <Text className="font-semibold text-base text-fg dark:text-fg-dark">Adresse de livraison</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Field label="Région" required>
                  <Select
                    value={region}
                    onValueChange={(v) => {
                      setRegion(v);
                      setPrefecture("");
                    }}
                    placeholder="Choisir"
                    options={REGIONS.map((r) => ({ value: r, label: r }))}
                  />
                </Field>
              </View>
              <View className="flex-1">
                <Field label="Préfecture">
                  <Select value={prefecture} onValueChange={setPrefecture} placeholder="Choisir" options={prefectures.map((p) => ({ value: p, label: p }))} />
                </Field>
              </View>
            </View>
            <Field label="Adresse ou repère" required>
              <Input value={address} onChangeText={setAddress} placeholder="Marché de Matoto, bloc C, face à la mosquée" />
            </Field>
          </View>
        ) : null}

        <Field label="Numéro de contact" required>
          <Input value={phone} onChangeText={setPhone} placeholder="+224 620 00 00 00" />
        </Field>

        <View className="flex-col gap-3">
          <Text className="font-semibold text-base text-fg dark:text-fg-dark">Moyen de paiement</Text>
          {PAYMENT_METHODS.map((m) => (
            <RadioRow
              key={m.value}
              checked={payment === m.value}
              onSelect={() => setPayment(m.value)}
              title={m.label}
              subtitle={m.hint}
              icon={<Smartphone size={20} color="#00c950" />}
            />
          ))}
        </View>

        <Field label="Message au vendeur" hint="Facultatif — précisez un créneau, un repère, une exigence">
          <Textarea value={note} onChangeText={setNote} placeholder="Livraison avant vendredi si possible" />
        </Field>

        <View className="flex-col gap-3">
          <Text className="font-semibold text-base text-fg dark:text-fg-dark">Récapitulatif</Text>
          <View className="rounded-2xl border border-line dark:border-line-dark">
            {lines.map((l, i) => (
              <View
                key={l.product_id}
                className={i > 0 ? "flex-row items-center gap-3 p-3.5 border-t border-line-soft dark:border-line-soft-dark" : "flex-row items-center gap-3 p-3.5"}
              >
                {l.image_url ? (
                  <Image source={{ uri: imageUrl(l.image_url, 48) }} style={{ width: 48, height: 48, borderRadius: 8 }} contentFit="cover" />
                ) : (
                  <View className="size-12 rounded-lg bg-subtle dark:bg-subtle-dark items-center justify-center">
                    <Package size={20} color="#8e8e98" />
                  </View>
                )}
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-sm font-medium text-fg dark:text-fg-dark">
                    {l.title}
                  </Text>
                  <Text className="text-xs text-muted dark:text-muted-dark">
                    {l.quantity} × {formatGNF(unitPrice(l))}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{formatGNF(unitPrice(l) * l.quantity)}</Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl bg-subtle-soft dark:bg-subtle-soft-dark p-4">
            <Row label="Sous-total" value={formatGNF(subtotal)} />
            <Row label={`Livraison (${bySeller.length} vendeur${bySeller.length > 1 ? "s" : ""})`} value={formatGNF(fees)} />
            <View className="mt-2 flex-row items-center justify-between border-t border-line dark:border-line-dark pt-2">
              <Text className="font-semibold text-fg dark:text-fg-dark">Total à payer</Text>
              <Text className="font-extrabold text-brand text-lg">{formatGNF(total)}</Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3 rounded-2xl bg-brand/5 border border-brand/20 p-4">
            <MapPin size={20} color="#00c950" />
            <Text className="flex-1 text-xs leading-snug text-muted dark:text-muted-dark">
              Le vendeur confirme votre commande sous 24 h. Vous pouvez suivre chaque étape depuis l'onglet Commandes.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-5"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Button size="lg" className="w-full" loading={loading} onPress={submit}>
          <Check size={20} color="#ffffff" />
          <Text className="font-semibold text-white text-base ml-2">Confirmer — {formatGNF(total)}</Text>
        </Button>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-0.5">
      <Text className="text-muted dark:text-muted-dark">{label}</Text>
      <Text className="text-muted dark:text-muted-dark">{value}</Text>
    </View>
  );
}
