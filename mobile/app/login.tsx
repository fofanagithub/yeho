import { useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Eye, EyeOff, LogIn, Sprout } from "lucide-react-native";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Field, Input, PhoneInput } from "@/components/ui/form";
import { ErrorNote } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const { phone: prefillPhone } = useLocalSearchParams<{ phone?: string }>();

  const [phone, setPhone] = useState(prefillPhone || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const user = await login(phone, password);
      toast(`Bienvenue ${user.name.split(" ")[0]} !`);
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setPhone("620000007");
    setPassword("motdepasse");
  }

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <TopBar back onBack={() => router.replace("/")} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-col gap-6 p-7" keyboardShouldPersistTaps="handled">
          <View className="flex-col gap-2">
            <View className="size-12 rounded-2xl bg-brand/10 items-center justify-center">
              <Sprout size={24} color="#00c950" />
            </View>
            <Text className="font-bold text-2xl tracking-tight text-fg dark:text-fg-dark">Bon retour</Text>
            <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">
              Connectez-vous avec le numéro utilisé lors de votre inscription.
            </Text>
          </View>

          <ErrorNote>{error}</ErrorNote>

          <Field label="Numéro de téléphone" required>
            <PhoneInput value={phone} onChangeText={setPhone} autoComplete="tel" returnKeyType="next" />
          </Field>

          <Field label="Mot de passe" required>
            <View className="relative justify-center">
              <Input
                secureTextEntry={!show}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
                returnKeyType="go"
                onSubmitEditing={submit}
                className="pr-11"
              />
              <Pressable onPress={() => setShow((s) => !s)} className="absolute right-3" hitSlop={8}>
                {show ? <EyeOff size={16} color="#8e8e98" /> : <Eye size={16} color="#8e8e98" />}
              </Pressable>
            </View>
          </Field>

          <Button size="lg" loading={loading} className="w-full" onPress={submit}>
            <LogIn size={20} color="#ffffff" />
            <Text className="font-semibold text-white text-base ml-2">Se connecter</Text>
          </Button>

          {/* Raccourci de developpement uniquement : jamais dans l'app publiee. */}
          {__DEV__ ? (
            <Pressable
              onPress={fillDemo}
              className="rounded-xl border border-dashed border-line dark:border-line-dark px-4 py-3"
            >
              <Text className="text-xs text-muted dark:text-muted-dark text-center">
                Utiliser le compte de démonstration (620 00 00 07 / motdepasse)
              </Text>
            </Pressable>
          ) : null}

          <Text className="text-center text-sm text-muted dark:text-muted-dark">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Créer un compte
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
