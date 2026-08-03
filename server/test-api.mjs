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
const env = { ...process.env, SOONI_DB: TEST_DB, PORT: String(PORT) };

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
    body: { phone: "620000007", password: "azerty12", name: "X", role: "detaillant" },
  });
  ok("numero deja utilise refuse", r.status === 409);

  r = await call("POST", "/api/auth/register", {
    body: { phone: "624 11 22 33", password: "azerty12", name: "Kadiatou Sow", role: "particulier", region: "Kankan" },
  });
  ok("inscription et normalisation du numero", r.status === 201 && r.body.user?.phone === "+224624112233", r.body.user?.phone);

  r = await call("GET", "/api/auth/me", { token: buyer });
  ok("jeton valide renvoie le profil", r.body.user?.name === "Mamadou Barry");
  r = await call("GET", "/api/auth/me");
  ok("acces sans jeton refuse", r.status === 401);

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
} finally {
  server.kill();
}

console.log(failures ? `\n${failures} test(s) en echec\n` : "\nTous les tests sont passes\n");
process.exit(failures ? 1 : 0);
