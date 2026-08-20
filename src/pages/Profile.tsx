import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Package,
  Pencil,
  Phone,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Sun,
  SunMoon,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import type { SellerStats } from "@/lib/types";
import { ROLE_MAP } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ThemePreference } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatDate, formatGNF, formatNumber } from "@/lib/utils";

/** Les trois réglages d'apparence proposés dans le profil. */
const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "auto", label: "Automatique", icon: SunMoon },
  { value: "clair", label: "Clair", icon: Sun },
  { value: "sombre", label: "Sombre", icon: Moon },
];

export default function Profile() {
  const { user, isSeller, logout, updateProfile } = useAuth();
  const { preference, resolved, setPreference } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const [stats, setStats] = useState<SellerStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: user?.name || "",
    company: user?.company || "",
    address: user?.address || "",
    email: user?.email || "",
    description: user?.description || "",
  });

  useEffect(() => {
    if (!isSeller) return;
    api
      .stats()
      .then(({ stats }) => setStats(stats))
      .catch(() => undefined);
  }, [isSeller]);

  if (!user) return null;
  const role = ROLE_MAP[user.role];

  async function save() {
    setSaving(true);
    try {
      await updateProfile(draft);
      toast("Profil mis à jour");
      setEditing(false);
    } catch {
      toast("Enregistrement impossible", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <header className="rounded-b-3xl bg-linear-to-b from-emerald-700 to-brand px-5 pb-8 pt-[calc(1.5rem+var(--safe-top))] text-white">
        <div className="flex items-start justify-between">
          <Avatar name={user.company || user.name} src={user.avatar_url} size={72} verified={user.verified} />
          <button
            onClick={() => setEditing((e) => !e)}
            className="size-9 rounded-full bg-white/15 flex items-center justify-center"
            aria-label="Modifier"
          >
            <Pencil className="size-4" />
          </button>
        </div>
        <h1 className="mt-3 flex items-center gap-1.5 font-bold text-xl tracking-tight">
          {user.name}
          {user.verified ? <BadgeCheck className="size-5" /> : null}
        </h1>
        {user.company ? <p className="text-sm text-white/85">{user.company}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className="bg-white/20 text-white">
            <role.icon className="size-3" />
            {role.label}
          </Badge>
          {user.region ? (
            <Badge className="bg-white/20 text-white">
              <MapPin className="size-3" />
              {user.prefecture ? `${user.prefecture}, ` : ""}
              {user.region}
            </Badge>
          ) : null}
          {user.rating_count > 0 ? (
            <Badge className="bg-white/20 text-white">
              <Star className="size-3 fill-white" />
              {user.rating.toFixed(1)} ({user.rating_count})
            </Badge>
          ) : null}
        </div>
      </header>

      {editing ? (
        <section className="flex flex-col gap-4 p-5">
          <h2 className="font-bold text-base">Modifier mon profil</h2>
          <Field label="Nom complet">
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Raison sociale">
            <Input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
          </Field>
          <Field label="Adresse">
            <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Présentation">
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button className="flex-1" loading={saving} onClick={save}>
              Enregistrer
            </Button>
          </div>
        </section>
      ) : (
        <>
          {/* Statistiques vendeur */}
          {isSeller && stats ? (
            <section className="grid grid-cols-3 gap-3 p-5">
              <StatCard label="Annonces" value={formatNumber(stats.active)} />
              <StatCard label="Vues" value={formatNumber(stats.views)} />
              <StatCard label="Ventes" value={formatNumber(stats.delivered)} />
            </section>
          ) : null}

          {/* Coordonnées */}
          <section className="px-5 pt-2">
            <h2 className="mb-3 font-semibold text-base">Coordonnées</h2>
            <div className="rounded-2xl border border-line divide-y divide-line-soft">
              <InfoRow icon={<Phone className="size-4" />} label="Téléphone" value={user.phone} />
              {user.email ? <InfoRow icon={<Mail className="size-4" />} label="Email" value={user.email} /> : null}
              {user.address ? (
                <InfoRow icon={<MapPin className="size-4" />} label="Adresse" value={user.address} />
              ) : null}
              <InfoRow
                icon={<ShieldCheck className="size-4" />}
                label="Membre depuis"
                value={formatDate(user.created_at)}
              />
            </div>
          </section>

          {user.description ? (
            <section className="px-5 pt-5">
              <h2 className="mb-2 font-semibold text-base">À propos</h2>
              <p className="text-sm leading-relaxed text-muted">{user.description}</p>
            </section>
          ) : null}

          {/* Raccourcis */}
          <section className="flex flex-col gap-2 px-5 pt-6">
            <h2 className="mb-1 font-semibold text-base">Mon activité</h2>
            <MenuLink to="/commandes" icon={<ShoppingBag className="size-5" />} label="Mes commandes" />
            <MenuLink to="/favoris" icon={<Heart className="size-5" />} label="Mes favoris" />
            {isSeller ? (
              <>
                <MenuLink
                  to="/espace-vendeur"
                  icon={<TrendingUp className="size-5" />}
                  label="Tableau de bord vendeur"
                  hint={stats ? `${formatGNF(stats.revenue, { short: true })} de ventes` : undefined}
                />
                <MenuLink
                  to="/espace-vendeur/annonces"
                  icon={<Package className="size-5" />}
                  label="Mes annonces"
                  hint={stats ? `${stats.active} active${stats.active > 1 ? "s" : ""}` : undefined}
                />
                <MenuLink
                  to="/espace-vendeur/commandes"
                  icon={<Store className="size-5" />}
                  label="Commandes reçues"
                  hint={stats?.pending ? `${stats.pending} à traiter` : undefined}
                />
                <MenuLink to={`/vendeur/${user.id}`} icon={<Settings className="size-5" />} label="Voir ma boutique publique" />
              </>
            ) : null}
          </section>

          {/* Apparence */}
          <section className="flex flex-col gap-3 px-5 pt-6">
            <div>
              <h2 className="font-semibold text-base">Apparence</h2>
              <p className="text-xs text-muted">
                {preference === "auto"
                  ? `Suit votre téléphone — actuellement en ${resolved}`
                  : "Réglage fixe, quel que soit votre téléphone"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-line p-1.5">
              {THEMES.map((t) => {
                const active = preference === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setPreference(t.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition",
                      active ? "bg-brand text-white shadow-sm shadow-brand/25" : "text-muted hover:bg-subtle",
                    )}
                  >
                    <t.icon className="size-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="p-5 pt-8">
            <Button
              variant="secondary"
              className="w-full text-rose-600 dark:text-rose-400"
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
            >
              <LogOut className="size-4" />
              Se déconnecter
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line p-3 text-center">
      <p className="font-extrabold text-brand text-lg leading-6">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function MenuLink({
  to,
  icon,
  label,
  hint,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl border border-line p-3.5 hover:border-brand/40">
      <span className="size-9 rounded-xl bg-subtle text-muted flex items-center justify-center">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      </span>
      <ChevronRight className="size-4 text-faint" />
    </Link>
  );
}
