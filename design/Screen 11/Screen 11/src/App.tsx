import { useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Factory,
  Handshake,
  Minus,
  Package,
  Plus,
  Send,
  Sprout,
  Store,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="min-h-[874px] bg-[oklch(0.985_0.01_120)] text-zinc-950 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="bg-white border-zinc-200 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-6 pt-14 pb-4 items-center gap-4">
          <button className="size-10 rounded-full bg-zinc-100 text-zinc-900 flex justify-center items-center">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[oklch(0.35_0.09_150)] font-bold text-xl leading-7 tracking-tight">
              Mon panier
            </h1>
            <span className="text-[#71717b] text-sm leading-5">4 articles</span>
          </div>
        </div>
        <div className="overflow-y-auto flex p-6 flex-col flex-1 gap-4">
          <Card className="shadow-sm relative rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-4">
            <button className="size-8 rounded-full bg-[#e7000b]/10 text-[#e7000b] flex absolute right-3 top-3 justify-center items-center">
              <Trash2 className="size-4" />
            </button>
            <CardContent className="flex p-0 flex-row gap-4">
              <div className="size-24 shrink-0 rounded-xl bg-zinc-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1557486093-27e8c39d11a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBjb25zdHJ1Y3Rpb24lMjBiYWdzfGVufDF8Mnx8fDE3ODQzNzM5Nzd8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Ciment CEM II"
                  className="object-cover w-full h-full"
                  data-photoid="pmynbAJKeoM"
                  data-authorname="kevin Baquerizo"
                  data-authorurl="https://unsplash.com/@kevinbae"
                  data-blurhash="LhE:PU8wo|ozMdtRkCs,e-t7WBof"
                />
              </div>
              <div className="flex pr-6 flex-col flex-1 gap-2">
                <h3 className="leading-tight font-semibold text-base leading-6">
                  Ciment CEM II 50kg
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="font-medium rounded-full bg-zinc-100 text-zinc-900 text-[11px] px-2 py-0.5 gap-1">
                    <Factory className="size-3" />
                    Industriel
                  </Badge>
                  <span className="text-[#71717b] text-xs leading-4">
                    Cimenterie GN
                  </span>
                </div>
                <span className="font-bold text-[#00c950] text-lg leading-7">
                  95 000 GNF
                </span>
                <div className="flex mt-1 items-center gap-3">
                  <div className="rounded-full bg-zinc-100 flex p-1 items-center gap-3">
                    <button className="size-7 shadow-sm rounded-full bg-white text-zinc-950 flex justify-center items-center">
                      <Minus className="size-4" />
                    </button>
                    <span className="font-semibold text-center text-sm leading-5 w-5">
                      2
                    </span>
                    <button className="size-7 shadow-sm rounded-full bg-[#00c950] text-green-50 flex justify-center items-center">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm relative rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-4">
            <button className="size-8 rounded-full bg-[#e7000b]/10 text-[#e7000b] flex absolute right-3 top-3 justify-center items-center">
              <Trash2 className="size-4" />
            </button>
            <CardContent className="flex p-0 flex-row gap-4">
              <div className="size-24 shrink-0 rounded-xl bg-zinc-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582655299221-2b6bff351df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1hbmdvJTIwZnJ1aXR8ZW58MXwyfHx8MTc4NDM3Mzk3N3ww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Mangues Kent"
                  className="object-cover w-full h-full"
                  data-photoid="BRiT_s3tN6Y"
                  data-authorname="Fedor"
                  data-authorurl="https://unsplash.com/@fmdevice"
                  data-blurhash="LOKcUuR-59WBv{n%T1bI16n$#6bI"
                />
              </div>
              <div className="flex pr-6 flex-col flex-1 gap-2">
                <h3 className="leading-tight font-semibold text-base leading-6">
                  Mangues Kent 800kg
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="font-medium rounded-full bg-zinc-100 text-zinc-900 text-[11px] px-2 py-0.5 gap-1">
                    <Sprout className="size-3" />
                    Agriculteur
                  </Badge>
                  <span className="text-[#71717b] text-xs leading-4">
                    Coop. Kindia
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#00c950] text-lg leading-7">
                    15 000 GNF
                  </span>
                  <Badge className="font-medium rounded-full bg-[#00c950]/10 text-[#00c950] text-[10px] border-[#00c950]/20 border-1 border-solid px-2 py-0.5">
                    Négociable
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zinc-100 flex p-1 items-center gap-3">
                    <button className="size-7 shadow-sm rounded-full bg-white text-zinc-950 flex justify-center items-center">
                      <Minus className="size-4" />
                    </button>
                    <span className="font-semibold text-center text-sm leading-5 w-5">
                      3
                    </span>
                    <button className="size-7 shadow-sm rounded-full bg-[#00c950] text-green-50 flex justify-center items-center">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full text-[#00c950] border-[#00c950] border-0 border-solid mt-1 px-4 self-start gap-2 h-9"
                >
                  <Handshake className="size-4" />
                  Négocier le prix
                </Button>
                <div className="rounded-xl bg-zinc-100 hidden mt-1 p-3 flex-col gap-2">
                  <span className="font-medium text-[#71717b] text-xs leading-4">
                    Proposez votre prix (GNF)
                  </span>
                  <input
                    placeholder="Ex : 13 000"
                    className="outline-none rounded-lg bg-white text-sm leading-5 border-zinc-200 border-1 border-solid px-3 h-9"
                    defaultValue=""
                  />
                  <Button className="rounded-full bg-[#00c950] text-green-50 gap-2 h-9">
                    <Send className="size-4" />
                    Envoyer la proposition
                  </Button>
                </div>
                <div className="bg-[oklch(0.95_0.05_80)] rounded-full hidden mt-1 px-3 py-2 items-center gap-2">
                  <Clock className="size-4 text-[oklch(0.6_0.15_70)]" />
                  <span className="text-[oklch(0.5_0.13_70)] font-medium text-xs leading-4">
                    En attente de réponse du vendeur
                  </span>
                </div>
                <div className="rounded-full bg-[#00c950]/10 hidden mt-1 px-3 py-2 items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#00c950]" />
                  <span className="font-semibold text-[#00c950] text-xs leading-4">
                    Accepté
                  </span>
                </div>
                <div className="rounded-full bg-[#e7000b]/10 hidden mt-1 px-3 py-2 items-center gap-2">
                  <XCircle className="size-4 text-[#e7000b]" />
                  <span className="font-semibold text-[#e7000b] text-xs leading-4">
                    Refusé
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm relative rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-4">
            <button className="size-8 rounded-full bg-[#e7000b]/10 text-[#e7000b] flex absolute right-3 top-3 justify-center items-center">
              <Trash2 className="size-4" />
            </button>
            <CardContent className="flex p-0 flex-row gap-4">
              <div className="size-24 shrink-0 rounded-xl bg-zinc-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Jus mangue"
                  className="object-cover w-full h-full"
                  data-photoid="saE7xiecGkM"
                  data-authorname="Ferhat Deniz Fors"
                  data-authorurl="https://unsplash.com/@ferhat"
                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                />
              </div>
              <div className="flex pr-6 flex-col flex-1 gap-2">
                <h3 className="leading-tight font-semibold text-base leading-6">
                  Jus mangue 1L
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="font-medium rounded-full bg-zinc-100 text-zinc-900 text-[11px] px-2 py-0.5 gap-1">
                    <Package className="size-3" />
                    Industriel
                  </Badge>
                  <span className="text-[#71717b] text-xs leading-4">
                    Guinée Boissons
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#00c950] text-lg leading-7">
                    120 000 GNF
                  </span>
                  <Badge className="font-medium rounded-full bg-[#00c950]/10 text-[#00c950] text-[10px] border-[#00c950]/20 border-1 border-solid px-2 py-0.5">
                    Négociable
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zinc-100 flex p-1 items-center gap-3">
                    <button className="size-7 shadow-sm rounded-full bg-white text-zinc-950 flex justify-center items-center">
                      <Minus className="size-4" />
                    </button>
                    <span className="font-semibold text-center text-sm leading-5 w-5">
                      1
                    </span>
                    <button className="size-7 shadow-sm rounded-full bg-[#00c950] text-green-50 flex justify-center items-center">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full text-[#00c950] border-[#00c950] border-0 border-solid mt-1 px-4 self-start gap-2 h-9"
                >
                  <Handshake className="size-4" />
                  Négocier le prix
                </Button>
                <div className="rounded-xl bg-zinc-100 hidden mt-1 p-3 flex-col gap-2">
                  <span className="font-medium text-[#71717b] text-xs leading-4">
                    Proposez votre prix (GNF)
                  </span>
                  <input
                    placeholder="Ex : 100 000"
                    className="outline-none rounded-lg bg-white text-sm leading-5 border-zinc-200 border-1 border-solid px-3 h-9"
                    defaultValue=""
                  />
                  <Button className="rounded-full bg-[#00c950] text-green-50 gap-2 h-9">
                    <Send className="size-4" />
                    Envoyer la proposition
                  </Button>
                </div>
                <div className="bg-[oklch(0.95_0.05_80)] rounded-full hidden mt-1 px-3 py-2 items-center gap-2">
                  <Clock className="size-4 text-[oklch(0.6_0.15_70)]" />
                  <span className="text-[oklch(0.5_0.13_70)] font-medium text-xs leading-4">
                    En attente de réponse du vendeur
                  </span>
                </div>
                <div className="rounded-full bg-[#00c950]/10 hidden mt-1 px-3 py-2 items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#00c950]" />
                  <span className="font-semibold text-[#00c950] text-xs leading-4">
                    Accepté
                  </span>
                </div>
                <div className="rounded-full bg-[#e7000b]/10 hidden mt-1 px-3 py-2 items-center gap-2">
                  <XCircle className="size-4 text-[#e7000b]" />
                  <span className="font-semibold text-[#e7000b] text-xs leading-4">
                    Refusé
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm relative rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-4">
            <button className="size-8 rounded-full bg-[#e7000b]/10 text-[#e7000b] flex absolute right-3 top-3 justify-center items-center">
              <Trash2 className="size-4" />
            </button>
            <CardContent className="flex p-0 flex-row gap-4">
              <div className="size-24 shrink-0 rounded-xl bg-zinc-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1612800083273-24ea5c80313d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGFydGlzYW5hbCUyMHNvYXB8ZW58MXwyfHx8MTc4NDM3Mzk3OHww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Savon artisanal"
                  className="object-cover w-full h-full"
                  data-photoid="7gZW8ZX6BqY"
                  data-authorname="Sincerely Media"
                  data-authorurl="https://unsplash.com/@sincerelymedia"
                  data-blurhash="LRPi;lxt_NxvRPWEV@n#?vt6D%M{"
                />
              </div>
              <div className="flex pr-6 flex-col flex-1 gap-2">
                <h3 className="leading-tight font-semibold text-base leading-6">
                  Savon artisanal
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="font-medium rounded-full bg-zinc-100 text-zinc-900 text-[11px] px-2 py-0.5 gap-1">
                    <Store className="size-3" />
                    Détaillant
                  </Badge>
                  <span className="text-[#71717b] text-xs leading-4">
                    Boutique Camara
                  </span>
                </div>
                <span className="font-bold text-[#00c950] text-lg leading-7">
                  8 000 GNF
                </span>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zinc-100 flex p-1 items-center gap-3">
                    <button className="size-7 shadow-sm rounded-full bg-white text-zinc-950 flex justify-center items-center">
                      <Minus className="size-4" />
                    </button>
                    <span className="font-semibold text-center text-sm leading-5 w-5">
                      5
                    </span>
                    <button className="size-7 shadow-sm rounded-full bg-[#00c950] text-green-50 flex justify-center items-center">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm rounded-2xl bg-white border-zinc-200 border-0 border-solid mt-2 p-6 gap-4">
            <CardContent className="flex p-0 flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[#71717b] text-sm leading-5">
                  Sous-total
                </span>
                <span className="font-medium text-sm leading-5">
                  726 000 GNF
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#71717b] text-sm leading-5">
                  Remises (négociations)
                </span>
                <span className="font-medium text-[#00c950] text-sm leading-5 hidden">
                  - 22 000 GNF
                </span>
                <span className="font-medium text-[#71717b] text-sm leading-5">
                  0 GNF
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#71717b] text-sm leading-5">
                  Livraison
                </span>
                <span className="font-medium text-sm leading-5">
                  Calculée à l'étape suivante
                </span>
              </div>
              <div className="bg-zinc-200 my-1 h-px" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base leading-6">
                  Total général
                </span>
                <span className="font-bold text-[#00c950] text-xl leading-7">
                  726 000 GNF
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-6 pt-4 pb-8 flex-col gap-3">
          <Button className="font-semibold rounded-full bg-[#00c950] text-green-50 text-base leading-6 gap-2 w-full h-13">
            <Truck className="size-5" />
            Valider le panier
          </Button>
          <button className="underline-offset-2 underline font-medium text-[#71717b] text-sm leading-5 self-center">
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}
