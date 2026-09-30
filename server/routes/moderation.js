import { Router } from "express";
import db from "../db.js";
import { requireAuth, requireAdmin, isAdmin } from "../auth.js";
import { refreshRating } from "../ratings.js";

const router = Router();

const TARGET_TYPES = ["product", "user", "message", "review"];

export const REPORT_REASONS = {
  arnaque: "Arnaque ou fraude",
  interdit: "Produit interdit ou illégal",
  trompeur: "Annonce trompeuse",
  offensant: "Contenu offensant ou haineux",
  harcelement: "Harcèlement",
  spam: "Spam",
  autre: "Autre",
};

/**
 * Au-dela de ce nombre de signalements distincts, le contenu est masque
 * automatiquement en attendant qu'un moderateur tranche : un contenu
 * problematique ne reste pas visible toute une nuit.
 */
const AUTO_HIDE_THRESHOLD = 3;

/** Renvoie l'auteur d'un contenu signale, ou null si le contenu n'existe pas. */
function ownerOf(type, id) {
  const row = {
    product: () => db.prepare("SELECT seller_id AS owner FROM products WHERE id = ?").get(id),
    user: () => db.prepare("SELECT id AS owner FROM users WHERE id = ? AND deleted_at IS NULL").get(id),
    message: () => db.prepare("SELECT sender_id AS owner, conversation_id FROM messages WHERE id = ?").get(id),
    review: () => db.prepare("SELECT author_id AS owner FROM reviews WHERE id = ?").get(id),
  }[type]();
  return row || null;
}

function hideContent(type, id) {
  if (type === "product") db.prepare("UPDATE products SET hidden_at = datetime('now') WHERE id = ?").run(id);
  if (type === "review") {
    db.prepare("UPDATE reviews SET hidden_at = datetime('now') WHERE id = ?").run(id);
    const review = db.prepare("SELECT seller_id FROM reviews WHERE id = ?").get(id);
    if (review) refreshRating(review.seller_id);
  }
  if (type === "message") db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

/* ---------- Signalements ---------- */

router.get("/reports/reasons", (_req, res) => {
  res.json({ reasons: Object.entries(REPORT_REASONS).map(([value, label]) => ({ value, label })) });
});

/** POST /api/reports { target_type, target_id, reason, details? } */
router.post("/reports", requireAuth, (req, res) => {
  const { target_type, target_id, reason, details } = req.body || {};
  const id = Number(target_id);
  if (!TARGET_TYPES.includes(target_type) || !id) {
    return res.status(400).json({ error: "Contenu à signaler invalide" });
  }
  if (!REPORT_REASONS[reason]) return res.status(400).json({ error: "Choisissez un motif" });

  const target = ownerOf(target_type, id);
  if (!target) return res.status(404).json({ error: "Contenu introuvable" });
  if (target.owner === req.user.id) return res.status(400).json({ error: "Vous ne pouvez pas signaler votre propre contenu" });

  // Un message n'est signalable que par un participant de la conversation.
  if (target_type === "message") {
    const conv = db.prepare("SELECT buyer_id, seller_id FROM conversations WHERE id = ?").get(target.conversation_id);
    if (!conv || (conv.buyer_id !== req.user.id && conv.seller_id !== req.user.id)) {
      return res.status(403).json({ error: "Accès refusé" });
    }
  }

  const info = db
    .prepare(
      `INSERT OR IGNORE INTO reports (reporter_id, target_type, target_id, reason, details)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(req.user.id, target_type, id, reason, details ? String(details).slice(0, 1000) : null);

  if (info.changes && target_type !== "user") {
    const count = db
      .prepare("SELECT COUNT(*) AS n FROM reports WHERE target_type = ? AND target_id = ? AND status = 'ouvert'")
      .get(target_type, id).n;
    if (count >= AUTO_HIDE_THRESHOLD) hideContent(target_type, id);
  }

  // Meme reponse si l'utilisateur avait deja signale ce contenu : rien a lui reprocher.
  res.status(201).json({ ok: true });
});

/* ---------- Blocages ---------- */

router.get("/blocks", requireAuth, (req, res) => {
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.company, u.role, u.avatar_url, b.created_at AS blocked_at
       FROM blocks b JOIN users u ON u.id = b.blocked_id
       WHERE b.blocker_id = ? ORDER BY b.created_at DESC`,
    )
    .all(req.user.id);
  res.json({ users });
});

router.post("/blocks/:userId", requireAuth, (req, res) => {
  const target = Number(req.params.userId);
  if (target === req.user.id) return res.status(400).json({ error: "Vous ne pouvez pas vous bloquer vous-même" });
  if (!db.prepare("SELECT 1 FROM users WHERE id = ?").get(target)) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }
  db.prepare("INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)").run(req.user.id, target);
  res.status(201).json({ ok: true, blocked: true });
});

router.delete("/blocks/:userId", requireAuth, (req, res) => {
  db.prepare("DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?").run(req.user.id, Number(req.params.userId));
  res.json({ ok: true, blocked: false });
});

/* ---------- Moderation (comptes listes dans ADMIN_PHONES) ---------- */

router.get("/admin/me", requireAuth, (req, res) => {
  res.json({ admin: isAdmin(req.user) });
});

/** File des signalements, groupes par contenu, les plus signales d'abord. */
router.get("/admin/reports", requireAuth, requireAdmin, (req, res) => {
  const status = ["ouvert", "traite", "rejete"].includes(req.query.status) ? req.query.status : "ouvert";
  const rows = db
    .prepare(
      `SELECT r.*, u.name AS reporter_name
       FROM reports r JOIN users u ON u.id = r.reporter_id
       WHERE r.status = ? ORDER BY r.created_at DESC LIMIT 200`,
    )
    .all(status);

  const preview = {
    product: (id) => db.prepare("SELECT id, title, description, image_url, seller_id, hidden_at FROM products WHERE id = ?").get(id),
    user: (id) => db.prepare("SELECT id, name, company, phone, banned_at FROM users WHERE id = ?").get(id),
    message: (id) => db.prepare("SELECT id, body, sender_id, conversation_id FROM messages WHERE id = ?").get(id),
    review: (id) => db.prepare("SELECT id, rating, comment, author_id, hidden_at FROM reviews WHERE id = ?").get(id),
  };

  res.json({
    reports: rows.map((r) => ({ ...r, reason_label: REPORT_REASONS[r.reason], target: preview[r.target_type](r.target_id) || null })),
  });
});

/**
 * POST /api/admin/reports/:id { action }
 *   rejeter  — le signalement n'est pas fonde (le contenu masque automatiquement redevient visible)
 *   retirer  — le contenu est masque / supprime
 *   bannir   — le contenu est retire et son auteur suspendu
 * Tous les signalements ouverts sur le meme contenu sont clos ensemble.
 */
router.post("/admin/reports/:id", requireAuth, requireAdmin, (req, res) => {
  const { action } = req.body || {};
  if (!["rejeter", "retirer", "bannir"].includes(action)) return res.status(400).json({ error: "Action inconnue" });

  const report = db.prepare("SELECT * FROM reports WHERE id = ?").get(req.params.id);
  if (!report) return res.status(404).json({ error: "Signalement introuvable" });

  db.transaction(() => {
    const target = ownerOf(report.target_type, report.target_id);

    if (action === "rejeter") {
      if (report.target_type === "product") db.prepare("UPDATE products SET hidden_at = NULL WHERE id = ?").run(report.target_id);
      if (report.target_type === "review") {
        db.prepare("UPDATE reviews SET hidden_at = NULL WHERE id = ?").run(report.target_id);
        const review = db.prepare("SELECT seller_id FROM reviews WHERE id = ?").get(report.target_id);
        if (review) refreshRating(review.seller_id);
      }
    } else {
      if (target) hideContent(report.target_type, report.target_id);
      if (action === "bannir" && target) {
        db.prepare("UPDATE users SET banned_at = datetime('now') WHERE id = ?").run(target.owner);
        db.prepare("UPDATE products SET hidden_at = datetime('now') WHERE seller_id = ? AND hidden_at IS NULL").run(target.owner);
      }
    }

    db.prepare(
      `UPDATE reports SET status = ?, resolution = ?, resolved_at = datetime('now')
       WHERE target_type = ? AND target_id = ? AND status = 'ouvert'`,
    ).run(action === "rejeter" ? "rejete" : "traite", action, report.target_type, report.target_id);
  })();

  res.json({ ok: true });
});

export default router;
