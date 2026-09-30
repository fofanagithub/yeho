import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ban, BadgeCheck, Flag, MapPin, MessageCircle, Package, Phone, Star } from "lucide-react-native";
import { api } from "@/lib/api";
import { useIconColor } from "@/lib/useIconColor";
import type { Product, User } from "@/lib/types";
import { ROLE_MAP } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Spinner } from "@/components/ui/feedback";
import { ProductCard } from "@/components/ProductCard";
import { ModerationMenu, ReportSheet } from "@/components/ModerationSheet";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, timeAgo } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  author_name: string;
  created_at: string;
}

export default function SellerPublic() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const iconColor = useIconColor();

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sales, setSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [reportedReview, setReportedReview] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .seller(id)
      .then(({ seller, products, reviews, sales, blocked }) => {
        if (!alive) return;
        setSeller(seller);
        setBlocked(blocked);
        setProducts(products);
        setReviews(reviews);
        setSales(sales);
      })
      .catch(() => toast("Vendeur introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  async function contact() {
    if (!seller) return;
    if (!user) return router.push("/login");
    if (user.id === seller.id) return router.push("/(tabs)/profile");
    try {
      const { conversation } = await api.startConversation({ seller_id: seller.id });
      router.push(`/chat/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    }
  }

  if (loading) return <Spinner className="flex-1 bg-canvas dark:bg-canvas-dark" />;

  if (!seller) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <TopBar title="Vendeur" />
        <Text className="p-8 text-center text-sm text-muted dark:text-muted-dark">Ce vendeur n'existe pas.</Text>
      </View>
    );
  }

  const role = ROLE_MAP[seller.role];

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar
        title={seller.company || seller.name}
        subtitle={role?.label}
        right={
          <ModerationMenu
            target={{ type: "user", id: seller.id }}
            person={{ id: seller.id, name: seller.company || seller.name }}
            blocked={blocked}
            onBlockedChange={setBlocked}
          />
        }
      />
      <ScrollView contentContainerClassName="flex-col gap-5 p-5">
        {blocked ? (
          <View className="flex-row items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3">
            <Ban size={16} color="#e11d48" />
            <Text className="flex-1 text-xs text-rose-700 dark:text-rose-300">
              Vous avez bloqué ce compte : ses annonces et messages ne vous sont plus montrés.
            </Text>
          </View>
        ) : null}
        <View className="flex-row items-start gap-4">
          <Avatar name={seller.company || seller.name} src={seller.avatar_url} size={64} verified={seller.verified} />
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="font-bold text-lg leading-6 text-fg dark:text-fg-dark">{seller.company || seller.name}</Text>
              {seller.verified ? <BadgeCheck size={16} color="#00c950" /> : null}
            </View>
            <Text className="text-sm text-muted dark:text-muted-dark">{seller.name}</Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {role ? (
                <Badge variant="muted">
                  <View className="flex-row items-center gap-1">
                    <role.icon size={12} color="#00c950" />
                    <Text className="text-xs text-brand">{role.label}</Text>
                  </View>
                </Badge>
              ) : null}
              {seller.region ? (
                <Badge variant="outline">
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="#71717b" />
                    <Text className="text-xs text-fg-soft dark:text-fg-soft-dark">{seller.region}</Text>
                  </View>
                </Badge>
              ) : null}
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Stat value={String(products.length)} label="Annonces" />
          <Stat value={String(sales)} label="Ventes" />
          <Stat value={seller.rating_count ? seller.rating.toFixed(1) : "—"} label={`Note (${seller.rating_count})`} />
        </View>

        {seller.description ? <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">{seller.description}</Text> : null}

        <View className="rounded-2xl bg-subtle-soft dark:bg-subtle-soft-dark p-4 gap-1">
          {seller.address ? <Text className="text-xs text-muted dark:text-muted-dark">📍 {seller.address}</Text> : null}
          <Text className="text-xs text-muted dark:text-muted-dark">Membre depuis {formatDate(seller.created_at)}</Text>
        </View>

        <View className="flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={contact}>
            <MessageCircle size={16} color="#00c950" />
            <Text className="font-semibold text-brand text-sm ml-2">Message</Text>
          </Button>
          {/* L'API ne publie pas le numero des vendeurs : pas de bouton qui composerait « tel:undefined ». */}
          {seller.phone ? (
            <Button variant="secondary" className="flex-1" onPress={() => Linking.openURL(`tel:${seller.phone}`)}>
              <Phone size={16} color={iconColor} />
              <Text className="font-semibold text-fg dark:text-fg-dark text-sm ml-2">Appeler</Text>
            </Button>
          ) : null}
        </View>

        <View className="flex-col gap-3">
          <Text className="font-bold text-base text-fg dark:text-fg-dark">Produits ({products.length})</Text>
          {products.length === 0 ? (
            <EmptyState icon={<Package size={24} color="#8e8e98" />} title="Aucune annonce active" />
          ) : (
            <View className="flex-row flex-wrap gap-y-3 justify-between">
              {products.map((p) => (
                <View key={p.id} style={{ width: "48%" }}>
                  <ProductCard product={p} />
                </View>
              ))}
            </View>
          )}
        </View>

        {reviews.length ? (
          <View className="flex-col gap-3">
            <Text className="font-bold text-base text-fg dark:text-fg-dark">Avis des acheteurs</Text>
            {reviews.map((r) => (
              <View key={r.id} className="rounded-2xl border border-line dark:border-line-dark p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-fg dark:text-fg-dark">{r.author_name}</Text>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-xs text-faint dark:text-faint-dark">{timeAgo(r.created_at)}</Text>
                    <Pressable
                      hitSlop={10}
                      accessibilityLabel="Signaler cet avis"
                      onPress={() => (user ? setReportedReview(r.id) : router.push("/login"))}
                    >
                      <Flag size={14} color="#8e8e98" />
                    </Pressable>
                  </View>
                </View>
                <View className="mt-1 flex-row gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} color={n <= r.rating ? "#f59e0b" : "#e4e4e7"} fill={n <= r.rating ? "#f59e0b" : "none"} />
                  ))}
                </View>
                {r.comment ? <Text className="mt-1.5 text-sm text-muted dark:text-muted-dark">{r.comment}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <ReportSheet
        target={reportedReview ? { type: "review", id: reportedReview } : null}
        onClose={() => setReportedReview(null)}
      />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-line dark:border-line-dark p-3 items-center">
      <Text className="font-extrabold text-brand text-lg leading-6">{value}</Text>
      <Text className="text-[11px] text-muted dark:text-muted-dark">{label}</Text>
    </View>
  );
}
