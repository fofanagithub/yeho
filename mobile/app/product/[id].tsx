import { useCallback, useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BadgeCheck,
  ChevronLeft,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react-native";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge, Spinner } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { imageUrl, TAILLES } from "@/lib/image";
import { cn, formatGNF, formatNumber } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();
  const { add } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .product(id)
      .then(({ product, similar }) => {
        if (!alive) return;
        setProduct(product);
        setSimilar(similar);
        setQuantity(product.min_order);
      })
      .catch(() => toast("Produit introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const unitPrice = useCallback(
    (qty: number) => {
      if (!product?.tiers?.length) return product?.price ?? 0;
      const tier = [...product.tiers].filter((t) => t.min_qty <= qty).pop();
      return tier?.price ?? product.price;
    },
    [product],
  );

  async function toggleFavorite() {
    if (!product) return;
    if (!user) return toast("Connectez-vous pour enregistrer vos favoris", "info");
    const next = !product.is_favorite;
    setProduct({ ...product, is_favorite: next });
    try {
      if (next) await api.addFavorite(product.id);
      else await api.removeFavorite(product.id);
    } catch {
      toast("Action impossible", "error");
    }
  }

  async function contactSeller() {
    if (!product) return;
    if (!user) return router.push("/login");
    if (user.id === product.seller_id) return toast("C'est votre propre annonce", "info");
    setContacting(true);
    try {
      const { conversation } = await api.startConversation({
        seller_id: product.seller_id,
        product_id: product.id,
      });
      router.push(`/chat/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    } finally {
      setContacting(false);
    }
  }

  function addToCart() {
    if (!product) return;
    add(product, quantity);
    toast(`${quantity} ${product.unit}${quantity > 1 ? "s" : ""} ajouté(s) au panier`);
  }

  if (loading) return <Spinner className="flex-1 bg-canvas dark:bg-canvas-dark" />;

  if (!product) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark items-center justify-center p-8">
        <Text className="text-sm text-muted dark:text-muted-dark text-center">
          Ce produit n'existe plus.{" "}
          <Link href="/(tabs)/search" className="font-semibold text-brand">
            Retour à la recherche
          </Link>
        </Text>
      </View>
    );
  }

  const category = CATEGORY_MAP[product.category];
  const price = unitPrice(quantity);
  const total = price * quantity;
  const isOwner = user?.id === product.seller_id;

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View className="relative">
          {product.image_url ? (
            <Image
              source={{ uri: imageUrl(product.image_url, TAILLES.ficheProduit) }}
              style={{ width: "100%", aspectRatio: 4 / 3 }}
              contentFit="cover"
            />
          ) : (
            <View className="h-72 w-full bg-subtle dark:bg-subtle-dark items-center justify-center">
              <Package size={48} color="#8e8e98" />
            </View>
          )}
          <View className="absolute inset-x-0 top-0 flex-row items-center justify-between p-4" style={{ paddingTop: insets.top + 16 }}>
            <Pressable onPress={() => router.back()} className="size-9 rounded-full bg-white/90 items-center justify-center">
              <ChevronLeft size={20} color="#09090b" />
            </Pressable>
            <Pressable onPress={toggleFavorite} className="size-9 rounded-full bg-white/90 items-center justify-center">
              <Heart size={20} color={product.is_favorite ? "#f43f5e" : "#71717b"} fill={product.is_favorite ? "#f43f5e" : "none"} />
            </Pressable>
          </View>
        </View>

        <View className="flex-col gap-5 p-5">
          <View className="flex-col gap-2">
            <View className="flex-row flex-wrap items-center gap-2">
              {category ? (
                <View className={cn("rounded-full px-2.5 py-0.5", category.color)}>
                  <Text className="text-[11px] font-semibold">{category.label}</Text>
                </View>
              ) : null}
              {product.negotiable ? <Badge variant="muted">Prix négociable</Badge> : null}
              {product.stock > 0 ? (
                <Badge variant="outline">{formatNumber(product.stock)} en stock</Badge>
              ) : (
                <Badge className="bg-rose-100 dark:bg-rose-500/15" textClassName="text-rose-700 dark:text-rose-300">
                  Rupture
                </Badge>
              )}
            </View>
            <Text className="font-bold text-xl leading-7 text-fg dark:text-fg-dark">{product.title}</Text>
            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
              {product.region ? (
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color="#71717b" />
                  <Text className="text-xs text-muted dark:text-muted-dark">
                    {product.prefecture ? `${product.prefecture}, ` : ""}
                    {product.region}
                  </Text>
                </View>
              ) : null}
              <View className="flex-row items-center gap-1">
                <Eye size={14} color="#71717b" />
                <Text className="text-xs text-muted dark:text-muted-dark">{formatNumber(product.views)} vues</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Package size={14} color="#71717b" />
                <Text className="text-xs text-muted dark:text-muted-dark">
                  commande minimum {product.min_order} {product.unit}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-end gap-2">
            <Text className="font-extrabold text-brand text-2xl leading-8">{formatGNF(price)}</Text>
            <Text className="pb-1 text-sm text-muted dark:text-muted-dark">/ {product.unit}</Text>
            {price < product.price ? (
              <Text className="pb-1 text-sm text-faint dark:text-faint-dark line-through">{formatGNF(product.price)}</Text>
            ) : null}
          </View>

          {product.tiers?.length ? (
            <View className="rounded-2xl border border-line dark:border-line-dark overflow-hidden">
              <View className="bg-subtle-soft dark:bg-subtle-soft-dark px-4 py-2.5">
                <Text className="text-xs font-semibold text-muted dark:text-muted-dark">Prix dégressifs par quantité</Text>
              </View>
              {product.tiers.map((t, i) => (
                <View
                  key={t.min_qty}
                  className={cn(
                    "flex-row items-center justify-between px-4 py-2.5",
                    i > 0 && "border-t border-line-soft dark:border-line-soft-dark",
                    quantity >= t.min_qty && price === t.price && "bg-brand/5",
                  )}
                >
                  <Text className="text-sm text-muted dark:text-muted-dark">
                    À partir de {t.min_qty} {product.unit}
                  </Text>
                  <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{formatGNF(t.price)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View className="flex-row items-center justify-between rounded-2xl border border-line dark:border-line-dark p-3.5">
            <View>
              <Text className="font-semibold text-sm text-fg dark:text-fg-dark">Quantité</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">
                Total : <Text className="font-semibold text-fg-soft dark:text-fg-soft-dark">{formatGNF(total)}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setQuantity((q) => Math.max(product.min_order, q - 1))}
                disabled={quantity <= product.min_order}
                className="size-9 rounded-lg border border-line dark:border-line-dark items-center justify-center disabled:opacity-40"
              >
                <Minus size={16} color="#09090b" />
              </Pressable>
              <TextInput
                value={String(quantity)}
                onChangeText={(v) => setQuantity(Math.max(product.min_order, Number(v) || product.min_order))}
                keyboardType="numeric"
                className="w-14 text-center font-semibold text-sm text-fg dark:text-fg-dark"
              />
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                className="size-9 rounded-lg border border-line dark:border-line-dark items-center justify-center"
              >
                <Plus size={16} color="#09090b" />
              </Pressable>
            </View>
          </View>

          {product.description ? (
            <View className="flex-col gap-2">
              <Text className="font-semibold text-base text-fg dark:text-fg-dark">Description</Text>
              <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">{product.description}</Text>
            </View>
          ) : null}

          {product.delivery ? (
            <View className="flex-row items-start gap-3 rounded-2xl bg-subtle-soft dark:bg-subtle-soft-dark p-4">
              <Truck size={20} color="#00c950" />
              <View className="flex-1">
                <Text className="font-semibold text-sm text-fg dark:text-fg-dark">Livraison</Text>
                <Text className="text-xs leading-snug text-muted dark:text-muted-dark">{product.delivery}</Text>
              </View>
            </View>
          ) : null}

          <Pressable
            onPress={() => router.push(`/seller/${product.seller_id}`)}
            className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-4"
          >
            <Avatar name={product.seller_company || product.seller_name} src={product.seller_avatar} size={48} verified={product.seller_verified} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text numberOfLines={1} className="font-semibold text-sm text-fg dark:text-fg-dark">
                  {product.seller_company || product.seller_name}
                </Text>
                {product.seller_verified ? <BadgeCheck size={16} color="#00c950" /> : null}
              </View>
              <Text className="text-xs text-muted dark:text-muted-dark capitalize">
                {product.seller_role} · {product.seller_region}
              </Text>
              {product.seller_rating ? (
                <View className="mt-0.5 flex-row items-center gap-1">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-xs text-amber-600">{product.seller_rating.toFixed(1)}</Text>
                </View>
              ) : null}
            </View>
            <Text className="text-xs font-medium text-brand">Voir la boutique</Text>
          </Pressable>

          <View className="flex-row items-start gap-3 rounded-2xl bg-brand/5 border border-brand/20 p-4">
            <ShieldCheck size={20} color="#00c950" />
            <Text className="flex-1 text-xs leading-snug text-muted dark:text-muted-dark">
              Paiement protégé : les fonds ne sont versés au vendeur qu'une fois la livraison confirmée.
            </Text>
          </View>

          {similar.length ? (
            <View className="flex-col gap-3">
              <Text className="font-semibold text-base text-fg dark:text-fg-dark">Produits similaires</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pb-2">
                {similar.map((p) => (
                  <View key={p.id} className="w-40 shrink-0">
                    <ProductCard product={p} />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-line dark:border-line-dark overflow-hidden">
        <BlurView
          intensity={80}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="p-4" style={{ paddingBottom: insets.bottom + 16 }}>
          {isOwner ? (
            <Button className="w-full" size="lg" onPress={() => router.push("/seller/listings")}>
              Gérer mon annonce
            </Button>
          ) : (
            <View className="flex-row items-center gap-3">
              <Button variant="outline" size="lg" className="flex-1" loading={contacting} onPress={contactSeller}>
                <MessageCircle size={20} color="#00c950" />
                <Text className="font-semibold text-brand text-base ml-2">Contacter</Text>
              </Button>
              <Button size="lg" className="flex-1" onPress={addToCart} disabled={product.stock === 0}>
                <ShoppingCart size={20} color="#ffffff" />
                <Text className="font-semibold text-white text-base ml-2">Commander</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
