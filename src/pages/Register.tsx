import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { PhoneShell } from "@/components/layout/PhoneShell";
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
    {
      name: "origine",
      label: "Principaux pays d'importation",
      placeholder: "Chine, Inde, Turquie…",
    },
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
    {
      name: "capacite",
      label: "Capacité de production mensuelle",
      placeholder: "50 000 unités",
    },
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
  particulier: [
    { name: "interets", label: "Ce que vous cherchez", placeholder: "Riz, ciment, jus…" },
  ],
};

export default function Register() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
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
      <PhoneShell padBottom={false}>
        <TopBar title="Profil inconnu" onBack={() => navigate("/inscription")} />
        <div className="p-7 text-sm text-muted">
          Ce profil n'existe pas.{" "}
          <Link to="/inscription" className="font-semibold text-brand">
            Revenir au choix du profil
          </Link>
        </div>
      </PhoneShell>
    );
  }

  function validateStep0() {
    if (!form.name.trim()) return "Indiquez votre nom complet";
    if (!form.phone.trim()) return "Indiquez votre numéro de téléphone";
    if (form.password.length < 6) return "Le mot de passe doit faire au moins 6 caractères";
    return "";
  }

  /**
   * Interroge le serveur des la fin de l'etape 1 : inutile de faire remplir
   * tout le formulaire pour apprendre ensuite que le numero est deja pris.
   */
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
      // Serveur injoignable : on laisse passer, l'inscription tranchera.
      return true;
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (step === 0) {
      const msg = validateStep0();
      if (msg) return setError(msg);

      setCheckingPhone(true);
      const numeroLibre = await verifierNumero();
      setCheckingPhone(false);
      if (!numeroLibre) return;

      setStep(1);
      window.scrollTo({ top: 0 });
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
      // Le compte est cree ET la session ouverte : on entre directement dans
      // l'application, sans passer par l'ecran de connexion.
      toast(`Bienvenue ${user.name.split(" ")[0]} ! Votre compte ${roleInfo.label.toLowerCase()} est prêt.`);
      navigate("/accueil", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Inscription impossible";
      setError(message);
      // Numero deja pris : on renvoie a l'etape 1, sur le champ concerne.
      if (message.toLowerCase().includes("numero") || message.toLowerCase().includes("numéro")) {
        setPhoneError("Ce numéro a déjà un compte");
        setStep(0);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneShell padBottom={false}>
      <TopBar
        back
        onBack={() => (step === 0 ? navigate("/inscription") : setStep(0))}
        right={
          <span className="text-xs font-medium text-muted">
            Étape {step + 1} sur 2
          </span>
        }
      />

      <form onSubmit={submit} className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
              <roleInfo.icon className="size-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-6">Créer votre profil {roleInfo.label}</h1>
              <p className="text-xs text-muted">{roleInfo.tagline}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Progression</span>
              <span>{step === 0 ? "50 %" : "100 %"}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-subtle">
              <div
                className={cn("h-full rounded-full bg-brand transition-all", step === 0 ? "w-1/2" : "w-full")}
              />
            </div>
          </div>
        </div>

        <ErrorNote>{error}</ErrorNote>

        {step === 0 ? (
          <div className="flex flex-col gap-4">
            <Field label="Nom complet" required>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Alpha Oumar Diallo"
                autoComplete="name"
              />
            </Field>

            <Field
              label="Numéro de téléphone"
              required
              error={phoneError}
              hint="Il servira d'identifiant de connexion. Un numéro = un seul compte."
            >
              <PhoneInput
                value={form.phone}
                onChange={(e) => {
                  set("phone", e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                onBlur={() => form.phone.trim() && verifierNumero()}
                className={phoneError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : undefined}
              />
            </Field>

            {phoneError === "Ce numéro a déjà un compte" ? (
              <Link
                to="/connexion"
                state={{ phone: form.phone }}
                className="-mt-2 text-sm font-semibold text-brand"
              >
                Se connecter avec ce numéro
              </Link>
            ) : null}

            <Field label="Mot de passe" required hint="6 caractères minimum">
              <div className="relative">
                <Input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            {isSeller ? (
              <Field
                label={role === "agriculteur" ? "Nom de l'exploitation ou coopérative" : "Raison sociale"}
                hint="Le nom affiché aux acheteurs"
              >
                <Input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
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
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="contact@exemple.gn"
              />
            </Field>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {isSeller ? (
              <Field label="Secteur d'activité" required>
                <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">Choisir un secteur</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <Field label="Région" required>
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

            <Field label="Adresse ou repère">
              <Input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Marché Madina, allée 12"
              />
            </Field>

            {extras.map((f) => (
              <Field key={f.name} label={f.label} hint={f.hint}>
                {f.type === "select" ? (
                  <Select value={form[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}>
                    <option value="">Choisir</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Select>
                ) : f.type === "textarea" ? (
                  <Textarea
                    value={form[f.name] || ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.name] || ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}

            {isSeller ? (
              <Field label="Présentation" hint="Décrivez votre activité en quelques lignes">
                <Textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Importateur agréé depuis 2014, riz et huile en conteneurs complets…"
                />
              </Field>
            ) : null}

            <Checkbox
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              label={
                <>
                  J'accepte les conditions d'utilisation et la politique de confidentialité de Yehoo.
                </>
              }
            />
          </div>
        )}

        <Button type="submit" size="lg" loading={loading || checkingPhone} className="w-full">
          {step === 0 ? (
            <>
              Continuer
              <ArrowRight className="size-5" />
            </>
          ) : (
            <>
              <Check className="size-5" />
              Créer mon compte
            </>
          )}
        </Button>

        {step === 0 ? (
          <p className="text-center text-sm text-muted">
            Déjà inscrit ?{" "}
            <Link to="/connexion" className="font-semibold text-brand">
              Se connecter
            </Link>
          </p>
        ) : null}
      </form>
    </PhoneShell>
  );
}
