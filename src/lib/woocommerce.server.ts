import { createServerFn } from "@tanstack/react-start";

/**
 * Camada de acesso ao WooCommerce — roda SÓ no servidor (Vercel serverless).
 * A Consumer Key/Secret ficam em variáveis de ambiente e NUNCA chegam ao
 * bundle enviado ao navegador do cliente.
 */

const WC_BASE = process.env.WC_API_URL || "https://4mcinformatica.com";

function wcUrl(path: string, params: Record<string, string> = {}) {
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;
  if (!ck || !cs) {
    throw new Error(
      "WC_CONSUMER_KEY / WC_CONSUMER_SECRET não configuradas nas variáveis de ambiente do servidor."
    );
  }
  const qs = new URLSearchParams({ ...params, consumer_key: ck, consumer_secret: cs });
  return `${WC_BASE}/wp-json/wc/v3${path}?${qs.toString()}`;
}

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  featured: boolean;
  average_rating: string;
  images: { src: string }[];
  categories: { id: number; name: string; slug: string }[];
};

export type StoreProduct = {
  id: number;
  name: string;
  image: string;
  price: string;
  installment: string;
  badge?: string;
  rating: number;
  url: string;
  inStock: boolean;
};

function formatBRL(value: string | number) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!n || Number.isNaN(n)) return "Sob consulta";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function installmentText(price: string) {
  const n = parseFloat(price);
  if (!n) return "";
  const parcelas = 10;
  const valor = n / parcelas;
  return `ou ${parcelas}x de ${formatBRL(valor)} s/ juros`;
}

function mapProduct(p: WCProduct): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    image: p.images?.[0]?.src || "",
    price: formatBRL(p.price || p.regular_price),
    installment: installmentText(p.price || p.regular_price),
    badge: p.featured ? "Premium" : undefined,
    rating: p.average_rating ? Math.round(parseFloat(p.average_rating)) : 5,
    url: p.permalink,
    inStock: p.stock_status === "instock",
  };
}

/** Produtos em destaque (marcados como "featured" no WooCommerce). */
export const getFeaturedProducts = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(wcUrl("/products", { featured: "true", per_page: "8", status: "publish" }));
  if (!res.ok) throw new Error(`Falha ao buscar destaques: ${res.status}`);
  const data: WCProduct[] = await res.json();
  return data.map(mapProduct);
});

/** Produtos mais recentes (fallback caso não haja "featured" suficientes). */
export const getRecentProducts = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(wcUrl("/products", { per_page: "8", orderby: "date", order: "desc", status: "publish" }));
  if (!res.ok) throw new Error(`Falha ao buscar produtos recentes: ${res.status}`);
  const data: WCProduct[] = await res.json();
  return data.map(mapProduct);
});

export type StoreCategory = { id: number; name: string; slug: string; image: string; url: string };

/** Categorias reais da loja, com contagem de produtos > 0. */
export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(wcUrl("/products/categories", { per_page: "20", hide_empty: "true" }));
  if (!res.ok) throw new Error(`Falha ao buscar categorias: ${res.status}`);
  const data: Array<{ id: number; name: string; slug: string; image: { src: string } | null }> = await res.json();
  return data
    .filter((c) => c.slug !== "sem-categoria")
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image?.src || "",
      url: `${WC_BASE}/categoria-produto/${c.slug}/`,
    }));
});

/** Monta a URL de "Adicionar ao carrinho" nativa do WooCommerce (checkout real). */
export function addToCartUrl(productId: number) {
  return `${WC_BASE}/carrinho/?add-to-cart=${productId}`;
}
