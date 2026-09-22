import { useEffect, useState, type ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "lucide-react-native";
import { api } from "@/lib/api";
import type { SellerStats } from "@/lib/types";
import { ROLE_MAP } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/form";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ThemePreference } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatDate, formatGNF, formatNumber } from "@/lib/utils";

const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "auto", label: "Automatique", icon: SunMoon },
  { value: "clair", label: "Clair", icon: Sun },
  { value: "sombre", label: "Sombre", icon: Moon },
];

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  );
}

function Profile() {
  const insets = useSafeAreaInsets();
  const { user, isSeller, logout, updateProfile } = useAuth();
  const { preference, resolved, setPreference } = useTheme();
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
    <ScrollView className="flex-1 bg-canvas dark:bg-canvas-dark" showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#047857", "#00c950"]} className="rounded-b-3xl px-5 pb-8" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-start justify-between">
          <Avatar name={user.company || user.name} src={user.avatar_url} size={72} verified={user.verified} />
          <Pressable onPress={() => setEditing((e) => !e)} className="size-9 rounded-full bg-white/15 items-center justify-center">
            <Pencil size={16} color="#ffffff" />
          </Pressable>
        </View>
        <View className="mt-3 flex-row items-center gap-1.5">
          <Text className="font-bold text-xl tracking-tight text-white">{user.name}</Text>
          {user.verified ? <BadgeCheck size={20} color="#ffffff" /> : null}
        </View>
        {user.company ? <Text className="text-sm text-white/85">{user.company}</Text> : null}
        <View className="mt-2 flex-row flex-wrap items-center gap-2">
          <Badge className="bg-white/20" textClassName="text-white">
            <View className="flex-row items-center gap-1">
              <role.icon size={12} color="#ffffff" />
              <Text className="text-xs text-white">{role.label}</Text>
            </View>
          </Badge>
          {user.region ? (
            <Badge className="bg-white/20">
              <View className="flex-row items-center gap-1">
                <MapPin size={12} color="#ffffff" />
                <Text className="text-xs text-white">
                  {user.prefecture ? `${user.prefecture}, ` : ""}
                  {user.region}
                </Text>
              </View>
            </Badge>
          ) : null}
          {user.rating_count > 0 ? (
            <Badge className="bg-white/20">
              <View className="flex-row items-center gap-1">
                <Star size={12} color="#ffffff" fill="#ffffff" />
                <Text className="text-xs text-white">
                  {user.rating.toFixed(1)} ({user.rating_count})
                </Text>
              </View>
            </Badge>
          ) : null}
        </View>
      </LinearGradient>

      {editing ? (
        <View className="flex-col gap-4 p-5">
          <Text className="font-bold text-base text-fg dark:text-fg-dark">Modifier mon profil</Text>
          <Field label="Nom complet">
            <Input value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} />
          </Field>
          <Field label="Raison sociale">
            <Input value={draft.company} onChangeText={(v) => setDraft({ ...draft, company: v })} />
          </Field>
          <Field label="Adresse">
            <Input value={draft.address} onChangeText={(v) => setDraft({ ...draft, address: v })} />
          </Field>
          <Field label="Email">
            <Input value={draft.email} onChangeText={(v) => setDraft({ ...draft, email: v })} />
          </Field>
          <Field label="Présentation">
            <Textarea value={draft.description} onChangeText={(v) => setDraft({ ...draft, description: v })} />
          </Field>
          <View className="flex-row gap-3">
            <Button variant="secondary" className="flex-1" onPress={() => setEditing(false)}>
              Annuler
            </Button>
            <Button className="flex-1" loading={saving} onPress={save}>
              Enregistrer
            </Button>
          </View>
        </View>
      ) : (
        <>
          {isSeller && stats ? (
            <View className="flex-row gap-3 p-5">
              <StatCard label="Annonces" value={formatNumber(stats.active)} />
              <StatCard label="Vues" value={formatNumber(stats.views)} />
              <StatCard label="Ventes" value={formatNumber(stats.delivered)} />
            </View>
          ) : null}

          <View className="px-5 pt-2">
            <Text className="mb-3 font-semibold text-base text-fg dark:text-fg-dark">Coordonnées</Text>
            <View className="rounded-2xl border border-line dark:border-line-dark">
              <InfoRow icon={<Phone size={16} color="#00c950" />} label="Téléphone" value={user.phone} />
              {user.email ? <InfoRow icon={<Mail size={16} color="#00c950" />} label="Email" value={user.email} /> : null}
              {user.address ? <InfoRow icon={<MapPin size={16} color="#00c950" />} label="Adresse" value={user.address} /> : null}
              <InfoRow icon={<ShieldCheck size={16} color="#00c950" />} label="Membre depuis" value={formatDate(user.created_at)} last />
            </View>
          </View>

          {user.description ? (
            <View className="px-5 pt-5">
              <Text className="mb-2 font-semibold text-base text-fg dark:text-fg-dark">À propos</Text>
              <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">{user.description}</Text>
            </View>
          ) : null}

          <View className="flex-col gap-2 px-5 pt-6">
            <Text className="mb-1 font-semibold text-base text-fg dark:text-fg-dark">Mon activité</Text>
            <MenuLink onPress={() => router.push("/orders")} icon={<ShoppingBag size={20} color="#71717b" />} label="Mes commandes" />
            <MenuLink onPress={() => router.push("/favorites")} icon={<Heart size={20} color="#71717b" />} label="Mes favoris" />
            {isSeller ? (
              <>
                <MenuLink
                  onPress={() => router.push("/seller/dashboard")}
                  icon={<TrendingUp size={20} color="#71717b" />}
                  label="Tableau de bord vendeur"
                  hint={stats ? `${formatGNF(stats.revenue, { short: true })} de ventes` : undefined}
                />
                <MenuLink
                  onPress={() => router.push("/seller/listings")}
                  icon={<Package size={20} color="#71717b" />}
                  label="Mes annonces"
                  hint={stats ? `${stats.active} active${stats.active > 1 ? "s" : ""}` : undefined}
                />
                <MenuLink
                  onPress={() => router.push("/seller/orders")}
                  icon={<Store size={20} color="#71717b" />}
                  label="Commandes reçues"
                  hint={stats?.pending ? `${stats.pending} à traiter` : undefined}
                />
                <MenuLink onPress={() => router.push(`/seller/${user.id}`)} icon={<Settings size={20} color="#71717b" />} label="Voir ma boutique publique" />
              </>
            ) : null}
          </View>

          <View className="flex-col gap-3 px-5 pt-6">
            <View>
              <Text className="font-semibold text-base text-fg dark:text-fg-dark">Apparence</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">
                {preference === "auto" ? `Suit votre téléphone — actuellement en ${resolved}` : "Réglage fixe, quel que soit votre téléphone"}
              </Text>
            </View>
            <View className="flex-row gap-2 rounded-2xl border border-line dark:border-line-dark p-1.5">
              {THEMES.map((t) => {
                const active = preference === t.value;
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => setPreference(t.value)}
                    className={cn("flex-1 items-center gap-1.5 rounded-xl py-3", active && "bg-brand")}
                  >
                    <t.icon size={20} color={active ? "#ffffff" : "#71717b"} />
                    <Text className={cn("text-xs font-medium", active ? "text-white" : "text-muted dark:text-muted-dark")}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="p-5 pt-8">
            <Button
              variant="secondary"
              className="w-full"
              onPress={logout}
            >
              <LogOut size={16} color="#e11d48" />
              <Text className="font-semibold text-rose-600 dark:text-rose-400 text-sm ml-2">Se déconnecter</Text>
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-line dark:border-line-dark p-3 items-center">
      <Text className="font-extrabold text-brand text-lg leading-6">{value}</Text>
      <Text className="text-[11px] text-muted dark:text-muted-dark">{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <View className={cn("flex-row items-center gap-3 p-3.5", !last && "border-b border-line-soft dark:border-line-soft-dark")}>
      <View className="size-9 rounded-xl bg-brand/10 items-center justify-center">{icon}</View>
      <View className="flex-1">
        <Text className="text-xs text-muted dark:text-muted-dark">{label}</Text>
        <Text numberOfLines={1} className="text-sm font-medium text-fg dark:text-fg-dark">
          {value}
        </Text>
      </View>
    </View>
  );
}

function MenuLink({ onPress, icon, label, hint }: { onPress: () => void; icon: ReactNode; label: string; hint?: string }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-3.5">
      <View className="size-9 rounded-xl bg-subtle dark:bg-subtle-dark items-center justify-center">{icon}</View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-fg dark:text-fg-dark">{label}</Text>
        {hint ? <Text className="text-xs text-muted dark:text-muted-dark">{hint}</Text> : null}
      </View>
      <ChevronRight size={16} color="#8e8e98" />
    </Pressable>
  );
}
