import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareDashed, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Conversation } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/form";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";

export default function Messages() {
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
      (c) =>
        (c.partner.company || c.partner.name).toLowerCase().includes(q) ||
        c.last_message?.body.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-surface px-5 pb-3 pt-[calc(1.25rem+var(--safe-top))]">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">Messages</h1>
          {totalUnread > 0 ? (
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
              {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une conversation"
            className="pl-9"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col gap-3 p-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquareDashed className="size-6" />}
          title="Aucune conversation"
          description="Contactez un vendeur depuis une fiche produit pour négocier vos quantités et vos prix."
          action={
            <Link to="/recherche">
              <Button variant="soft" size="sm">
                Parcourir les produits
              </Button>
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-line-soft">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link to={`/messages/${c.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-subtle-soft">
                <Avatar
                  name={c.partner.company || c.partner.name}
                  src={c.partner.avatar_url}
                  size={48}
                  verified={c.partner.verified}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("flex-1 truncate text-sm", c.unread ? "font-bold" : "font-semibold")}>
                      {c.partner.company || c.partner.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-faint">
                      {timeAgo(c.last_message?.created_at || c.created_at)}
                    </span>
                  </div>
                  {c.product ? (
                    <p className="truncate text-[11px] text-brand">{c.product.title}</p>
                  ) : null}
                  <p
                    className={cn(
                      "truncate text-xs",
                      c.unread ? "font-medium text-fg-soft" : "text-muted",
                    )}
                  >
                    {c.last_message?.body || "Nouvelle conversation"}
                  </p>
                </div>
                {c.unread > 0 ? (
                  <span className="size-5 shrink-0 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center">
                    {c.unread > 9 ? "9+" : c.unread}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
