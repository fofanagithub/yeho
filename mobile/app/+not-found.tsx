import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Introuvable" }} />
      <View className="flex-1 items-center justify-center gap-4 bg-canvas dark:bg-canvas-dark p-5">
        <Text className="text-lg font-semibold text-fg dark:text-fg-dark">Cette page n'existe pas.</Text>
        <Link href="/" className="text-brand font-semibold">
          Revenir à l'accueil
        </Link>
      </View>
    </>
  );
}
