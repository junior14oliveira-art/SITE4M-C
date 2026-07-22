/**
 * Google Tag Manager — instalação única do container.
 *
 * O ID do container (GTM-XXXXXXX) vem da variável de ambiente VITE_GTM_ID,
 * configurada no painel da Vercel. Enquanto ela não existir, nada é carregado
 * (o site funciona normalmente, só sem rastreamento). Quando você criar o
 * container no tagmanager.google.com e colar o ID na Vercel, TODAS as tags que
 * você configurar lá (GA4, Google Ads, remarketing, conversão, Merchant...)
 * passam a funcionar — sem tocar no código.
 */
export const GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined) || "";

export const gtmEnabled = () => GTM_ID.length > 0;

/** Script que vai no <head> — inicializa o container do GTM. */
export function gtmHeadScript(): string {
  if (!gtmEnabled()) return "";
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
}

/** URL do <noscript> (fallback pra quem tem JS desligado). */
export function gtmNoscriptSrc(): string {
  return `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
}

/**
 * Envia um "pageview virtual" a cada navegação. Necessário porque o React troca
 * de página sem recarregar — sem isto, o Analytics só contaria a 1ª página.
 */
export function trackPageview(url: string, title: string) {
  if (!gtmEnabled() || typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "pageview", page_path: url, page_title: title });
}
