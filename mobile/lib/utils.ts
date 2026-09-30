import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 420000 -> "420 000 GNF" */
export function formatGNF(value: number, opts: { short?: boolean } = {}) {
  if (!Number.isFinite(value)) return "—";
  if (opts.short && value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)} M GNF`;
  }
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} GNF`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** "2026-08-01 14:00:00" -> "il y a 2 j" */
export function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function formatDate(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatTime(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/**
 * Unite de vente affichable : « unite » prend son accent, et l'unite passe au
 * pluriel au-dela de 1 (« 5 cagettes »), sauf les symboles comme « kg ».
 */
export function unitLabel(unit: string | null | undefined, quantity = 1) {
  if (!unit) return "";
  const word = unit === "unite" ? "unité" : unit;
  if (quantity <= 1 || word === "kg" || /[sxz]$/.test(word)) return word;
  return `${word}s`;
}
