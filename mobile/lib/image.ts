import { resolveImageUrl } from "./api";

/** Les photos de demo viennent d'Unsplash, qui accepte un redimensionnement par URL. */
const REDIMENSIONNABLE = /(images\.unsplash\.com|source\.unsplash\.com)/;

/** URL de l'image a la largeur demandee (en points), prefixee si relative (/uploads/...). */
export function imageUrl(url: string | null | undefined, width: number): string | undefined {
  const resolved = resolveImageUrl(url);
  if (!resolved) return undefined;
  if (!REDIMENSIONNABLE.test(resolved)) return resolved;
  try {
    const u = new URL(resolved);
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", String(Math.round(width)));
    u.searchParams.set("q", "70");
    return u.toString();
  } catch {
    return resolved;
  }
}

/** Largeurs de reference des emplacements d'image de l'application. */
export const TAILLES = {
  vignetteListe: 96,
  carteGrille: 200,
  carteCarrousel: 176,
  ficheProduit: 440,
  pleinEcran: 460,
} as const;
