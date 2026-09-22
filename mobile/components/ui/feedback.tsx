import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Text, View, type ViewProps } from "react-native";
import { AlertCircle, Loader2 } from "lucide-react-native";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  textClassName,
  variant = "default",
  children,
}: {
  className?: string;
  textClassName?: string;
  variant?: "default" | "brand" | "outline" | "muted";
  children?: ReactNode;
}) {
  const variants = {
    default: "bg-subtle dark:bg-subtle-dark",
    brand: "bg-brand",
    outline: "border border-line dark:border-line-dark bg-surface dark:bg-surface-dark",
    muted: "bg-brand/10",
  };
  const textVariants = {
    default: "text-fg-soft dark:text-fg-soft-dark",
    brand: "text-white",
    outline: "text-fg-soft dark:text-fg-soft-dark",
    muted: "text-brand",
  };
  return (
    <View className={cn("flex-row items-center gap-1 rounded-full px-2 py-0.5 self-start", variants[variant], className)}>
      <Text className={cn("text-xs font-medium", textVariants[variant], textClassName)}>{children}</Text>
    </View>
  );
}

export function Spinner({ className }: { className?: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 800, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <View className={cn("items-center justify-center py-12", className)}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader2 size={24} color="#00c950" />
      </Animated.View>
    </View>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <View className="flex-row items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-3">
      <AlertCircle size={16} color="#e11d48" style={{ marginTop: 2 }} />
      <Text className="flex-1 text-sm text-rose-700 dark:text-rose-300">{children}</Text>
    </View>
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
    <View className="items-center justify-center gap-3 px-8 py-14">
      {icon ? (
        <View className="size-14 rounded-2xl bg-subtle dark:bg-subtle-dark items-center justify-center">{icon}</View>
      ) : null}
      <View className="gap-1 items-center">
        <Text className="font-semibold text-fg-soft dark:text-fg-soft-dark text-center">{title}</Text>
        {description ? (
          <Text className="text-sm text-muted dark:text-muted-dark text-center leading-snug">{description}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function Skeleton({ className }: ViewProps & { className?: string }) {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ opacity }} className={cn("rounded-xl bg-subtle-strong/70 dark:bg-subtle-strong-dark/70", className)} />;
}
