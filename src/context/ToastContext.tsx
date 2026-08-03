import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
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
  success: "bg-zinc-900 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-zinc-800 text-white",
};

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
      <div className="fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-6 pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={cn(
                "animate-fade-up flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg max-w-sm",
                STYLES[t.kind],
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans ToastProvider");
  return ctx.toast;
}
