import { useMemo, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react-native";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, PhoneInput, Select, Textarea } from "@/components/ui/form";
import { ErrorNote } from "@/components/ui/feedback";
import { CATEGORIES, PREFECTURES, REGIONS, ROLE_MAP } from "@/lib/constants";
import { api } from "@/lib/api";
import type { Role } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

interface ExtraField {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  hint?: string;
}

/** Champs propres à chaque profil, stockés dans users.meta côté serveur. */
const EXTRA_FIELDS: Record<Role, ExtraField[]> = {
  importateur: [
    { name: "rccm", label: "Numéro RCCM / NIF", placeholder: "GN-CON-2019-B-12345" },
    { name: "origine", label: "Principaux pays d'importation", placeholder: "Chine, Inde, Turquie…" },
    {
      name: "volume",
      label: "Volume mensuel importé",
      type: "select",
      options: ["Moins d'1 conteneur", "1 à 5 conteneurs", "5 à 20 conteneurs", "Plus de 20 conteneurs"],
    },
    { name: "entrepot", label: "Adresse de l'entrepôt", placeholder: "Zone industrielle Km 8, Matoto" },
  ],
  agriculteur: [
    { name: "cultures", label: "Cultures principales", placeholder: "Pomme de terre, oignon, fonio…" },
    { name: "superficie", label: "Superficie exploitée (ha)", type: "number", placeholder: "12" },
    {
      name: "vente",
      label: "Mode de vente",
      type: "select",
      options: ["Vente directe", "Via coopérative", "Via intermédiaire"],
    },
    {
      name: "saison",
      label: "Périodes de récolte",
      placeholder: "Novembre à mars",
      hint: "Aide les acheteurs à planifier leurs commandes",
    },
  ],
  industriel: [
    { name: "rccm", label: "Numéro RCCM / NIF", placeholder: "GN-KIN-2015-B-00987" },
    { name: "production", label: "Produits fabriqués", placeholder: "Jus de fruits, eau minérale…" },
    { name: "capacite", label: "Capacité de production mensuelle", placeholder: "50 000 unités" },
    { name: "certifications", label: "Certifications", placeholder: "ISO 22000, agrément sanitaire…" },
  ],
  detaillant: [
    {
      name: "commerce",
      label: "Type de commerce",
      type: "select",
      options: ["Boutique de quartier", "Étal de marché", "Supérette", "Pharmacie", "Quincaillerie", "Autre"],
    },
    { name: "emplacement", label: "Marché ou quartier", placeholder: "Marché Madina, allée 12" },
    {
      name: "frequence",
      label: "Fréquence d'approvisionnement",
      type: "select",
      options: ["Chaque semaine", "Toutes les deux semaines", "Chaque mois", "Occasionnelle"],
    },
    { name: "budget", label: "Budget d'achat mensuel (GNF)", type: "number", placeholder: "15000000" },
  ],
  particulier: [{ name: "interets", label: "Ce que vous cherchez", placeholder: "Riz, ciment, jus…" }],
};

export default function Register() {
  const { role: roleParam } = useLocalSearchParams<{ role: string }>();
  const { register } = useAuth();
  const toast = useToast();

  const role = (roleParam as Role) || "detaillant";
  const roleInfo = ROLE_MAP[role];
  const extras = EXTRA_FIELDS[role] || [];
  const isSeller = roleInfo?.seller;

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    phone: "",
    password: "",
    company: "",
    category: "",
    region: "",
    prefecture: "",
    address: "",
    description: "",
    email: "",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const prefectures = useMemo(() => PREFECTURES[form.region] || [], [form.region]);

  if (!roleInfo) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <TopBar title="Profil inconnu" onBack={() => router.replace("/register")} />
        <View className="p-7">
          <Text className="text-sm text-muted dark:text-muted-dark">
            Ce profil n'existe pas.{" "}
            <Link href="/register" className="font-semibold text-brand">
              Revenir au choix du profil
            </Link>
          </Text>
        </View>
      </View>
    );
  }

  function validateStep0() {
    if (!form.name.trim()) return "Indiquez votre nom complet";
    if (!form.phone.trim()) return "Indiquez votre numéro de téléphone";
    if (form.password.length < 6) return "Le mot de passe doit faire au moins 6 caractères";
    return "";
  }

  /** Interroge le serveur des la fin de l'etape 1, avant de faire remplir tout le formulaire. */
  async function verifierNumero() {
    setPhoneError("");
    try {
      const { valid, available } = await api.checkPhone(form.phone);
      if (!valid) {
        setPhoneError("Numéro incomplet : 9 chiffres après le +224");
        return false;
      }
      if (!available) {
        setPhoneError("Ce numéro a déjà un compte");
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }

  async function nextOrSubmit() {
    setError("");

    if (step === 0) {
      const msg = validateStep0();
      if (msg) return setError(msg);

      setCheckingPhone(true);
      const numeroLibre = await verifierNumero();
      setCheckingPhone(false);
      if (!numeroLibre) return;

      setStep(1);
      return;
    }

    if (isSeller && !form.category) return setError("Choisissez votre secteur d'activité");
    if (!form.region) return setError("Choisissez votre région");
    if (!accepted) return setError("Vous devez accepter les conditions d'utilisation");

    const meta: Record<string, string> = {};
    for (const f of extras) if (form[f.name]) meta[f.name] = form[f.name];

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        phone: form.phone,
        password: form.password,
        role,
        company: form.company || null,
        category: form.category || null,
        region: form.region || null,
        prefecture: form.prefecture || null,
        address: form.address || null,
        description: form.description || null,
        email: form.email || null,
        meta,
      });
      toast(`Bienvenue ${user.name.split(" ")[0]} ! Votre compte ${roleInfo.label.toLowerCase()} est prêt.`);
      router.replace("/(tabs)");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Inscription impossible";
      setError(message);
      if (message.toLowerCase().includes("numero") || message.toLowerCase().includes("numéro")) {
        setPhoneError("Ce numéro a déjà un compte");
        setStep(0);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        back
        onBack={() => (step === 0 ? router.replace("/register") : setStep(0))}
        right={<Text className="text-xs font-medium text-muted dark:text-muted-dark">Étape {step + 1} sur 2</Text>}
      />

      <ScrollView contentContainerClassName="flex-col gap-6 p-7" keyboardShouldPersistTaps="handled">
        <View className="flex-col gap-3">
          <View className="flex-row items-center gap-3">
            <View className="size-12 rounded-2xl bg-brand/10 items-center justify-center">
              <roleInfo.icon size={24} color="#00c950" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-xl leading-6 text-fg dark:text-fg-dark">
                Créer votre profil {roleInfo.label}
              </Text>
              <Text className="text-xs text-muted dark:text-muted-dark">{roleInfo.tagline}</Text>
            </View>
          </View>

          <View className="flex-col gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted dark:text-muted-dark">Progression</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">{step === 0 ? "50 %" : "100 %"}</Text>
            </View>
            <View className="h-1.5 w-full rounded-full bg-subtle dark:bg-subtle-dark">
              <View className={cn("h-full rounded-full bg-brand", step === 0 ? "w-1/2" : "w-full")} />
            </View>
          </View>
        </View>

        <ErrorNote>{error}</ErrorNote>

        {step === 0 ? (
          <View className="flex-col gap-4">
            <Field label="Nom complet" required>
              <Input value={form.name} onChangeText={(v) => set("name", v)} placeholder="Alpha Oumar Diallo" autoComplete="name" />
            </Field>

            <Field
              label="Numéro de téléphone"
              required
              error={phoneError}
              hint="Il servira d'identifiant de connexion. Un numéro = un seul compte."
            >
              <PhoneInput
                value={form.phone}
                onChangeText={(v) => {
                  set("phone", v);
                  if (phoneError) setPhoneError("");
                }}
                onBlur={() => form.phone.trim() && verifierNumero()}
                className={phoneError ? "border-rose-400" : undefined}
              />
            </Field>

            {phoneError === "Ce numéro a déjà un compte" ? (
              <Link href={{ pathname: "/login", params: { phone: form.phone } }} className="-mt-2 text-sm font-semibold text-brand">
                Se connecter avec ce numéro
              </Link>
            ) : null}

            <Field label="Mot de passe" required hint="6 caractères minimum">
              <View className="relative justify-center">
                <Input
                  secureTextEntry={!showPwd}
                  value={form.password}
                  onChangeText={(v) => set("password", v)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pr-11"
                />
                <Pressable onPress={() => setShowPwd((s) => !s)} className="absolute right-3" hitSlop={8}>
                  {showPwd ? <EyeOff size={16} color="#8e8e98" /> : <Eye size={16} color="#8e8e98" />}
                </Pressable>
              </View>
            </Field>

            {isSeller ? (
              <Field
                label={role === "agriculteur" ? "Nom de l'exploitation ou coopérative" : "Raison sociale"}
                hint="Le nom affiché aux acheteurs"
              >
                <Input
                  value={form.company}
                  onChangeText={(v) => set("company", v)}
                  placeholder={
                    role === "agriculteur"
                      ? "Coopérative Foutah Vert"
                      : role === "industriel"
                        ? "Industries Kania SA"
                        : "Guinée Import SARL"
                  }
                />
              </Field>
            ) : null}

            <Field label="Email" hint="Facultatif">
              <Input
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => set("email", v)}
                placeholder="contact@exemple.gn"
              />
            </Field>
          </View>
        ) : (
          <View className="flex-col gap-4">
            {isSeller ? (
              <Field label="Secteur d'activité" required>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v)}
                  placeholder="Choisir un secteur"
                  options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                />
              </Field>
            ) : null}

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Field label="Région" required>
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
                  <Select
                    value={form.prefecture}
                    onValueChange={(v) => set("prefecture", v)}
                    placeholder="Choisir"
                    options={prefectures.map((p) => ({ value: p, label: p }))}
                  />
                </Field>
              </View>
            </View>

            <Field label="Adresse ou repère">
              <Input value={form.address} onChangeText={(v) => set("address", v)} placeholder="Marché Madina, allée 12" />
            </Field>

            {extras.map((f) => (
              <Field key={f.name} label={f.label} hint={f.hint}>
                {f.type === "select" ? (
                  <Select
                    value={form[f.name] || ""}
                    onValueChange={(v) => set(f.name, v)}
                    placeholder="Choisir"
                    options={(f.options || []).map((o) => ({ value: o, label: o }))}
                  />
                ) : f.type === "textarea" ? (
                  <Textarea value={form[f.name] || ""} onChangeText={(v) => set(f.name, v)} placeholder={f.placeholder} />
                ) : (
                  <Input
                    keyboardType={f.type === "number" ? "numeric" : "default"}
                    value={form[f.name] || ""}
                    onChangeText={(v) => set(f.name, v)}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}

            {isSeller ? (
              <Field label="Présentation" hint="Décrivez votre activité en quelques lignes">
                <Textarea
                  value={form.description}
                  onChangeText={(v) => set("description", v)}
                  placeholder="Importateur agréé depuis 2014, riz et huile en conteneurs complets…"
                />
              </Field>
            ) : null}

            <Checkbox
              checked={accepted}
              onToggle={() => setAccepted((a) => !a)}
              label="J'accepte les conditions d'utilisation et la politique de confidentialité de Yehoo."
            />
          </View>
        )}

        <Button size="lg" loading={loading || checkingPhone} className="w-full" onPress={nextOrSubmit}>
          {step === 0 ? (
            <>
              <Text className="font-semibold text-white text-base mr-2">Continuer</Text>
              <ArrowRight size={20} color="#ffffff" />
            </>
          ) : (
            <>
              <Check size={20} color="#ffffff" />
              <Text className="font-semibold text-white text-base ml-2">Créer mon compte</Text>
            </>
          )}
        </Button>

        {step === 0 ? (
          <Text className="text-center text-sm text-muted dark:text-muted-dark">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-semibold text-brand">
              Se connecter
            </Link>
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
