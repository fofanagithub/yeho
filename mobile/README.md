# Yehoo — application mobile (Expo)

Application iOS / Android en React Native, avec
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

Pour l'essayer dans un navigateur : `npx expo start --web`.

Avant de considérer une modification comme terminée :

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

## Compte de démonstration

Mêmes comptes que la version web (voir [../README.md](../README.md)) :
téléphone `620 00 00 07`, mot de passe `motdepasse`.

En développement, l'écran de connexion propose un raccourci qui remplit ces
identifiants. Il n'apparaît **pas** dans une build de production (`__DEV__`).

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
  orders/                historique et suivi de commande (avec notation du vendeur)
  account/               comptes bloqués, suppression du compte
  legal/[doc].tsx        conditions d'utilisation (cgu) et confidentialité
  chat/, cart, checkout…  autres écrans plein écran
components/            ui/, layout/, ProductCard, PublishForm,
                       ModerationSheet (signaler / bloquer), ReviewCard
context/               Auth, Cart, Toast, Theme
lib/                   client API, types, constantes, legal.ts (textes CGU et
                       confidentialité), confirm.ts, image.ts, utils.ts
```

## Publication App Store

Configuration déjà en place dans `app.json` :

- `ios.bundleIdentifier` / `android.package` : `gn.yehoo.app`
- `ios.buildNumber` : `1` (à incrémenter à chaque envoi à Apple)
- `supportsTablet: false` — pas de captures d'écran iPad à fournir
- textes d'autorisation photos et appareil photo (plugin `expo-image-picker`), micro désactivé
- `ITSAppUsesNonExemptEncryption: false` — évite la question sur le chiffrement à chaque envoi

Exigences Apple couvertes par l'application :

- **Suppression de compte** (règle 5.1.1) : Profil → Supprimer mon compte.
- **Contenu des utilisateurs** (règle 1.2) : CGU acceptées à l'inscription,
  bouton « ⋯ » pour signaler ou bloquer (fiche produit, boutique, conversation),
  appui long sur un message, drapeau sur un avis, liste des comptes bloqués dans le profil.

Étapes, sans Mac, avec [EAS](https://docs.expo.dev/eas/) :

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform ios
npx eas-cli@latest submit --platform ios
```

Avant la première soumission :

1. Héberger l'API en **HTTPS** et renseigner `extra.apiUrl` dans `app.json`
   (iOS refuse le HTTP simple).
2. Remplacer `SUPPORT_EMAIL` dans `lib/legal.ts` par une vraie adresse.
3. Publier la politique de confidentialité à une adresse web (demandée par App Store Connect).
4. Tester via **TestFlight** sur un vrai iPhone (sélection de photo, clavier, mode sombre).
5. Dans les notes pour l'équipe de vérification d'Apple : fournir un compte de test,
   indiquer où se trouvent le signalement (« ⋯ ») et la suppression de compte (Profil).

## Notes techniques

- Le token de session est stocké via `AsyncStorage` (équivalent mobile de
  `localStorage`).
- Le thème clair/sombre/auto est piloté par NativeWind (`useColorScheme` de
  `nativewind`), avec persistance du choix dans `AsyncStorage`. Sur le web, la
  classe `dark` est posée sur `<html>` (`darkMode: "class"`).
- `tailwind.config.js` scanne aussi `lib/` et `context/` : les couleurs des
  catégories et des statuts de commande y sont déclarées.
- En React Native, la couleur de texte posée sur une `View` n'est **pas**
  héritée par le `Text` enfant : fond et texte sont donc des classes séparées
  (`color` / `text` dans `CATEGORIES`, `ORDER_STATUS_STYLE` / `ORDER_STATUS_TEXT`).
- Les icônes utilisent `lucide-react-native` avec une couleur explicite ;
  `lib/useIconColor.ts` donne une couleur lisible dans les deux thèmes.
- Les images Unsplash sont demandées à la bonne résolution pour l'écran
  (`lib/image.ts` multiplie la largeur par la densité de pixels).
- Confirmations destructives : `lib/confirm.ts` utilise `Alert.alert` sur
  téléphone et `window.confirm` sur le web (où `Alert.alert` ne fait rien).
- Publication d'annonces : la sélection de photo passe par
  `expo-image-picker` (galerie du téléphone).
- Fonctionne dans **Expo Go** tel quel : aucune des dépendances utilisées ne
  nécessite un build natif personnalisé (`expo prebuild` / dev client).
