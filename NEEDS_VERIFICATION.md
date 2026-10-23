# Needs verification before launch

Everything on the site is either a sourced fact (see `research/`) or listed here. Nothing here may go live as if it were true.
Last updated 2026-10-23.

## From BeeD Consulting (the client)
| Item | Where it shows | Now |
|---|---|---|
| Logo and brand mark | header, footer, favicon | Placeholder mark (house section with a copper line). "BeeD Energy" is not a registered name; an Albanian word mark "Bee" exists in Nice class 35 (research/company.md) — ask a trademark attorney before filing. |
| Contact email, phone, office address, opening hours | contact page, footer, order page | `settings.contact` is empty; pages say "coming soon". |
| Bank account for transfers (bank, IBAN, SWIFT) | checkout, order page | `settings.bank` holds only the beneficiary name. |
| Seller plans: monthly price, commission per plan | /shit-me-ne, admin | Commission 9% / 7% / 6% and features are proposals; monthly prices empty ("on request"). |
| Verification criteria for sellers | /shit-me-ne | Proposed (NIPT/QKB extract, warehouse or showroom check), modelled on sun.store's tiers. |
| Cash-on-delivery limit | checkout | 250 000 lekë (assumption). |
| Delivery zones and surcharges | basket, checkout | Zone 1 Tirana–Durrës +0, zone 2 +300, zone 3 +600 lekë (assumption; Posta Shqiptare's published tariff is 1 400 lekë excl. VAT for 7–10 kg intercity). |
| Who issues the fiscal invoice (seller as merchant of record vs platform) | terms, order page | Written as "the seller issues it"; confirm with an accountant (Law 87/2019, Instruction 16/2020). |
| Payment and invoicing model: buyers pay BeeD Consulting by bank transfer (`settings.bank.beneficiary`) while the seller issues the fiscal invoice | checkout, order page, terms §5, /shit-me-ne | Not in the research: research D2 only covers BeeD invoicing sellers for the subscription and commission. Who receives the buyer's money, who pays it out to the seller, and who invoices whom must be confirmed with the client's accountant or lawyer before launch (copy review 2026-10-23, legal check). |
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
- **Hosting, domain, HTTPS:** nothing deployed. The Node server runs locally on port 3810.
- **Admin password:** set it yourself with `npm run admin:password -- you@example.com "Name"`; the developer sign-in button only exists with `DEV_LOGIN=1` on 127.0.0.1.

## Energy facts with open questions (research/albania-energy.md, research/tariffs-prices.md)
- Price paid for surplus solar power under the May 2026 net-billing rules: **not found** in the research (not the same as "not published"); the calculator values it at 0 as an assumption and the house's layer 05 says so, citing Instruction 3/2019 point 17.
- Household tariff VAT basis: 8.5 / 9.5 lekë/kWh read as **excluding** VAT (ERE notice of Jan 2025); confirm on a 2026 OSHEE bill.
- Distribution tariffs after 30 April 2026: not published on ERE's tariff page as of 2026-10-23.
- Calculator assumptions: self-use 45% without battery / 80% with battery, degradation 0.5%/yr (Jordan & Kurtz median, research/tariffs-prices.md §4), 25 years, panel 500 Wp — engineering assumptions, shown on the page.

## Calculator kit
- The kit picks the cheapest in-stock offers from sellers who deliver to the chosen city: panels, an inverter (AC power at least 70% of the array, at most 2.2× or 10 kW, phases as chosen, hybrid when a battery is wanted) and a battery. It does **not** check battery–inverter compatibility (e.g. a 48 V low-voltage battery with a high-voltage hybrid), and it leaves out mounting, cables and installation. An installer must confirm the bill of materials.

## Product data
- Specs, dimensions and datasheet links come from manufacturers (research/products-*.json, spot-checked by a fact-checker). Reference prices are public prices found on the date in `reference_price_source`.
- **Product images are technical drawings generated from datasheet dimensions**, not photos. Real photos need the maker's or seller's licence; the admin can add them.
