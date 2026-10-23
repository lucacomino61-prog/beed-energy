# BeeD Energy — architecture

Local build, nothing deployed. Dev server: `npm run dev` → http://127.0.0.1:3810 (launch entry "beed-energy").

## Stack
- **Astro 7 SSR** (`output: 'server'`, `@astrojs/cloudflare`, running as a Cloudflare Worker). Every page is server-rendered: all words, prices and links are in the HTML before scripts run.
- **Product photos** in Workers KV, binding `MEDIA` (`src/lib/media.ts`): keys are content hashes (`p/<product>/<sha256>.webp`), `product_images` keeps path, size and alt text, `/media/[...key]` serves them `immutable`. The file's real format is checked from its first bytes, not its name or declared type.
- **Cloudflare D1** (SQLite), binding `DB`. Schema: `migrations/0001_init.sql`, generated from `src/lib/schema.sql` and applied with `wrangler d1 migrations apply`. `src/lib/db.ts` reads the binding from `cloudflare:workers`; every query is awaited. The seed scripts still build `data/beed.db` with `node:sqlite`, and `scripts/d1-export.mjs` turns it into `seed.sql` for D1.
- **GSAP 3.15 + ScrollTrigger + Lenis 1.3** on one ticker: GSAP's ticker is the only `requestAnimationFrame` owner; Lenis steps from it (`autoRaf: false`). No other animation library, no component that brings its own loop.
- Vanilla TypeScript in Astro `<script>` modules. No front-end framework.

## Languages and routes
Albanian at the root, English under `/en`. Paths are localised and built only through `href(lang, key, params)` in `src/lib/i18n.ts` (`ROUTES`). Each page is a thin route file in `src/pages/…` that renders a shared view in `src/views/…` with `lang`.

| key | sq | en |
|---|---|---|
| home | `/` | `/en` |
| shop | `/dyqani` | `/en/shop` |
| category | `/dyqani/:slug` (slug_sq) | `/en/shop/:slug` (slug_en) |
| product | `/produkt/:slug` | `/en/product/:slug` |
| compare | `/krahaso?p=1,2,3` | `/en/compare?p=…` |
| cart | `/shporta` | `/en/cart` |
| checkout | `/arka` | `/en/checkout` |
| order | `/porosia/:code?k=token` | `/en/order/:code?k=…` |
| calculator | `/kalkulatori-diellor` | `/en/solar-calculator` |
| sellers / seller | `/shitesit`, `/shitesit/:slug` | `/en/sellers`, `/en/sellers/:slug` |
| sell with us | `/shit-me-ne` | `/en/sell-with-us` |
| request a quote / thread | `/kerko-oferte`, `/oferta/:code?k=` | `/en/request-a-quote`, `/en/quote/:code?k=` |
| search | `/kerko?q=` | `/en/search?q=` |
| about, contact, terms, privacy | `/rreth-nesh`, `/kontakt`, `/kushtet`, `/privatesia` | `/en/about`, `/en/contact`, `/en/terms`, `/en/privacy` |
| admin | `/admin/…` (one UI, sq with an EN toggle) | |

## Data model (see schema.sql)
- `categories` + `spec_attributes` = the **spec template** of each category (key, sq/en label, unit, type number/text/enum/bool, enum options, filterable, comparable, highlight on cards, required, better higher/lower, decimals, sort). Admin edits templates; product editors render from them.
- `products` (+ `product_specs` values, `product_images`, real outer dimensions in mm used to draw each product's technical drawing).
- `sellers` (supplier / installer / manufacturer / contractor; plan start|pro|partner; commission %; verified; delivery zones; status).
- `offers` = one seller's price for one product (VAT-inclusive lekë, stock, lead days, min qty, delivery fee, free-delivery threshold, promoted flag) + `offer_tiers` (volume prices) + `price_history`.
- `orders`, `order_items` (seller + commission per line), `order_events` (timeline).
- `quote_requests` + `messages` (buyer ↔ seller ↔ admin threads: the brief's "direct communication").
- `seller_applications`, `contact_messages`, `price_alerts`, `cities` (delivery zone + PVGIS yield), `users` (admin | seller), `sessions`, `settings`, `audit_log`.
- Anything a seed invents has `is_demo = 1`.
- `npm run seed` only adds what is missing (rows matched through `seed:*` keys in `meta`, so admin renames and deletions stick); `--force` overwrites settings, categories, templates, products and demo sellers; `--demo` upserts the demo offers.

## Money
Whole lekë, VAT (TVSH 20%) included, formatted by hand (`src/lib/money.ts`) because Chrome has no Albanian Intl data. EUR shown as a secondary "≈ €" using the Bank of Albania rate in settings.

## Basket and checkout
- Basket = HttpOnly cookie `beed_cart` (`offerId-qty.offerId-qty`), written only by `POST /api/cart` (form post without scripts, JSON with scripts). A line is a product **from a seller**. The compare list is the cookie `beed_cmp` (max 4, one category). Both render in the HTML (header count, basket page, compare tray). The server re-prices everything (`src/lib/cart.ts → quote()`): volume tiers, stock, minimum quantity, seller delivery zones, one parcel fee per seller (+ zone surcharge, free above the seller's threshold), VAT contained, platform commission.
- `createOrder()` (`src/lib/orders.ts`) re-quotes, then writes everything as one D1 batch (atomic, but nothing can branch inside it): stock decrements first, held by `CHECK (stock_qty >= 0)` so an oversold line aborts the whole batch; then order, lines, parcels, nonce and first event, the child rows finding the order through its UNIQUE `code`. A clash on `code` retries with the next number. Order link carries an unguessable token.
- Payment: cash on delivery (up to a limit), bank transfer, card through POK (`src/lib/payments.ts`; without keys: a clearly labelled local test gateway in `npm run dev` or with `PAY_TEST=1`, otherwise card payment is off; every attempt is a row in `payments`; paid only after re-reading the POK order and checking its reference and amount). Unpaid card orders are cancelled after 45 minutes (stock returned). Each parcel's delivery fee is stored in `order_parcels`; a checkout form carries a one-time nonce (double submits land on the first order).

## Admin
`/admin` behind a server session (scrypt hash, SHA-256 of the cookie token in `sessions`, CSRF token per session on every form + Astro's origin check). Roles: `admin` sees everything; `seller` sees only their own offers, orders and quote threads. Local dev: `DEV_LOGIN=1` shows a "sign in as developer" button only in the dev server, on 127.0.0.1, from a loopback client address.

## Security headers
Set in `src/middleware.ts`: CSP on HTML (`src/lib/csp.ts`: scripts are files plus one hashed inline snippet; `assetsInlineLimit: 0` keeps the build from inlining scripts), HSTS on https. Behind a proxy set `PUBLIC_ORIGIN` (payment URLs, Secure cookies, `site`) and `TRUST_PROXY=1` (X-Forwarded-For / -Proto). Referrer-Policy is `strict-origin-when-cross-origin` on purpose: `no-referrer` makes browsers send `Origin: null` on form posts and the origin check would refuse every sign-in.
