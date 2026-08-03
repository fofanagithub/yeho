import { useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Mail,
  MapPin,
  Phone,
  Store,
  Upload,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <div className="min-h-[874px] flex mx-auto p-6 flex-col gap-6 w-100.5">
          <div className="flex justify-between items-center">
            <button className="size-10 rounded-full bg-zinc-100 text-zinc-900 flex justify-center items-center">
              <ArrowLeft className="size-5" />
            </button>
            <span className="font-medium text-[#71717b] text-sm leading-5">
              Étape 1 sur 2
            </span>
            <div className="size-10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                <Store className="size-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="leading-tight font-bold text-2xl leading-8 tracking-tight">
                  Créer votre profil Détaillant
                </h1>
                <p className="text-[#71717b] text-sm leading-5">
                  Renseignez les informations de votre commerce
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#71717b] text-xs leading-4">
                  Progression
                </span>
                <span className="font-semibold text-[#00c950] text-xs leading-4">
                  50%
                </span>
              </div>
              <div className="rounded-full bg-zinc-100 w-full h-2 overflow-hidden">
                <div className="w-1/2 rounded-full bg-[#00c950] h-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1 gap-2">
            <button className="shadow-sm font-semibold rounded-lg bg-white text-zinc-950 text-sm leading-5 flex py-2.5 justify-center items-center gap-2">
              <Store className="size-4 text-[#00c950]" />
              Détaillant
            </button>
            <button className="font-medium rounded-lg text-[#71717b] text-sm leading-5 flex py-2.5 justify-center items-center gap-2">
              <User className="size-4" />
              Particulier
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Nom de la boutique / commerce
              </Label>
              <Input
                placeholder="Ex. Boutique Camara"
                className="rounded-lg border-zinc-200 border-0 border-solid h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Nom du gérant
              </Label>
              <Input
                placeholder="Ex. Mamadou Camara"
                className="rounded-lg border-zinc-200 border-0 border-solid h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Phone className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  placeholder="+224 6XX XX XX XX"
                  className="rounded-lg border-zinc-200 border-0 border-solid pl-9 h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">Email</Label>
              <div className="relative">
                <Mail className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  placeholder="exemple@email.com"
                  className="rounded-lg border-zinc-200 border-0 border-solid pl-9 h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Adresse / quartier de la boutique
              </Label>
              <div className="relative">
                <MapPin className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                <Input
                  placeholder="Ex. Madina, Conakry"
                  className="rounded-lg border-zinc-200 border-0 border-solid pl-9 h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Catégorie de produits vendus
              </Label>
              <Select>
                <SelectTrigger className="rounded-lg border-zinc-200 border-0 border-solid w-full h-11">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentation">Alimentation</SelectItem>
                  <SelectItem value="electronique">Électronique</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="materiaux">
                    Matériaux de construction
                  </SelectItem>
                  <SelectItem value="autres">Autres</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm leading-5">
                Document d'identification commerciale
              </Label>
              <button className="rounded-lg text-[#71717b] border-zinc-200 border-2 border-dashed flex flex-col justify-center items-center gap-2 h-28">
                <Upload className="size-6" />
                <span className="font-medium text-sm leading-5">
                  Téléverser un document
                </span>
                <span className="text-xs leading-4">
                  PDF, JPG ou PNG (max 5 Mo)
                </span>
              </button>
            </div>
          </div>
          <div className="flex mt-2 flex-col gap-3">
            <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
              <Check className="size-5" />
              Créer mon compte
            </Button>
            <p className="text-center text-[#71717b] text-xs leading-4 px-4">
              En créant un compte, vous acceptez nos
              <span className="font-medium text-[#00c950]">
                conditions d'utilisation
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
