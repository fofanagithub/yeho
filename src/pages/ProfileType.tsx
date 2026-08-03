import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Store, UserRoundCheck } from "lucide-react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export default function ProfileType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <PhoneShell padBottom={false}>
      <TopBar
        back
        onBack={() => navigate("/")}
        right={
          <Badge variant="outline">
            <Store className="size-3 text-brand" />
            SooniGN
          </Badge>
        }
      />

      <div className="flex min-h-[calc(100vh-57px)] flex-col p-7">
        <div className="mb-7 flex flex-col gap-2">
          <div className="mb-1 size-12 rounded-2xl bg-brand/10 flex items-center justify-center">
            <UserRoundCheck className="size-6 text-brand" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight">Quel est votre profil ?</h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            Choisissez le statut qui vous correspond pour créer un compte adapté à votre activité.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {ROLES.map((role) => {
            const active = selected === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelected(role.value)}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                  active
                    ? "border-brand bg-brand/5 ring-2 ring-brand/15"
                    : "border-zinc-200 bg-white hover:border-brand/40",
                )}
              >
                <span className="size-11 shrink-0 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <role.icon className="size-6" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-semibold text-sm">{role.label}</span>
                  <span className="text-xs text-zinc-500">{role.tagline}</span>
                </span>
                <span
                  className={cn(
                    "size-5 shrink-0 rounded-full flex items-center justify-center",
                    active ? "bg-brand" : "border-2 border-zinc-200",
                  )}
                >
                  {active ? <Check className="size-3 text-white" /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={!selected}
            onClick={() => selected && navigate(`/inscription/${selected}`)}
          >
            Continuer
            <ArrowRight className="size-5" />
          </Button>
          <p className="text-center text-sm text-zinc-500">
            Déjà inscrit ?{" "}
            <Link to="/connexion" className="font-semibold text-brand">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}
