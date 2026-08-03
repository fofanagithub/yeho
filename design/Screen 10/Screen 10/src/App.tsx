import { useEffect } from "react";
import {
  Factory,
  Home,
  MessageCircle,
  Plus,
  Search,
  Ship,
  Sprout,
  Store,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div>
      <div
        className="bg-white text-zinc-950 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
        style-placeholder="none"
      >
        <div className="flex flex-col flex-1">
          <div className="flex px-6 pt-12 pb-4 justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-zinc-950 text-2xl leading-8">
                Messages
              </h1>
              <p className="text-[#71717b] text-sm leading-5">
                GN Market · Grossiste
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full bg-zinc-100"
            >
              <Search className="size-5 text-zinc-950" />
            </Button>
          </div>
          <div className="overflow-x-auto flex px-6 pb-4 gap-2">
            <button className="shrink-0 font-medium rounded-full text-sm leading-5 px-4 py-2">
              Tous
            </button>
            <button className="shrink-0 font-medium rounded-full text-sm leading-5 flex px-4 py-2 items-center gap-1.5">
              Non lus
              <span className="rounded-full text-xs leading-4 px-1.5">3</span>
            </button>
            <button className="shrink-0 font-medium rounded-full text-sm leading-5 px-4 py-2">
              Négociations
            </button>
            <button className="shrink-0 font-medium rounded-full text-sm leading-5 px-4 py-2">
              Archivés
            </button>
          </div>
          <div className="bg-zinc-200 h-px" />
          <div className="overflow-y-auto flex p-4 flex-col flex-1 gap-2">
            <div className="rounded-xl bg-[#00c950]/8 border-[#00c950]/20 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1520451644838-906a72aa7c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcG9ydHJhaXQlMjBzbWlsaW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8Mnx8fDE3ODQzNzEyNjh8MA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Ibrahima Sow"
                    className="object-cover w-full h-full"
                    data-photoid="W0i1N6FdCWA"
                    data-authorname="Mika Ruusunen"
                    data-authorurl="https://unsplash.com/@mikafinland"
                    data-blurhash="LF98DATKivD%PBj@mPoLBXozWFxa"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <Ship className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-bold text-zinc-950 text-sm leading-5">
                    Ibrahima Sow
                  </span>
                  <span className="shrink-0 font-medium text-[#00c950] text-xs leading-4">
                    14:32
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Importateur
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    Bonjour, le riz parfumé 25kg est-il toujours disponible ?
                  </p>
                  <span className="shrink-0 size-5 font-bold rounded-full bg-[#00c950] text-green-50 text-[11px] flex justify-center items-center">
                    2
                  </span>
                </div>
                <div className="rounded-lg bg-white border-zinc-200 border-1 border-solid flex mt-1 p-1.5 items-center gap-2">
                  <div className="size-8 shrink-0 rounded-md overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1625827626291-6fbd47a431ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYmFnJTIwc2FjayUyMGZvb2R8ZW58MXwyfHx8MTc4NDM3MzE5Nnww&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Riz parfumé 25kg"
                      className="object-cover w-full h-full"
                      data-photoid="ocd_xKscv1I"
                      data-authorname="Wahaj Sufian"
                      data-authorurl="https://unsplash.com/@wahajsufian"
                      data-blurhash="LhKK+sD%_NV@_3aet7fPx]j[RPbI"
                    />
                  </div>
                  <span className="truncate text-[#71717b] text-[11px]">
                    Intéressé par :
                    <span className="font-medium text-zinc-950">
                      Riz parfumé 25kg
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#00c950]/8 border-[#00c950]/20 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1604247203891-ae01b7b2f1bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGhlYWRzY2FyZnxlbnwxfDJ8fHwxNzg0MzczMTk2fDA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Fatoumata Diallo"
                    className="object-cover w-full h-full"
                    data-photoid="yALyWYs0bH0"
                    data-authorname="Oluwatobi Fasipe"
                    data-authorurl="https://unsplash.com/@fasipe_tobi"
                    data-blurhash="L34xY*9F0e~W9Zxu$*NG9F%M-p9Z"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <Store className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-bold text-zinc-950 text-sm leading-5">
                    Fatoumata Diallo
                  </span>
                  <span className="shrink-0 font-medium text-[#00c950] text-xs leading-4">
                    13:05
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Détaillant
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    Pouvez-vous faire un prix pour 50 sacs ?
                  </p>
                  <span className="shrink-0 size-5 font-bold rounded-full bg-[#00c950] text-green-50 text-[11px] flex justify-center items-center">
                    1
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white border-zinc-200 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1572793792870-22f51f2f7e75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybWVyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXwyfHx8MTc4NDM3MzE5Nnww&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Mamadou Camara"
                    className="object-cover w-full h-full"
                    data-photoid="3KrI5jsz-Bc"
                    data-authorname="Erik Hathaway"
                    data-authorurl="https://unsplash.com/@erikhathaway"
                    data-blurhash="LJHA,;DiK6xDKi-TrtR,0e?bIBI;"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <Sprout className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    Mamadou Camara
                  </span>
                  <span className="shrink-0 text-[#71717b] text-xs leading-4">
                    Hier
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Agriculteur
                  </span>
                </div>
                <p className="truncate text-[#71717b] text-sm leading-5">
                  Merci, je vous confirme la commande demain.
                </p>
                <div className="rounded-lg bg-zinc-100/60 border-zinc-200 border-1 border-solid flex mt-1 p-1.5 items-center gap-2">
                  <div className="size-8 shrink-0 rounded-md overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1582655299221-2b6bff351df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZydWl0JTIwZnJlc2h8ZW58MXwyfHx8MTc4NDM3MzE5Nnww&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Mangues Kent"
                      className="object-cover w-full h-full"
                      data-photoid="BRiT_s3tN6Y"
                      data-authorname="Fedor"
                      data-authorurl="https://unsplash.com/@fmdevice"
                      data-blurhash="LOKcUuR-59WBv{n%T1bI16n$#6bI"
                    />
                  </div>
                  <span className="truncate text-[#71717b] text-[11px]">
                    Intéressé par :
                    <span className="font-medium text-zinc-950">
                      Mangues Kent 800kg
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#00c950]/8 border-[#00c950]/20 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Sékou Bah"
                    className="object-cover w-full h-full"
                    data-photoid="saE7xiecGkM"
                    data-authorname="Ferhat Deniz Fors"
                    data-authorurl="https://unsplash.com/@ferhat"
                    data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <User className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-bold text-zinc-950 text-sm leading-5">
                    Sékou Bah
                  </span>
                  <span className="shrink-0 font-medium text-[#00c950] text-xs leading-4">
                    11:48
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Particulier
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    D'accord pour 3 cartons, comment je paie ?
                  </p>
                  <span className="shrink-0 size-5 font-bold rounded-full bg-[#00c950] text-green-50 text-[11px] flex justify-center items-center">
                    4
                  </span>
                </div>
                <div className="rounded-lg bg-white border-zinc-200 border-1 border-solid flex mt-1 p-1.5 items-center gap-2">
                  <div className="size-8 shrink-0 rounded-md overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1543363364-24473603ecf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxqdWljZSUyMGJvdHRsZSUyMGJldmVyYWdlJTIwZHJpbmt8ZW58MXwyfHx8MTc4NDM3MzIxMXww&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Jus mangue 1L"
                      className="object-cover w-full h-full"
                      data-photoid="L16qQYtnfGE"
                      data-authorname="Dose Juice"
                      data-authorurl="https://unsplash.com/@dosejuice"
                      data-blurhash="LcJ%|1014;?bIU-pIVWB4:%LofD*"
                    />
                  </div>
                  <span className="truncate text-[#71717b] text-[11px]">
                    Intéressé par :
                    <span className="font-medium text-zinc-950">
                      Jus mangue 1L
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white border-zinc-200 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1678282955808-de92256dbd59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwZ2xhc3NlcyUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8Mnx8fDE3ODQzNzMyMTF8MA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Alpha Barry"
                    className="object-cover w-full h-full"
                    data-photoid="K8kDDGljn90"
                    data-authorname="Oluwatobi"
                    data-authorurl="https://unsplash.com/@oluwatobisimii"
                    data-blurhash="LTH_Y{IUtlxa4mtRWBWB%#WAr?R+"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <Factory className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    Alpha Barry
                  </span>
                  <span className="shrink-0 text-[#71717b] text-xs leading-4">
                    Lun
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Industriel
                  </span>
                </div>
                <p className="truncate text-[#71717b] text-sm leading-5">
                  Livraison prévue jeudi à Kaloum. À bientôt.
                </p>
                <div className="rounded-lg bg-zinc-100/60 border-zinc-200 border-1 border-solid flex mt-1 p-1.5 items-center gap-2">
                  <div className="size-8 shrink-0 rounded-md overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1557486093-27e8c39d11a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWclMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfDJ8fHwxNzg0MzczMTk2fDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Ciment CEM II"
                      className="object-cover w-full h-full"
                      data-photoid="pmynbAJKeoM"
                      data-authorname="kevin Baquerizo"
                      data-authorurl="https://unsplash.com/@kevinbae"
                      data-blurhash="LhE:PU8wo|ozMdtRkCs,e-t7WBof"
                    />
                  </div>
                  <span className="truncate text-[#71717b] text-[11px]">
                    Intéressé par :
                    <span className="font-medium text-zinc-950">
                      Ciment CEM II 50kg
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white border-zinc-200 border-1 border-solid flex p-3 gap-3">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1632828169028-11b148c180fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFmcmljYW4lMjB3b21hbiUyMHNtaWxpbmclMjBmYWNlfGVufDF8Mnx8fDE3ODQzNzMxOTZ8MA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Aïssata Camara"
                    className="object-cover w-full h-full"
                    data-photoid="FAE8sT9HqrI"
                    data-authorname="Ben Masora"
                    data-authorurl="https://unsplash.com/@benmasora"
                    data-blurhash="LoN1WG%K?wt7_NaxITWVtSozRPju"
                  />
                </div>
                <span className="size-5 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute -right-0.5 -bottom-0.5 justify-center items-center">
                  <Store className="size-2.5 text-green-50" />
                </span>
              </div>
              <div className="min-w-0 flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-semibold text-zinc-950 text-sm leading-5">
                    Aïssata Camara
                  </span>
                  <span className="shrink-0 text-[#71717b] text-xs leading-4">
                    Dim
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium rounded-sm bg-zinc-100 text-[#71717b] text-[10px] px-1.5 py-0.5">
                    Détaillant
                  </span>
                </div>
                <p className="truncate text-[#71717b] text-sm leading-5">
                  Parfait, je passe récupérer la marchandise.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-4 pt-2 pb-8 justify-around items-center">
          <button className="text-[#71717b] flex flex-col items-center gap-1">
            <Home className="size-5" />
            <span className="text-[10px]">Accueil</span>
          </button>
          <button className="text-[#71717b] flex flex-col items-center gap-1">
            <Search className="size-5" />
            <span className="text-[10px]">Rechercher</span>
          </button>
          <button className="flex -mt-6 flex-col items-center">
            <span className="size-14 shadow-lg shadow-primary/40 rounded-full bg-[#00c950] border-white border-4 border-solid flex justify-center items-center">
              <Plus className="size-7 text-green-50" />
            </span>
            <span className="text-[#71717b] text-[10px] mt-1">Publier</span>
          </button>
          <button className="text-[#00c950] flex flex-col items-center gap-1">
            <span className="size-9 rounded-full bg-[#00c950] flex justify-center items-center">
              <MessageCircle className="size-5 text-green-50" />
            </span>
            <span className="font-semibold text-[10px]">Messages</span>
          </button>
          <button className="text-[#71717b] flex flex-col items-center gap-1">
            <User className="size-5" />
            <span className="text-[10px]">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
