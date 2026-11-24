import { ClickStrip } from "@/components/click-strip";
import { ReferrerList } from "@/components/referrer-list";
import { getStats, listUrls } from "@/lib/api";
import { formatInstant } from "@/lib/format";

export async function AnalyticsReport({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [statsResult, linksResult] = await Promise.all([getStats(code), listUrls()]);

  if (statsResult.status === "not-found") {
    return (
      <section className="ticket px-5 pt-8 pb-6 sm:px-8" role="status">
        <p className="font-mono text-xs tracking-[0.18em] text-route uppercase">Código</p>
        <h1 className="mt-2 font-mono text-4xl tracking-tight">{code}</h1>
        <p className="mt-4 text-sm text-ink">Esse código não existe.</p>
      </section>
    );
  }

  if (statsResult.status !== "ok") {
    return (
      <p className="border border-line bg-card px-4 py-5 text-sm text-ink" role="alert">
        Não foi possível carregar os acessos de <span className="font-mono">{code}</span>. Confira se a API está no ar.
      </p>
    );
  }

  const stats = statsResult.data;
  const link = linksResult.status === "ok" ? linksResult.data.find((item) => item.shortCode === code) : undefined;

  return (
    <article className="ticket px-5 pt-8 pb-6 sm:px-8">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-[0.18em] text-route uppercase">Código</p>
          <h1 className="mt-2 font-mono text-4xl tracking-tight break-all sm:text-5xl">{stats.shortCode}</h1>
        </div>
        <div className="shrink-0 border-2 border-stamp px-3 py-2 text-center text-stamp">
          <p className="font-mono text-3xl leading-none">{stats.totalClicks}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] uppercase">
            {stats.totalClicks === 1 ? "clique" : "cliques"}
          </p>
        </div>
      </div>

      {link ? (
        <div className="mt-5 min-w-0">
          <a
            href={link.originalUrl}
            className="block break-all text-route underline decoration-line underline-offset-4"
          >
            {link.originalUrl}
          </a>
          <p className="mt-2 font-mono text-xs break-all text-muted">{link.shortUrl}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            criado em {formatInstant(link.createdAt)}
            {link.expiresAt ? ` · expira em ${formatInstant(link.expiresAt)}` : " · sem expiração"}
          </p>
        </div>
      ) : null}

      <p className="mt-5 text-sm text-muted">O endereço desta página é o relatório. Envie para quem criou o link.</p>

      <section className="ticket-rule mt-6 pt-6">
        <h2 className="font-mono text-xs tracking-[0.18em] text-route uppercase">Cliques por dia</h2>
        <div className="mt-4">
          {stats.totalClicks === 0 ? (
            <p className="text-sm text-muted">Esse link ainda não foi acessado.</p>
          ) : (
            <ClickStrip days={stats.clicksByDay} />
          )}
        </div>
      </section>

      <section className="ticket-rule mt-6 pt-6">
        <h2 className="font-mono text-xs tracking-[0.18em] text-route uppercase">Principais origens</h2>
        <div className="mt-4">
          <ReferrerList referrers={stats.topReferrers} />
        </div>
      </section>
    </article>
  );
}
