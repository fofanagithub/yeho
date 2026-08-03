import type { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PhoneShell } from "./PhoneShell";
import { TopBar } from "./TopBar";
import { EmptyState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";

export function RequireAuth({ children, seller = false }: { children: ReactNode; seller?: boolean }) {
  const { user, isSeller } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;

  if (seller && !isSeller) {
    return (
      <PhoneShell>
        <TopBar title="Espace vendeur" />
        <EmptyState
          icon={<Lock className="size-6" />}
          title="Réservé aux comptes vendeurs"
          description="Votre compte particulier ne permet pas de publier d'annonces. Passez en compte importateur, agriculteur, industriel ou détaillant."
          action={
            <Button onClick={() => navigate("/profil")} className="mt-2">
              Voir mon profil
            </Button>
          }
        />
      </PhoneShell>
    );
  }

  return <>{children}</>;
}
