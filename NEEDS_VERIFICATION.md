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
- Price paid for surplus solar power under the May 2026 net-billing rules: **not published**; the calculator values it at 0 and the house's layer 05 says so.
- Household tariff VAT basis: 8.5 / 9.5 lekë/kWh read as **excluding** VAT (ERE notice of Jan 2025); confirm on a 2026 OSHEE bill.
- Distribution tariffs after 30 April 2026: not published on ERE's tariff page as of 2026-10-23.
- Calculator assumptions: self-use 45% without battery / 80% with battery, degradation 0.4%/yr, 25 years, panel 500 Wp — engineering assumptions, shown on the page.

## Product data
- Specs, dimensions and datasheet links come from manufacturers (research/products-*.json, spot-checked by a fact-checker). Reference prices are public prices found on the date in `reference_price_source`.
- **Product images are technical drawings generated from datasheet dimensions**, not photos. Real photos need the maker's or seller's licence; the admin can add them.
