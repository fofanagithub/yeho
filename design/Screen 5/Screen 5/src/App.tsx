import { useEffect } from "react";
import { Check, Factory, Mail, MapPin, Phone, Upload } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[874px] flex mx-auto flex-col w-100.5">
          <div className="flex p-8 flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-2xl bg-[#00c950]/10 flex justify-center items-center">
                <Factory className="size-6 text-[#00c950]" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="leading-tight font-bold text-xl leading-7">
                  Créer votre profil Industriel
                </h1>
                <p className="text-[#71717b] text-sm leading-5">
                  Étape 2 sur 3 — Informations entreprise
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#00c950] text-xs leading-4">
                  Progression
                </span>
                <span className="font-medium text-[#71717b] text-xs leading-4">
                  66%
                </span>
              </div>
              <div className="rounded-full bg-zinc-100 w-full h-2 overflow-hidden">
                <div className="w-2/3 rounded-full bg-[#00c950] h-full" />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="company"
                  className="font-medium text-sm leading-5"
                >
                  Nom de l'entreprise
                </Label>
                <Input
                  id="company"
                  placeholder="Ex : Guinée Agro SARL"
                  className="rounded-lg border-zinc-200 border-0 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact"
                  className="font-medium text-sm leading-5"
                >
                  Nom du responsable / contact
                </Label>
                <Input
                  id="contact"
                  placeholder="Ex : Mamadou Diallo"
                  className="rounded-lg border-zinc-200 border-0 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="font-medium text-sm leading-5"
                >
                  Numéro de téléphone
                </Label>
                <div className="rounded-lg border-zinc-200 border-1 border-solid flex px-3 items-center gap-2">
                  <Phone className="size-4 text-[#71717b]" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+224 620 00 00 00"
                    className="shadow-none border-black/1 border-0 border-solid px-0"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="font-medium text-sm leading-5"
                >
                  Email professionnel
                </Label>
                <div className="rounded-lg border-zinc-200 border-1 border-solid flex px-3 items-center gap-2">
                  <Mail className="size-4 text-[#71717b]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@entreprise.gn"
                    className="shadow-none border-black/1 border-0 border-solid px-0"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="sector"
                  className="font-medium text-sm leading-5"
                >
                  Secteur d'activité industrielle
                </Label>
                <Select>
                  <SelectTrigger
                    id="sector"
                    className="rounded-lg border-zinc-200 border-0 border-solid w-full"
                  >
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agroalimentaire">
                      Agroalimentaire
                    </SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="materiaux">
                      Matériaux de construction
                    </SelectItem>
                    <SelectItem value="chimie">Chimie</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="products"
                  className="font-medium text-sm leading-5"
                >
                  Types de produits fabriqués
                </Label>
                <Textarea
                  id="products"
                  placeholder="Ex : Farine, huile végétale, jus de fruits..."
                  className="min-h-20 rounded-lg border-zinc-200 border-0 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="capacity"
                  className="font-medium text-sm leading-5"
                >
                  Capacité de production
                </Label>
                <Input
                  id="capacity"
                  placeholder="Ex : 500 tonnes / mois"
                  className="rounded-lg border-zinc-200 border-0 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="address"
                  className="font-medium text-sm leading-5"
                >
                  Adresse de l'usine / site de production
                </Label>
                <div className="rounded-lg border-zinc-200 border-1 border-solid flex px-3 py-1 items-start gap-2">
                  <MapPin className="size-4 text-[#71717b] mt-2.5" />
                  <Textarea
                    id="address"
                    placeholder="Zone industrielle, Conakry, Guinée"
                    className="shadow-none min-h-16 border-black/1 border-0 border-solid px-0"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rccm" className="font-medium text-sm leading-5">
                  Numéro d'enregistrement (RCCM)
                </Label>
                <Input
                  id="rccm"
                  placeholder="Ex : GC-KAL-2024-B-01234"
                  className="rounded-lg border-zinc-200 border-0 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm leading-5">
                  Document légal (registre de commerce)
                </Label>
                <div className="text-center rounded-xl bg-[#00c950]/5 border-[#00c950]/40 border-2 border-dashed flex p-6 flex-col justify-center items-center gap-2">
                  <div className="size-10 rounded-full bg-[#00c950]/10 flex justify-center items-center">
                    <Upload className="size-5 text-[#00c950]" />
                  </div>
                  <p className="font-medium text-sm leading-5">
                    Télécharger un document
                  </p>
                  <p className="text-[#71717b] text-xs leading-4">
                    PDF, JPG ou PNG — max 5 Mo
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-lg text-[#00c950] border-[#00c950] border-0 border-solid mt-1"
                  >
                    Choisir un fichier
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex mt-auto p-8 flex-col gap-4">
            <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
              <Check className="size-5" />
              Créer mon compte
            </Button>
            <p className="leading-relaxed text-center text-[#71717b] text-xs leading-4">
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
