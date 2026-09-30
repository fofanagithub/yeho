# Yehoo

Marketplace B2B guinéenne qui relie les vendeurs en gros — importateurs, agriculteurs, industriels —
aux détaillants et particuliers. Application mobile-first construite à partir des maquettes du dossier
`design/`, avec un vrai backend et une base de données.

Le dépôt contient trois parties qui partagent la même API :

| Dossier   | Contenu                                                        |
|-----------|----------------------------------------------------------------|
| `server/` | API Node + Express + SQLite (`node:sqlite`)                    |
| `src/`    | application web React + Vite                                   |
| `mobile/` | application iOS / Android (Expo, React Native) — voir [mobile/README.md](mobile/README.md) |

## Prérequis

**Node 22.13 ou plus récent** (Node 24 recommandé, c'est la version fixée dans `.nvmrc`).
La version 22.13 est nécessaire pour les fonctions SQL écrites en JavaScript
(`DatabaseSync.function()`), utilisées par la recherche insensible aux accents.

Le projet n'a **aucune dépendance native** : la base de données s'appuie sur `node:sqlite`,
le moteur SQLite intégré à Node. Pas de compilation, donc pas besoin de Visual Studio
Build Tools ni de node-gyp, et aucun risque de binaire précompilé manquant à chaque
nouvelle version de Node.

## Démarrage

```bash
npm install
npm run seed     # charge les données de démonstration
npm run dev      # API sur :4000 + interface web sur :5173
```

Ouvrir http://localhost:5173

**Compte de démonstration** — téléphone `620 00 00 07`, mot de passe `motdepasse`
(détaillant, avec commandes et conversations déjà en place).

Autres comptes seedés, même mot de passe : `620000001` (importateur), `620000002` (agriculteur
coopérative), `620000003` (industriel), `620000005` (matériaux de construction).

Autres commandes :

```bash
npm run build    # typecheck + build de production dans dist/
npm run dev:api  # API seule, redémarre toute seule à chaque modification (node --watch)
npm run seed     # réinitialise la base avec les données de démo
npm run test:api # scénario d'intégration complet sur une base de test isolée
npm run lint     # ESLint
```

`npm run test:api` démarre le serveur sur un port dédié avec sa propre base
(`server/data/test.db`) et déroule **91 vérifications** : connexion et inscription, filtres
et recherche du catalogue, droits de publication, validation des annonces et des paliers,
découpage du panier par vendeur, prix dégressifs recalculés côté serveur, contrôle du stock,
transitions de statut d'une commande, messagerie, avis, statistiques, modération
(signalements, blocage, suspension) et suppression de compte.
Votre base de développement n'est pas touchée.

Après un `npm run build`, le serveur Express sert aussi le front web : `node server/index.js` suffit,
tout est disponible sur http://localhost:4000

## Configuration

Copier `.env.example` en `.env` et ajuster :

| Variable       | Rôle                                                                              |
|----------------|-----------------------------------------------------------------------------------|
| `JWT_SECRET`   | **Obligatoire en production** — secret de signature des sessions                  |
| `PORT`         | Port de l'API (4000 par défaut)                                                    |
| `YEHOO_DB`     | Chemin du fichier SQLite (`server/data/yehoo.db` par défaut)                       |
| `CORS_ORIGIN`  | Origines autorisées, séparées par des virgules (toutes si vide)                     |
| `ADMIN_PHONES` | Numéros des modérateurs (`+224XXXXXXXXX`, séparés par des virgules)                 |

## Ce que fait le backend

- **Comptes** : inscription par numéro guinéen (normalisé en `+224…`), acceptation des CGU
  obligatoire, mot de passe haché bcrypt, session JWT de 30 jours. Cinq profils, dont quatre
  autorisés à vendre. Le hash du mot de passe n'est jamais renvoyé au client.
- **Annonces** : recherche insensible à la casse et aux accents (« pates » trouve « Pâtes »),
  filtres catégorie / région / prix, tris, compteur de vues (hors visites du vendeur),
  paliers de prix dégressifs modifiables, mise en pause, upload d'images. Prix, stock,
  minimum de commande et paliers sont validés côté serveur.
- **Commandes** : le panier est regroupé par vendeur — une commande distincte est créée
  pour chacun. Le serveur recalcule le prix au palier, fixe lui-même les frais de livraison
  (150 000 GNF par vendeur) et refuse une commande au-delà du stock, sur une annonce
  indisponible ou sur son propre produit. Le stock est décrémenté à la commande et rendu
  en cas d'annulation.
- **Suivi de commande** : reçue → confirmée → en préparation → en route → livrée, une étape
  à la fois, chaque changement historisé. L'acheteur peut annuler tant que le vendeur n'a
  pas confirmé et confirmer la réception une fois le colis en route ; le vendeur peut refuser
  ou annuler jusqu'à l'expédition. Une commande livrée ou annulée est figée.
- **Avis** : un acheteur peut noter un vendeur (1 à 5 étoiles) après avoir reçu au moins une
  commande de lui ; un seul avis par vendeur, modifiable. Les avis masqués par la modération
  ne comptent pas dans la note moyenne.
- **Messagerie** : conversations liées ou non à un produit, compteur de non-lus,
  marquage automatique à la lecture.
- **Statistiques vendeur** : chiffre d'affaires, commandes à traiter, vues cumulées,
  évolution mensuelle (hors commandes annulées).

## Modération et suppression de compte

Exigences App Store 1.2 (contenu publié par les utilisateurs) et 5.1.1(v) (suppression de compte) :

- **CGU acceptées à l'inscription** (`accept_terms` obligatoire), avec une clause de tolérance zéro.
- **Signaler** une annonce, un profil, un avis ou un message (bouton « ⋯ », appui long sur un message).
  Une annonce ou un avis signalé par 3 personnes différentes est masqué automatiquement en attendant
  l'examen ; le vendeur voit un badge « Masquée après signalements » dans ses annonces.
- **Bloquer** un utilisateur : ses annonces et conversations disparaissent, il ne peut plus écrire
  ni être commandé.
- **Modérateurs** : les numéros listés dans `ADMIN_PHONES` accèdent à `GET /api/admin/reports` puis
  `POST /api/admin/reports/:id` avec `{ "action": "rejeter" | "retirer" | "bannir" }`.
  Il n'y a pas encore d'écran de modération : ces appels se font avec curl ou Postman.
- **Suppression de compte** (`DELETE /api/auth/me`, mot de passe requis) : profil, annonces et photos,
  favoris, avis et conversations effacés ; les commandes en cours sont annulées, les commandes
  terminées restent chez l'autre partie sous un compte anonymisé ; le numéro est libéré.

## Architecture

```
├── index.html
├── vite.config.ts          proxy /api et /uploads vers le serveur Express
├── .env.example            variables d'environnement documentées
├── server/                 API Node + Express + node:sqlite
│   ├── checkNode.js        garde-fou sur la version de Node
│   ├── db.js               schéma (users, products, price_tiers, orders, order_items,
│   │                       order_events, conversations, messages, favorites, reviews,
│   │                       reports, blocks), migrations de colonnes, fonction sans_accent()
│   ├── auth.js             JWT, requireAuth / requireSeller / requireAdmin, blocages
│   ├── ratings.js          recalcul de la note moyenne d'un vendeur
│   ├── seed.js             18 produits, 7 comptes, commandes et conversations
│   ├── test-api.mjs        test d'intégration (91 vérifications)
│   └── routes/             auth, products, orders, messages, misc (favoris, vendeurs,
│                           avis, stats, upload), moderation (signalements, blocages,
│                           file des modérateurs)
├── src/                    application web
│   ├── lib/                api.ts (client HTTP typé), types.ts, constants.ts, utils.ts
│   ├── context/            AuthContext, CartContext, ToastContext
│   ├── components/         ui/ (Button, Card, Field, Badge…), layout/, ProductCard
│   └── pages/              21 écrans, dont seller/ pour l'espace vendeur
├── mobile/                 application Expo (iOS / Android)
└── design/                 les maquettes d'origine, laissées intactes
```

## Écrans

Portés depuis les maquettes : accueil onboarding, choix de profil, inscription
importateur / agriculteur / industriel / détaillant, profil, recherche, publication
d'annonce, messagerie, panier, livraison & validation, suivi de commande.

Ajoutés : fil d'accueil avec catégories et produits, fiche produit avec prix dégressifs,
connexion, conversation individuelle, boutique publique d'un vendeur, favoris, historique
des commandes, espace vendeur complet (tableau de bord chiffré, gestion des annonces,
traitement des commandes reçues).

L'application mobile ajoute : notation du vendeur après livraison, signalement et blocage,
comptes bloqués, conditions d'utilisation, politique de confidentialité et suppression de compte.

## Publication sur l'App Store

Déjà en place : suppression de compte, modération (CGU, signalement, blocage), identifiant
`gn.yehoo.app`, textes d'autorisation photos / appareil photo, pas d'achat intégré requis
(biens physiques). Détails et étapes dans [mobile/README.md](mobile/README.md#publication-app-store).

Reste à faire avant de soumettre :

- [ ] Héberger l'API en **HTTPS** et renseigner son adresse dans `mobile/app.json` (`extra.apiUrl`)
- [ ] Remplacer l'adresse de contact provisoire (`SUPPORT_EMAIL` dans `mobile/lib/legal.ts`)
- [ ] Faire relire les CGU et la politique de confidentialité, et publier cette dernière à une adresse web
- [ ] Définir `JWT_SECRET` et `ADMIN_PHONES` sur le serveur de production

## Pistes d'amélioration

- **Mot de passe oublié** : il n'existe pas encore ; il faut un envoi de code par SMS
  (par exemple via Supabase Auth).
- **Notifications push** : le vendeur n'est pas prévenu d'une nouvelle commande ou d'un message
  tant qu'il n'ouvre pas l'application.
- **Écran de modération** dans l'application pour les comptes `ADMIN_PHONES`.
- **Téléphone des vendeurs** : l'API ne le publie pas ; le bouton « Appeler » de la boutique
  publique est donc masqué.
- **Migration vers Supabase** (Postgres + Storage) pour l'hébergement.

## Notes techniques

- Le prix appliqué à une commande est toujours recalculé côté serveur à partir des paliers,
  jamais lu depuis le panier du client ; il en va de même pour les frais de livraison.
- Le panier vit sur l'appareil (localStorage sur le web, AsyncStorage sur mobile) ; tout le
  reste est en base.
- Les images de démonstration pointent vers Unsplash. Les images envoyées via le formulaire
  de publication sont stockées dans `server/uploads/`.
- La base SQLite est créée automatiquement dans `server/data/yehoo.db` au premier lancement.
  Les colonnes ajoutées après coup sont créées au démarrage si elles manquent : une base
  existante n'a pas besoin d'être réinitialisée.
- La recherche passe par la fonction SQL `sans_accent()`, enregistrée en JavaScript dans `db.js`.
- `node:sqlite` est plus strict que les pilotes tiers sur la liaison des paramètres : il
  refuse `undefined`, les booléens, et les clés qui ne correspondent à aucun paramètre
  nommé de la requête. Passez des `null` et des entiers `0`/`1`.
