import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Minus, Plus, ShoppingCart, Store, Trash2, Truck } from "lucide-react-native";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { imageUrl } from "@/lib/image";
import { formatGNF, unitLabel } from "@/lib/utils";

const DELIVERY_FEE = 150000;

export default function Cart() {
  const insets = useSafeAreaInsets();
  const { lines, bySeller, subtotal, setQuantity, remove, clear, unitPrice } = useCart();
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e7" : "#09090b";

  if (!lines.length) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <TopBar title="Mon panier" />
        <EmptyState
          icon={<ShoppingCart size={24} color="#8e8e98" />}
          title="Votre panier est vide"
          description="Parcourez les annonces et ajoutez les produits que vous souhaitez commander en gros."
          action={
            <Button size="sm" onPress={() => router.push("/(tabs)/search")}>
              Découvrir les produits
            </Button>
          }
        />
      </View>
    );
  }

  const fees = bySeller.length * DELIVERY_FEE;

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        title="Mon panier"
        subtitle={`${lines.length} produit${lines.length > 1 ? "s" : ""} · ${bySeller.length} vendeur${bySeller.length > 1 ? "s" : ""}`}
        right={
          <Pressable onPress={clear}>
            <Text className="text-xs font-medium text-rose-600">Vider</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }} contentContainerClassName="gap-4 p-5">
        {bySeller.map((group) => (
          <View key={group.seller_id} className="rounded-2xl border border-line dark:border-line-dark overflow-hidden">
            <View className="flex-row items-center gap-2 border-b border-line-soft dark:border-line-soft-dark bg-subtle-soft dark:bg-subtle-soft-dark px-4 py-2.5">
              <Store size={16} color="#00c950" />
              <Pressable onPress={() => router.push(`/seller/${group.seller_id}`)} className="flex-1">
                <Text numberOfLines={1} className="text-sm font-semibold text-fg dark:text-fg-dark">
                  {group.seller_name}
                </Text>
              </Pressable>
              <Text className="text-xs text-muted dark:text-muted-dark">{formatGNF(group.subtotal, { short: true })}</Text>
            </View>

            <View>
              {group.lines.map((line, i) => {
                const price = unitPrice(line);
                return (
                  <View
                    key={line.product_id}
                    className={i > 0 ? "flex-row gap-3 p-3.5 border-t border-line-soft dark:border-line-soft-dark" : "flex-row gap-3 p-3.5"}
                  >
                    {line.image_url ? (
                      <Image source={{ uri: imageUrl(line.image_url, 80) }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                    ) : (
                      <View className="size-20 shrink-0 rounded-xl bg-subtle dark:bg-subtle-dark" />
                    )}
                    <View className="flex-1 flex-col gap-1.5">
                      <View className="flex-row items-start gap-2">
                        <Pressable onPress={() => router.push(`/product/${line.product_id}`)} className="flex-1">
                          <Text numberOfLines={2} className="text-sm font-semibold leading-5 text-fg dark:text-fg-dark">
                            {line.title}
                          </Text>
                        </Pressable>
                        <Pressable onPress={() => remove(line.product_id)} hitSlop={8}>
                          <Trash2 size={16} color="#8e8e98" />
                        </Pressable>
                      </View>
                      <Text className="text-sm font-bold text-brand">
                        {formatGNF(price)}
                        <Text className="text-xs font-normal text-muted dark:text-muted-dark"> / {unitLabel(line.unit)}</Text>
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Pressable
                            onPress={() => setQuantity(line.product_id, line.quantity - 1)}
                            disabled={line.quantity <= line.min_order}
                            className="size-7 rounded-lg border border-line dark:border-line-dark items-center justify-center disabled:opacity-40"
                          >
                            <Minus size={14} color={iconColor} />
                          </Pressable>
                          <Text className="w-10 text-center text-sm font-semibold text-fg dark:text-fg-dark">{line.quantity}</Text>
                          <Pressable
                            onPress={() => setQuantity(line.product_id, line.quantity + 1)}
                            disabled={!!line.stock && line.quantity >= line.stock}
                            className="size-7 rounded-lg border border-line dark:border-line-dark items-center justify-center disabled:opacity-40"
                          >
                            <Plus size={14} color={iconColor} />
                          </Pressable>
                        </View>
                        <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{formatGNF(price * line.quantity)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {bySeller.length > 1 ? (
          <View className="flex-row items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4">
            <Truck size={20} color="#d97706" />
            <Text className="flex-1 text-xs leading-snug text-amber-800 dark:text-amber-200">
              Votre panier contient des produits de {bySeller.length} vendeurs différents : une commande distincte sera créée pour
              chacun, avec ses propres frais de livraison.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-5"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-sm text-muted dark:text-muted-dark">Sous-total</Text>
          <Text className="text-sm text-muted dark:text-muted-dark">{formatGNF(subtotal)}</Text>
        </View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm text-muted dark:text-muted-dark">Livraison estimée</Text>
          <Text className="text-sm text-muted dark:text-muted-dark">{formatGNF(fees)}</Text>
        </View>
        <View className="mb-4 flex-row items-center justify-between border-t border-line-soft dark:border-line-soft-dark pt-2">
          <Text className="font-semibold text-fg dark:text-fg-dark">Total</Text>
          <Text className="font-extrabold text-brand text-lg">{formatGNF(subtotal + fees)}</Text>
        </View>
        <Button size="lg" className="w-full" onPress={() => router.push(user ? "/checkout" : "/login")}>
          Passer la commande
        </Button>
      </View>
    </View>
  );
}
