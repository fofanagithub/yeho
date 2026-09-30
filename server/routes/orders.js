import { Router } from "express";
import db from "../db.js";
import { requireAuth, isBlockedBetween } from "../auth.js";

const router = Router();

const STATUS_FLOW = ["en_attente", "confirmee", "en_preparation", "en_route", "livree"];

const STATUS_LABEL = {
  en_attente: "Commande reçue",
  confirmee: "Commande confirmée par le vendeur",
  en_preparation: "Colis en préparation",
  en_route: "Colis en route",
  livree: "Colis livré",
  annulee: "Commande annulée",
};

/** Frais de livraison par vendeur : fixes cote serveur, jamais fournis par le client. */
export const DELIVERY_FEE = 150000;
const DELIVERY_MODES = ["livraison", "retrait"];
const PAYMENT_METHODS = ["orange_money", "mtn_momo", "especes", "virement"];

class StockError extends Error {}

function reference() {
  return "GN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function hydrate(order) {
  if (!order) return null;
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  const events = db
    .prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY id")
    .all(order.id);
  const seller = db
    .prepare("SELECT id, name, company, phone, region, avatar_url, verified FROM users WHERE id = ?")
    .get(order.seller_id);
  const buyer = db
    .prepare("SELECT id, name, company, phone, region FROM users WHERE id = ?")
    .get(order.buyer_id);
  return { ...order, items, events, seller, buyer };
}

/** POST /api/orders — cree une commande par vendeur a partir du panier */
router.post("/", requireAuth, (req, res) => {
  const {
    items,
    delivery_mode = "livraison",
    payment_method = "orange_money",
    region,
    prefecture,
    address,
    contact_phone,
    note,
  } = req.body || {};

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Le panier est vide" });
  }
  if (!DELIVERY_MODES.includes(delivery_mode)) return res.status(400).json({ error: "Mode de livraison inconnu" });
  if (!PAYMENT_METHODS.includes(payment_method)) return res.status(400).json({ error: "Moyen de paiement inconnu" });
  if (delivery_mode === "livraison" && !address) {
    return res.status(400).json({ error: "Adresse de livraison requise" });
  }

  // Regroupe les lignes par vendeur : une commande par vendeur.
  const bySeller = new Map();
  for (const line of items) {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(line.product_id);
    const seller = product && db.prepare("SELECT banned_at, deleted_at FROM users WHERE id = ?").get(product.seller_id);
    if (
      !product ||
      product.status !== "active" ||
      product.hidden_at ||
      seller.banned_at ||
      seller.deleted_at ||
      isBlockedBetween(req.user.id, product.seller_id)
    ) {
      return res.status(400).json({ error: `${product?.title || "Un produit"} n'est plus disponible` });
    }
    if (product.seller_id === req.user.id) {
      return res.status(400).json({ error: "Vous ne pouvez pas commander votre propre produit" });
    }
    const qty = Math.max(1, Math.floor(Number(line.quantity)) || 1);
    const alreadyInCart = (bySeller.get(product.seller_id) || [])
      .filter((l) => l.product.id === product.id)
      .reduce((n, l) => n + l.qty, 0);
    if (qty + alreadyInCart > product.stock) {
      return res.status(400).json({
        error: product.stock
          ? `Stock insuffisant pour ${product.title} : ${product.stock} ${product.unit} disponible(s)`
          : `${product.title} est en rupture de stock`,
      });
    }
    if (qty < product.min_order) {
      return res.status(400).json({ error: `Minimum ${product.min_order} pour ${product.title}` });
    }
    const tier = db
      .prepare("SELECT price FROM price_tiers WHERE product_id = ? AND min_qty <= ? ORDER BY min_qty DESC LIMIT 1")
      .get(product.id, qty);
    const unitPrice = tier?.price ?? product.price;
    const group = bySeller.get(product.seller_id) || [];
    group.push({ product, qty, unitPrice });
    bySeller.set(product.seller_id, group);
  }

  const created = [];
  const tx = db.transaction(() => {
    for (const [sellerId, lines] of bySeller) {
      const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
      const fee = delivery_mode === "livraison" ? DELIVERY_FEE : 0;
      const info = db
        .prepare(
          `INSERT INTO orders (reference, buyer_id, seller_id, subtotal, delivery_fee, total,
                               delivery_mode, payment_method, region, prefecture, address, contact_phone, note)
           VALUES (@reference, @buyer_id, @seller_id, @subtotal, @fee, @total,
                   @delivery_mode, @payment_method, @region, @prefecture, @address, @contact_phone, @note)`,
        )
        .run({
          reference: reference(),
          buyer_id: req.user.id,
          seller_id: sellerId,
          subtotal,
          fee,
          total: subtotal + fee,
          delivery_mode,
          payment_method,
          region: region || null,
          prefecture: prefecture || null,
          address: address || null,
          contact_phone: contact_phone || req.user.phone,
          note: note || null,
        });

      const orderId = info.lastInsertRowid;
      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, product_id, title, image_url, unit, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const l of lines) {
        insertItem.run(orderId, l.product.id, l.product.title, l.product.image_url, l.product.unit, l.qty, l.unitPrice);
        // Stock deja verifie plus haut ; la condition protege contre deux commandes simultanees.
        const updated = db
          .prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?")
          .run(l.qty, l.product.id, l.qty);
        if (!updated.changes) throw new StockError(`Stock insuffisant pour ${l.product.title}`);
      }
      db.prepare("INSERT INTO order_events (order_id, status, label, detail) VALUES (?, ?, ?, ?)").run(
        orderId,
        "en_attente",
        STATUS_LABEL.en_attente,
        "Votre commande a été transmise au vendeur",
      );
      created.push(hydrate(db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)));
    }
  });
  try {
    tx();
  } catch (error) {
    if (error instanceof StockError) return res.status(409).json({ error: error.message });
    throw error;
  }

  res.status(201).json({ orders: created });
});

/** Commandes passees par l'acheteur connecte */
router.get("/", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json({ orders: rows.map(hydrate) });
});

/** Commandes recues par le vendeur connecte */
router.get("/received", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM orders WHERE seller_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json({ orders: rows.map(hydrate) });
});

router.get("/:id", requireAuth, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ? OR reference = ?").get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });
  if (order.buyer_id !== req.user.id && order.seller_id !== req.user.id) {
    return res.status(403).json({ error: "Accès refusé" });
  }
  // L'acheteur voit l'avis qu'il a deja laisse a ce vendeur (pour le modifier).
  const myReview =
    order.buyer_id === req.user.id
      ? db
          .prepare("SELECT rating, comment FROM reviews WHERE seller_id = ? AND author_id = ?")
          .get(order.seller_id, req.user.id) || null
      : null;
  res.json({ order: { ...hydrate(order), my_review: myReview } });
});

/** Avancement du statut : le vendeur pousse, l'acheteur peut annuler ou confirmer reception */
router.patch("/:id/status", requireAuth, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });

  const isSeller = order.seller_id === req.user.id;
  const isBuyer = order.buyer_id === req.user.id;
  if (!isSeller && !isBuyer) return res.status(403).json({ error: "Accès refusé" });

  const { status, detail } = req.body || {};
  if (!STATUS_FLOW.includes(status) && status !== "annulee") {
    return res.status(400).json({ error: "Statut inconnu" });
  }
  if (order.status === "livree" || order.status === "annulee") {
    return res.status(400).json({ error: "Cette commande est terminée" });
  }

  const current = STATUS_FLOW.indexOf(order.status);
  if (status === "annulee") {
    // L'acheteur annule tant que le vendeur n'a pas confirme ;
    // le vendeur peut refuser ou annuler tant que le colis n'est pas parti.
    const allowed = isSeller ? ["en_attente", "confirmee", "en_preparation"] : ["en_attente"];
    if (!allowed.includes(order.status)) {
      return res.status(400).json({ error: "Trop tard pour annuler cette commande" });
    }
  } else if (isSeller) {
    // Le vendeur avance d'une etape a la fois, jamais en arriere.
    if (STATUS_FLOW.indexOf(status) !== current + 1) {
      return res.status(400).json({ error: `Étape suivante attendue : ${STATUS_LABEL[STATUS_FLOW[current + 1]]}` });
    }
  } else if (status !== "livree" || order.status !== "en_route") {
    return res.status(403).json({ error: "Seul le vendeur peut faire avancer la commande" });
  }

  db.transaction(() => {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, order.id);
    db.prepare("INSERT INTO order_events (order_id, status, label, detail) VALUES (?, ?, ?, ?)").run(
      order.id,
      status,
      STATUS_LABEL[status] || status,
      detail || (status === "annulee" ? `Annulée par ${isSeller ? "le vendeur" : "l'acheteur"}` : null),
    );
    // Une commande annulee rend son stock au vendeur.
    if (status === "annulee") {
      const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?").all(order.id);
      const restock = db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
      for (const it of items) if (it.product_id) restock.run(it.quantity, it.product_id);
    }
  })();
  res.json({ order: hydrate(db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id)) });
});

export default router;
