import { View, Text } from "react-native";
import { Image } from "expo-image";
import { BadgeCheck } from "lucide-react-native";
import { cn, initials } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/api";

export function Avatar({
  name,
  src,
  size = 40,
  verified,
  className,
}: {
  name?: string | null;
  src?: string | null;
  size?: number;
  verified?: boolean;
  className?: string;
}) {
  return (
    <View className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {src ? (
        <Image
          source={{ uri: resolveImageUrl(src) ?? undefined }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <View
          className="rounded-full bg-brand/10 items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text className="text-brand font-semibold" style={{ fontSize: Math.max(11, size * 0.36) }}>
            {initials(name)}
          </Text>
        </View>
      )}
      {verified ? (
        <View className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full">
          <BadgeCheck size={size * 0.4} color="#00c950" fill="#ffffff" />
        </View>
      ) : null}
    </View>
  );
}
