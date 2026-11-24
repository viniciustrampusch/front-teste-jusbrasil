export type ShortUrl = {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
};

export type ClickDay = {
  date: string;
  clicks: number;
};

export type ReferrerCount = {
  referrer: string;
  clicks: number;
};

export type UrlStats = {
  shortCode: string;
  totalClicks: number;
  clicksByDay: ClickDay[];
  topReferrers: ReferrerCount[];
};
