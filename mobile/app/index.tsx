import { useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogIn, Sprout, UserPlus } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { imageUrl, TAILLES } from "@/lib/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const SLIDES = [
  { src: "https://images.unsplash.com/photo-1687422809617-a7d97879b3b0?auto=format&fit=crop&w=1200&q=75" },
  { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=75" },
  { src: "https://images.unsplash.com/photo-1605732562742-3023a888e56e?auto=format&fit=crop&w=1200&q=75" },
  { src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=75" },
  { src: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1200&q=75" },
];

const DUREE_SLIDE = 4500;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Onboarding() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    if (!loading && user) router.replace("/(tabs)");
  }, [loading, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pauseRef.current) return;
      const next = (index + 1) % SLIDES.length;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setIndex(next);
    }, DUREE_SLIDE);
    return () => clearInterval(timer);
  }, [index]);

  if (loading || user) return <Spinner className="flex-1 bg-zinc-950" />;

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => (pauseRef.current = true)}
        onScrollEndDrag={() => (pauseRef.current = false)}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
        className="absolute inset-0"
      >
        {SLIDES.map((s) => (
          <Image
            key={s.src}
            source={{ uri: imageUrl(s.src, TAILLES.pleinEcran) }}
            style={{ width: SCREEN_WIDTH, height: "100%" }}
            contentFit="cover"
          />
        ))}
      </ScrollView>

      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
        locations={[0, 0.45, 1]}
        pointerEvents="none"
        className="absolute inset-0"
      />

      <View
        className="absolute inset-0 flex-col justify-between px-7"
        style={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }}
      >
        <View className="flex-row items-center gap-2.5">
          <View className="size-11 rounded-2xl bg-brand items-center justify-center">
            <Sprout size={24} color="#ffffff" />
          </View>
          <Text className="font-bold text-white text-xl tracking-tight">Yehoo</Text>
        </View>

        <View className="flex-col gap-6">
          <View className="gap-2">
            <Text className="font-extrabold text-white text-3xl leading-9 tracking-tight">
              Achetez en gros, directement aux producteurs
            </Text>
            <Text className="text-sm leading-5 text-white/80">
              Importateurs, agriculteurs et industriels de Guinée réunis pour les commerçants et les particuliers.
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {SLIDES.map((s, i) => (
              <View
                key={s.src}
                className={cn("h-1.5 rounded-full", i === index ? "w-7 bg-white" : "w-1.5 bg-white/45")}
              />
            ))}
          </View>

          <View className="flex-col gap-3">
            <Button size="lg" className="w-full" onPress={() => router.push("/register")}>
              <UserPlus size={20} color="#ffffff" />
              <Text className="font-semibold text-white text-base ml-2">Créer un compte</Text>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white bg-transparent active:bg-white/10"
              onPress={() => router.push("/login")}
            >
              <LogIn size={20} color="#ffffff" />
              <Text className="font-semibold text-white text-base ml-2">Se connecter</Text>
            </Button>
            <Pressable onPress={() => router.replace("/(tabs)")} className="py-1 items-center">
              <Text className="text-sm font-medium text-white/70">Explorer sans compte</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
