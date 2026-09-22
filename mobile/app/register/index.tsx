import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowRight, Check, Store, UserRoundCheck } from "lucide-react-native";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export default function ProfileType() {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        back
        onBack={() => router.replace("/")}
        right={
          <Badge variant="outline">
            <View className="flex-row items-center gap-1">
              <Store size={12} color="#00c950" />
              <Text className="text-xs">Yehoo</Text>
            </View>
          </Badge>
        }
      />

      <ScrollView contentContainerClassName="flex-col p-7 flex-1">
        <View className="mb-7 flex-col gap-2">
          <View className="mb-1 size-12 rounded-2xl bg-brand/10 items-center justify-center">
            <UserRoundCheck size={24} color="#00c950" />
          </View>
          <Text className="font-bold text-2xl tracking-tight text-fg dark:text-fg-dark">Quel est votre profil ?</Text>
          <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">
            Choisissez le statut qui vous correspond pour créer un compte adapté à votre activité.
          </Text>
        </View>

        <View className="flex-1 flex-col gap-3">
          {ROLES.map((role) => {
            const active = selected === role.value;
            return (
              <Pressable
                key={role.value}
                onPress={() => setSelected(role.value)}
                className={cn(
                  "flex-row items-center gap-4 rounded-2xl border p-4",
                  active
                    ? "border-brand bg-brand/5"
                    : "border-line dark:border-line-dark bg-surface dark:bg-surface-dark",
                )}
              >
                <View className="size-11 shrink-0 rounded-xl bg-brand/10 items-center justify-center">
                  <role.icon size={24} color="#00c950" />
                </View>
                <View className="flex-1 flex-col">
                  <Text className="font-semibold text-sm text-fg dark:text-fg-dark">{role.label}</Text>
                  <Text className="text-xs text-muted dark:text-muted-dark">{role.tagline}</Text>
                </View>
                <View
                  className={cn(
                    "size-5 shrink-0 rounded-full items-center justify-center",
                    active ? "bg-brand" : "border-2 border-line dark:border-line-dark",
                  )}
                >
                  {active ? <Check size={12} color="#ffffff" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-7 flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={!selected}
            onPress={() => selected && router.push(`/register/${selected}`)}
          >
            <Text className="font-semibold text-white text-base mr-2">Continuer</Text>
            <ArrowRight size={20} color="#ffffff" />
          </Button>
          <Text className="text-center text-sm text-muted dark:text-muted-dark">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-semibold text-brand">
              Se connecter
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
