/**
 * Ponto ÚNICO de configuração dos links que ainda vivem no WordPress/WooCommerce
 * (carrinho, checkout, minha conta, páginas legais/institucionais).
 *
 * Quando o WordPress mudar de domínio (ex.: hoje `4mcinformatica.com`, amanhã
 * `loja.4mcinformatica.com`), basta trocar a variável de ambiente
 * `VITE_WP_STORE_URL` no painel da Vercel — TODOS os links abaixo se atualizam
 * de uma vez, sem precisar mexer em nenhum componente.
 *
 * Obs.: esta URL é PÚBLICA (aparece nos links do navegador), por isso usa o
 * prefixo `VITE_`. As chaves secretas da API continuam só no servidor
 * (`WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET`), nunca aqui.
 */
export const WP_STORE_URL =
  (import.meta.env.VITE_WP_STORE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://4mcinformatica.com";

const wp = (path: string) => `${WP_STORE_URL}${path}`;

/** Carrinho nativo do WooCommerce. */
export const wpCartUrl = () => wp("/carrinho/");

/** "Adicionar ao carrinho" nativo do WooCommerce (leva direto pro fluxo de compra). */
export const wpAddToCartUrl = (productId: number) => wp(`/carrinho/?add-to-cart=${productId}`);

/** Área "Minha conta" do WooCommerce (login/pedidos/dados). */
export const wpAccountUrl = () => wp("/minha-conta/");

/** Páginas institucionais e legais (continuam no WordPress). */
export const wpPages = {
  institucional: wp("/institucional/"),
  quemSomos: wp("/quem-somos/"),
  contato: wp("/contato/"),
  privacidade: wp("/politica-de-privacidade/"),
  termos: wp("/termos-de-uso/"),
  envio: wp("/politica-de-envio-e-entrega/"),
  trocas: wp("/politica-de-trocas-e-devolucoes/"),
};

/** Contato direto (não muda com o domínio do WordPress). */
export const CONTACT = {
  whatsapp: "https://wa.me/551138551360",
  phone: "(11) 3855-1360",
  email: "contato@4mcinformatica.com",
};

/** Dados oficiais da empresa (confirmados pelo usuário) — usados nas páginas legais. */
export const COMPANY = {
  legalName: "4M&C Informática LTDA",
  brand: "4M&C Informática",
  cnpj: "27.192.596/0001-25",
  address: "Av. Pedro de Souza Lopes, 799 - Vila Galvão, Guarulhos/SP - CEP 07074-000",
  city: "Guarulhos/SP",
  email: "contato@4mcinformatica.com",
  phone: "(11) 3855-1360",
  hours: "Segunda a sexta, das 9h às 18h",
};
