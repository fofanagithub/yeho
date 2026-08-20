import { Link } from "react-router-dom";
import { BadgeCheck, Heart, MapPin, Package } from "lucide-react";
import { cn, formatGNF } from "@/lib/utils";
import { imageSrcSet, imageUrl, TAILLES } from "@/lib/image";
import type { Product } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/constants";

export function ProductCard({
  product,
  onToggleFavorite,
  variant = "grid",
}: {
  product: Product;
  onToggleFavorite?: (product: Product) => void;
  variant?: "grid" | "row";
}) {
  const category = CATEGORY_MAP[product.category];

  if (variant === "row") {
    return (
      <Link
        to={`/produit/${product.id}`}
        className="flex gap-3 rounded-2xl border border-line bg-surface p-3 active:scale-[0.99] transition"
      >
        <Thumb product={product} width={TAILLES.vignetteListe} className="size-24 rounded-xl" />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <h3 className="flex-1 font-semibold text-sm leading-5 line-clamp-2">{product.title}</h3>
            {onToggleFavorite ? <FavButton product={product} onToggle={onToggleFavorite} /> : null}
          </div>
          <p className="font-bold text-brand text-base leading-6">
            {formatGNF(product.price)}
            <span className="font-normal text-muted text-xs"> / {product.unit}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Package className="size-3" />
              min. {product.min_order}
            </span>
            {product.region ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {product.region}
              </span>
            ) : null}
          </div>
          <SellerLine product={product} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/produit/${product.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface active:scale-[0.99] transition"
    >
      <div className="relative">
        {/* aspect-[4/3] : la hauteur suit la largeur de la carte, donc la meme
            proportion sur un petit Android comme sur un grand ecran. */}
        <Thumb
          product={product}
          width={TAILLES.carteGrille}
          className="aspect-[4/3] w-full"
          rounded={false}
        />
        {category ? (
          <span
            className={cn(
              "absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              category.color,
            )}
          >
            {category.label}
          </span>
        ) : null}
        {onToggleFavorite ? (
          <div className="absolute top-2 right-2">
            <FavButton product={product} onToggle={onToggleFavorite} solid />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-semibold text-sm leading-5 line-clamp-2 min-h-10">{product.title}</h3>
        <p className="font-bold text-brand text-sm leading-5">
          {formatGNF(product.price)}
          <span className="font-normal text-muted text-[11px]"> / {product.unit}</span>
        </p>
        <SellerLine product={product} />
      </div>
    </Link>
  );
}

function Thumb({
  product,
  width,
  className,
  rounded = true,
}: {
  product: Product;
  width: number;
  className?: string;
  rounded?: boolean;
}) {
  if (!product.image_url) {
    return (
      <div
        className={cn(
          "bg-subtle text-faint flex items-center justify-center shrink-0",
          rounded && "rounded-xl",
          className,
        )}
      >
        <Package className="size-7" />
      </div>
    );
  }
  return (
    <img
      src={imageUrl(product.image_url, width)}
      srcSet={imageSrcSet(product.image_url, width)}
      alt={product.title}
      loading="lazy"
      decoding="async"
      className={cn("object-cover shrink-0 bg-subtle", rounded && "rounded-xl", className)}
    />
  );
}

function SellerLine({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-muted truncate">
      <span className="truncate">{product.seller_company || product.seller_name}</span>
      {product.seller_verified ? <BadgeCheck className="size-3 shrink-0 text-brand" /> : null}
    </div>
  );
}

function FavButton({
  product,
  onToggle,
  solid,
}: {
  product: Product;
  onToggle: (p: Product) => void;
  solid?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(product);
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition",
        solid ? "size-7 bg-white/90 shadow-sm" : "size-6",
      )}
      aria-label="Ajouter aux favoris"
    >
      <Heart
        className={cn("size-4", product.is_favorite ? "fill-rose-500 text-rose-500" : "text-faint")}
      />
    </button>
  );
}
