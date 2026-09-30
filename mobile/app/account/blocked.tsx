import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { api } from "@/lib/api";
import type { BlockedUser } from "@/lib/types";
import { ROLE_MAP } from "@/lib/constants";
import { TopBar } from "@/components/layout/TopBar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, Spinner } from "@/components/ui/feedback";
import { useToast } from "@/context/ToastContext";

export default function BlockedUsersScreen() {
  return (
    <RequireAuth>
      <BlockedUsers />
    </RequireAuth>
  );
}

function BlockedUsers() {
  const toast = useToast();
  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .blockedUsers()
      .then(({ users }) => setUsers(users))
      .catch(() => toast("Chargement impossible", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  async function unblock(u: BlockedUser) {
    try {
      await api.unblock(u.id);
      setUsers((list) => list.filter((x) => x.id !== u.id));
      toast(`${u.company || u.name} est débloqué`);
    } catch {
      toast("Action impossible", "error");
    }
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar title="Comptes bloqués" />
      {loading ? (
        <Spinner className="flex-1" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck size={24} color="#8e8e98" />}
          title="Aucun compte bloqué"
          description="Vous pouvez bloquer un utilisateur depuis son profil, une annonce ou une conversation, avec le bouton « ⋯ »."
        />
      ) : (
        <ScrollView contentContainerClassName="flex-col gap-2 p-5">
          {users.map((u) => (
            <View key={u.id} className="flex-row items-center gap-3 rounded-2xl border border-line dark:border-line-dark p-3">
              <Avatar name={u.company || u.name} src={u.avatar_url} size={40} />
              <View className="flex-1">
                <Text numberOfLines={1} className="text-sm font-semibold text-fg dark:text-fg-dark">
                  {u.company || u.name}
                </Text>
                <Text className="text-xs text-muted dark:text-muted-dark">{ROLE_MAP[u.role]?.label}</Text>
              </View>
              <Button size="sm" variant="secondary" onPress={() => unblock(u)}>
                Débloquer
              </Button>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
