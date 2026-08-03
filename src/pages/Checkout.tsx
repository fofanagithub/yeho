import { useMemo, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Check, MapPin, Package, Smartphone, Store, Truck } from "lucide-react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Field, Input, RadioRow, Select, Textarea } from "@/components/ui/form";
import { ErrorNote } from "@/components/ui/feedback";
import { PAYMENT_METHODS, PREFECTURES, REGIONS } from "@/lib/constants";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatGNF } from "@/lib/utils";

const DELIVERY_FEE = 150000;

export default function Checkout() {
  const navigate = useNavigate();
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

  if (!lines.length) return <Navigate to="/panier" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
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
      clear();
      toast(orders.length > 1 ? `${orders.length} commandes envoyées` : "Commande envoyée au vendeur");
      navigate(`/commande/${orders[0].id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Commande impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneShell className="pb-40">
      <TopBar title="Livraison & validation" subtitle="Étape 2 sur 2" />

      <form id="checkout-form" onSubmit={submit} className="flex flex-col gap-6 p-5">
        <ErrorNote>{error}</ErrorNote>

        {/* Mode de réception */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-base">Mode de réception</h2>
          <RadioRow
            checked={mode === "livraison"}
            onSelect={() => setMode("livraison")}
            title="Livraison à mon adresse"
            subtitle={`${formatGNF(DELIVERY_FEE)} par vendeur`}
            icon={<Truck className="size-5" />}
          />
          <RadioRow
            checked={mode === "retrait"}
            onSelect={() => setMode("retrait")}
            title="Retrait chez le vendeur"
            subtitle="Gratuit — vous organisez le transport"
            icon={<Store className="size-5" />}
          />
        </section>

        {/* Adresse */}
        {mode === "livraison" ? (
          <section className="flex flex-col gap-3">
            <h2 className="font-semibold text-base">Adresse de livraison</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Région" required>
                <Select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setPrefecture("");
                  }}
                >
                  <option value="">Choisir</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Préfecture">
                <Select
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  disabled={!prefectures.length}
                >
                  <option value="">Choisir</option>
                  {prefectures.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Adresse ou repère" required>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Marché de Matoto, bloc C, face à la mosquée"
              />
            </Field>
          </section>
        ) : null}

        <Field label="Numéro de contact" required>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+224 620 00 00 00" />
        </Field>

        {/* Paiement */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-base">Moyen de paiement</h2>
          {PAYMENT_METHODS.map((m) => (
            <RadioRow
              key={m.value}
              checked={payment === m.value}
              onSelect={() => setPayment(m.value)}
              title={m.label}
              subtitle={m.hint}
              icon={<Smartphone className="size-5" />}
            />
          ))}
        </section>

        <Field label="Message au vendeur" hint="Facultatif — précisez un créneau, un repère, une exigence">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Livraison avant vendredi si possible" />
        </Field>

        {/* Récapitulatif */}
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-base">Récapitulatif</h2>
          <div className="rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
            {lines.map((l) => (
              <div key={l.product_id} className="flex items-center gap-3 p-3.5">
                {l.image_url ? (
                  <img src={l.image_url} alt="" className="size-12 rounded-lg object-cover" />
                ) : (
                  <span className="size-12 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center">
                    <Package className="size-5" />
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{l.title}</p>
                  <p className="text-xs text-zinc-500">
                    {l.quantity} × {formatGNF(unitPrice(l))}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatGNF(unitPrice(l) * l.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-zinc-50 p-4 text-sm">
            <Row label="Sous-total" value={formatGNF(subtotal)} />
            <Row label={`Livraison (${bySeller.length} vendeur${bySeller.length > 1 ? "s" : ""})`} value={formatGNF(fees)} />
            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2">
              <span className="font-semibold">Total à payer</span>
              <span className="font-extrabold text-brand text-lg">{formatGNF(total)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-brand/5 border border-brand/20 p-4">
            <MapPin className="size-5 shrink-0 text-brand" />
            <p className="text-xs leading-snug text-zinc-600">
              Le vendeur confirme votre commande sous 24 h. Vous pouvez suivre chaque étape depuis
              l'onglet Commandes.
            </p>
          </div>
        </section>
      </form>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-zinc-200 bg-white p-5 pb-[calc(1.25rem+var(--safe-bottom))]">
        <Button type="submit" form="checkout-form" size="lg" className="w-full" loading={loading}>
          <Check className="size-5" />
          Confirmer — {formatGNF(total)}
        </Button>
      </div>
    </PhoneShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-zinc-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
