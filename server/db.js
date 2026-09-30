/**
 * Couche base de donnees.
 *
 * On utilise `node:sqlite`, le moteur SQLite integre a Node (22.5+ / 24).
 * Aucun module natif a compiler : pas de node-gyp, pas de Visual Studio,
 * pas de binaire precompile a trouver pour chaque version de Node.
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

/** YEHOO_DB permet de pointer une base separee (utilise par les tests). */
export const DB_PATH = process.env.YEHOO_DB
  ? path.resolve(process.env.YEHOO_DB)
  : path.join(dataDir, "yehoo.db");

const sqlite = new DatabaseSync(DB_PATH);
sqlite.exec("PRAGMA journal_mode = WAL");
sqlite.exec("PRAGMA foreign_keys = ON");

sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  phone         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('importateur','agriculteur','industriel','detaillant','particulier')),
  company       TEXT,
  category      TEXT,
  region        TEXT,
  prefecture    TEXT,
  address       TEXT,
  description   TEXT,
  avatar_url    TEXT,
  email         TEXT,
  verified      INTEGER NOT NULL DEFAULT 0,
  rating        REAL NOT NULL DEFAULT 0,
  rating_count  INTEGER NOT NULL DEFAULT 0,
  meta          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT NOT NULL,
  unit         TEXT NOT NULL DEFAULT 'unite',
  price        INTEGER NOT NULL,
  min_order    INTEGER NOT NULL DEFAULT 1,
  stock        INTEGER NOT NULL DEFAULT 0,
  region       TEXT,
  prefecture   TEXT,
  image_url    TEXT,
  negotiable   INTEGER NOT NULL DEFAULT 0,
  delivery     TEXT,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','sold')),
  views        INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS price_tiers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_qty    INTEGER NOT NULL,
  price      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  reference       TEXT NOT NULL UNIQUE,
  buyer_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'en_attente'
                  CHECK (status IN ('en_attente','confirmee','en_preparation','en_route','livree','annulee')),
  subtotal        INTEGER NOT NULL DEFAULT 0,
  delivery_fee    INTEGER NOT NULL DEFAULT 0,
  total           INTEGER NOT NULL DEFAULT 0,
  delivery_mode   TEXT NOT NULL DEFAULT 'livraison',
  payment_method  TEXT NOT NULL DEFAULT 'orange_money',
  region          TEXT,
  prefecture      TEXT,
  address         TEXT,
  contact_phone   TEXT,
  note            TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  title      TEXT NOT NULL,
  image_url  TEXT,
  unit       TEXT,
  quantity   INTEGER NOT NULL,
  unit_price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS order_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  label      TEXT NOT NULL,
  detail     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (buyer_id, seller_id, product_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  read_at         TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL,
  comment    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Moderation (exigence App Store 1.2 pour le contenu publie par les utilisateurs)
CREATE TABLE IF NOT EXISTS reports (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type  TEXT NOT NULL CHECK (target_type IN ('product','user','message','review')),
  target_id    INTEGER NOT NULL,
  reason       TEXT NOT NULL,
  details      TEXT,
  status       TEXT NOT NULL DEFAULT 'ouvert' CHECK (status IN ('ouvert','traite','rejete')),
  resolution   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at  TEXT,
  UNIQUE (reporter_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
`);

/**
 * sans_accent(texte) : minuscules sans accents, pour une recherche qui trouve
 * « Pâtes » en tapant « pates » (beaucoup tapent sans accents sur telephone).
 */
export function sansAccent(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

sqlite.function("sans_accent", { deterministic: true }, (value) => (value == null ? null : sansAccent(value)));

/**
 * Colonnes ajoutees apres coup : CREATE TABLE IF NOT EXISTS ne touche pas une
 * base existante, on les ajoute donc a la main si elles manquent.
 */
function addColumn(table, column, definition) {
  const exists = sqlite
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .some((c) => c.name === column);
  if (!exists) sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

addColumn("users", "terms_accepted_at", "TEXT");
addColumn("users", "banned_at", "TEXT");
addColumn("users", "deleted_at", "TEXT");
addColumn("products", "hidden_at", "TEXT");
addColumn("reviews", "hidden_at", "TEXT");

/**
 * Petite facade au-dessus de DatabaseSync.
 * `node:sqlite` n'offre pas d'assistant de transaction : on le fournit ici,
 * avec la meme signature que celle utilisee dans les routes.
 */
const db = {
  prepare: (sql) => sqlite.prepare(sql),
  exec: (sql) => sqlite.exec(sql),

  /** db.transaction(fn) renvoie une fonction qui execute fn dans BEGIN/COMMIT. */
  transaction:
    (fn) =>
    (...args) => {
      sqlite.exec("BEGIN");
      try {
        const result = fn(...args);
        sqlite.exec("COMMIT");
        return result;
      } catch (error) {
        try {
          sqlite.exec("ROLLBACK");
        } catch {
          /* la transaction etait deja terminee */
        }
        throw error;
      }
    },

  close: () => sqlite.close(),
};

export default db;
