import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthValue {
  user: User | null;
  loading: boolean;
  isSeller: boolean;
  login: (phone: string, password: string) => Promise<User>;
  register: (payload: Record<string, unknown>) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateProfile: (payload: Record<string, unknown>) => Promise<User>;
}

const AuthContext = createContext<AuthValue | null>(null);

const SELLER_ROLES = ["importateur", "agriculteur", "industriel", "detaillant"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const { token, user } = await api.login(phone, password);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const { token, user } = await api.register(payload);
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    const { user } = await api.me();
    setUser(user);
  }, []);

  const updateProfile = useCallback(async (payload: Record<string, unknown>) => {
    const { user } = await api.updateMe(payload);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isSeller: !!user && SELLER_ROLES.includes(user.role),
      login,
      register,
      logout,
      refresh,
      updateProfile,
    }),
    [user, loading, login, register, logout, refresh, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
