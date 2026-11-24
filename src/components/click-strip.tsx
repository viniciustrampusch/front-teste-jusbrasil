import { formatCalendarDate, formatDayNumber, formatMonth, sortClicksByDay } from "@/lib/format";
import type { ClickDay } from "@/lib/types";

const TRACK_HEIGHT = 112;

export function ClickStrip({ days }: { days: ClickDay[] }) {
  const ordered = sortClicksByDay(days);
  const peak = ordered.reduce((highest, day) => Math.max(highest, day.clicks), 0);

  if (ordered.length === 0) {
    return <p className="text-sm text-muted">Nenhum dia neste relatório.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <ol className="flex items-end gap-1.5 pb-1">
        {ordered.map((day, index) => {
          const previous = ordered[index - 1];
          const showMonth = !previous || previous.date.slice(0, 7) !== day.date.slice(0, 7);
          const height = peak === 0 || day.clicks === 0 ? 0 : Math.max(12, (day.clicks / peak) * TRACK_HEIGHT);
          return (
            <li
              key={day.date}
              className="flex w-9 shrink-0 flex-col items-center gap-1"
              aria-label={`${formatCalendarDate(day.date)}, ${day.clicks} cliques`}
            >
              <span aria-hidden="true" className="font-mono text-[11px] text-ink">
                {day.clicks}
              </span>
              <span
                aria-hidden="true"
                className="flex h-28 w-full items-end rounded-sm bg-line/70"
              >
                <span
                  className="punch-fill block w-full rounded-sm bg-stamp"
                  style={{ height }}
                />
              </span>
              <span aria-hidden="true" className="text-center font-mono text-[10px] leading-tight text-muted">
                {formatDayNumber(day.date)}
                <span className="block h-3 text-route">{showMonth ? formatMonth(day.date) : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
