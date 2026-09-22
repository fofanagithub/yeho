import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  subtitle,
  right,
  back = true,
  onBack,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  back?: boolean;
  onBack?: () => void;
  className?: string;
}) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e7" : "#27272a";

  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className={cn(
        "flex-row items-center gap-3 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-4 pb-3",
        className,
      )}
    >
      {back ? (
        <Pressable
          onPress={() => (onBack ? onBack() : router.back())}
          hitSlop={8}
          className="size-9 -ml-1.5 rounded-full items-center justify-center active:bg-subtle dark:active:bg-subtle-dark"
        >
          <ChevronLeft size={20} color={iconColor} />
        </Pressable>
      ) : null}
      <View className="flex-1">
        {title ? (
          <Text numberOfLines={1} className="font-bold text-lg leading-6 text-fg dark:text-fg-dark">
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text numberOfLines={1} className="text-xs text-muted dark:text-muted-dark">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
