import { Link } from "@tanstack/react-router";
import type { StoreCategory, StoreProduct } from "@/lib/woocommerce.server";
import { wpAddToCartUrl } from "@/lib/site-config";

export const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={`size-3 ${filled ? "text-amber-400" : "text-border"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} filled={i < n} />
    ))}
  </div>
);

export function ProductCard({ p }: { p: StoreProduct }) {
  return (
    <article className="group relative flex flex-col rounded-2xl bg-card p-4 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            width={700}
            height={700}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
        {p.badge && (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-wider text-background uppercase">
            {p.badge}
          </span>
        )}
        {!p.inStock && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase ring-1 ring-border">
            Consulte disponibilidade
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <Stars n={p.rating ?? 5} />
        <Link
          to="/produto/$slug"
          params={{ slug: p.slug }}
          className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-snug text-ink transition-colors hover:text-primary"
        >
          {p.name}
        </Link>
        <div className="mt-4 flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">
            {p.price} <span className="text-[10px] font-medium text-muted-foreground">à vista no PIX</span>
          </span>
          <span className="text-[11px] text-muted-foreground">{p.installment}</span>
        </div>
        {p.inStock ? (
          <a
            href={wpAddToCartUrl(p.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Adicionar ao carrinho
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        ) : (
          <Link
            to="/produto/$slug"
            params={{ slug: p.slug }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Ver produto
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

export function CategoryPill({ c, fallbackImage }: { c: StoreCategory; fallbackImage: string }) {
  return (
    <Link to="/categoria/$slug" params={{ slug: c.slug }} className="group flex flex-col items-center gap-3">
      <div className="relative size-24 overflow-hidden rounded-full bg-secondary p-3 ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-primary/40">
        <img
          src={c.image || fallbackImage}
          alt={c.name}
          loading="lazy"
          width={200}
          height={200}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <span className="text-xs font-semibold text-ink">{c.name}</span>
    </Link>
  );
}
