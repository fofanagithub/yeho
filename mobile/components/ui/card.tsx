import type { ReactNode } from "react";
import { Text, View, type TextProps, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("rounded-2xl bg-surface dark:bg-surface-dark border border-line/80 dark:border-line-dark", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex-col gap-1 p-4 pb-2", className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: TextProps & { children?: ReactNode }) {
  return (
    <Text className={cn("font-semibold text-sm leading-5 text-fg dark:text-fg-dark", className)} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn("p-4 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ViewProps) {
  return <View className={cn("flex-row items-center gap-2 p-4 pt-0", className)} {...props} />;
}
