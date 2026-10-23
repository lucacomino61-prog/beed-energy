# BeeD Energy — architecture

Local build, nothing deployed. Dev server: `npm run dev` → http://127.0.0.1:3810 (launch entry "beed-energy").

## Stack
- **Astro 7 SSR** (`output: 'server'`, `@astrojs/node` standalone). Every page is server-rendered: all words, prices and links are in the HTML before scripts run.
- **SQLite through `node:sqlite`** (Node ≥ 22.13; no native build). One file: `data/beed.db`. Schema: `src/lib/schema.sql` (applied on every open, `CREATE … IF NOT EXISTS`).
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

## Money
Whole lekë, VAT (TVSH 20%) included, formatted by hand (`src/lib/money.ts`) because Chrome has no Albanian Intl data. EUR shown as a secondary "≈ €" using the Bank of Albania rate in settings.

## Basket and checkout
- Basket = HttpOnly cookie `beed_cart` (`offerId-qty.offerId-qty`), written only by `POST /api/cart` (form post without scripts, JSON with scripts). A line is a product **from a seller**. The compare list is the cookie `beed_cmp` (max 4, one category). Both render in the HTML (header count, basket page, compare tray). The server re-prices everything (`src/lib/cart.ts → quote()`): volume tiers, stock, minimum quantity, seller delivery zones, one parcel fee per seller (+ zone surcharge, free above the seller's threshold), VAT contained, platform commission.
- `createOrder()` (`src/lib/orders.ts`) runs in one `BEGIN IMMEDIATE` transaction: re-quote, decrement stock with a guarded UPDATE, write order + lines + first event. Order link carries an unguessable token.
- Payment: cash on delivery (up to a limit), bank transfer, card through POK (`src/lib/payments.ts`; without keys a clearly labelled local test gateway; paid only after re-reading the order at POK).

## Admin
`/admin` behind a server session (scrypt hash, SHA-256 of the cookie token in `sessions`, CSRF token per session on every form + Astro's origin check). Roles: `admin` sees everything; `seller` sees only their own offers, orders and quote threads. Local dev: `DEV_LOGIN=1` shows a "sign in as developer" button on 127.0.0.1 only.

## Security headers
Set in `src/middleware.ts`. Referrer-Policy is `strict-origin-when-cross-origin` on purpose: `no-referrer` makes browsers send `Origin: null` on form posts and the origin check would refuse every sign-in.
