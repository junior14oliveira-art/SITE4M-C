import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { COMPANY, WP_STORE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/termos")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Termos de Uso | 4M&C Informática" },
      {
        name: "description",
        content: "Termos e condições de uso da loja 4M&C Informática: produtos seminovos, preços, entrega, garantia e foro.",
      },
    ],
  }),
  component: Termos,
});

function Termos() {
  const { categories } = Route.useLoaderData();
  const site = WP_STORE_URL.replace(/^https?:\/\//, "");
  return (
    <StaticPage categories={categories} eyebrow="Legal" title="Termos de Uso">
      <h3>1. Identificação</h3>
      <p>{COMPANY.legalName}, CNPJ {COMPANY.cnpj}, {COMPANY.address}, contato {COMPANY.email} / {COMPANY.phone}.</p>
      <h3>2. Objeto</h3>
      <p>Venda de equipamentos de informática novos e recondicionados/usados pelo site {site}.</p>
      <h3>3. Produtos usados/recondicionados</h3>
      <p>
        Os produtos anunciados como "usado" ou "recondicionado" foram revisados e testados; podem apresentar sinais
        estéticos de uso, descritos no anúncio. A garantia é a informada na página do produto.
      </p>
      <h3>4. Preços e pagamento</h3>
      <p>
        Os preços podem ser alterados sem aviso; vale o preço no momento da compra. Pagamento pelos meios
        disponibilizados no checkout (Pix, cartão, boleto, conforme configurado). Em erro evidente de preço, a loja
        pode cancelar e reembolsar.
      </p>
      <h3>5. Entrega</h3>
      <p>Prazos e fretes calculados no checkout, conforme o CEP.</p>
      <h3>6. Direito de arrependimento</h3>
      <p>Conforme CDC art. 49, o cliente pode desistir em até 7 dias corridos após o recebimento, com reembolso integral.</p>
      <h3>7. Garantia</h3>
      <p>Garantia legal (CDC) e garantia contratual informada em cada produto.</p>
      <h3>8. Foro</h3>
      <p>Fica eleito o foro da comarca de {COMPANY.city}.</p>
    </StaticPage>
  );
}
