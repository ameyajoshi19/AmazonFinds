# AmazonFinds

A Next.js affiliate site surfacing the top 10 Amazon picks across 50+ categories. Products are curated by category, updated nightly via Amazon's Product Advertising API, and tracked with built-in view/click analytics.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, ISR) |
| Database | [Neon](https://neon.tech) — serverless Postgres |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Deployment | [Fly.io](https://fly.io) (Docker, Node standalone) |
| Styling | Tailwind CSS |
| Search | Fuse.js (client-side fuzzy search) |

## Project Structure

```
src/
├── app/                        # Next.js pages and API routes
│   ├── page.tsx                # Home — category grid
│   ├── categories/[slug]/      # Category page with product grid
│   ├── products/[id]/          # Product detail page
│   ├── search/                 # Client-side fuzzy search
│   └── api/
│       ├── products/           # GET — all products (used by search)
│       ├── revalidate/         # POST — trigger ISR cache purge
│       └── analytics/
│           ├── view/           # POST — record page views
│           └── click/          # POST — record affiliate link clicks
├── components/
│   ├── analytics/PageViewTracker.tsx   # Client beacon (fires on page mount)
│   └── ui/AffiliateLink.tsx           # Tracks clicks, links to Amazon
├── data/loader.ts              # All DB query functions (async)
├── lib/
│   ├── schema.ts               # Drizzle schema (categories, products, analytics)
│   ├── db.ts                   # Neon HTTP client
│   ├── affiliate.ts            # Affiliate tag injection
│   ├── amazon-pa-api.ts        # Amazon PA API v5 client
│   └── utils.ts                # cn, formatPrice, slugify, etc.
└── types/index.ts              # App-level TypeScript types

scripts/
├── migrate-json-to-db.ts       # One-time: import JSON files → Neon
├── refresh-products.ts         # Update prices/ASINs via PA API
├── scaffold-category.ts        # Add new scaffolded category rows to DB
├── detect-trends.ts            # Discover trending category keywords
└── run-daily.ts                # Orchestrates nightly refresh (run by CI)
```

## Database Schema

Four tables in Neon Postgres, managed with Drizzle ORM:

```
categories       — slug (PK), name, icon, accentColor, scaffolded, ...
products         — id (PK), categorySlug (FK), rank, price, affiliateUrl, asin, ...
page_views       — id, entityType ("product"|"category"), entityId, viewedAt, ...
affiliate_clicks — id, productId (FK), clickedAt, userAgent, referrer
```

`page_views` and `affiliate_clicks` are append-only analytics tables.
Query them directly in Neon's SQL editor or `npm run db:studio` to explore the data.

## Local Setup

**1. Clone and install**
```bash
git clone <repo>
cd AmazonFinds
npm install
```

**2. Set up environment**
```bash
cp .env.local.example .env.local
# Edit .env.local — at minimum, set DATABASE_URL
```

**3. Create the schema in Neon**
```bash
npm run db:push
```

**4. Import product data**
```bash
npm run migrate-db
```

**5. Run the dev server**
```bash
npm run dev
```

## npm Scripts

| Script | What it does |
|---|---|
| `dev` | Start dev server |
| `build` | Production build |
| `db:push` | Push schema changes directly to Neon (no migration files) |
| `db:generate` | Generate SQL migration files from schema |
| `db:migrate` | Apply pending migration files |
| `db:studio` | Open Drizzle Studio (local DB browser) |
| `migrate-db` | One-time: import all JSON data files into Neon |
| `refresh-products` | Fetch live prices and ASINs from Amazon PA API |

## Deployment (Fly.io)

**First deploy**
```bash
# Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
fly launch --no-deploy

# Set secrets (DATABASE_URL is also needed at build time for static generation)
fly secrets set \
  DATABASE_URL="postgresql://..." \
  REVALIDATE_SECRET="..." \
  NEXT_PUBLIC_AFFILIATE_TAG="your-tag-20" \
  AMAZON_ACCESS_KEY_ID="..." \
  AMAZON_SECRET_ACCESS_KEY="..."

fly deploy
```

**Subsequent deploys**
```bash
fly deploy
```

`DATABASE_URL` is injected as a Docker build arg so Next.js can pre-render all product and category pages at build time via `generateStaticParams`.

## Analytics

All analytics data lives in Neon. No external service needed.

**Page views** — recorded client-side on every product and category page load:
```sql
-- Most viewed products (last 30 days)
SELECT entity_id, count(*) AS views
FROM page_views
WHERE entity_type = 'product'
  AND viewed_at > now() - interval '30 days'
GROUP BY entity_id
ORDER BY views DESC
LIMIT 20;
```

**Affiliate clicks** — recorded when a visitor clicks "View on Amazon":
```sql
-- Top clicked products (last 7 days)
SELECT p.name, count(*) AS clicks
FROM affiliate_clicks ac
JOIN products p ON p.id = ac.product_id
WHERE ac.clicked_at > now() - interval '7 days'
GROUP BY p.name
ORDER BY clicks DESC
LIMIT 20;
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon connection string |
| `NEXT_PUBLIC_AFFILIATE_TAG` | Yes | Amazon Associates tag |
| `REVALIDATE_SECRET` | Yes | Secret for `/api/revalidate` webhook |
| `AMAZON_ACCESS_KEY_ID` | For refresh | PA API access key |
| `AMAZON_SECRET_ACCESS_KEY` | For refresh | PA API secret key |
| `SITE_URL` | CI only | Deployed URL (used by GitHub Actions to trigger revalidation) |

## CI: Nightly Refresh

`.github/workflows/daily-trends.yml` runs every night at 2 AM UTC:
1. Detects trending search queries via Google Trends
2. Scaffolds new category rows for any novel trends
3. Refreshes prices and ASINs via Amazon PA API
4. Calls `/api/revalidate` to purge the ISR cache

Add all environment variables as GitHub repository secrets for this to work.
