import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "secondary" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-md shadow-brand/25 hover:bg-brand/90 active:bg-brand/95",
  outline: "border-2 border-brand text-brand bg-white hover:bg-brand/5",
  ghost: "text-zinc-700 hover:bg-zinc-100",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  soft: "bg-brand/10 text-brand hover:bg-brand/15",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-5 text-base rounded-xl gap-2",
  icon: "size-10 rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors select-none",
        "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
