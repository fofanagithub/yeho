import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Sprout } from "lucide-react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Field, Input, PhoneInput } from "@/components/ui/form";
import { ErrorNote } from "@/components/ui/feedback";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  // Numero pre-rempli quand on arrive depuis l'inscription (numero deja pris).
  const [phone, setPhone] = useState((location.state as { phone?: string } | null)?.phone || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/accueil";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(phone, password);
      toast(`Bienvenue ${user.name.split(" ")[0]} !`);
      navigate(from, { replace: true });
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
    <PhoneShell padBottom={false}>
      <TopBar back onBack={() => navigate("/")} />
      <form onSubmit={submit} className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-2">
          <div className="size-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
            <Sprout className="size-6" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight">Bon retour</h1>
          <p className="text-sm leading-relaxed text-muted">
            Connectez-vous avec le numéro utilisé lors de votre inscription.
          </p>
        </div>

        <ErrorNote>{error}</ErrorNote>

        <Field label="Numéro de téléphone" required>
          <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </Field>

        <Field label="Mot de passe" required>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-faint"
              aria-label={show ? "Masquer" : "Afficher"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          <LogIn className="size-5" />
          Se connecter
        </Button>

        <button
          type="button"
          onClick={fillDemo}
          className="rounded-xl border border-dashed border-line px-4 py-3 text-xs text-muted hover:border-brand hover:text-brand transition"
        >
          Utiliser le compte de démonstration (620 00 00 07 / motdepasse)
        </button>

        <p className="text-center text-sm text-muted">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-semibold text-brand">
            Créer un compte
          </Link>
        </p>
      </form>
    </PhoneShell>
  );
}
