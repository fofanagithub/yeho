import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  ChevronLeft,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge, Spinner } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/avatar";
import { ProductCard } from "@/components/ProductCard";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { imageSrcSet, imageUrl, TAILLES } from "@/lib/image";
import { cn, formatGNF, formatNumber } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .product(id!)
      .then(({ product, similar }) => {
        if (!alive) return;
        setProduct(product);
        setSimilar(similar);
        setQuantity(product.min_order);
      })
      .catch(() => toast("Produit introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, toast]);

  const unitPrice = useCallback(
    (qty: number) => {
      if (!product?.tiers?.length) return product?.price ?? 0;
      const tier = [...product.tiers].filter((t) => t.min_qty <= qty).pop();
      return tier?.price ?? product.price;
    },
    [product],
  );

  async function toggleFavorite() {
    if (!product) return;
    if (!user) return toast("Connectez-vous pour enregistrer vos favoris", "info");
    const next = !product.is_favorite;
    setProduct({ ...product, is_favorite: next });
    try {
      if (next) await api.addFavorite(product.id);
      else await api.removeFavorite(product.id);
    } catch {
      toast("Action impossible", "error");
    }
  }

  async function contactSeller() {
    if (!product) return;
    if (!user) return navigate("/connexion", { state: { from: `/produit/${product.id}` } });
    if (user.id === product.seller_id) return toast("C'est votre propre annonce", "info");
    setContacting(true);
    try {
      const { conversation } = await api.startConversation({
        seller_id: product.seller_id,
        product_id: product.id,
      });
      navigate(`/messages/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    } finally {
      setContacting(false);
    }
  }

  function addToCart() {
    if (!product) return;
    add(product, quantity);
    toast(`${quantity} ${product.unit}${quantity > 1 ? "s" : ""} ajouté(s) au panier`);
  }

  if (loading) {
    return (
      <PhoneShell padBottom={false}>
        <Spinner className="min-h-dvh" />
      </PhoneShell>
    );
  }

  if (!product) {
    return (
      <PhoneShell padBottom={false}>
        <div className="p-8 text-center text-sm text-muted">
          Ce produit n'existe plus.{" "}
          <Link to="/recherche" className="font-semibold text-brand">
            Retour à la recherche
          </Link>
        </div>
      </PhoneShell>
    );
  }

  const category = CATEGORY_MAP[product.category];
  const price = unitPrice(quantity);
  const total = price * quantity;
  const isOwner = user?.id === product.seller_id;

  return (
    <PhoneShell className="pb-32">
      {/* Image + actions flottantes */}
      <div className="relative">
        {product.image_url ? (
          <img src={imageUrl(product.image_url, TAILLES.ficheProduit)} srcSet={imageSrcSet(product.image_url, TAILLES.ficheProduit)} sizes="(max-width: 28rem) 100vw, 28rem" alt={product.title} fetchPriority="high" decoding="async" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="h-72 w-full bg-subtle flex items-center justify-center text-faint">
            <Package className="size-12" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[calc(1rem+var(--safe-top))] safe-x">
          <button
            onClick={() => navigate(-1)}
            className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
            aria-label="Retour"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={toggleFavorite}
            className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
            aria-label="Favori"
          >
            <Heart className={cn("size-5", product.is_favorite ? "fill-rose-500 text-rose-500" : "text-muted")} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", category.color)}>
                {category.label}
              </span>
            ) : null}
            {product.negotiable ? <Badge variant="muted">Prix négociable</Badge> : null}
            {product.stock > 0 ? (
              <Badge variant="outline">{formatNumber(product.stock)} en stock</Badge>
            ) : (
              <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">Rupture</Badge>
            )}
          </div>
          <h1 className="font-bold text-xl leading-7">{product.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            {product.region ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {product.prefecture ? `${product.prefecture}, ` : ""}
                {product.region}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatNumber(product.views)} vues
            </span>
            <span className="inline-flex items-center gap-1">
              <Package className="size-3.5" />
              commande minimum {product.min_order} {product.unit}
            </span>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <span className="font-extrabold text-brand text-2xl leading-8">{formatGNF(price)}</span>
          <span className="pb-1 text-sm text-muted">/ {product.unit}</span>
          {price < product.price ? (
            <span className="pb-1 text-sm text-faint line-through">{formatGNF(product.price)}</span>
          ) : null}
        </div>

        {/* Prix dégressifs */}
        {product.tiers?.length ? (
          <div className="rounded-2xl border border-line overflow-hidden">
            <div className="bg-subtle-soft px-4 py-2.5 text-xs font-semibold text-muted">
              Prix dégressifs par quantité
            </div>
            <div className="divide-y divide-line-soft">
              {product.tiers.map((t) => (
                <div
                  key={t.min_qty}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-sm",
                    quantity >= t.min_qty && price === t.price && "bg-brand/5",
                  )}
                >
                  <span className="text-muted">
                    À partir de {t.min_qty} {product.unit}
                  </span>
                  <span className="font-semibold">{formatGNF(t.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantité */}
        <div className="flex items-center justify-between rounded-2xl border border-line p-3.5">
          <div>
            <p className="font-semibold text-sm">Quantité</p>
            <p className="text-xs text-muted">
              Total : <span className="font-semibold text-fg-soft">{formatGNF(total)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(product.min_order, q - 1))}
              className="size-9 rounded-lg border border-line flex items-center justify-center disabled:opacity-40"
              disabled={quantity <= product.min_order}
              aria-label="Diminuer"
            >
              <Minus className="size-4" />
            </button>
            <input
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.min_order, Number(e.target.value) || product.min_order))}
              inputMode="numeric"
              className="w-14 text-center font-semibold text-sm outline-none"
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="size-9 rounded-lg border border-line flex items-center justify-center"
              aria-label="Augmenter"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {product.description ? (
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-base">Description</h2>
            <p className="text-sm leading-relaxed text-muted whitespace-pre-line">{product.description}</p>
          </div>
        ) : null}

        {product.delivery ? (
          <div className="flex items-start gap-3 rounded-2xl bg-subtle-soft p-4">
            <Truck className="size-5 shrink-0 text-brand" />
            <div>
              <p className="font-semibold text-sm">Livraison</p>
              <p className="text-xs leading-snug text-muted">{product.delivery}</p>
            </div>
          </div>
        ) : null}

        {/* Vendeur */}
        <Link
          to={`/vendeur/${product.seller_id}`}
          className="flex items-center gap-3 rounded-2xl border border-line p-4"
        >
          <Avatar
            name={product.seller_company || product.seller_name}
            src={product.seller_avatar}
            size={48}
            verified={product.seller_verified}
          />
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1 font-semibold text-sm truncate">
              {product.seller_company || product.seller_name}
              {product.seller_verified ? <BadgeCheck className="size-4 shrink-0 text-brand" /> : null}
            </p>
            <p className="text-xs text-muted capitalize">
              {product.seller_role} · {product.seller_region}
            </p>
            {product.seller_rating ? (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-amber-600">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                {product.seller_rating.toFixed(1)}
              </p>
            ) : null}
          </div>
          <span className="text-xs font-medium text-brand">Voir la boutique</span>
        </Link>

        <div className="flex items-start gap-3 rounded-2xl bg-brand/5 border border-brand/20 p-4">
          <ShieldCheck className="size-5 shrink-0 text-brand" />
          <p className="text-xs leading-snug text-muted">
            Paiement protégé : les fonds ne sont versés au vendeur qu'une fois la livraison confirmée.
          </p>
        </div>

        {similar.length ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-base">Produits similaires</h2>
            <div className="scroll-x -mx-5 flex gap-3 px-5 pb-2">
              {similar.map((p) => (
                <div key={p.id} className="w-40 shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Barre d'action fixe */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-line bg-surface/95 p-4 pb-[calc(1rem+var(--safe-bottom))] backdrop-blur safe-x">
        {isOwner ? (
          <Button className="w-full" size="lg" onClick={() => navigate("/espace-vendeur/annonces")}>
            Gérer mon annonce
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" className="flex-1" loading={contacting} onClick={contactSeller}>
              <MessageCircle className="size-5" />
              Contacter
            </Button>
            <Button size="lg" className="flex-1" onClick={addToCart} disabled={product.stock === 0}>
              <ShoppingCart className="size-5" />
              Commander
            </Button>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}
