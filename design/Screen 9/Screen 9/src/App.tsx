import { useEffect } from "react";
import {
  Camera,
  ChevronLeft,
  Eye,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Search,
  Ship,
  Upload,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="sticky z-10 bg-white border-zinc-200 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex top-0 p-4 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="leading-tight font-bold text-lg leading-7">
              Publier un produit
            </h1>
            <p className="text-[#71717b] text-xs leading-4">
              Ajoutez votre produit au marketplace
            </p>
          </div>
        </div>
        <div className="flex px-6 pt-6 pb-40 flex-col flex-1 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm leading-5">
                Photos du produit
              </label>
              <span className="text-[#71717b] text-xs leading-4">
                0/5 photos
              </span>
            </div>
            <button className="rounded-2xl bg-[#00c950]/5 text-[#00c950] border-[#00c950]/40 border-2 border-dashed flex flex-col justify-center items-center gap-2 h-40">
              <div className="size-12 rounded-full bg-[#00c950]/10 flex justify-center items-center">
                <Camera className="size-6" />
              </div>
              <span className="font-medium text-sm leading-5">
                Ajouter des photos
              </span>
              <span className="text-[#71717b] text-xs leading-4">
                JPG ou PNG · max 5 Mo
              </span>
            </button>
            <p className="font-medium text-[#00c950] text-xs leading-4 hidden">
              0 photo(s) ajoutée(s)
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Nom du produit
            </label>
            <Input
              placeholder="Ex : Riz parfumé 25kg"
              className="rounded-xl h-11"
              defaultValue="Riz parfumé 25kg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">Catégorie</label>
            <Select defaultValue="">
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="alimentation">Alimentation</SelectItem>
                <SelectItem value="industriel">Industriel</SelectItem>
                <SelectItem value="boutique">Boutique</SelectItem>
                <SelectItem value="pharmacie">Pharmacie</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="boissons">Boissons</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Description détaillée
            </label>
            <Textarea
              placeholder="Décrivez votre produit, sa qualité, son origine..."
              className="min-h-24 resize-none rounded-xl"
              defaultValue=""
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Prix unitaire
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex : 280 000"
                className="rounded-xl flex-1 h-11"
                defaultValue=""
              />
              <Select defaultValue="GNF">
                <SelectTrigger className="rounded-xl w-24 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GNF">GNF</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Quantité disponible
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex : 500"
                className="rounded-xl flex-1 h-11"
                defaultValue=""
              />
              <Select defaultValue="sacs">
                <SelectTrigger className="rounded-xl w-28 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="sacs">sacs</SelectItem>
                  <SelectItem value="cartons">cartons</SelectItem>
                  <SelectItem value="pièces">pièces</SelectItem>
                  <SelectItem value="litres">litres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Zone de disponibilité / livraison
            </label>
            <Select defaultValue="">
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conakry">Conakry</SelectItem>
                <SelectItem value="kindia">Kindia</SelectItem>
                <SelectItem value="boke">Boké</SelectItem>
                <SelectItem value="labe">Labé</SelectItem>
                <SelectItem value="mamou">Mamou</SelectItem>
                <SelectItem value="kankan">Kankan</SelectItem>
                <SelectItem value="faranah">Faranah</SelectItem>
                <SelectItem value="nzerekore">N'Zérékoré</SelectItem>
                <SelectItem value="toute">Toute la Guinée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border-zinc-200 border-1 border-solid flex p-4 justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-5">
                Prix négociable
              </span>
              <span className="text-[#71717b] text-xs leading-4">
                Autoriser les acheteurs à négocier
              </span>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm leading-5">
              Quantité minimale de commande
              <span className="font-normal text-[#71717b]">(optionnel)</span>
            </label>
            <Input
              placeholder="Ex : 10 sacs minimum"
              className="rounded-xl h-11"
              defaultValue=""
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-[#00c950]" />
              <span className="font-semibold text-sm leading-5">
                Aperçu de la carte produit
              </span>
            </div>
            <Card className="rounded-2xl p-0 gap-0 w-48 overflow-hidden">
              <div className="relative h-32">
                <img
                  src="https://images.unsplash.com/photo-1615485290628-c5033c657a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxiYWclMjBvZiUyMHJpY2UlMjBncmFpbnxlbnwxfDJ8fHwxNzg0MzczMjAzfDA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Aperçu produit"
                  className="object-cover w-full h-full"
                  data-photoid="3SimRsAd2nQ"
                  data-authorname="Mockup Graphics"
                  data-authorurl="https://unsplash.com/@mockupgraphics"
                  data-blurhash="LgR:1ray?wt7t8j[WBay.Tj[I9WB"
                />
                <Badge className="bg-[#00c950] text-green-50 text-xs leading-4 absolute left-2 top-2 gap-1">
                  <Ship className="size-3" />
                  Importateur
                </Badge>
                <div className="size-7 rounded-full bg-white/90 flex absolute right-2 top-2 justify-center items-center">
                  <Heart className="size-4 text-[#71717b]" />
                </div>
              </div>
              <div className="flex p-3 flex-col gap-1">
                <p className="truncate font-semibold text-sm leading-5">
                  Riz parfumé 25kg
                </p>
                <p className="font-bold text-[#00c950] text-base leading-6">
                  {" "}
                  GNF
                </p>
                <div className="text-[#71717b] text-xs leading-4 flex items-center gap-1">
                  <Package className="size-3" />
                  <span> sacs disponibles</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs leading-4 mt-1 w-fit"
                >
                  Négociable
                </Badge>
                <div className="text-[#71717b] text-xs leading-4 flex mt-1 items-center gap-1">
                  <MapPin className="size-3" />
                  <span>Guinée Import · Conakry</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="fixed flex inset-x-0 bottom-0 flex-col">
          <div className="bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-6 pt-4 pb-3 flex-col gap-2">
            <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
              <Upload className="size-5" />
              Publier le produit
            </Button>
            <button className="underline-offset-2 underline text-center text-[#71717b] text-sm leading-5">
              Enregistrer comme brouillon
            </button>
          </div>
          <div className="bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-4 py-2 justify-around items-center">
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <Home className="size-5" />
              <span className="text-[10px]">Accueil</span>
            </button>
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <Search className="size-5" />
              <span className="text-[10px]">Rechercher</span>
            </button>
            <button className="flex -mt-6 flex-col items-center gap-1">
              <div className="size-14 shadow-lg shadow-primary/30 rounded-full bg-[#00c950] text-green-50 border-white border-4 border-solid flex justify-center items-center">
                <Plus className="size-6" />
              </div>
              <span className="font-semibold text-[#00c950] text-[10px]">
                Publier
              </span>
            </button>
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <MessageCircle className="size-5" />
              <span className="text-[10px]">Messages</span>
            </button>
            <button className="text-[#71717b] flex flex-col items-center gap-1">
              <User className="size-5" />
              <span className="text-[10px]">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
