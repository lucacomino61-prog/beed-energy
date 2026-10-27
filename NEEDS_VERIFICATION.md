# Needs verification before launch

Everything on the site is either a sourced fact (see `research/`) or listed here. Nothing here may go live as if it were true.
Last updated 2026-10-27.

## From BeeD Consulting (the client)
| Item | Where it shows | Now |
|---|---|---|
| Logo and brand mark | header, footer, favicon | Placeholder mark (house section with a copper line). "BeeD Energy" is not a registered name; an Albanian word mark "Bee" exists in Nice class 35 (research/company.md) — ask a trademark attorney before filing. |
| Contact email, phone, office address, opening hours | contact page, footer, order page | `settings.contact` is empty; the contact page says "coming soon" and the footer shows only the operator line with the NIPT (address, email and phone appear there once they are set). |
| Bank account for transfers (bank, IBAN, SWIFT) | checkout, order page | `settings.bank` holds only the beneficiary name. |
| Seller plans: monthly price, commission per plan | /shit-me-ne, admin | Commission 9% / 7% / 6% and features are proposals; monthly prices empty ("on request"). |
| Verification criteria for sellers | /shit-me-ne | Proposed (NIPT/QKB extract, warehouse or showroom check), modelled on sun.store's tiers. |
| Cash-on-delivery limit | checkout | 250 000 lekë (assumption). |
| Delivery zones and surcharges | basket, checkout | Zone 1 Tirana–Durrës +0, zone 2 +300, zone 3 +600 lekë (assumption; Posta Shqiptare's published tariff is 1 400 lekë excl. VAT for 7–10 kg intercity). |
| Who issues the fiscal invoice (seller as merchant of record vs platform) | terms, order page | Written as "the seller issues it"; confirm with an accountant (Law 87/2019, Instruction 16/2020). |
| Payment and invoicing model: buyers pay BeeD Consulting by bank transfer (`settings.bank.beneficiary`) while the seller issues the fiscal invoice | checkout, order page, terms §5, /shit-me-ne (its "Payments" step no longer carries the bracketed "to be confirmed" note: this row is the record) | Not in the research: research D2 only covers BeeD invoicing sellers for the subscription and commission. Who receives the buyer's money, who pays it out to the seller, and who invoices whom must be confirmed with the client's accountant or lawyer before launch (copy review 2026-10-23, legal check). |
| Unit price per kg (cement and masonry) and per metre (PV cable) | category, product and compare pages; terms §3 | Cement and masonry now uses `bag_kg` → lekë/kg. Only products with a bag weight in their datasheet get a unit price (Ceresit CM 11, SikaTop Seal 107); the Antea cements, Ytong blocks and Kurum rebar have no bag weight in research, so they show none. PV cable has no length attribute, so there is no lekë/m price. Terms §3 promises a unit price (Law 9902 art. 9): add bag weights and a cable length attribute, or narrow the terms. |
| Legal placeholders (copy review 2026-10-23, legal check) | footer, /kushtet, /privatesia, contact, checkout | Missing before launch: registered office address, email and phone (Law 10128 art. 7; Law 9902 art. 36); the model withdrawal form (Annex I(B); without it the withdrawal period can extend by up to 12 months, art. 37/2); who pays return costs (art. 36); order confirmation by email (Law 9902 art. 37.7; Law 10128 art. 14). |
| "Prices include 20% VAT (for VAT-registered sellers)" | footer, checkout | Sellers under the ALL 10 million turnover threshold charge no VAT (research D1). Confirm the wording, and how a non-registered seller's prices and invoices are shown, with the accountant. |
| Terms of use, privacy policy, returns | /kushtet, /privatesia | Drafts from public sources (research/albania-construction-commerce.md); a lawyer must review. A 2025 draft consumer law may change the withdrawal wording. |
| Signer / administrator name | nowhere | Kept off the site on purpose. |

## Demo data (seed `--demo`, every row `is_demo = 1`)
- **Sellers:** Rrezja Energji, Adriatik Solar Supply, Jugu Instalime, Kantieri Qendror, Veriu Termo, Korça Ngrohje, Fasada Pro — **invented**, with invented ratings, cities, plans and commissions. They carry a "shembull / sample" tag on the site. Remove with `DELETE FROM sellers WHERE is_demo = 1` before launch.
- **Offers, stock, lead times, delivery fees, volume tiers, price history:** invented around real reference prices. A product's demo price = its public EU reference price (research JSON, EUR) × Bank of Albania rate 90.64 × 1.2 VAT (when the source excludes VAT) × 1.06, spread ±8% across sellers. Products without a public price are priced from the category's median price per unit (lekë/Wp, lekë/kWh…) or get no offer.
- **Orders, quote threads, applications** created while testing were deleted.

## Integrations not yet live
- **POK card payments:** code follows the elixir.al integration; the hosted-page redirect field (`confirmUrl` / `checkoutUrl`) is a guess — confirm in POK's docs (docs.pokpay.io) with staging keys before launch. Without keys the site uses a local test gateway that is clearly labelled.
- **BKT Virtual POS:** researched (memory/albania-card-payments.md), not built.
- **Email** (order confirmations, price alerts, quote replies): not sent; alerts are stored in `price_alerts`.
- **Hosting, domain, HTTPS:** since Stefano's update the site runs on Cloudflare Workers + D1 + KV; his fork deploys on every push to its `main` (`.github/workflows/deploy.yml`, his account's secrets). No custom domain is set in `wrangler.jsonc`. Luca's repo has no Cloudflare secrets, so a push there would fail the deploy job.
- **Admin password:** set it yourself with `npm run admin:password -- you@example.com "Name"`; the developer sign-in button only exists with `DEV_LOGIN=1` on 127.0.0.1.

## Energy facts with open questions (research/albania-energy.md, research/tariffs-prices.md)
- Price paid for surplus solar power under the May 2026 net-billing rules: **not found** in the research (not the same as "not published"); the calculator values it at 0 as an assumption and the house's layer 05 says so, citing Instruction 3/2019 point 17.
- Household tariff VAT basis: 8.5 / 9.5 lekë/kWh read as **excluding** VAT (ERE notice of Jan 2025); confirm on a 2026 OSHEE bill.
- Distribution tariffs after 30 April 2026: not published on ERE's tariff page as of 2026-10-23.
- Calculator assumptions: self-use 45% without battery / 80% with battery, degradation 0.5%/yr (Jordan & Kurtz median, research/tariffs-prices.md §4), 25 years, panel 500 Wp — engineering assumptions, shown on the page.

## Calculator kit and battery packages
- The kit takes the cheapest in-stock offers from sellers who deliver to the chosen city: panels, an inverter (AC power at least 70% of the array, at most 2.2× or 10 kW, phases as chosen, hybrid when a battery is wanted) and a battery. **A battery is paired with an inverter only when the pair is listed as compatible** in `src/content/battery-compat.ts`: at least one maker lists that exact pair and neither excludes it, taken from the makers' own compatibility lists and datasheets (method, table and sources: `research/inverter-battery-compat.md`), checked on **2026-10-27**. Of the listed pairs in stock, the cheapest is used; with none, the kit has no battery line and no total, and the page says why. The package cards, the calculator and the product pages ("Punon me / Works with") show the pair, who lists it, its key conditions (up to three, plus the battery power when a maker states it; every Fronius pair includes "confirm availability in Albania with the distributor"), the installer caveat and the makers' documents.
- **New products are never paired.** An inverter or a battery added in the admin is not paired with anything until an entry for the pair is added to `src/content/battery-compat.ts` (its slug in `INVERTER_SLUGS` or `BATTERY_SLUGS`, and one entry per pair).
- **The lists change.** Makers update their compatibility lists and firmware minimums (read here: BYD V2.22 of 2026-10-10, GoodWe V029.1 of 2026-10-22, Pylontech V2.46, Dyness of 2026-07-15, Deye DY-LV48-0128): re-check every listed pair before launch and put the new date in `src/content/compat-checked.ts`.
- Still left out of every kit and package price: mounting, cables and protection devices, meters (including the Fronius Smart Meter or the Huawei power meter that some pairs need) and installation. The battery package cards list that meter under "Not included in the price", and the calculator says so above the kit. The installer sets the firmware, the battery link and the settings, and confirms the bill of materials.
- The self-use share follows the kit: with "battery" chosen but no battery in the kit (no offer, or no listed pair in stock), the saving uses the no-battery share (45%) and the figure reads "without a battery"; the payback is not shown then, because there is no total.

### Catalogue gaps found by the compatibility check (2026-10-27)
- **Growatt MOD 10KTL3-XH:** Growatt allows only its own ARK-XH HV battery on it (the APX HV on the BP version). Neither is in the catalogue, so no catalogue battery works with this inverter; its product page says so. Add an ARK-XH or sell it without a battery.
- **BYD HVS 10.2 is not for the Fronius Primo GEN24 5.0 Plus:** Fronius excludes it there (only the HVS 5.1 and 7.7 are allowed, and they are not in the catalogue). With the Primo, kits use the BYD HVM 11.0 or the Fronius Reserva 6.3.
- **Deye SUN-10K-SG04LP3-EU is superseded** on Deye's site by the SUN-10K-SG05LP3-EU-SM2; the SG04LP3-EU is still named on the Deye and Dyness battery lists, and its SG04LP3 series on Pylontech’s list. Confirm that sellers can still supply it, or add the successor with its own compatibility check.
- **Huawei LUNA2000-7-S1 with the SUN2000-10KTL-M1 is on-grid only:** with one battery module there is no backup when the grid fails (backup needs at least two modules, the LUNA2000-14-S1 or larger, and Huawei's BackupBox-B1), and battery power is capped at 3.5 kW. The package card, the calculator line and both product pages say so when this pair appears; no package copy promises backup.
- **Fronius in Albania:** Fronius ties availability and battery support to certification in each country; no Fronius document names Albania and Fronius has no Albanian market page, so every Fronius kit (Primo or Symo with BYD or Reserva) must be confirmed with a distributor before launch.
- **Two "unknown" pairs, never paired:** Fronius Symo GEN24 10.0 Plus + Huawei LUNA2000-7-S1 and Fronius Primo GEN24 5.0 Plus + Huawei LUNA2000-7-S1. Neither maker lists them and neither excludes them; Huawei names only Huawei inverters for the LUNA2000-S1.
- **One module per kit:** Deye + Pylontech US5000 and Deye + Dyness PowerBox G3 kits get one battery module, while the Deye takes up to 210 A of battery current; one US5000 gives 100 A continuous and one G3 200 A, so full battery power needs more modules. The pairs' conditions say so; the battery sizing rule was not changed.
- **Deye + Dyness PowerBox G3 rests on one list:** only Dyness lists it; Deye's own battery list does not name the G3.

## Product data
- Specs, dimensions and datasheet links come from manufacturers (research/products-*.json, spot-checked by a fact-checker), with the exception below. Reference prices are public prices found on the date in `reference_price_source`.
- **Panasonic Aquarea J WH-MDC09J3E5** (`panasonic-aquarea-j-wh-mdc09j3e5`): every spec comes from an EU refrigeration wholesaler (Schiessl Kälte), not from Panasonic, and the 09 model was not confirmed on a Panasonic page (research/products-building.md, marked UNVERIFIED). It is now the heat pump that package 06 (Heat pump + solar) prices on /paketa-diellore, as the cheapest single-phase 4–10 kW offer. Confirm it against a Panasonic document or replace it before launch.
- **Product photos** are uploaded in the admin and stored in KV (`MEDIA`); products without one show brand and model as type. Every photo needs the maker's or seller's permission: record where each one came from before launch.

## Images made with AI
- **The house on the home page and the PV cut-out on the guide's drawing sheet** (day and dusk renders and the eight equipment cut-outs in `public/house/`; the guide shows `part-pv` beside its poster) is an AI illustration made with FLUX.2 [klein] 4B on Cloudflare Workers AI (`ASSETS.md`), labelled on both pages as "not a photo". The weights are Apache 2.0, but Workers AI also lists Black Forest Labs' terms of service for this model (<https://bfl.ai/legal/terms-of-service>): read them once before launch and confirm that commercial use of the outputs is allowed.
- Known weaknesses of the render: 8 roof panels instead of the 12 a 5 kWp roof needs, the solar water heater has no tank on the roof, and the cut-out parts are lit slightly differently from the house.
