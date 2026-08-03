import { Link } from "react-router-dom";
import { BadgeCheck, Heart, MapPin, Package } from "lucide-react";
import { cn, formatGNF } from "@/lib/utils";
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
        className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 active:scale-[0.99] transition"
      >
        <Thumb product={product} className="size-24 rounded-xl" />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <h3 className="flex-1 font-semibold text-sm leading-5 line-clamp-2">{product.title}</h3>
            {onToggleFavorite ? <FavButton product={product} onToggle={onToggleFavorite} /> : null}
          </div>
          <p className="font-bold text-brand text-base leading-6">
            {formatGNF(product.price)}
            <span className="font-normal text-zinc-500 text-xs"> / {product.unit}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
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
      className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white active:scale-[0.99] transition"
    >
      <div className="relative">
        <Thumb product={product} className="h-32 w-full" rounded={false} />
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
          <span className="font-normal text-zinc-500 text-[11px]"> / {product.unit}</span>
        </p>
        <SellerLine product={product} />
      </div>
    </Link>
  );
}

function Thumb({
  product,
  className,
  rounded = true,
}: {
  product: Product;
  className?: string;
  rounded?: boolean;
}) {
  if (!product.image_url) {
    return (
      <div
        className={cn(
          "bg-zinc-100 text-zinc-300 flex items-center justify-center shrink-0",
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
      src={product.image_url}
      alt={product.title}
      loading="lazy"
      className={cn("object-cover shrink-0 bg-zinc-100", rounded && "rounded-xl", className)}
    />
  );
}

function SellerLine({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-zinc-500 truncate">
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
        className={cn("size-4", product.is_favorite ? "fill-rose-500 text-rose-500" : "text-zinc-400")}
      />
    </button>
  );
}
