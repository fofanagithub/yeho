import { useEffect } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  FileBadge,
  FileText,
  Heart,
  Home,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Search,
  Ship,
  Star,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 pb-24 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="relative w-full">
          <div className="bg-[linear-gradient(135deg,oklch(0.42_0.11_150),oklch(0.723_0.219_149.579))] w-full h-40" />
          <div className="flex absolute inset-x-0 top-24 flex-col items-center">
            <div className="relative">
              <Avatar className="size-28 shadow-lg border-white border-4 border-solid">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1678282955795-200c1e18bc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfDJ8fHwxNzgzODg1NjA4fDA&ixlib=rb-4.1.0&q=80&w=400"
                  data-photoid="JoZ0Ni2xn2U"
                  data-authorname="Oluwatobi"
                  data-authorurl="https://unsplash.com/@oluwatobisimii"
                  data-blurhash="LqLgqpog_NWC~Wt7bcjsE2RjRPWB"
                  alt="Photo de profil"
                />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <span className="size-7 rounded-full bg-[#00c950] border-white border-2 border-solid flex absolute right-1 bottom-1 justify-center items-center">
                <Check className="size-4 text-green-50" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex mt-20 px-8 flex-col items-center">
          <h1 className="font-bold text-xl leading-7 tracking-tight">
            Mamadou Barry
          </h1>
          <div className="flex mt-2 items-center gap-2">
            <Badge className="bg-[#00c950]/10 text-[#00c950] px-3 py-1 gap-1">
              <Ship className="size-3.5" />
              Importateur
            </Badge>
            <span className="text-[#71717b] text-sm leading-5 flex items-center gap-1">
              <MapPin className="size-3.5" />
              Conakry, Guinée
            </span>
          </div>
        </div>
        <div className="mt-6 px-8">
          <Card className="p-4 gap-0">
            <CardContent className="flex p-0 justify-around items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-zinc-950 text-lg leading-7">
                  24
                </span>
                <span className="text-[#71717b] text-xs leading-4">
                  Produits
                </span>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-zinc-950 text-lg leading-7 flex items-center gap-1">
                  <Star className="size-4 fill-primary text-[#00c950]" />
                  4.8
                </span>
                <span className="text-[#71717b] text-xs leading-4">
                  Note moyenne
                </span>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-zinc-950 text-lg leading-7">
                  312
                </span>
                <span className="text-[#71717b] text-xs leading-4">Ventes</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 px-8">
          <h2 className="font-semibold text-base leading-6 mb-3">
            Informations du compte
          </h2>
          <Card className="p-4 gap-0">
            <CardContent className="flex p-0 flex-col">
              <div className="flex py-3 items-center gap-3">
                <span className="size-9 rounded-full bg-zinc-100 flex justify-center items-center">
                  <Phone className="size-4 text-[#71717b]" />
                </span>
                <div className="flex-1">
                  <p className="text-[#71717b] text-xs leading-4">Téléphone</p>
                  <p className="font-medium text-sm leading-5">
                    +224 620 00 00 00
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#00c950] p-1 h-auto"
                >
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex py-3 items-center gap-3">
                <span className="size-9 rounded-full bg-zinc-100 flex justify-center items-center">
                  <Mail className="size-4 text-[#71717b]" />
                </span>
                <div className="flex-1">
                  <p className="text-[#71717b] text-xs leading-4">Email</p>
                  <p className="font-medium text-sm leading-5">
                    contact@barry-import.gn
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#00c950] p-1 h-auto"
                >
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex py-3 items-center gap-3">
                <span className="size-9 rounded-full bg-zinc-100 flex justify-center items-center">
                  <MapPin className="size-4 text-[#71717b]" />
                </span>
                <div className="flex-1">
                  <p className="text-[#71717b] text-xs leading-4">
                    Zone de distribution
                  </p>
                  <p className="font-medium text-sm leading-5">
                    Conakry · Kindia · Boké
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#00c950] p-1 h-auto"
                >
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex py-3 items-center gap-3">
                <span className="size-9 rounded-full bg-zinc-100 flex justify-center items-center">
                  <Calendar className="size-4 text-[#71717b]" />
                </span>
                <div className="flex-1">
                  <p className="text-[#71717b] text-xs leading-4">
                    Date d'inscription
                  </p>
                  <p className="font-medium text-sm leading-5">
                    12 janvier 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 px-8">
          <h2 className="font-semibold text-base leading-6 mb-3">
            Mes documents
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 gap-2">
              <CardContent className="flex p-0 flex-col items-center gap-2">
                <span className="size-10 rounded-lg bg-[#00c950]/10 flex justify-center items-center">
                  <FileText className="size-5 text-[#00c950]" />
                </span>
                <p className="font-medium text-center text-sm leading-5">
                  Licence d'importation
                </p>
                <Badge className="bg-[#00c950]/10 text-[#00c950] gap-1">
                  <span className="size-1.5 rounded-full bg-[#00c950]" />
                  Vérifié
                </Badge>
              </CardContent>
            </Card>
            <Card className="p-4 gap-2">
              <CardContent className="flex p-0 flex-col items-center gap-2">
                <span className="size-10 rounded-lg bg-zinc-100 flex justify-center items-center">
                  <FileBadge className="size-5 text-[#71717b]" />
                </span>
                <p className="font-medium text-center text-sm leading-5">
                  Registre de commerce
                </p>
                <Badge className="bg-[oklch(0.828_0.189_84.429)]/15 text-[oklch(0.55_0.16_60)] gap-1">
                  <span className="size-1.5 bg-[oklch(0.75_0.17_65)] rounded-full" />
                  En attente
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-6 px-8">
          <div className="flex mb-3 justify-between items-center">
            <h2 className="font-semibold text-base leading-6">
              Mes produits publiés
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00c950] p-1 gap-1 h-auto"
            >
              Voir tout
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="overflow-x-auto flex -mx-8 px-8 pb-2 gap-4">
            <Card className="shrink-0 p-0 gap-0 w-40 overflow-hidden">
              <div className="w-full h-28">
                <img
                  src="https://images.unsplash.com/photo-1625827626291-6fbd47a431ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZsb3VyJTIwYmFnJTIwcHJvZHVjdHxlbnwxfDJ8fHwxNzgzODg1NjE1fDA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Farine"
                  className="object-cover w-full h-full"
                  data-photoid="ocd_xKscv1I"
                  data-authorname="Wahaj Sufian"
                  data-authorurl="https://unsplash.com/@wahajsufian"
                  data-blurhash="LhKK+sD%_NV@_3aet7fPx]j[RPbI"
                />
              </div>
              <CardContent className="flex p-3 flex-col gap-1">
                <p className="truncate font-medium text-sm leading-5">
                  Farine de blé 25kg
                </p>
                <p className="font-bold text-[#00c950] text-sm leading-5">
                  185 000 GNF
                </p>
                <span className="text-[#71717b] text-xs leading-4 flex items-center gap-1">
                  <Package className="size-3" />
                  500 en stock
                </span>
              </CardContent>
            </Card>
            <Card className="shrink-0 p-0 gap-0 w-40 overflow-hidden">
              <div className="w-full h-28">
                <img
                  src="https://images.unsplash.com/photo-1641357497181-94a7ce5a3d7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW4lMjBzYWNrcyUyMGFncmljdWx0dXJlJTIwcHJvZHVjdHxlbnwxfDJ8fHwxNzgzODg1NjA4fDA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Riz"
                  className="object-cover w-full h-full"
                  data-photoid="2IyO73aMfs4"
                  data-authorname="Derek Phan"
                  data-authorurl="https://unsplash.com/@phanvuthanhtoan"
                  data-blurhash="LB4ho3Q-pIfjV[uPbbf,k=u4pdi_"
                />
              </div>
              <CardContent className="flex p-3 flex-col gap-1">
                <p className="truncate font-medium text-sm leading-5">
                  Riz parfumé 50kg
                </p>
                <p className="font-bold text-[#00c950] text-sm leading-5">
                  420 000 GNF
                </p>
                <span className="text-[#71717b] text-xs leading-4 flex items-center gap-1">
                  <Package className="size-3" />
                  1200 en stock
                </span>
              </CardContent>
            </Card>
            <Card className="shrink-0 p-0 gap-0 w-40 overflow-hidden">
              <div className="w-full h-28">
                <img
                  src="https://images.unsplash.com/photo-1678942953384-91aae690abd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwb2lsJTIwYm90dGxlcyUyMHByb2R1Y3R8ZW58MXwyfHx8MTc4Mzg4NTYwOHww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Huile"
                  className="object-cover w-full h-full"
                  data-photoid="QWLQ9vgQEDw"
                  data-authorname="Andrey Haimin"
                  data-authorurl="https://unsplash.com/@akb001"
                  data-blurhash="LtM7WHNe~Tx8?wsoX9kXadk9Rjbc"
                />
              </div>
              <CardContent className="flex p-3 flex-col gap-1">
                <p className="truncate font-medium text-sm leading-5">
                  Huile végétale 20L
                </p>
                <p className="font-bold text-[#00c950] text-sm leading-5">
                  310 000 GNF
                </p>
                <span className="text-[#71717b] text-xs leading-4 flex items-center gap-1">
                  <Package className="size-3" />
                  340 en stock
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex mt-8 px-8 flex-col gap-4">
          <Button
            variant="outline"
            className="text-[#00c950] border-[#00c950] border-0 border-solid gap-2 w-full"
          >
            <Pencil className="size-4" />
            Modifier le profil
          </Button>
          <Button variant="ghost" className="text-[#e7000b] gap-2 w-full">
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
        </div>
        <nav className="fixed z-50 bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid inset-x-0 bottom-0">
          <div className="flex px-4 py-3 justify-around items-center">
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <Home className="size-5" />
              <span className="text-xs leading-4">Accueil</span>
            </button>
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <Search className="size-5" />
              <span className="text-xs leading-4">Recherche</span>
            </button>
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <Heart className="size-5" />
              <span className="text-xs leading-4">Favoris</span>
            </button>
            <button className="text-[#00c950] flex flex-col items-center gap-1">
              <User className="size-5" />
              <span className="font-medium text-xs leading-4">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
