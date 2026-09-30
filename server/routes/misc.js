import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import db from "../db.js";
import { requireAuth, optionalAuth, blockedIds } from "../auth.js";
import { refreshRating } from "../ratings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

const router = Router();

/* ---------- Favoris ---------- */
router.get("/favorites", requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.*, u.name AS seller_name, u.company AS seller_company, u.verified AS seller_verified
       FROM favorites f
       JOIN products p ON p.id = f.product_id
       JOIN users u ON u.id = p.seller_id
       WHERE f.user_id = ? AND p.hidden_at IS NULL AND u.banned_at IS NULL ORDER BY f.created_at DESC`,
    )
    .all(req.user.id);
  res.json({ products: rows.map((r) => ({ ...r, is_favorite: true })) });
});

router.post("/favorites/:productId", requireAuth, (req, res) => {
  db.prepare("INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)").run(
    req.user.id,
    req.params.productId,
  );
  res.json({ ok: true, is_favorite: true });
});

router.delete("/favorites/:productId", requireAuth, (req, res) => {
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND product_id = ?").run(req.user.id, req.params.productId);
  res.json({ ok: true, is_favorite: false });
});

/* ---------- Profil public d'un vendeur ---------- */
router.get("/sellers/:id", optionalAuth, (req, res) => {
  const seller = db
    .prepare(
      `SELECT id, name, company, role, category, region, prefecture, address, description,
              avatar_url, verified, rating, rating_count, created_at
       FROM users WHERE id = ? AND deleted_at IS NULL AND banned_at IS NULL`,
    )
    .get(req.params.id);
  if (!seller) return res.status(404).json({ error: "Vendeur introuvable" });

  const me = req.user?.id;
  const blocked = me
    ? !!db.prepare("SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?").get(me, seller.id)
    : false;
  const hiddenAuthors = blockedIds(me);

  const products = db
    .prepare(
      "SELECT * FROM products WHERE seller_id = ? AND status = 'active' AND hidden_at IS NULL ORDER BY created_at DESC",
    )
    .all(seller.id);
  const reviews = db
    .prepare(
      `SELECT r.*, u.name AS author_name FROM reviews r
       JOIN users u ON u.id = r.author_id
       WHERE r.seller_id = ? AND r.hidden_at IS NULL AND u.banned_at IS NULL
       ORDER BY r.created_at DESC LIMIT 20`,
    )
    .all(seller.id)
    .filter((r) => !hiddenAuthors.includes(r.author_id));
  const sales = db
    .prepare("SELECT COUNT(*) AS n FROM orders WHERE seller_id = ? AND status = 'livree'")
    .get(seller.id).n;

  res.json({ seller: { ...seller, verified: !!seller.verified }, products, reviews, sales, blocked });
});

/**
 * POST /api/sellers/:id/reviews { rating, comment? }
 * Reserve aux acheteurs ayant recu au moins une commande de ce vendeur ;
 * un seul avis par acheteur et par vendeur (un nouvel envoi le met a jour).
 */
router.post("/sellers/:id/reviews", requireAuth, (req, res) => {
  const sellerId = Number(req.params.id);
  const rating = Number(req.body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Choisissez une note de 1 à 5 étoiles" });
  }
  if (sellerId === req.user.id) return res.status(400).json({ error: "Vous ne pouvez pas vous noter vous-même" });

  const bought = db
    .prepare("SELECT 1 FROM orders WHERE buyer_id = ? AND seller_id = ? AND status = 'livree' LIMIT 1")
    .get(req.user.id, sellerId);
  if (!bought) {
    return res.status(403).json({ error: "Vous pourrez noter ce vendeur après avoir reçu une commande" });
  }

  const comment = req.body?.comment ? String(req.body.comment).trim().slice(0, 1000) || null : null;
  const existing = db.prepare("SELECT id FROM reviews WHERE seller_id = ? AND author_id = ?").get(sellerId, req.user.id);
  if (existing) {
    db.prepare("UPDATE reviews SET rating = ?, comment = ?, created_at = datetime('now') WHERE id = ?").run(
      rating,
      comment,
      existing.id,
    );
  } else {
    db.prepare("INSERT INTO reviews (seller_id, author_id, rating, comment) VALUES (?, ?, ?, ?)").run(
      sellerId,
      req.user.id,
      rating,
      comment,
    );
  }
  const agg = refreshRating(sellerId);
  res.status(existing ? 200 : 201).json({ ok: true, ...agg });
});

/* ---------- Tableau de bord vendeur ---------- */
router.get("/stats", requireAuth, (req, res) => {
  const id = req.user.id;
  const listings = db.prepare("SELECT COUNT(*) AS n FROM products WHERE seller_id = ?").get(id).n;
  const active = db.prepare("SELECT COUNT(*) AS n FROM products WHERE seller_id = ? AND status = 'active'").get(id).n;
  const views = db.prepare("SELECT IFNULL(SUM(views), 0) AS n FROM products WHERE seller_id = ?").get(id).n;
  const pending = db
    .prepare("SELECT COUNT(*) AS n FROM orders WHERE seller_id = ? AND status IN ('en_attente','confirmee','en_preparation','en_route')")
    .get(id).n;
  const delivered = db.prepare("SELECT COUNT(*) AS n FROM orders WHERE seller_id = ? AND status = 'livree'").get(id).n;
  const revenue = db
    .prepare("SELECT IFNULL(SUM(total), 0) AS n FROM orders WHERE seller_id = ? AND status = 'livree'")
    .get(id).n;
  const unread = db
    .prepare(
      `SELECT COUNT(*) AS n FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE (c.buyer_id = ? OR c.seller_id = ?) AND m.sender_id != ? AND m.read_at IS NULL`,
    )
    .get(id, id, id).n;
  const monthly = db
    .prepare(
      `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS orders, IFNULL(SUM(total),0) AS revenue
       FROM orders WHERE seller_id = ? AND status != 'annulee'
       GROUP BY month ORDER BY month DESC LIMIT 6`,
    )
    .all(id);

  res.json({ stats: { listings, active, views, pending, delivered, revenue, unread, monthly } });
});

/* ---------- Upload d'images ---------- */
router.post("/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image manquante ou format non supporté" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
