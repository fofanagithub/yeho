import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Star } from "lucide-react-native";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { useToast } from "@/context/ToastContext";

const LABELS = ["", "Très décevant", "Décevant", "Correct", "Bien", "Excellent"];

/** Notation du vendeur par l'acheteur, une fois la commande livrée. */
export function ReviewCard({
  sellerId,
  sellerName,
  initial,
}: {
  sellerId: number;
  sellerName: string;
  initial?: { rating: number; comment: string | null } | null;
}) {
  const toast = useToast();
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [saved, setSaved] = useState(!!initial);
  const [editing, setEditing] = useState(!initial);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!rating) return toast("Choisissez une note", "error");
    setSending(true);
    try {
      await api.reviewSeller(sellerId, rating, comment.trim() || undefined);
      setSaved(true);
      setEditing(false);
      toast("Merci pour votre avis !");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Envoi impossible", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <View className="flex-col gap-3 rounded-2xl border border-line dark:border-line-dark p-4">
      <View className="gap-0.5">
        <Text className="font-semibold text-sm text-fg dark:text-fg-dark">
          {saved && !editing ? "Votre avis" : `Notez ${sellerName}`}
        </Text>
        {editing ? (
          <Text className="text-xs text-muted dark:text-muted-dark">Votre avis aide les autres acheteurs à choisir.</Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            disabled={!editing}
            onPress={() => setRating(n)}
            hitSlop={4}
            accessibilityLabel={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <Star size={28} color={n <= rating ? "#f59e0b" : "#a1a1aa"} fill={n <= rating ? "#f59e0b" : "none"} />
          </Pressable>
        ))}
        {rating ? <Text className="ml-2 text-xs text-muted dark:text-muted-dark">{LABELS[rating]}</Text> : null}
      </View>

      {editing ? (
        <>
          <Textarea
            value={comment}
            onChangeText={setComment}
            placeholder="Qualité, respect des délais, emballage… (facultatif)"
            maxLength={1000}
          />
          <Button loading={sending} onPress={submit} disabled={!rating} className={!rating ? "opacity-50" : undefined}>
            {saved ? "Mettre à jour mon avis" : "Publier mon avis"}
          </Button>
        </>
      ) : (
        <>
          {comment ? <Text className="text-sm text-muted dark:text-muted-dark">{comment}</Text> : null}
          <Pressable onPress={() => setEditing(true)} hitSlop={6}>
            <Text className="text-sm font-semibold text-brand">Modifier mon avis</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
