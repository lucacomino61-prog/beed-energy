# BeeD Energy — design contract

Chosen by Luca on 2026-10-23: **"Shtëpia në shtresa" / The house in layers.**
Research behind it: `research/awwwards-energy-construction.md` (20 winners), `research/marketplace-ux.md`.
Engine line: **GSAP 3.15 + ScrollTrigger + Lenis 1.3 on GSAP's ticker. One requestAnimationFrame owner. No other motion library.**

## Thesis
Everything a house needs to be built and to make its own energy, sold by Albanian sellers side by side. The site is a construction drawing set: one house on a drafting sheet whose energy equipment lifts out part by part — and every part is a shelf of the shop. (Since 2026-10-27 the house itself is a realistic AI illustration; the drawing set is the sheet, the keys and the leaders around it.)

Refused on purpose (the category's defaults, see research §5.1): blue-sky panel photos, turbines, green leaves, lime/yellow "energy" palettes, hard hats, power puns, a full-bleed asset video hero, a three-number vanity stat row.

## The world
- **A drawing set, not a brochure.** Thin ink lines on warm paper, dimension lines in millimetres, leader lines with numbered keys, title blocks, section cuts. Products are shown as technical drawings at their real datasheet size (`src/lib/drawing.ts`), never as fake photos.
- **Copper is energy.** The only colour that is not ink or paper. It marks what carries current or heat: the live layer, prices, the active state, the moment the house switches on. Copper is wire, pipe and roof flashing, so it belongs to both sectors.
- **Things are assembled, not faded in.** Motion comes from a site: parts lift out of the house like an exploded assembly drawing and go back in; lines are drawn, not revealed; numbers are stamped.

## Colour (two colours + tinted neutrals) — tokens in `src/styles/tokens.css`
| token | value | use |
|---|---|---|
| `--ink` | `oklch(18% 0.012 60)` ≈ #18150f | text, lines, dark grounds |
| `--copper` | `oklch(66% 0.135 52)` ≈ #c9743b | energy, prices on dark, active, focus on dark |
| `--copper-deep` | `oklch(49% 0.12 45)` ≈ #9a4a22 | copper text on paper (≥ 4.5:1) |
| `--paper` | `oklch(96.6% 0.008 75)` ≈ #f6f2ea | page ground |
| `--paper-2` | `oklch(92.5% 0.012 72)` | panels, rows |
| `--line` | ink at 16% | hairlines |
| `--ink-2` | `oklch(42% 0.015 60)` | secondary text (≥ 4.5:1 on paper) |
Rules: copper never carries small text on paper (use `--copper-deep`). Dark sections are `--ink` ground with `--paper` text and `--copper` accents. State is never colour alone (icons, words, underline).

## Type — self-hosted WOFF2 in `public/fonts/`
- **Archivo** (variable, wdth 62–125, wght 100–900, OFL, Omnibus-Type): display at poster size **condensed** (`font-stretch: 62%–75%`, weight 750–850, uppercase allowed for 1–3 word posters, tracking −0.02 em), and the text face at 100% width, 400/500.
- **Geist Mono** (OFL, Vercel): every number with a unit, prices, spec labels, dimension labels, keys (01–07), eyebrows. `font-variant-numeric: tabular-nums`.
- Scale: Utopia from `awwwards-blueprints/assets/base.css`; poster `--step-display` raised to 64 → 300 px (`clamp(4rem, 0.5rem + 15.5vw, 18.75rem)`); phone poster ≥ 15 vw, fitted, `overflow-wrap: anywhere`.
- Albanian is long: never let a heading overflow; test with "Ngrohës uji diellorë" and "Karikues për makina elektrike".

## Surfaces and shape
Sharp corners (0) everywhere except: the cart count pill and the energy-saving switch (999 px). 1 px rules (`--line`); double rule (3 px + 1 px) under page title blocks. Buttons square: primary = ink fill / paper text; on dark = copper fill / ink text; secondary = 1 px ink outline. Hover only under `(hover: hover)`; press `scale(0.97)`.

## Signature — "Shtëpia ndizet" (the house switches on), exploded parts
Home, sticky sheet beside the scrolling chapters (CSS sticky, no pin; chapters toggle through ScrollTrigger, Lenis-driven). Updated 2026-10-27 at Luca's request: energy first, and a realistic house instead of the line drawing.
- **The house is a realistic, AI-generated illustration**, not a photo and not a drawing: a two-storey Albanian house (tile roof with 8 PV panels and a solar thermal collector, garage with an EV charger, heat pump, inverter/battery unit and meter on the side wall), rendered with FLUX.2 [klein] 4B on Cloudflare Workers AI and cut out onto the paper (`public/house/`, `ASSETS.md`, prompts in `tools/art/house-prompts.mjs`). A day render and a dusk render on the same canvas, plus one cut-out image per piece of equipment. Geometry (hotspots, object boxes, the house's solid-pixel grid) lives in `src/lib/house-render.ts`, copied from `public/house/manifest.json`.
- **The line-drawing world stays for the chrome**: the drafting-grid sheet the render sits on, copper rings and leader lines, the HUD title-block label, numbered keys, mono captions, product drawings in the shop. A small mono stamp on the sheet says "AI-generated illustration · not a photo".
- Seven chapters, energy first (`src/content/story.ts`, `parts` per chapter): **01 Panelet diellore** (pv) → **02 Inverteri** → **03 Bateria** → **04 Ngrohja, ftohja, uji i ngrohtë** (heat pump + solar water heater) → **05 Karikuesi** (EV) → **06 Matësi dhe rrjeti** (meter, net billing) → **07 Energjia që nuk humbet** (insulation + windows). Building materials stay in the shop, not on the stage.
- When a chapter goes live (`src/scripts/home.ts`): the house steps back (scale + translate) and dims to 58 %; a copper ring marks the equipment on it; the matching part image flies out of that point (from 18 % scale, transparent) to the free area of the sheet nearest it — found on the house's solid-pixel grid, so it never lands on the house, the ring, the label or the stamp; a copper leader is drawn from the ring to the part (scaleX) and the HUD label (key, chapter, shop category, **live product count and lowest price from the database**, link) fades in beside the part. The previous part flies back into the house. Transform + opacity only, ≤ 0.8 s, every tween interruptible (`overwrite: 'auto'`).
- **Finale "Ndize"**: every part flies home, the house returns to full size, the sheet turns to night (ink ground, paper grid) and the day render cross-fades to the dusk render with lit windows; the counter stamps the year's production for a 5 kWp roof in the chosen city (PVGIS).
- Phone: the same sticky sheet at the top (≥ 30 svh, clear of the dock); the house steps back to the left, the part takes the free band beside or above it, the label is a compact two-line tag.
- **Energy-saving mode / reduced motion / no scripts**: a static exploded diagram — the house in the middle of the sheet, every part laid out around it on a CSS grid with its chapter key (01–07) and a short copper leader toward the house; chapters read as a plain list; the sheet is not sticky on phones. Nothing moves.
- `src/lib/house.ts` (the old isometric SVG) is no longer on the home page; it stays for the dev pages and the OG image.

## Technique map (award technique → object in this world)
| # | Technique (winner) | Here |
|---|---|---|
| 1 | Phase-by-phase build (NRG) + pinned product (Caeli) | Exploded parts lift out of the realistic house, chapter by chapter (signature) |
| 2 | Word-swap preloader (Marvell) + % curtain (Belgrade Arbor) | Loader: "Ndërtim → Construction → Energji → Energy → BeeD Energy", the ground line of the house draws as progress; skip button; ≤ 1.6 s; once per session; hard 2.5 s time-out; never on a product URL |
| 3 | Energy-saving mode (Enpower) + Stop animations (Vazzi) | "Kursim energjie" switch in the header and footer = `html[data-motion=off]` + no pin, no smooth scroll |
| 4 | One product → many (ON Energy) | Product page: the drawing card fans out into the seller offer cards, which settle into the offers table sorted by price |
| 5 | Live counts in the menu (Decor Systems) | Full-screen menu: 14 categories with real product counts and "nga 12 400 L" |
| 6 | Sample basket counter in the nav (Decor Systems) | "Krahaso 2" and "Shporta 3" counters in the header, SSR from cookies |
| 7 | Spec sheet as object (Gehry metadata cards, Fluid Glass tags) | Product page "Fleta teknike": drawing + title block (Vizatimi nr., shkalla, përmasat në mm, burimi) |
| 8 | HUD labels with leader lines (Igloo) | House labels, product drawing callouts |
| 9 | "What's around" map with times (Belgrade Arbor) | Line map of Albania: cities, PVGIS yield, delivery days, sellers |
| 10 | Chapter index + progress (ERA, Gehry) | Vertical rule with keys 01–07 and a permanent "Hyr në dyqan" exit |
| 11 | Bottom-docked pill nav (Fluid Glass) | Phone dock: Kërko · Kategoritë · Krahaso · Shporta |
| 12 | Fixed action bar (Jonite) | Product page: Kërko ofertë · Pyet shitësin |
| 13 | Word-by-word manifesto (Caeli) | Home manifesto under the poster |
| 14 | Mask/slit page transition (KPR, Fluid Glass) | Cross-document view transition: the new page slides in like a drawing sheet |

## Motion rules
- UI 150–250 ms ease-out; choreography (loader, house, offers fan-out, page transition) only, skippable.
- GSAP ticker drives Lenis (`autoRaf: false`) and every tween; no other rAF. `gsap.ticker.lagSmoothing(0)`.
- Never animate width/height/top/left; transform + opacity only; SVG groups use `transform-box: fill-box`.
- Entrance animations never move tap targets (opacity only on nav and buttons).
- Reduced motion or energy-saving: final states at once; no pin; native scroll.

## Layout
12 columns, gutter 40 px desktop / 20 px phone, header 72 px, sections 128 px apart. Shop pages are calm: the world shows in rules, drawings, mono labels and copper — never in motion over forms or number entry.

## Copy voice
Albanian first, plain and practical, second person ("ju"), numbers with units and sources. No power puns. English is a full translation, not a summary.
