import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AnalyticsReport } from "@/components/analytics-report";
import { SiteHeader } from "@/components/site-header";

export async function generateMetadata({ params }: PageProps<"/analytics/[code]">): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Acessos de ${code}`,
    description: `Relatório de cliques do link ${code}.`,
  };
}

export default function AnalyticsPage({ params }: PageProps<"/analytics/[code]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8">
      <SiteHeader />
      <Link href="/" className="w-fit text-sm text-route underline underline-offset-4">
        Todos os links
      </Link>
      <Suspense fallback={<p className="font-mono text-sm text-muted">Carregando acessos…</p>}>
        <AnalyticsReport params={params} />
      </Suspense>
    </main>
  );
}
