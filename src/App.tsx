import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/feedback";

import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import ProfileType from "@/pages/ProfileType";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import ProductDetail from "@/pages/ProductDetail";
import Publish from "@/pages/Publish";
import Messages from "@/pages/Messages";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import SellerPublic from "@/pages/SellerPublic";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderTracking from "@/pages/OrderTracking";
import Favorites from "@/pages/Favorites";
import SellerDashboard from "@/pages/seller/Dashboard";
import SellerListings from "@/pages/seller/Listings";
import SellerOrders from "@/pages/seller/Orders";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner className="min-h-dvh" />;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/accueil" replace state={{ from: location }} /> : <Onboarding />}
      />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<ProfileType />} />
      <Route path="/inscription/:role" element={<Register />} />

      {/* Pages avec barre de navigation basse */}
      <Route element={<AppLayout />}>
        <Route path="/accueil" element={<Home />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/profil" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/publier" element={<RequireAuth seller><Publish /></RequireAuth>} />
      </Route>

      {/* Pages plein écran */}
      <Route path="/produit/:id" element={<ProductDetail />} />
      <Route path="/vendeur/:id" element={<SellerPublic />} />
      <Route path="/panier" element={<Cart />} />
      <Route path="/commander" element={<RequireAuth><Checkout /></RequireAuth>} />
      <Route path="/commandes" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/commande/:id" element={<RequireAuth><OrderTracking /></RequireAuth>} />
      <Route path="/favoris" element={<RequireAuth><Favorites /></RequireAuth>} />
      <Route path="/messages/:id" element={<RequireAuth><Chat /></RequireAuth>} />
      <Route path="/publier/:id" element={<RequireAuth seller><Publish /></RequireAuth>} />

      <Route path="/espace-vendeur" element={<RequireAuth seller><SellerDashboard /></RequireAuth>} />
      <Route path="/espace-vendeur/annonces" element={<RequireAuth seller><SellerListings /></RequireAuth>} />
      <Route path="/espace-vendeur/commandes" element={<RequireAuth seller><SellerOrders /></RequireAuth>} />

      <Route path="*" element={<Navigate to={user ? "/accueil" : "/"} replace />} />
    </Routes>
  );
}
