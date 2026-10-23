# BeeD Energy

A bilingual (Albanian / English) online marketplace for construction and renewable-energy products in Albania: suppliers, installers and construction companies list offers on a shared catalogue, and buyers compare prices, specifications and delivery side by side.

**Status: working prototype, not live.** Product models, specifications, dimensions and datasheet links are real. Sellers, their prices, stock and delivery fees are **sample data** (tagged "shembull / sample" on the site). See [`NEEDS_VERIFICATION.md`](NEEDS_VERIFICATION.md) for everything that must be confirmed before launch.

## What is in it
- **Story home page:** "Shtëpia në shtresa" (the house in layers). An isometric drawing of a two-storey house opens one layer per chapter as you scroll: foundation and walls, insulation, windows, roof and panels, inverter and battery, heating and cooling, meter and grid. Each layer carries a sourced Albanian figure and links to its shop category with the live product count and lowest price.
- **Shop:** 14 categories with filters generated from each category's specification template, product pages with technical drawings at real dimensions, an offers table comparing every seller (price incl. VAT, price per Wp / kWh / m², volume prices, stock, delivery to your city, total delivered), 90-day price history, price alerts, side-by-side product comparison and search.
- **Basket and checkout:** one parcel per seller, Albanian phone and NIPT validation, cash on delivery, bank transfer, card through POK (a labelled local test gateway when no keys are set).
- **Solar calculator:** PVGIS yields for 14 Albanian cities, the ERE 2026 household tariff (including its 700 kWh cliff), a kit priced from live offers, payback.
- **Request a quote:** private buyer–seller threads.
- **Admin panel** (`/admin`): orders, products with spec forms generated from the category template, a spec-template editor, sellers, offers with quick edit and volume tiers, a price-comparison monitor, quote threads, seller applications, settings. Seller accounts see only their own data.

## Stack
Astro 7 (server rendering, `@astrojs/node`), SQLite through `node:sqlite` (Node ≥ 22.13), GSAP + ScrollTrigger + Lenis on one ticker, vanilla TypeScript. Fonts: Archivo and Geist Mono, both SIL Open Font License (`public/fonts/*-OFL.txt`).

## Run it locally
```bash
npm install
npm run seed -- --demo        # categories, real products, sample sellers and offers
npm run dev                   # http://127.0.0.1:3810
```
Admin: set a password with `npm run admin:password -- you@example.com "Your Name"`, or start the dev server with `DEV_LOGIN=1` to get a developer sign-in button on 127.0.0.1 only.

Useful flags: `npm run seed -- --force` overwrites settings, categories and products from the catalogue files (otherwise a reseed keeps admin edits).

## Documents
- [`DESIGN.md`](DESIGN.md): the design contract (world, colour, type, the signature, technique map, motion rules).
- [`PLAN.md`](PLAN.md): build plan and acceptance criteria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): routes, data model, money, basket and checkout, admin, security headers.
- [`research/`](research/): sourced research (energy and construction facts, tariffs, PVGIS yields, product datasheets, Albanian glossary, Awwwards references, marketplace UX). Every figure on the site traces back to a source listed there.
- [`NEEDS_VERIFICATION.md`](NEEDS_VERIFICATION.md): sample data, assumptions and open legal items.

## Not included
No payment keys, no email sending, no hosting configuration. Nothing here is deployed.
