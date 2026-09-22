import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "secondary" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand active:bg-brand-dark",
  outline: "border-2 border-brand bg-surface dark:bg-surface-dark active:bg-brand/5",
  ghost: "active:bg-subtle dark:active:bg-subtle-dark",
  secondary: "bg-subtle dark:bg-subtle-dark active:bg-subtle-strong dark:active:bg-subtle-strong-dark",
  soft: "bg-brand/10 active:bg-brand/15",
  danger: "bg-rose-600 active:bg-rose-700",
};

const TEXT_VARIANTS: Record<Variant, string> = {
  primary: "text-white",
  outline: "text-brand",
  ghost: "text-fg-soft dark:text-fg-soft-dark",
  secondary: "text-fg dark:text-fg-dark",
  soft: "text-brand",
  danger: "text-white",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 rounded-lg gap-1.5",
  md: "h-11 px-4 rounded-xl gap-2",
  lg: "h-12 px-5 rounded-xl gap-2",
  icon: "size-10 rounded-xl",
};

const TEXT_SIZES: Record<Size, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  icon: "text-sm",
};

const SPINNER_COLOR: Record<Variant, string> = {
  primary: "#ffffff",
  outline: "#00c950",
  ghost: "#27272a",
  secondary: "#09090b",
  soft: "#00c950",
  danger: "#ffffff",
};

interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children?: ReactNode;
}

export function Button({
  className,
  textClassName,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center font-semibold select-none",
        isDisabled && "opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <ActivityIndicator size="small" color={SPINNER_COLOR[variant]} /> : null}
      {typeof children === "string" ? (
        <Text className={cn("font-semibold", TEXT_SIZES[size], TEXT_VARIANTS[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
