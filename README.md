# URL shortener analytics

Shareable click report for short links. The page reads the Kotlin API and does not store links itself.

## Stack

Next.js (App Router) and Tailwind CSS. The analytics view is a browser page, so the UI lives in a separate frontend. Server Components call the API, which avoids a CORS change on the backend. Tailwind is the styling layer because this screen is custom and does not use a design system.

Click counts change on every visit, so the pages fetch on each request instead of caching the response.

## Setup

The API defaults to `http://localhost:8080`. Override it when the backend listens elsewhere:

```bash
cp .env.example .env.local
```

`.env.local`:

```bash
API_BASE_URL=http://localhost:8080
```

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page lists links from `GET /api/urls`. Each row opens `/analytics/{code}`, which loads `GET /api/stats/{code}` and the same list so the report can show the original URL.

## Tests

```bash
npm test
```

The tests check date labels, referrer names, sort order, and the two JSON contracts. They do not call the API.
