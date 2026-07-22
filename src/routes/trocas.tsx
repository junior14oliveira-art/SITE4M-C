import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { COMPANY } from "@/lib/site-config";

export const Route = createFileRoute("/trocas")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Política de Trocas e Devoluções | 4M&C Informática" },
      {
        name: "description",
        content:
          "Política de trocas e devoluções da 4M&C: direito de arrependimento em 7 dias e garantia em notebooks, computadores e servidores seminovos.",
      },
    ],
  }),
  component: Trocas,
});

function Trocas() {
  const { categories } = Route.useLoaderData();
  return (
    <StaticPage categories={categories} eyebrow="Atendimento" title="Política de Trocas e Devoluções">
      <h3>1. Arrependimento (7 dias)</h3>
      <p>
        Até 7 dias corridos do recebimento, sem justificativa (CDC art. 49). O produto deve retornar em boas
        condições, com acessórios. Reembolso integral, incluindo frete.
      </p>
      <h3>2. Produto com defeito</h3>
      <p>
        Garantia legal de 90 dias (bem durável, CDC art. 26) somada à garantia contratual do anúncio. Reparo,
        troca ou reembolso conforme CDC art. 18.
      </p>
      <h3>3. Como solicitar</h3>
      <p>
        Envie e-mail para {COMPANY.email} com o número do pedido e fotos/descrição. Responderemos com as instruções
        de postagem.
      </p>
      <h3>4. Reembolso</h3>
      <p>
        Realizado pelo mesmo meio de pagamento em até 10 dias úteis após o recebimento e conferência do produto.
      </p>
    </StaticPage>
  );
}
