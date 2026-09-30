import { Router } from "express";
import db, { sansAccent } from "../db.js";
import { requireAuth, optionalAuth, requireSeller, blockedIds } from "../auth.js";

const router = Router();

const BASE_SELECT = `
  SELECT p.*,
         u.name AS seller_name, u.company AS seller_company, u.role AS seller_role,
         u.region AS seller_region, u.verified AS seller_verified, u.rating AS seller_rating,
         u.avatar_url AS seller_avatar
  FROM products p
  JOIN users u ON u.id = p.seller_id
`;

function withTiers(product) {
  if (!product) return null;
  const tiers = db
    .prepare("SELECT min_qty, price FROM price_tiers WHERE product_id = ? ORDER BY min_qty")
    .all(product.id);
  return {
    ...product,
    negotiable: !!product.negotiable,
    seller_verified: !!product.seller_verified,
    tiers,
  };
}

/** GET /api/products — recherche, filtres, tri */
router.get("/", optionalAuth, (req, res) => {
  const { q, category, region, seller, sort = "recent", minPrice, maxPrice, status } = req.query;
  const where = [];
  const params = {};

  where.push("p.status = @status");
  params.status = status || "active";

  // Contenus masques par la moderation : seul le vendeur continue de voir les siens.
  where.push("(p.hidden_at IS NULL OR p.seller_id = @me)");
  where.push("u.banned_at IS NULL AND u.deleted_at IS NULL");
  params.me = req.user?.id ?? -1;

  const blocked = blockedIds(req.user?.id);
  if (blocked.length) where.push(`p.seller_id NOT IN (${blocked.map(Number).join(",")})`);

  if (q) {
    where.push(
      `(sans_accent(p.title) LIKE @q OR sans_accent(p.description) LIKE @q
        OR sans_accent(u.company) LIKE @q OR sans_accent(u.name) LIKE @q)`,
    );
    params.q = `%${sansAccent(q)}%`;
  }
  if (category && category !== "toutes") {
    where.push("p.category = @category");
    params.category = category;
  }
  if (region && region !== "toute") {
    where.push("p.region = @region");
    params.region = region;
  }
  if (seller) {
    where.push("p.seller_id = @seller");
    params.seller = Number(seller);
  }
  if (minPrice) {
    where.push("p.price >= @minPrice");
    params.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    where.push("p.price <= @maxPrice");
    params.maxPrice = Number(maxPrice);
  }

  const orderBy =
    {
      recent: "p.created_at DESC",
      prix_croissant: "p.price ASC",
      prix_decroissant: "p.price DESC",
      populaire: "p.views DESC",
      pertinence: "u.verified DESC, p.views DESC",
    }[sort] || "p.created_at DESC";

  const sql = `${BASE_SELECT} ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ${orderBy} LIMIT 120`;
  const rows = db.prepare(sql).all(params);

  let favorites = new Set();
  if (req.user) {
    favorites = new Set(
      db.prepare("SELECT product_id FROM favorites WHERE user_id = ?").all(req.user.id).map((r) => r.product_id),
    );
  }

  res.json({
    products: rows.map((r) => ({ ...withTiers(r), is_favorite: favorites.has(r.id) })),
  });
});

/** Compteurs par categorie, pour l'accueil */
router.get("/categories", (_req, res) => {
  const rows = db
    .prepare("SELECT category, COUNT(*) AS count FROM products WHERE status = 'active' AND hidden_at IS NULL GROUP BY category")
    .all();
  res.json({ categories: rows });
});

router.get("/:id", optionalAuth, (req, res) => {
  const row = db.prepare(`${BASE_SELECT} WHERE p.id = ?`).get(req.params.id);
  const mine = row && req.user?.id === row.seller_id;
  if (!row || (!mine && (row.hidden_at || blockedIds(req.user?.id).includes(row.seller_id)))) {
    return res.status(404).json({ error: "Produit introuvable" });
  }
  // Les visites du vendeur sur sa propre annonce ne comptent pas dans ses statistiques.
  if (!mine) db.prepare("UPDATE products SET views = views + 1 WHERE id = ?").run(row.id);

  const isFavorite = req.user
    ? !!db.prepare("SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ?").get(req.user.id, row.id)
    : false;

  const similar = db
    .prepare(`${BASE_SELECT} WHERE p.category = ? AND p.id != ? AND p.status = 'active'
             AND p.hidden_at IS NULL AND u.banned_at IS NULL LIMIT 6`)
    .all(row.category, row.id)
    .map(withTiers);

  res.json({ product: { ...withTiers(row), is_favorite: isFavorite }, similar });
});

const STATUSES = ["active", "paused", "sold"];

/** Controle les champs numeriques d'une annonce ; renvoie un message d'erreur ou null. */
function invalidNumbers({ price, min_order, stock }, creating) {
  if ((creating || price !== undefined) && !(Number(price) > 0)) return "Le prix doit être supérieur à zéro";
  if (min_order !== undefined && min_order !== "" && !(Number(min_order) >= 1)) {
    return "La commande minimum doit être d'au moins 1";
  }
  if (stock !== undefined && stock !== "" && !(Number(stock) >= 0)) return "Le stock ne peut pas être négatif";
  return null;
}

function invalidTiers(tiers, price) {
  if (!Array.isArray(tiers)) return null;
  for (const t of tiers) {
    if (!(Number(t?.min_qty) >= 2) || !(Number(t?.price) > 0)) return "Palier de prix invalide";
    if (price && Number(t.price) >= Number(price)) return "Un prix dégressif doit être inférieur au prix unitaire";
  }
  return null;
}

/** Remplace les paliers d'un produit ; un seul prix par quantite (le dernier saisi l'emporte). */
function saveTiers(productId, tiers) {
  db.prepare("DELETE FROM price_tiers WHERE product_id = ?").run(productId);
  const insert = db.prepare("INSERT INTO price_tiers (product_id, min_qty, price) VALUES (?, ?, ?)");
  const byQty = new Map(tiers.map((t) => [Math.floor(Number(t.min_qty)), Math.round(Number(t.price))]));
  for (const [qty, price] of byQty) insert.run(productId, qty, price);
}

router.post("/", requireAuth, requireSeller, (req, res) => {
  const {
    title,
    description,
    category,
    unit,
    price,
    min_order,
    stock,
    region,
    prefecture,
    image_url,
    negotiable,
    delivery,
    tiers,
  } = req.body || {};

  if (!title || !category || !price) {
    return res.status(400).json({ error: "Titre, catégorie et prix sont requis" });
  }
  const invalid = invalidNumbers({ price, min_order, stock }, true) || invalidTiers(tiers, price);
  if (invalid) return res.status(400).json({ error: invalid });

  const info = db
    .prepare(
      `INSERT INTO products (seller_id, title, description, category, unit, price, min_order,
                             stock, region, prefecture, image_url, negotiable, delivery)
       VALUES (@seller_id, @title, @description, @category, @unit, @price, @min_order,
               @stock, @region, @prefecture, @image_url, @negotiable, @delivery)`,
    )
    .run({
      seller_id: req.user.id,
      title,
      description: description || null,
      category,
      unit: unit || "unite",
      price: Math.round(Number(price)),
      min_order: Number(min_order) || 1,
      stock: Number(stock) || 0,
      region: region || req.user.region || null,
      prefecture: prefecture || req.user.prefecture || null,
      image_url: image_url || null,
      negotiable: negotiable ? 1 : 0,
      delivery: delivery || null,
    });

  if (Array.isArray(tiers)) saveTiers(info.lastInsertRowid, tiers);

  const product = db.prepare(`${BASE_SELECT} WHERE p.id = ?`).get(info.lastInsertRowid);
  res.status(201).json({ product: withTiers(product) });
});

router.patch("/:id", requireAuth, (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Produit introuvable" });
  if (product.seller_id !== req.user.id) return res.status(403).json({ error: "Ce produit ne vous appartient pas" });

  const invalid =
    invalidNumbers(req.body || {}, false) || invalidTiers(req.body?.tiers, req.body?.price ?? product.price);
  if (invalid) return res.status(400).json({ error: invalid });
  if (req.body?.status !== undefined && !STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: "Statut inconnu" });
  }

  const allowed = [
    "title", "description", "category", "unit", "price", "min_order",
    "stock", "region", "prefecture", "image_url", "status", "delivery",
  ];
  const updates = [];
  const values = { id: product.id };
  for (const f of allowed) {
    if (req.body?.[f] !== undefined) {
      updates.push(`${f} = @${f}`);
      values[f] = req.body[f];
    }
  }
  if (req.body?.negotiable !== undefined) {
    updates.push("negotiable = @negotiable");
    values.negotiable = req.body.negotiable ? 1 : 0;
  }
  db.transaction(() => {
    if (updates.length) db.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = @id`).run(values);
    if (Array.isArray(req.body?.tiers)) saveTiers(product.id, req.body.tiers);
  })();

  const fresh = db.prepare(`${BASE_SELECT} WHERE p.id = ?`).get(product.id);
  res.json({ product: withTiers(fresh) });
});

router.delete("/:id", requireAuth, (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) return res.status(404).json({ error: "Produit introuvable" });
  if (product.seller_id !== req.user.id) return res.status(403).json({ error: "Ce produit ne vous appartient pas" });
  db.prepare("DELETE FROM products WHERE id = ?").run(product.id);
  res.json({ ok: true });
});

export default router;
