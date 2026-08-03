import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

function partner(conv, userId) {
  const otherId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
  return db
    .prepare("SELECT id, name, company, role, avatar_url, verified, region FROM users WHERE id = ?")
    .get(otherId);
}

function decorate(conv, userId) {
  const last = db
    .prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1")
    .get(conv.id);
  const unread = db
    .prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL")
    .get(conv.id, userId).n;
  const product = conv.product_id
    ? db.prepare("SELECT id, title, image_url, price, unit FROM products WHERE id = ?").get(conv.product_id)
    : null;
  return { ...conv, partner: partner(conv, userId), last_message: last, unread, product };
}

router.get("/", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM conversations WHERE buyer_id = ? OR seller_id = ?")
    .all(req.user.id, req.user.id)
    .map((c) => decorate(c, req.user.id))
    .sort((a, b) => {
      const at = a.last_message?.created_at || a.created_at;
      const bt = b.last_message?.created_at || b.created_at;
      return bt.localeCompare(at);
    });
  res.json({ conversations: rows });
});

/** Ouvre (ou reutilise) une conversation avec un vendeur, eventuellement liee a un produit */
router.post("/", requireAuth, (req, res) => {
  const { seller_id, product_id, body } = req.body || {};
  if (!seller_id) return res.status(400).json({ error: "Destinataire manquant" });
  if (Number(seller_id) === req.user.id) return res.status(400).json({ error: "Impossible de s'ecrire a soi-meme" });

  let conv = db
    .prepare(
      `SELECT * FROM conversations
       WHERE buyer_id = ? AND seller_id = ? AND IFNULL(product_id, 0) = IFNULL(?, 0)`,
    )
    .get(req.user.id, Number(seller_id), product_id ? Number(product_id) : null);

  if (!conv) {
    const info = db
      .prepare("INSERT INTO conversations (buyer_id, seller_id, product_id) VALUES (?, ?, ?)")
      .run(req.user.id, Number(seller_id), product_id ? Number(product_id) : null);
    conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(info.lastInsertRowid);
  }

  if (body) {
    db.prepare("INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)").run(
      conv.id,
      req.user.id,
      body,
    );
  }

  res.status(201).json({ conversation: decorate(conv, req.user.id) });
});

router.get("/:id/messages", requireAuth, (req, res) => {
  const conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation introuvable" });
  if (conv.buyer_id !== req.user.id && conv.seller_id !== req.user.id) {
    return res.status(403).json({ error: "Acces refuse" });
  }
  db.prepare(
    "UPDATE messages SET read_at = datetime('now') WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL",
  ).run(conv.id, req.user.id);

  const messages = db.prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY id").all(conv.id);
  res.json({ conversation: decorate(conv, req.user.id), messages });
});

router.post("/:id/messages", requireAuth, (req, res) => {
  const conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation introuvable" });
  if (conv.buyer_id !== req.user.id && conv.seller_id !== req.user.id) {
    return res.status(403).json({ error: "Acces refuse" });
  }
  const body = (req.body?.body || "").trim();
  if (!body) return res.status(400).json({ error: "Message vide" });

  const info = db
    .prepare("INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)")
    .run(conv.id, req.user.id, body);
  res.status(201).json({ message: db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid) });
});

export default router;
