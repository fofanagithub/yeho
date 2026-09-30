import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";

/** Ce que l'utilisateur choisit. */
export type ThemePreference = "auto" | "clair" | "sombre";
/** Ce qui est reellement applique a l'ecran. */
export type ThemeResolved = "clair" | "sombre";

const STORAGE_KEY = "yehoo.theme";

interface ThemeValue {
  preference: ThemePreference;
  resolved: ThemeResolved;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

const toNativeWind = (p: ThemePreference) =>
  p === "auto" ? "system" : p === "clair" ? "light" : "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // NativeWind pilote directement les classes `dark:` a partir de ce reglage —
  // equivalent natif de la classe `.dark` posee sur <html> cote web.
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");

  // Charge le choix sauvegarde au demarrage (AsyncStorage ~= localStorage).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      const p = v === "clair" || v === "sombre" || v === "auto" ? (v as ThemePreference) : "auto";
      setPreferenceState(p);
      setColorScheme(toNativeWind(p));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPreference = useCallback(
    (p: ThemePreference) => {
      setPreferenceState(p);
      setColorScheme(toNativeWind(p));
      AsyncStorage.setItem(STORAGE_KEY, p);
    },
    [setColorScheme],
  );

  const resolved: ThemeResolved = colorScheme === "dark" ? "sombre" : "clair";

  // Sur le web, `darkMode: "class"` attend une classe .dark sur <html> : sans
  // elle, le mode automatique d'un systeme sombre garde l'interface claire
  // tandis que les couleurs calculees en JS (icones) passent en sombre.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", resolved === "sombre");
  }, [resolved]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé dans ThemeProvider");
  return ctx;
}
