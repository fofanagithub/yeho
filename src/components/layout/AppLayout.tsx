import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { PhoneShell } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export function AppLayout() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    let alive = true;
    const load = () =>
      api
        .conversations()
        .then(({ conversations }) => {
          if (alive) setUnread(conversations.reduce((n, c) => n + c.unread, 0));
        })
        .catch(() => undefined);
    load();
    const timer = setInterval(load, 20000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [user]);

  return (
    <PhoneShell>
      <Outlet />
      <BottomNav unread={unread} />
    </PhoneShell>
  );
}
