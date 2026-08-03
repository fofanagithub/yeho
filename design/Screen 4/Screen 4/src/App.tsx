import { useEffect } from "react";
import {
  Check,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Sprout,
  Upload,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[874px] flex mx-auto p-8 flex-col gap-6 w-100.5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-2xl bg-[#00c950]/10 flex justify-center items-center">
                <Sprout className="size-6 text-[#00c950]" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="leading-tight font-bold text-xl leading-7 tracking-tight">
                  Créer votre profil Agriculteur
                </h1>
                <p className="text-[#71717b] text-sm leading-5">
                  Rejoignez le réseau des producteurs de Guinée
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#00c950] text-xs leading-4">
                  Étape 2 sur 3
                </span>
                <span className="text-[#71717b] text-xs leading-4">
                  Informations agricoles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#00c950] flex-1 h-2" />
                <div className="rounded-full bg-[#00c950] flex-1 h-2" />
                <div className="rounded-full bg-zinc-100 flex-1 h-2" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="fullname"
                className="font-medium text-sm leading-5"
              >
                Nom complet ou nom de la coopérative
              </Label>
              <div className="relative">
                <User className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  id="fullname"
                  placeholder="Ex : Coopérative Riz de Kindia"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="font-medium text-sm leading-5">
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Phone className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+224 6XX XX XX XX"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-medium text-sm leading-5">
                Email
                <span className="font-normal text-[#71717b]">(optionnel)</span>
              </Label>
              <div className="relative">
                <Mail className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="region" className="font-medium text-sm leading-5">
                Région / préfecture de production
              </Label>
              <Select>
                <SelectTrigger id="region" className="w-full">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-[#71717b]" />
                    <SelectValue placeholder="Sélectionnez une région" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conakry">Conakry</SelectItem>
                  <SelectItem value="kindia">Kindia</SelectItem>
                  <SelectItem value="boke">Boké</SelectItem>
                  <SelectItem value="mamou">Mamou</SelectItem>
                  <SelectItem value="labe">Labé</SelectItem>
                  <SelectItem value="faranah">Faranah</SelectItem>
                  <SelectItem value="kankan">Kankan</SelectItem>
                  <SelectItem value="nzerekore">Nzérékoré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Types de cultures ou produits agricoles
              </Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="default"
                  className="cursor-pointer rounded-full px-3 py-1.5 gap-1"
                >
                  <Check className="size-3" />
                  Riz
                </Badge>
                <Badge
                  variant="default"
                  className="cursor-pointer rounded-full px-3 py-1.5 gap-1"
                >
                  <Check className="size-3" />
                  Fruits
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full px-3 py-1.5"
                >
                  Légumes
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full px-3 py-1.5"
                >
                  Café
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full px-3 py-1.5"
                >
                  Cacao
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full px-3 py-1.5"
                >
                  Élevage
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full px-3 py-1.5 gap-1"
                >
                  <Plus className="size-3" />
                  Autre
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="capacity"
                className="font-medium text-sm leading-5"
              >
                Capacité de production estimée
              </Label>
              <div className="relative">
                <Package className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  id="capacity"
                  placeholder="Ex : 5 tonnes par saison"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Mode de vente préféré
              </Label>
              <RadioGroup
                defaultValue="directe"
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="m1"
                  className="cursor-pointer rounded-lg border-zinc-200 border-1 border-solid flex p-4 items-center gap-3"
                >
                  <RadioGroupItem value="directe" id="m1" />
                  <span className="text-sm leading-5">Vente directe</span>
                </Label>
                <Label
                  htmlFor="m2"
                  className="cursor-pointer rounded-lg border-zinc-200 border-1 border-solid flex p-4 items-center gap-3"
                >
                  <RadioGroupItem value="cooperative" id="m2" />
                  <span className="text-sm leading-5">Via coopérative</span>
                </Label>
                <Label
                  htmlFor="m3"
                  className="cursor-pointer rounded-lg border-zinc-200 border-1 border-solid flex p-4 items-center gap-3"
                >
                  <RadioGroupItem value="intermediaire" id="m3" />
                  <span className="text-sm leading-5">Via intermédiaire</span>
                </Label>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Photo de l'exploitation ou pièce d'identité
              </Label>
              <div className="cursor-pointer rounded-xl bg-[#00c950]/5 border-[#00c950]/40 border-2 border-dashed flex p-8 flex-col justify-center items-center gap-2">
                <div className="size-12 rounded-full bg-[#00c950]/10 flex justify-center items-center">
                  <Upload className="size-5 text-[#00c950]" />
                </div>
                <span className="font-medium text-zinc-950 text-sm leading-5">
                  Téléverser un fichier
                </span>
                <span className="text-[#71717b] text-xs leading-4">
                  PNG, JPG ou PDF · max 10 Mo
                </span>
              </div>
            </div>
          </div>
          <div className="flex mt-2 flex-col gap-4">
            <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
              <Check className="size-5" />
              Créer mon compte
            </Button>
            <p className="text-center text-[#71717b] text-xs leading-4 px-4">
              En créant un compte, vous acceptez nos
              <span className="underline font-medium text-[#00c950]">
                conditions d'utilisation
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
