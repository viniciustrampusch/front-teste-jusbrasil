import { referrerLabel, sortReferrers } from "@/lib/format";
import type { ReferrerCount } from "@/lib/types";

export function ReferrerList({ referrers }: { referrers: ReferrerCount[] }) {
  const ranked = sortReferrers(referrers);
  if (ranked.length === 0) {
    return <p className="text-sm text-muted">Nenhuma origem registrada.</p>;
  }

  const peak = Math.max(...ranked.map((item) => item.clicks), 1);

  return (
    <ol className="flex flex-col gap-4">
      {ranked.map((item, index) => {
        const direct = item.referrer.trim() === "";
        const label = referrerLabel(item.referrer);
        const width = `${(item.clicks / peak) * 100}%`;
        return (
          <li key={`${item.referrer}-${index}`}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="truncate" title={direct ? label : item.referrer}>
                {label}
              </span>
              <span className="font-mono text-ink">{item.clicks}</span>
            </div>
            <div className="mt-1.5 h-2 bg-line/80" aria-hidden="true">
              <div className={`h-full ${direct ? "bg-muted" : "bg-route"}`} style={{ width }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
