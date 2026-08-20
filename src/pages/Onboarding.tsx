import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Sprout, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageSrcSet, imageUrl, TAILLES } from "@/lib/image";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1687422809617-a7d97879b3b0?auto=format&fit=crop&w=1200&q=75",
    alt: "Marché de produits frais en Guinée",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=75",
    alt: "Boutique de détaillant",
  },
  {
    src: "https://images.unsplash.com/photo-1605732562742-3023a888e56e?auto=format&fit=crop&w=1200&q=75",
    alt: "Conteneurs au port de Conakry",
  },
  {
    src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=75",
    alt: "Matériaux de construction",
  },
  {
    src: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1200&q=75",
    alt: "Boissons et jus produits localement",
  },
];

const DUREE_SLIDE = 4500;

export default function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);

  // Defilement automatique, suspendu pendant que le doigt fait glisser.
  useEffect(() => {
    const timer = setInterval(() => {
      if (pauseRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const suivant = (Math.round(track.scrollLeft / track.clientWidth) + 1) % SLIDES.length;
      track.scrollTo({ left: suivant * track.clientWidth, behavior: "smooth" });
    }, DUREE_SLIDE);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-dvh w-full bg-zinc-950 flex justify-center">
      <div className="relative w-full max-w-md h-dvh overflow-hidden bg-zinc-950">
        {/* Images plein écran */}
        <div
          ref={trackRef}
          onPointerDown={() => (pauseRef.current = true)}
          onPointerUp={() => (pauseRef.current = false)}
          onPointerCancel={() => (pauseRef.current = false)}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto"
        >
          {SLIDES.map((s, i) => (
            <div key={s.src} className="h-full w-full shrink-0 snap-center">
              <img
                src={imageUrl(s.src, TAILLES.pleinEcran)}
                srcSet={imageSrcSet(s.src, TAILLES.pleinEcran)}
                sizes="100vw"
                alt={s.alt}
                // La premiere image est chargee en priorite, les suivantes a la demande.
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Voile sombre : garde le logo et les boutons lisibles sur toutes les photos */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-black/20 to-black/85" />

        {/* Contenu, cale dans les zones sures de l'ecran */}
        <div className="absolute inset-0 flex flex-col justify-between safe-x px-7 pt-[calc(2rem+var(--safe-top))] pb-[calc(2rem+var(--safe-bottom))]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="size-11 rounded-2xl bg-brand text-white shadow-lg shadow-black/20 flex items-center justify-center">
              <Sprout className="size-6" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">Yehoo</span>
          </div>

          {/* Bas d'écran : indicateurs puis actions */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              {SLIDES.map((s, i) => (
                <span
                  key={s.src}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-surface" : "w-1.5 bg-white/45",
                  )}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={() => navigate("/inscription")}>
                <UserPlus className="size-5" />
                Créer un compte
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white bg-transparent text-white hover:bg-white/10"
                onClick={() => navigate("/connexion")}
              >
                <LogIn className="size-5" />
                Se connecter
              </Button>
              <button
                type="button"
                onClick={() => navigate("/accueil")}
                className="py-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Explorer sans compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
