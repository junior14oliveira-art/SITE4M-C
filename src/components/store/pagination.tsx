import { Link } from "@tanstack/react-router";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => { to: string; search?: Record<string, unknown>; params?: Record<string, string> };
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginação">
      <Link
        {...buildHref(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-ink transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-xs text-muted-foreground">…</span>}
          <Link
            {...buildHref(p)}
            className="flex size-9 items-center justify-center rounded-md border text-sm font-semibold transition-colors"
            activeProps={{ className: "border-primary bg-primary text-primary-foreground" }}
            inactiveProps={{ className: "border-border bg-card text-ink hover:border-primary hover:text-primary" }}
          >
            {p}
          </Link>
        </span>
      ))}
      <Link
        {...buildHref(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-ink transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  );
}
