# Marketplace and price-comparison UX — what the best sites do

Research stream `ux` for the BeeD Energy marketplace. Read on **2026-10-23** unless a line says otherwise.
Method: each page was downloaded (curl, then HTML stripped to text) and read; where a page is client-rendered, its embedded data payload was read instead (this is said each time). Everything under "Recommendation for BeeD" is our design proposal, not a fact about another site.

## 0. What was read, and what could not be read

| Site | Pages read (2026-10-23) | Status |
|---|---|---|
| sun.store (EU B2B solar marketplace) | home `https://sun.store/en`, catalogue `https://sun.store/en/catalog/solar-panels`, product `https://sun.store/en/product/gcl-nt12r-66gdf-620-610-635-1500v-silver-frame-gcl-01-55041`, `https://sun.store/en/verified-sellers`, `https://sun.store/en/about-us`, `https://sun.store/en/legal-hub`, T&C `https://storage.sun.store/files/sunstore_terms-and-conditions_20260901.html` | OK |
| Geizhals (price comparison, AT/DE) | home `https://geizhals.eu/`, product `https://geizhals.eu/fritz-fritz-smart-thermo-302-funk-heizkoerperthermostat-20003120-a3712218.html` | OK (category page returned 403) |
| PriceRunner (Klarna, UK) | home `https://www.pricerunner.com/`, product `https://www.pricerunner.com/pl/1438-3431245272/Wearables/Apple-Watch-Ultra-3-Black-Titanium-Case-with-Ocean-Band-Compare-Prices` (offer list + UI-string payload) | OK |
| idealo | site returns 403 to automated requests; read the official App Store listing `https://apps.apple.com/de/app/idealo-preisvergleich-online/id454415640` instead | partial |
| Google Shopping | help page `https://support.google.com/faqs/answer/10675605?hl=en` | OK |
| Memodo (B2B solar wholesaler) | home `https://www.memodo-shop.com/`, product `https://www.memodo-shop.com/solar-fabrik-460w-s4-trend-full-black/16205`, `https://www.memodo-shop.com/m/tools/independence-calculator/`, `https://www.memodo-shop.com/m/tools/planning-tools/` | OK |
| Krannich Solar shop | `https://shop.krannich-solar.com/de-de` (navigation only) | partial |
| Segen (UK solar wholesaler) | `https://www.segen.co.uk/`, `https://www.segen.co.uk/homeowners/` | OK |
| Wholesale Solar | `https://www.wholesalesolar.com/` now redirects to **Unbound Solar** `https://www.unboundsolar.com/` ("A Gigawatt Company"); read home, `https://www.unboundsolar.com/solar-information/battery-bank-sizing`, `https://www.unboundsolar.com/solar-information/solar-cost`, `https://www.unboundsolar.com/solar-information/freight` | OK |
| ENF Solar directory | home `https://www.enfsolar.com/` only; every `/directory/...` page returned 403 | partial |
| pvXchange | HTTP 429 (rate-limited) on every attempt, also via WebFetch | **not read** |
| Hornbach, Bauhaus, Leroy Merlin (FR/ES/IT) | bot challenge / 403 "Zugriff verweigert" | **not read** — Wickes (UK DIY chain) calculators read instead: `https://www.wickes.co.uk/calculators`, `/calculators/tiling-calculator`, `/calculators/paint-calculator` |
| Adobe Commerce docs (attribute model) | `https://experienceleague.adobe.com/en/docs/commerce-admin/catalog/product-attributes/create/attribute-product-create` | OK |
| Akeneo PIM docs (units) | `https://help.akeneo.com/serenity-discover-akeneo-concepts/serenity-what-about-measurements` | OK |
| Gjirafa50 Albania | `https://gjirafa50.al/`, `https://gjirafa50.al/panele-solare`, FAQ `https://gjirafa50.al/faq-al` | OK |
| Gjirafa50 Kosovo | `https://gjirafa50.com/panele-solare`, `https://gjirafa50.com/fotovoltaik-pv`, FAQ `https://gjirafa50.com/faq-xk` | OK |
| Neptun Albania | `https://www.neptun.al/`, FAQ `https://www.neptun.al/faq.nspx`, `https://www.neptun.al/kondicionere.nspx` (product data payload) | OK |
| MerrJep.al | home `https://www.merrjep.al/`, `https://www.merrjep.al/kujdesi-ndaj-klientit/ndihme-rreth-pageses` | OK (`/biznes` and search returned 503) |

---

## 1. Price-comparison UX patterns

### 1.1 One product, many sellers — how the offer list is built

**sun.store (B2B, the closest model to BeeD)** — product page `.../gcl-nt12r-66gdf-620-...-55041`:
- Page order: title + 4 key specs as chips (Module Power 620 W, Cell Type N-Type, Colour Frame, Module type Bifacial) → description → **Downloads** ("Download all files" = datasheet) → full technical specification table → **Measurements** (height 2382, width 1134, depth 30 mm, weight 32.5 kg) → CTA "Do you need this product? Send a request for proposal to Sellers! — Create a request" → **offers** list.
- Each offer row shows availability as a range, e.g. "Availability 720 - 18000 pcs", "72 - 684 pcs".
- Prices are shown **per Wp and per piece** ("From €0.094 /Wp" for panels, "From €1,900.00 /pc" for an inverter on the home page). The page's schema.org data marks prices `valueAddedTaxIncluded: false` — i.e. **net of VAT** — and the T&C say VAT shown is "indicative only… The final VAT value will only be confirmed on the Seller's invoice" (T&C §12 General Principles, read 2026-10-23).
- The offer data embedded in the page (Nuxt payload) carries these per-offer fields, which tells us what the offer row and offer filters are built from: `availabilityQuantity`, `availableNow`, `shippingFromCountry`, `warehouse`, `incoterms`, `shippingTime`, `pickupAvailableInWeeks`, `deliveryIncluded`, `deliveryEstimated`, `minOrderQuantityInPieces / InPallets / InContainers`, `fullPalletsOnly`, `fullContainersOnly`, `piecesInPallet`, `palletsInContainer`, `multiPrices` + `prices[{from,to,price,price_wp}]`, `isNegotiable`, `acceptEscrow`, `allowQuickPurchase`, `paymentMethods`, `isManufacturerOffer`, `sellerBadge`, `priceDisplayUnit`, `publishAt/expireAt`, and seller statistics (`avg_rating`, `reviews_count`, `avg_seller_flexibility`, `avg_delivery_service`, `avg_support_quality`, `completed_transactions`, `avg_time_to_response`, `cancellation_rate`, `selling_from`).
- Ranking (T&C §22): default sort is **"Best Fit"** — match to query, price, available quantity, seller rating and warehouse location; "Paid Placement, if any, will be labelled." Users can also sort by price and popularity.

**Geizhals (B2C price comparison)** — product page above, "Letztes Preisupdate: 23.10.2026, 10:30":
- Header: "ab € 49,00 · 65 Angebote" across 4 variants (single, 2-, 3-, 5-pack, each with its own "ab" price and offer count) — **variants are separate rows with their own lowest price**.
- Offer-list controls: toggle **"Preis exkl. Versand" / "inkl. Versand"**, "nur Abholung" (pickup only), "Anbieter aus: AT / DE / alle", availability filter "lagernd beim Händler" / "kurzfristig lieferbar", **"günstigste Zahlart"** with a payment-method picker (Kreditkarte, PayPal, Vorkasse, Nachnahme), ship-to country (AT, DE, UK, PL) and a postcode/location field.
- Columns: **Preis · Anbieter · Händlerbewertung · Verfügbarkeit / Versandkosten · Produktbezeichnung des Händlers**.
- Every offer carries a timestamp "Preis vom: 23.10.2026, 10:30:24 (Preis kann jetzt höher sein!)" — honesty about stale prices.
- Seller rating shown as stars + count ("4.9 · 4044 Bewertungen"); unrated sellers say "Dieser Händler hat keine gültigen Bewertungen — Händler bewerten!".
- Availability text is free-form from the shop ("Lieferung in 1-3 Werktagen", "lagernd: 4", per-branch stock for click-and-collect) plus a traffic-light code (`ampel` field in the payload).
- Marketplace sub-sellers are grouped under their platform ("7 weitere Angebote von eBay.de", toggle "Nicht gruppieren").
- Product tabs with counts: "50 Angebote · 9 Produkteigenschaften · 0 Dokumente · 1 weiterführender Link · 8 Bewertungen · 0 Testberichte".
- Actions next to the price: "Preisentwicklung öffnen", "Preisalarm setzen", "Zur Wunschliste hinzufügen", "Zur Vergleichsliste hinzufügen", "Feedback senden".

**PriceRunner (B2C, UK)** — product page above (home claims "4.8 million products from 5,100 shops"):
- Header: price range "Compare prices from £519.00 to £771.64", popularity rank in category, buttons **Price alert** and **Compare**.
- Tabs: **Prices · Reviews · Price history · Product details · Features**.
- Toggle **"Price incl. delivery"**; each row: store, store rating (e.g. "5.0 (16 ratings)"), merchant's own product title, shipping ("Free shipping" / "£4.99 shipping"), delivery days ("1-4 days"), price, instalment line.
- Badge **"Lowest price"** on the cheapest row; a sponsored row on top is marked **"Recommended · AD"** and other paid rows "Advertisement".
- Footer: "This product is also available at 1 **unverified store**" (UI string `FAB.Product.UNVERIFIED_RETAILER` = "Unverified store").
- Stock vocabulary (UI strings in the page payload): In stock, Out of stock, Backorder, Preorder, Collect in store / Click & Collect, Unknown stock status, "Show only in stock".

**idealo** (from its App Store description): "mehr als 350 Millionen Angebote von über 50.000 Online-Shops"; "Vielfältige Filter- & Sortiermöglichkeiten".

### 1.2 Normalised prices
- **€/Wp for modules** — sun.store shows "€0.099 /Wp" next to the per-piece price on cards and in tier prices (observed above).
- **Per m² for floor/wall materials** — Wickes uses a **"Price per m2"** facet in Flooring with bands "Under £15m2 / £15 to £20 per m2 / £21 to £34 per m2" (navigation on `https://www.wickes.co.uk/calculators`).
- **€/kWh for batteries** — not observed on any site read (sun.store battery cards show per-piece only, e.g. "Deye SE-G5.1 Pro-B From €549.00 /pc"). UNVERIFIED that any marketplace shows it.
- Recommendation for BeeD: compute the normalised unit price from the category's spec template (price ÷ `power_wp`; price ÷ `usable_capacity_kwh`; price ÷ `pack_area_m2`; price ÷ `bag_kg`) and show it under the main price on cards, in the offer list and as a sort key. It is cheap to build once specs are numeric (see §4).

### 1.3 Price history and price alerts
- **Geizhals**: "Preisentwicklung öffnen" (history chart) and "Preisalarm setzen / bearbeiten".
- **idealo** (App Store text): *Preisverlauf* — "steigt er an oder ist das Produkt gerade so günstig wie lange nicht mehr?"; *Preiswecker* — set a "Wunschpreis" and be notified; *Merkzettel* (watch list) shows price movement.
- **PriceRunner** alert dialog (UI strings in payload): "Notify me when my target price has been reached" (threshold), "And each time the price is reduced by…", "Minimum price reduction per message", **"Be notified only when product is in stock"**, **"Include shipping cost"**, "Include international stores", **"Exclude stores"**; validation "Threshold cannot exceed current price". Confirmation: "You'll be notified when the price drops by {{PRICE}} or more and is in stock." Price history has a graph/table switch ("View graph" / "View table" — accessible table view). Discount badges are explained: "The percentage figure shows how much the price has fallen in relation to the previous lowest price amongst compared retailers… the comparison price is calculated as the median of the lowest prices during the last 30 days." Full price history and alerts are member features ("As a member you will receive a generous Buyer Protection that covers purchases up to £5,000, be able to see products' full price history, set price alerts…").
- **Google Shopping** (help page): price insights say whether a price is **low, typical or high** and how it changed "in recent months"; "typical price is based on info from sellers across the web"; a "30-day low" flag based on the item's **total price (item price, discount and shipping)**; "This feature doesn't predict how a price may change in the future." Available to US shoppers.

### 1.4 Product-vs-product comparison
- **idealo**: "Produktvergleich: Gegenüberstellung und Vergleich von Produkteigenschaften… Füge einfach mehrere Produkte über das Datenblatt zum Vergleich hinzu."
- **Geizhals**: "Zur Vergleichsliste hinzufügen / Aus der Vergleichsliste entfernen" on every product and on list rows (`listview__details__compare-link`).
- **PriceRunner "PowerMode"** (UI strings): spreadsheet-style compare per category ("Compare {{CATEGORY}}"), "Primary sort / Secondary sort", "Ascending / Descending", "Remove Column", "Pin" selected products ("{{PRODUCTS_COUNT}} selected products", "Clear all"), filter toggles "Include / Exclude", "Add to list".
- **Adobe Commerce**: each attribute has a flag **"Comparable on Storefront"** — only flagged attributes appear in the compare table.
- **Maximum number of items**: not stated on any page read — UNVERIFIED. Recommendation for BeeD (our choice): 4 products on desktop, 2 visible on phone with horizontal swipe; "highlight differences" toggle; units from the template; rows grouped by the template's attribute groups.

### 1.5 Basket (bill-of-materials) comparison
PriceRunner has a **basket comparison** (UI strings): table "Product · Store · Price · Amount · Delivery · Inventory status", rows "Shipping", "Sum", "Total", and presets **"Cheapest" / "Cheapest and In Stock" / "Few stores" / "One store"**, plus "Include international stores". This is the exact problem of a PV kit (modules + inverter + battery + mounting + cable) bought from several sellers: fewer sellers = fewer delivery charges.

### 1.6 Data-quality loop
PriceRunner lets users report: "Incorrect Price", "Incorrect shipping cost", "Incorrect delivery time", "Incorrect Stock Status", "The link is broken", "Link leads to a different product", "Incorrect specification", "Incorrect brand", "Incorrect categorization", "Incorrect image", "Incorrect name". Geizhals has "Feedback senden" on the product.

---

## 2. B2B features

| Feature | Who does it, and how (observed 2026-10-23) |
|---|---|
| **Tiered / volume pricing** | sun.store offer with `multiPrices`: €63.24/pc = **€0.102/Wp** for 1–7,164 pcs, €62.00 = **€0.100/Wp** for 7,165–14,364, €61.38 = **€0.099/Wp** from 14,365 (GCL NT12R/66GDF 620 page payload; net of VAT). |
| **Request for quote (RFQ)** | sun.store: site-wide banner "Request for Proposal available for all buyers"; product CTA "Send a request for proposal to Sellers! Create a request". T&C: "The User may submit a request for an Offer… Sellers may respond with Offers." Offers can be marked negotiable (`isNegotiable`); negotiation happens in the in-platform chat ("Communicator"); "A confirmed price remains valid for the period shown on the Portal, which shall not exceed three (3) business days unless the Offer states a longer period." |
| **Pallet / container quantities** | sun.store: minimum order in pieces, pallets or containers, "full pallets only", "full containers only"; product record holds pieces-per-pallet and pallets-per-container. Memodo product: "Pieces per package unit: 36 per pallet · 936 per container" (Solar Fabrik 460 W). |
| **Business-only accounts with tax ID** | sun.store T&C: "Only active entrepreneurs… registered as VAT payers can become Users"; registration asks for legal name, tax identification number, VAT number "if issued", business registration number; "Several Users may be linked to one Business" (team accounts). Memodo: "Registration… is exclusively reserved for business customers"; "Prices are only visible to business customers upon successful registration"; some items: "To purchase the item you need a certification from the manufacturer." Segen: "Open a trade account"; portal with "24/7 live pricing, product availability, documentation and account access"; a named Sales Manager and Fulfilment Manager. |
| **Project lists / BOM** | Wickes header link "Project list" (observed on calculator pages). PriceRunner basket comparison (§1.5). Ready bundles: Memodo "Packages" (e.g. "Fronius & BYD", "SMA & BYD"), Krannich "Speedkits" and combined listings such as "DMEGC + Goodwe + K2 Systems". |
| **Installer directory** | ENF Solar: "Company Directory (68,300)", "Product Directory (90,700)", sections Sellers, Solar System Installers, "Local Seller", "Advertise" (home page). Segen routes homeowners away: it supplies "approved installers". Unbound Solar: "Builders & Installer Program". Wickes: "Book a free quote" for solar installation. |
| **Verified sellers** | sun.store 4 tiers (`/en/verified-sellers`): **Verified Seller** — "background check and personal on-boarding process"; **Trusted Seller** — Verified + offers Secure Payments + "Completed warehouse check" + "Minimum of 3 successfull transactions"; **Super Seller** — Trusted + "quick response time, low cancelation rate and enabled automated delivery costs" + "Minimum of 10 successfull transactions… in the last quarter"; **Manufacturer Offer** — "published directly by the product's manufacturer", identity verified. "We reserve the right to withdraw badges." Badges are also catalogue filters. |
| **Escrow-style payment** | sun.store "Secured Payment" (T&C §16A): buyer pays into a processor-controlled balance (Stripe named; Mangopay T&C also linked in the Legal hub); funds released on delivery confirmation, disputes need proof of delivery "typically a CMR document". Unsecured wire transfer only for Verified/Trusted/Super sellers. Payment in EUR. |
| **Delivery terms as filters** | sun.store catalogue facets: **Incoterms** (Delivery on premise 1202, Pick-up at warehouse (EXW) 771, Free Carrier (FCA) 438, CIF 140 — counts on the solar-panel page), **Product location** (Netherlands 460, Poland 218, Germany 192…), **Shipping to** (per country), **Availability from** (Up to 1 week / 1-2 weeks / 2 weeks - 1 month / More than 1 month), "Available now", "Delivery by sun.store". Optional "Delivery by sun.store" service runs under Incoterms 2020 CPT; prices "are estimates based on warehouse, destination and shipment parameters". |
| **Heavy-goods delivery guidance** | Unbound Solar freight page: be home, plan a dry space for the liftgate, "The trucking company is only required to get your freight shipment to the ground", photograph and **note damage on the delivery receipt before signing**, 24 hours to report. |

---

## 3. Seller side: onboarding, plans, commission, promotion, dashboard

**sun.store (commission model)**
- "List all your products for free" / "Sell now" (home); seller sign-up at `/en/register?type=seller`.
- T&C §26 Fees — a **success fee** model with named components: "Base success fee — a percentage of the applicable Fee Base… for each Sales Contract"; "Payment-method adjustment"; "Quality adjustment — a discount or surcharge linked to Seller status, badges, operational SLAs or performance metrics… (including Trusted Seller / Super Seller discounts)"; "Category adjustment"; "Volume or growth adjustment"; "Operational fees… including a €20 fee for each Seller-caused manual correction"; "Optional-service fees… such as Delivery by sun.store, Placement, or other paid features". The actual rates sit in a "Fee Schedule" in the seller area — **not public; rates UNVERIFIED**.
- "Placement" = "the granting of a specific visibility to Offers or the weighting of search results" — sold as a paid option and labelled.
- Anti-leakage: "All negotiations and communications about Offers and Sales Contracts must be conducted through the Communicator… Dealing outside the Communicator… is a breach", backed by a contractual penalty (§8A).
- Sellers may add products outside the central product list; the platform verifies them ("In case of negative verification - the Offer… will be removed").
- Seller statistics published per offer (see §1.1 field list) — the seller dashboard and the public seller card show the same numbers: rating, sub-ratings (flexibility, delivery, support), completed transactions, response time, cancellation rate, "selling from".
- Scale claims (about page, the company's own figures): 25+ countries, "Over 35,000 registered users and 2,500+ unique buyers", "more than 1.4 GWp" traded, "500+ sellers and 200+ brands, stored in 1,000+ warehouses", "1,000+ transactions" per month, "90% of transactions cross borders". Also publishes a monthly "PV Index" and "Battery Index" from marketplace data.

**MerrJep.al (Albanian subscription benchmark)** — payment help page:
- "MerrJep ju jep mundësinë të përdorni Platformën 1 (një) muaj falas"; then **"29000 Lek për abonim 6 mujor + 20% TVSH"** and **"52180 Lek për abonim vjetor + 20% TVSH"** for business users.
- Benefits listed: own sub-domain ("Nën-domain në MerrJep.al"), ready software to list products, visibility ("më shumë se 70 000 përdorues aktiv në ditë" — their claim), customer support, SEO.
- Paid extras: subscription packages "ose shërbime përforcuese ose ekstra" with automatic renewal and notice before each renewal; banner advertising (`/kujdesi-ndaj-klientit/reklamoni-me-banera`). Card payments processed by Raiffeisen Bank; card can be removed ("Hiq Kartën").
- Home page: "Posto njoftime FALAS!", "Hap dyqan", "Shiko dyqanet", "Kërkoni në mesin e 1.649.574 njoftimeve" (count on 2026-10-23).

**What this means for BeeD's revenue model** (brief: subscriptions + commission + marketing add-ons): sun.store proves the commission side (success fee with badge discounts and paid placement); MerrJep shows that Albanian SMEs already pay a lekë-priced 6- or 12-month subscription with "+ 20% TVSH" stated separately. Recommendation: plan tiers priced in lekë ex-VAT, a commission % per category, a discount on commission for verified/top sellers, and promoted placement always labelled "Sponsorizuar / Sponsored".

---

## 4. Spec-driven catalogues (attribute templates and faceted filters)

**sun.store** — solar-panel catalogue facets (with counts next to each value): Categories (Solar Panels 1256, Inverters 5474, Energy Storage 2149, Electro-technical 458, Mounting Systems 598, E-mobility 205, Cables 65); offer facets "Available now", "Secure wire transfer", "Delivery by sun.store", "Super Seller", "Manufacturer Offer", Quantity, Availability from, Price (EUR) range with "Go"; product facets **Power (W)** with free range + buckets "≤ 400 W / 401 - 450 W / 451 - 500 W / ≥ 501 W", Brand, Colour frame/backsheet (Silver 517, Black 414, Full Black 313…), Cell type (N-Type 1142, P-Type 78…), Module type (Bifacial 788, Monofacial 465), **Dimensions (mm)** width/height ranges and depth values; inverter facets **Power (kW)** buckets "0 - 5 / 6 - 10 / 11 - 15 / 16 - 25 / 26 - 50 / 51 - 100 / > 100 kW", Number of phases, MPPT (number) range, Absolute Maximum Input Voltage (Voc) range, Isc range; cable facets cross-section min/max mm², Maximum Voltage, Maximum Amperes, Length. → Numeric specs get **range sliders + buckets**; enumerations get **checkbox lists with counts**.

**Neptun.al** (Albanian retailer; AC category payload) — each product feature carries `FeatureGroupName`, `FeatureName` + `FeatureNameAl` + `FeatureNameEn`, `MeasureSign` (Al/En), `PresentationValue` (Al/En), `ValueType`, `DefinedFeatureId`. **Every AC attribute is `multi_select` with the unit inside the text** — e.g. "Kapaciteti ne BTU: 9000", "Energjia qe harxhon ne ftohje: 2.63 kW", "Klasa e energjise: A++ / A+", "Niveli i zhurmes: 20 / 37 dB", "Garancia normale: 24". Good: bilingual names and units per attribute. Bad: numbers stored as text cannot be range-filtered, sorted or normalised (anti-pattern to avoid).

**Adobe Commerce** attribute properties (docs, updated October 8, 2026): "Catalog Input Type for Store Owner" (selected-value types such as Dropdown and Multiple Select, entered-value text types, Price), "Values Required", "Unique Value", "Scope", "Input Validation for Store Owner" for entered values ("Decimal Number", "Integer Number", "Email", "URL", "Letters", "Letters (a-z, A-Z) or Numbers (0-9)"), "Comparable on Storefront", "Use in Layered Navigation" (only for dropdown, multiple select and price), "Use in Search Results Layered Navigation", "Position" (order in the filter block), "Use for Promo Rule Conditions", "Visible on Catalog Pages on Storefront", "Used for Sorting in Product Listing".

**Akeneo PIM** units: "A measurement attribute is a single-line field with a first field containing a value and a second one containing a measurement unit"; each "measurement family" (weight, length…) has a standard unit "used to convert the other units"; channels can convert per locale.

**Geizhals**: "Alle Produkteigenschaften anzeigen" vs "Beliebteste Produkteigenschaften anzeigen" — a short key-spec list first, full table on demand.

**Gjirafa50.al**: list filters only "Filtro sipas çmimit" (range) and "Filtro sipas prodhuesit"; sort "Sipas Relevancës / Çmimi: ulët në të lartë / Çmimi: të lartë në të ulët / Më të rejat / Zbritjes (%) më të lartë"; quick toggles "Largo të shiturat" and delivery-speed chips "24h"/"48h".

Recommendation for BeeD — attribute template record (admin "Atributet/Specifikimet" per category):
`key` (snake_case, matches products-*.json spec keys) · `label_sq` · `label_en` · `group` (e.g. Elektrike / Mekanike / Garancia) · `type` = number | integer | boolean | enum | multi_enum | text | range | dimensions · `unit` (W, kW, kWh, V, A, %, %/°C, mm, kg, Pa, W/mK, m², dB, years) with display precision · `options[]` for enums (sq/en labels) · `required` · `min/max` validation · `filterable` + `filter_widget` (range slider / buckets / checkboxes) + `buckets[]` · `comparable` · `sortable` · `show_on_card` (max 3–4 key specs, like sun.store's chips) · `position` · `normaliser` (true for the one spec used for price-per-unit: power_wp, usable_capacity_kwh, pack_area_m2, bag_kg) · `help_sq/help_en`. Facet values show product counts; offer-level facets (in stock, delivery time, verified seller, city, payment method) apply to every category.

---

## 5. Trust signals

- **Reviews only after a purchase**: sun.store T&C §21 — "Reviews can only be submitted by Users who have concluded a Sales Contract with the Seller"; "no later than 30 days after the conclusion of the Sales Contract"; "The Seller may respond to each comment"; ratings "descriptive… or point-based"; fake or paid reviews banned. Sub-scores in the payload: seller flexibility, delivery service, support quality.
- **External proof**: sun.store header shows its Trustpilot score ("Excellent · 4.5 out of 5 based on 64 reviews").
- **Seller rating beside every price**: Geizhals ("Bewertung: 4.9 von 5 Sternen · 4044 Bewertungen"), PriceRunner ("5.0 (16 ratings)"), with an explicit "no valid ratings" state.
- **Unverified label**: PriceRunner "Unverified store".
- **Badges with written criteria**: sun.store tiers (§2).
- **Datasheets**: sun.store "Downloads · Download all files" on each product; Geizhals tab "Dokumente"; Segen portal "documentation"; Krannich "Downloads"; Memodo "Technical data at a glance" block on the product page.
- **Warranty as a spec**: Memodo shows "Warranty: 30/30 years" in the key spec block; Neptun stores "Garancia normale" (months) and "Garanci Shtese" as attributes; Gjirafa50.al sells **GjirafaFLEX**, a paid fast-service add-on within the 1-year warranty ("5-9 ditë" instead of "deri në 30 ditë").
- **Returns & complaints**: Gjirafa50.al — return "në afat prej 14 ditësh… me paketim, kupon fiskal dhe të gjithë aksesorët"; refund "brenda 5 ditëve të punës". sun.store Legal hub — Return and Refund Policy, Complaint Procedure and Complaint Form (EN/PL).
- **Honest price freshness**: Geizhals "Preis vom… (Preis kann jetzt höher sein!)" and "Letztes Preisupdate".
- **Transparent calculators**: Unbound shows "Formula & assumptions (for review)" under the result (§6).

---

## 6. Calculators

**Solar (solar shops)**
- **Unbound Solar** "Planning Tools" menu: *Solar Cost Estimator* ("system size, panel count, and price range — in about a minute. No phone call required"; panel count recommended "based on your monthly bill"; "a strong starting point… not a binding quote"; ranges "based on equipment costs only and do not include installation labor, permitting fees"), *Battery Size Calculator*, *Wire Size & Voltage Drop Calculator*, *Solar Production Calculator*, plus "Get a Free Estimate". Battery calculator: input appliance list or "I know my daily kWh" → result kWh and amp-hours @ 48 V; shows the formula "Storage needed (kWh) = Daily kWh ÷ Depth of discharge (usable %)" with DoD default 80 % ("a longevity choice, not a safety limit"); "no signup required".
- **Memodo** *Self-sufficiency (independence) calculator* "from htw-Berlin": inputs annual energy consumption, PV power (kWp), usable battery capacity → outputs self-consumption rate and degree of self-sufficiency; notes "For each kWp… approx. 6.5 square meters is required" and recommends oversizing batteries "by up to 20%". *Planning tools* page links the makers' own designers: Fronius Solar.creator, SMA Sunny Design, Solis Design, GoodWe EzDesigner2, SolarEdge Designer, KOSTAL Solar Plan, Sungrow iSolarDesign, RCT Power Designer, Alumero Solar.Pro.Tool, K2 Systems K2 Base, Schletter Configurator, Valentin PV*SOL online.
- **Krannich** menu "Auslegungstools"; **Segen** "Our new Segen Design Tool will be available on our portal soon."

**Building materials (DIY shops)** — Wickes "Calculator Hub": Paint, Tiling, Flooring, BTU (radiator size), Paving, Decking.
- Tiling: "Enter tile size — Width, mm × Length, mm"; "Measure your area(s) — Area 1 Width, m × Length, m", "Add another area"; "We recommend adding an extra 10% to account for any errors, damage or obstacles"; result "Total area" + "Number of tiles needed"; caveats on pattern overage and batch (dye-lot) variation; "Estimate Only".
- Paint: "Our formula is based on a coverage of 10m² per litre of paint"; coats 1/2/3 ("We recommend 2 coats"); areas + 10 %; result "Litres of paint needed".
- Hornbach/Bauhaus/Leroy Merlin calculators could not be read (blocked) — UNVERIFIED what they offer.

Recommendation for BeeD: (1) solar savings calculator on PVGIS yields per city (see `pvgis-albania.json`) + current tariffs, showing formula and assumptions like Unbound, ending in "build this kit" → pre-filled BOM; (2) material calculators driven by the spec template's consumption fields (kg/m² for adhesive and waterproofing mortar, m² per pack for insulation, pieces per m² for blocks), each with "+10 % rezervë" and "Vlerësim, jo ofertë" (estimate, not a quote).

---

## 7. Albanian e-commerce conventions (what local shoppers expect)

**Gjirafa50.al** (FAQ `faq-al`, 2026-10-23):
- Payment: "Paguaj me para në dorë" (cash on delivery), "Paguaj me transfer bankar", "Paguaj me kartelë online". "Pagesat me para në dorë dhe me transfer bankar pranohen vetëm me lekë", cards may be in other currencies.
- Delivery: "kostoja e transportit është 200 lekë"; **Standard** (from international suppliers) "7 deri në 11 ditë"; **GjirafaSWIFT** (from stock in Albania) "brenda 48 orëve (me përjashtim të vikendit)"; button **"Kur arrin produkti?"** under the price shows the date; delivery slot can be chosen up to 14 days after the usual date; deliveries until 18:00; no Sunday deliveries; only inside Albania.
- **Phone confirmation**: "Nëse ju kemi thirrur në telefon për të konfirmuar porosinë e bërë dhe nuk jeni lajmëruar, atëherë ajo porosi do të anulohet" (unanswered confirmation call → order cancelled, email sent).
- Orders "vetëm online direkt në faqe" (not by phone/social).
- Returns 14 days (see §5). Office: Tirana Business Park, Vorë. Contact by phone, Viber and WhatsApp (+355 68 803 03 03).
- Price display: "17,550 Lekë" with struck-through old price "20,190 Lekë" and "-13%".

**Neptun.al** (FAQ, 2026-10-23):
- Payment: "Blerje me këste" (instalments), "Pagesë me para ne dorë kur merr porosinë", "Pagese në llogarinë bankare", "Kartë bankare debiti ose krediti"; "tërhiqe në dyqan" (pay online, collect in store).
- Delivery: online orders **free over 10,000 Lekë**, otherwise **300 lekë "në të gjithë qytetet e Shqipërisë"**; addresses outside towns priced at confirmation by distance; delivery "brenda 48 orëve"; for in-store purchases delivery "1000 lekë brenda qytetit" plus a floor-carry surcharge.
- Instalments: Raiffeisen Bank (10,000–500,000 lekë, "0% interes deri në 18 muaj", campaigns up to 48 months, approved in store with an ID), BKT Prima credit card (up to 18 monthly instalments), IUTE Pay (5,000–500,000 lekë, 1–48 months, ID card only); product cards carry an instalment price (payload: regular price "27.990", "RatePrice" 875 × "NumberOfRates" 24).
- Price format in payload: "27.990" with "LEKË" (dot as thousands separator) — differs from Gjirafa50's "17,550 Lekë". Recommendation: pick one format (e.g. `27 990 L` or `27.990 lekë`) and use it everywhere; show EUR as secondary.
- Contact: 044 50 50 50 and WhatsApp.

**MerrJep.al**: location list used site-wide — "Gjithë Shqipëria" + 36 Albanian towns/districts (Berat, Bulqizë, Delvinë, Devoll, Dibër, Durrës, Elbasan, Fier, Gramsh, Gjirokastër, Has, Kavajë, Kolonjë, Korçë, Krujë, Kucovë, Kukës, Kurbin, Lezhë, Librazhd, Lushnjë, Malësi e Madhe, Mallakastër, Mat, Mirditë, Peqin, Përmet, Pogradec, Pukë, Sarandë, Skrapar, Shkodër, Tepelenë, Tiranë, Tropojë, Vlorë) + Kosovë + Maqedoni — a ready city dropdown/filter list. In-site buyer↔seller messaging ("Mesazhet"). Note MerrJep writes "Kucovë" without ç; standard spelling is **Kuçovë**.

**Market gap evidence (for the brief's "no specialised platform" claim)**
- Gjirafa50.al "Panele solare" category on 2026-10-23: **2 items** — a portable power station (ProXtend PX-300WPS) and a sold-out portable 120 W panel (DJI). Kosovo site (gjirafa50.com) lists only portable/balcony panels (EcoFlow, ProXtend, DJI) in EUR. No rooftop modules, inverters for grid-tied systems, or building materials.
- Gjirafa50 and Neptun are single retailers (no third-party sellers found); MerrJep is classifieds with paid shops, not a checkout marketplace.
- Two web searches for Albanian online solar shops / building-supply shops with a basket found **none** (results were tender documents and directory entries). This is weak evidence of absence — UNVERIFIED; the `commerce` stream should list Albanian shops properly.

---

## 8. PRIORITISED MVP FEATURE LIST

Reference = the site that does it best among those read.

### MUST (launch)
1. **Canonical product + many offers** — one product page, offers from several sellers listed under it; sellers attach offers to catalogue products, new products go through admin approval. *Ref: sun.store.*
2. **Offer list** with columns Seller (badge + rating + count) · Price (incl./excl. TVSH toggle; unit price e.g. lekë/Wp) · Delivery cost & time to the buyer's city · Stock · Min. quantity · Payment methods; badges "Çmimi më i ulët" / "Dërgesa më e shpejtë"; sort by total price incl. delivery; "Përditësuar më…" timestamp. *Ref: Geizhals (columns, incl./excl. shipping toggle, timestamp), PriceRunner ("Lowest price" badge), sun.store (min. quantity, availability).*
3. **Spec templates per category in admin** (typed attributes with units, sq/en labels, filterable/comparable/sortable flags, key-spec chips) and **faceted filters** with counts, range sliders for numbers. *Ref: sun.store facets; Adobe Commerce attribute flags; Akeneo units; avoid Neptun's text-only numbers.*
4. **Normalised unit price** (lekë/Wp, lekë/kWh, lekë/m², lekë/kg) on cards and offers, sortable. *Ref: sun.store €/Wp; Wickes price per m².*
5. **Product-vs-product compare** (up to 4; "show differences only"). *Ref: idealo / Geizhals compare list, PriceRunner PowerMode.*
6. **Datasheet download + full spec table + dimensions** on every product. *Ref: sun.store Downloads + Measurements.*
7. **Basket that can hold offers from several sellers**, split into one sub-order per seller with its own delivery fee. *Ref: PriceRunner basket comparison (concept).*
8. **Checkout with Albanian payment habits**: pagesë në dorëzim (COD), transfertë bankare, kartë online (POK / BKT Virtual POS per the commerce stream); prices in lekë first; phone-confirmation step for COD orders. *Ref: Gjirafa50.al, Neptun.*
9. **Business buyer accounts**: NIPT, company name, invoice address, several users per company. *Ref: sun.store registration fields.*
10. **Seller onboarding + verification badge** with published criteria (documents checked → "Shitës i verifikuar"). *Ref: sun.store tiers.*
11. **Admin**: categories, attribute templates, products, sellers, offers, orders (statuses), subscription plans, commission % per category, promoted placements. *Ref: sun.store fee components; MerrJep plans.*
12. **Seller dashboard** (offers, stock, orders, messages, payouts/fees). *Ref: sun.store seller statistics fields.*
13. **Buyer ↔ seller messages** on an order or offer, kept on-platform. *Ref: sun.store Communicator; MerrJep Mesazhet.*
14. **Returns/complaints page and 14-day withdrawal info**, fiscal-receipt mention. *Ref: Gjirafa50.al FAQ; sun.store Legal hub.*
15. **Solar savings calculator** (PVGIS yields per city, tariffs, formula shown). *Ref: Unbound battery/cost calculators (transparency), Memodo independence calculator.*

### SHOULD (first months)
16. **Request for quote (Kërko ofertë)** for big or pallet orders, sellers answer with time-limited offers (e.g. valid 3 working days). *Ref: sun.store RFP.*
17. **Tiered prices per offer** (quantity bands). *Ref: sun.store multiPrices.*
18. **Pallet/minimum-quantity rules** (pieces per pallet, full pallets only). *Ref: sun.store, Memodo.*
19. **Verified-purchase reviews of sellers** with sub-scores (delivery, communication) and seller reply; 30-day window. *Ref: sun.store §21.*
20. **Price alert** ("Njoftim çmimi") with target price, in-stock-only and include-delivery options. *Ref: PriceRunner alert dialog.*
21. **Price history chart** with table view. *Ref: Geizhals Preisentwicklung, PriceRunner (graph/table).*
22. **Material calculators** (tiles, adhesive, paint/plaster, insulation boards, blocks) with +10 % and "estimate only". *Ref: Wickes Calculator Hub.*
23. **Promoted listings, always labelled** "Sponsorizuar". *Ref: PriceRunner "AD", sun.store Placement labelled.*
24. **Report wrong data** (price, stock, spec). *Ref: PriceRunner issues report.*
25. **Delivery-time filter and "Kur arrin?" date** per offer. *Ref: Gjirafa50.al, sun.store "Availability from".*
26. **Bundles / kits** (panel + inverter + battery + mounting). *Ref: Memodo Packages, Krannich Speedkits.*

### LATER
27. **BOM / project list with "cheapest / cheapest in stock / fewest sellers" optimisation**. *Ref: PriceRunner basket presets.*
28. **Escrow-style secured payment** released on delivery confirmation. *Ref: sun.store Secured Payment.*
29. **Installer directory** (verified installers by city, request installation quote). *Ref: ENF directory; Segen/Unbound installer programmes.*
30. **Tiered seller badges** (Verified → Trusted → Top) tied to transaction count, response time, cancellation rate, with commission discounts. *Ref: sun.store.*
31. **Market price index** from platform data (lekë/Wp by technology, monthly). *Ref: sun.store PV Index / Battery Index.*
32. **Instalment payments** with bank partners. *Ref: Neptun (Raiffeisen, BKT Prima, IUTE Credit).*
33. **Freight/pallet delivery booking** with receiving checklist. *Ref: sun.store Delivery service, Unbound freight guide.*
34. **Regional expansion**: EUR and other currencies, Kosovo/North Macedonia shipping. *Ref: Gjirafa50 (Kosovo, Albania, North Macedonia sites).*

---

## 9. Cautions

- sun.store's T&C reserve "all rights in Portal data against text and data mining" (Article 4 DSM Directive). Do **not** import sun.store offers or prices into BeeD; use them only as UX reference.
- sun.store prices are **net of VAT** and in EUR; Albanian consumer prices must be shown **with TVSH** (commerce stream to confirm the exact rule).
- Paid placement must be labelled; ranking criteria should be published (sun.store does both).
- PriceRunner, Google and Geizhals are B2C; their features (alerts, history) need account/email consent flows under Albanian data-protection law (commerce stream).

## 10. Not verified / gaps
- pvXchange (429), idealo website (403), Hornbach / Bauhaus / Leroy Merlin (403 / bot challenge), ENF directory pages (403), MerrJep `/biznes` and search (503) — not read.
- sun.store fee **rates** (only the structure is public).
- Maximum number of products in compare lists on any site.
- Whether any EU marketplace shows €/kWh for batteries.
- A complete list of Albanian online solar and building-supply shops (only Gjirafa50, Neptun, MerrJep checked).
