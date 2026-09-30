import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ban, Package, Send } from "lucide-react-native";
import { api } from "@/lib/api";
import type { Conversation, Message } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/feedback";
import { ModerationMenu, ReportSheet } from "@/components/ModerationSheet";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { imageUrl } from "@/lib/image";
import { ROLE_MAP } from "@/lib/constants";
import { cn, formatGNF, formatTime, unitLabel } from "@/lib/utils";

const QUICK_REPLIES = [
  "Bonjour, ce produit est-il disponible ?",
  "Quel est votre meilleur prix pour une grosse quantité ?",
  "Livrez-vous à Conakry ?",
  "Quel est le délai de livraison ?",
];

export default function ChatScreen() {
  return (
    <RequireAuth>
      <Chat />
    </RequireAuth>
  );
}

function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const toast = useToast();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [canReply, setCanReply] = useState(true);
  const [reportedMessage, setReportedMessage] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .messages(id)
        .then(({ conversation, messages, blocked, can_reply }) => {
          if (!alive) return;
          setConversation(conversation);
          setMessages(messages);
          setBlocked(blocked);
          setCanReply(can_reply);
        })
        .catch(() => toast("Conversation introuvable", "error"))
        .finally(() => alive && setLoading(false));
    load();
    const timer = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  async function send(preset?: string) {
    const text = (preset ?? body).trim();
    if (!text) return;
    setSending(true);
    setBody("");
    try {
      const { message } = await api.sendMessage(Number(id), text);
      setMessages((m) => [...m, message]);
    } catch {
      toast("Message non envoyé", "error");
      setBody(text);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Spinner className="flex-1 bg-canvas dark:bg-canvas-dark" />;

  const partner = conversation?.partner;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas dark:bg-canvas-dark"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <TopBar
        title={partner?.company || partner?.name}
        subtitle={[partner?.role ? ROLE_MAP[partner.role]?.label : null, partner?.region].filter(Boolean).join(" · ")}
        right={
          partner ? (
            <View className="flex-row items-center gap-1">
              <ModerationMenu
                target={{ type: "user", id: partner.id }}
                person={{ id: partner.id, name: partner.company || partner.name }}
                blocked={blocked}
                onBlockedChange={(b) => {
                  setBlocked(b);
                  setCanReply(!b);
                }}
              />
              <Pressable onPress={() => router.push(`/seller/${partner.id}`)}>
                <Avatar name={partner.company || partner.name} src={partner.avatar_url} size={36} verified={partner.verified} />
              </Pressable>
            </View>
          ) : null
        }
      />

      {conversation?.product ? (
        <Pressable
          onPress={() => router.push(`/product/${conversation.product!.id}`)}
          className="flex-row items-center gap-3 border-b border-line-soft dark:border-line-soft-dark bg-subtle-soft dark:bg-subtle-soft-dark px-4 py-2.5"
        >
          {conversation.product.image_url ? (
            <Image source={{ uri: imageUrl(conversation.product.image_url, 44) }} style={{ width: 44, height: 44, borderRadius: 8 }} contentFit="cover" />
          ) : (
            <View className="size-11 rounded-lg bg-subtle-strong dark:bg-subtle-strong-dark items-center justify-center">
              <Package size={20} color="#8e8e98" />
            </View>
          )}
          <View className="flex-1">
            <Text numberOfLines={1} className="text-xs font-semibold text-fg dark:text-fg-dark">
              {conversation.product.title}
            </Text>
            <Text className="text-xs text-brand font-semibold">
              {formatGNF(conversation.product.price)}
              <Text className="font-normal text-muted dark:text-muted-dark"> / {unitLabel(conversation.product.unit)}</Text>
            </Text>
          </View>
        </Pressable>
      ) : null}

      <ScrollView ref={scrollRef} contentContainerClassName="flex-col gap-2 px-4 py-4">
        {messages.map((m, i) => {
          const mine = m.sender_id === user?.id;
          const showTime = i === messages.length - 1 || messages[i + 1]?.sender_id !== m.sender_id;
          return (
            <View key={m.id} className={cn("flex-col", mine ? "items-end" : "items-start")}>
              <Pressable
                disabled={mine}
                onLongPress={() => setReportedMessage(m.id)}
                delayLongPress={400}
                accessibilityHint={mine ? undefined : "Appui long pour signaler ce message"}
                className="max-w-[80%]"
              >
                <View
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5",
                    mine ? "bg-brand rounded-br-md" : "bg-subtle dark:bg-subtle-dark rounded-bl-md",
                  )}
                >
                  <Text className={cn("text-sm leading-snug", mine ? "text-white" : "text-fg-soft dark:text-fg-soft-dark")}>{m.body}</Text>
                </View>
              </Pressable>
              {showTime ? <Text className="mt-0.5 px-1 text-[10px] text-faint dark:text-faint-dark">{formatTime(m.created_at)}</Text> : null}
            </View>
          );
        })}
        {messages.length === 0 ? (
          <View className="flex-col gap-2 py-6">
            <Text className="text-center text-xs text-faint dark:text-faint-dark">Démarrez la conversation</Text>
            {QUICK_REPLIES.map((q) => (
              <Pressable key={q} onPress={() => send(q)} className="rounded-xl border border-line dark:border-line-dark px-3.5 py-2.5">
                <Text className="text-sm text-muted dark:text-muted-dark">{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {!canReply ? (
        <View
          className="flex-row items-center justify-center gap-2 border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Ban size={16} color="#8e8e98" />
          <Text className="text-sm text-muted dark:text-muted-dark">
            {blocked ? "Vous avez bloqué ce contact" : "Vous ne pouvez plus répondre à cette conversation"}
          </Text>
        </View>
      ) : (
        <View
          className="flex-row items-center gap-2 border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Écrire un message…"
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={() => send()}
            placeholderTextColor="#8e8e98"
            className="h-11 flex-1 rounded-full border border-line dark:border-line-dark bg-subtle-soft dark:bg-subtle-soft-dark px-4 text-sm text-fg dark:text-fg-dark"
          />
          <Pressable
            onPress={() => send()}
            disabled={!body.trim() || sending}
            className="size-11 shrink-0 rounded-full bg-brand items-center justify-center disabled:opacity-40"
          >
            <Send size={20} color="#ffffff" />
          </Pressable>
        </View>
      )}

      <ReportSheet
        target={reportedMessage ? { type: "message", id: reportedMessage } : null}
        onClose={() => setReportedMessage(null)}
      />
    </KeyboardAvoidingView>
  );
}
