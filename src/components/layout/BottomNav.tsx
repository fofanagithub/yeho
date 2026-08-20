import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageCircle, PlusCircle, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const ITEMS = [
  { to: "/accueil", label: "Accueil", icon: Home },
  { to: "/recherche", label: "Rechercher", icon: Search },
  { to: "/publier", label: "Publier", icon: PlusCircle, highlight: true },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profil", label: "Profil", icon: User },
];

export function BottomNav({ unread = 0 }: { unread?: number }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md border-t border-line bg-surface/95 backdrop-blur safe-x">
      {/* pb : les libelles restent au-dessus de la barre d'accueil du telephone. */}
      <div className="grid grid-cols-5 pb-[var(--safe-bottom)]">
        {ITEMS.map(({ to, label, icon: Icon, highlight }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          if (highlight) {
            return (
              <NavLink key={to} to={user ? to : "/connexion"} className="flex flex-col items-center pt-1.5 pb-2">
                <span className="size-11 -mt-5 rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 flex items-center justify-center">
                  <Icon className="size-6" />
                </span>
                <span className="mt-0.5 text-[10px] text-muted">{label}</span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "relative flex flex-col items-center gap-0.5 pt-2.5 pb-2 transition-colors",
                active ? "text-brand" : "text-muted",
              )}
            >
              <Icon className={cn("size-5", active && "stroke-[2.4]")} />
              <span className={cn("text-[10px]", active && "font-semibold")}>{label}</span>
              {to === "/messages" && unread > 0 ? (
                <span className="absolute top-1.5 right-1/2 translate-x-4 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
