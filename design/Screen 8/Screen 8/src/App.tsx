import { useEffect } from "react";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  Cross as LucideCross,
  CupSoda,
  Factory,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Ship,
  ShoppingBag,
  SlidersHorizontal,
  Sprout,
  Store,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 pb-28 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <header className="sticky z-20 bg-white border-zinc-200 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex top-0 px-6 pt-6 pb-4 flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-[#00c950] flex justify-center items-center">
                <Store className="size-5 text-green-50" />
              </div>
              <span className="font-bold text-lg leading-7 tracking-tight">
                GN Market
              </span>
            </div>
            <button className="relative size-10 rounded-full bg-zinc-100 flex justify-center items-center">
              <Bell className="size-5 text-zinc-900" />
              <span className="size-2 ring-2 ring-background rounded-full bg-[#00c950] absolute right-2 top-2" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-zinc-100 flex px-4 items-center flex-1 gap-2 h-11">
              <Search className="size-4 text-[#71717b]" />
              <span className="text-[#71717b] text-sm leading-5">
                Rechercher un produit, vendeur...
              </span>
            </div>
            <button className="size-11 shrink-0 rounded-full bg-[#00c950] flex justify-center items-center">
              <SlidersHorizontal className="size-5 text-green-50" />
            </button>
          </div>
          <div className="overflow-x-auto flex -mx-6 px-6 pb-1 items-center gap-2">
            <span className="shrink-0 font-medium rounded-full bg-[#00c950] text-green-50 text-sm leading-5 px-4 py-1.5">
              Tous
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Agriculture
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Alimentation
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Industriel
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Boutique
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Pharmacie
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Import
            </span>
            <span className="shrink-0 font-medium rounded-full bg-zinc-100 text-zinc-900 text-sm leading-5 px-4 py-1.5">
              Boissons
            </span>
          </div>
        </header>
        <main className="px-6 pt-4">
          <div className="flex mb-4 justify-between items-center">
            <p className="text-[#71717b] text-sm leading-5">
              <span className="font-semibold text-zinc-950">248</span>produits
            </p>
            <button className="rounded-full border-zinc-200 border-1 border-solid flex px-3 py-1.5 items-center gap-1.5">
              <ArrowUpDown className="size-3.5 text-[#71717b]" />
              <span className="font-medium text-xs leading-4">Pertinence</span>
              <ChevronDown className="size-3.5 text-[#71717b]" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Riz importé"
                  className="object-cover w-full h-full"
                  data-photoid="saE7xiecGkM"
                  data-authorname="Ferhat Deniz Fors"
                  data-authorurl="https://unsplash.com/@ferhat"
                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <Ship className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Importateur
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 text-[#71717b]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Riz parfumé 25kg
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  280 000 GNF
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  500 sacs disponibles
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Guinée Import · Conakry
                  </span>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1582655299221-2b6bff351df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1hbmdvJTIwdHJvcGljYWwlMjBmcnVpdHxlbnwxfDJ8fHwxNzgzODg1NjA5fDA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Mangues fraîches"
                  className="object-cover w-full h-full"
                  data-photoid="BRiT_s3tN6Y"
                  data-authorname="Fedor"
                  data-authorurl="https://unsplash.com/@fmdevice"
                  data-blurhash="LOKcUuR-59WBv{n%T1bI16n$#6bI"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <Sprout className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Agriculteur
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 fill-primary text-[#00c950]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Mangues Kent
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  15 000 GNF/kg
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  800 kg disponibles
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Coop. Kindia · 132 km
                  </span>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1557486093-27e8c39d11a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWdzJTIwY29uc3RydWN0aW9ufGVufDF8Mnx8fDE3ODM4ODU2MDl8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Ciment"
                  className="object-cover w-full h-full"
                  data-photoid="pmynbAJKeoM"
                  data-authorname="kevin Baquerizo"
                  data-authorurl="https://unsplash.com/@kevinbae"
                  data-blurhash="LhE:PU8wo|ozMdtRkCs,e-t7WBof"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <Factory className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Industriel
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 text-[#71717b]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Ciment CEM II 50kg
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  95 000 GNF
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  20 cartons en stock
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Cimenterie GN · Kaloum
                  </span>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1780650569261-3d80c246a9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMGp1aWNlJTIwYm90dGxlcyUyMGJldmVyYWdlfGVufDF8Mnx8fDE3ODM4ODU2MTB8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Jus de fruits"
                  className="object-cover w-full h-full"
                  data-photoid="-fuc1N41jFQ"
                  data-authorname="eugene candie"
                  data-authorurl="https://unsplash.com/@madvincy"
                  data-blurhash="LJOL=nRipdVY*JWCafadx^o#adaK"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <CupSoda className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Industriel
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 text-[#71717b]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Jus mangue 1L
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  120 000 GNF
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  150 cartons en stock
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Guinée Boissons · Coyah
                  </span>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1716540103530-cc33cdd20cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwYm94ZXN8ZW58MXwyfHx8MTc4Mzg4NTYwOXww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Produits pharmaceutiques"
                  className="object-cover w-full h-full"
                  data-photoid="1O_pqjCYICw"
                  data-authorname="custom packaging"
                  data-authorurl="https://unsplash.com/@customrigidbox"
                  data-blurhash="LSGA8u4Tx[ba?bR%V[kC?vozRQjb"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <LucideCross className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Pharmacie
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 text-[#71717b]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Paracétamol 500mg
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  45 000 GNF
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  300 boîtes disponibles
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Pharma Distrib · Ratoma
                  </span>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-32">
                <img
                  src="https://images.unsplash.com/photo-1612800083273-24ea5c80313d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxzb2FwJTIwYmFycyUyMHBhY2thZ2VkfGVufDF8Mnx8fDE3ODM4ODU2MTd8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Savon"
                  className="object-cover w-full h-full"
                  data-photoid="7gZW8ZX6BqY"
                  data-authorname="Sincerely Media"
                  data-authorurl="https://unsplash.com/@sincerelymedia"
                  data-blurhash="LRPi;lxt_NxvRPWEV@n#?vt6D%M{"
                />
                <div className="rounded-full bg-[#00c950]/90 flex absolute left-2 top-2 px-2 py-1 items-center gap-1">
                  <ShoppingBag className="size-3 text-green-50" />
                  <span className="font-medium text-green-50 text-[10px]">
                    Détaillant
                  </span>
                </div>
                <button className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-3.5 text-[#71717b]" />
                </button>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="leading-tight font-semibold text-sm leading-5">
                  Savon artisanal
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  8 000 GNF/pièce
                </p>
                <p className="text-[#71717b] text-xs leading-4">
                  450 pièces disponibles
                </p>
                <div className="flex pt-1 items-center gap-1">
                  <MapPin className="size-3 text-[#71717b]" />
                  <span className="truncate text-[#71717b] text-[11px]">
                    Boutique Camara · Madina
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </main>
        <nav className="fixed z-30 inset-x-0 bottom-0">
          <div className="shadow-lg rounded-3xl bg-white border-zinc-200 border-1 border-solid flex mx-6 mb-6 px-4 py-3 justify-around items-center">
            <button className="flex flex-col items-center gap-1">
              <Home className="size-6 text-[#00c950]" />
              <span className="font-medium text-[#00c950] text-[10px]">
                Accueil
              </span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Search className="size-6 text-[#71717b]" />
              <span className="text-[#71717b] text-[10px]">Rechercher</span>
            </button>
            <button className="flex -mt-8 flex-col items-center gap-1">
              <span className="size-14 shadow-lg ring-4 ring-background rounded-full bg-[#00c950] flex justify-center items-center">
                <Plus className="size-7 text-green-50" />
              </span>
              <span className="text-[#71717b] text-[10px]">Publier</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <MessageCircle className="size-6 text-[#71717b]" />
              <span className="text-[#71717b] text-[10px]">Messages</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <User className="size-6 text-[#71717b]" />
              <span className="text-[#71717b] text-[10px]">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
