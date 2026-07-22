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
  description: string;
  short_description: string;
  sku: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  featured: boolean;
  average_rating: string;
  rating_count: number;
  images: { src: string }[];
  categories: { id: number; name: string; slug: string }[];
};

export type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: string;
  installment: string;
  badge?: string;
  rating: number;
  url: string;
  inStock: boolean;
};

export type StoreProductDetail = StoreProduct & {
  description: string;
  shortDescription: string;
  sku: string;
  images: string[];
  categories: { name: string; slug: string }[];
  reviewCount: number;
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
    slug: p.slug,
    image: p.images?.[0]?.src || "",
    price: formatBRL(p.price || p.regular_price),
    installment: installmentText(p.price || p.regular_price),
    badge: p.featured ? "Premium" : undefined,
    rating: p.average_rating ? Math.round(parseFloat(p.average_rating)) : 5,
    url: p.permalink,
    inStock: p.stock_status === "instock",
  };
}

function mapProductDetail(p: WCProduct): StoreProductDetail {
  return {
    ...mapProduct(p),
    description: p.description || "",
    shortDescription: p.short_description || "",
    sku: p.sku || "",
    images: (p.images || []).map((i) => i.src),
    categories: (p.categories || []).map((c) => ({ name: c.name, slug: c.slug })),
    reviewCount: p.rating_count || 0,
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

export type StoreCategory = { id: number; name: string; slug: string; image: string; url: string; description: string };

/** Categorias reais da loja, com contagem de produtos > 0. */
export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(wcUrl("/products/categories", { per_page: "20", hide_empty: "true" }));
  if (!res.ok) throw new Error(`Falha ao buscar categorias: ${res.status}`);
  const data: Array<{ id: number; name: string; slug: string; description: string; image: { src: string } | null }> =
    await res.json();
  return data
    .filter((c) => c.slug !== "sem-categoria")
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image?.src || "",
      description: c.description || "",
      // Rota interna do proprio React, nao mais o link direto do WordPress —
      // agora que a pagina de categoria existe dentro do site novo.
      url: `/categoria/${c.slug}`,
    }));
});

/** Uma categoria especifica pelo slug (para o cabecalho da pagina de categoria). */
export const getCategoryBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const res = await fetch(wcUrl("/products/categories", { slug }));
    if (!res.ok) throw new Error(`Falha ao buscar categoria: ${res.status}`);
    const list: Array<{ id: number; name: string; slug: string; description: string; image: { src: string } | null }> =
      await res.json();
    const c = list[0];
    if (!c) return null;
    return { id: c.id, name: c.name, slug: c.slug, image: c.image?.src || "", description: c.description || "" };
  });

export type PaginatedProducts = { products: StoreProduct[]; page: number; totalPages: number; total: number };

function pageMeta(res: Response, page: number): { totalPages: number; total: number } {
  return {
    totalPages: parseInt(res.headers.get("x-wp-totalpages") || "1", 10) || 1,
    total: parseInt(res.headers.get("x-wp-total") || "0", 10) || 0,
  };
}

/** Catálogo completo, paginado (página da Loja). */
export const getAllProducts = createServerFn({ method: "GET" })
  .validator((input: { page: number; search?: string }) => input)
  .handler(async ({ data }) => {
    const params: Record<string, string> = { per_page: "12", page: String(data.page), status: "publish" };
    if (data.search) params.search = data.search;
    const res = await fetch(wcUrl("/products", params));
    if (!res.ok) throw new Error(`Falha ao buscar produtos: ${res.status}`);
    const products: WCProduct[] = await res.json();
    return { products: products.map(mapProduct), page: data.page, ...pageMeta(res, data.page) } satisfies PaginatedProducts;
  });

/** Produtos de uma categoria, paginado. */
export const getProductsByCategory = createServerFn({ method: "GET" })
  .validator((input: { slug: string; page: number; categoryId: number }) => input)
  .handler(async ({ data }) => {
    const res = await fetch(
      wcUrl("/products", { category: String(data.categoryId), per_page: "12", page: String(data.page), status: "publish" })
    );
    if (!res.ok) throw new Error(`Falha ao buscar produtos da categoria: ${res.status}`);
    const products: WCProduct[] = await res.json();
    return { products: products.map(mapProduct), page: data.page, ...pageMeta(res, data.page) } satisfies PaginatedProducts;
  });

/** Detalhe completo de um produto pelo slug (página de produto). */
export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const res = await fetch(wcUrl("/products", { slug }));
    if (!res.ok) throw new Error(`Falha ao buscar produto: ${res.status}`);
    const list: WCProduct[] = await res.json();
    const p = list[0];
    return p ? mapProductDetail(p) : null;
  });

/** Produtos relacionados (mesma categoria, excluindo o produto atual). */
export const getRelatedProducts = createServerFn({ method: "GET" })
  .validator((input: { categoryId: number; excludeId: number }) => input)
  .handler(async ({ data }) => {
    const res = await fetch(
      wcUrl("/products", { category: String(data.categoryId), per_page: "5", exclude: String(data.excludeId), status: "publish" })
    );
    if (!res.ok) throw new Error(`Falha ao buscar relacionados: ${res.status}`);
    const products: WCProduct[] = await res.json();
    return products.slice(0, 4).map(mapProduct);
  });
