import { useEffect } from "react";
import {
  Banknote,
  ChevronLeft,
  CircleCheck,
  ClipboardList,
  Handshake,
  House,
  Landmark,
  LocateFixed,
  MapPin,
  Navigation,
  Smartphone,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <div className="bg-white text-zinc-950 flex flex-col w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="border-zinc-200 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-6 pt-6 pb-4 flex-col gap-4">
          <div className="flex items-center gap-4">
            <button className="size-10 rounded-full bg-zinc-100 text-zinc-950 flex justify-center items-center">
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="leading-tight font-bold text-xl leading-7">{`Livraison & validation`}</h1>
              <span className="text-[#71717b] text-sm leading-5">
                Étape 2 sur 2
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="rounded-full bg-zinc-100 w-full h-2 overflow-hidden">
              <div className="rounded-full bg-[#00c950] w-full h-full" />
            </div>
            <span className="font-medium text-[#00c950] text-xs leading-4 self-end">
              100%
            </span>
          </div>
        </div>
        <div className="flex px-6 pt-6 pb-40 flex-col flex-1 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-[#00c950]" />
              <h2 className="font-semibold text-base leading-6">
                Lieu de livraison
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm leading-5">
                Région de Guinée
              </label>
              <Select defaultValue="conakry">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conakry">Conakry</SelectItem>
                  <SelectItem value="kindia">Kindia</SelectItem>
                  <SelectItem value="boke">Boké</SelectItem>
                  <SelectItem value="kankan">Kankan</SelectItem>
                  <SelectItem value="labe">Labé</SelectItem>
                  <SelectItem value="nzerekore">N'Zérékoré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm leading-5">
                Adresse précise / quartier
              </label>
              <div className="relative">
                <Input
                  placeholder="Ex : Madina, marché central"
                  className="pr-11"
                  defaultValue=""
                />
                <button className="top-1/2 -translate-y-1/2 size-8 rounded-lg bg-[#00c950]/10 text-[#00c950] flex absolute right-1 justify-center items-center">
                  <LocateFixed className="size-4" />
                </button>
              </div>
              <button className="font-medium text-[#00c950] text-xs leading-4 flex self-start items-center gap-1">
                <Navigation className="size-3" />
                Utiliser ma position actuelle
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-[#00c950]" />
              <h2 className="font-semibold text-base leading-6">
                Mode de livraison
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <button className="text-left rounded-2xl border-black/1 border-1 border-solid flex p-4 items-center gap-3">
                <div className="size-11 rounded-xl flex justify-center items-center">
                  <House className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-sm leading-5">
                    Livraison à domicile
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Délai estimé : 2 à 3 jours
                  </span>
                </div>
                <span className="font-semibold text-[#00c950] text-sm leading-5">
                  25 000 GNF
                </span>
              </button>
              <button className="text-left rounded-2xl border-black/1 border-1 border-solid flex p-4 items-center gap-3">
                <div className="size-11 rounded-xl flex justify-center items-center">
                  <Store className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-sm leading-5">
                    Retrait en boutique
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Disponible sous 24h
                  </span>
                </div>
                <span className="font-semibold text-[#00c950] text-sm leading-5">
                  Gratuit
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-[#00c950]" />
              <h2 className="font-semibold text-base leading-6">
                Récapitulatif de la commande
              </h2>
            </div>
            <Card className="p-4 gap-3">
              <CardContent className="flex p-0 flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-16 shrink-0 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1641357497181-94a7ce5a3d7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYmFnJTIwc2FjayUyMGdyYWlufGVufDF8Mnx8fDE3ODQzNzM5Nzl8MA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Riz parfumé"
                      className="object-cover w-full h-full"
                      data-photoid="2IyO73aMfs4"
                      data-authorname="Derek Phan"
                      data-authorurl="https://unsplash.com/@phanvuthanhtoan"
                      data-blurhash="LB4ho3Q-pIfjV[uPbbf,k=u4pdi_"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <span className="font-semibold text-sm leading-5">
                      Riz parfumé 25kg
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 5 sacs
                    </span>
                    <span className="inline-flex font-medium rounded-full bg-[#00c950]/10 text-[#00c950] text-[10px] px-2 py-0.5 self-start items-center gap-1">
                      <Handshake className="size-3" />
                      Prix négocié
                    </span>
                  </div>
                  <span className="font-bold text-sm leading-5">1 250 000</span>
                </div>
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex items-center gap-3">
                  <div className="size-16 shrink-0 rounded-xl overflow-hidden">
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
                  <div className="flex flex-col flex-1 gap-1">
                    <span className="font-semibold text-sm leading-5">
                      Mangues Kent
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 100 kg
                    </span>
                  </div>
                  <span className="font-bold text-sm leading-5">1 500 000</span>
                </div>
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex items-center gap-3">
                  <div className="size-16 shrink-0 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1543363364-24473603ecf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGp1aWNlJTIwYm90dGxlJTIwZHJpbmt8ZW58MXwyfHx8MTc4NDM3Mzk3OXww&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Jus mangue"
                      className="object-cover w-full h-full"
                      data-photoid="L16qQYtnfGE"
                      data-authorname="Dose Juice"
                      data-authorurl="https://unsplash.com/@dosejuice"
                      data-blurhash="LcJ%|1014;?bIU-pIVWB4:%LofD*"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-1">
                    <span className="font-semibold text-sm leading-5">
                      Jus mangue 1L
                    </span>
                    <span className="text-[#71717b] text-xs leading-4">
                      Quantité : 3 cartons
                    </span>
                    <span className="inline-flex font-medium rounded-full bg-[#00c950]/10 text-[#00c950] text-[10px] px-2 py-0.5 self-start items-center gap-1">
                      <Handshake className="size-3" />
                      Prix négocié
                    </span>
                  </div>
                  <span className="font-bold text-sm leading-5">330 000</span>
                </div>
              </CardContent>
              <CardFooter className="flex p-0 flex-col gap-2">
                <div className="bg-zinc-200 w-full h-px" />
                <div className="flex justify-between items-center w-full">
                  <span className="text-[#71717b] text-sm leading-5">
                    Sous-total
                  </span>
                  <span className="font-medium text-sm leading-5">
                    3 080 000 GNF
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[#71717b] text-sm leading-5">
                    Frais de livraison
                  </span>
                  <span className="font-medium text-sm leading-5">
                    25 000 GNF
                  </span>
                  <span className="font-medium text-[#00c950] text-sm leading-5 hidden">
                    Gratuit
                  </span>
                </div>
                <div className="flex pt-1 justify-between items-center w-full">
                  <span className="font-bold text-base leading-6">
                    Total général
                  </span>
                  <span className="font-bold text-[#00c950] text-lg leading-7">
                    3 105 000 GNF
                  </span>
                  <span className="font-bold text-[#00c950] text-lg leading-7 hidden">
                    3 080 000 GNF
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="size-5 text-[#00c950]" />
              <h2 className="font-semibold text-base leading-6">
                Mode de paiement
              </h2>
            </div>
            <RadioGroup className="flex flex-col gap-3" defaultValue="cod">
              <label className="rounded-2xl border-black/1 border-1 border-solid flex p-4 items-center gap-3">
                <div className="size-10 rounded-xl flex justify-center items-center">
                  <Banknote className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-sm leading-5">
                    Paiement à la livraison
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Payez en espèces à réception
                  </span>
                </div>
                <RadioGroupItem value="cod" />
              </label>
              <label className="rounded-2xl border-black/1 border-1 border-solid flex p-4 items-center gap-3">
                <div className="size-10 rounded-xl flex justify-center items-center">
                  <Smartphone className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-sm leading-5">
                    Mobile Money
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Orange Money · MTN Money
                  </span>
                </div>
                <RadioGroupItem value="momo" />
              </label>
              <label className="rounded-2xl border-black/1 border-1 border-solid flex p-4 items-center gap-3">
                <div className="size-10 rounded-xl flex justify-center items-center">
                  <Landmark className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                  <span className="font-semibold text-sm leading-5">
                    Virement bancaire
                  </span>
                  <span className="text-[#71717b] text-xs leading-4">
                    Transfert vers le vendeur
                  </span>
                </div>
                <RadioGroupItem value="virement" />
              </label>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm leading-5">
              Note pour le vendeur (optionnel)
            </label>
            <Textarea
              placeholder="Précisez une heure de livraison, un point de repère…"
              className="min-h-24 resize-none"
              defaultValue=""
            />
          </div>
        </div>
        <div className="fixed bg-white border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex inset-x-0 bottom-0 px-6 pt-4 pb-6 flex-col gap-2">
          <Button className="font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 w-full h-12">
            <CircleCheck className="size-5" />
            Confirmer la commande
          </Button>
          <p className="text-center text-[#71717b] text-[11px]">
            En confirmant, vous acceptez nos conditions d'utilisation et notre
            politique de livraison.
          </p>
        </div>
      </div>
    </div>
  );
}
