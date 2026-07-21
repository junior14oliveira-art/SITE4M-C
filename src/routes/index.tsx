import { createFileRoute } from "@tanstack/react-router";
import logo4mc from "@/assets/logo-4mc.png";
import heroLaptops from "@/assets/hero-laptops.jpg";
import prodMonitor from "@/assets/prod-monitor.jpg";
import prodServer from "@/assets/prod-server.jpg";
import highlightNetwork from "@/assets/highlight-network.jpg";
import highlightWorkstation from "@/assets/highlight-workstation.jpg";
import highlightComponents from "@/assets/highlight-components.jpg";
import {
  getFeaturedProducts,
  getRecentProducts,
  getCategories,
  addToCartUrl,
  type StoreProduct,
  type StoreCategory,
} from "@/lib/woocommerce.server";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "4M&C Informática — Notebooks e Computadores Renovados com Garantia" },
      {
        name: "description",
        content:
          "Notebooks Dell e Lenovo, desktops, servidores e monitores renovados com garantia. Suporte especializado, revisão técnica completa e entrega para todo o Brasil.",
      },
      { property: "og:title", content: "4M&C Informática — Hardware Corporativo Renovado" },
      {
        property: "og:description",
        content: "Equipamentos renovados com garantia. PIX com desconto, parcelamento e suporte B2B.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    const [featured, recent, categories] = await Promise.all([
      getFeaturedProducts(),
      getRecentProducts(),
      getCategories(),
    ]);
    // Se não houver produtos marcados como "destaque" no WooCommerce, usa os mais recentes.
    const recommended = featured.length > 0 ? featured : recent.slice(0, 4);
    const highlights = recent.filter((p) => !recommended.some((r) => r.id === p.id)).slice(0, 4);
    return { recommended, highlights, categories };
  },
  component: Home,
});

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={`size-3 ${filled ? "text-amber-400" : "text-border"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} filled={i < n} />
    ))}
  </div>
);

function ProductCard({ p }: { p: StoreProduct }) {
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
        <a
          href={p.url}
          className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-snug text-ink transition-colors hover:text-primary"
        >
          {p.name}
        </a>
        <div className="mt-4 flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">
            {p.price} <span className="text-[10px] font-medium text-muted-foreground">à vista no PIX</span>
          </span>
          <span className="text-[11px] text-muted-foreground">{p.installment}</span>
        </div>
        <a
          href={p.inStock ? addToCartUrl(p.id) : p.url}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          {p.inStock ? "Adicionar ao carrinho" : "Ver produto"}
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </article>
  );
}

function CategoryPill({ c, fallbackImage }: { c: StoreCategory; fallbackImage: string }) {
  return (
    <a key={c.slug} href={c.url} className="group flex flex-col items-center gap-3">
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
    </a>
  );
}

const fallbackCatImages = [highlightNetwork, highlightWorkstation, highlightComponents, prodServer, prodMonitor, heroLaptops];

function Home() {
  const { recommended, highlights, categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      {/* Utility bar */}
      <div className="bg-ink py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-background/70 uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              PIX com desconto exclusivo
            </span>
            <span className="hidden text-[11px] font-medium tracking-wider text-background/70 uppercase md:inline">
              Garantia em todos os produtos
            </span>
            <span className="hidden text-[11px] font-medium tracking-wider text-background/70 uppercase md:inline">
              Entrega para todo o Brasil
            </span>
          </div>
          <div className="text-[11px] font-medium tracking-wider text-background/50 uppercase">
            Central B2B · (11) 3855-1360
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-8">
            <a href="/" className="flex flex-shrink-0 items-center">
              <img src={logo4mc} alt="4M&C Informática" className="h-9 w-auto" />
            </a>

            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Busque por notebook, servidor, monitor…"
                  className="h-11 w-full rounded-md bg-secondary px-4 pl-11 text-sm ring-1 ring-black/5 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <svg className="absolute top-3.5 left-3.5 size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <a href="https://4mcinformatica.com/minha-conta/" className="hidden items-center gap-2 md:flex">
                <div className="flex size-9 items-center justify-center rounded-full bg-secondary ring-1 ring-black/5">
                  <svg className="size-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Olá</span>
                  <span className="text-xs font-semibold">Minha conta</span>
                </div>
              </a>
              <a href="https://4mcinformatica.com/carrinho/" className="relative flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-background transition-colors hover:bg-ink-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-semibold">Carrinho</span>
              </a>
            </div>
          </div>

          <nav className="mt-5 flex items-center gap-8 overflow-x-auto">
            {categories.slice(0, 6).map((c) => (
              <a key={c.slug} href={c.url} className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {c.name}
              </a>
            ))}
            <a
              href="https://4mcinformatica.com/institucional/"
              className="ml-auto hidden whitespace-nowrap text-xs font-semibold text-ink uppercase lg:inline"
            >
              Institucional
            </a>
          </nav>
        </div>
      </header>

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
                  <a href="https://4mcinformatica.com/categoria-produto/notebooks/" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                    Ver notebooks
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a href="https://wa.me/551138551360" className="inline-flex items-center gap-2 rounded-md border border-background/20 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10">
                    Falar com especialista
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
              <div className="relative flex-1 overflow-hidden rounded-3xl bg-accent p-8 ring-1 ring-black/5">
                <img
                  src={prodMonitor}
                  alt="Monitores renovados"
                  loading="lazy"
                  width={700}
                  height={700}
                  className="absolute -right-8 -bottom-8 h-40 w-40 object-contain"
                />
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  Oferta exclusiva
                </span>
                <h2 className="mt-3 max-w-[14ch] text-xl leading-tight font-semibold text-accent-foreground">
                  Monitores renovados
                </h2>
                <a href="https://4mcinformatica.com/categoria-produto/monitores/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4">
                  Aproveitar
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-3xl bg-secondary p-8 ring-1 ring-black/5">
                <img
                  src={prodServer}
                  alt="Servidores renovados"
                  loading="lazy"
                  width={700}
                  height={700}
                  className="absolute -right-6 -bottom-6 h-40 w-40 object-contain opacity-90"
                />
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Linha datacenter
                </span>
                <h2 className="mt-3 max-w-[14ch] text-xl leading-tight font-semibold text-ink">
                  Servidores para missão crítica
                </h2>
                <a href="https://4mcinformatica.com/categoria-produto/servidores/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">
                  Explorar linha Pro
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
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
              <a href="https://4mcinformatica.com/loja/" className="text-sm font-semibold text-primary hover:underline">
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
              <a href="https://4mcinformatica.com/loja/" className="text-sm font-semibold text-primary hover:underline">
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
                tag: "Infraestrutura",
                title: "Redes Enterprise",
                desc: "Switches e roteadores para alta disponibilidade.",
                url: "https://4mcinformatica.com/categoria-produto/hardware/",
              },
              {
                img: highlightWorkstation,
                tag: "Produtividade",
                title: "Workstations renovadas",
                desc: "Configurações revisadas para engenharia e design.",
                url: "https://4mcinformatica.com/categoria-produto/computadores/",
              },
              {
                img: highlightComponents,
                tag: "Upgrade",
                title: "Componentes & peças",
                desc: "Memória, SSD e placas para manutenção corporativa.",
                url: "https://4mcinformatica.com/categoria-produto/hardware/",
              },
            ].map((h) => (
              <a
                key={h.title}
                href={h.url}
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
              </a>
            ))}
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
                <a href="https://wa.me/551138551360" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                  Solicitar cotação
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a href="mailto:contato@4mcinformatica.com" className="text-sm font-semibold text-background underline underline-offset-4">
                  contato@4mcinformatica.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            <div>
              <img src={logo4mc} alt="4M&C Informática" className="h-9 w-auto" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Notebooks, desktops, servidores e monitores renovados com garantia, para empresas de
                todos os portes.
              </p>
            </div>
            {[
              {
                title: "Institucional",
                links: [
                  { label: "Quem Somos", url: "https://4mcinformatica.com/quem-somos/" },
                  { label: "Política de Privacidade", url: "https://4mcinformatica.com/politica-de-privacidade/" },
                  { label: "Termos de Uso", url: "https://4mcinformatica.com/termos-de-uso/" },
                ],
              },
              {
                title: "Atendimento",
                links: [
                  { label: "Contato", url: "https://4mcinformatica.com/contato/" },
                  { label: "Política de Envio e Entrega", url: "https://4mcinformatica.com/politica-de-envio-e-entrega/" },
                  { label: "Trocas e devoluções", url: "https://4mcinformatica.com/politica-de-trocas-e-devolucoes/" },
                ],
              },
              {
                title: "Categorias",
                links: categories.slice(0, 4).map((c) => ({ label: c.name, url: c.url })),
              },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">
                  {col.title}
                </h5>
                <ul className="mt-5 flex flex-col gap-3 text-sm font-medium text-ink">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.url} className="transition-colors hover:text-primary">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
            <p className="text-xs text-muted-foreground">
              © 2026 4M&amp;C Informática LTDA. Todos os direitos reservados. CNPJ 27.192.596/0001-25
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Pagamento
              </span>
              {["PIX", "VISA", "MASTER", "AMEX", "BOLETO"].map((m) => (
                <span key={m} className="rounded border border-border bg-background px-2 py-1 text-[10px] font-bold text-ink">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
