import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProductBySlug, getRelatedProducts, getCategories } from "@/lib/woocommerce.server";
import { ProductCard, Stars } from "@/components/store/product-card";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { wpAddToCartUrl, CONTACT } from "@/lib/site-config";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: params.slug }).catch(() => null);
    if (!product) throw notFound();
    const allCats = await getCategories().catch(() => []);
    const categoryId = product.categories[0]
      ? allCats.find((c) => c.slug === product.categories[0].slug)?.id
      : undefined;
    const related = categoryId
      ? await getRelatedProducts({ data: { categoryId, excludeId: product.id } }).catch(() => [])
      : [];
    return { product, related, categories: allCats };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — 4M&C Informática` : "Produto — 4M&C Informática" },
      {
        name: "description",
        content: loaderData
          ? loaderData.product.shortDescription.replace(/<[^>]+>/g, "").slice(0, 155)
          : "Produto renovado com garantia na 4M&C Informática.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <h1 className="text-2xl font-semibold text-ink">Produto não encontrado</h1>
      <p className="text-sm text-muted-foreground">Esse produto não existe mais ou foi removido do catálogo.</p>
      <a href="/loja" className="mt-2 text-sm font-semibold text-primary hover:underline">
        Ver todos os produtos →
      </a>
    </div>
  ),
  component: ProdutoPage,
});

function ProdutoPage() {
  const { product: p, related, categories } = Route.useLoaderData();
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <SiteHeader categories={categories} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span>/</span>
          <Link to="/loja" className="hover:text-primary">Produtos</Link>
          {p.categories[0] && (
            <>
              <span>/</span>
              <Link to="/categoria/$slug" params={{ slug: p.categories[0].slug }} className="hover:text-primary">
                {p.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Galeria */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary ring-1 ring-black/5">
              {p.images.length > 0 ? (
                <img
                  src={p.images[activeImage]}
                  alt={p.name}
                  className="h-full w-full object-contain p-8"
                  width={700}
                  height={700}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Sem imagem
                </div>
              )}
            </div>
            {p.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {p.images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 transition-all ${
                      i === activeImage ? "ring-2 ring-primary" : "ring-black/5 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${p.name} ${i + 1}`} className="h-full w-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div>
            {p.badge && (
              <span className="mb-3 inline-block rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-wider text-background uppercase">
                {p.badge}
              </span>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{p.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <Stars n={p.rating} />
              <span className="text-xs text-muted-foreground">
                {p.reviewCount > 0 ? `${p.reviewCount} avaliações` : "Ainda sem avaliações"}
              </span>
            </div>

            {p.sku && <p className="mt-3 text-xs text-muted-foreground">SKU: {p.sku}</p>}

            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="text-3xl font-semibold tracking-tight text-ink">
                {p.price} <span className="text-xs font-medium text-muted-foreground">à vista no PIX</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.installment}</p>

              {p.inStock ? (
                <a
                  href={wpAddToCartUrl(p.id)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Adicionar ao carrinho
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ) : (
                <div className="mt-6 rounded-md border border-border bg-secondary px-5 py-3.5 text-center text-sm font-semibold text-muted-foreground">
                  Consulte disponibilidade — {" "}
                  <a href={CONTACT.whatsapp} className="text-primary underline underline-offset-4">
                    fale com a gente no WhatsApp
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { t: "Garantia", d: "Produto revisado e testado" },
                { t: "Entrega nacional", d: "Frete calculado no checkout" },
                { t: "Pagamento seguro", d: "PIX, cartão e boleto" },
                { t: "Suporte B2B", d: "Atendimento especializado" },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-2 text-xs">
                  <svg className="mt-0.5 size-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-ink">{f.t}</p>
                    <p className="text-muted-foreground">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição completa */}
        {p.description && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold tracking-tight text-ink">Descrição do produto</h2>
            <div
              className="prose prose-sm mt-4 max-w-3xl text-muted-foreground [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-ink [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          </div>
        )}

        {/* Relacionados */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold tracking-tight text-ink">Você também pode gostar</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((rp) => (
                <ProductCard key={rp.id} p={rp} />
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter categories={categories} />
    </div>
  );
}
