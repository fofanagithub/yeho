import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Conteneur mobile-first : plein écran sur téléphone,
 * cadre centré facon smartphone sur grand écran.
 */
export function PhoneShell({
  children,
  className,
  padBottom = true,
}: {
  children: ReactNode;
  className?: string;
  padBottom?: boolean;
}) {
  return (
    <div className="min-h-screen w-full bg-zinc-100 flex justify-center">
      <div
        className={cn(
          "relative w-full max-w-md bg-white min-h-screen shadow-xl shadow-zinc-300/40",
          padBottom && "pb-24",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
