import { useEffect, type ReactNode } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { Lock } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { Spinner, EmptyState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";

export function RequireAuth({ children, seller = false }: { children: ReactNode; seller?: boolean }) {
  const { user, loading, isSeller } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
  }, [loading, user]);

  if (loading || !user) return <Spinner className="flex-1" />;

  if (seller && !isSeller) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <TopBar title="Espace vendeur" />
        <EmptyState
          icon={<Lock size={24} color="#8e8e98" />}
          title="Réservé aux comptes vendeurs"
          description="Votre compte particulier ne permet pas de publier d'annonces. Passez en compte importateur, agriculteur, industriel ou détaillant."
          action={
            <Button onPress={() => router.push("/(tabs)/profile")} className="mt-2">
              Voir mon profil
            </Button>
          }
        />
      </View>
    );
  }

  return <>{children}</>;
}
