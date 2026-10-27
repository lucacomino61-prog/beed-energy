# Renewable-energy focus: UI plan for the build step

Written 2026-10-27. The content is ready; this file says what the UI must do with it. Nothing below is built yet.

**Content files (new, ready to import):**
- `src/content/renewables.ts`: the guide as typed data (`GUIDE` sections, `FAQ`, `CITY_YIELDS`, `TIRANE_ROOF_VARIANTS`, `guideSources()`). Every fact carries `{ value, text, source: { label: {sq,en}, url } }`, the same shape as `Fact` in `src/content/story.ts`.
- `src/content/packages.ts`: six package definitions (`PACKAGES`), no prices. `sizeInputFor()`, `notIncluded()`, `overRegulatorySize()` are pure helpers. The header comment specifies the server helper the builder writes.
- `src/i18n/renewables.ts`: nav labels, titles and meta, page labels, product-card energy-line templates, buying-guide intros for the 9 energy categories, home teaser copy. `tr(lang)` returns one language. `panelYearKwh()` is the card formula.

**Rules that carry over:** DESIGN.md (copper only for energy/prices/active, sharp corners, Archivo + Geist Mono, no motion over forms or number entry, one GSAP ticker, nothing new animates tap targets), house style (glossary §0), every number with its source, Albanian first.

---

## 1. Routes

Add two keys to `ROUTES` in `src/lib/i18n.ts`:

```ts
guide:    { sq: '/energji-e-rinovueshme', en: '/en/renewable-energy' },
packages: { sq: '/paketa-diellore',       en: '/en/solar-packages' },
```

| File (new) | Renders |
|---|---|
| `src/pages/energji-e-rinovueshme.astro` | `<Guide lang="sq" />` |
| `src/pages/en/renewable-energy.astro` | `<Guide lang="en" />` |
| `src/pages/paketa-diellore.astro` | `<Packages lang="sq" />` |
| `src/pages/en/solar-packages.astro` | `<Packages lang="en" />` |
| `src/views/Guide.astro` | guide page (§3) |
| `src/views/Packages.astro` | packages page (§4) |
| `src/lib/packages.ts` | `pricePackage()` / `pricePackages()` (signature in the header of `src/content/packages.ts`) |

Same wrapper pattern as `kalkulatori-diellor.astro`. Both pages are server-rendered with their words in the HTML. `alternate` points to the other language's route key. The packages page reads the city from `?qyteti=` / `?city=` like the calculator does, and through `chosenCitySlug()` (`src/lib/city-pref.ts`).

## 2. Navigation

### Header (desktop, `src/components/Header.astro`)
Order: **Energji diellore · Ruajtja · Pompa nxehtësie · Karikim EV · Paketa · Udhëzuesi · Kalkulatori**, then Krahaso, Shporta, language, saver, Menu. Labels: `tr(lang).nav.*`.

| Label | Links to | `aria-current="page"` when |
|---|---|---|
| Energji diellore / Solar | category `solar-panels` | category is `solar-panels`, `inverters`, `mounting-systems`, `pv-accessories` or `energy-monitoring` |
| Ruajtja / Storage | category `batteries` | category is `batteries` |
| Pompa nxehtësie / Heat pumps | category `heat-pumps` | category is `heat-pumps` or `solar-water-heaters` |
| Karikim EV / EV charging | category `ev-chargers` | category is `ev-chargers` |
| Paketa / Packages | `packages` | current = `packages` |
| Udhëzuesi / Guide | `guide` | current = `guide` |
| Kalkulatori / Calculator | `calculator` | current = `calculator` |

- Category slugs come from the database row (`slug_sq` / `slug_en`), never typed by hand. Header needs the current category's `slug_en`: pass it as a new optional prop from `Category.astro` (and `Product.astro` for the product's category).
- "Kërko ofertë" leaves the header and stays in the menu and the product action bar.
- The bar must not wrap or overflow. Below the width where seven links fit (test it in Albanian, the longer language), the four shelf links collapse to the existing Menu button; Paketa, Udhëzuesi and Kalkulatori stay as long as they fit, then also collapse. The phone dock (Kreu · Kërko · Kategoritë · Krahaso · Shporta) does not change.
- The shelf links get no entrance animation (DESIGN.md motion rules).

### Group sub-links on the category page
The "Energji diellore" group has five shelves. On those category pages, show a row of sibling links under the title block: Panele diellore · Inverterë · Sisteme montimi · Aksesorë fotovoltaikë · Matës energjie (names from the DB). Same for Pompa nxehtësie: Pompa nxehtësie · Ngrohës uji diellorë. Plain links, current one marked with `aria-current` and an underline (not colour alone).

### Full-screen menu (`src/components/Menu.astro`) and footer
- Categories in **two** groups: **Energji e rinovueshme** (`group_key = 'energy'`, 9 shelves) and **Efikasitet dhe ndërtim / Efficiency & building** (`group_key` `efficiency` + `build`, 5 shelves: kondicionerë, izolim, dritare, LED, çimento). Group heading = `tc(lang).groups.energy` and `tr(lang).nav.efficiencyBuild`.
- `menu__big` links: Dyqani · **Paketa** · **Udhëzuesi** · Kalkulatori · Kërko ofertë · Shitësit · Shit me ne.
- Footer "Dyqani" column: the same two groups plus Paketa and Udhëzuesi.
- The database keeps the three `group_key` values; only the display merges `efficiency` and `build`.
- Wording: decided 2026-10-27, the label is **"Efikasitet dhe ndërtim"** (the same word as `common.ts`'s "Efikasitet energjetik"); read it from `tr(lang).nav.efficiencyBuild`.

### Shop landing (`src/views/Shop.astro`) and category title block
- Shop landing: two groups instead of three, same headings as the menu.
- `Category.astro` `groupName`: `efficiency` and `build` both show `nav.efficiencyBuild`.

## 3. Guide page (`/energji-e-rinovueshme`)

**Layout:** a title block (eyebrow, h1, lede from `tr(lang).guide`), then a two-column body on desktop: a sticky **section index** on the left (`guide.index` heading, links 01–06 to `#today`, `#self-producer`, `#tariffs`, `#yield`, `#equipment`, `#faq`, with each section's `short` line under its title) and the sections on the right. On phones the index is a plain list at the top, not sticky.

**Each section** (`GUIDE[i]`): key number (`n`, two digits, Geist Mono), `title` as h2, `paragraphs`, then `lists`, then `facts`, then `notes`, then shop links for `categories` ("Shiko në dyqan" + category name, live product count and lowest price as on the home page).
- **Facts:** the same stat layout as the home page's facts: `value` big in Geist Mono, `text` beside it, a footnote link with `source.label[lang]` (and `also` when present). Facts with `computed: true` carry the tag `guide.tags.computed`.
- **Lists:** `ordered` → `<ol>`. `guidance: true` → the list shows the tag `guide.tags.guidance` ("Udhëzim i përgjithshëm, jo rregull ligjor") next to its title. List `source` / `also` → footnote under the list.
- **Notes:** a ruled box with a word tag, never colour alone: `guidance` → `tags.guidance`, `assumption` → `tags.assumption` ("Supozimi ynë"), `unknown` → `tags.unknown` ("E pa verifikuar"). Source footnote when present.
- **Section 4 (yield)** adds two tables after the paragraphs: `CITY_YIELDS` (columns from `guide.table`: city, kWh/kWp, best tilt, facing, December, July; numbers with `num()`; azimuth shown as "jug", "−4°"…) and `TIRANE_ROOF_VARIANTS` (columns from `guide.roofTable`; `vsOptimalPct` with sign, `note` as a footnote row). Real `<table>` with `<caption>`; on phones the table scrolls inside its own box, the page does not.
- **Section 5 (equipment)** renders `parts` as h3 sub-sections with ids `#panels`, `#inverters`, `#batteries`, `#heat-pumps`, `#solar-water-heaters`, `#ev-charging` (deep links from the category pages, §6). The index shows them as a nested list under 05.
- **Section 6 (faq)** renders `FAQ` as `<details><summary>` items (open/close without script), answers as paragraphs, sources as footnotes; `computed: true` items carry the computed tag.
- **Foot of the page:** "Burimet / Sources" list from `guideSources()` (label + link), `guide.read(GUIDE_RESEARCH_READ)` formatted with `date()`, and links `toPackages`, `toCalculator`.
- **Values:** content strings are already formatted (no-break spaces in Albanian numbers). Do not re-format them.
- **JSON-LD:** `Article` (headline = h1, inLanguage, dateModified) and `FAQPage` built from `FAQ`.
- **Motion:** none beyond the site's existing reveal of section headings; the index highlight on scroll may use ScrollTrigger on the shared ticker, or nothing. Off in energy-saving mode.

## 4. Packages page (`/paketa-diellore`)

**Layout:** title block (`packages.eyebrow`, `h1`, `lede`), a city form (GET, `<select name="qyteti">` with the 14 `pvCities()`, default the remembered city if it has a PVGIS yield, else `tirane`; submit `cityApply`). Then six package cards in a grid (3 columns desktop, 1 on phones), in `PACKAGES` order. Then `packages.assumptions`, then links `toCalculator`, `quote`, `toGuide`.

**Data:** `pricePackages(citySlug)` on the server, which calls `sizeSystem(sizeInputFor(pkg, citySlug))` per package and prices `pkg.extras` (the heat pump: cheapest in-stock `heat-pumps` offer in the city's delivery zone, `phases = 1`, `heating_capacity_kw` 4–10). Only the 14 PVGIS cities are offered; any other slug falls back to `tirane`.

**One card:**
1. Key `01`–`06`, `name` (h2), `summary`.
2. `packages.size(kwp, panels, wp)` from the result (kWp with `num(…, 2)`, panel Wp from `result.assumptions.panelWp`), and `packages.year(num(result.annualKwh), cityName)`.
3. Price: `packages.priceLabel` + `lek(total)`; under it `packages.priceNote`. If `complete` is false: no total, show `packages.incomplete`, and still list the lines found.
4. "Në paketë / In the package": the kit lines (`lines.panel`, `lines.inverter`, `lines.battery`, `lines.extra`) with qty × product name, each linking to its product page, and the line price.
5. `suits` heading + list; `packages.roof(pkg.roofM2)` with the guidance tag.
6. `notIncluded` heading + `notIncluded(pkg)` list.
7. `pkg.notes` as small print; for battery packages also `packages.batteryCheck`.
8. If `overRegulatorySize` is true: `packages.overSize` in a ruled note (word tag "Kujdes", not colour alone). Example: home-3 with 620 Wp modules sizes to 3.1 kWp, above 350 × 12 ÷ 1 400 = 3.0 kWp.
9. Actions: "Kërko ofertë për instalimin" (→ `quote` with `?paketa=<id>&qyteti=<city>`), "Ndryshoni konsumin në kalkulator" (→ `calculator` with the package's input as query: `qyteti`, `kwh`, `lidhja`, `bateri`, `faza`).

**Whole package to the basket (built 2026-10-27, overrides the earlier "not in this pass"):** a complete card has "Shtoni paketën në shportë", a form that posts `action=add-many` with repeated `offerId`/`qty` fields to `/api/cart` (works with scripts off; with scripts `site.ts` sends `{action:'add-many', lines}` as JSON). At most 12 lines, whole numbers, qty 1–9999, merged into the basket like `add`. The per-line product links stay. Battery cards show `packages.batteryCheck` as a "Kujdes" note right above the button.

**JSON-LD:** `ItemList` of the six packages (name, description, url with anchor). No `Offer` price unless `complete`, and never a price that is not from live offers.

**Motion:** none on the form or the prices (DESIGN.md: never motion over forms or number entry).

## 5. Energy line on product cards

`src/components/ProductCard.astro` gets one optional prop, `energy?: { text: string; title: string }`, rendered as one Geist Mono line under the spec chips (`title` as the element's `title`, and as visually hidden text after it for screen readers).

Computed by the caller (Category, Shop landing, Search, Seller, Compare where cards are used), per product:

| Category (`slug_en`) | Text | Formula |
|---|---|---|
| `solar-panels` | `card.panelYear(num(kwh), cityName)` | `panelYearKwh(specs.power_wp, city.pv_yield)` |
| `batteries` | `card.batteryUsable(num(specs.usable_capacity_kwh, 2))` | spec as is |
| `heat-pumps` | `card.heatPumpCop(num(specs.cop_a7w35, 2))` | spec as is |

- City for panels: `chosenCitySlug()` if it has a PVGIS yield, else `tirane`. Name from the DB (`name_sq` / `name_en`).
- When the energy line shows `usable_capacity_kwh` or `cop_a7w35`, drop that attribute from the card's highlight chips so it is not shown twice.
- No line when the spec is missing.

## 6. Category buying-guide intros

`tr(lang).categoryIntro[slug_en]` for the nine energy categories (`ENERGY_CATEGORIES`).

- Preferred: copy the nine texts into `scripts/catalog/categories.mjs` (`intro_sq` / `intro_en`) and update the existing DB rows only where the intro still equals the old seeded text, so admin edits survive. Then the title block keeps reading the DB intro, and the admin stays the one place to edit it.
- If that is not done in this pass: `Category.astro` shows `categoryIntro[slug_en]` for energy categories instead of the DB intro.
- Either way, under the intro: the sources from `CATEGORY_INTRO_SOURCES[slug_en]` as footnote links, and a "Lexoni më shumë në udhëzues →" link to the guide part: `solar-panels`, `mounting-systems`, `pv-accessories` → `#panels`; `inverters` → `#inverters`; `batteries` → `#batteries`; `heat-pumps` → `#heat-pumps`; `solar-water-heaters` → `#solar-water-heaters`; `ev-chargers` → `#ev-charging`; `energy-monitoring` → `#self-producer`.

## 7. Home teasers

Two blocks after the story's finale ("Ndize") and before "Si funksionon", side by side on desktop, stacked on phones, using `tr(lang).home`:
- **Packages:** eyebrow, title, text, and `packagesFrom(lek(min))` where `min` is the lowest `total` among complete packages for the remembered city (or Tirana). Hide the "from" line when no package is complete. CTA → `packages`.
- **Guide:** eyebrow, title, text, CTA → `guide`.

Static blocks: no new choreography. They must not touch the house signature, its sticky sheet or the chapter index, and must render the same in energy-saving mode and with scripts off.

## 8. Calculator cross-links

Under the calculator result: links to `packages` and to `guide#self-producer`. No change to the calculator's maths.

---

## Acceptance criteria

**Routes and nav**
1. `/energji-e-rinovueshme`, `/en/renewable-energy`, `/paketa-diellore`, `/en/solar-packages` return 200, with `<title>` and `<meta name="description">` from `tr(lang)`, `hreflang` alternates to each other, and their words in the server HTML (curl shows the guide's section titles and FAQ questions; the packages page shows six package names and prices or the "incomplete" line).
2. `ROUTES.guide` and `ROUTES.packages` exist and every new link is built with `href()`.
3. Header shows the seven links in the order of §2 at 1440 px in both languages without wrapping; at 375 px nothing overflows horizontally (scrollWidth = clientWidth) and the dock is unchanged.
4. `aria-current="page"` is set on the right header link for each category, the guide, the packages page and the calculator.
5. Menu, footer and shop landing show exactly two groups: 9 energy shelves, then 5 under "Efikasitet dhe ndërtim" / "Efficiency & building".

**Guide**
6. All six sections render with ids `today`, `self-producer`, `tariffs`, `yield`, `equipment`, `faq`, and the six equipment parts with their ids; every index link scrolls to its target.
7. Every fact shows its source label in the page's language with a working link; no Albanian source label appears on the English page and the reverse.
8. Each guidance list and note shows its word tag; assumption and unknown notes show theirs; computed facts show "Llogaritje jona" / "Our arithmetic". None depends on colour alone.
9. The city table has 14 rows, Fier first at 1 521 kWh/kWp, Kukës last at 1 358; the roof table has 6 rows.
10. FAQ items open and close with scripts off; the page has valid `Article` and `FAQPage` JSON-LD.
11. The surplus wording on the page is exactly the content's: Instruction 3/2019 point 17 (unpaid surplus) and "we have not yet found a published price" for the May 2026 rules. Nothing on the page says the price is zero by law or that it has not been published.

**Packages**
12. Six cards in `PACKAGES` order for Tirana by default; changing the city to Fier (`?qyteti=fier`) reprices every card and the kWh/yr line changes; a non-PVGIS slug (`?qyteti=kavaje`) falls back to Tirana without an error.
13. Each card's total equals the sum of its listed lines (kit + extras); a package with a missing line shows no total and shows the "incomplete" text.
14. Every card lists the six "not included" items (nine for the heat-pump package), the roof area with the guidance tag, and, for the two battery packages, the battery–inverter check.
15. `overSize` shows exactly when `kwp × 1 400 > kwhMonth × 12`.
16. No price on the page comes from anywhere but live offers; no package price is stored in code or content.

**Cards and categories**
17. A solar-panel card shows "≈ N kWh/vit në {qyteti}" with N = round(power_wp × city yield ÷ 1000) for the remembered city (Tirana by default); a battery card shows "X kWh të përdorshme"; a heat-pump card shows "COP X"; the matching chip is not repeated.
18. The nine energy category pages show the new buying-guide intro in both languages, with source links where `CATEGORY_INTRO_SOURCES` has them and a working link to the guide part.

**Home**
19. The home page shows the two teasers after the finale, in both languages; the house signature, chapters and energy-saving mode behave exactly as before (no new requestAnimationFrame, no new GSAP timeline).

**Checks**
20. `npx astro check`: 0 errors. `npm run build` succeeds. No console errors on the four new pages and the home page at 1440 and 375 px, in both languages and in energy-saving mode.

---

## Known gaps to keep visible (not for this pass)

- Fixed 2026-10-27: `solarAssumptions` is now awaited (and range-checked key by key, `solarAssumptions()` in `solar.ts`; no such row exists in the local database, so the defaults apply); the same missing `await` in `shop-data.ts` `deliverySettings()` (product and compare pages) is fixed; `cheapest()` is exported, reads specs and tiers in one query each and skips offers whose minimum order is above the quantity.
- ~~Battery–inverter compatibility (high voltage vs 48 V) is not checked anywhere.~~ Done 2026-10-27: `src/content/battery-compat.ts` holds the 36 pairs from the makers' own lists (research/inverter-battery-compat.md), and `sizeSystem()` pairs only listed ones. New inverters or batteries are never paired until the file has an entry for them.
- Six delivery cities have no PVGIS yield (Kavajë, Krujë, Kuçovë, Laç, Peshkopi, Përmet); the packages page and panel cards fall back to Tirana for them.
- The surplus price under the May 2026 net-billing rules, monthly vs yearly netting, and the VAT basis of household tariffs remain open (NEEDS_VERIFICATION.md).
