import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  subtitle,
  right,
  back = true,
  onBack,
  className,
  sticky = true,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  back?: boolean;
  onBack?: () => void;
  className?: string;
  sticky?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        // pt calcule : le titre ne passe jamais sous la barre d'etat ou l'encoche.
        "flex items-center gap-3 border-b border-line bg-surface px-4 pb-3 pt-[calc(0.75rem+var(--safe-top))]",
        sticky && "sticky top-0 z-40",
        className,
      )}
    >
      {back ? (
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="size-9 -ml-1.5 rounded-full text-fg-soft hover:bg-subtle flex items-center justify-center"
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}
      <div className="flex-1 min-w-0">
        {title ? <h1 className="font-bold text-lg leading-6 truncate">{title}</h1> : null}
        {subtitle ? <p className="text-xs text-muted truncate">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
