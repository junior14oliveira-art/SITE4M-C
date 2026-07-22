import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getAllProducts, getCategories } from "@/lib/woocommerce.server";
import { ProductCard } from "@/components/store/product-card";
import { Pagination } from "@/components/store/pagination";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";

type LojaSearch = { page: number; q?: string; sort?: string };

const SORTS = [
  { value: "", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliados" },
];

export const Route = createFileRoute("/loja")({
  validateSearch: (search: Record<string, unknown>): LojaSearch => ({
    page: Number(search.page) > 0 ? Number(search.page) : 1,
    q: typeof search.q === "string" && search.q.length > 0 ? search.q : undefined,
    sort: typeof search.sort === "string" && search.sort.length > 0 ? search.sort : undefined,
  }),
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, sort: search.sort }),
  loader: async ({ deps }) => {
    const [data, categories] = await Promise.all([
      getAllProducts({ data: { page: deps.page, search: deps.q, sort: deps.sort } }).catch(() => ({
        products: [],
        page: 1,
        totalPages: 1,
        total: 0,
      })),
      getCategories().catch(() => []),
    ]);
    return { ...data, categories };
  },
  head: () => ({
    meta: [
      { title: "Loja de Notebooks e Computadores Seminovos com Garantia | 4M&C Informática" },
      {
        name: "description",
        content:
          "Explore a loja da 4M&C: notebooks Dell, Lenovo e HP seminovos, computadores usados, servidores e monitores corporativos revisados. Preços B2B e entrega nacional.",
      },
    ],
  }),
  component: Loja,
});

function Loja() {
  const { products, page, totalPages, total, categories } = Route.useLoaderData();
  const { q, sort } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <SiteHeader categories={categories} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Catálogo</span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {q ? `Resultados para "${q}"` : "Todos os produtos"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          {products.length > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ordenar por:</span>
              <select
                value={sort ?? ""}
                onChange={(e) =>
                  navigate({ to: "/loja", search: { page: 1, q, sort: e.target.value || undefined } })
                }
                className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-primary/30"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
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
              buildHref={(p) => ({ to: "/loja", search: { page: p, q, sort } })}
            />
          </>
        ) : (
          <div className="mt-16 rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum produto encontrado{q ? ` para "${q}"` : ""}. Tente outro termo de busca.
            </p>
          </div>
        )}
      </main>

      <SiteFooter categories={categories} />
    </div>
  );
}
