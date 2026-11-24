import type { ClickDay, ReferrerCount, ShortUrl, UrlStats } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isClickDay(value: unknown): value is ClickDay {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    typeof value.clicks === "number"
  );
}

function isReferrerCount(value: unknown): value is ReferrerCount {
  return (
    isRecord(value) &&
    typeof value.referrer === "string" &&
    typeof value.clicks === "number"
  );
}

export function parseShortUrls(body: unknown): ShortUrl[] | null {
  if (!Array.isArray(body) || !body.every(isShortUrl)) {
    return null;
  }
  return body;
}

function isShortUrl(value: unknown): value is ShortUrl {
  if (!isRecord(value)) {
    return false;
  }
  const expiresAt = value.expiresAt;
  return (
    typeof value.shortCode === "string" &&
    typeof value.shortUrl === "string" &&
    typeof value.originalUrl === "string" &&
    typeof value.createdAt === "string" &&
    (expiresAt === null || typeof expiresAt === "string") &&
    typeof value.clickCount === "number"
  );
}

export function parseUrlStats(body: unknown): UrlStats | null {
  if (
    !isRecord(body) ||
    typeof body.shortCode !== "string" ||
    typeof body.totalClicks !== "number" ||
    !Array.isArray(body.clicksByDay) ||
    !body.clicksByDay.every(isClickDay) ||
    !Array.isArray(body.topReferrers) ||
    !body.topReferrers.every(isReferrerCount)
  ) {
    return null;
  }
  return {
    shortCode: body.shortCode,
    totalClicks: body.totalClicks,
    clicksByDay: body.clicksByDay,
    topReferrers: body.topReferrers,
  };
}
