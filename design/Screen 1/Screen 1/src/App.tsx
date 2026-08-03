import { useEffect } from "react";
import {
  ArrowRight,
  Factory,
  LogIn,
  MapPin,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Sprout,
  Store,
  UserPlus,
  Wheat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-white text-zinc-950 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="relative w-full overflow-hidden">
          <div className="relative w-full h-85">
            <div className="snap-x snap-mandatory overflow-x-auto flex w-full h-full">
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1687422809617-a7d97879b3b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFya2V0JTIwdmVuZG9ycyUyMGZyZXNoJTIwcHJvZHVjZSUyMGNvbG9yZnVsfGVufDF8MHx8fDE3ODM4ODMyOTZ8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Agriculture et produits frais"
                  className="object-cover w-full h-full"
                  data-photoid="XzgW_vYpm8M"
                  data-authorname="Ali Mkumbwa"
                  data-authorurl="https://unsplash.com/@mkumbwajr"
                  data-blurhash="LDBe~#E1bxI;0ftRVsozAHV@-nr="
                />
              </div>
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcmV0YWlsJTIwc2hvcCUyMHNtYWxsJTIwc3RvcmUlMjBib3V0aXF1ZXxlbnwxfDF8fHwxNzgzODg1MjQ3fDA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Boutiques et détaillants"
                  className="object-cover w-full h-full"
                  data-photoid="Q43GOm-D06k"
                  data-authorname="WyteShot"
                  data-authorurl="https://unsplash.com/@wyteshot"
                  data-blurhash="LLI3j+zT*J0K%L^4WA%1Bpn4xaw["
                />
              </div>
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1549964336-67d7d7d74ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwc2hlbHZlcyUyMHNob3B8ZW58MXwxfHx8MTc4Mzg4NTI0N3ww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Pharmacie et santé"
                  className="object-cover w-full h-full"
                  data-photoid="9i4DHlC80AQ"
                  data-authorname="Ula Kuźma"
                  data-authorurl="https://unsplash.com/@ula_kuzma"
                  data-blurhash="LoJRQ|xtIUWC.TWCVsjYM{RiofoM"
                />
              </div>
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1773394089934-3e29f2a3d6a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWdzJTIwY29uc3RydWN0aW9uJTIwbWF0ZXJpYWxzJTIwd2FyZWhvdXNlfGVufDF8MXx8fDE3ODM4ODUyNDd8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Ciment et matériaux de construction"
                  className="object-cover w-full h-full"
                  data-photoid="0p70_HczZek"
                  data-authorname="Khanh Do"
                  data-authorurl="https://unsplash.com/@donguyenkhanhs"
                  data-blurhash="LjIhW+0KWVxu_2E1R*xuE2f6Rjt7"
                />
              </div>
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1605732562742-3023a888e56e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGNvbnRhaW5lcnMlMjBwb3J0JTIwY2FyZ28lMjBpbXBvcnR8ZW58MXwxfHx8MTc4Mzg4NTI0N3ww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Importateurs et conteneurs"
                  className="object-cover w-full h-full"
                  data-photoid="sNY6B9NsPP8"
                  data-authorname="Aron Yigin"
                  data-authorurl="https://unsplash.com/@aronyigin"
                  data-blurhash="LPDQ_kS4xE$f1hS3W;SN0~xDS4Nx"
                />
              </div>
              <div className="relative shrink-0 snap-center w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZydWl0JTIwanVpY2UlMjBiZXZlcmFnZXMlMjBib3R0bGVzfGVufDF8MXx8fDE3ODM4ODUyNDd8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Jus et boissons"
                  className="object-cover w-full h-full"
                  data-photoid="A6c4cUoFrHg"
                  data-authorname="Jona Novak"
                  data-authorurl="https://unsplash.com/@jonanovak"
                  data-blurhash="LBPOIG#Q|[t7-S=^DlXSo$%1]}S2"
                />
              </div>
            </div>
            <div className="bg-[linear-gradient(to_bottom,oklch(0.30_0.09_150/0.55),oklch(0.30_0.09_150/0.85))] pointer-events-none absolute inset-0" />
            <div className="pointer-events-none flex absolute inset-0 p-8 flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="size-10 shadow-lg rounded-2xl bg-[#00c950] text-green-50 flex justify-center items-center">
                  <Sprout className="size-5" />
                </div>
                <span className="font-bold text-white text-lg leading-7 tracking-tight">
                  SooniGN
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className="backdrop-blur-sm rounded-full bg-white/20 text-white gap-1 w-fit">
                  <MapPin className="size-3" />
                  Guinée
                </Badge>
                <h1 className="leading-tight font-extrabold text-white text-2xl leading-8">
                  Connectez vendeurs et acheteurs en Guinée
                </h1>
                <div className="flex mt-2 items-center gap-2">
                  <span className="rounded-full bg-white w-6 h-1.5" />
                  <span className="size-1.5 rounded-full bg-white/50" />
                  <span className="size-1.5 rounded-full bg-white/50" />
                  <span className="size-1.5 rounded-full bg-white/50" />
                  <span className="size-1.5 rounded-full bg-white/50" />
                  <span className="size-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-8 flex-col gap-8">
          <p className="leading-relaxed text-[#71717b] text-sm leading-5" />
          <div className="flex flex-col gap-4">
            <Button className="shadow-md font-semibold rounded-xl bg-[#00c950] text-green-50 text-base leading-6 gap-2 w-full h-12">
              <UserPlus className="size-5" />
              Créer un compte
            </Button>
            <Button
              variant="outline"
              className="font-semibold rounded-xl text-[#00c950] text-base leading-6 border-[#00c950] border-2 border-solid gap-2 w-full h-12"
            >
              <LogIn className="size-5" />
              Se connecter
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-base leading-6">Qui êtes-vous ?</h2>
              <span className="font-medium text-[#71717b] text-xs leading-4 flex items-center gap-1">
                Faites glisser
                <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="overflow-x-auto flex -mx-8 px-8 pb-2 gap-4">
              <Card className="shrink-0 rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-2 w-40">
                <CardHeader className="p-0 gap-2">
                  <div className="size-10 rounded-xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <Ship className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-sm leading-5">
                    Importateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="leading-snug text-[#71717b] text-xs leading-4">
                    Écoulez vos stocks importés en gros.
                  </p>
                </CardContent>
              </Card>
              <Card className="shrink-0 rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-2 w-40">
                <CardHeader className="p-0 gap-2">
                  <div className="size-10 rounded-xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <Wheat className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-sm leading-5">
                    Agriculteur
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="leading-snug text-[#71717b] text-xs leading-4">
                    Vendez vos récoltes directement.
                  </p>
                </CardContent>
              </Card>
              <Card className="shrink-0 rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-2 w-40">
                <CardHeader className="p-0 gap-2">
                  <div className="size-10 rounded-xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <Factory className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-sm leading-5">
                    Industriel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="leading-snug text-[#71717b] text-xs leading-4">
                    Distribuez votre production locale.
                  </p>
                </CardContent>
              </Card>
              <Card className="shrink-0 rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-2 w-40">
                <CardHeader className="p-0 gap-2">
                  <div className="size-10 rounded-xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <Store className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-sm leading-5">
                    Détaillant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="leading-snug text-[#71717b] text-xs leading-4">
                    Approvisionnez votre boutique.
                  </p>
                </CardContent>
              </Card>
              <Card className="shrink-0 rounded-2xl border-zinc-200 border-0 border-solid p-4 gap-2 w-40">
                <CardHeader className="p-0 gap-2">
                  <div className="size-10 rounded-xl bg-[#00c950]/10 text-[#00c950] flex justify-center items-center">
                    <ShoppingBag className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-sm leading-5">
                    Particulier
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="leading-snug text-[#71717b] text-xs leading-4">
                    Achetez au meilleur prix.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center flex flex-col items-center gap-1">
              <span className="font-extrabold text-[#00c950] text-xl leading-7">
                2 500+
              </span>
              <span className="text-[#71717b] text-xs leading-4">Vendeurs</span>
            </div>
            <div className="border-x text-center border-zinc-200 border-0 border-solid flex flex-col items-center gap-1">
              <span className="font-extrabold text-[#00c950] text-xl leading-7">
                33
              </span>
              <span className="text-[#71717b] text-xs leading-4">
                Préfectures
              </span>
            </div>
            <div className="text-center flex flex-col items-center gap-1">
              <span className="font-extrabold text-[#00c950] text-xl leading-7">
                18k+
              </span>
              <span className="text-[#71717b] text-xs leading-4">
                Acheteurs
              </span>
            </div>
          </div>
          <Card className="rounded-2xl bg-[#00c950]/5 border-[#00c950]/20 border-0 border-solid p-6 gap-2">
            <CardContent className="flex p-0 items-start gap-4">
              <div className="size-10 shrink-0 rounded-full bg-[#00c950] text-green-50 flex justify-center items-center">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm leading-5">
                  Transactions sécurisées
                </span>
                <p className="leading-snug text-[#71717b] text-xs leading-4">
                  Paiements protégés, vendeurs vérifiés et livraisons suivies
                  partout en Guinée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
