import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Check, ImagePlus, Plus, Trash2, X } from "lucide-react-native";
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

export function PublishForm({ id }: { id?: string }) {
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
    if (!editing || !id) return;
    api
      .product(id)
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
  }, [editing, id]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setUploading(true);
    try {
      const { url } = await api.upload({
        uri: asset.uri,
        name: asset.fileName || "photo.jpg",
        type: asset.mimeType || "image/jpeg",
      });
      set("image_url", url);
    } catch {
      toast("Envoi de l'image impossible", "error");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
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
      tiers: tiers.filter((t) => t.min_qty && t.price).map((t) => ({ min_qty: Number(t.min_qty), price: Number(t.price) })),
    };

    setSaving(true);
    try {
      if (editing && id) {
        await api.updateProduct(Number(id), payload);
        toast("Annonce mise à jour");
        router.replace(`/product/${id}`);
      } else {
        const { product } = await api.createProduct(payload);
        toast("Annonce publiée");
        router.replace(`/product/${product.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner className="flex-1 bg-canvas dark:bg-canvas-dark" />;

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title={editing ? "Modifier l'annonce" : "Publier un produit"} subtitle={editing ? undefined : "Visible immédiatement par les acheteurs"} />

      <ScrollView contentContainerClassName="flex-col gap-5 p-5" keyboardShouldPersistTaps="handled">
        <ErrorNote>{error}</ErrorNote>

        <Field label="Photo du produit" hint="Une bonne photo multiplie les contacts par trois">
          {form.image_url ? (
            <View className="relative">
              <Image source={{ uri: form.image_url }} style={{ height: 176, width: "100%", borderRadius: 16 }} contentFit="cover" />
              <Pressable onPress={() => set("image_url", "")} className="absolute top-2 right-2 size-8 rounded-full bg-white/90 items-center justify-center">
                <X size={16} color="#09090b" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickImage}
              disabled={uploading}
              className="h-44 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line dark:border-line-dark bg-subtle-soft dark:bg-subtle-soft-dark"
            >
              {uploading ? (
                <Text className="text-sm text-faint dark:text-faint-dark">Envoi en cours…</Text>
              ) : (
                <>
                  <ImagePlus size={28} color="#8e8e98" />
                  <Text className="text-sm font-medium text-faint dark:text-faint-dark">Ajouter une photo</Text>
                  <Text className="text-xs text-faint dark:text-faint-dark">JPG ou PNG, 5 Mo maximum</Text>
                </>
              )}
            </Pressable>
          )}
        </Field>

        <Field label="Ou coller une adresse d'image">
          <View className="flex-row items-center gap-2">
            <Camera size={16} color="#8e8e98" />
            <View className="flex-1">
              <Input value={form.image_url} onChangeText={(v) => set("image_url", v)} placeholder="https://…" />
            </View>
          </View>
        </Field>

        <Field label="Titre de l'annonce" required>
          <Input value={form.title} onChangeText={(v) => set("title", v)} placeholder="Riz parfumé Diamant 50 kg" maxLength={90} />
        </Field>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Catégorie" required>
              <Select value={form.category} onValueChange={(v) => set("category", v)} placeholder="Choisir" options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))} />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Unité de vente">
              <Select value={form.unit} onValueChange={(v) => set("unit", v)} options={UNITS} />
            </Field>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Prix unitaire (GNF)" required hint={form.price ? formatGNF(Number(form.price)) : undefined}>
              <Input keyboardType="numeric" value={form.price} onChangeText={(v) => set("price", v)} placeholder="420000" />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Commande minimum">
              <Input keyboardType="numeric" value={form.min_order} onChangeText={(v) => set("min_order", v)} placeholder="20" />
            </Field>
          </View>
        </View>

        <Field label="Quantité disponible en stock">
          <Input keyboardType="numeric" value={form.stock} onChangeText={(v) => set("stock", v)} placeholder="1800" />
        </Field>

        <Checkbox checked={negotiable} onToggle={() => setNegotiable((n) => !n)} label="Le prix est négociable pour les grosses quantités" />

        <View className="flex-col gap-3 rounded-2xl border border-line dark:border-line-dark p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-semibold text-sm text-fg dark:text-fg-dark">Prix dégressifs</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">Facultatif — récompensez les grosses commandes</Text>
            </View>
            <Button variant="soft" size="sm" onPress={() => setTiers((t) => [...t, { min_qty: "", price: "" }])}>
              <Plus size={16} color="#00c950" />
              <Text className="text-brand font-semibold text-sm ml-1">Palier</Text>
            </Button>
          </View>
          {tiers.map((t, i) => (
            <View key={i} className="flex-row items-end gap-2">
              <View className="flex-1">
                <Field label="À partir de">
                  <Input
                    keyboardType="numeric"
                    value={t.min_qty}
                    onChangeText={(v) => setTiers((list) => list.map((x, j) => (j === i ? { ...x, min_qty: v } : x)))}
                    placeholder="100"
                  />
                </Field>
              </View>
              <View className="flex-1">
                <Field label="Prix unitaire">
                  <Input
                    keyboardType="numeric"
                    value={t.price}
                    onChangeText={(v) => setTiers((list) => list.map((x, j) => (j === i ? { ...x, price: v } : x)))}
                    placeholder="405000"
                  />
                </Field>
              </View>
              <Pressable onPress={() => setTiers((list) => list.filter((_, j) => j !== i))} className="mb-1 size-10 rounded-xl items-center justify-center">
                <Trash2 size={16} color="#f43f5e" />
              </Pressable>
            </View>
          ))}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Région">
              <Select
                value={form.region}
                onValueChange={(v) => {
                  set("region", v);
                  set("prefecture", "");
                }}
                placeholder="Choisir"
                options={REGIONS.map((r) => ({ value: r, label: r }))}
              />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Préfecture">
              <Select value={form.prefecture} onValueChange={(v) => set("prefecture", v)} placeholder="Choisir" options={prefectures.map((p) => ({ value: p, label: p }))} />
            </Field>
          </View>
        </View>

        <Field label="Conditions de livraison">
          <Input value={form.delivery} onChangeText={(v) => set("delivery", v)} placeholder="Livraison camion Conakry incluse dès 50 sacs" />
        </Field>

        <Field label="Description" hint="Qualité, conditionnement, disponibilité, conditions de paiement…">
          <Textarea value={form.description} onChangeText={(v) => set("description", v)} className="min-h-32" placeholder="Riz long grain parfumé importé du Vietnam, sac de 50 kg…" />
        </Field>

        <Button size="lg" loading={saving} className="w-full" onPress={submit}>
          <Check size={20} color="#ffffff" />
          <Text className="font-semibold text-white text-base ml-2">{editing ? "Enregistrer les modifications" : "Publier l'annonce"}</Text>
        </Button>
      </ScrollView>
    </View>
  );
}
