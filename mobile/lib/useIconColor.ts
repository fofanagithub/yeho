import { useColorScheme } from "nativewind";

/** Couleur d'icône « texte principal » lisible dans les deux thèmes. */
export function useIconColor() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? "#e4e4e7" : "#27272a";
}
