import "./checkNode.js"; // doit rester le premier import
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";

import db from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import messageRoutes from "./routes/messages.js";
import miscRoutes from "./routes/misc.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  const users = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  const products = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
  res.json({ ok: true, users, products });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/conversations", messageRoutes);
app.use("/api", miscRoutes);

// Sert le front compile si `npm run build` a ete lance.
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use((_req, res) => res.status(404).json({ error: "Route inconnue" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Erreur serveur" });
});

app.listen(PORT, () => {
  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  console.log(`API SooniGN sur http://localhost:${PORT}`);
  if (count === 0) console.log("Base vide — lancez `npm run seed` pour charger les donnees de demonstration.");
});
