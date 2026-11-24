import { Suspense } from "react";

import { LinkList } from "@/components/link-list";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
      <SiteHeader />
      <div>
        <h1 className="text-3xl tracking-tight">Links criados</h1>
        <p className="mt-2 max-w-xl text-muted">
          Os mais recentes aparecem primeiro. Abra um código para ver os cliques, o dia e a origem.
        </p>
      </div>
      <Suspense fallback={<p className="font-mono text-sm text-muted">Carregando links…</p>}>
        <LinkList />
      </Suspense>
    </main>
  );
}
