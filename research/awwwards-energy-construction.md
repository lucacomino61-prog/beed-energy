# Awwwards winners in energy and construction: design direction for BeeD Energy

Research date: **2026-10-23** (all Awwwards pages and live sites below were read that day unless a line says otherwise).
Client context: BeeD Energy (BeeD Consulting sh.p.k.), a bilingual (sq/en) multi-vendor marketplace for construction and renewable-energy products in Albania. See `BRIEF.md`.

Scores are the Awwwards jury scores as displayed on each site's Awwwards page on 2026-10-23. Company figures quoted from the sites (GW, ft², units) are **the companies' own claims**, recorded as seen; they were not independently verified and must not be reused as facts about BeeD.

---

## 0. Method and limits

**Pools read on awwwards.com** (one request at a time, at least 1.8 s apart):
- Sites of the Day archive, pages 1 to 72: 2,232 winner cards from 2020-09-12 to 2026-10-23, of which **2,121 are dated 2021-01-01 or later**. Each card carries slug, date, category tags and award badges (SOTD, SOTM, SOTY, Developer, Honors).
- Sites of the Month (3 pages) and Sites of the Year listings.
- 102 keyword search pages (`/websites/?text=…`): energy, energie, solar, wind, hydrogen, battery, power, electric, grid, climate, carbon, nuclear, fusion, renewable, sustainability, heat, geothermal, construction, builders, building, architects, architecture, engineering, concrete, cement, steel, timber, materials, real estate, residences, development, homes, property, infrastructure, utility, oil, gas, charging, EV, volt, watt, cleantech, decarbon, mobility, tower. Search results include nominees, so only cards with an award badge were kept.
- A manual scan of the 481 SOTD titles 2021+ tagged Technology, Startups, Social responsibility or Institutions, to catch energy companies whose names do not say "energy" (this found Heidelberg CCUS, The State of the Transition, ZettaJoule, GenCell, Hut 8, Air Company, CoMinVi, Modelec).
- `/sites/<slug>/content` for 76 candidates: overall score, Design/Usability/Creativity/Content sub-scores, Developer Award score, "Elements", palette and "Technologies & Tools".

**What the pool says about the category:** of the 2,121 SOTDs since 2021, 148 (about 7%) carry the Architecture or Real Estate tag; energy/climate subjects are rare: **20 SOTD-level energy/climate winners found from 2021 to 2026** (11 profiled below + 9 in section 4), under 1% of all SOTDs. Energy is an under-served category on Awwwards, which helps a strong entry stand out. (Keyword and title scanning can miss a company whose name and tags give no hint, so treat 20 as a floor.)

**Live sites:** every profiled site was opened with a purpose-written headless-Chrome recorder (`story.mjs`, scratchpad): 1440×900, frames at 0.3 s / 1.5 s / 3.5 s for the preloader, then real mouse-wheel scrolling one viewport per frame (up to 16 frames), plus the visible large text per frame, heading outline, nav links, menu (opened by clicking the toggle), loaded web fonts, `hreflang`, detected libraries and requestAnimationFrame calls per second. It clicks only intro gates ("Enter Site", "Enter website", "Start", "Skip") and menu toggles, never accepts cookies and never submits anything. One site was also checked in the Browser pane. Six of the most relevant sites were also measured with the awwwards-blueprints `fingerprint.mjs` script (page weight, CSS features, accessibility quick checks): results in section 5.6.

**Limits**
- The network on this machine was intermittent between about 10:05 and 10:35 local time; failed captures were retried. Sites that still could not be loaded are marked.
- A live site in October 2026 may differ from the build that won (redesigns, CMS changes). Where it clearly differs this is noted.
- Honorable Mention pages show only community votes, **no jury score**.
- Headless Chrome on this machine renders some heavy WebGL scenes slowly; where a scene never got past its loader, the story is reconstructed from the page's headings and Awwwards' "Elements" and marked as such.
- rAF calls/s are measured headless on a 60 Hz display: a value well above 60 means more than one animation loop is running.

---

## 1. At a glance: the 20 profiled sites

Newest first inside each group.

| # | Site | Sector | Award (date) | Jury score | Agency | Live 2026-10-23 |
|---|---|---|---|---|---|---|
| E1 | NRG: Build Your Data Center | Utility / power for data centres | SOTD 30 Jun 2026 + Dev | 7.37 | Rogue Studio | yes (behind "Enter Site" gate) |
| E2 | ON Energy | Energy storage (medium-voltage UPS) | SOTD 9 Mar 2026 + Dev | 7.44 | Studio 28K | yes |
| E3 | Breakthrough Energy | Clean-energy investment platform | SOTD 15 Jan 2026 + Dev | 7.38 | Resn | home page stuck on its loader (site JS error) |
| E4 | Heimdall Power | Grid sensors (dynamic line rating) | SOTD 17 Oct 2025 | 7.29 | Refokus | yes |
| E5 | Caeli Énergie | Low-carbon air conditioning (FR/EN) | SOTD 21 Sep 2025 + Dev | 7.21 | Beaucoup. | yes |
| E6 | Heidelberg Materials CCUS | Cement + carbon capture | SOTD 15 Sep 2025 + Dev | 7.65 | Ashfall Studio | yes (click-driven) |
| E7 | Aramco: The Birth of Oil | Oil and gas heritage story (EN/AR) | SOTD 27 May 2025 + Dev | 7.30 | Immersive Garden | yes |
| E8 | Zaptec | EV chargers (13 locales) | SOTD 13 Jul 2024 + Dev | 7.29 | Good Morning | yes |
| E9 | The State of the Transition 2023 | Clean-energy data report | SOTD 28 Nov 2023 + Dev | 7.63 | Niccolò Miranda | yes (behind "Enter website" gate) |
| E10 | Enpower Trading | Renewable power trading (South Africa) | SOTD 7 Nov 2023 + Dev | 7.50 | DashDigital | yes |
| E11 | Prometheus Fuels | Fuel from air (e-fuels) | SOTD 4 May 2021 + Dev; "Site of the Year 2021" badge | 8.40 | Active Theory | **no**: winning build replaced by a WordPress site |
| C1 | Belgrade Arbor | Residential + business complex, New Belgrade (EN/SR) | SOTD 17 Oct 2026 + Dev | 7.22 | Square43 Studio | yes |
| C2 | ERA Residence | Residential development, Estepona | SOTM Aug 2026; SOTD 31 Aug 2026 + Dev | 7.61 | The First The Last | yes |
| C3 | Marvell Tile & Stone | Tiling and stone supplier (Perth) | SOTD 7 May 2026 + Dev | 7.26 | Humaan | yes |
| C4 | Fluid Glass | Architectural/structural glazing (UK) | SOTD 30 Mar 2026 + Dev + Business & Services Honors Mar 2026 | 7.77 | Exo Ape | yes |
| C5 | Jonite | Engineered-stone gratings, with online shop | SOTD 11 Oct 2025 + Dev | 7.19 | Series Eight | yes |
| C6 | Composites.archi | Composite materials in construction (JEC) | SOTD 8 Apr 2025 + Dev + Business & Services Honors Mar 2025 | 7.60 | Sparkk | yes |
| C7 | Sculpting Harmony (Getty) | Architecture story: Walt Disney Concert Hall | SOTM Nov 2023; SOTD 17 Nov 2023 + Dev | 7.89 | Resn | yes |
| C8 | Edifis | Industrial real-estate developer (EN/FR) | SOTD 1 May 2023 + Dev | 7.85 | Tux Creative House | yes |
| C9 | Decor Systems | Architectural acoustic products, sample ordering | SOTD 17 Feb 2022 | 7.64 | NIGHTJAR | yes |

Split: 11 energy/climate (E1 to E11; E6 is also a building-materials company), 9 construction/architecture/real-estate/materials (C1 to C9).

---

## 2. Profiles: energy and climate

### E1. NRG: Build Your Data Center
- **URL:** https://business.nrg.com/campaigns/build-your-data-center/ · Awwwards: https://www.awwwards.com/sites/nrg-build-your-data-center
- **Award:** SOTD 30 Jun 2026 + Developer Award. **Jury 7.37** (Design 7.31, Usability 7.17, Creativity 7.56, Content 7.77); Dev 7.32.
- **Agency:** Rogue Studio.
- **What it is:** a campaign microsite for NRG (US energy company) selling "bring your own power" for AI/cloud data centres, from site evaluation to operation.
- **Scroll story (captured):**
  1. **Gate:** dark aubergine screen, NRG logo + campaign name, yellow "Enter Site" button, cookie bar.
  2. Light page, huge uppercase H1 about data driving the world, a one-line sub, and a rounded video card of a data hall below.
  3. Scrolling grows the video card to full bleed; two paragraphs about "Bring Your Own Power" and "from land to ramp-up" are set over the moving hall.
  4. A "start building with us" chapter introduces "five simple phases" and a floating pill button "Scroll to Phase 1".
  5. From the DOM and menu: the five phases are Site Evaluation, Site Development, Construction, Power Ramp-up, Fully Operational, plus a Virtual Tour. Site Evaluation alone lists 12 "nodes" (fibre, water, natural gas, load-ramp plan, TSP/ISO engagement, turbine reservation, land and environmental evaluation, lower-carbon options, community alignment, air permitting, CCS studies…). Awwwards highlights "Nodes" and "Phase 04 Scroll through". The capture stopped at the hand-off into the phase view.
- **Preloader:** none; the "Enter Site" gate plays that role.
- **Menu:** a small "Menu ▾" pill top-right opens a dropdown that is a checklist of the five phases + Virtual Tour + a green "Get in touch" button.
- **Signature:** the build process as a phase-by-phase scroll, each phase opening into a checklist of nodes.
- **Micro-interactions:** expanding video card; floating "scroll to phase" pill; dropdown-as-progress list.
- **Type / colour:** Riegla (single family, H1 120px weight 500). Palette #FFC20E (yellow) / #261D26 (aubergine); page background #F6F7F3.
- **Stack:** Lenis + Lottie detected; Awwwards: HTML5, JavaScript, Figma. rAF ≈128/s.
- **For BeeD:** the phase model maps directly onto a construction/energy project (plan → materials → installation → energy on); each phase can list the product categories a buyer needs.

### E2. ON Energy
- **URL:** https://www.on.energy/ · Awwwards: https://www.awwwards.com/sites/on-energy
- **Award:** SOTD 9 Mar 2026 + Developer Award. **Jury 7.44** (7.58 / 7.30 / 7.28 / 7.61); Dev 7.33.
- **Agency:** Studio 28K (Awwwards also credits Ruud Luijten, John Iacoviello, Lisa Odette, Jérôme Bodin).
- **What it is:** medium-voltage UPS / storage systems that protect AI data centres and the grid from each other.
- **Scroll story (captured, 16 frames, page 15,592 px):**
  1. Black hero, light-weight H1 about grid-safe power for AI factories; a small yellow product teaser card bottom-right.
  2. A rendered steel enclosure slides in under the headline; scrolling moves the camera along its surface.
  3. Full-yellow block with one large positioning paragraph.
  4. Pinned chapter on voltage ride-through: over about four screens the single unit turns, pulls back and **multiplies into a lit field of identical units**.
  5. Four-up feature grid on black with line icons (bankable hardware, gigawatt supply chain, U.S. manufacturing, fault tolerance).
  6. Testimonial with customer logo, then a one-line focus statement.
  7. "Performance at scale" over a yellow light-streak visual.
  8. Stat cards with superscript units: 3 GW+ operating and under construction, 99.9% uptime, 10+ GW production capacity, 75+ projects (company claims); one card holds an outline map of the Americas.
  9. News cards, closing CTA.
- **Preloader:** none. The H1 is painted at 0.3 s; the render fades in by about 1.5 s.
- **Menu:** a top bar of five equal grey tab-buttons (Expertise, Solutions, Financing, About, Resources) + yellow "Get in touch" pill; yellow "ON" logo tile.
- **Signature:** one product → a fleet. Scale is shown by multiplying the product on scroll.
- **Micro-interactions:** Awwwards lists an "Energy Stream Interaction" (mouse-driven light streaks) and two illustrations ("Power Quality", "Grid Volatility").
- **Type / colour:** Univers Next Pro (H1 64px, weight 300) + ABC Monument Grotesk Mono. Palette #FFF313 / #000000.
- **Stack:** fingerprint: Nuxt (Vue) + **Storyblok** CMS, GSAP (bundled), Lenis, three.js r180; 16.4 of its 21.7 MB first load is video. Awwwards: WebGL, 3D, Figma. rAF ≈129 to 140/s.
- **For BeeD:** "one product, many offers" is exactly price comparison: a single product card can fan out into the seller offers behind it.

### E3. Breakthrough Energy
- **URL:** https://www.breakthroughenergy.org/ · Awwwards: https://www.awwwards.com/sites/breakthrough-energy
- **Award:** SOTD 15 Jan 2026 + Developer Award. **Jury 7.38** (7.34 / 7.27 / 7.53 / 7.58); Dev 7.94 (highest Dev score among the energy sites).
- **Agency:** Resn.
- **What it is:** a platform that invests in and supports clean-energy companies (Awwwards: "accelerate clean energy innovation").
- **Live check:** on 2026-10-23 the home page **stayed on its loader** in headless Chrome (three tries) and in the Browser pane; the console showed a repeated `TypeError: Cannot read properties of null (reading 'type')` from the site's app bundle while all 7 videos and 129 images had loaded. The story below comes from the DOM and Awwwards.
- **Story (from headings):** H1 about empowering innovators to build the future of energy → a newsletter strip → one chapter per sector (Manufacturing, Electricity, …), each with "Key Technologies", "Perspectives" and a grid of portfolio-company cards (Boston Metal, Brimstone, Electric Hydrogen, Heirloom, Rondo Energy, Antora Energy and others). Awwwards highlights: visual identity, content modal (details open in a modal instead of a new page), scroll animations, mobile layout.
- **Preloader:** flat lime screen (#DFFF5C) with a small white looping knot/flower line mark in the centre.
- **Menu:** "Toggle menu" opens Portfolio, People, Programs, Perspectives (+ legal links).
- **Signature:** sector chapters that each open into a portfolio of companies, with details in modals.
- **Type / colour:** Saans + a second face loaded as "ItemsRegular". Palette #DFFF5C / #FAFBF7.
- **Stack:** Awwwards: GSAP, Vue.js, Locomotive Scroll; Lenis detected. rAF ≈320/s.
- **Lesson for BeeD:** a preloader that waits for every script is a single point of failure. A JS error kept a SOTD-winning site blank. BeeD's loader must have a hard time-out and must never gate the shop.

### E4. Heimdall Power
- **URL:** https://www.heimdallpower.com/ · Awwwards: https://www.awwwards.com/sites/heimdall-power
- **Award:** SOTD 17 Oct 2025. **Jury 7.29** (7.44 / 6.98 / 7.41 / 7.34). No Developer Award.
- **Agency:** Refokus.
- **What it is:** Norwegian maker of power-line sensors ("Neurons") and software that let utilities raise line capacity (dynamic line rating).
- **Scroll story (captured, page 7,031 px):**
  1. Full-bleed video hero (a drone fitting a sensor to a line in a snowy forest), two-word H1 centred, orange outlined CTA; tiny corner labels across the bottom edge.
  2. News list with date chips and a cut-out drone image.
  3. One-sentence manifesto in large type about the grid being a prerequisite for progress.
  4. Four benefit rows (capacity, outages, protection, compliance) next to a wireframe 3D transmission tower.
  5. Customer logo row (European and US grid operators).
  6. "Our tech stack": WebGL spheres (physical sensor, virtual sensor, software) floating on black.
  7. Drone-installation scene.
  8. Sensor chapter: big numbers (40%+ average capacity gain with DLR; one sensor per two miles of line; 10 seconds to install by drone; company claims) beside an orange dotted-circle graphic.
  9. Customer quote in large type with highlighted words.
  10. Dark footer framed in orange, newsletter, sitemap, offices.
- **Preloader:** none (video hero immediately, then a Cookiebot banner).
- **Menu:** a dark floating pill bar, top centre: logo, Solutions, Technology, Resources, About Us, Careers, Log In, orange "Contact".
- **Signature:** product-as-3D-object (glowing spheres) inside an otherwise Swiss, text-led page.
- **Type / colour:** Nimbus Sans (H1 80px bold) + Geist Mono. Palette #FF5C39 / #111113.
- **Stack:** Webflow + three.js + Lenis detected; Awwwards: WebGL, Three.js, Webflow. rAF ≈280/s.

### E5. Caeli Énergie
- **URL:** https://www.caeli-energie.com/ · Awwwards: https://www.awwwards.com/sites/caeli-energie
- **Award:** SOTD 21 Sep 2025 + Developer Award. **Jury 7.21** (7.14 / 7.19 / 7.21 / 7.51); Dev 7.00.
- **Agency:** Beaucoup.
- **What it is:** French start-up making a low-carbon air conditioner (Caeli One) with no outdoor unit.
- **Bilingual:** French default, `hreflang` fr + en, language dropdown in the nav. The only French/English product site in the set.
- **Scroll story (captured):**
  1. Huge uppercase H1 (3 lines, weight 900) with the white wall unit rising from the bottom edge.
  2. The product is pinned while the scene changes behind it: hero → furnished room → giant product wordmark set behind the unit, letters fading out.
  3. Four feature cards (efficiency, no outdoor unit, economical, lower carbon footprint).
  4. Mission statement revealed word by word on deep green (local manufacturing).
  5. Audience tabs (Professionals / Individuals / Local authorities) that swap the image and copy.
  6. Closing scene: the product in a forest clearing with a large "new era" headline.
  7. Deep-green footer with a full-width brand wordmark.
- **Preloader:** deep-green full screen → pale mint with a single point of light that blooms → hero (about 3 s).
- **Menu:** product, "Révolution Caeli" dropdown, **"Simuler mon projet"** (project simulator), FAQ Pro, careers, FR/EN, dark "Nous contacter" button.
- **Signature:** the product as the camera: one pinned object carries the whole story.
- **Micro-interactions:** Awwwards lists on-scroll product presentation, on-scroll title animation, project simulation form, product card.
- **Type / colour:** Altform (one family, weights up to 900). Palette #053725 / #F9F7E7.
- **Stack:** fingerprint: WordPress 7.1.3 + jQuery 3.7.1, GSAP (bundled) with split text, Lenis, Taxi.js page transitions; no canvas (the product scenes are pre-rendered images, made in Blender per Awwwards). First load 7.35 MB, 47 requests (second-lightest of the five measured, after Edifis). rAF ≈126 to 134/s.
- **For BeeD:** proof that a bilingual site with a pinned-product story and a "simulate my project" form wins at SOTD level; a solar-kit configurator could play the same role.

### E6. Heidelberg Materials: CCUS experience
- **URL:** https://ccus.heidelbergmaterials.com/en/ · Awwwards: https://www.awwwards.com/sites/heidelberg-ccus
- **Award:** SOTD 15 Sep 2025 + Developer Award. **Jury 7.65** (7.42 / 7.61 / **8.23 Creativity** / 7.52); Dev 7.35.
- **Agency:** Ashfall Studio.
- **What it is:** an immersive platform explaining how a cement maker captures, uses and stores CO₂ (CCUS). It is both a building-materials and a climate story.
- **Live check:** loaded on 2026-10-23 (second try; the first stayed on the loader for over a minute). It is a click-driven experience, not a scroll page: wheel input did nothing, navigation is by a "Next" button and (per Awwwards) an interactive globe.
- **Story (captured opening + Awwwards):**
  1. **Preloader:** light grey screen; concentric outlines of the brand's rounded "leaf" shape draw in, the logo scales up inside the innermost one.
  2. Deep-green WebGL scene: everyday objects (bottle, light bulb, chain link, ring, flask, globe) drawn as **point clouds** drifting in space.
  3. A white card cut in the same leaf shape: mission text (CCUS = carbon capture, utilisation and storage) and a bright-green pill "Next" button; two icon tabs on top of the card.
  4. Further chapters are reached with "Next"; Awwwards highlights a **360° component**, an **interactive globe** for navigation and a scrolling navigation. Only the first card was recorded here.
- **Menu:** none visible on the first screen; small "Imprint" / "Data protection" links and an audio/settings icon at the bottom right.
- **Signature:** everyday objects rendered as particle clouds + brand-shaped content cards; one shape (the leaf) used for loader, cards and masks.
- **Type / colour:** LexendHM (custom Lexend). Palette #00DD39 / #004E2B.
- **Stack:** Nuxt + three.js detected; Awwwards: WebGL, Nuxt.js, Sanity, 360, 3D. rAF ≈80 to 125/s.
- **For BeeD:** a building-materials company telling a climate story with data and a globe; also a warning that a click-only flow needs a visible way out to the regular site.

### E7. Aramco: The Birth of Oil
- **URL:** https://www.aramco.com/en/about-us/our-history/the-birth-of-oil · Awwwards: https://www.awwwards.com/sites/aramco-the-birth-of-oil
- **Award:** SOTD 27 May 2025 + Developer Award. **Jury 7.30** (7.34 / 6.72 / 7.94 / 7.55); Dev 7.77.
- **Agency:** Immersive Garden.
- **What it is:** an interactive history chapter inside Aramco's corporate site, from the geology that formed the oil to the company's beginnings, ending on "today" and "tomorrow".
- **Bilingual:** the host site has an Arabic switch (العربية) in its top bar.
- **Live check:** loaded on 2026-10-23 (two captures). The intro screen has a "Start" button; clicking it in headless Chrome did not advance the WebGL story (the Browser pane was not allowed to open aramco.com), so chapters below come from the page's headings and Awwwards.
- **Opening (captured):** the corporate shell flashes first, then a grey-green screen with a "Loading" label and a thin glowing horizontal line sweeping across; then the title (three lines: oil, kingdom, company) in white over a slowly moving **textured stone-and-water surface**, with a "Start" button below.
- **Chapters (from headings, in order):** Long ago → plate tectonics ("the perfect combination", "continual shift", "the birth of oceans") → organic material → eternal flames → the search is on ("boom time", "widening the search", "a daunting challenge") → Tuwaiq mountains ("Dahil Heet", "Arab Rock") → **4 March 1938** ("drill a little deeper") → Today → Tomorrow → closing triplet (birth of oil / of a kingdom / of the company). Awwwards elements: "Universes" (content) and navigation.
- **Menu:** inside the story, a minimal top bar with a hamburger; outside it, the Aramco corporate nav (About us, What we do, Sustainability, Investors, News & media, Careers) with the Arabic switch.
- **Signature:** deep-time storytelling: geology → discovery → today, told as a sequence of "universes".
- **Type / colour:** Aramco brand faces Ghawar and Manifa Pro. Palette #AEBEC6 / #365B4E.
- **Stack:** three.js detected; Awwwards: 3D, storytelling, gestures/interaction. rAF ≈100/s.
- **For BeeD:** the chronology pattern (resource → discovery → today → tomorrow) suits a story about Albania's energy mix; the "Start" gate is a usability cost (Usability 6.72, the lowest sub-score in this set).

### E8. Zaptec
- **URL:** https://www.zaptec.com/ · Awwwards: https://www.awwwards.com/sites/zaptec
- **Award:** SOTD 13 Jul 2024 + Developer Award. **Jury 7.29** (7.61 / 7.04 / 7.08 / 7.18); Dev 7.32.
- **Agency:** Good Morning.
- **What it is:** Norwegian EV-charger maker selling through installers and partners in 9 European countries (Awwwards description).
- **Multilingual:** 13 `hreflang` locales (fi, nl, fr, en-gb, de, da, sv-se, nb-no, en, fr-ch, de-ch, fr-be, nl-be); on arrival a modal suggests the local site ("Looks like you're in United Kingdom") with a country/language select. In our capture it stayed open over every frame.
- **Scroll story (captured, page 7,847 px):**
  1. Dark hero with a two-word H1, then a video of a car charging at a house.
  2. Product pair 1 (home chargers) with "suitable for" chips and two product buttons.
  3. Product pair 2 (commercial charger).
  4. **"Explore our chargers"**: a pinned section on sage green with product tabs (three chargers), a tiny animated car icon and four spec tiles (5-year guarantee, 22 kW, always connected, eco mode).
  5. Latest news (three cards incl. an EU AFIR readiness note).
  6. Origin chapter: a mountain-road video with a "product of the Norwegian west coast" line.
  7. Footer with documents and manuals, investor relations, sustainability.
- **Preloader:** none (dark hero text first, video next).
- **Menu:** a classic mega menu: Charging solutions (home: two products; commercial: product + load balancing; app; portal; accessories), For partners & installers, Info hub, Need help?, Company, plus utility links "Find an installer", "Become a partner", search, language, "Get Zaptec".
- **Signature:** a calm, product-led catalogue with one pinned "compare our chargers" chapter.
- **Type / colour:** Söhne. Palette #FFFFFF / #222222 plus sage green for the product chapter.
- **Stack:** Next.js + Swiper detected; SEOmatic generator tag (a Craft CMS plug-in). rAF ≈150/s.
- **For BeeD:** the closest energy-product site to a shop: installer finder + partner programme + product tabs with spec tiles. Its locale modal is the anti-pattern: it blocks the page; a quiet language switch is better.

### E9. The State of the Transition 2023 (Breakthrough Energy)
- **URL:** https://2023.breakthroughenergy.org · Awwwards: https://www.awwwards.com/sites/the-state-of-the-transition-2023
- **Award:** SOTD 28 Nov 2023 + Developer Award. **Jury 7.63** (7.71 / 7.30 / 7.90 / 7.74); Dev 7.37.
- **Agency:** Niccolò Miranda (Awwwards also credits G-NS Studio and Edu Prats).
- **What it is:** Breakthrough Energy's 2023 report on the clean-energy transition. This is the data-report reference in the set.
- **Awwwards elements:** "5 Grand Challenges" (interaction), "Eco-Flow Transition", "Quick Views", "Horizontal Scroll", "Parallax Tab Slider", "WebGL Roots Index" hero, "Next Section" navigation. Palette #DFEBDE / #1A1A1A. Tags: horizontal layout, navigation menu, transitions, content architecture, micro-interactions.
- **Live check:** loaded on 2026-10-23 (third try; the first two failed on network time-outs / stopped at the gate).
- **Story (captured, horizontal; the page itself never scrolls, document height = viewport):**
  1. **Preloader:** dark olive-black screen with the logo, report title and subtitle, and a thin progress line.
  2. **Gate:** a short founder quote set in small uppercase mono, a light "Enter website →" button and a sound note.
  3. Hint screen: "Hold & drag to navigate" with small gesture icons (wheel also advances).
  4. A WebGL field of **flowing blue light filaments** (Awwwards: "Eco-Flow Transition") runs along the bottom of every chapter.
  5. Chapters slide horizontally, each = serif-condensed title + short paragraph + one image card with a slight WebGL warp + an "explore / read more" button: The Grand Challenges → How Breakthrough Energy works → Carbon Management → … (the DOM index starts "01 Index, 02 Bill's Foreword").
  6. A bottom row of **section icons** acts as a quick jump bar with a position counter; Awwwards lists "Quick Views" and a "Parallax Tab Slider" for the deeper data sections, and "5 Grand Challenges" as an interaction.
- **Menu:** top-left logo + "Index ▾" dropdown; top-right **"Download report"** button and a menu toggle; mobile shows a "rotate your device" message.
- **Signature:** a report as a horizontal, draggable journey with a persistent energy-flow visual and a jump bar.
- **Type / colour:** fonts loaded as HK, Plak and Space (a grotesk, a condensed display and a mono). Palette #DFEBDE / #1A1A1A.
- **Stack:** three.js detected (3 canvases). rAF ≈125/s.
- **For BeeD:** the jump bar + index + "download the full report" is the right frame for any data chapter (e.g. "the state of solar in Albania"), with sources attached to each number.

### E10. Enpower Trading
- **URL:** https://enpowertrading.co.za/ · Awwwards: https://www.awwwards.com/sites/enpower-trading
- **Award:** SOTD 7 Nov 2023 + Developer Award. **Jury 7.50** (7.50 / 7.20 / 7.86 / 7.70); Dev 7.12.
- **Agency:** DashDigital.
- **What it is:** a South African energy trader that buys from independent (mostly renewable) power producers and supplies commercial and industrial clients (from the site's hero text and Awwwards' description).
- **Story (captured hero; scroll chapters from the DOM):** a WebGL cloud/smoke field behind a three-line H1 about putting power back in the customer's hands, two short paragraphs, a "Scroll" cue. The 3D scroll did not advance with wheel input in our captures (twice; virtual scroller, document height = viewport). The chapters in the DOM follow the electricity value chain in order: **Solar → Wind → Hydro → Transmission and Distribution → Aggregation → Customer → Future Market**. Awwwards highlights "3D Homepage / Scroll interaction / Progress bar" and "Landing transition".
- **Preloader:** none observed (hero with the cookie bar at 0.3 s).
- **Menu:** compact black pill top-left: logo, **"Energy usage" badge**, "Menu".
- **Signature / micro-interaction:** the **"Energy usage" switch** (Awwwards element "Energy Saving Mode"): a nav badge showing Low (green) or Med (orange). In our capture it changed between Low and Med from frame to frame without input, so it seems to reflect a measured or chosen rendering load.
- **Type / colour:** web fonts did not report as loaded in our capture (computed font fell back to Arial). Palette #FFFDF5 / #010101.
- **Stack:** Next.js + three.js + Lenis detected. rAF ≈290 to 317/s.
- **For BeeD:** the value chain as chapter order (generation → grid → customer) and an "energy-saving mode" switch that turns off heavy visuals; for an energy brand that switch is on-message.

### E11. Prometheus Fuels
- **URL:** https://www.prometheusfuels.com/ (redirects to the apex domain) · Awwwards: https://www.awwwards.com/sites/prometheus-fuels
- **Award:** SOTD 4 May 2021 + Developer Award; the card in Awwwards' Sites of the Year list carries a **"Site Of The Year 2021"** badge (that list shows several 2021 SOTY badges, so which annual category it won is UNVERIFIED). **Jury 8.40** (8.50 / 7.77 / **8.94 Creativity** / 8.79); Dev 7.61. Highest score in this set.
- **Agency:** Active Theory.
- **What it is (Awwwards description):** a stylised interactive WebGL story explaining how the company makes fuel from CO₂ in the air.
- **Awwwards elements:** "Stylized WebGL interactive story", "Updating form". Palette #2779A7 / #D14836 / #FFFFFF. Tags: storytelling, filters and effects, fullscreen, WebGL.
- **Live check (2026-10-23):** the winning build is **gone**. prometheusfuels.com redirects; the site now served is a WordPress 7.1.3 page (Plus Jakarta Sans + Roboto, near-black with red accents) whose hero is a sunset aerial of a solar farm with a "redefining the future of energy" headline, followed by about-us statements, three application cards (data-centre power, transportation, defence), on-grid/off-grid cards, an investor logo row and a contact footer. None of the 2021 WebGL story remains.
- **Story, preloader, menu of the winning version:** UNVERIFIED (not online; only Awwwards' description and elements remain).
- **For BeeD:** even the highest-scored energy site of the period was replaced within a few years by a conventional template with the exact cliché (solar-farm aerial at sunset). Build the signature so the client can keep it: content-managed, light, and tied to the shop rather than a one-off campaign.

---

## 3. Profiles: construction, materials, architecture, real estate

### C1. Belgrade Arbor
- **URL:** https://belgradearbor.rs/en · Awwwards: https://www.awwwards.com/sites/belgrade-arbor
- **Award:** SOTD 17 Oct 2026 + Developer Award (the newest winner in this set). **Jury 7.22** (7.38 / 6.84 / 7.38 / 7.41); Dev 7.33.
- **Agency:** Square43 Studio.
- **What it is:** a residential, office and retail complex in New Belgrade. It is the only Balkan Site of the Day found in this research (the only other Balkan entry, Dager Engineering of Bulgaria, has an Honorable Mention), and it is bilingual.
- **Bilingual:** `hreflang` en + sr + x-default.
- **Scroll story (captured, 16 frames, page 20,123 px):**
  1. **Preloader:** cream screen, gold tree-canopy logo, a percentage counter (0% → 53% at 1.5 s) on a hairline progress bar; then two vertical hairlines open like a curtain onto the hero.
  2. Hero: façade render (the façade is shaped like tree branches) with the project name in a giant serif across the bottom.
  3. Forest-green chapter: identity statement in serif beside **images cut into angular, canopy-like polygon masks**, with an "Explore in 3D" link.
  4. Second statement (an urban ecosystem), more polygon images.
  5. Large serif headline about a new chapter in prestige living, word-by-word reveal; CTA to the apartments.
  6. Location: a curtain/window video with "LOCATION" in giant gold serif.
  7. What's around: a large serif list of nearby places (Railway Station, Savremena Elementary School, West 65, Airport City, Hangar Food Market, Airport Nikola Tesla) next to an **isometric line map** with pins. The active place turns italic with a marker bar, its pin turns dark with a photo thumbnail, and a car icon shows the drive time (9 min for the airport).
  8. Residences: unit types (studio to four-bedroom) as a large serif list with a hover image, closing on an availability line ("80 units available", developer's figure) and a "Submit a request" button.
  9. Offices and retail: giant serif chapter title over a fabric close-up; wings A/B/V + retail as a list (e.g. 11 retail and hospitality units, developer's figure).
  10. Lifestyle chapter, amenities, aerial view.
- **Menu:** a floating dark pill, top centre: "MENU" · logo · "INQUIRE". Full-screen menu: Home, 3D Experience, Residences, Business, Retail Spaces, Location, Amenities, Contact, About the investor.
- **Signature:** brand-derived image masks (the canopy façade turned into crop shapes) plus a "what's around" map.
- **Type / colour:** Editorial Old (serif display, H1 ≈151px) + Work Sans. Palette #F4F0DB / #2E3A26 (cream / forest green), gold accents.
- **Stack:** fingerprint: Next.js (app router) + React, GSAP (bundled) + ScrollTrigger, Lenis, three.js r184, Keen Slider, Tailwind; Awwwards: Next.js, GSAP, Three.js. rAF ≈187 to 256/s.
- **For BeeD:** a regional reference (Serbian market, en/sr) showing that a Balkan client can carry a SOTD-level bilingual site; the "what's around" map translates to "sellers and installers near you".

### C2. ERA Residence
- **URL:** https://www.era-residence.com/ · Awwwards: https://www.awwwards.com/sites/era-residence
- **Award:** **Site of the Month, August 2026**; SOTD 31 Aug 2026 + Developer Award. **Jury 7.61** (7.81 / 7.30 / 7.73 / 7.53); Dev 7.31.
- **Agency:** The First The Last (Awwwards credits Maksym Stepenko, Ivan Chopei).
- **What it is:** a gated community of 25 residences between Marbella and Estepona (developer's description).
- **Scroll story (captured, 16 frames, page 21,670 px):**
  1. **Preloader:** plum full screen, then the logotype (condensed serif + script) with small "Costa / del Sol" side labels and a hairline below.
  2. Hero: the logotype splits and blurs away over an aerial render; a "place to return to" line with day/night words (Awwwards: "Day Night Theme" hero).
  3. Pool-side render with **circular hotspots** on the image.
  4. A pale-blue **semicircle rises from the bottom** carrying "three reasons" set on an arc.
  5. "Real-life location": a small image that expands; architecture render with a pull quote.
  6. Concept chapter: a large statement (only 25 residences) framed by cut-out bougainvillea.
  7. "New Golden Mile": huge condensed serif with an image window.
  8. **Coastline line-map:** a hand-drawn route across the coast with towns and distances (Gibraltar, Estepona, Puerto Banús, Marbella, Málaga airport).
  9. Aerial of the area; floor plans by level with sizes (e.g. 178 to 202 m²), then unit types (ground floor + basement, penthouse duplex), amenities, architecture, sea views, sales office, "book a call".
- **Menu:** no hamburger on desktop: a rotating circular wordmark badge top-left; top-right text links "Select an apartment" (large), "Book a call", "Contact"; a vertical scroll-progress line with a counter on the left edge.
- **Signature:** editorial luxury typography (condensed serif + script) and the drawn coastline with distances.
- **Type / colour:** Ambroise François (display serif, H1 ≈173px) + Sloop Script + Maison Neue Extended. Palette #B5CEDB / #F8BBCB (sky blue / bougainvillea pink), plum loader.
- **Stack:** GSAP 3.15 + ScrollTrigger + Lenis + Barba + Webflow + Lottie detected; Awwwards: GSAP, Webflow. rAF ≈131/s.

### C3. Marvell Tile & Stone
- **URL:** https://www.marvellco.com.au/ · Awwwards: https://www.awwwards.com/sites/marvell-tile-stone
- **Award:** SOTD 7 May 2026 + Developer Award. **Jury 7.26** (7.31 / 7.25 / 7.10 / 7.42); Dev 7.13.
- **Agency:** Humaan.
- **What it is:** a Perth tiling and natural-stone company (its page title calls them artisans). It is the closest "materials trade" business in the set.
- **Story (captured):**
  1. **Preloader:** near-black screen with a faint grid; a two-line phrase about traditional craftsmanship **swaps line by line** into the company name.
  2. The background turns warm white; the name stays centred in white.
  3. Home is **one screen with an endless drifting field of project photos** (kitchens, bathrooms, façades) at different depths; scrolling moves the field, not the page (document height = viewport).
- **Menu:** a tiny dark pill top centre: logo · Projects · Profile · Contact.
- **Signature:** a home page that is a browsable gallery, not a stack of sections.
- **Note:** the white name over pale photos has weak contrast.
- **Type / colour:** Neue Montreal (H1 256px bold). Palette #E8E5DF / #35311F.
- **Stack:** Next.js detected; Awwwards: React, Next.js. rAF ≈61/s (one loop).

### C4. Fluid Glass
- **URL:** https://fluid.glass/ · Awwwards: https://www.awwwards.com/sites/fluid-glass
- **Award:** SOTD 30 Mar 2026 + Developer Award + Business & Services Honors (Mar 2026). **Jury 7.77** (7.96 / 7.60 / 7.63 / 7.88); **Dev 8.00** (the highest Developer score in the whole set).
- **Agency:** Exo Ape.
- **What it is:** UK maker and installer of bespoke architectural and structural glazing (sliding doors, steel-look windows, extensions, rooflights).
- **Scroll story (captured on a virtual scroller, 15 frames):**
  1. **Preloader:** off-white screen with a small spinning mark → dark screen with a centred one-line promise → **mask wipe** opens onto a glass-extension photo.
  2. About statement in large type.
  3. Product collection: four categories (doors, windows, additional, structural) as images floating in a field with labels; "product overview" button.
  4. Showroom chapter (video, address).
  5. Featured projects as a **table**: project name + glazing-system tags per row, hover shows the photo.
  6. Client stories: Google reviews with star ratings in cards.
  7. Approach chapter (every build begins with understanding).
  8. Footer: a full-bleed photo of a glass house in a forest, a dark card with the sitemap and contacts, the brand wordmark across the bottom.
- **Menu:** a **floating pill docked at the bottom centre** (logo · Home · ☰) and a "Get a quote" link top right; the menu opens as a dark card.
- **Signature:** product categories as a spatial field + projects as a spec table; the mask-wipe transition (Awwwards elements: Product Detail Page, Process Component, Showroom, Menu, Mask wipe transition on scroll, Intro Animation).
- **Type / colour:** Aeonik Pro + Aeonik Mono. Palette #212325 / #0B1012 on warm off-white.
- **Stack:** Nuxt + Lenis detected; Awwwards: GSAP, Nuxt.js, Vercel. rAF ≈190/s.
- **For BeeD:** the best model for a building-products PDP and project gallery: technical tags in mono type, real reviews, a quote CTA always visible.

### C5. Jonite
- **URL:** https://www.jonite.com/ · Awwwards: https://www.awwwards.com/sites/jonite
- **Award:** SOTD 11 Oct 2025 + Developer Award. **Jury 7.19** (7.26 / 6.97 / 7.17 / 7.57); Dev 7.52.
- **Agency:** Series Eight.
- **What it is:** a Singapore manufacturer (since 1994) of engineered-stone gratings, drain covers and breeze blocks, **with an online shop**.
- **Scroll story (captured, 16 frames, page 15,240 px; the WebGL hero did not render headless):**
  1. Hero: a WebGL canvas (blank in headless) under an H1 about decorative stone grating, then client logos.
  2. "Made to matter": giant type assembling word by word.
  3. Shop teaser: design your feature wall, now orderable online.
  4. Awards, why Jonite.
  5. **Product categories** as a four-up grid (trench, pool, tree and bathroom gratings), then a second row (floor drains, sump covers, breeze blocks) with **"Buy online" tags** on shoppable lines.
  6. Colours: a façade photo + swatches of natural-aggregate finishes.
  7. **Wall visualiser:** "design your wall, see it before it's built", a configurator preview of a breeze-block pattern with steps listed.
  8. **Samples:** order a sample box (three stone swatches).
  9. Custom solutions (colours, shapes, branding), case studies by sector, insights (articles).
- **Menu:** top bar: Products ▾, Specs, Case Studies, About ▾, Contact, Shop; a thin announcement bar above. **Fixed bottom bar:** Request samples · Contact us · Chat on WhatsApp.
- **Product page (fingerprint run, Tessera Collection):** a "back to breeze blocks" mono breadcrumb, a giant collection title, two buttons side by side (**"Request a quote"** outlined, **"Shop now"** filled), then a **four-column spec strip** with mono labels: Compliance (fire rating), Suitable for (indoor/outdoor), Materials (aggregate and recycled-content percentages), Formats (variants, colours, custom). The script found no visible price and 3 add-to-cart controls on that page; JSON-LD `ProductGroup` + `BreadcrumbList`.
- **Signature:** a manufacturer site that is also a shop: specs, samples, visualiser and checkout in one flow. Awwwards elements include product categories, category page, **technical specifications**, custom solutions, collections, case studies.
- **Type / colour:** PP Neue Montreal + Silka Mono. Palette #0E0E0E / #E6E7E8, khaki-olive sections.
- **Stack:** fingerprint: **Shopify + Craft CMS**, Alpine.js, GSAP 3.13 + ScrollTrigger + Lenis + Barba.js + Swiper, Tailwind; Awwwards also lists Figma. rAF ≈320/s.
- **For BeeD:** the nearest thing in the set to BeeD's product side: category → spec sheet → sample/quote → buy online, with a WhatsApp bar.

### C6. Composites.archi
- **URL:** https://www.composites.archi · Awwwards: https://www.awwwards.com/sites/composites-archi
- **Award:** SOTD 8 Apr 2025 + Developer Award + Business & Services Honors (Mar 2025). **Jury 7.60** (7.73 / 7.06 / **8.08 Creativity** / 7.77); Dev 7.73.
- **Agency:** Sparkk.
- **What it is:** a site by JEC that promotes composite materials in construction to architects and industry.
- **Awwwards elements:** "Make it a paradox" hero, "Feather fall" animation, "Feather transition", "Cases" (products), transitions. Palette #F18010. Tags: architecture, art and illustration, technology, scrolling, storytelling, 3D.
- **Scroll story (captured on the second try, 15 frames; page 82,862 px, the longest in the set):**
  1. **Preloader:** warm-grey screen, a small two-line title (the power of composites) low in the centre over a counter, and a "Skip" button (clicked by the recorder).
  2. Dark hero: a huge two-line grey headline about making it a paradox, with fine white fibre lines flowing across.
  3. The camera flies over and around a **black ribbed 3D shell structure** (a composite pavilion) standing on a white grid floor; chapter text "[01]" in two tones (grey + white): architecture inspired by nature, ambitious and innovative.
  4. "Paving the way to new possibilities": the headline splits across the screen while the structure turns.
  5. **"Feather fall":** a white feather drops through a cloud of grey feathers (lightness as the metaphor), leading to the chapter on the fusion of properties.
  6. Later chapters (from headings): protection and beauty in performance; construction vs renovation; from fragility to strength; why choose composites; and a **Standards library**: a long list of building codes and fire/test standards (ASTM E-84, NFPA 285, International Building Code, Eurocode for fibre-polymer structures, national codes of Canada, India, Australia, South Africa…).
- **Menu / chrome:** top centre the **current chapter name with a thin progress bar** ("Introduction") and a grid-dots menu icon; top right a "Why composites" shortcut; bottom centre "Skip" (skip the story), bottom right "Sound on".
- **Signature:** a material explained through one object (the shell) and one metaphor (the feather), then backed by a hard technical library of standards.
- **Type / colour:** Tasa Orbiter (H1 ≈72px, weight 600). Palette #F18010 (Awwwards), observed mostly black / warm grey / white.
- **Stack:** Nuxt + three.js + Lenis detected. rAF ≈107/s.
- **For BeeD:** "emotion first, then the standards" is the right order for building products; the standards list maps to certificates per product (CE, EN norms) in BeeD's spec templates.

### C7. Sculpting Harmony (Getty)
- **URL:** https://gehry.getty.edu/ · Awwwards: https://www.awwwards.com/sites/sculpting-harmony
- **Award:** **Site of the Month, November 2023**; SOTD 17 Nov 2023 + Developer Award. **Jury 7.89** (7.97 / 7.52 / **8.19 Creativity** / 8.04); Dev 7.78. Highest-scored architecture site in this set.
- **Agency:** Resn, for Getty.
- **What it is:** an online exhibition on how Frank Gehry's team designed the Walt Disney Concert Hall, from Getty's archive.
- **Scroll story (captured, page 49,491 px):**
  1. **Preloader:** orange full screen, "Getty presents", a loading percentage at the right edge, a Gehry-style sketch line drawing itself, and a note recommending sound on (narration + LA Phil music).
  2. Title: an ultra-heavy, very wide display face filling the screen with sketch scribbles drawn over it.
  3. Prologue on black: **one short serif sentence per screen**, placed at different positions, read like narration.
  4. Chapter cards: Chapter I on green with the chapter title broken across the screen and a sketch behind it. Chapters: Introduction → I Ship in the Box → II Sails of Steel → III Bouquet of Sound → Conclusion → Highlights → Index.
  5. Each chapter ends with an interstitial ("you're leaving the Chapter I interactive story, scroll up or click to resume").
  6. Archive objects open as **metadata cards: Title, Creator, Date, Medium, Dimensions, Accession No., Copyright**.
- **Menu:** text "[ MENU ]" in brackets and a "SOUND ● ON" toggle top right.
- **Signature:** sound-on narrated chapters, sketch-drawing overlays and an index of archive objects.
- **Type / colour:** Reckless (serif) + Roboto Mono + a heavy wide display face. Palette #FEA341 / #16A147 (orange / green) on black.
- **Stack:** Nuxt + three.js + ScrollTrigger + Lenis detected. **rAF ≈840/s**, the heaviest loop count measured (many loops at once).
- **For BeeD:** the archive "metadata card" is a product spec sheet in disguise, and the chapter/index structure suits a long story with a direct jump into the shop.

### C8. Edifis
- **URL:** https://edifis.ca/en/ · Awwwards: https://www.awwwards.com/sites/edifis
- **Award:** SOTD 1 May 2023 + Developer Award. **Jury 7.85** (**8.14 Design** / 7.45 / 7.96 / 7.70); Dev 7.91. The best Design sub-score among the construction sites (only Prometheus Fuels, 8.50, is higher overall).
- **Agency:** Tux Creative House.
- **What it is:** an industrial real-estate developer near Montréal (industrial space for rent, mixed-use).
- **Bilingual:** `hreflang` en, en-ca, fr, fr-ca; "Français" link in the footer.
- **Scroll story (captured, 13 frames, page 11,376 px):**
  1. **Preloader:** navy screen; the logo is built from blocky stencil letter parts, then the hero.
  2. Hero: an interactive WebGL block-building visual, tagline top right, a **featured-space card** (building code, occupancy status, town) and a small sitemap.
  3. Manifesto, then a slider of spaces, each card with an **occupancy chip** ("occupied until 2033", "occupied until 2026").
  4. "How we work" chapter.
  5. A three-word line split across a video (push / ideas / forward).
  6. A huge three-word headline about innovation.
  7. **Sticky stat stack:** 1M ft², 5 buildings (units from 20,000 to 200,000 ft²), 10 corporate tenants; each stat row pairs with an image that grows as it reaches the top (developer's figures).
  8. Tenant logo grid, testimonial, CTA "find space…", giant wordmark footer.
- **Menu:** hamburger top right opening a **3D interactive full-screen menu** (Awwwards element); fullscreen page transitions; button micro-interactions.
- **Signature:** sticky stat stack with paired images; the 3D menu.
- **Type / colour:** Neue Haas Grotesk Display + Akkurat Mono. Palette #1B2C50 / #C7CBCB (navy / concrete grey).
- **Stack:** fingerprint: Nuxt (Vue) + Prismic, GSAP (bundled) + ScrollTrigger, three.js r146, Swiper; 3.57 MB first load, the lightest measured. rAF ≈67/s (close to a single loop).
- **For BeeD:** a bilingual (EN/FR) construction-sector winner; its stat stack is the right way to show marketplace numbers once they are real.

### C9. Decor Systems
- **URL:** https://decorsystems.com.au/ · Awwwards: https://www.awwwards.com/sites/decor-systems
- **Award:** SOTD 17 Feb 2022. **Jury 7.64** (7.79 / 7.59 / 7.26 / **7.98 Content**). No Developer Award.
- **Agency:** NIGHTJAR.
- **What it is:** Australian maker of architectural acoustic panels and slats. Awwwards describes "e-Comm powered sampling", interactive 3D models and product pages for architects.
- **Scroll story (captured):**
  1. **Preloader:** a dark panel slides up; the headline rises line by line through a mask.
  2. Hero headline (architectural acoustic solutions) with a short promise and a 99-year guarantee badge (the site's claim).
  3. Product video (a vent product with a big number).
  4. Selected works: a horizontal rail of projects, each with project / location / architect / product meta.
  5. "Specialist advice at speed": call and email chips.
  6. Acoustic products: product cards; product rows with spec chips.
  7. "Inspiration lives here": journal cards.
  8. Footer: newsletter, sectors, Awwwards badge.
- **Menu:** top bar Projects · Products · Resources · About · Contact · **SAMPLES 0** (a sample basket counter). The full menu shows **counts next to sections: Projects 51, Products 51, Resources 87**. Utility actions: **Request a quote**, **Group Fire Rating Calculator**. Fixed bottom bar: Chat online · Request a quote.
- **Signature:** a building-products catalogue with a free-sample basket, live counts in the menu and a technical calculator.
- **Type / colour:** Neue Haas Grotesk Text + Display + ABC Monument Grotesk Mono. Palette #987654 / #49C5B6, olive headings on white.
- **Stack:** Gatsby 5.9.1 (generator tag); Awwwards: GSAP, React, Vercel, Sanity, Cinema 4D. rAF ≈207/s.
- **For BeeD:** sample basket = compare tray; menu counts = live catalogue size; calculator = sizing tool. All three transfer directly.

---

## 4. Longlist: other winners found (not profiled)

Scores from each site's Awwwards page (2026-10-23); HM pages show no jury score. "Live" was not checked for every row unless noted.

**Energy and climate**

| Site | Award (date) | Score | Agency | Why it matters / note |
|---|---|---|---|---|
| ZettaJoule (advanced nuclear) | SOTD 30 May 2026 + Dev | 7.25 | Zypsy | Elements: 3D reactor schematics, "Joules energy 3D". https://www.awwwards.com/sites/zettajoule |
| OceanX 2025 (ocean science year in review) | SOTD 23 Feb 2026 | 7.44 | Unseen Studio | WebGL timeline of a year; data-story reference. https://www.awwwards.com/sites/oceanx-2025 |
| Base Power: Base Core (home battery) | HM 7 Sep 2026 | none | Base Power Company | Astro + React product story. https://www.awwwards.com/sites/base-power-company-base-core |
| Hut 8 (energy + data-centre infrastructure) | SOTD 28 Oct 2025 + Dev | 7.63 | Studio 28K | Elements: location map, WebGL universe, platform scroll. https://www.awwwards.com/sites/hut-8 |
| Vista Energy (oil and gas, Argentina) | HM 16 Nov 2025 | none | /nk.studio | Elements: location map, chart. https://www.awwwards.com/sites/vista-energy |
| ITP Renewables | HM 29 Aug 2025 | none | ED. | https://www.awwwards.com/sites/itp-renewables |
| Groupe Solar | HM 12 Mar 2025 | none | Monument | https://www.awwwards.com/sites/groupe-solar |
| Climate TRACE (emissions monitoring) | HM 11 Mar 2024 | none | Ode Partners | Data visualisation tag. https://www.awwwards.com/sites/climate-trace |
| Energy Park (EV charging, UK) | SOTD 7 Dec 2023 + Dev | 7.58 | Outpost | **Not reachable on 2026-10-23** (connection time-outs; HTTP 503 via a second fetcher). https://www.awwwards.com/sites/energy-park |
| GenCell (fuel cells) | SOTD 16 Dec 2023 + Dev | 7.30 | REJOUICE | Listed URL is a pre-production host. https://www.awwwards.com/sites/gencell |
| Dolphyn Hydrogen | HM 11 Sep 2023 | none | HLabs | Element: bespoke diagram and icons. https://www.awwwards.com/sites/dolphyn-hydrogen |
| Moxion Power (mobile batteries) | SOTD 19 Sep 2023 + Dev | 7.60 | REJOUICE | Company shut down in 2024 (TechCrunch, 2025-09-26); site gone. |
| Austrian Power Grid (TSO) | HM 3 Feb 2023 | none | Achtzehn Grad | Utility institution site. https://www.awwwards.com/sites/austrian-power-grid |
| Air Company (CO₂-to-products, with shop) | SOTD 3 Feb 2023 + Dev | 7.36 | MOUTHWASH | Climate company that sells products online. https://www.awwwards.com/sites/air-company-1 |
| treebytree (reforestation) | SOTD 30 Nov 2023 + Dev | 7.42 | Lama Lama | https://www.awwwards.com/sites/treebytree |
| Vaayu (carbon software) | SOTD 5 Mar 2022 + Dev | 7.34 | Samuel Day | Side-scrolling "how it works". https://www.awwwards.com/sites/vaayu |
| Tion Renewables | HM 28 Nov 2022 | none | Fable&Co | Element: "Key Operating Figures" (stats). https://www.awwwards.com/sites/tion-renewables |
| EDF Electric Days | HM 17 Aug 2021 | none | Merci Michel | https://www.awwwards.com/sites/edf-electric-days |

**Construction, materials, architecture, real estate**

| Site | Award (date) | Score | Agency | Why it matters / note |
|---|---|---|---|---|
| CoMinVi (mining, Mexico) | SOTD 30 Sep 2026 + Dev | 7.44 | HOLOGRAPHIK | Elements: map, data visualisation, intro loader. https://www.awwwards.com/sites/cominvi |
| Sobha Privy Collection (Dubai real estate) | SOTD 23 Sep 2026 + Dev | 7.37 | Vide Infra | Product selector, 3D WebGL map. Vide Infra has many real-estate SOTDs (ERA estate, Springs, Silver Pinewood, Likova, Air, Ever). |
| Hubtown (developer, Mumbai) | SOTD 10 Jun 2026 + Dev | 7.66 | Unseen Studio | Map navigation, zoom transition. **hubtown.co.in timed out from here on 2026-10-23.** |
| Haven Constructions | HM 10 Jun 2026 | none | Dobre Agency | Builder; website load, page transition, footer reveal. |
| GKC Architecture & Design | SOTD 6 Nov 2025 + Dev | 7.29 | Locomotive | https://www.awwwards.com/sites/gkc-architecture-design |
| ICG Galleries (Iris Ceramica Group showrooms) | SOTD 30 Apr 2025 + Dev | 7.51 | Adoratorio Studio | Isometric 3D showroom navigation with pins. |
| Ariostea (porcelain surfaces) | SOTD 8 Mar 2025 + Dev | 7.25 | Adoratorio Studio | Products, collections, WebGL home. |
| Aker (residential investor) | SOTD 19 Nov 2024 | 7.25 | Oimachi | |
| Populous (stadium architects) | SOTD 20 Sep 2024 + Dev | 7.26 | Locomotive | 3D globe of projects, menu and filters. |
| Lyon Béton (concrete objects, WooCommerce shop) | SOTD 8 May 2024 + Dev | 7.37 | Rémi Clauss | Cart, configurator, pro-corner login. |
| Mighty Buildings (3D-printed homes) | HM 9 May 2024 | none | Baunfire | |
| Kōzōwood (timber housing) | SOTD 5 Feb 2024 + Dev + Honors Jan 2024 | 7.52 | Bürocratik | |
| Autex Acoustics (acoustic panels) | SOTD 25 Sep 2023 + Dev | 7.48 | Obys | Live site in Oct 2026 runs on WordPress with a region modal (NZ/AU/US/UK/IE) that blocked scrolling in our capture; may not be the 2023 build. |
| Modelec (electrical fittings maker) | SOTD 25 Aug 2023 + Dev | 7.34 | Rezo Zero | WebGL product configurator. |
| Units: Future Living (modular units) | SOTD 7 Oct 2023 | 7.27 | Radiance | |
| Dager Engineering (Bulgaria) | HM 11 Aug 2023 | none | StanVision | Balkan engineering/real-estate firm. |
| Engineered Floors | SOTD 28 Feb 2022 + Dev | 7.55 | Oui Will | Listed URL is a pre-production host. |
| UNION© (construction contractor, Québec) | SOTD 18 Sep 2021 + Dev | 7.37 | Frédéric Marchand | Image reveal on hover. |
| Persepolis Reimagined (Getty) | SOTY 2022 badge | not read | Monks | Architecture storytelling. |

---

## 5. Synthesis

### 5.1 What energy and construction winners always do: the clichés to refuse

Counted across the 20 profiles (live captures, 2026-10-23):

- **Full-bleed asset beauty shot or video as the hero** (data hall, drone on a power line, EV at a house, glass extension, building render, wall unit in a room): **10 of the 18** winning builds we could see (NRG, ON Energy, Heimdall, Caeli, Zaptec, Belgrade Arbor, ERA, Marvell, Fluid Glass, Jonite). The other 8 open on type or an abstract scene (Heidelberg, Aramco, State of the Transition, Enpower, Composites.archi, Sculpting Harmony, Edifis, Decor Systems). The jury noticed: the asset-hero group averages **7.36 Creativity / 7.36 overall**, the type-or-abstract group **7.93 Creativity / 7.63 overall**; the seven highest Creativity sub-scores (excluding the offline Prometheus build) all belong to the second group. Small sample and our own classification, but the direction is clear: the asset beauty shot is the category default and it does not score.
- **Grand two-to-four-word abstractions in giant type** (power, passion, revolution, era, harmony): most of the sites. Energy copy leans on "power" wordplay (Enpower, Heimdall, NRG, ON). Refuse the pun.
- **Green means sustainable, yellow/lime means energy:** green-led palettes at Caeli (#053725), Belgrade Arbor (#2E3A26), Heidelberg (#00DD39 / #004E2B); yellow/lime/orange accents at ON (#FFF313), NRG (#FFC20E), Breakthrough (#DFFF5C), Heimdall (#FF5C39). Albanian buyers will see the same green and lime on every solar installer's site.
- **Nature as alibi:** forest or mountain scenes closing the story (Caeli, Heimdall, Zaptec, Fluid Glass footer).
- **The three-number stat row** (GW, %, ft², tenants, projects): ON, Heimdall, Edifis, Belgrade Arbor. Fine when numbers are real; a cliché when they are vanity.
- **Customer logos and one big testimonial:** Heimdall (logos + quote), ON Energy (customer quote), Edifis (tenant logos + quote), Fluid Glass (Google reviews).
- **Giant wordmark footer:** Caeli, Edifis, Fluid Glass.
- **3D object floating on black** (ON, Heimdall): the "serious tech" look of 2025-26.

None of the winning builds we captured used the sector's stock clichés, and BeeD should not either: blue-sky solar-panel close-ups, wind turbines at sunset, green leaves or leaf-plug icons, hard hats and handshakes, a globe held in hands, light bulbs with plants inside. The winners used renders of their own product, archive material or their real sites instead. The only solar-farm-at-sunset hero we met was on the template that replaced Prometheus Fuels' winning build.

### 5.2 Techniques worth borrowing (18)

| # | Technique | Seen at | Why it fits BeeD (Albanian construction + energy marketplace) |
|---|---|---|---|
| 1 | **One product → many** (scroll multiplies a single unit into a fleet) | ON Energy (E2) | Visualises price comparison: one product card fans out into the seller offers behind it, each with its price. The marketplace idea told in one motion. |
| 2 | **Product as the camera** (one pinned object, scenes change around it) | Caeli Énergie (E5), ON Energy | Pin one product (e.g. an inverter or a panel spec card) while chapters move from roof → house → grid; it keeps the story about products, not mood. |
| 3 | **Project phases with node checklists** | NRG (E1) | Construction and solar projects run in phases; each phase lists what to buy (structure → envelope → MEP → PV + storage) and links to the categories. |
| 4 | **Sample/compare basket counter in the nav** ("SAMPLES 0") | Decor Systems (C9), Jonite (C5) | Becomes "Krahaso (n)" next to "Shporta (n)": the compare tray is part of the main nav, not hidden on product pages. |
| 5 | **Live counts in the menu** (Projects 51, Products 51, Resources 87) | Decor Systems (C9) | Category menu shows real product and seller counts from the database: honest, and it updates itself as the marketplace grows. |
| 6 | **Spec sheet as a designed object** (metadata cards, mono type, tag rows) | Sculpting Harmony (C7), Fluid Glass (C4), Jonite (C5) | BeeD's admin defines spec templates per category; render them as a tidy mono-type sheet (power W, efficiency %, dimensions, warranty, standard) that also drives filters and comparison. |
| 7 | **Configurator / visualiser** | Jonite wall visualiser (C5), Caeli "simulate my project" (E5); Modelec WebGL configurator (longlist) | A solar sizing tool (monthly kWh → kWp → panels, inverter, battery from real listings) or an area calculator (m² → boxes of tiles, bags of adhesive). Only with transparent formulas and cited irradiation data. |
| 8 | **Technical calculator in the utility nav** | Decor Systems "Group Fire Rating Calculator" (C9) | "Llogaritës" for installers: cable cross-section, panel string size, tile quantity. Tools bring trade users back. |
| 9 | **Sticky stat stack paired with images** | Edifis (C8) | Marketplace figures (sellers, products, regions served) as sticky rows, each with a real photo. Only after launch, from the database, never invented. |
| 10 | **Availability chips on cards** ("occupied until 2033", "80 units available") | Edifis (C8), Belgrade Arbor (C1) | Stock and lead time per seller offer ("Në gjendje", "Me porosi: 5-7 ditë") on cards and in the comparison table. |
| 11 | **"What's around" map with travel times** | Belgrade Arbor (C1), ERA coastline route (C2) | Sellers, warehouses and installers on a map of Albania with delivery times by city (Tirana, Durrës, Shkodër, Vlorë, Korçë…). |
| 12 | **Word-swap preloader** (a phrase swaps into the brand name) | Marvell (C3); percentage + curtain at Belgrade Arbor (C1) | A bilingual swap is natural: "Ndërtim" ↔ "Construction", "Energji" ↔ "Energy" → "BeeD Energy". Under 1.5 s, once per session, with a hard time-out (see the Breakthrough lesson). |
| 13 | **Energy-saving mode switch** | Enpower Trading (E10) | A "Modaliteti i kursimit" toggle that turns off WebGL/video: on-message for an energy brand, kind to mobile data in Albania and to `prefers-reduced-motion`. |
| 14 | **Bottom-docked pill navigation** | Fluid Glass (C4); floating top pills at Heimdall (E4) and Belgrade Arbor (C1) | On phones: a bottom dock (Kërko · Kategori · Krahaso · Shporta) within thumb reach; the shop must be usable one-handed. |
| 15 | **Fixed action bar: samples / quote / WhatsApp** | Jonite (C5), Decor Systems (C9) | On product pages: "Kërko ofertë" (RFQ), "Pyet shitësin" (message the seller), and a chat link, which matches the brief's "direct communication between parties". |
| 16 | **Chapters with an index and a resume interstitial** | Sculpting Harmony (C7) | The story home page gets a chapter index and a permanent "go to shop" exit, so buyers are never trapped in the story. |
| 17 | **Brand-derived image masks** | Belgrade Arbor canopy polygons (C1) | Derive crop shapes from BeeD's own mark (if the brand uses a bee/hexagon, the hex cell becomes the image mask and the product-grid cell): one idea used at every scale. |
| 18 | **Quiet language switch with hreflang** | Belgrade Arbor en/sr, Edifis en/fr, Caeli fr/en, Aramco en/ar | sq/en as a two-letter switch in the nav and full `hreflang` pairs. Avoid Zaptec's/Autex's blocking locale modal. |

### 5.3 Scroll-storytelling patterns for data-heavy stories

1. **Value-chain chapter order.** Enpower orders its chapters Solar → Wind → Hydro → Transmission → Aggregation → Customer → Future market; Aramco orders by deep time (geology → the search → a dated chapter, 4 March 1938 → today → tomorrow). For BeeD: Sun/resource → Product → Seller → Installer → Home/Business → Grid, one chapter each, so each one ends on its shop category.
2. **Pinned number, moving context.** ON Energy pins big numbers with superscript units (GW, %) in cards; Heimdall pairs each number with a one-line label and a single graphic. Numbers count up once, then stay still; units small and raised; the source in a footnote line under the card.
3. **Sticky stat stack.** Edifis: each stat is its own sticky row; the paired image grows as the row reaches the top. Good for 3 to 5 numbers.
4. **Phase timeline with nodes.** NRG: a five-phase process where each phase expands into a checklist of 10+ items; the menu doubles as the progress list. Works for "how to build/renovate with BeeD" and for order tracking later.
5. **Horizontal chapters inside a vertical page.** The State of the Transition (horizontal scroll, parallax tab slider, "5 Grand Challenges", quick views) and OceanX (WebGL timeline). Use for comparisons that read left to right (offers by price, product generations).
6. **Maps that zoom from country to street.** Hubtown (map navigation, zoom transition), Heidelberg (interactive globe), CoMinVi and Hut 8 (location maps), Belgrade Arbor (isometric what's-around), ERA (drawn coastline with distances). For BeeD: Albania → city → seller/installer, with delivery times.
7. **Diagrams instead of photos for how things work.** Heimdall's wireframe tower, ZettaJoule's 3D reactor schematics, Dolphyn's bespoke diagrams, ON's "power quality" and "grid volatility" illustrations. A line diagram of a PV system (panel → inverter → battery → meter) explains more than a stock rooftop.
8. **Quick views instead of page jumps.** Breakthrough's content modal and The State of the Transition's quick views keep the reader in the scroll; for BeeD, product quick-view and compare drawer open over the story.
9. **One sentence per screen before the numbers.** Sculpting Harmony's prologue paces context in short lines; use for the 3 or 4 sentences that frame Albania's energy situation (with cited sources) before any chart.
10. **Progress and chapter index always visible.** ERA's vertical progress line with a counter, Enpower's progress bar, Gehry's chapter index and resume interstitials.

### 5.4 Stack observations (for the build)

- **Lenis** smooth scrolling was detected on **12 of the 19** winning builds still online (NRG, ON Energy, Breakthrough, Heimdall, Caeli, Enpower, Belgrade Arbor, ERA, Fluid Glass, Jonite, Composites.archi, Sculpting Harmony; detection = Lenis's `html.lenis` class or a global). **GSAP** is named by Awwwards or detected on 9 (Breakthrough, Caeli, Belgrade Arbor, ERA 3.15, Fluid Glass, Jonite 3.13, Sculpting Harmony via ScrollTrigger, and bundled in ON Energy and Edifis per the fingerprint runs).
- **Frameworks:** Nuxt 6 (ON Energy, Fluid Glass, Edifis, Sculpting Harmony, Heidelberg, Composites.archi), Next.js 4 (Belgrade Arbor, Marvell, Zaptec, Enpower), Webflow 2 (Heimdall, ERA), WordPress 1 (Caeli), Gatsby 1 (Decor Systems), Vue 1 (Breakthrough). The only real shop stack among the profiles is **Shopify + Craft CMS** (Jonite); in the longlist Lyon Béton runs WooCommerce.
- **three.js** was detected on 9 of 19 (Heimdall, Enpower, Belgrade Arbor, Edifis, Sculpting Harmony, Heidelberg, Aramco, State of the Transition, Composites.archi), mostly for one hero object or one signature scene, not for the whole page.
- **Loop count:** rAF calls per second ranged from 61 (Marvell, a single loop) and 67 (Edifis) to about 840 (Sculpting Harmony). Most sites ran 2 to 5 loops at once (100 to 320/s). This supports the project rule of one animation engine and one loop.
- **Gates and loaders:** 4 of 19 put a click gate before the content (NRG "Enter Site", State of the Transition "Enter website", Aramco "Start", Composites.archi "Skip"), and one loader never finished (Breakthrough). For a shop, a gate is a conversion cost; if BeeD uses an intro, it should be skippable, short and never in front of a product URL.
- **Multilingual winners:** 5 of the 20 serve more than one language (Belgrade Arbor en/sr, Edifis en/fr, Caeli fr/en, Aramco en/ar, Zaptec 13 locales); in the longlist Autex runs regional English sites.

### 5.5 Gaps: where BeeD can be first

- None of the 20 profiled winners has **price comparison across sellers**, a multi-vendor marketplace, or a public spec-driven comparison table. The closest are Jonite (one manufacturer's shop with specs, samples and a visualiser) and Decor Systems (sample basket, counts, calculator). A marketplace that tells its story through comparison would be new in this Awwwards category.
- No energy winner localises for a small market in its own language as the default. Caeli (French) and Belgrade Arbor (Serbian alternate) are the nearest precedents; an Albanian-first site is unclaimed ground.
- Accessibility and resilience are weak spots in the category: a stuck loader (Breakthrough), blocking locale modals (Zaptec, Autex), low-contrast hero text (Marvell). A SOTD-level site whose shop also works with JavaScript off and loads fast would stand out on Usability: it is the lowest of the four jury sub-scores on 15 of the 20 profiled sites (range 6.72 to 7.77).

### 5.6 Build fingerprints (awwwards-blueprints `fingerprint.mjs`, cold cache, this machine)

| Site | Framework / CMS | Motion + render | First load | Lab LCP / CLS | Reduced-motion rules | A11y quick check |
|---|---|---|---|---|---|---|
| Jonite (C5), with product page | Shopify + Craft CMS, Alpine.js, Tailwind | GSAP 3.13 + ScrollTrigger, Lenis, Barba.js, Swiper | 23.5 MB, 530 requests (17.7 MB images) | 2.48 s / 0.111 | 5 | skip link yes, landmarks yes, 0 unnamed buttons |
| Belgrade Arbor (C1) | Next.js app router, Tailwind | GSAP (bundled) + ScrollTrigger, Lenis, three.js r184, Keen Slider | 17.5 MB, 86 requests (12.6 MB video) | 1.29 s / 0.069 | 0 | no skip link, 9 unnamed buttons |
| ON Energy (E2) | Nuxt (Vue) + Storyblok | GSAP (bundled), Lenis, three.js r180 | 21.7 MB, 428 requests (16.4 MB video) | 1.64 s / 0.000 | 0 | no skip link, 2 unnamed buttons |
| Caeli Énergie (E5) | WordPress + jQuery 3.7.1, Tailwind | GSAP (bundled) + split text, Lenis, Taxi.js | 7.35 MB, 47 requests (6.4 MB images) | 2.19 s / 0.040 | 0 | no skip link, only header/footer landmarks |
| Edifis (C8) | Nuxt (Vue) + Prismic | GSAP (bundled) + ScrollTrigger, three.js r146, Swiper | **3.57 MB**, 95 requests | 16.3 s / 1.908 (the intro loader and late hero inflate both) | **20** | no skip link, 4 images without alt, 5 unnamed buttons |

Decor Systems (C9) timed out in the fingerprint run (30 s navigation time-out) and is not in the table.

What this says for BeeD: three of the five are heavy (17 to 24 MB first load, mostly video and images), while Caeli (7.4 MB) and Edifis (3.6 MB) won with far less; only Edifis ships a meaningful set of `prefers-reduced-motion` rules (20), three ship none. On Albanian mobile connections a marketplace cannot afford that weight on product and category pages; keep heavy media to the story home, stream it, and give the shop a light budget. Jonite shows the right shop basics (skip link, landmarks, named buttons, JSON-LD `ProductGroup` + `BreadcrumbList`).

---

## 6. Sources (all read 2026-10-23)

Awwwards listings: https://www.awwwards.com/websites/sites_of_the_day/ (pages 1 to 72) · https://www.awwwards.com/websites/sites_of_the_month/ · https://www.awwwards.com/websites/sites_of_the_year/ · https://www.awwwards.com/websites/?text=energy (and the other keyword searches listed in section 0) · https://www.awwwards.com/websites/architecture/

Awwwards site pages (score, sub-scores, elements, palette, technologies): https://www.awwwards.com/sites/<slug> for every slug linked above.

Live sites: the URLs in each profile, captured with headless Chrome. Evidence (not in the project): frames, contact sheets and JSON in `C:/Users/User/AppData/Local/Temp/claude/C--Users-User-Documents-LC/fa85b45b-d856-4812-a1c9-44840e102171/scratchpad/research/story/<name>/`, fingerprint JSON and screenshots in `…/scratchpad/research/fingerprints/`, raw Awwwards HTML in `…/scratchpad/research/raw/`. The scratchpad is temporary.

Other: Moxion Power shutdown: https://techcrunch.com/2025/09/26/battery-startup-moxion-went-bankrupt-now-its-founder-is-back-to-finish-what-we-started and https://latitudemedia.com/news/portable-battery-startup-moxion-is-bankrupt-what-happened
