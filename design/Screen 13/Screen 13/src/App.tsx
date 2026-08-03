import { useEffect } from "react";
import {
  ArrowLeft,
  Bike,
  Check,
  CupSoda,
  Headphones,
  Home,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Star,
  Truck,
  User,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="overflow-y-auto pb-4 flex-1">
          <div className="border-zinc-200 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex p-6 items-center gap-4">
            <div className="size-10 rounded-full bg-zinc-100 flex justify-center items-center">
              <ArrowLeft className="size-5 text-zinc-950" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-zinc-950 text-xl leading-7">
                Suivi de livraison
              </h1>
              <p className="text-[#71717b] text-sm leading-5">
                Commande #GN-20482
              </p>
            </div>
          </div>
          <div className="flex p-6 flex-col gap-6">
            <Card className="rounded-2xl p-0 gap-0 overflow-hidden">
              <div className="relative w-full h-44">
                <img
                  src="https://screens-image-components-public.s3.eu-north-1.amazonaws.com/city-navigation-map.png"
                  alt="Carte de suivi"
                  className="object-cover w-full h-full"
                />
                <div className="bg-gradient-to-t from-foreground/50 to-transparent absolute inset-0" />
                <div className="rounded-full bg-[#00c950] flex absolute left-4 top-4 px-3 py-1.5 items-center gap-2">
                  <Truck className="size-4 text-green-50" />
                  <span className="font-semibold text-green-50 text-xs leading-4">
                    En route
                  </span>
                </div>
                <div className="flex absolute inset-x-4 bottom-4 justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-white/80 text-xs leading-4">
                      Arrivée estimée
                    </span>
                    <span className="font-bold text-white text-lg leading-7">
                      Aujourd'hui · 16h30
                    </span>
                  </div>
                  <div className="size-11 shadow-lg rounded-full bg-white/90 flex justify-center items-center">
                    <MapPin className="size-5 text-[#00c950]" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="rounded-2xl p-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1782953329054-1cafa16b9186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMGRyaXZlciUyMHBvcnRyYWl0JTIwYWZyaWNhbiUyMG1hbnxlbnwxfDJ8fHwxNzg0Mzc0ODc5fDA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Livreur"
                    className="object-cover w-full h-full"
                    data-photoid="qchwh9Aeo5c"
                    data-authorname="luthfian alfajr"
                    data-authorurl="https://unsplash.com/@panasgaram"
                    data-blurhash="LDD,4YIU%MM{~q%Mt7t79Ft7Rjt7"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-zinc-950 text-base leading-6">
                    Ousmane Diallo
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-primary text-[#00c950]" />
                    <span className="text-[#71717b] text-sm leading-5">
                      4.9 · Votre livreur
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="size-10 rounded-full border-[#00c950] border-0 border-solid p-0"
                  >
                    <Phone className="size-4 text-[#00c950]" />
                  </Button>
                  <Button className="size-10 rounded-full bg-[#00c950] text-green-50 p-0">
                    <MessageCircle className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-100 flex p-2 items-center gap-2">
                <Bike className="size-4 text-[#00c950]" />
                <span className="text-zinc-900 text-xs leading-4">
                  Camionnette · GN-4821-CY · Cimenterie GN
                </span>
              </div>
            </Card>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-zinc-950 text-lg leading-7">
                État de la commande
              </h2>
              <Card className="rounded-2xl p-6 gap-0">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-full bg-[#00c950] flex justify-center items-center">
                      <Check className="size-5 text-green-50" />
                    </div>
                    <div className="min-h-10 bg-[#00c950] flex-1 w-0.5" />
                  </div>
                  <div className="flex pb-6 flex-col">
                    <span className="font-semibold text-zinc-950 text-sm leading-5">
                      Commande confirmée
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Aujourd'hui · 09h12
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-full bg-[#00c950] flex justify-center items-center">
                      <Package className="size-5 text-green-50" />
                    </div>
                    <div className="min-h-10 bg-[#00c950] flex-1 w-0.5" />
                  </div>
                  <div className="flex pb-6 flex-col">
                    <span className="font-semibold text-zinc-950 text-sm leading-5">
                      Colis préparé
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Aujourd'hui · 11h45
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-9 animate-pulse rounded-full bg-[#00c950] flex justify-center items-center">
                      <Truck className="size-5 text-green-50" />
                    </div>
                    <div className="min-h-10 bg-zinc-200 flex-1 w-0.5" />
                  </div>
                  <div className="flex pb-6 flex-col">
                    <span className="font-semibold text-[#00c950] text-sm leading-5">
                      En cours de livraison
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Votre colis est en route vers Madina
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-full bg-zinc-100 border-zinc-200 border-1 border-solid flex justify-center items-center">
                      <Home className="size-5 text-[#71717b]" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#71717b] text-sm leading-5">
                      Livré
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      En attente
                    </span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-zinc-950 text-lg leading-7">
                Détails de livraison
              </h2>
              <Card className="rounded-2xl p-4 gap-3">
                <div className="flex items-start gap-3">
                  <div className="size-9 shrink-0 rounded-full bg-zinc-100 flex justify-center items-center">
                    <MapPin className="size-4 text-[#00c950]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#71717b] text-xs leading-4">
                      Adresse de livraison
                    </span>
                    <span className="font-medium text-zinc-950 text-sm leading-5">
                      Madina, marché central
                    </span>
                    <span className="text-[#71717b] text-sm leading-5">
                      Conakry, Guinée
                    </span>
                  </div>
                </div>
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex items-start gap-3">
                  <div className="size-9 shrink-0 rounded-full bg-zinc-100 flex justify-center items-center">
                    <Wallet className="size-4 text-[#00c950]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#71717b] text-xs leading-4">
                      Paiement
                    </span>
                    <span className="font-medium text-zinc-950 text-sm leading-5">
                      À la livraison · Espèces
                    </span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-zinc-950 text-lg leading-7">
                  Articles (3)
                </h2>
                <span className="font-bold text-[#00c950] text-sm leading-5">
                  3 105 000 GNF
                </span>
              </div>
              <Card className="rounded-2xl p-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1625827626291-6fbd47a431ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwc2FjayUyMGJhZyUyMGZvb2QlMjBwcm9kdWN0fGVufDF8Mnx8fDE3ODQzNzQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Riz parfumé"
                      className="object-cover w-full h-full"
                      data-photoid="ocd_xKscv1I"
                      data-authorname="Wahaj Sufian"
                      data-authorurl="https://unsplash.com/@wahajsufian"
                      data-blurhash="LhKK+sD%_NV@_3aet7fPx]j[RPbI"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-zinc-950 text-sm leading-5">
                      Riz parfumé 25kg
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 5 sacs
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-950 text-sm leading-5">
                    1 250 000
                  </span>
                </div>
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1782012973466-71ab10fd2bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwY2FyZ28lMjB0cmFuc3BvcnR8ZW58MXwyfHx8MTc4NDM3NDg3OXww&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Mangues"
                      className="object-cover w-full h-full"
                      data-photoid="ZTKbLXix_hk"
                      data-authorname="MOHD FADZILLAH SULAIMAN"
                      data-authorurl="https://unsplash.com/@duaenamkosonglima"
                      data-blurhash="LaIrELD%Rjay_3RjRjRj~qj[WBj["
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-zinc-950 text-sm leading-5">
                      Mangues Kent
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 100 kg
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-950 text-sm leading-5">
                    1 500 000
                  </span>
                </div>
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 rounded-lg bg-zinc-100 flex justify-center items-center">
                    <CupSoda className="size-6 text-[#00c950]" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-zinc-950 text-sm leading-5">
                      Jus mangue 1L
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 3 cartons
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-950 text-sm leading-5">
                    330 000
                  </span>
                </div>
              </Card>
            </div>
            <div className="flex flex-col gap-3">
              <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
                <Headphones className="size-5" />
                Contacter le support
              </Button>
              <p className="font-medium text-center text-[#00c950] text-sm leading-5 hidden">
                Le support vous rappellera dans quelques minutes
              </p>
              <Button
                variant="ghost"
                className="rounded-xl text-[#e7000b] w-full h-11"
              >
                <X className="size-4" />
                Signaler un problème
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-2 py-3 flex-row justify-around items-center">
          <div className="flex flex-col items-center gap-1">
            <Home className="size-5 text-[#71717b]" />
            <span className="text-[#71717b] text-[10px]">Accueil</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Search className="size-5 text-[#71717b]" />
            <span className="text-[#71717b] text-[10px]">Rechercher</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShoppingCart className="size-5 text-[#00c950]" />
            <span className="font-medium text-[#00c950] text-[10px]">
              Panier
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MessageCircle className="size-5 text-[#71717b]" />
            <span className="text-[#71717b] text-[10px]">Messages</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <User className="size-5 text-[#71717b]" />
            <span className="text-[#71717b] text-[10px]">Profil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
