import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "brand" | "outline" | "muted" }) {
  const variants = {
    default: "bg-zinc-100 text-zinc-700",
    brand: "bg-brand text-white",
    outline: "border border-zinc-200 bg-white text-zinc-700",
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
    <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
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
        <div className="size-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center">{icon}</div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-zinc-800">{title}</p>
        {description ? <p className="text-sm text-zinc-500 leading-snug">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-zinc-200/70", className)} />;
}
