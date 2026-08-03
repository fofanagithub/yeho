import { useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Factory,
  Ship,
  Sprout,
  Store,
  User,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="relative min-h-[874px] flex mx-auto p-8 flex-col w-100.5">
          <div className="flex mb-8 justify-between items-center">
            <button className="font-medium text-[#71717b] text-sm leading-5 flex items-center gap-1">
              <ChevronLeft className="size-5" />
              <span>Retour</span>
            </button>
            <Badge
              variant="secondary"
              className="rounded-full text-xs leading-4 px-2 py-1"
            >
              <Store className="size-3 text-[#00c950] mr-1" />
              GN Market
            </Badge>
          </div>
          <div className="flex mb-8 flex-col gap-2">
            <div className="size-12 rounded-2xl bg-[#00c950]/10 flex mb-2 justify-center items-center">
              <UserRoundCheck className="size-6 text-[#00c950]" />
            </div>
            <h1 className="font-bold text-2xl leading-8 tracking-tight">
              Quel est votre profil ?
            </h1>
            <p className="leading-relaxed text-[#71717b] text-sm leading-5">
              Choisissez le statut qui vous correspond pour créer votre compte
              adapté
            </p>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <Card className="ring-2 ring-primary/20 rounded-2xl bg-[#00c950]/5 border-[#00c950] border-2 border-solid p-4 flex-row items-center gap-0">
              <div className="flex items-center flex-1 gap-4">
                <div className="size-11 rounded-xl bg-[#00c950]/10 flex justify-center items-center">
                  <Ship className="size-6 text-[#00c950]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-5">
                    Importateur
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Import de marchandises en gros
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full bg-[#00c950] flex justify-center items-center">
                <Check className="size-3 text-green-50" />
              </div>
            </Card>
            <Card className="rounded-2xl bg-white border-[#00c950]/30 border-1 border-solid p-4 flex-row items-center gap-0">
              <div className="flex items-center flex-1 gap-4">
                <div className="size-11 rounded-xl bg-[#00c950]/10 flex justify-center items-center">
                  <Sprout className="size-6 text-[#00c950]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-5">
                    Agriculteur
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Produits agricoles locaux
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full border-zinc-200 border-2 border-solid" />
            </Card>
            <Card className="rounded-2xl bg-white border-[#00c950]/30 border-1 border-solid p-4 flex-row items-center gap-0">
              <div className="flex items-center flex-1 gap-4">
                <div className="size-11 rounded-xl bg-[#00c950]/10 flex justify-center items-center">
                  <Factory className="size-6 text-[#00c950]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-5">
                    Industriel
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Production et transformation
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full border-zinc-200 border-2 border-solid" />
            </Card>
            <Card className="rounded-2xl bg-white border-[#00c950]/30 border-1 border-solid p-4 flex-row items-center gap-0">
              <div className="flex items-center flex-1 gap-4">
                <div className="size-11 rounded-xl bg-[#00c950]/10 flex justify-center items-center">
                  <Store className="size-6 text-[#00c950]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-5">
                    Détaillant
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Revente au détail
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full border-zinc-200 border-2 border-solid" />
            </Card>
            <Card className="rounded-2xl bg-white border-[#00c950]/30 border-1 border-solid p-4 flex-row items-center gap-0">
              <div className="flex items-center flex-1 gap-4">
                <div className="size-11 rounded-xl bg-[#00c950]/10 flex justify-center items-center">
                  <User className="size-6 text-[#00c950]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-5">
                    Particulier
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Achats personnels
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full border-zinc-200 border-2 border-solid" />
            </Card>
          </div>
          <div className="flex pt-8 flex-col gap-4">
            <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-sm leading-5 w-full h-12">
              Continuer
              <ArrowRight className="size-4 ml-1" />
            </Button>
            <p className="text-center text-[#71717b] text-xs leading-4">
              Vous pourrez modifier votre statut plus tard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
