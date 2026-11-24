import { connection } from "next/server";

import { parseShortUrls, parseUrlStats } from "./parse.ts";
import type { ShortUrl, UrlStats } from "./types.ts";

export type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-found" }
  | { status: "unavailable" };

export function apiBaseUrl(): string {
  return (process.env.API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
}

async function fetchJson(path: string): Promise<
  | { status: "ok"; body: unknown }
  | { status: "not-found" }
  | { status: "unavailable" }
> {
  await connection();
  try {
    const response = await fetch(`${apiBaseUrl()}${path}`, { cache: "no-store" });
    if (response.status === 404) {
      return { status: "not-found" };
    }
    if (!response.ok) {
      return { status: "unavailable" };
    }
    return { status: "ok", body: await response.json() };
  } catch {
    return { status: "unavailable" };
  }
}

export async function listUrls(): Promise<ApiResult<ShortUrl[]>> {
  const result = await fetchJson("/api/urls");
  if (result.status !== "ok") {
    return result;
  }
  const data = parseShortUrls(result.body);
  return data ? { status: "ok", data } : { status: "unavailable" };
}

export async function getStats(code: string): Promise<ApiResult<UrlStats>> {
  const result = await fetchJson(`/api/stats/${encodeURIComponent(code)}`);
  if (result.status !== "ok") {
    return result;
  }
  const data = parseUrlStats(result.body);
  return data ? { status: "ok", data } : { status: "unavailable" };
}
