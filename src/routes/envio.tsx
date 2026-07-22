import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { CONTACT, COMPANY } from "@/lib/site-config";

export const Route = createFileRoute("/envio")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Política de Envio e Entrega | 4M&C Informática" },
      {
        name: "description",
        content:
          "Prazos, fretes e transportadoras para notebooks, computadores e servidores seminovos. Entrega para todo o Brasil pela 4M&C Informática.",
      },
    ],
  }),
  component: Envio,
});

function Envio() {
  const { categories } = Route.useLoaderData();
  return (
    <StaticPage categories={categories} eyebrow="Atendimento" title="Política de Envio e Entrega">
      <h3>1. Formas de envio</h3>
      <p>Enviamos para todo o Brasil pelos Correios e/ou transportadora:</p>
      <ul>
        <li><strong>SEDEX</strong> — entrega expressa;</li>
        <li><strong>PAC</strong> — entrega econômica;</li>
        <li><strong>Retirada no local</strong> — sem custo de frete, em {COMPANY.city}, com horário combinado pelo WhatsApp.</li>
      </ul>
      <h3>2. Custo e prazo</h3>
      <p>
        O valor do frete e o prazo são calculados automaticamente pelo seu CEP, na página do produto e no checkout.
        O prazo conta a partir da postagem, feita após a confirmação do pagamento.
      </p>
      <h3>3. Rastreamento</h3>
      <p>Após a postagem, o código de rastreio é disponibilizado para acompanhamento.</p>
      <h3>4. Embalagem</h3>
      <p>
        Todos os equipamentos são revisados, testados e embalados com proteção adequada. Em caso de avaria no
        transporte, contate-nos imediatamente — veja também a <a href="/trocas">Política de Trocas e Devoluções</a>.
      </p>
      <h3>5. Dúvidas</h3>
      <p>
        WhatsApp <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">clique aqui</a> ou e-mail{" "}
        {COMPANY.email}.
      </p>
    </StaticPage>
  );
}
