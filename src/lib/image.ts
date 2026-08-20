/**
 * Dimensionnement des images.
 *
 * Les photos de demonstration viennent d'Unsplash, qui accepte des parametres
 * de redimensionnement dans l'URL. On demande donc exactement la taille utile
 * a l'ecran plutot que de telecharger une image de 1200 px pour l'afficher
 * dans une vignette de 160 px : sur un reseau mobile guineen, la difference
 * se compte en secondes.
 *
 * Les images televersees par les vendeurs (/uploads/...) sont renvoyees telles
 * quelles : aucun service de redimensionnement derriere.
 */

const REDIMENSIONNABLE = /(images\.unsplash\.com|source\.unsplash\.com)/;

/** URL de l'image a la largeur demandee (en pixels CSS). */
export function imageUrl(url: string | null | undefined, width: number): string {
  if (!url) return "";
  if (!REDIMENSIONNABLE.test(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("auto", "format"); // WebP quand le navigateur sait le lire
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", String(Math.round(width)));
    u.searchParams.set("q", "70");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * srcset a 1x et 2x : les telephones ont presque tous un ecran haute densite,
 * le navigateur choisit tout seul la version qui lui convient.
 */
export function imageSrcSet(url: string | null | undefined, width: number): string | undefined {
  if (!url || !REDIMENSIONNABLE.test(url)) return undefined;
  return `${imageUrl(url, width)} 1x, ${imageUrl(url, width * 2)} 2x`;
}

/** Largeurs de reference des emplacements d'image de l'application. */
export const TAILLES = {
  vignetteListe: 96, // miniature carree des listes
  carteGrille: 200, // carte produit en grille (2 colonnes)
  carteCarrousel: 176, // carte produit dans un carrousel horizontal
  ficheProduit: 440, // grande image de la fiche produit
  pleinEcran: 460, // photos plein ecran (le 2x du srcset couvre les ecrans denses)
} as const;
