/**
 * Test d'integration de l'API.
 *
 *   npm run test:api
 *
 * Charge un jeu de donnees dans une base de test separee (server/data/test.db),
 * demarre le serveur sur un port dedie, puis deroule un scenario complet :
 * connexion, catalogue, publication, commande avec prix degressif, messagerie,
 * favoris et statistiques. La base de developpement n'est jamais touchee.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, "data", "test.db");
const PORT = 4100;
const BASE = `http://localhost:${PORT}`;
const env = { ...process.env, YEHOO_DB: TEST_DB, PORT: String(PORT), ADMIN_PHONES: "+224620000003" };

let failures = 0;
const ok = (label, condition, detail = "") => {
  if (condition) {
    console.log(`  OK     ${label}`);
  } else {
    failures++;
    console.log(`  ECHEC  ${label}${detail ? "  <<< " + detail : ""}`);
  }
};

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", script], {
      env,
      stdio: "ignore",
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} a echoue`))));
    child.on("error", reject);
  });
}

async function waitForServer(timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      /* le serveur n'ecoute pas encore */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Le serveur n'a pas demarre a temps");
}

async function call(method, url, { body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : {} };
}

// Base de test repartie de zero a chaque execution
for (const suffix of ["", "-wal", "-shm"]) {
  fs.rmSync(TEST_DB + suffix, { force: true });
}
await run(path.join(__dirname, "seed.js"));

const server = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", path.join(__dirname, "index.js")], {
  env,
  stdio: "ignore",
});

try {
  await waitForServer();

  console.log("\n--- Authentification ---");
  let r = await call("POST", "/api/auth/login", { body: { phone: "620000007", password: "motdepasse" } });
  ok("connexion du compte de demonstration", r.status === 200 && !!r.body.token, JSON.stringify(r.body));
  const buyer = r.body.token;

  r = await call("POST", "/api/auth/login", { body: { phone: "620000007", password: "faux" } });
  ok("mot de passe errone refuse", r.status === 401);

  r = await call("POST", "/api/auth/login", { body: { phone: "620000001", password: "motdepasse" } });
  const seller = r.body.token;
  ok("connexion du vendeur importateur", !!seller);

  r = await call("POST", "/api/auth/register", {
    body: { accept_terms: true, phone: "620000007", password: "azerty12", name: "X", role: "detaillant" },
  });
  ok("numero deja utilise refuse", r.status === 409);

  r = await call("POST", "/api/auth/register", {
    body: { accept_terms: true, phone: "624 11 22 33", password: "azerty12", name: "Kadiatou Sow", role: "particulier", region: "Kankan" },
  });
  ok("inscription et normalisation du numero", r.status === 201 && r.body.user?.phone === "+224624112233", r.body.user?.phone);
  const kadiatou = r.body.token;
  ok("le hash du mot de passe n'est jamais renvoye", r.body.user && !("password_hash" in r.body.user));
  r = await call("POST", "/api/auth/register", {
    body: { phone: "625 99 88 77", password: "azerty12", name: "Sans CGU", role: "particulier" },
  });
  ok("inscription refusee sans acceptation des CGU", r.status === 400);

  r = await call("GET", "/api/auth/me", { token: buyer });
  ok("jeton valide renvoie le profil", r.body.user?.name === "Mamadou Barry");
  r = await call("GET", "/api/auth/me");
  ok("acces sans jeton refuse", r.status === 401);

  console.log("\n--- Unicite du numero ---");
  r = await call("GET", "/api/auth/check-phone?phone=620000007");
  ok("numero deja pris signale avant validation", r.body.valid === true && r.body.available === false);
  r = await call("GET", "/api/auth/check-phone?phone=%2B224620000007");
  ok("meme numero au format +224 aussi detecte", r.body.available === false);
  r = await call("GET", "/api/auth/check-phone?phone=0620000007");
  ok("meme numero avec un zero devant aussi detecte", r.body.available === false);
  r = await call("GET", "/api/auth/check-phone?phone=622334455");
  ok("numero libre annonce disponible", r.body.valid === true && r.body.available === true);
  r = await call("GET", "/api/auth/check-phone?phone=6200");
  ok("numero incomplet signale invalide", r.body.valid === false);
  r = await call("POST", "/api/auth/register", {
    body: { accept_terms: true, phone: "6200", password: "azerty12", name: "Trop court", role: "particulier" },
  });
  ok("inscription avec numero invalide refusee", r.status === 400);

  // L'inscription ouvre la session : le jeton renvoye doit donner acces tout de suite.
  r = await call("POST", "/api/auth/register", {
    body: { accept_terms: true, phone: "623 11 22 33", password: "azerty12", name: "Aissatou Diallo", role: "agriculteur", region: "Labé" },
  });
  const nouveauJeton = r.body.token;
  ok("inscription renvoie un jeton de session", r.status === 201 && !!nouveauJeton);
  r = await call("GET", "/api/auth/me", { token: nouveauJeton });
  ok("acces a l'application juste apres l'inscription", r.status === 200 && r.body.user?.name === "Aissatou Diallo");
  r = await call("POST", "/api/products", {
    token: nouveauJeton,
    body: { title: "Premiere annonce", category: "agriculture", price: 50000 },
  });
  ok("le nouveau vendeur peut publier immediatement", r.status === 201);
  // On retire cette annonce pour que le catalogue retrouve son compte de reference.
  if (r.body.product?.id) await call("DELETE", `/api/products/${r.body.product.id}`, { token: nouveauJeton });

  console.log("\n--- Catalogue ---");
  r = await call("GET", "/api/products");
  ok("liste des annonces actives", r.body.products.length === 18, String(r.body.products.length));
  r = await call("GET", "/api/products?q=riz");
  ok("recherche plein texte", r.body.products.length >= 1);
  r = await call("GET", "/api/products?category=construction");
  ok("filtre par categorie", r.body.products.every((p) => p.category === "construction"));
  r = await call("GET", "/api/products?sort=prix_croissant");
  const prices = r.body.products.map((p) => p.price);
  ok("tri par prix croissant", [...prices].sort((a, b) => a - b).join() === prices.join());
  r = await call("GET", "/api/products/1");
  ok("fiche produit avec paliers degressifs", r.body.product?.tiers.length === 3);
  ok("suggestions de produits similaires", r.body.similar.length > 0);

  console.log("\n--- Publication ---");
  r = await call("POST", "/api/products", {
    token: buyer,
    body: { title: "Annonce de test", category: "boutique", price: 1000 },
  });
  ok("un compte vendeur peut publier", r.status === 201, JSON.stringify(r.body));
  const createdId = r.body.product?.id;
  r = await call("PATCH", "/api/products/1", { token: buyer, body: { price: 1 } });
  ok("modification de l'annonce d'autrui refusee", r.status === 403);
  r = await call("DELETE", `/api/products/${createdId}`, { token: buyer });
  ok("suppression de sa propre annonce", r.status === 200);

  console.log("\n--- Commandes ---");
  r = await call("POST", "/api/orders", {
    token: buyer,
    body: {
      items: [
        { product_id: 1, quantity: 120 },
        { product_id: 11, quantity: 60 },
      ],
      address: "Marche de Matoto",
      region: "Conakry",
      delivery_fee: 150000,
    },
  });
  ok("panier multi-vendeurs scinde en deux commandes", r.status === 201 && r.body.orders?.length === 2);
  const order = r.body.orders?.[0];
  ok("palier degressif applique cote serveur", order?.items[0].unit_price === 405000, String(order?.items[0]?.unit_price));
  ok("total = sous-total + livraison", order?.total === order?.subtotal + order?.delivery_fee);
  ok("premier evenement de suivi enregistre", order?.events.length === 1);

  r = await call("POST", "/api/orders", {
    token: buyer,
    body: { items: [{ product_id: 1, quantity: 2 }], address: "x", region: "Conakry" },
  });
  ok("commande sous la quantite minimum refusee", r.status === 400);

  r = await call("PATCH", `/api/orders/${order.id}/status`, { token: buyer, body: { status: "en_route" } });
  ok("l'acheteur ne peut pas expedier", r.status === 403);
  r = await call("PATCH", `/api/orders/${order.id}/status`, { token: seller, body: { status: "confirmee" } });
  ok("le vendeur confirme la commande", r.body.order?.status === "confirmee");
  r = await call("PATCH", `/api/orders/${order.id}/status`, { token: buyer, body: { status: "annulee" } });
  ok("annulation apres confirmation refusee", r.status === 400);

  r = await call("GET", "/api/orders", { token: buyer });
  ok("historique cote acheteur", r.body.orders.length >= 3);
  r = await call("GET", "/api/orders/received", { token: seller });
  ok("commandes recues cote vendeur", r.body.orders.length >= 1);

  console.log("\n--- Messagerie ---");
  r = await call("GET", "/api/conversations", { token: buyer });
  ok("liste des conversations", r.body.conversations.length === 3, String(r.body.conversations.length));
  ok("compteur de messages non lus", r.body.conversations.reduce((n, c) => n + c.unread, 0) > 0);
  const convId = r.body.conversations[0].id;
  r = await call("POST", `/api/conversations/${convId}/messages`, { token: buyer, body: { body: "Bonjour" } });
  ok("envoi d'un message", r.status === 201);
  r = await call("GET", `/api/conversations/${convId}/messages`, { token: buyer });
  ok("la lecture remet le compteur a zero", r.body.conversation.unread === 0);
  r = await call("POST", "/api/conversations", { token: buyer, body: { seller_id: 2, product_id: 4 } });
  ok("conversation existante reutilisee", r.body.conversation.id === 3);

  console.log("\n--- Favoris et statistiques ---");
  r = await call("POST", "/api/favorites/5", { token: buyer });
  ok("ajout aux favoris", r.body.is_favorite === true);
  r = await call("GET", "/api/favorites", { token: buyer });
  ok("liste des favoris", r.body.products.length === 3, String(r.body.products.length));
  r = await call("DELETE", "/api/favorites/5", { token: buyer });
  ok("retrait des favoris", r.body.is_favorite === false);
  r = await call("GET", "/api/stats", { token: seller });
  ok("statistiques vendeur", r.body.stats.listings === 4 && r.body.stats.pending >= 1, JSON.stringify(r.body.stats));
  r = await call("GET", "/api/sellers/3");
  ok("boutique publique d'un vendeur", r.body.seller?.company === "Industries Kania SA" && r.body.products.length === 4);

  console.log("\n--- Moderation : signalements ---");
  r = await call("POST", "/api/auth/login", { body: { phone: "620000003", password: "motdepasse" } });
  const admin = r.body.token;
  r = await call("GET", "/api/products?seller=1");
  const cible = r.body.products[0].id;
  r = await call("POST", "/api/reports", { token: seller, body: { target_type: "product", target_id: cible, reason: "spam" } });
  ok("on ne peut pas signaler sa propre annonce", r.status === 400);
  r = await call("POST", "/api/reports", { token: buyer, body: { target_type: "product", target_id: cible, reason: "inconnu" } });
  ok("motif de signalement obligatoire", r.status === 400);
  for (const t of [buyer, kadiatou]) {
    r = await call("POST", "/api/reports", { token: t, body: { target_type: "product", target_id: cible, reason: "trompeur" } });
  }
  ok("signalement enregistre", r.status === 201);
  r = await call("GET", `/api/products/${cible}`);
  ok("annonce encore visible sous le seuil", r.status === 200);
  r = await call("POST", "/api/reports", { token: nouveauJeton, body: { target_type: "product", target_id: cible, reason: "arnaque" } });
  r = await call("GET", `/api/products/${cible}`);
  ok("annonce masquee automatiquement apres 3 signalements", r.status === 404);
  r = await call("GET", `/api/products/${cible}`, { token: seller });
  ok("le vendeur voit toujours son annonce masquee", r.status === 200);
  r = await call("GET", "/api/admin/reports", { token: buyer });
  ok("file de moderation reservee aux moderateurs", r.status === 403);
  r = await call("GET", "/api/admin/reports", { token: admin });
  ok("le moderateur voit les signalements", r.body.reports?.length === 3, String(r.body.reports?.length));
  r = await call("POST", `/api/admin/reports/${r.body.reports[0].id}`, { token: admin, body: { action: "rejeter" } });
  r = await call("GET", `/api/products/${cible}`);
  ok("signalement rejete : l'annonce redevient visible", r.status === 200);
  r = await call("GET", "/api/admin/reports", { token: admin });
  ok("tous les signalements du contenu sont clos ensemble", r.body.reports.length === 0);

  console.log("\n--- Moderation : blocage ---");
  r = await call("POST", "/api/conversations", { token: buyer, body: { seller_id: 1, body: "Bonjour" } });
  const convBloquee = r.body.conversation.id;
  r = await call("POST", "/api/blocks/1", { token: buyer });
  ok("blocage d'un utilisateur", r.body.blocked === true);
  r = await call("GET", "/api/products?seller=1", { token: buyer });
  ok("les annonces de l'utilisateur bloque disparaissent", r.body.products.length === 0);
  r = await call("GET", "/api/conversations", { token: buyer });
  ok("la conversation disparait de la messagerie", !r.body.conversations.some((c) => c.id === convBloquee));
  r = await call("POST", `/api/conversations/${convBloquee}/messages`, { token: seller, body: { body: "Relance" } });
  ok("l'utilisateur bloque ne peut plus ecrire", r.status === 403);
  r = await call("GET", "/api/blocks", { token: buyer });
  ok("liste des utilisateurs bloques", r.body.users.length === 1 && r.body.users[0].id === 1);
  r = await call("DELETE", "/api/blocks/1", { token: buyer });
  r = await call("GET", "/api/products?seller=1", { token: buyer });
  ok("deblocage : les annonces reviennent", r.body.products.length > 0);

  console.log("\n--- Moderation : suspension ---");
  r = await call("GET", "/api/auth/me", { token: nouveauJeton });
  const aissatouId = r.body.user.id;
  r = await call("POST", "/api/reports", { token: buyer, body: { target_type: "user", target_id: aissatouId, reason: "harcelement" } });
  r = await call("GET", "/api/admin/reports", { token: admin });
  const rapport = r.body.reports.find((x) => x.target_type === "user");
  r = await call("POST", `/api/admin/reports/${rapport.id}`, { token: admin, body: { action: "bannir" } });
  r = await call("GET", "/api/auth/me", { token: nouveauJeton });
  ok("compte suspendu : session coupee", r.status === 403);
  r = await call("POST", "/api/auth/login", { body: { phone: "623112233", password: "azerty12" } });
  ok("compte suspendu : connexion refusee", r.status === 403);

  console.log("\n--- Suppression de compte ---");
  r = await call("DELETE", "/api/auth/me", { token: kadiatou, body: { password: "faux" } });
  ok("mot de passe exige pour supprimer le compte", r.status === 401);
  r = await call("DELETE", "/api/auth/me", { token: kadiatou, body: { password: "azerty12" } });
  ok("suppression du compte", r.status === 200);
  r = await call("GET", "/api/auth/me", { token: kadiatou });
  ok("l'ancien jeton ne fonctionne plus", r.status === 401);
  r = await call("POST", "/api/auth/login", { body: { phone: "624112233", password: "azerty12" } });
  ok("connexion impossible apres suppression", r.status === 401);
  r = await call("GET", "/api/auth/check-phone?phone=624112233");
  ok("le numero est libere", r.body.available === true);

  console.log("\n--- Commandes : garde-fous ---");
  r = await call("GET", "/api/products?seller=1");
  const p = r.body.products.find((x) => x.stock >= x.min_order * 2);
  const stockAvant = p.stock;
  const commande = (token, quantity, extra = {}) =>
    call("POST", "/api/orders", {
      token,
      body: { items: [{ product_id: p.id, quantity }], address: "Madina", payment_method: "especes", ...extra },
    });
  r = await commande(buyer, stockAvant + 1);
  ok("commande au-dela du stock refusee", r.status === 400, r.body.error);
  r = await commande(seller, p.min_order);
  ok("un vendeur ne commande pas son propre produit", r.status === 400);
  r = await commande(buyer, p.min_order, { delivery_fee: -999999999 });
  ok("frais de livraison fixes cote serveur", r.status === 201 && r.body.orders[0].delivery_fee === 150000);
  const cmd = r.body.orders[0];
  r = await call("GET", `/api/products/${p.id}`);
  ok("le stock diminue a la commande", r.body.product.stock === stockAvant - p.min_order);
  r = await call("PATCH", `/api/orders/${cmd.id}/status`, { token: seller, body: { status: "livree" } });
  ok("le vendeur ne saute pas d'etape", r.status === 400);
  r = await call("PATCH", `/api/orders/${cmd.id}/status`, { token: buyer, body: { status: "livree" } });
  ok("l'acheteur ne confirme pas une reception avant l'expedition", r.status === 403);
  r = await call("PATCH", `/api/orders/${cmd.id}/status`, { token: seller, body: { status: "annulee" } });
  ok("le vendeur peut refuser une commande", r.status === 200 && r.body.order.status === "annulee");
  r = await call("GET", `/api/products/${p.id}`);
  ok("l'annulation rend le stock", r.body.product.stock === stockAvant);
  r = await call("PATCH", `/api/orders/${cmd.id}/status`, { token: seller, body: { status: "confirmee" } });
  ok("une commande annulee ne repart pas", r.status === 400);
  r = await call("PATCH", `/api/products/${p.id}`, { token: seller, body: { status: "paused" } });
  r = await commande(buyer, p.min_order);
  ok("annonce en pause non commandable", r.status === 400);
  await call("PATCH", `/api/products/${p.id}`, { token: seller, body: { status: "active" } });
  r = await call("PATCH", `/api/products/${p.id}`, { token: seller, body: { status: "n'importe quoi" } });
  ok("statut d'annonce inconnu refuse", r.status === 400);

  console.log("\n--- Annonces : validation et paliers ---");
  r = await call("POST", "/api/products", { token: seller, body: { title: "Test", category: "boutique", price: -5 } });
  ok("prix negatif refuse", r.status === 400);
  r = await call("PATCH", `/api/products/${p.id}`, {
    token: seller,
    body: { tiers: [{ min_qty: 500, price: p.price - 1000 }, { min_qty: 900, price: p.price - 2000 }] },
  });
  ok("les paliers sont enregistres en modification", r.body.product?.tiers.length === 2);
  r = await call("PATCH", `/api/products/${p.id}`, { token: seller, body: { tiers: [{ min_qty: 50, price: p.price + 1 }] } });
  ok("palier plus cher que le prix refuse", r.status === 400);

  console.log("\n--- Recherche et avis ---");
  r = await call("GET", "/api/products?q=pates");
  ok("recherche insensible aux accents", r.body.products.some((x) => x.title.startsWith("Pâtes")));
  r = await call("POST", "/api/sellers/3/reviews", { token: buyer, body: { rating: 5 } });
  ok("pas d'avis sans commande livree", r.status === 403);
  r = await call("POST", "/api/sellers/1/reviews", { token: seller, body: { rating: 5 } });
  ok("pas d'avis sur soi-meme", r.status === 400);
  r = await call("POST", "/api/sellers/2/reviews", { token: buyer, body: { rating: 0 } });
  ok("note hors limites refusee", r.status === 400);
  r = await call("GET", "/api/orders", { token: buyer });
  const livree = r.body.orders.find((o) => o.status === "livree");
  if (livree) {
    await call("POST", `/api/sellers/${livree.seller_id}/reviews`, { token: buyer, body: { rating: 2 } });
    r = await call("POST", `/api/sellers/${livree.seller_id}/reviews`, { token: buyer, body: { rating: 4 } });
    const avis = (await call("GET", `/api/sellers/${livree.seller_id}`)).body.reviews.filter((x) => x.author_name === "Mamadou Barry");
    ok("un seul avis par acheteur, mis a jour", r.status === 200 && avis.length === 1 && avis[0].rating === 4);
  } else {
    ok("commande livree de demonstration presente", false);
  }

  console.log("\n--- Profil ---");
  r = await call("PATCH", "/api/auth/me", { token: buyer, body: { name: "   " } });
  ok("nom vide refuse", r.status === 400);
  r = await call("PATCH", "/api/auth/me", { token: buyer, body: { email: "pas-un-email" } });
  ok("email invalide refuse", r.status === 400);
} finally {
  server.kill();
}

console.log(failures ? `\n${failures} test(s) en echec\n` : "\nTous les tests sont passes\n");
process.exit(failures ? 1 : 0);
