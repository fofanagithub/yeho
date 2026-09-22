import { useEffect, useState } from "react";
import { Tabs, router } from "expo-router";
import { Pressable, View } from "react-native";
import { Home, MessageCircle, PlusCircle, Search, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function TabsLayout() {
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
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

  const activeColor = "#00c950";
  const inactiveColor = dark ? "#a1a1aa" : "#71717b";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: dark ? "#17171a" : "#ffffff",
          borderTopColor: dark ? "#2e2e34" : "#e4e4e7",
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Rechercher",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: "Publier",
          tabBarLabelStyle: { fontSize: 10, color: inactiveColor },
          tabBarIcon: () => (
            <View className="size-11 -mt-5 rounded-2xl bg-brand items-center justify-center">
              <PlusCircle size={24} color="#ffffff" />
            </View>
          ),
          tabBarButton: ({ children, style, accessibilityState }) => (
            <Pressable
              style={style}
              accessibilityState={accessibilityState}
              onPress={() => router.push(user ? "/(tabs)/publish" : "/login")}
            >
              {children}
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="messages/index"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          tabBarBadge: unread > 0 ? (unread > 9 ? "9+" : unread) : undefined,
          tabBarBadgeStyle: { backgroundColor: "#f43f5e", fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
