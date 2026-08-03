import { useEffect } from "react";
import {
  Building2,
  Check,
  Cpu,
  FileBadge,
  Globe,
  Mail,
  Paperclip,
  Phone,
  Ship,
  UploadCloud,
  User,
  Utensils,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-2xl bg-[#00c950] text-green-50 flex justify-center items-center">
                <Ship className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="leading-tight font-bold text-xl leading-7">
                  Créer votre profil Importateur
                </h1>
                <p className="text-[#71717b] text-sm leading-5">
                  Étape 2 sur 3 · Informations professionnelles
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium text-[#71717b] text-xs leading-4 flex justify-between items-center">
                <span>Progression</span>
                <span className="text-[#00c950]">66%</span>
              </div>
              <div className="rounded-full bg-zinc-100 w-full h-2 overflow-hidden">
                <div className="w-2/3 rounded-full bg-[#00c950] h-full" />
              </div>
            </div>
          </div>
          <Card className="p-6 gap-6">
            <CardContent className="flex p-0 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="company"
                  className="font-medium text-sm leading-5"
                >
                  Nom de l'entreprise
                </Label>
                <div className="relative">
                  <Building2 className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="company"
                    placeholder="Ex. Guinée Import SARL"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="manager"
                  className="font-medium text-sm leading-5"
                >
                  Nom du responsable
                </Label>
                <div className="relative">
                  <User className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="manager"
                    placeholder="Prénom et nom"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="font-medium text-sm leading-5"
                >
                  Numéro de téléphone
                </Label>
                <div className="relative">
                  <Phone className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+224 6XX XX XX XX"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="font-medium text-sm leading-5"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@entreprise.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="origin"
                  className="font-medium text-sm leading-5"
                >
                  Pays / ville d'origine des importations
                </Label>
                <div className="relative">
                  <Globe className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="origin"
                    placeholder="Ex. Chine · Guangzhou"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm leading-5">
                  Types de produits importés
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un ou plusieurs types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Denrées alimentaires</SelectItem>
                    <SelectItem value="electronics">
                      Matériel électronique
                    </SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="construction">
                      Matériaux de construction
                    </SelectItem>
                    <SelectItem value="other">Autres</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-[#00c950]/10 text-[#00c950] gap-1">
                    <Utensils className="size-3" />
                    Denrées alimentaires
                    <X className="size-3" />
                  </Badge>
                  <Badge className="rounded-full bg-[#00c950]/10 text-[#00c950] gap-1">
                    <Cpu className="size-3" />
                    Électronique
                    <X className="size-3" />
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="license"
                  className="font-medium text-sm leading-5"
                >
                  Numéro d'immatriculation / licence d'importation
                </Label>
                <div className="relative">
                  <FileBadge className="top-1/2 size-4 -translate-y-1/2 text-[#71717b] absolute left-3" />
                  <Input
                    id="license"
                    placeholder="Ex. RCCM-GN-2024-XXXXXX"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm leading-5">
                  Zone de distribution en Guinée
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conakry">Conakry</SelectItem>
                    <SelectItem value="kindia">Kindia</SelectItem>
                    <SelectItem value="kankan">Kankan</SelectItem>
                    <SelectItem value="labe">Labé</SelectItem>
                    <SelectItem value="national">
                      Tout le territoire national
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm leading-5">
                  Document justificatif (licence commerciale)
                </Label>
                <div className="text-center rounded-xl bg-[#00c950]/5 border-[#00c950]/40 border-2 border-dashed flex p-6 flex-col justify-center items-center gap-2">
                  <div className="size-10 rounded-full bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <UploadCloud className="size-5" />
                  </div>
                  <p className="font-medium text-sm leading-5">
                    Téléverser votre document
                  </p>
                  <p className="text-[#71717b] text-xs leading-4">
                    PDF, JPG ou PNG · max 5 Mo
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-lg text-[#00c950] border-[#00c950] border-0 border-solid mt-1"
                  >
                    <Paperclip className="size-4" />
                    Choisir un fichier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex pb-4 flex-col gap-4">
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
