import { PixelRatio } from "react-native";
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
    // `width` est en points : sur un ecran 3x (iPhone) il faut 3 fois plus de pixels,
    // sinon l'image est floue. Plafonne a 2000 px pour ne pas gaspiller de donnees.
    u.searchParams.set("w", String(Math.min(2000, Math.round(width * PixelRatio.get()))));
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
  pleinEcran: 800,
} as const;
