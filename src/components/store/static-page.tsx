import type { ReactNode } from "react";
import type { StoreCategory } from "@/lib/woocommerce.server";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** Layout padrão para páginas de conteúdo (Quem Somos, Contato, políticas). */
export function StaticPage({
  categories,
  eyebrow,
  title,
  children,
}: {
  categories: StoreCategory[];
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <SiteHeader categories={categories} />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">{eyebrow}</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <div className="mt-8 text-[15px] leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-ink [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <SiteFooter categories={categories} />
    </div>
  );
}
