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
        "flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3",
        sticky && "sticky top-0 z-40",
        className,
      )}
    >
      {back ? (
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="size-9 -ml-1.5 rounded-full text-zinc-700 hover:bg-zinc-100 flex items-center justify-center"
          aria-label="Retour"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}
      <div className="flex-1 min-w-0">
        {title ? <h1 className="font-bold text-lg leading-6 truncate">{title}</h1> : null}
        {subtitle ? <p className="text-xs text-zinc-500 truncate">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
