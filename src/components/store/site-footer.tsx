import logo4mc from "@/assets/logo-4mc.png";
import type { StoreCategory } from "@/lib/woocommerce.server";

export function SiteFooter({ categories }: { categories: StoreCategory[] }) {
  return (
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
                { label: "Quem Somos", url: "/institucional" },
                { label: "Política de Privacidade", url: "/privacidade" },
                { label: "Termos de Uso", url: "/termos" },
              ],
            },
            {
              title: "Atendimento",
              links: [
                { label: "Contato", url: "/contato" },
                { label: "Política de Envio e Entrega", url: "/envio" },
                { label: "Trocas e devoluções", url: "/trocas" },
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
  );
}
