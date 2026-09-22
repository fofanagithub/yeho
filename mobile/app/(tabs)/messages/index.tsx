import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageSquareDashed, Search } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Conversation } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/form";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { cn, timeAgo } from "@/lib/utils";

export default function MessagesScreen() {
  return (
    <RequireAuth>
      <Messages />
    </RequireAuth>
  );
}

function Messages() {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .conversations()
        .then(({ conversations }) => alive && setConversations(conversations))
        .finally(() => alive && setLoading(false));
    load();
    const timer = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) => (c.partner.company || c.partner.name).toLowerCase().includes(q) || c.last_message?.body.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <View style={{ paddingTop: insets.top + 20 }} className="border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark px-5 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-2xl text-fg dark:text-fg-dark">Messages</Text>
          {totalUnread > 0 ? (
            <View className="rounded-full bg-brand/10 px-2.5 py-1">
              <Text className="text-xs font-semibold text-brand">
                {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
              </Text>
            </View>
          ) : null}
        </View>
        <View className="relative mt-3 justify-center">
          <View className="absolute left-3 z-10">
            <Search size={16} color="#8e8e98" />
          </View>
          <Input value={query} onChangeText={setQuery} placeholder="Rechercher une conversation" className="pl-9" />
        </View>
      </View>

      {loading ? (
        <View className="flex-col gap-3 p-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquareDashed size={24} color="#8e8e98" />}
          title="Aucune conversation"
          description="Contactez un vendeur depuis une fiche produit pour négocier vos quantités et vos prix."
          action={
            <Button variant="soft" size="sm" onPress={() => router.push("/(tabs)/search")}>
              Parcourir les produits
            </Button>
          }
        />
      ) : (
        <ScrollView>
          {filtered.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.push(`/chat/${c.id}`)}
              className="flex-row items-center gap-3 px-5 py-3.5 border-b border-line-soft dark:border-line-soft-dark"
            >
              <Avatar name={c.partner.company || c.partner.name} src={c.partner.avatar_url} size={48} verified={c.partner.verified} />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    className={cn("flex-1 text-sm text-fg dark:text-fg-dark", c.unread ? "font-bold" : "font-semibold")}
                  >
                    {c.partner.company || c.partner.name}
                  </Text>
                  <Text className="shrink-0 text-[11px] text-faint dark:text-faint-dark">
                    {timeAgo(c.last_message?.created_at || c.created_at)}
                  </Text>
                </View>
                {c.product ? (
                  <Text numberOfLines={1} className="text-[11px] text-brand">
                    {c.product.title}
                  </Text>
                ) : null}
                <Text
                  numberOfLines={1}
                  className={cn("text-xs", c.unread ? "font-medium text-fg-soft dark:text-fg-soft-dark" : "text-muted dark:text-muted-dark")}
                >
                  {c.last_message?.body || "Nouvelle conversation"}
                </Text>
              </View>
              {c.unread > 0 ? (
                <View className="size-5 shrink-0 rounded-full bg-brand items-center justify-center">
                  <Text className="text-[10px] font-bold text-white">{c.unread > 9 ? "9+" : c.unread}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
