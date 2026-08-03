import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import db from "../db.js";
import { requireAuth, optionalAuth } from "../auth.js";

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
       WHERE f.user_id = ? ORDER BY f.created_at DESC`,
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
       FROM users WHERE id = ?`,
    )
    .get(req.params.id);
  if (!seller) return res.status(404).json({ error: "Vendeur introuvable" });

  const products = db
    .prepare("SELECT * FROM products WHERE seller_id = ? AND status = 'active' ORDER BY created_at DESC")
    .all(seller.id);
  const reviews = db
    .prepare(
      `SELECT r.*, u.name AS author_name FROM reviews r
       JOIN users u ON u.id = r.author_id WHERE r.seller_id = ? ORDER BY r.created_at DESC LIMIT 20`,
    )
    .all(seller.id);
  const sales = db
    .prepare("SELECT COUNT(*) AS n FROM orders WHERE seller_id = ? AND status = 'livree'")
    .get(seller.id).n;

  res.json({ seller: { ...seller, verified: !!seller.verified }, products, reviews, sales });
});

router.post("/sellers/:id/reviews", requireAuth, (req, res) => {
  const rating = Math.min(5, Math.max(1, Number(req.body?.rating) || 0));
  if (!rating) return res.status(400).json({ error: "Note invalide" });
  db.prepare("INSERT INTO reviews (seller_id, author_id, rating, comment) VALUES (?, ?, ?, ?)").run(
    req.params.id,
    req.user.id,
    rating,
    req.body?.comment || null,
  );
  const agg = db
    .prepare("SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE seller_id = ?")
    .get(req.params.id);
  db.prepare("UPDATE users SET rating = ?, rating_count = ? WHERE id = ?").run(
    Math.round(agg.avg * 10) / 10,
    agg.n,
    req.params.id,
  );
  res.status(201).json({ ok: true, rating: Math.round(agg.avg * 10) / 10, count: agg.n });
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
       FROM orders WHERE seller_id = ? GROUP BY month ORDER BY month DESC LIMIT 6`,
    )
    .all(id);

  res.json({ stats: { listings, active, views, pending, delivered, revenue, unread, monthly } });
});

/* ---------- Upload d'images ---------- */
router.post("/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image manquante ou format non supporte" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
