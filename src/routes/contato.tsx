import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { COMPANY, CONTACT } from "@/lib/site-config";

export const Route = createFileRoute("/contato")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Contato e Cotação B2B | 4M&C Informática — Notebooks e Hardware Seminovos" },
      {
        name: "description",
        content:
          "Fale com a 4M&C Informática para cotações de notebooks seminovos, computadores usados e servidores corporativos. WhatsApp, e-mail e atendimento B2B.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { categories } = Route.useLoaderData();
  return (
    <StaticPage categories={categories} eyebrow="Atendimento" title="Fale Conosco">
      <p>
        Precisa de ajuda com o seu pedido ou quer montar um lote de equipamentos para a sua empresa? Nossa equipe
        está pronta para atender — respondemos com agilidade em horário comercial.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-ink">WhatsApp (mais rápido)</h4>
          <p className="mt-2">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              {COMPANY.phone} — clique para conversar
            </a>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-ink">E-mail</h4>
          <p className="mt-2">
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-ink">Endereço</h4>
          <p className="mt-2">{COMPANY.address}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="font-semibold text-ink">Horário de atendimento</h4>
          <p className="mt-2">{COMPANY.hours}</p>
        </div>
      </div>

      <h3>Dados da empresa</h3>
      <p>
        <strong>{COMPANY.legalName}</strong>
        <br />
        CNPJ: {COMPANY.cnpj}
      </p>
    </StaticPage>
  );
}
