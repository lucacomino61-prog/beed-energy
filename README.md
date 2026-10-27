# BeeD Energy

A bilingual (Albanian / English) online marketplace for renewable energy in Albania: solar panels, inverters, batteries, heat pumps, solar water heaters and EV chargers, with insulation, windows and building materials as the second shelf. Suppliers, installers and construction companies list offers on a shared catalogue, and buyers compare prices, specifications and delivery side by side.

**Status: working prototype, not live.** Product models, specifications, dimensions and datasheet links are real. Sellers, their prices, stock and delivery fees are **sample data** (tagged "shembull / sample" on the site). See [`NEEDS_VERIFICATION.md`](NEEDS_VERIFICATION.md) for everything that must be confirmed before launch.

## What is in it
- **Story home page:** one house, seven chapters, energy first (`src/content/story.ts`): solar panels, inverter, battery, heating / cooling / hot water, the car charger, meter and grid, and "the energy you don't lose" (insulation, windows, LED). Each chapter names the equipment it lights up in the house illustration (`parts`, see [`ASSETS.md`](ASSETS.md)), carries sourced Albanian figures and links to its shop categories with the live product count and lowest price. Cement and masonry are in the shop, not in the story.
- **Shop:** 14 categories, renewable energy first (the order is the array order in `scripts/catalog/categories.mjs`), with filters generated from each category's specification template, product pages with technical drawings at real dimensions, an offers table comparing every seller (price incl. VAT, price per Wp / kWh / m², volume prices, stock, delivery to your city, total delivered), 90-day price history, price alerts, side-by-side product comparison and search.
- **Basket and checkout:** one parcel per seller, Albanian phone and NIPT validation, cash on delivery, bank transfer, card through POK (a labelled local test gateway when no keys are set).
- **Solar calculator:** PVGIS yields for 14 Albanian cities, the ERE 2026 household tariff (including its 700 kWh cliff), a kit priced from live offers, payback.
- **Request a quote:** private buyer–seller threads.
- **Product photos:** uploaded in the admin product editor (resized in the browser to ≤1600 px WebP), stored in the `MEDIA` KV namespace and served from `/media/…` with year-long caching. Products without a photo show their brand and model as type. KV rather than R2 only because R2 is not enabled on the account; `src/lib/media.ts` is the one file to change.
- **Admin panel** (`/admin`): every page opens with a plain-language guide (what it is for, the steps, what each option means; `src/i18n/admin-help.ts`), a dashboard with sales, status, category and best-seller charts, and a layout that works on phones. Orders, products with spec forms generated from the category template, a spec-template editor, sellers, offers with quick edit and volume tiers, a price-comparison monitor, quote threads, seller applications, settings. Seller accounts see only their own data.

## Stack
Astro 7 (server rendering on Cloudflare Workers through `@astrojs/cloudflare`), Cloudflare D1 (SQLite), GSAP + ScrollTrigger + Lenis on one ticker, vanilla TypeScript. The seed scripts still use `node:sqlite` (Node ≥ 22.13) and hand their result to D1 as SQL. Fonts: Archivo and Geist Mono, both SIL Open Font License (`public/fonts/*-OFL.txt`).

## Run it locally
```bash
npm install
cp .dev.vars.example .dev.vars    # DEV_LOGIN=1 and the other local-only settings
npm run seed -- --demo            # builds data/beed.db: categories, real products, sample sellers and offers
npm run d1:export                 # turns data/beed.db into seed.sql
npm run d1:migrate                # creates the tables in the local D1 (.wrangler/state)
npm run d1:load                   # loads seed.sql into it
npm run dev                       # http://127.0.0.1:3810, on workerd with the local D1
```
`npm run preview` serves the production build through `wrangler dev` instead.

Admin: with `DEV_LOGIN=1` in `.dev.vars`, `/admin/login` shows a developer sign-in button (dev server and 127.0.0.1 only; production builds never have it). To set a real password: `npm run admin:password -- you@example.com "Your Name" --local` (or `--remote` for the deployed database).

Useful flags: `npm run seed -- --force` overwrites settings, categories and products from the catalogue files (otherwise a reseed keeps admin edits). After reseeding, run `d1:export` and `d1:load` again: `seed.sql` replaces every catalogue table (foreign keys are checked once at the end, so it loads into a database that already has rows).

## Deploy to Cloudflare
```bash
npx wrangler login
npx wrangler d1 create beed-energy        # put the printed database_id in wrangler.jsonc
npm run d1:migrate:remote
npm run d1:load:remote                    # the same seed.sql, into the deployed database
npm run deploy                            # astro build && wrangler deploy
npm run admin:password -- you@example.com "Your Name" --remote
```
Every push to `main` deploys by itself through `.github/workflows/deploy.yml`: type check, D1 migrations, build, `wrangler deploy`. It needs two repository secrets, `CLOUDFLARE_API_TOKEN` (Workers Scripts, D1 and Workers KV Storage: Edit) and `CLOUDFLARE_ACCOUNT_ID`. The commands above are for the first setup and for deploying by hand.

Card payments stay off until the POK keys are set as secrets: `npx wrangler secret put POK_KEY_ID` (and `POK_KEY_SECRET`, `POK_MERCHANT_ID`; `POK_ENV=staging` for POK's test API). Set `PUBLIC_ORIGIN` to the public address once the site has its own domain.

### How the database layer differs from node:sqlite
D1 is async and has no interactive transactions: a batch runs a fixed list of statements atomically, with no reading back in between. So every query is awaited, and the writes that used to sit in `BEGIN … COMMIT` are now batches (`src/lib/db.ts`). Placing an order holds stock through the `CHECK (stock_qty >= 0)` on offers: a line that would oversell aborts the whole batch, and the buyer sees the current quote. Cancelling returns stock only if the order is still in the status that was read, so two cancels cannot return it twice.

## Documents
- [`DESIGN.md`](DESIGN.md): the design contract (world, colour, type, the signature, technique map, motion rules).
- [`PLAN.md`](PLAN.md): build plan and acceptance criteria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): routes, data model, money, basket and checkout, admin, security headers.
- [`research/`](research/): sourced research (energy and construction facts, tariffs, PVGIS yields, product datasheets, Albanian glossary, Awwwards references, marketplace UX). Every figure on the site traces back to a source listed there.
- [`NEEDS_VERIFICATION.md`](NEEDS_VERIFICATION.md): sample data, assumptions and open legal items.

## Not included
No payment keys and no email sending. Hosting is Cloudflare Workers + D1 (see above).
