import { createFileRoute, Link } from "@tanstack/react-router";
import heroLaptops from "@/assets/hero-laptops.jpg";
import prodMonitor from "@/assets/prod-monitor.jpg";
import prodServer from "@/assets/prod-server.jpg";
import highlightNetwork from "@/assets/highlight-network.jpg";
import highlightWorkstation from "@/assets/highlight-workstation.jpg";
import highlightComponents from "@/assets/highlight-components.jpg";
import { getFeaturedProducts, getRecentProducts, getCategories } from "@/lib/woocommerce.server";
import { fallbackCatImages } from "@/lib/fallback-images";
import { CONTACT } from "@/lib/site-config";
import { ProductCard, CategoryPill } from "@/components/store/product-card";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notebook Seminovo e Computador Usado com Garantia | 4M&C Informática" },
      {
        name: "description",
        content:
          "Compre notebook Dell, Lenovo e HP seminovos com garantia na 4M&C Informática. Computadores, servidores e monitores corporativos revisados. Entrega para todo o Brasil.",
      },
      { property: "og:title", content: "Notebook Seminovo e Computador Usado com Garantia | 4M&C Informática" },
      {
        property: "og:description",
        content: "Equipamentos corporativos seminovos com garantia. PIX com desconto, parcelamento e suporte B2B.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    // Resiliente: se a API do WooCommerce estiver fora do ar, a home continua
    // carregando (com seções vazias) em vez de quebrar o site inteiro.
    const [featured, recent, categories] = await Promise.all([
      getFeaturedProducts().catch(() => []),
      getRecentProducts().catch(() => []),
      getCategories().catch(() => []),
    ]);
    // Se não houver produtos marcados como "destaque" no WooCommerce, usa os mais recentes.
    const recommended = featured.length > 0 ? featured : recent.slice(0, 4);
    const highlights = recent.filter((p) => !recommended.some((r) => r.id === p.id)).slice(0, 4);
    return { recommended, highlights, categories };
  },
  component: Home,
});

function Home() {
  const { recommended, highlights, categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <SiteHeader categories={categories} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="relative col-span-12 h-[520px] overflow-hidden rounded-3xl bg-ink lg:col-span-8">
              <img
                src={heroLaptops}
                alt="Notebooks e computadores renovados"
                width={1600}
                height={1100}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
              <div className="relative flex h-full max-w-xl flex-col justify-center px-10 lg:px-14">
                <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase ring-1 ring-primary/30">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Renovados com garantia
                </span>
                <h1 className="text-balance text-4xl leading-[1.05] font-semibold text-background sm:text-5xl lg:text-[3.5rem]">
                  Notebooks e desktops renovados prontos para o seu negócio.
                </h1>
                <p className="mt-6 max-w-md text-pretty text-sm text-background/70 sm:text-base">
                  Equipamentos revisados e testados, com garantia e suporte especializado, para
                  infraestruturas de tecnologia corporativas.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link to="/categoria/$slug" params={{ slug: "notebooks" }} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                    Ver notebooks
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <a href={CONTACT.whatsapp} className="inline-flex items-center gap-2 rounded-md border border-background/20 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10">
                    Falar com especialista
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
              {/* Card 1 — Monitores (claro, destaque ciano) */}
              <Link
                to="/categoria/$slug"
                params={{ slug: "monitores" }}
                className="group relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-background p-8 ring-1 ring-primary/10 transition-all duration-300 hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* brilho suave atrás do produto */}
                <div className="absolute -right-6 -bottom-6 size-44 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
                <img
                  src={prodMonitor}
                  alt="Monitores renovados"
                  loading="lazy"
                  width={700}
                  height={700}
                  className="absolute -right-5 -bottom-4 h-44 w-44 object-contain drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                />
                <div className="relative">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    Oferta exclusiva
                  </span>
                  <h2 className="mt-3 max-w-[10ch] text-2xl leading-tight font-semibold text-accent-foreground">
                    Monitores renovados
                  </h2>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Aproveitar
                    <svg className="size-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Card 2 — Servidores (escuro, datacenter) */}
              <Link
                to="/categoria/$slug"
                params={{ slug: "servidores" }}
                className="group relative flex-1 overflow-hidden rounded-3xl bg-ink p-8 ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-ink/20"
              >
                <div className="absolute -right-8 -bottom-8 size-44 rounded-full bg-primary/20 blur-3xl transition-opacity duration-300 group-hover:opacity-90" />
                <img
                  src={prodServer}
                  alt="Servidores renovados"
                  loading="lazy"
                  width={700}
                  height={700}
                  className="absolute -right-5 -bottom-4 h-44 w-44 object-contain opacity-95 drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                />
                <div className="relative">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    Linha datacenter
                  </span>
                  <h2 className="mt-3 max-w-[12ch] text-2xl leading-tight font-semibold text-background">
                    Servidores para missão crítica
                  </h2>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-background">
                    Explorar linha Pro
                    <svg className="size-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:divide-x md:divide-border">
              {[
                {
                  t: "Suporte especializado",
                  d: "Equipe pronta para atendimento B2B.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  ),
                },
                {
                  t: "Site 100% seguro",
                  d: "Criptografia ponta a ponta e pagamento protegido.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
                {
                  t: "Entrega nacional",
                  d: "Logística otimizada com frete seguro para todo o Brasil.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h13l-1.5 9H8m0-9L6 3H2m6 4v9m0 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                  ),
                },
              ].map((it) => (
                <div key={it.t} className="flex items-center gap-4 px-2 md:px-8">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent ring-1 ring-primary/10">
                    <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {it.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{it.t}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Explore</span>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Categorias</h2>
              </div>
              <a href="/loja" className="text-sm font-semibold text-primary hover:underline">
                Ver tudo →
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 md:grid-cols-6">
              {categories.map((c, i) => (
                <CategoryPill key={c.slug} c={c} fallbackImage={fallbackCatImages[i % fallbackCatImages.length]} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="bg-secondary/50 py-16">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
                    Curadoria B2B
                  </span>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                    Recomendados para você
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Seleção baseada no perfil da sua infraestrutura corporativa.
                  </p>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recommended.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Store highlights */}
        {highlights.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
                  Mais vendidos
                </span>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Destaques da loja</h2>
              </div>
              <a href="/loja" className="text-sm font-semibold text-primary hover:underline">
                Ver todos os produtos →
              </a>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}

        {/* Editorial band */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              {
                img: highlightNetwork,
                tag: "Datacenter",
                title: "Servidores para missão crítica",
                desc: "PowerEdge, ProLiant e infraestrutura de alta disponibilidade.",
                slug: "servidores" as const,
              },
              {
                img: highlightWorkstation,
                tag: "Produtividade",
                title: "Desktops & workstations",
                desc: "Computadores corporativos revisados para o seu escritório.",
                slug: "computadores" as const,
              },
              {
                img: highlightComponents,
                tag: "Catálogo completo",
                title: "Ver todos os produtos",
                desc: "Notebooks, monitores, fontes e mais — tudo com garantia.",
                slug: undefined,
              },
            ].map((h) => {
              const linkProps = h.slug
                ? ({ to: "/categoria/$slug", params: { slug: h.slug } } as const)
                : ({ to: "/loja" } as const);
              return (
              <Link
                key={h.title}
                {...linkProps}
                className="group relative h-72 overflow-hidden rounded-3xl bg-ink ring-1 ring-black/5"
              >
                <img
                  src={h.img}
                  alt={h.title}
                  loading="lazy"
                  width={1000}
                  height={700}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-8">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{h.tag}</span>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-background">{h.title}</h4>
                  <p className="mt-1 max-w-xs text-sm text-background/70">{h.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-background">
                    Explorar
                    <svg className="size-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </section>

        {/* Corporate CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-12 lg:p-16">
            <div className="absolute -top-32 -right-24 size-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
                  Vendas Corporativas
                </span>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-background sm:text-4xl">
                  Sua empresa merece um projeto de TI sob medida.
                </h3>
                <p className="mt-4 max-w-lg text-background/70">
                  Cotação personalizada, condições especiais para volume e prazos alinhados com o seu
                  ciclo de aquisição. Fale com um consultor B2B.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                <a href={CONTACT.whatsapp} className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                  Solicitar cotação
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="text-sm font-semibold text-background underline underline-offset-4">
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter categories={categories} />
    </div>
  );
}
