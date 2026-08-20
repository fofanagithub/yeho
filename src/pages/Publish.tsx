import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Check, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORIES, PREFECTURES, REGIONS, UNITS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { ErrorNote, Spinner } from "@/components/ui/feedback";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatGNF } from "@/lib/utils";

interface TierDraft {
  min_qty: string;
  price: string;
}

export default function Publish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const editing = Boolean(id);

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: user?.category || "",
    unit: "sac",
    price: "",
    min_order: "1",
    stock: "",
    region: user?.region || "",
    prefecture: user?.prefecture || "",
    image_url: "",
    delivery: "",
  });
  const [negotiable, setNegotiable] = useState(false);
  const [tiers, setTiers] = useState<TierDraft[]>([]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const prefectures = useMemo(() => PREFECTURES[form.region] || [], [form.region]);

  useEffect(() => {
    if (!editing) return;
    api
      .product(id!)
      .then(({ product }) => {
        setForm({
          title: product.title,
          description: product.description || "",
          category: product.category,
          unit: product.unit,
          price: String(product.price),
          min_order: String(product.min_order),
          stock: String(product.stock),
          region: product.region || "",
          prefecture: product.prefecture || "",
          image_url: product.image_url || "",
          delivery: product.delivery || "",
        });
        setNegotiable(product.negotiable);
        setTiers((product.tiers || []).map((t) => ({ min_qty: String(t.min_qty), price: String(t.price) })));
      })
      .catch(() => toast("Annonce introuvable", "error"))
      .finally(() => setLoading(false));
  }, [editing, id, toast]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      set("image_url", url);
    } catch {
      toast("Envoi de l'image impossible", "error");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Donnez un titre à votre annonce");
    if (!form.category) return setError("Choisissez une catégorie");
    if (!form.price || Number(form.price) <= 0) return setError("Indiquez un prix valide");

    const payload = {
      ...form,
      price: Number(form.price),
      min_order: Number(form.min_order) || 1,
      stock: Number(form.stock) || 0,
      negotiable,
      tiers: tiers
        .filter((t) => t.min_qty && t.price)
        .map((t) => ({ min_qty: Number(t.min_qty), price: Number(t.price) })),
    };

    setSaving(true);
    try {
      if (editing) {
        await api.updateProduct(Number(id), payload);
        toast("Annonce mise à jour");
        navigate(`/produit/${id}`, { replace: true });
      } else {
        const { product } = await api.createProduct(payload);
        toast("Annonce publiée");
        navigate(`/produit/${product.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner className="min-h-dvh" />;

  return (
    <div className="flex flex-col">
      <TopBar
        title={editing ? "Modifier l'annonce" : "Publier un produit"}
        subtitle={editing ? undefined : "Visible immédiatement par les acheteurs"}
      />

      <form onSubmit={submit} className="flex flex-col gap-5 p-5">
        <ErrorNote>{error}</ErrorNote>

        {/* Photo */}
        <Field label="Photo du produit" hint="Une bonne photo multiplie les contacts par trois">
          {form.image_url ? (
            <div className="relative">
              <img src={form.image_url} alt="" className="h-44 w-full rounded-2xl object-cover" />
              <button
                type="button"
                onClick={() => set("image_url", "")}
                className="absolute top-2 right-2 size-8 rounded-full bg-white/90 shadow flex items-center justify-center"
                aria-label="Retirer la photo"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-subtle-soft text-faint hover:border-brand/40">
              {uploading ? (
                <span className="text-sm">Envoi en cours…</span>
              ) : (
                <>
                  <ImagePlus className="size-7" />
                  <span className="text-sm font-medium">Ajouter une photo</span>
                  <span className="text-xs">JPG ou PNG, 5 Mo maximum</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          )}
        </Field>

        <Field label="Ou coller une adresse d'image">
          <div className="flex items-center gap-2">
            <Camera className="size-4 shrink-0 text-faint" />
            <Input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://…"
            />
          </div>
        </Field>

        <Field label="Titre de l'annonce" required>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Riz parfumé Diamant 50 kg"
            maxLength={90}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Catégorie" required>
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Choisir</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Unité de vente">
            <Select value={form.unit} onChange={(e) => set("unit", e.target.value)}>
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prix unitaire (GNF)" required hint={form.price ? formatGNF(Number(form.price)) : undefined}>
            <Input
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="420000"
            />
          </Field>
          <Field label="Commande minimum">
            <Input
              type="number"
              inputMode="numeric"
              value={form.min_order}
              onChange={(e) => set("min_order", e.target.value)}
              placeholder="20"
            />
          </Field>
        </div>

        <Field label="Quantité disponible en stock">
          <Input
            type="number"
            inputMode="numeric"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="1800"
          />
        </Field>

        <Checkbox
          checked={negotiable}
          onChange={(e) => setNegotiable(e.target.checked)}
          label="Le prix est négociable pour les grosses quantités"
        />

        {/* Prix dégressifs */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Prix dégressifs</p>
              <p className="text-xs text-muted">Facultatif — récompensez les grosses commandes</p>
            </div>
            <Button
              type="button"
              variant="soft"
              size="sm"
              onClick={() => setTiers((t) => [...t, { min_qty: "", price: "" }])}
            >
              <Plus className="size-4" />
              Palier
            </Button>
          </div>
          {tiers.map((t, i) => (
            <div key={i} className="flex items-end gap-2">
              <Field label="À partir de" className="flex-1">
                <Input
                  type="number"
                  value={t.min_qty}
                  onChange={(e) =>
                    setTiers((list) => list.map((x, j) => (j === i ? { ...x, min_qty: e.target.value } : x)))
                  }
                  placeholder="100"
                />
              </Field>
              <Field label="Prix unitaire" className="flex-1">
                <Input
                  type="number"
                  value={t.price}
                  onChange={(e) =>
                    setTiers((list) => list.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))
                  }
                  placeholder="405000"
                />
              </Field>
              <button
                type="button"
                onClick={() => setTiers((list) => list.filter((_, j) => j !== i))}
                className="mb-1 size-10 rounded-xl text-rose-500 hover:bg-rose-500/10 flex items-center justify-center"
                aria-label="Supprimer le palier"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Région">
            <Select
              value={form.region}
              onChange={(e) => {
                set("region", e.target.value);
                set("prefecture", "");
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
              value={form.prefecture}
              onChange={(e) => set("prefecture", e.target.value)}
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

        <Field label="Conditions de livraison">
          <Input
            value={form.delivery}
            onChange={(e) => set("delivery", e.target.value)}
            placeholder="Livraison camion Conakry incluse dès 50 sacs"
          />
        </Field>

        <Field label="Description" hint="Qualité, conditionnement, disponibilité, conditions de paiement…">
          <Textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="min-h-32"
            placeholder="Riz long grain parfumé importé du Vietnam, sac de 50 kg…"
          />
        </Field>

        <Button type="submit" size="lg" loading={saving} className="w-full">
          <Check className="size-5" />
          {editing ? "Enregistrer les modifications" : "Publier l'annonce"}
        </Button>
      </form>
    </div>
  );
}
