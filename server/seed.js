/**
 * Charge un jeu de donnees de demonstration ancre sur le marche guineen.
 * Usage : npm run seed
 */
import "./checkNode.js"; // doit rester le premier import
import bcrypt from "bcryptjs";
import db from "./db.js";

const PWD = bcrypt.hashSync("motdepasse", 10);

const IMG = {
  riz: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=70",
  huile: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=70",
  ciment: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=70",
  ananas: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=70",
  pomme: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=70",
  cafe: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=70",
  jus: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=70",
  eau: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=70",
  savon: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=70",
  pharma: "https://images.unsplash.com/photo-1549964336-67d7d7d74ac2?auto=format&fit=crop&w=600&q=70",
  tissu: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=70",
  sucre: "https://images.unsplash.com/photo-1610478920392-95888b4b7f8b?auto=format&fit=crop&w=600&q=70",
  manioc: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=70",
  poulet: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=70",
  tomate: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=70",
  fer: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=70",
};

const users = [
  {
    phone: "+224620000001",
    name: "Alpha Oumar Diallo",
    role: "importateur",
    company: "Guinee Import SARL",
    category: "alimentation",
    region: "Conakry",
    prefecture: "Matoto",
    address: "Zone industrielle, Km 8, Matoto",
    description:
      "Importateur agree depuis 2014. Riz, huile, sucre et pates en conteneurs complets, dedouanes au port de Conakry.",
    verified: 1,
    rating: 4.8,
    rating_count: 126,
  },
  {
    phone: "+224620000002",
    name: "Mariama Camara",
    role: "agriculteur",
    company: "Coopérative Foutah Vert",
    category: "agriculture",
    region: "Labé",
    prefecture: "Labé",
    address: "Marché de Labé, secteur Daka",
    description:
      "Coopérative de 240 producteurs du Fouta Djallon. Pomme de terre, oignon, tomate et fonio, récoltés à la commande.",
    verified: 1,
    rating: 4.6,
    rating_count: 74,
  },
  {
    phone: "+224620000003",
    name: "Sékou Kourouma",
    role: "industriel",
    company: "Industries Kania SA",
    category: "boissons",
    region: "Kindia",
    prefecture: "Kindia",
    address: "Route de Mambia, Kindia",
    description:
      "Unité de transformation locale : jus de fruits, eau minérale et savon de ménage. Livraison camion sur tout le pays.",
    verified: 1,
    rating: 4.9,
    rating_count: 203,
  },
  {
    phone: "+224620000004",
    name: "Fatoumata Bah",
    role: "detaillant",
    company: "Boutique Fatou Madina",
    category: "boutique",
    region: "Conakry",
    prefecture: "Matam",
    address: "Marché Madina, allée 12",
    description: "Boutique d'alimentation générale au marché Madina. Achat en gros toutes les deux semaines.",
    verified: 0,
    rating: 4.3,
    rating_count: 18,
  },
  {
    phone: "+224620000005",
    name: "Ibrahima Sylla",
    role: "importateur",
    company: "Sylla BTP Distribution",
    category: "construction",
    region: "Conakry",
    prefecture: "Ratoma",
    address: "Kipé, carrefour Constantin",
    description: "Ciment, fer à béton et tôles. Stock permanent, livraison camion 10 à 30 tonnes.",
    verified: 1,
    rating: 4.5,
    rating_count: 91,
  },
  {
    phone: "+224620000006",
    name: "Dr Aissatou Barry",
    role: "detaillant",
    company: "Pharmacie de la Corniche",
    category: "pharmacie",
    region: "Conakry",
    prefecture: "Dixinn",
    address: "Corniche Nord, Dixinn",
    description: "Officine cherchant des grossistes agréés en produits pharmaceutiques et parapharmacie.",
    verified: 1,
    rating: 4.7,
    rating_count: 42,
  },
  {
    phone: "+224620000007",
    name: "Mamadou Barry",
    role: "detaillant",
    company: "Barry & Fils Alimentation",
    category: "boutique",
    region: "Conakry",
    prefecture: "Matoto",
    address: "Marché de Matoto, bloc C",
    description: "Détaillant en alimentation générale, 3 boutiques à Matoto. Compte de démonstration.",
    verified: 1,
    rating: 4.4,
    rating_count: 27,
  },
];

const products = [
  {
    seller: 1, title: "Riz parfumé Diamant 50 kg", category: "alimentation", unit: "sac",
    price: 420000, min_order: 20, stock: 1800, image: IMG.riz, region: "Conakry", negotiable: 1,
    description: "Riz long grain parfumé importé du Vietnam, sac de 50 kg. Stock dédouané disponible au port. Prix dégressif dès 100 sacs.",
    delivery: "Livraison camion Conakry incluse dès 50 sacs",
    tiers: [{ min_qty: 20, price: 420000 }, { min_qty: 100, price: 405000 }, { min_qty: 300, price: 392000 }],
  },
  {
    seller: 1, title: "Huile végétale 20 L (carton)", category: "alimentation", unit: "carton",
    price: 265000, min_order: 10, stock: 640, image: IMG.huile, region: "Conakry", negotiable: 1,
    description: "Huile de tournesol raffinée, bidon 20 litres. Lot importé, DLC 18 mois.",
    delivery: "Retrait entrepôt Km 8 ou livraison à partir de 30 cartons",
    tiers: [{ min_qty: 10, price: 265000 }, { min_qty: 60, price: 254000 }],
  },
  {
    seller: 1, title: "Sucre cristallisé 50 kg", category: "alimentation", unit: "sac",
    price: 385000, min_order: 15, stock: 900, image: IMG.sucre, region: "Conakry", negotiable: 0,
    description: "Sucre blanc cristallisé, sac de 50 kg, qualité alimentaire. Arrivage mensuel.",
    delivery: "Livraison Conakry et Kindia",
    tiers: [{ min_qty: 15, price: 385000 }, { min_qty: 80, price: 372000 }],
  },
  {
    seller: 2, title: "Pomme de terre du Fouta 100 kg", category: "agriculture", unit: "sac",
    price: 310000, min_order: 5, stock: 220, image: IMG.pomme, region: "Labé", negotiable: 1,
    description: "Pomme de terre calibre moyen récoltée à Timbi Madina. Conditionnée en sac de 100 kg, triée et lavée.",
    delivery: "Départ Labé, transport possible vers Conakry",
    tiers: [{ min_qty: 5, price: 310000 }, { min_qty: 25, price: 295000 }],
  },
  {
    seller: 2, title: "Oignon violet local 50 kg", category: "agriculture", unit: "sac",
    price: 190000, min_order: 4, stock: 160, image: IMG.tomate, region: "Labé", negotiable: 1,
    description: "Oignon violet du Fouta, séché 10 jours, bonne conservation. Récolte de la saison en cours.",
    delivery: "Départ Labé",
  },
  {
    seller: 2, title: "Tomate fraîche cagette 25 kg", category: "agriculture", unit: "cagette",
    price: 145000, min_order: 6, stock: 90, image: IMG.tomate, region: "Labé", negotiable: 0,
    description: "Tomate de plein champ, cagette bois de 25 kg. Livraison sous 48 h après commande.",
    delivery: "Camion frigo partagé vers Conakry le mardi",
  },
  {
    seller: 2, title: "Fonio décortiqué 25 kg", category: "agriculture", unit: "sac",
    price: 275000, min_order: 4, stock: 120, image: IMG.manioc, region: "Labé", negotiable: 1,
    description: "Fonio décortiqué et vanné à la coopérative. Produit phare du Fouta, très demandé en boutique.",
    delivery: "Départ Labé, expédition possible",
    tiers: [{ min_qty: 4, price: 275000 }, { min_qty: 20, price: 262000 }],
  },
  {
    seller: 3, title: "Jus de mangue Kania 1 L — carton de 12", category: "boissons", unit: "carton",
    price: 96000, min_order: 20, stock: 1500, image: IMG.jus, region: "Kindia", negotiable: 0,
    description: "Jus de mangue 100 % pulpe, production locale Kindia. Carton de 12 bouteilles d'un litre.",
    delivery: "Livraison gratuite dès 100 cartons sur Conakry",
    tiers: [{ min_qty: 20, price: 96000 }, { min_qty: 100, price: 90000 }, { min_qty: 400, price: 84000 }],
  },
  {
    seller: 3, title: "Eau minérale 1,5 L — pack de 6", category: "boissons", unit: "pack",
    price: 32000, min_order: 50, stock: 4200, image: IMG.eau, region: "Kindia", negotiable: 0,
    description: "Eau de source embouteillée à Kindia, pack thermo-rétracté de 6 bouteilles de 1,5 L.",
    delivery: "Camion 20 t disponible pour Conakry, Boké et Mamou",
    tiers: [{ min_qty: 50, price: 32000 }, { min_qty: 300, price: 29500 }],
  },
  {
    seller: 3, title: "Savon de ménage 400 g — carton de 40", category: "industriel", unit: "carton",
    price: 178000, min_order: 10, stock: 700, image: IMG.savon, region: "Kindia", negotiable: 1,
    description: "Savon de ménage fabriqué en Guinée, barre de 400 g, carton de 40 unités.",
    delivery: "Livraison nationale sous 5 jours",
  },
  {
    seller: 5, title: "Ciment CPJ 42,5 — sac de 50 kg", category: "construction", unit: "sac",
    price: 78000, min_order: 50, stock: 6000, image: IMG.ciment, region: "Conakry", negotiable: 1,
    description: "Ciment portland CPJ 42,5, sac de 50 kg. Stock permanent à Kipé, chargement immédiat.",
    delivery: "Camion 10 t, 20 t ou 30 t — livraison Conakry et intérieur",
    tiers: [{ min_qty: 50, price: 78000 }, { min_qty: 400, price: 74500 }, { min_qty: 1000, price: 71000 }],
  },
  {
    seller: 5, title: "Fer à béton 12 mm — barre de 12 m", category: "construction", unit: "barre",
    price: 92000, min_order: 30, stock: 2400, image: IMG.fer, region: "Conakry", negotiable: 1,
    description: "Fer à béton haute adhérence 12 mm, barres de 12 mètres, norme importée.",
    delivery: "Enlèvement Kipé ou livraison sur chantier",
    tiers: [{ min_qty: 30, price: 92000 }, { min_qty: 200, price: 88000 }],
  },
  {
    seller: 1, title: "Pâtes alimentaires 500 g — carton de 20", category: "alimentation", unit: "carton",
    price: 118000, min_order: 15, stock: 830, image: IMG.riz, region: "Conakry", negotiable: 0,
    description: "Spaghetti 500 g, carton de 20 paquets. Rotation rapide en boutique de quartier.",
    delivery: "Retrait entrepôt ou livraison Conakry",
  },
  {
    seller: 3, title: "Poulet congelé 10 kg — carton", category: "alimentation", unit: "carton",
    price: 340000, min_order: 8, stock: 260, image: IMG.poulet, region: "Kindia", negotiable: 1,
    description: "Cuisses de poulet congelées, carton de 10 kg, chaîne du froid respectée.",
    delivery: "Camion frigorifique, livraison Conakry le jeudi",
  },
  {
    seller: 6, title: "Paracétamol 500 mg — boîte de 100 blisters", category: "pharmacie", unit: "carton",
    price: 265000, min_order: 5, stock: 140, image: IMG.pharma, region: "Conakry", negotiable: 0,
    description: "Produit sous autorisation. Réservé aux pharmacies et dépôts agréés, licence exigée à la commande.",
    delivery: "Livraison sécurisée Conakry uniquement",
  },
  {
    seller: 2, title: "Café Ziama vert — sac de 60 kg", category: "agriculture", unit: "sac",
    price: 1450000, min_order: 2, stock: 45, image: IMG.cafe, region: "N'Zérékoré", negotiable: 1,
    description: "Café robusta de la forêt de Ziama, grain vert trié, sac de 60 kg. Lot export.",
    delivery: "Départ N'Zérékoré, groupage vers Conakry",
    tiers: [{ min_qty: 2, price: 1450000 }, { min_qty: 10, price: 1385000 }],
  },
  {
    seller: 5, title: "Tissu wax 6 yards — lot de 20 pagnes", category: "textile", unit: "lot",
    price: 1600000, min_order: 1, stock: 60, image: IMG.tissu, region: "Conakry", negotiable: 1,
    description: "Wax imprimé 6 yards, assortiment de motifs, lot de 20 pagnes. Idéal revente au marché.",
    delivery: "Retrait Kipé ou envoi par transporteur",
  },
  {
    seller: 2, title: "Ananas Baronne — cageot de 12 pièces", category: "agriculture", unit: "cageot",
    price: 105000, min_order: 10, stock: 180, image: IMG.ananas, region: "Kindia", negotiable: 0,
    description: "Ananas Baronne de Friguiagbé, calibre export, cageot de 12 fruits.",
    delivery: "Livraison Conakry deux fois par semaine",
    tiers: [{ min_qty: 10, price: 105000 }, { min_qty: 50, price: 98000 }],
  },
];

function seed() {
  const reset = db.transaction(() => {
    db.exec(`
      DELETE FROM messages; DELETE FROM conversations;
      DELETE FROM order_events; DELETE FROM order_items; DELETE FROM orders;
      DELETE FROM favorites; DELETE FROM reviews;
      DELETE FROM price_tiers; DELETE FROM products; DELETE FROM users;
      DELETE FROM sqlite_sequence;
    `);

    const insertUser = db.prepare(`
      INSERT INTO users (phone, password_hash, name, role, company, category, region, prefecture,
                         address, description, verified, rating, rating_count)
      VALUES (@phone, @hash, @name, @role, @company, @category, @region, @prefecture,
              @address, @description, @verified, @rating, @rating_count)
    `);
    for (const u of users) insertUser.run({ ...u, hash: PWD });

    const insertProduct = db.prepare(`
      INSERT INTO products (seller_id, title, description, category, unit, price, min_order,
                            stock, region, image_url, negotiable, delivery, views)
      VALUES (@seller, @title, @description, @category, @unit, @price, @min_order,
              @stock, @region, @image, @negotiable, @delivery, @views)
    `);
    const insertTier = db.prepare("INSERT INTO price_tiers (product_id, min_qty, price) VALUES (?, ?, ?)");

    // node:sqlite refuse les cles qui ne correspondent a aucun parametre nomme :
    // on construit donc explicitement l'objet de liaison.
    products.forEach((p) => {
      const info = insertProduct.run({
        seller: p.seller,
        title: p.title,
        description: p.description,
        category: p.category,
        unit: p.unit,
        price: p.price,
        min_order: p.min_order,
        stock: p.stock,
        region: p.region,
        image: p.image,
        negotiable: p.negotiable ? 1 : 0,
        delivery: p.delivery || null,
        views: 20 + Math.floor(Math.random() * 400),
      });
      for (const t of p.tiers || []) insertTier.run(info.lastInsertRowid, t.min_qty, t.price);
    });

    // Une commande livrée + une commande en cours pour le compte de démonstration (id 7)
    const buyerId = 7;
    const makeOrder = (sellerId, lines, status, ref) => {
      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
      const fee = 150000;
      const info = db
        .prepare(
          `INSERT INTO orders (reference, buyer_id, seller_id, status, subtotal, delivery_fee, total,
                               delivery_mode, payment_method, region, prefecture, address, contact_phone)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'livraison', 'orange_money', 'Conakry', 'Matoto',
                   'Marché de Matoto, bloc C', '+224620000007')`,
        )
        .run(ref, buyerId, sellerId, status, subtotal, fee, subtotal + fee);
      const orderId = info.lastInsertRowid;
      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, product_id, title, image_url, unit, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const l of lines) {
        const p = db.prepare("SELECT * FROM products WHERE id = ?").get(l.productId);
        insertItem.run(orderId, p.id, p.title, p.image_url, p.unit, l.qty, l.price);
      }
      const steps =
        status === "livree"
          ? ["en_attente", "confirmee", "en_preparation", "en_route", "livree"]
          : ["en_attente", "confirmee", "en_preparation"];
      const labels = {
        en_attente: "Commande reçue",
        confirmee: "Commande confirmée par le vendeur",
        en_preparation: "Colis en préparation",
        en_route: "Colis en route",
        livree: "Colis livré",
      };
      for (const s of steps) {
        db.prepare("INSERT INTO order_events (order_id, status, label) VALUES (?, ?, ?)").run(orderId, s, labels[s]);
      }
      return orderId;
    };

    makeOrder(1, [{ productId: 1, qty: 40, price: 420000 }], "livree", "GN-A1B2C3");
    makeOrder(3, [
      { productId: 8, qty: 60, price: 96000 },
      { productId: 9, qty: 100, price: 32000 },
    ], "en_preparation", "GN-D4E5F6");

    // Conversations de démonstration
    const conv = db.prepare("INSERT INTO conversations (buyer_id, seller_id, product_id) VALUES (?, ?, ?)");
    const msg = db.prepare(
      "INSERT INTO messages (conversation_id, sender_id, body, read_at) VALUES (?, ?, ?, ?)",
    );

    const c1 = conv.run(buyerId, 1, 1).lastInsertRowid;
    msg.run(c1, buyerId, "Bonjour, le riz Diamant est-il encore disponible en 100 sacs ?", "2026-07-30 09:00:00");
    msg.run(c1, 1, "Bonjour Mamadou. Oui, stock dispo au Km 8. À 100 sacs je vous fais 405 000 GNF le sac.", "2026-07-30 09:12:00");
    msg.run(c1, buyerId, "Parfait. Livraison possible au marché de Matoto cette semaine ?", null);

    const c2 = conv.run(buyerId, 3, 8).lastInsertRowid;
    msg.run(c2, 3, "Votre commande de jus Kania est en préparation, départ camion demain matin.", null);

    const c3 = conv.run(buyerId, 2, 4).lastInsertRowid;
    msg.run(c3, buyerId, "Bonjour, quel est le prix de la pomme de terre pour 30 sacs ?", "2026-08-01 14:00:00");
    msg.run(c3, 2, "Bonjour, à partir de 25 sacs c'est 295 000 GNF le sac, départ Labé.", null);

    // Favoris
    db.prepare("INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)").run(buyerId, 11);
    db.prepare("INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)").run(buyerId, 4);
  });

  reset();

  const counts = {
    utilisateurs: db.prepare("SELECT COUNT(*) AS n FROM users").get().n,
    produits: db.prepare("SELECT COUNT(*) AS n FROM products").get().n,
    commandes: db.prepare("SELECT COUNT(*) AS n FROM orders").get().n,
    conversations: db.prepare("SELECT COUNT(*) AS n FROM conversations").get().n,
  };
  console.log("Donnees de demonstration chargees :", counts);
  console.log("Connexion de test  ->  telephone : 620000007   mot de passe : motdepasse");
}

seed();
