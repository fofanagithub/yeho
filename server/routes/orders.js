import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

const STATUS_FLOW = ["en_attente", "confirmee", "en_preparation", "en_route", "livree"];

const STATUS_LABEL = {
  en_attente: "Commande recue",
  confirmee: "Commande confirmee par le vendeur",
  en_preparation: "Colis en preparation",
  en_route: "Colis en route",
  livree: "Colis livre",
  annulee: "Commande annulee",
};

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
    delivery_fee = 0,
  } = req.body || {};

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Le panier est vide" });
  }
  if (delivery_mode === "livraison" && !address) {
    return res.status(400).json({ error: "Adresse de livraison requise" });
  }

  // Regroupe les lignes par vendeur : une commande par vendeur.
  const bySeller = new Map();
  for (const line of items) {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(line.product_id);
    if (!product) return res.status(400).json({ error: `Produit ${line.product_id} introuvable` });
    const qty = Math.max(1, Number(line.quantity) || 1);
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
      const fee = Number(delivery_fee) || 0;
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
        db.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?").run(l.qty, l.product.id);
      }
      db.prepare("INSERT INTO order_events (order_id, status, label, detail) VALUES (?, ?, ?, ?)").run(
        orderId,
        "en_attente",
        STATUS_LABEL.en_attente,
        "Le vendeur a ete notifie de votre commande",
      );
      created.push(hydrate(db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)));
    }
  });
  tx();

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
    return res.status(403).json({ error: "Acces refuse" });
  }
  res.json({ order: hydrate(order) });
});

/** Avancement du statut : le vendeur pousse, l'acheteur peut annuler ou confirmer reception */
router.patch("/:id/status", requireAuth, (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Commande introuvable" });

  const isSeller = order.seller_id === req.user.id;
  const isBuyer = order.buyer_id === req.user.id;
  if (!isSeller && !isBuyer) return res.status(403).json({ error: "Acces refuse" });

  const { status, detail } = req.body || {};
  if (!STATUS_FLOW.includes(status) && status !== "annulee") {
    return res.status(400).json({ error: "Statut inconnu" });
  }
  if (status === "annulee" && order.status !== "en_attente") {
    return res.status(400).json({ error: "Trop tard pour annuler cette commande" });
  }
  if (status !== "annulee" && !isSeller && status !== "livree") {
    return res.status(403).json({ error: "Seul le vendeur peut faire avancer la commande" });
  }

  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, order.id);
  db.prepare("INSERT INTO order_events (order_id, status, label, detail) VALUES (?, ?, ?, ?)").run(
    order.id,
    status,
    STATUS_LABEL[status] || status,
    detail || null,
  );
  res.json({ order: hydrate(db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id)) });
});

export default router;
