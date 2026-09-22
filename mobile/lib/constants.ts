import {
  Apple,
  Beer,
  Factory,
  HardHat,
  Pill,
  Shirt,
  ShoppingBag,
  Ship,
  Sprout,
  Store,
  User,
  Wheat,
  type LucideIcon,
} from "lucide-react-native";
import type { Role } from "./types";

export const ROLES: {
  value: Role;
  label: string;
  tagline: string;
  hint: string;
  icon: LucideIcon;
  seller: boolean;
}[] = [
  {
    value: "importateur",
    label: "Importateur",
    tagline: "Import de marchandises en gros",
    hint: "Écoulez vos stocks importés en gros.",
    icon: Ship,
    seller: true,
  },
  {
    value: "agriculteur",
    label: "Agriculteur",
    tagline: "Produits agricoles locaux",
    hint: "Vendez vos récoltes directement.",
    icon: Wheat,
    seller: true,
  },
  {
    value: "industriel",
    label: "Industriel",
    tagline: "Production et transformation",
    hint: "Distribuez votre production locale.",
    icon: Factory,
    seller: true,
  },
  {
    value: "detaillant",
    label: "Détaillant",
    tagline: "Revente au détail",
    hint: "Approvisionnez votre boutique.",
    icon: Store,
    seller: true,
  },
  {
    value: "particulier",
    label: "Particulier",
    tagline: "Achat pour ma consommation",
    hint: "Achetez au meilleur prix.",
    icon: ShoppingBag,
    seller: false,
  },
];

export const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.value, r])) as Record<
  Role,
  (typeof ROLES)[number]
>;

export const ROLE_ICONS: Record<Role, LucideIcon> = {
  importateur: Ship,
  agriculteur: Sprout,
  industriel: Factory,
  detaillant: Store,
  particulier: User,
};

export const CATEGORIES: { value: string; label: string; icon: LucideIcon; color: string }[] = [
  { value: "agriculture", label: "Agriculture", icon: Sprout, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { value: "alimentation", label: "Alimentation", icon: Apple, color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  { value: "boissons", label: "Boissons", icon: Beer, color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { value: "construction", label: "Construction", icon: HardHat, color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { value: "industriel", label: "Industriel", icon: Factory, color: "bg-subtle-strong text-fg-soft" },
  { value: "pharmacie", label: "Pharmacie", icon: Pill, color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  { value: "textile", label: "Textile", icon: Shirt, color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { value: "boutique", label: "Boutique", icon: Store, color: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

/** Les 8 régions administratives de Guinée. */
export const REGIONS = [
  "Conakry",
  "Boké",
  "Kindia",
  "Mamou",
  "Labé",
  "Faranah",
  "Kankan",
  "N'Zérékoré",
];

export const PREFECTURES: Record<string, string[]> = {
  Conakry: ["Kaloum", "Dixinn", "Matam", "Ratoma", "Matoto"],
  Boké: ["Boké", "Boffa", "Fria", "Gaoual", "Koundara"],
  Kindia: ["Kindia", "Coyah", "Dubréka", "Forécariah", "Télimélé"],
  Mamou: ["Mamou", "Dalaba", "Pita"],
  Labé: ["Labé", "Koubia", "Lélouma", "Mali", "Tougué"],
  Faranah: ["Faranah", "Dabola", "Dinguiraye", "Kissidougou"],
  Kankan: ["Kankan", "Kérouané", "Kouroussa", "Mandiana", "Siguiri"],
  "N'Zérékoré": ["N'Zérékoré", "Beyla", "Guéckédou", "Lola", "Macenta", "Yomou"],
};

export const UNITS = [
  { value: "sac", label: "Sac" },
  { value: "carton", label: "Carton" },
  { value: "pack", label: "Pack" },
  { value: "cagette", label: "Cagette" },
  { value: "cageot", label: "Cageot" },
  { value: "barre", label: "Barre" },
  { value: "tonne", label: "Tonne" },
  { value: "kg", label: "Kilogramme" },
  { value: "litre", label: "Litre" },
  { value: "lot", label: "Lot" },
  { value: "unite", label: "Unité" },
];

export const PAYMENT_METHODS = [
  { value: "orange_money", label: "Orange Money", hint: "Paiement mobile sécurisé" },
  { value: "mtn_momo", label: "MTN MoMo", hint: "Paiement mobile sécurisé" },
  { value: "especes", label: "Espèces à la livraison", hint: "Payez à réception du colis" },
  { value: "virement", label: "Virement bancaire", hint: "Pour les commandes importantes" },
];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  en_route: "En route",
  livree: "Livrée",
  annulee: "Annulée",
};

export const ORDER_STATUS_STYLE: Record<string, string> = {
  en_attente: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  confirmee: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  en_preparation: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  en_route: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  livree: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  annulee: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};
