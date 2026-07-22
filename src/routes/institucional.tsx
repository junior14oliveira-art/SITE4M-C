import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { COMPANY } from "@/lib/site-config";

export const Route = createFileRoute("/institucional")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Quem Somos | 4M&C Informática — Hardware Corporativo Seminovo com Garantia" },
      {
        name: "description",
        content:
          "Conheça a 4M&C Informática, especialista em hardware corporativo seminovo: notebooks Dell, Lenovo, HP, desktops e servidores revisados com garantia. Guarulhos/SP e todo o Brasil.",
      },
    ],
  }),
  component: Institucional,
});

function Institucional() {
  const { categories } = Route.useLoaderData();
  return (
    <StaticPage categories={categories} eyebrow="Institucional" title="Quem Somos">
      <p>
        A <strong>{COMPANY.brand}</strong> atua há mais de 9 anos no mercado de equipamentos de informática
        seminovos e renovados, oferecendo servidores, switches, storages, desktops e notebooks com procedência,
        revisão técnica e garantia — para quem precisa de tecnologia corporativa confiável sem pagar o preço de
        produto novo.
      </p>
      <p>
        Cada equipamento passa por um rigoroso processo de revisão, higienização e testes antes de ser anunciado,
        garantindo que chegue pronto para o ambiente de trabalho mais exigente.
      </p>
      <h3>O que nos diferencia</h3>
      <ul>
        <li>Equipamentos testados e revisados antes da venda;</li>
        <li>Parcelamento em até 6x sem juros;</li>
        <li>Selo Refurbisher IBDN (boas práticas de recondicionamento);</li>
        <li>Garantia de Satisfação e Compra 100% Segura.</li>
      </ul>
      <h3>Missão</h3>
      <p>
        Democratizar o acesso a hardware corporativo de qualidade, promovendo a economia circular e a
        sustentabilidade no setor de tecnologia.
      </p>
      <h3>Visão</h3>
      <p>Ser referência em equipamentos de informática renovados para empresas e profissionais em todo o Brasil.</p>
      <h3>Valores</h3>
      <p>
        Transparência, procedência e sustentabilidade — dando uma segunda vida útil à tecnologia e reduzindo o
        descarte eletrônico.
      </p>
      <hr className="my-8 border-border" />
      <p>
        <strong>{COMPANY.legalName}</strong>
        <br />
        CNPJ: {COMPANY.cnpj}
        <br />
        {COMPANY.address}
        <br />
        E-mail: {COMPANY.email} · WhatsApp: {COMPANY.phone}
      </p>
    </StaticPage>
  );
}
