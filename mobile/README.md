# Yehoo — application mobile (Expo)

Portage complet des 21 écrans de l'application web en React Native, avec
[Expo Router](https://docs.expo.dev/router/introduction/) pour la navigation
et [NativeWind](https://www.nativewind.dev/) pour le style (classes Tailwind,
même palette de couleurs claire/sombre que le site).

Ce projet appelle le **même backend Express** que l'application web
(`../server`) — aucune API séparée, aucune donnée dupliquée.

## Démarrer

Dans un premier terminal, à la racine du dépôt, lancez l'API (si ce n'est pas
déjà fait) :

```bash
cd ..
npm run dev:api
```

Dans un second terminal, ici dans `mobile/` :

```bash
npm install
npx expo start
```

Un QR code s'affiche. Scannez-le avec l'app **Expo Go** (Android : depuis
l'app Expo Go elle-même ; iOS : depuis l'appareil photo) — **le téléphone et
l'ordinateur doivent être sur le même réseau Wi-Fi**.

L'app détecte automatiquement l'adresse IP de votre ordinateur (via Expo) et
s'en sert pour joindre l'API sur le port 4000. Aucune configuration manuelle
n'est nécessaire en développement.

## Compte de démonstration

Mêmes comptes que la version web (voir [../README.md](../README.md)) :
téléphone `620 00 00 07`, mot de passe `motdepasse`.

## Si le téléphone n'arrive pas à joindre l'API

- Vérifiez que le pare-feu Windows autorise Node.js sur les réseaux privés
  (une invite apparaît généralement au premier `npm run dev:api`).
- Vérifiez que le téléphone et l'ordinateur sont bien sur le **même réseau**
  (un point d'accès mobile ou un réseau "invité" isolé ne fonctionnera pas).
- En dernier recours, fixez l'URL manuellement dans `app.json` :
  `"extra": { "apiUrl": "http://<IP-DE-VOTRE-PC>:4000" }`.

## Structure

```
app/                  écrans, routage par fichiers (Expo Router)
  (tabs)/              accueil, recherche, publier, messages, profil
  product/[id].tsx      fiche produit
  seller/                boutique publique + espace vendeur
  orders/, chat/, ...     autres écrans plein écran
components/            composants UI (ui/, layout/, ProductCard, PublishForm)
context/               Auth, Cart, Toast, Theme (équivalents des contextes web)
lib/                   client API, types, constantes — portés de src/lib/
```

## Notes techniques

- Le token de session est stocké via `AsyncStorage` (équivalent mobile de
  `localStorage`).
- Le thème clair/sombre/auto est piloté par NativeWind (`useColorScheme` de
  `nativewind`), avec persistance du choix dans `AsyncStorage`.
- Les icônes utilisent `lucide-react-native` (même bibliothèque que le web),
  avec une couleur explicite par icône — React Native ne permet pas de
  colorer un SVG via une classe Tailwind sans configuration supplémentaire.
- Publication d'annonces : la sélection de photo passe par
  `expo-image-picker` (galerie du téléphone) au lieu d'un `<input type=file>`.
- Fonctionne dans **Expo Go** tel quel : aucune des dépendances utilisées ne
  nécessite un build natif personnalisé (`expo prebuild` / dev client).
