import { useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ban, Check, Flag, MoreHorizontal, ShieldCheck } from "lucide-react-native";
import { api } from "@/lib/api";
import { confirmAction } from "@/lib/confirm";
import type { ReportTarget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

/** Memes cles que REPORT_REASONS cote serveur (server/routes/moderation.js). */
const REASONS = [
  { value: "arnaque", label: "Arnaque ou fraude" },
  { value: "interdit", label: "Produit interdit ou illégal" },
  { value: "trompeur", label: "Annonce trompeuse" },
  { value: "offensant", label: "Contenu offensant ou haineux" },
  { value: "harcelement", label: "Harcèlement" },
  { value: "spam", label: "Spam" },
  { value: "autre", label: "Autre" },
];

const TARGET_LABEL: Record<ReportTarget, string> = {
  product: "cette annonce",
  user: "ce compte",
  message: "ce message",
  review: "cet avis",
};

function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-surface dark:bg-surface-dark rounded-t-2xl pb-10" onPress={(e) => e.stopPropagation()}>
          <View className="items-center py-3">
            <View className="h-1 w-10 rounded-full bg-subtle-strong dark:bg-subtle-strong-dark" />
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Formulaire de signalement : motif + precisions facultatives. */
export function ReportSheet({
  target,
  onClose,
}: {
  target: { type: ReportTarget; id: number } | null;
  onClose: () => void;
}) {
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  function close() {
    setReason("");
    setDetails("");
    onClose();
  }

  async function submit() {
    if (!target || !reason) return;
    setSending(true);
    try {
      await api.report({ target_type: target.type, target_id: target.id, reason, details: details.trim() || undefined });
      toast("Merci, notre équipe examinera ce signalement sous 24 h");
      close();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Signalement impossible", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <Sheet visible={!!target} onClose={close}>
      <View className="px-5 gap-1 pb-3">
        <Text className="font-bold text-base text-fg dark:text-fg-dark">Signaler {target ? TARGET_LABEL[target.type] : ""}</Text>
        <Text className="text-xs text-muted dark:text-muted-dark">
          Votre signalement est anonyme. La personne concernée ne saura pas qui l'a envoyé.
        </Text>
      </View>
      <View className="px-2">
        {REASONS.map((r) => {
          const active = r.value === reason;
          return (
            <Pressable
              key={r.value}
              onPress={() => setReason(r.value)}
              className={cn("flex-row items-center justify-between px-4 py-3 rounded-xl", active && "bg-brand/10")}
            >
              <Text className={cn("text-sm", active ? "text-brand font-semibold" : "text-fg dark:text-fg-dark")}>{r.label}</Text>
              {active ? <Check size={16} color="#00c950" /> : null}
            </Pressable>
          );
        })}
      </View>
      <View className="px-5 pt-2 gap-3">
        <Textarea value={details} onChangeText={setDetails} placeholder="Précisions (facultatif)" maxLength={1000} />
        <Button variant="danger" loading={sending} disabled={!reason} onPress={submit} className={cn(!reason && "opacity-50")}>
          Envoyer le signalement
        </Button>
      </View>
    </Sheet>
  );
}

/**
 * Bouton « ... » qui propose de signaler un contenu et, si un utilisateur est
 * fourni, de le bloquer ou le debloquer. Exigence App Store 1.2 pour les
 * applications dont le contenu est publie par les utilisateurs.
 */
export function ModerationMenu({
  target,
  person,
  blocked = false,
  onBlockedChange,
  iconColor = "#71717b",
  className,
}: {
  target: { type: ReportTarget; id: number };
  person?: { id: number; name: string };
  blocked?: boolean;
  onBlockedChange?: (blocked: boolean) => void;
  iconColor?: string;
  className?: string;
}) {
  const { user } = useAuth();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reporting, setReporting] = useState<typeof target | null>(null);

  // On ne se signale pas soi-meme.
  const ownerId = person?.id ?? (target.type === "user" ? target.id : undefined);
  if (user && ownerId === user.id) return null;

  function requireLogin() {
    if (user) return true;
    setMenuOpen(false);
    router.push("/login");
    return false;
  }

  function toggleBlock() {
    if (!person || !requireLogin()) return;
    setMenuOpen(false);
    if (blocked) {
      api
        .unblock(person.id)
        .then(() => {
          onBlockedChange?.(false);
          toast(`${person.name} est débloqué`);
        })
        .catch(() => toast("Action impossible", "error"));
      return;
    }
    confirmAction({
      title: `Bloquer ${person.name} ?`,
      message:
        "Vous ne verrez plus ses annonces ni ses messages, et cette personne ne pourra plus vous écrire. Vous pourrez la débloquer depuis votre profil.",
      confirmLabel: "Bloquer",
      onConfirm: () =>
        api
          .block(person.id)
          .then(() => {
            onBlockedChange?.(true);
            toast(`${person.name} est bloqué`);
          })
          .catch(() => toast("Action impossible", "error")),
    });
  }

  return (
    <>
      <Pressable
        onPress={() => setMenuOpen(true)}
        hitSlop={8}
        accessibilityLabel="Signaler ou bloquer"
        className={cn("size-9 rounded-full items-center justify-center", className)}
      >
        <MoreHorizontal size={20} color={iconColor} />
      </Pressable>

      <Sheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <View className="px-2">
          <Pressable
            onPress={() => {
              if (!requireLogin()) return;
              setMenuOpen(false);
              // iOS n'affiche pas une modale tant que la precedente n'est pas refermee.
              setTimeout(() => setReporting(target), 400);
            }}
            className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl active:bg-subtle dark:active:bg-subtle-dark"
          >
            <Flag size={20} color="#e11d48" />
            <Text className="text-sm font-medium text-rose-600 dark:text-rose-400">Signaler {TARGET_LABEL[target.type]}</Text>
          </Pressable>
          {person ? (
            <Pressable
              onPress={toggleBlock}
              className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl active:bg-subtle dark:active:bg-subtle-dark"
            >
              {blocked ? <ShieldCheck size={20} color="#71717b" /> : <Ban size={20} color="#71717b" />}
              <Text className="text-sm font-medium text-fg dark:text-fg-dark">
                {blocked ? `Débloquer ${person.name}` : `Bloquer ${person.name}`}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Sheet>

      <ReportSheet target={reporting} onClose={() => setReporting(null)} />
    </>
  );
}
