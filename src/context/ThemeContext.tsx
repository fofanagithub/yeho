import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

function lirePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "clair" || v === "sombre" || v === "auto") return v;
  } catch {
    /* navigateur en navigation privee stricte */
  }
  return "auto";
}

function systemeEnSombre() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

/** Aligne la couleur de la barre d'etat du telephone sur le fond de l'application. */
function majBarreEtat(resolved: ThemeResolved) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "sombre" ? "#09090b" : "#00c950");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(lirePreference);
  const [systemeSombre, setSystemeSombre] = useState(systemeEnSombre);

  // Suit le reglage du telephone en direct : si l'utilisateur bascule son
  // mode nuit pendant que l'application est ouverte, l'ecran suit aussitot.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setSystemeSombre(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved: ThemeResolved =
    preference === "auto" ? (systemeSombre ? "sombre" : "clair") : preference;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "sombre");
    majBarreEtat(resolved);
  }, [resolved]);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
  }, []);

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
