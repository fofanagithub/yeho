import jwt from "jsonwebtoken";
import db from "./db.js";

export const JWT_SECRET = process.env.JWT_SECRET || "yehoo-dev-secret-change-me";
const EXPIRES_IN = "30d";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

const SELECT_USER = db.prepare(`
  SELECT id, phone, name, role, company, category, region, prefecture, address,
         description, avatar_url, email, verified, rating, rating_count, meta, created_at,
         banned_at, deleted_at
  FROM users WHERE id = ?
`);

export function publicUser(row) {
  if (!row) return null;
  const { meta, password_hash, banned_at, deleted_at, terms_accepted_at, ...rest } = row;
  return {
    ...rest,
    verified: !!rest.verified,
    meta: meta ? safeParse(meta) : null,
  };
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Bloque la requete si l'utilisateur n'est pas connecte. */
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: "Authentification requise" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = SELECT_USER.get(payload.sub);
    if (!user || user.deleted_at) return res.status(401).json({ error: "Compte introuvable" });
    if (user.banned_at) return res.status(403).json({ error: "Compte suspendu pour non-respect des conditions d'utilisation" });
    req.user = publicUser(user);
    next();
  } catch {
    res.status(401).json({ error: "Session expirée, reconnectez-vous" });
  }
}

/** Attache req.user si un token valide est present, sans bloquer. */
export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = SELECT_USER.get(payload.sub);
      if (user && !user.deleted_at && !user.banned_at) req.user = publicUser(user);
    } catch {
      /* token invalide : on continue en anonyme */
    }
  }
  next();
}

export const SELLER_ROLES = ["importateur", "agriculteur", "industriel", "detaillant"];

export function requireSeller(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Authentification requise" });
  if (!SELLER_ROLES.includes(req.user.role)) {
    return res.status(403).json({ error: "Réservé aux comptes vendeurs" });
  }
  next();
}

/**
 * Moderateurs : numeros listes dans ADMIN_PHONES (separes par des virgules),
 * au format normalise +224XXXXXXXXX.
 */
const ADMIN_PHONES = (process.env.ADMIN_PHONES || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

export function isAdmin(user) {
  return !!user && ADMIN_PHONES.includes(user.phone);
}

export function requireAdmin(req, res, next) {
  if (!isAdmin(req.user)) return res.status(403).json({ error: "Réservé à la modération" });
  next();
}

/** Ids des utilisateurs bloques par `userId` ou qui l'ont bloque : on ne se voit plus dans les deux sens. */
export function blockedIds(userId) {
  if (!userId) return [];
  return db
    .prepare(
      `SELECT blocked_id AS id FROM blocks WHERE blocker_id = ?
       UNION SELECT blocker_id AS id FROM blocks WHERE blocked_id = ?`,
    )
    .all(userId, userId)
    .map((r) => r.id);
}

export function isBlockedBetween(a, b) {
  return !!db
    .prepare("SELECT 1 FROM blocks WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)")
    .get(a, b, b, a);
}
