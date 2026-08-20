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
    // safe-x : en paysage sur un telephone a encoche, le contenu ne passe
    // jamais sous l'arrondi de l'ecran. Vaut 0 en portrait et sur desktop.
    <div className="safe-x min-h-dvh w-full bg-canvas flex justify-center">
      <div
        className={cn(
          "relative w-full max-w-md bg-surface min-h-dvh shadow-xl shadow-zinc-300/40",
          // Reserve la place de la barre de navigation basse + la barre d'accueil du telephone.
          padBottom && "pb-[calc(6rem+var(--safe-bottom))]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
