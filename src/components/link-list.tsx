import Link from "next/link";

import { listUrls } from "@/lib/api";
import { destinationLabel, formatInstant, sortLinksByNewest } from "@/lib/format";

export async function LinkList() {
  const result = await listUrls();

  if (result.status !== "ok") {
    return (
      <p className="border border-line bg-card px-4 py-5 text-sm text-ink" role="alert">
        A API não respondeu. Confira se o serviço está em execução e se{" "}
        <span className="font-mono">API_BASE_URL</span> aponta para ele.
      </p>
    );
  }

  const links = sortLinksByNewest(result.data);
  if (links.length === 0) {
    return (
      <p className="border border-dashed border-line bg-card px-4 py-8 text-sm text-muted">
        Nenhum link criado ainda. Quando a API criar um, ele aparece aqui.
      </p>
    );
  }

  return (
    <ul className="flex flex-col border-t border-line">
      {links.map((link) => (
        <li key={link.shortCode} className="border-b border-line">
          <Link
            href={`/analytics/${link.shortCode}`}
            className="group grid gap-3 py-4 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center"
          >
            <span className="font-mono text-xl tracking-tight text-ink">{link.shortCode}</span>
            <span className="min-w-0">
              <span className="block truncate text-route">{destinationLabel(link.originalUrl)}</span>
              <span className="mt-1 block font-mono text-xs text-muted">
                criado em {formatInstant(link.createdAt)}
                {link.expiresAt ? ` · expira em ${formatInstant(link.expiresAt)}` : " · sem expiração"}
              </span>
            </span>
            <span className="font-mono text-sm text-ink sm:text-right">
              {link.clickCount} {link.clickCount === 1 ? "clique" : "cliques"}
              <span className="mt-1 block text-xs tracking-wide text-route uppercase group-hover:underline">
                Ver acessos
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
