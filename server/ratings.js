import db from "./db.js";

/**
 * Recalcule la note moyenne d'un vendeur. Les avis masques par la moderation
 * ne comptent pas : un avis retire ne doit plus peser sur la note.
 */
export function refreshRating(sellerId) {
  const agg = db
    .prepare("SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE seller_id = ? AND hidden_at IS NULL")
    .get(sellerId);
  const rating = agg.n ? Math.round(agg.avg * 10) / 10 : 0;
  db.prepare("UPDATE users SET rating = ?, rating_count = ? WHERE id = ?").run(rating, agg.n, sellerId);
  return { rating, count: agg.n };
}
