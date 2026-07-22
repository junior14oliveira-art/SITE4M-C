import { createFileRoute } from "@tanstack/react-router";
import { getCategories } from "@/lib/woocommerce.server";
import { StaticPage } from "@/components/store/static-page";
import { COMPANY } from "@/lib/site-config";

export const Route = createFileRoute("/privacidade")({
  loader: async () => ({ categories: await getCategories().catch(() => []) }),
  head: () => ({
    meta: [
      { title: "Política de Privacidade | 4M&C Informática" },
      {
        name: "description",
        content: "Como a 4M&C Informática coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
      },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  const { categories } = Route.useLoaderData();
  return (
    <StaticPage categories={categories} eyebrow="Legal" title="Política de Privacidade">
      <p>
        A {COMPANY.legalName}, inscrita no CNPJ {COMPANY.cnpj}, com sede em {COMPANY.address}, respeita a sua
        privacidade e está comprometida com a proteção dos seus dados pessoais, conforme a Lei nº 13.709/2018 (LGPD).
      </p>
      <h3>1. Dados que coletamos</h3>
      <ul>
        <li><strong>Cadastrais:</strong> nome, CPF, e-mail, telefone, endereço.</li>
        <li><strong>De navegação:</strong> IP, cookies, páginas visitadas, dispositivo.</li>
        <li><strong>De compra:</strong> produtos, pedidos, dados de pagamento (processados pelo meio de pagamento do checkout; não armazenamos dados de cartão).</li>
      </ul>
      <h3>2. Finalidades</h3>
      <p>
        Processar pedidos e pagamentos; entregar produtos; dar suporte; enviar comunicações (com consentimento);
        cumprir obrigações legais/fiscais; prevenir fraudes.
      </p>
      <h3>3. Base legal</h3>
      <p>Execução de contrato, cumprimento de obrigação legal, consentimento e legítimo interesse (LGPD art. 7).</p>
      <h3>4. Compartilhamento</h3>
      <p>Com transportadoras, meios de pagamento, Correios e autoridades quando exigido por lei. Não vendemos seus dados.</p>
      <h3>5. Seus direitos (LGPD art. 18)</h3>
      <p>
        Confirmação, acesso, correção, anonimização, portabilidade, eliminação e revogação do consentimento.
        Solicite pelo e-mail {COMPANY.email}.
      </p>
      <h3>6. Retenção e segurança</h3>
      <p>
        Mantemos os dados pelo tempo necessário às finalidades e prazos legais, com medidas técnicas e
        administrativas para protegê-los.
      </p>
      <h3>7. Encarregado (DPO)</h3>
      <p>Contato: {COMPANY.email}.</p>
    </StaticPage>
  );
}
