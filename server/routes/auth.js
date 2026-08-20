import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { signToken, publicUser, requireAuth } from "../auth.js";

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
  } = req.body || {};

  if (!phone || !password || !name || !role) {
    return res.status(400).json({ error: "Nom, telephone, mot de passe et profil sont requis" });
  }
  if (!ROLES.includes(role)) return res.status(400).json({ error: "Profil inconnu" });
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caracteres" });
  }

  const normalized = normalizePhone(phone);
  if (!isValidPhone(normalized)) {
    return res.status(400).json({ error: "Numero de telephone invalide : 9 chiffres apres le +224" });
  }
  // Verrou applicatif ; la colonne users.phone porte aussi une contrainte UNIQUE,
  // ce qui bloque tout doublon meme en cas d'inscriptions simultanees.
  if (phoneTaken(normalized)) {
    return res.status(409).json({ error: "Ce numero a deja un compte" });
  }

  const hash = bcrypt.hashSync(String(password), 10);

  let info;
  try {
    info = db
      .prepare(
        `INSERT INTO users (phone, password_hash, name, role, company, category, region,
                            prefecture, address, description, email, avatar_url, meta)
         VALUES (@phone, @hash, @name, @role, @company, @category, @region,
                 @prefecture, @address, @description, @email, @avatar, @meta)`,
      )
      .run({
        phone: normalized,
        hash,
        name,
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
      return res.status(409).json({ error: "Ce numero a deja un compte" });
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
  if (!phone || !password) return res.status(400).json({ error: "Telephone et mot de passe requis" });

  const normalized = normalizePhone(phone);
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(normalized);
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: "Numero ou mot de passe incorrect" });
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
      updates.push(`${f} = @${f}`);
      values[f] = req.body[f];
    }
  }
  if (!updates.length) return res.json({ user: req.user });
  values.id = req.user.id;
  db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = @id`).run(values);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ user: publicUser(user) });
});

export default router;
