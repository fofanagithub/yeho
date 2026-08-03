# SooniGN

Marketplace B2B guinéenne qui relie les vendeurs en gros — importateurs, agriculteurs, industriels —
aux détaillants et particuliers. Application mobile-first construite à partir des maquettes du dossier
`design/`, avec un vrai backend et une base de données.

## Prérequis

**Node 22.5 ou plus récent** (Node 24 recommandé, c'est la version fixée dans `.nvmrc`).

Le projet n'a **aucune dépendance native** : la base de données s'appuie sur `node:sqlite`,
le moteur SQLite intégré à Node. Pas de compilation, donc pas besoin de Visual Studio
Build Tools ni de node-gyp, et aucun risque de binaire précompilé manquant à chaque
nouvelle version de Node.

## Démarrage

```bash
npm install
npm run seed     # charge les données de démonstration
npm run dev      # API sur :4000 + interface sur :5173
```

Ouvrir http://localhost:5173

**Compte de démonstration** — téléphone `620 00 00 07`, mot de passe `motdepasse`
(détaillant, avec commandes et conversations déjà en place).

Autres comptes seedés, même mot de passe : `620000001` (importateur), `620000002` (agriculteur
coopérative), `620000003` (industriel), `620000005` (matériaux de construction).

Autres commandes :

```bash
npm run build    # typecheck + build de production dans dist/
npm run dev:api  # API seule
npm run seed     # réinitialise la base avec les données de démo
npm run test:api # scénario d'intégration complet sur une base de test isolée
```

`npm run test:api` démarre le serveur sur un port dédié avec sa propre base
(`server/data/test.db`) et déroule 36 vérifications : connexion, filtres du catalogue,
droits de publication, découpage du panier par vendeur, application des prix dégressifs
côté serveur, transitions de statut d'une commande, messagerie et statistiques.
Votre base de développement n'est pas touchée.

Après un `npm run build`, le serveur Express sert aussi le front : `node server/index.js` suffit,
tout est disponible sur http://localhost:4000

## Architecture

```
├── index.html
├── vite.config.ts          proxy /api et /uploads vers le serveur Express
├── server/                 API Node + Express + node:sqlite
│   ├── checkNode.js        garde-fou sur la version de Node
│   ├── db.js               schéma : users, products, price_tiers, orders,
│   │                       order_items, order_events, conversations, messages,
│   │                       favorites, reviews
│   ├── auth.js             JWT, middlewares requireAuth / requireSeller
│   ├── seed.js             18 produits, 7 comptes, commandes et conversations
│   └── routes/             auth, products, orders, messages, misc (favoris,
│                           vendeurs, stats, upload)
├── src/
│   ├── lib/                api.ts (client HTTP typé), types.ts, constants.ts, utils.ts
│   ├── context/            AuthContext, CartContext, ToastContext
│   ├── components/         ui/ (Button, Card, Field, Badge…), layout/, ProductCard
│   └── pages/              21 écrans, dont seller/ pour l'espace vendeur
└── design/                 les maquettes d'origine, laissées intactes
```

## Écrans

Portés depuis les maquettes : accueil onboarding, choix de profil, inscription
importateur / agriculteur / industriel / détaillant, profil, recherche, publication
d'annonce, messagerie, panier, livraison & validation, suivi de commande.

Ajoutés : fil d'accueil avec catégories et produits, fiche produit avec prix dégressifs,
connexion, conversation individuelle, boutique publique d'un vendeur, favoris, historique
des commandes, et un espace vendeur complet (tableau de bord chiffré, gestion des annonces,
traitement des commandes reçues).

## Ce que fait le backend

- **Comptes** : inscription par numéro guinéen (normalisé en `+224…`), mot de passe haché
  bcrypt, session JWT de 30 jours. Cinq profils, dont quatre autorisés à vendre.
- **Annonces** : recherche plein texte, filtres catégorie / région / prix, tris,
  compteur de vues, paliers de prix dégressifs, mise en pause, upload d'images.
- **Commandes** : le panier est regroupé par vendeur — une commande distincte est créée
  pour chacun. Le prix retenu est celui du palier correspondant à la quantité, recalculé
  côté serveur. Le stock est décrémenté et chaque changement de statut est historisé
  (reçue → confirmée → en préparation → en route → livrée).
- **Messagerie** : conversations liées ou non à un produit, compteur de non-lus,
  marquage automatique à la lecture.
- **Statistiques vendeur** : chiffre d'affaires, commandes à traiter, vues cumulées,
  évolution mensuelle.

## Notes techniques

- Le prix appliqué à une commande est toujours recalculé côté serveur à partir des paliers,
  jamais lu depuis le panier du client.
- Le panier vit dans le navigateur (localStorage) ; tout le reste est en base.
- Les images de démonstration pointent vers Unsplash. Les images envoyées via le formulaire
  de publication sont stockées dans `server/uploads/`.
- La base SQLite est créée automatiquement dans `server/data/sooni.db` au premier lancement.
  La variable `SOONI_DB` permet de pointer un autre fichier.
- `node:sqlite` est plus strict que les pilotes tiers sur la liaison des paramètres : il
  refuse `undefined`, les booléens, et les clés qui ne correspondent à aucun paramètre
  nommé de la requête. Passez des `null` et des entiers `0`/`1`.
- Pour la production, définir `JWT_SECRET` dans l'environnement.
