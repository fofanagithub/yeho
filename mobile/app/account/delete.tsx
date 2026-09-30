import { useState } from "react";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { TriangleAlert } from "lucide-react-native";
import { api } from "@/lib/api";
import { confirmAction } from "@/lib/confirm";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { ErrorNote } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function DeleteAccountScreen() {
  return (
    <RequireAuth>
      <DeleteAccount />
    </RequireAuth>
  );
}

const CONSEQUENCES = [
  "Votre profil, vos annonces et leurs photos",
  "Vos favoris, vos avis et toutes vos conversations",
  "Vos commandes en cours sont annulées",
  "Les commandes terminées restent chez l'autre partie, sans votre nom ni vos coordonnées",
];

function DeleteAccount() {
  const { logout } = useAuth();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    setError("");
    try {
      await api.deleteAccount(password);
      // On quitte l'ecran avant de vider la session, sinon RequireAuth redirige vers la connexion.
      router.replace("/(tabs)");
      logout();
      toast("Votre compte a été supprimé");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    } finally {
      setLoading(false);
    }
  }

  function confirm() {
    if (!password) return setError("Saisissez votre mot de passe pour confirmer");
    confirmAction({
      title: "Supprimer définitivement ?",
      message: "Cette action est irréversible.",
      confirmLabel: "Supprimer",
      onConfirm: remove,
    });
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Supprimer mon compte" />
      <ScrollView contentContainerClassName="flex-col gap-5 p-5" keyboardShouldPersistTaps="handled">
        <View className="flex-row gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-4">
          <TriangleAlert size={20} color="#e11d48" />
          <View className="flex-1 gap-2">
            <Text className="font-semibold text-sm text-rose-700 dark:text-rose-300">Ce qui sera supprimé</Text>
            {CONSEQUENCES.map((c) => (
              <Text key={c} className="text-sm text-rose-700 dark:text-rose-300">
                • {c}
              </Text>
            ))}
          </View>
        </View>

        <ErrorNote>{error}</ErrorNote>

        <Field label="Mot de passe" hint="Pour confirmer que c'est bien vous">
          <Input secureTextEntry value={password} onChangeText={setPassword} placeholder="••••••••" autoComplete="current-password" />
        </Field>

        <Button variant="danger" size="lg" loading={loading} onPress={confirm}>
          Supprimer définitivement mon compte
        </Button>
        <Button variant="secondary" onPress={() => router.back()}>
          Annuler
        </Button>
      </ScrollView>
    </View>
  );
}
