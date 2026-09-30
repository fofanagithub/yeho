/**
 * Textes des conditions d'utilisation et de la politique de confidentialite.
 *
 * A faire relire avant publication. La politique de confidentialite doit aussi
 * etre accessible a une adresse web publique : App Store Connect la demande.
 */

/** Adresse de contact affichee aux utilisateurs — a remplacer par une vraie boite surveillee. */
export const SUPPORT_EMAIL = "support@yehoo.gn";

export const LEGAL_UPDATED_AT = "30 septembre 2026";

export interface LegalSection {
  title: string;
  body: string;
}

export const TERMS: LegalSection[] = [
  {
    title: "1. Objet",
    body:
      "Yehoo met en relation des vendeurs en gros (importateurs, agriculteurs, industriels, détaillants) et des acheteurs en Guinée. " +
      "Yehoo n'est pas partie aux ventes conclues entre utilisateurs : chaque vendeur reste responsable de ses annonces, de ses prix et de ses livraisons.",
  },
  {
    title: "2. Compte",
    body:
      "Un numéro de téléphone correspond à un seul compte. Vous vous engagez à fournir des informations exactes et à garder votre mot de passe confidentiel. " +
      "Vous pouvez supprimer votre compte à tout moment depuis Profil → Supprimer mon compte.",
  },
  {
    title: "3. Tolérance zéro envers les contenus abusifs",
    body:
      "Sont strictement interdits : les arnaques et fausses annonces, les produits illégaux ou contrefaits, les contenus haineux, violents, " +
      "sexuels ou discriminatoires, le harcèlement, les menaces et le spam. " +
      "Tout contenu de ce type est retiré et son auteur peut être suspendu définitivement, sans préavis.",
  },
  {
    title: "4. Signaler et bloquer",
    body:
      "Chaque annonce, profil, avis et message peut être signalé via le bouton « ⋯ » ou par un appui long sur un message. " +
      "Notre équipe examine les signalements sous 24 heures. Une annonce signalée par plusieurs utilisateurs est masquée en attendant cet examen. " +
      "Vous pouvez aussi bloquer un utilisateur : vous ne verrez plus ses annonces et il ne pourra plus vous écrire.",
  },
  {
    title: "5. Annonces et commandes",
    body:
      "Les annonces doivent décrire fidèlement le produit, son prix, son unité et sa disponibilité. " +
      "Les paiements (Orange Money, MTN Mobile Money, espèces) se font directement entre acheteur et vendeur.",
  },
  {
    title: "6. Responsabilité",
    body:
      "Yehoo fait ses meilleurs efforts pour assurer la disponibilité du service mais ne garantit pas l'absence d'interruption. " +
      "En cas de litige entre utilisateurs, contactez-nous : nous vous aiderons à le résoudre sans nous substituer aux parties.",
  },
  {
    title: "7. Contact",
    body: `Pour toute question ou réclamation : ${SUPPORT_EMAIL}.`,
  },
];

export const PRIVACY: LegalSection[] = [
  {
    title: "Données collectées",
    body:
      "Nom, numéro de téléphone, mot de passe (stocké chiffré), profil professionnel (raison sociale, secteur, région, adresse, présentation), " +
      "email facultatif, photos que vous publiez, annonces, commandes, messages échangés dans l'application et signalements.",
  },
  {
    title: "Pourquoi",
    body:
      "Uniquement pour faire fonctionner le service : vous identifier, afficher vos annonces, transmettre vos commandes et messages à l'autre partie, " +
      "et assurer la modération. Nous ne vendons pas vos données et n'affichons pas de publicité ciblée.",
  },
  {
    title: "Qui les voit",
    body:
      "Votre profil vendeur et vos annonces sont publics. Vos coordonnées de livraison ne sont transmises qu'au vendeur de votre commande. " +
      "Vos messages ne sont visibles que par votre interlocuteur, et par l'équipe de modération lorsqu'un message est signalé.",
  },
  {
    title: "Durée de conservation",
    body:
      "Vos données sont conservées tant que votre compte existe. À la suppression du compte, votre profil, vos annonces, favoris, avis et conversations sont effacés. " +
      "Les commandes passées sont conservées sous un compte anonymisé, car elles font aussi partie de l'historique de l'autre partie.",
  },
  {
    title: "Vos droits",
    body: `Vous pouvez consulter et modifier votre profil dans l'application, et supprimer votre compte depuis Profil → Supprimer mon compte. Pour toute autre demande : ${SUPPORT_EMAIL}.`,
  },
];
