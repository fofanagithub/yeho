import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { CheckCircle2, Info, XCircle } from "lucide-react-native";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

const ToastContext = createContext<{ toast: (message: string, kind?: ToastKind) => void } | null>(null);

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const STYLES = {
  success: "bg-fg dark:bg-fg-dark",
  error: "bg-rose-600",
  info: "bg-fg dark:bg-fg-dark",
};
const TEXT_STYLES = {
  success: "text-canvas dark:text-canvas-dark",
  error: "text-white",
  info: "text-canvas dark:text-canvas-dark",
};
/** lucide-react-native n'accepte pas className sur ses icones SVG : couleur explicite. */
const ICON_COLORS = { success: "#f4f4f5", error: "#ffffff", info: "#f4f4f5" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-24 z-50 items-center gap-2 px-6"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <View
              key={t.id}
              className={cn(
                "flex-row items-center gap-2 rounded-xl px-4 py-3 shadow-lg max-w-sm",
                STYLES[t.kind],
              )}
            >
              <Icon size={16} color={ICON_COLORS[t.kind]} />
              <Text className={cn("text-sm font-medium", TEXT_STYLES[t.kind])}>{t.message}</Text>
            </View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans ToastProvider");
  return ctx.toast;
}
