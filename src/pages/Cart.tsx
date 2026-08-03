import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Store, Trash2, Truck } from "lucide-react";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatGNF } from "@/lib/utils";

const DELIVERY_FEE = 150000;

export default function Cart() {
  const navigate = useNavigate();
  const { lines, bySeller, subtotal, setQuantity, remove, clear, unitPrice } = useCart();
  const { user } = useAuth();

  if (!lines.length) {
    return (
      <PhoneShell padBottom={false}>
        <TopBar title="Mon panier" />
        <EmptyState
          icon={<ShoppingCart className="size-6" />}
          title="Votre panier est vide"
          description="Parcourez les annonces et ajoutez les produits que vous souhaitez commander en gros."
          action={
            <Link to="/recherche">
              <Button size="sm">Découvrir les produits</Button>
            </Link>
          }
        />
      </PhoneShell>
    );
  }

  const fees = bySeller.length * DELIVERY_FEE;

  return (
    <PhoneShell className="pb-44">
      <TopBar
        title="Mon panier"
        subtitle={`${lines.length} produit${lines.length > 1 ? "s" : ""} · ${bySeller.length} vendeur${bySeller.length > 1 ? "s" : ""}`}
        right={
          <button onClick={clear} className="text-xs font-medium text-rose-600">
            Vider
          </button>
        }
      />

      <div className="flex flex-col gap-4 p-5">
        {bySeller.map((group) => (
          <div key={group.seller_id} className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
              <Store className="size-4 text-brand" />
              <Link to={`/vendeur/${group.seller_id}`} className="flex-1 truncate text-sm font-semibold">
                {group.seller_name}
              </Link>
              <span className="text-xs text-zinc-500">{formatGNF(group.subtotal, { short: true })}</span>
            </div>

            <div className="divide-y divide-zinc-100">
              {group.lines.map((line) => {
                const price = unitPrice(line);
                return (
                  <div key={line.product_id} className="flex gap-3 p-3.5">
                    {line.image_url ? (
                      <img src={line.image_url} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="size-20 shrink-0 rounded-xl bg-zinc-100" />
                    )}
                    <div className="flex flex-1 min-w-0 flex-col gap-1.5">
                      <div className="flex items-start gap-2">
                        <Link
                          to={`/produit/${line.product_id}`}
                          className="flex-1 text-sm font-semibold leading-5 line-clamp-2"
                        >
                          {line.title}
                        </Link>
                        <button
                          onClick={() => remove(line.product_id)}
                          className="text-zinc-400 hover:text-rose-500"
                          aria-label="Retirer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-brand">
                        {formatGNF(price)}
                        <span className="text-xs font-normal text-zinc-500"> / {line.unit}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQuantity(line.product_id, line.quantity - 1)}
                            disabled={line.quantity <= line.min_order}
                            className="size-7 rounded-lg border border-zinc-200 flex items-center justify-center disabled:opacity-40"
                            aria-label="Diminuer"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{line.quantity}</span>
                          <button
                            onClick={() => setQuantity(line.product_id, line.quantity + 1)}
                            className="size-7 rounded-lg border border-zinc-200 flex items-center justify-center"
                            aria-label="Augmenter"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatGNF(price * line.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {bySeller.length > 1 ? (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <Truck className="size-5 shrink-0 text-amber-600" />
            <p className="text-xs leading-snug text-amber-800">
              Votre panier contient des produits de {bySeller.length} vendeurs différents : une commande
              distincte sera créée pour chacun, avec ses propres frais de livraison.
            </p>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-zinc-200 bg-white p-5 pb-[calc(1.25rem+var(--safe-bottom))]">
        <div className="mb-1 flex items-center justify-between text-sm text-zinc-500">
          <span>Sous-total</span>
          <span>{formatGNF(subtotal)}</span>
        </div>
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
          <span>Livraison estimée</span>
          <span>{formatGNF(fees)}</span>
        </div>
        <div className="mb-4 flex items-center justify-between border-t border-zinc-100 pt-2">
          <span className="font-semibold">Total</span>
          <span className="font-extrabold text-brand text-lg">{formatGNF(subtotal + fees)}</span>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate(user ? "/commander" : "/connexion", { state: { from: "/commander" } })}
        >
          Passer la commande
        </Button>
      </div>
    </PhoneShell>
  );
}
