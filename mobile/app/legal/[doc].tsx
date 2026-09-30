import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopBar } from "@/components/layout/TopBar";
import { LEGAL_UPDATED_AT, PRIVACY, TERMS } from "@/lib/legal";

const DOCS = {
  cgu: { title: "Conditions d'utilisation", sections: TERMS },
  confidentialite: { title: "Confidentialité", sections: PRIVACY },
};

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const insets = useSafeAreaInsets();
  const page = DOCS[doc as keyof typeof DOCS] ?? DOCS.cgu;

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title={page.title} />
      <ScrollView contentContainerClassName="flex-col gap-5 p-5" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <Text className="text-xs text-muted dark:text-muted-dark">Dernière mise à jour : {LEGAL_UPDATED_AT}</Text>
        {page.sections.map((s) => (
          <View key={s.title} className="gap-1.5">
            <Text className="font-semibold text-base text-fg dark:text-fg-dark">{s.title}</Text>
            <Text className="text-sm leading-relaxed text-fg-soft dark:text-fg-soft-dark">{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
