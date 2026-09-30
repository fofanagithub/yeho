import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { signToken, publicUser, requireAuth } from "../auth.js";
import { refreshRating } from "../ratings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

const router = Router();

const ROLES = ["importateur", "agriculteur", "industriel", "detaillant", "particulier"];

/** Normalise un numero guineen : 620 00 00 00 -> +224620000000 */
function normalizePhone(raw) {
  if (!raw) return "";
  let p = String(raw).replace(/[^\d+]/g, "");
  if (p.startsWith("00224")) p = "+" + p.slice(2);
  if (p.startsWith("224") && p.length > 9) p = "+" + p;
  if (!p.startsWith("+")) p = "+224" + p.replace(/^0+/, "");
  return p;
}

/** Un mobile guineen : indicatif 224 puis 9 chiffres. */
function isValidPhone(normalized) {
  return /^\+224\d{9}$/.test(normalized);
}

function phoneTaken(normalized) {
  return !!db.prepare("SELECT id FROM users WHERE phone = ?").get(normalized);
}

/**
 * GET /api/auth/check-phone?phone=620000007
 * Permet au formulaire d'inscription de signaler un doublon des la saisie,
 * sans attendre que tout le formulaire soit rempli.
 */
router.get("/check-phone", (req, res) => {
  const normalized = normalizePhone(req.query.phone);
  if (!isValidPhone(normalized)) {
    return res.json({ phone: normalized, valid: false, available: false });
  }
  res.json({ phone: normalized, valid: true, available: !phoneTaken(normalized) });
});

router.post("/register", (req, res) => {
  const {
    phone,
    password,
    name,
    role,
    company,
    category,
    region,
    prefecture,
    address,
    description,
    email,
    meta,
    accept_terms,
  } = req.body || {};

  if (!phone || !password || !String(name || "").trim() || !role) {
    return res.status(400).json({ error: "Nom, téléphone, mot de passe et profil sont requis" });
  }
  if (!ROLES.includes(role)) return res.status(400).json({ error: "Profil inconnu" });
  if (accept_terms !== true) {
    return res.status(400).json({ error: "Vous devez accepter les conditions d'utilisation" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères" });
  }

  const normalized = normalizePhone(phone);
  if (!isValidPhone(normalized)) {
    return res.status(400).json({ error: "Numéro de téléphone invalide : 9 chiffres après le +224" });
  }
  // Verrou applicatif ; la colonne users.phone porte aussi une contrainte UNIQUE,
  // ce qui bloque tout doublon meme en cas d'inscriptions simultanees.
  if (phoneTaken(normalized)) {
    return res.status(409).json({ error: "Ce numéro a déjà un compte" });
  }

  const hash = bcrypt.hashSync(String(password), 10);

  let info;
  try {
    info = db
      .prepare(
        `INSERT INTO users (phone, password_hash, name, role, company, category, region,
                            prefecture, address, description, email, avatar_url, meta, terms_accepted_at)
         VALUES (@phone, @hash, @name, @role, @company, @category, @region,
                 @prefecture, @address, @description, @email, @avatar, @meta, datetime('now'))`,
      )
      .run({
        phone: normalized,
        hash,
        name: String(name).trim(),
        role,
        company: company || null,
        category: category || null,
        region: region || null,
        prefecture: prefecture || null,
        address: address || null,
        description: description || null,
        email: email || null,
        avatar: null,
        meta: meta ? JSON.stringify(meta) : null,
      });
  } catch (error) {
    // Deux inscriptions simultanees avec le meme numero : la contrainte UNIQUE
    // tranche, et on renvoie le meme message que la verification applicative.
    if (String(error?.message || "").includes("UNIQUE")) {
      return res.status(409).json({ error: "Ce numéro a déjà un compte" });
    }
    throw error;
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  // Le jeton est renvoye immediatement : l'utilisateur entre dans l'application
  // sans avoir a se reconnecter apres l'inscription.
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { phone, password } = req.body || {};
  if (!phone || !password) return res.status(400).json({ error: "Téléphone et mot de passe requis" });

  const normalized = normalizePhone(phone);
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(normalized);
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: "Numéro ou mot de passe incorrect" });
  }
  if (user.banned_at) {
    return res.status(403).json({ error: "Compte suspendu pour non-respect des conditions d'utilisation" });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/me", requireAuth, (req, res) => {
  const fields = ["name", "company", "category", "region", "prefecture", "address", "description", "email", "avatar_url"];
  const updates = [];
  const values = {};
  for (const f of fields) {
    if (req.body?.[f] !== undefined) {
      // Espaces superflus retires ; un champ vide devient NULL (sauf le nom, obligatoire).
      const value = req.body[f] === null ? null : String(req.body[f]).trim();
      updates.push(`${f} = @${f}`);
      values[f] = value || null;
    }
  }
  if ("name" in values && !values.name) return res.status(400).json({ error: "Le nom ne peut pas être vide" });
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }
  if (!updates.length) return res.json({ user: req.user });
  values.id = req.user.id;
  db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = @id`).run(values);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ user: publicUser(user) });
});

/** Supprime un fichier de /uploads (best effort : une image deja absente n'est pas une erreur). */
function removeUpload(url) {
  if (!url || !url.startsWith("/uploads/")) return;
  const file = path.join(uploadDir, path.basename(url));
  fs.rm(file, { force: true }, () => {});
}

/**
 * DELETE /api/auth/me — suppression du compte (exigence App Store 5.1.1(v)).
 *
 * Les donnees personnelles, annonces, favoris, avis et conversations sont
 * effaces. Les commandes, elles, appartiennent aussi a l'autre partie
 * (historique de ventes du vendeur, preuve d'achat de l'acheteur) : on les
 * conserve, rattachees a un compte anonymise « Compte supprime ». Les
 * commandes encore en cours sont annulees.
 */
router.delete("/me", requireAuth, (req, res) => {
  const password = req.body?.password;
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!password || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const images = db
    .prepare("SELECT image_url FROM products WHERE seller_id = ?")
    .all(row.id)
    .map((p) => p.image_url);
  images.push(row.avatar_url);

  db.transaction(() => {
    const active = db
      .prepare(
        `SELECT id FROM orders WHERE (buyer_id = @id OR seller_id = @id)
         AND status IN ('en_attente','confirmee','en_preparation','en_route')`,
      )
      .all({ id: row.id });
    const cancel = db.prepare("UPDATE orders SET status = 'annulee' WHERE id = ?");
    const event = db.prepare(
      "INSERT INTO order_events (order_id, status, label, detail) VALUES (?, 'annulee', 'Commande annulée', ?)",
    );
    for (const o of active) {
      cancel.run(o.id);
      event.run(o.id, "Le compte de l'autre partie a été supprimé");
    }

    // Coordonnees de livraison saisies par l'utilisateur quand il achetait
    db.prepare("UPDATE orders SET contact_phone = NULL, address = NULL, note = NULL WHERE buyer_id = ?").run(row.id);

    db.prepare("DELETE FROM products WHERE seller_id = ?").run(row.id);
    db.prepare("DELETE FROM favorites WHERE user_id = ?").run(row.id);
    const reviewed = db.prepare("SELECT DISTINCT seller_id FROM reviews WHERE author_id = ?").all(row.id);
    db.prepare("DELETE FROM reviews WHERE author_id = ? OR seller_id = ?").run(row.id, row.id);
    // Les vendeurs que la personne avait notes retrouvent une moyenne juste.
    for (const r of reviewed) refreshRating(r.seller_id);
    db.prepare("DELETE FROM conversations WHERE buyer_id = ? OR seller_id = ?").run(row.id, row.id);
    db.prepare("DELETE FROM messages WHERE sender_id = ?").run(row.id);
    db.prepare("DELETE FROM blocks WHERE blocker_id = ? OR blocked_id = ?").run(row.id, row.id);
    db.prepare("DELETE FROM reports WHERE reporter_id = ?").run(row.id);

    // Le numero est libere : la personne pourra se reinscrire plus tard.
    db.prepare(
      `UPDATE users SET
         phone = @phone, password_hash = '!', name = 'Compte supprime', company = NULL,
         category = NULL, region = NULL, prefecture = NULL, address = NULL, description = NULL,
         avatar_url = NULL, email = NULL, meta = NULL, verified = 0, rating = 0, rating_count = 0,
         deleted_at = datetime('now')
       WHERE id = @id`,
    ).run({ id: row.id, phone: `supprime-${row.id}` });
  })();

  images.forEach(removeUpload);
  res.json({ ok: true });
});

export default router;
