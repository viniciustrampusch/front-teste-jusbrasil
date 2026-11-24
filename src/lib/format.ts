import type { ClickDay, ReferrerCount, ShortUrl } from "./types.ts";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

function calendarParts(isoDate: string): { day: number; month: string } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return null;
  }
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) {
    return null;
  }
  return { day: Number(match[3]), month };
}

export function formatCalendarDate(isoDate: string): string {
  const parts = calendarParts(isoDate);
  if (!parts) {
    return isoDate;
  }
  return `${parts.day} ${parts.month}`;
}

export function formatDayNumber(isoDate: string): string {
  const parts = calendarParts(isoDate);
  return parts ? String(parts.day) : isoDate;
}

export function formatMonth(isoDate: string): string {
  return calendarParts(isoDate)?.month ?? "";
}

export function formatInstant(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function referrerLabel(referrer: string): string {
  if (referrer.trim() === "") {
    return "Acesso direto";
  }
  try {
    return new URL(referrer).host;
  } catch {
    return referrer;
  }
}

export function destinationLabel(originalUrl: string): string {
  try {
    const url = new URL(originalUrl);
    const path = url.pathname === "/" ? "" : url.pathname;
    return `${url.host}${path}`;
  } catch {
    return originalUrl;
  }
}

export function sortClicksByDay(days: ClickDay[]): ClickDay[] {
  return [...days].sort((left, right) => left.date.localeCompare(right.date));
}

export function sortReferrers(referrers: ReferrerCount[]): ReferrerCount[] {
  return [...referrers].sort((left, right) => right.clicks - left.clicks);
}

export function sortLinksByNewest(links: ShortUrl[]): ShortUrl[] {
  return [...links].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
