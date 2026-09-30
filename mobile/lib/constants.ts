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

/**
 * `color` (fond) et `text` (texte) sont separes : en React Native, la couleur
 * de texte posee sur une View n'est pas heritee par le Text enfant.
 * `hex` sert aux icones, qui prennent une couleur et non une classe.
 */
export const CATEGORIES: { value: string; label: string; icon: LucideIcon; color: string; text: string; hex: string }[] = [
  { value: "agriculture", label: "Agriculture", icon: Sprout, color: "bg-emerald-100 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", hex: "#10b981" },
  { value: "alimentation", label: "Alimentation", icon: Apple, color: "bg-orange-100 dark:bg-orange-500/15", text: "text-orange-700 dark:text-orange-300", hex: "#f97316" },
  { value: "boissons", label: "Boissons", icon: Beer, color: "bg-sky-100 dark:bg-sky-500/15", text: "text-sky-700 dark:text-sky-300", hex: "#0ea5e9" },
  { value: "construction", label: "Construction", icon: HardHat, color: "bg-amber-100 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-300", hex: "#f59e0b" },
  { value: "industriel", label: "Industriel", icon: Factory, color: "bg-slate-100 dark:bg-slate-500/15", text: "text-slate-700 dark:text-slate-300", hex: "#64748b" },
  { value: "pharmacie", label: "Pharmacie", icon: Pill, color: "bg-rose-100 dark:bg-rose-500/15", text: "text-rose-700 dark:text-rose-300", hex: "#f43f5e" },
  { value: "textile", label: "Textile", icon: Shirt, color: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-700 dark:text-violet-300", hex: "#8b5cf6" },
  { value: "boutique", label: "Boutique", icon: Store, color: "bg-lime-100 dark:bg-lime-500/15", text: "text-lime-700 dark:text-lime-300", hex: "#65a30d" },
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
  en_attente: "bg-amber-100 dark:bg-amber-500/15",
  confirmee: "bg-sky-100 dark:bg-sky-500/15",
  en_preparation: "bg-violet-100 dark:bg-violet-500/15",
  en_route: "bg-blue-100 dark:bg-blue-500/15",
  livree: "bg-emerald-100 dark:bg-emerald-500/15",
  annulee: "bg-rose-100 dark:bg-rose-500/15",
};

export const ORDER_STATUS_TEXT: Record<string, string> = {
  en_attente: "text-amber-700 dark:text-amber-300",
  confirmee: "text-sky-700 dark:text-sky-300",
  en_preparation: "text-violet-700 dark:text-violet-300",
  en_route: "text-blue-700 dark:text-blue-300",
  livree: "text-emerald-700 dark:text-emerald-300",
  annulee: "text-rose-700 dark:text-rose-300",
};
