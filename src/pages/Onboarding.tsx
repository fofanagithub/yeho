import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn, MapPin, ShieldCheck, Sprout, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { Card, CardContent } from "@/components/ui/card";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1687422809617-a7d97879b3b0?auto=format&fit=crop&w=800&q=70",
    alt: "Agriculture et produits frais",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=70",
    alt: "Boutiques et détaillants",
  },
  {
    src: "https://images.unsplash.com/photo-1549964336-67d7d7d74ac2?auto=format&fit=crop&w=800&q=70",
    alt: "Pharmacie et santé",
  },
  {
    src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=70",
    alt: "Ciment et matériaux de construction",
  },
  {
    src: "https://images.unsplash.com/photo-1605732562742-3023a888e56e?auto=format&fit=crop&w=800&q=70",
    alt: "Importateurs et conteneurs",
  },
  {
    src: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=70",
    alt: "Jus et boissons",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Carrousel automatique, synchronisé avec le scroll manuel.
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % SLIDES.length;
        const track = trackRef.current;
        if (track) track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-zinc-100 flex justify-center">
      <div className="relative w-full max-w-md bg-white min-h-screen shadow-xl shadow-zinc-300/40">
        <div className="relative w-full h-80 overflow-hidden">
          <div
            ref={trackRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              setIndex(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto"
          >
            {SLIDES.map((s) => (
              <div key={s.src} className="relative h-full w-full shrink-0 snap-center">
                <img src={s.src} alt={s.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-emerald-950/55 to-emerald-950/85" />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-7">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-2xl bg-brand text-white shadow-lg flex items-center justify-center">
                <Sprout className="size-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">SooniGN</span>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className="w-fit bg-white/20 text-white backdrop-blur-sm">
                <MapPin className="size-3" />
                Guinée
              </Badge>
              <h1 className="font-extrabold text-white text-2xl leading-8">
                Connectez vendeurs et acheteurs en Guinée
              </h1>
              <div className="mt-2 flex items-center gap-2">
                {SLIDES.map((s, i) => (
                  <span
                    key={s.src}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-6 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-7 p-7">
          <p className="text-sm leading-relaxed text-zinc-500">
            Importateurs, agriculteurs et industriels vendent en gros. Détaillants et particuliers
            s'approvisionnent au meilleur prix, partout dans le pays.
          </p>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={() => navigate("/inscription")}>
              <UserPlus className="size-5" />
              Créer un compte
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/connexion")}>
              <LogIn className="size-5" />
              Se connecter
            </Button>
            <button
              type="button"
              onClick={() => navigate("/accueil")}
              className="text-sm font-medium text-zinc-500 hover:text-brand py-1"
            >
              Explorer sans compte
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Qui êtes-vous ?</h2>
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                Faites glisser
                <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="-mx-7 flex gap-3 overflow-x-auto px-7 pb-2">
              {ROLES.map((role) => (
                <Link
                  key={role.value}
                  to={`/inscription/${role.value}`}
                  className="w-40 shrink-0 rounded-2xl border border-zinc-200 p-4 hover:border-brand/40 transition"
                >
                  <div className="mb-2 size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <role.icon className="size-5" />
                  </div>
                  <p className="font-semibold text-sm">{role.label}</p>
                  <p className="mt-1 text-xs leading-snug text-zinc-500">{role.hint}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat value="2 500+" label="Vendeurs" />
            <Stat value="33" label="Préfectures" className="border-x border-zinc-200" />
            <Stat value="18k+" label="Acheteurs" />
          </div>

          <Card className="rounded-2xl border-brand/20 bg-brand/5">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="size-10 shrink-0 rounded-full bg-brand text-white flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Transactions sécurisées</span>
                <p className="text-xs leading-snug text-zinc-500">
                  Paiements protégés, vendeurs vérifiés et livraisons suivies partout en Guinée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1 text-center", className)}>
      <span className="font-extrabold text-brand text-xl">{value}</span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}
