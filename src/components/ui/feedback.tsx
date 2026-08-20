import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "brand" | "outline" | "muted" }) {
  const variants = {
    default: "bg-subtle text-fg-soft",
    brand: "bg-brand text-white",
    outline: "border border-line bg-surface text-fg-soft",
    muted: "bg-brand/10 text-brand",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Loader2 className="size-6 animate-spin text-brand" />
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-3 text-sm text-rose-700 dark:text-rose-300">
      <AlertCircle className="size-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
      {icon ? (
        <div className="size-14 rounded-2xl bg-subtle text-faint flex items-center justify-center">{icon}</div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-fg-soft">{title}</p>
        {description ? <p className="text-sm text-muted leading-snug">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-subtle-strong/70", className)} />;
}
