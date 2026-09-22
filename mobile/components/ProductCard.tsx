import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { BadgeCheck, Heart, MapPin, Package } from "lucide-react-native";
import { cn, formatGNF } from "@/lib/utils";
import { imageUrl, TAILLES } from "@/lib/image";
import type { Product } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/constants";

export function ProductCard({
  product,
  onToggleFavorite,
  variant = "grid",
}: {
  product: Product;
  onToggleFavorite?: (product: Product) => void;
  variant?: "grid" | "row";
}) {
  const category = CATEGORY_MAP[product.category];

  if (variant === "row") {
    return (
      <Link href={`/product/${product.id}`} asChild>
        <Pressable className="flex-row gap-3 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-3 active:opacity-80">
          <Thumb product={product} width={TAILLES.vignetteListe} className="size-24 rounded-xl" />
          <View className="flex-1 flex-col gap-1">
            <View className="flex-row items-start gap-2">
              <Text numberOfLines={2} className="flex-1 font-semibold text-sm leading-5 text-fg dark:text-fg-dark">
                {product.title}
              </Text>
              {onToggleFavorite ? <FavButton product={product} onToggle={onToggleFavorite} /> : null}
            </View>
            <Text className="font-bold text-brand text-base leading-6">
              {formatGNF(product.price)}
              <Text className="font-normal text-muted dark:text-muted-dark text-xs"> / {product.unit}</Text>
            </Text>
            <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
              <View className="flex-row items-center gap-1">
                <Package size={12} color="#71717b" />
                <Text className="text-xs text-muted dark:text-muted-dark">min. {product.min_order}</Text>
              </View>
              {product.region ? (
                <View className="flex-row items-center gap-1">
                  <MapPin size={12} color="#71717b" />
                  <Text className="text-xs text-muted dark:text-muted-dark">{product.region}</Text>
                </View>
              ) : null}
            </View>
            <SellerLine product={product} />
          </View>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable className="flex-1 flex-col overflow-hidden rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark active:opacity-80">
        <View className="relative">
          <Thumb product={product} width={TAILLES.carteGrille} className="aspect-[4/3] w-full" rounded={false} />
          {category ? (
            <View className={cn("absolute top-2 left-2 rounded-full px-2 py-0.5", category.color)}>
              <Text className="text-[10px] font-semibold">{category.label}</Text>
            </View>
          ) : null}
          {onToggleFavorite ? (
            <View className="absolute top-2 right-2">
              <FavButton product={product} onToggle={onToggleFavorite} solid />
            </View>
          ) : null}
        </View>
        <View className="flex-col gap-1 p-3">
          <Text numberOfLines={2} className="font-semibold text-sm leading-5 text-fg dark:text-fg-dark min-h-10">
            {product.title}
          </Text>
          <Text className="font-bold text-brand text-sm leading-5">
            {formatGNF(product.price)}
            <Text className="font-normal text-muted dark:text-muted-dark text-[11px]"> / {product.unit}</Text>
          </Text>
          <SellerLine product={product} />
        </View>
      </Pressable>
    </Link>
  );
}

function Thumb({
  product,
  width,
  className,
  rounded = true,
}: {
  product: Product;
  width: number;
  className?: string;
  rounded?: boolean;
}) {
  if (!product.image_url) {
    return (
      <View className={cn("bg-subtle dark:bg-subtle-dark items-center justify-center shrink-0", rounded && "rounded-xl", className)}>
        <Package size={28} color="#8e8e98" />
      </View>
    );
  }
  return (
    <Image
      source={{ uri: imageUrl(product.image_url, width) }}
      contentFit="cover"
      transition={150}
      className={cn("shrink-0 bg-subtle dark:bg-subtle-dark", rounded && "rounded-xl", className)}
    />
  );
}

function SellerLine({ product }: { product: Product }) {
  return (
    <View className="flex-row items-center gap-1">
      <Text numberOfLines={1} className="flex-1 text-[11px] text-muted dark:text-muted-dark">
        {product.seller_company || product.seller_name}
      </Text>
      {product.seller_verified ? <BadgeCheck size={12} color="#00c950" /> : null}
    </View>
  );
}

function FavButton({
  product,
  onToggle,
  solid,
}: {
  product: Product;
  onToggle: (p: Product) => void;
  solid?: boolean;
}) {
  return (
    <Pressable
      onPress={() => onToggle(product)}
      hitSlop={8}
      className={cn("items-center justify-center rounded-full", solid ? "size-7 bg-white/90" : "size-6")}
    >
      <Heart
        size={16}
        color={product.is_favorite ? "#f43f5e" : "#8e8e98"}
        fill={product.is_favorite ? "#f43f5e" : "none"}
      />
    </Pressable>
  );
}
