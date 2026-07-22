import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo4mc from "@/assets/logo-4mc.png";
import type { StoreCategory } from "@/lib/woocommerce.server";
import { wpAccountUrl, wpCartUrl, wpPages } from "@/lib/site-config";

export function SiteHeader({ categories }: { categories: StoreCategory[] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/loja", search: query ? { q: query } : {} });
  }

  return (
    <>
      {/* Utility bar */}
      <div className="bg-ink py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-background/70 uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              PIX com desconto exclusivo
            </span>
            <span className="hidden text-[11px] font-medium tracking-wider text-background/70 uppercase md:inline">
              Garantia em todos os produtos
            </span>
            <span className="hidden text-[11px] font-medium tracking-wider text-background/70 uppercase md:inline">
              Entrega para todo o Brasil
            </span>
          </div>
          <div className="text-[11px] font-medium tracking-wider text-background/50 uppercase">
            Central B2B · (11) 3855-1360
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img src={logo4mc} alt="4M&C Informática" className="h-9 w-auto" />
            </Link>

            <div className="flex flex-1 items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busque por notebook, servidor, monitor…"
                  className="h-11 w-full rounded-md bg-secondary px-4 pl-11 text-sm ring-1 ring-black/5 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button type="submit" className="absolute top-3.5 left-3.5 text-muted-foreground" aria-label="Buscar">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="flex items-center gap-5">
              <a href={wpAccountUrl()} className="hidden items-center gap-2 md:flex">
                <div className="flex size-9 items-center justify-center rounded-full bg-secondary ring-1 ring-black/5">
                  <svg className="size-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Olá</span>
                  <span className="text-xs font-semibold">Minha conta</span>
                </div>
              </a>
              <a href={wpCartUrl()} className="relative flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-background transition-colors hover:bg-ink-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-semibold">Carrinho</span>
              </a>
            </div>
          </div>

          <nav className="mt-5 flex items-center gap-8 overflow-x-auto">
            <Link
              to="/loja"
              className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              Todos os produtos
            </Link>
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {c.name}
              </Link>
            ))}
            <a
              href={wpPages.institucional}
              className="ml-auto hidden whitespace-nowrap text-xs font-semibold text-ink uppercase lg:inline"
            >
              Institucional
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
