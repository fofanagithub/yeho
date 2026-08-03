import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, MapPin, MessageCircle, Package, Phone, Star } from "lucide-react";
import { api } from "@/lib/api";
import type { Product, User } from "@/lib/types";
import { ROLE_MAP } from "@/lib/constants";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Spinner } from "@/components/ui/feedback";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, timeAgo } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  author_name: string;
  created_at: string;
}

export default function SellerPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sales, setSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .seller(id!)
      .then(({ seller, products, reviews, sales }) => {
        if (!alive) return;
        setSeller(seller);
        setProducts(products);
        setReviews(reviews);
        setSales(sales);
      })
      .catch(() => toast("Vendeur introuvable", "error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, toast]);

  async function contact() {
    if (!seller) return;
    if (!user) return navigate("/connexion", { state: { from: `/vendeur/${seller.id}` } });
    if (user.id === seller.id) return navigate("/profil");
    try {
      const { conversation } = await api.startConversation({ seller_id: seller.id });
      navigate(`/messages/${conversation.id}`);
    } catch {
      toast("Impossible d'ouvrir la conversation", "error");
    }
  }

  if (loading) {
    return (
      <PhoneShell padBottom={false}>
        <Spinner className="min-h-screen" />
      </PhoneShell>
    );
  }
  if (!seller) {
    return (
      <PhoneShell padBottom={false}>
        <TopBar title="Vendeur" />
        <p className="p-8 text-center text-sm text-zinc-500">Ce vendeur n'existe pas.</p>
      </PhoneShell>
    );
  }

  const role = ROLE_MAP[seller.role];

  return (
    <PhoneShell>
      <TopBar title={seller.company || seller.name} subtitle={role?.label} />

      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          <Avatar name={seller.company || seller.name} src={seller.avatar_url} size={64} verified={seller.verified} />
          <div className="flex-1 min-w-0">
            <h1 className="flex items-center gap-1.5 font-bold text-lg leading-6">
              {seller.company || seller.name}
              {seller.verified ? <BadgeCheck className="size-4 text-brand" /> : null}
            </h1>
            <p className="text-sm text-zinc-500">{seller.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {role ? (
                <Badge variant="muted">
                  <role.icon className="size-3" />
                  {role.label}
                </Badge>
              ) : null}
              {seller.region ? (
                <Badge variant="outline">
                  <MapPin className="size-3" />
                  {seller.region}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat value={String(products.length)} label="Annonces" />
          <Stat value={String(sales)} label="Ventes" />
          <Stat
            value={seller.rating_count ? seller.rating.toFixed(1) : "—"}
            label={`Note (${seller.rating_count})`}
          />
        </div>

        {seller.description ? (
          <p className="text-sm leading-relaxed text-zinc-600">{seller.description}</p>
        ) : null}

        <div className="rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-500 flex flex-col gap-1">
          {seller.address ? <span>📍 {seller.address}</span> : null}
          <span>Membre depuis {formatDate(seller.created_at)}</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={contact}>
            <MessageCircle className="size-4" />
            Message
          </Button>
          <a href={`tel:${seller.phone}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              <Phone className="size-4" />
              Appeler
            </Button>
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-base">Produits ({products.length})</h2>
          {products.length === 0 ? (
            <EmptyState icon={<Package className="size-6" />} title="Aucune annonce active" />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {reviews.length ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-base">Avis des acheteurs</h2>
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.author_name}</span>
                  <span className="text-xs text-zinc-400">{timeAgo(r.created_at)}</span>
                </div>
                <div className="mt-1 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={
                        n <= r.rating ? "size-3.5 fill-amber-500 text-amber-500" : "size-3.5 text-zinc-200"
                      }
                    />
                  ))}
                </div>
                {r.comment ? <p className="mt-1.5 text-sm text-zinc-600">{r.comment}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PhoneShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-3 text-center">
      <p className="font-extrabold text-brand text-lg leading-6">{value}</p>
      <p className="text-[11px] text-zinc-500">{label}</p>
    </div>
  );
}
