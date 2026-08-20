import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Ecoute sur toutes les interfaces reseau, pas seulement localhost :
    // le telephone peut ainsi ouvrir l'application via l'IP locale du PC,
    // avec le rechargement a chaud. Vite affiche l'adresse "Network" au demarrage.
    host: true,
    port: 5173,

    // Pour exposer le serveur via un tunnel (trycloudflare, ngrok, localtunnel),
    // ajoutez ici le domaine fourni, sinon Vite refusera la requete :
    // allowedHosts: ["mon-tunnel.trycloudflare.com"],

    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
