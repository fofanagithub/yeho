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
  const exists = db.prepare("SELECT id FROM users WHERE phone = ?").get(normalized);
  if (exists) return res.status(409).json({ error: "Ce numero a deja un compte" });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = db
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

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
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
