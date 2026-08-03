import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Package, Send } from "lucide-react";
import { api } from "@/lib/api";
import type { Conversation, Message } from "@/lib/types";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatGNF, formatTime } from "@/lib/utils";

const QUICK_REPLIES = [
  "Bonjour, ce produit est-il disponible ?",
  "Quel est votre meilleur prix pour une grosse quantité ?",
  "Livrez-vous à Conakry ?",
  "Quel est le délai de livraison ?",
];

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .messages(id!)
        .then(({ conversation, messages }) => {
          if (!alive) return;
          setConversation(conversation);
          setMessages(messages);
        })
        .catch(() => toast("Conversation introuvable", "error"))
        .finally(() => alive && setLoading(false));
    load();
    const timer = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id, toast]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: FormEvent, preset?: string) {
    e.preventDefault();
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

  if (loading) {
    return (
      <PhoneShell padBottom={false}>
        <Spinner className="min-h-screen" />
      </PhoneShell>
    );
  }

  const partner = conversation?.partner;

  return (
    <PhoneShell padBottom={false} className="flex flex-col">
      <TopBar
        title={partner?.company || partner?.name}
        subtitle={partner?.region ? `${partner.role} · ${partner.region}` : partner?.role}
        right={
          partner ? (
            <Link to={`/vendeur/${partner.id}`}>
              <Avatar name={partner.company || partner.name} src={partner.avatar_url} size={36} verified={partner.verified} />
            </Link>
          ) : null
        }
      />

      {conversation?.product ? (
        <Link
          to={`/produit/${conversation.product.id}`}
          className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5"
        >
          {conversation.product.image_url ? (
            <img src={conversation.product.image_url} alt="" className="size-11 rounded-lg object-cover" />
          ) : (
            <span className="size-11 rounded-lg bg-zinc-200 text-zinc-400 flex items-center justify-center">
              <Package className="size-5" />
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold">{conversation.product.title}</p>
            <p className="text-xs text-brand font-semibold">
              {formatGNF(conversation.product.price)}
              <span className="font-normal text-zinc-500"> / {conversation.product.unit}</span>
            </p>
          </div>
        </Link>
      ) : null}

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-4 py-4 pb-28">
        {messages.map((m, i) => {
          const mine = m.sender_id === user?.id;
          const showTime = i === messages.length - 1 || messages[i + 1]?.sender_id !== m.sender_id;
          return (
            <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug animate-slide-in",
                  mine ? "bg-brand text-white rounded-br-md" : "bg-zinc-100 text-zinc-800 rounded-bl-md",
                )}
              >
                {m.body}
              </div>
              {showTime ? (
                <span className="mt-0.5 px-1 text-[10px] text-zinc-400">{formatTime(m.created_at)}</span>
              ) : null}
            </div>
          );
        })}
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2 py-6">
            <p className="text-center text-xs text-zinc-400">Démarrez la conversation</p>
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={(e) => send(e, q)}
                className="rounded-xl border border-zinc-200 px-3.5 py-2.5 text-left text-sm text-zinc-600 hover:border-brand hover:text-brand"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={send}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 flex items-center gap-2 border-t border-zinc-200 bg-white p-3 pb-[calc(0.75rem+var(--safe-bottom))]"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Écrire un message…"
          className="h-11 flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={!body.trim() || sending}
          className="size-11 shrink-0 rounded-full bg-brand text-white flex items-center justify-center disabled:opacity-40"
          aria-label="Envoyer"
        >
          <Send className="size-5" />
        </button>
      </form>
    </PhoneShell>
  );
}
