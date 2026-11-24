import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  destinationLabel,
  formatCalendarDate,
  referrerLabel,
  sortClicksByDay,
  sortLinksByNewest,
} from "./format.ts";
import { parseShortUrls, parseUrlStats } from "./parse.ts";

const urlsPayload = [
  {
    shortCode: "6KzLkFG",
    shortUrl: "http://localhost:8080/6KzLkFG",
    originalUrl: "https://example.com/docs",
    createdAt: "2026-11-24T20:13:47.055692Z",
    expiresAt: null,
    clickCount: 2,
  },
];

const statsPayload = {
  shortCode: "6KzLkFG",
  totalClicks: 4,
  clicksByDay: [
    { date: "2026-11-24", clicks: 3 },
    { date: "2026-10-26", clicks: 0 },
  ],
  topReferrers: [
    { referrer: "https://ref.example", clicks: 3 },
    { referrer: "", clicks: 1 },
  ],
};

describe("analytics formatting", () => {
  it("labels a calendar day without shifting the date", () => {
    assert.equal(formatCalendarDate("2026-11-24"), "24 nov");
    assert.equal(formatCalendarDate("2026-10-26"), "26 out");
  });

  it("names an empty referrer as direct access and keeps the host otherwise", () => {
    assert.equal(referrerLabel(""), "Acesso direto");
    assert.equal(referrerLabel("   "), "Acesso direto");
    assert.equal(referrerLabel("https://ref.example/path"), "ref.example");
    assert.equal(referrerLabel("not a url"), "not a url");
  });

  it("shortens a destination to host and path", () => {
    assert.equal(destinationLabel("https://example.com/docs"), "example.com/docs");
  });

  it("orders click days from oldest to newest", () => {
    const parsed = parseUrlStats(statsPayload);
    assert.ok(parsed);
    assert.deepEqual(
      sortClicksByDay(parsed.clicksByDay).map((day) => day.date),
      ["2026-10-26", "2026-11-24"],
    );
  });

  it("lists newer links first", () => {
    const parsed = parseShortUrls([
      { ...urlsPayload[0], shortCode: "older", createdAt: "2026-11-01T00:00:00Z" },
      urlsPayload[0],
    ]);
    assert.ok(parsed);
    assert.deepEqual(
      sortLinksByNewest(parsed).map((link) => link.shortCode),
      ["6KzLkFG", "older"],
    );
  });
});

describe("analytics payloads", () => {
  it("accepts the list and stats contracts", () => {
    assert.deepEqual(parseShortUrls(urlsPayload), urlsPayload);
    assert.equal(parseUrlStats(statsPayload)?.totalClicks, 4);
  });

  it("rejects a payload that is missing the series", () => {
    assert.equal(parseUrlStats({ shortCode: "6KzLkFG", totalClicks: 1 }), null);
    assert.equal(parseShortUrls({ shortCode: "6KzLkFG" }), null);
  });
});
