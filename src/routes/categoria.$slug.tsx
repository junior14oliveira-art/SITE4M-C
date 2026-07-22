import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategoryBySlug, getProductsByCategory, getCategories } from "@/lib/woocommerce.server";
import { ProductCard } from "@/components/store/product-card";
import { Pagination } from "@/components/store/pagination";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";

type CategoriaSearch = { page: number };

export const Route = createFileRoute("/categoria/$slug")({
  validateSearch: (search: Record<string, unknown>): CategoriaSearch => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ params, deps }) => {
    const category = await getCategoryBySlug({ data: params.slug }).catch(() => null);
    if (!category) throw notFound();
    const [data, categories] = await Promise.all([
      getProductsByCategory({ data: { slug: params.slug, page: deps.page, categoryId: category.id } }).catch(() => ({
        products: [],
        page: 1,
        totalPages: 1,
        total: 0,
      })),
      getCategories().catch(() => []),
    ]);
    return { category, ...data, categories };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.category.name} — 4M&C Informática` : "Categoria — 4M&C Informática" },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.category.name} renovados com garantia na 4M&C Informática.`
          : "Categoria de produtos renovados com garantia.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <h1 className="text-2xl font-semibold text-ink">Categoria não encontrada</h1>
      <p className="text-sm text-muted-foreground">Essa categoria não existe ou não tem produtos publicados.</p>
      <a href="/loja" className="mt-2 text-sm font-semibold text-primary hover:underline">
        Ver todos os produtos →
      </a>
    </div>
  ),
  component: CategoriaPage,
});

function CategoriaPage() {
  const { category, products, page, totalPages, total, categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <SiteHeader categories={categories} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Categoria</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{category.name}</h1>
          {category.description && (
            <p
              className="mt-2 max-w-2xl text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              buildHref={(p) => ({ to: "/categoria/$slug", params: { slug: category.slug }, search: { page: p } })}
            />
          </>
        ) : (
          <div className="mt-16 rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Nenhum produto publicado nesta categoria no momento.</p>
          </div>
        )}
      </main>

      <SiteFooter categories={categories} />
    </div>
  );
}
