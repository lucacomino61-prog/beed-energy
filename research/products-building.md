# Building, efficiency and construction products: research notes

Read on 2026-10-23. Data file: `research/products-building.json` (26 products). Spec keys match `scripts/catalog/categories.mjs`; a node check of keys, number types and the shape passed.

**How it was collected.** Manufacturer datasheets, product pages, or EU/official records first (Daikin, Vaillant, Mitsubishi Electric NZ, LG, EPREL, Calpak, SOLE, Cosmosolar, ROCKWOOL Albania, Austrotherm, Ceresit Albania, VEKA, Salamander, Antea, Kurum, Xella, Sika Albania, Shelly, Signify). Albanian availability was checked on the brands' Albanian sites (rockwool.com/al, ceresit.al, alb.sika.com, gree.al, anteacement.com, kurum.al) and on the Albanian retailer neptun.al. The retailer's catalogue JSON carries brands, prices in lekë and warranty months.

**Prices.** Only three real public prices were found. Lekë prices are converted at the Bank of Albania rate of **90.64 lekë/EUR (22.10.2026)**, taken from `tariffs-prices.md`. Every other price is `null`; none were estimated.

**Units in specs.** Heat pumps: `sound_power_db` is the outdoor sound power in dB(A); the test conditions differ by maker (see the doubts below). Air conditioners: `indoor_noise_min_db` is the lowest indoor sound pressure in dB(A). Insulation: `pack_area_m2` is for the thickness in the model name.

---

## Heat pumps (`heat-pumps`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Daikin Altherma 3 R W, EHBH08E6V + ERGA06EAV3H (6.00 kW, COP 4.85, SCOP 4.47, A+++, R-32) | [Catalogue ECPEN22-786](https://www.daikin.eu/content/dam/global-assets/internet-denv/catalogues_brochures/commercial/Daikin%20Altherma%203%20R%20Product%20Catalogue%20ECPEN22-786.pdf) · [ERGA-EVH spec table](https://www.daikin.eu/en_us/products/product.table.html/ERGA-EVH.html) | The Daikin brand is sold at neptun.al (split ACs only). The Altherma itself was not found in an Albanian shop: **UNVERIFIED**. | none | SCOP 4.47 is the middle of three values (4.48 / 4.47 / 4.56) in the catalogue table for the 04/06/08 sizes. Sound power 60 dB(A) is "heating nominal" (Ta 7 °C, LWC 35 °C) from the ERGA-EVH table. Dimensions and weight are for the outdoor unit; the indoor unit is 840 × 440 × 390 mm and 42.0 kg. |
| Mitsubishi Electric Ecodan PUZ-WM85VAA-BS (8.5 kW, COP 4.80, ηs 193 % at 35 °C, R32) | [PI sheet, Mitsubishi Electric NZ](https://www.mitsubishi-electric.co.nz/materials/hotwater/brochures/puz-wm85vaa-bs_pi_sheet.pdf) | **UNVERIFIED** | none | `scop_average_climate` **4.9 is derived**, not printed: ηs 193 % is converted with the EU formula SCOP = (ηs + 3 %) × 2.5. The sheet's own "SCOP (MCS)" figure is cut off in the PDF text ("4."). The -BS model is the coastal anti-corrosion version; the plain PUZ-WM85VAA was not checked. The sound-power footnote is unclear. |
| Panasonic Aquarea J WH-MDC09J3E5 (9.00 kW, COP 4.48, SCOP 4.90, A+++, R32) | [Schiessl Kälte distributor data](https://www.schiessl-kaelte.com/en_DE/Shop/Heat-pumps/Outdoor-units/Compact/Panasonic-heat-pump-LT-compact-WH-MDC09J3E5-heating-cooling-9-kW-R32~p1460799) | **UNVERIFIED** | none | **Every value comes from an EU refrigeration wholesaler, not from Panasonic.** panasonic.com returned 403 and aircon.panasonic.eu loads its products by script. Panasonic NZ lists the sister models WH-MDC05J3E5 and WH-MDC07J3E5, so the J-series MDC line is real, but the 09 model was not confirmed on a Panasonic page. Sound power 59 dB(A) is at A7/W55, part load. **The verifier should confirm this one or replace it.** |
| Vaillant aroTHERM plus VWL 75/6 A 230V S2 (nominal 4.60 kW, COP 4.80 at A7/W35, R290) | [Installation manual 0020330791_03, technical data](https://www.vaillant.co.uk/product-images/0020330791-03.pdf.pdf) · [product page](https://www.vaillant.co.uk/product-systems/heat-pumps/arotherm-plus/) | **UNVERIFIED** | none | Sold as a "7 kW" unit. The nominal EN 14511 output at A7/W35 is 4.60 kW and the range is 3.0–7.4 kW; the JSON uses 4.60. SCOP at 35 °C was not found: the ErP fiche covers 55 °C only (A++, ηs 133 %). `energy_class_35c` "A+++" comes from the range-level statement on the UK product page. Sound power 53 dB(A) is at A7/W35 to EN 12102; the ErP outdoor figure is 55 dB(A). Weight 128 kg is ready for operation. |

## Air conditioners (`air-conditioners`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Daikin Perfera FTXM35A + RXM35A (3.50 / 4.00 kW, SEER 9.25, SCOP 5.20, A+++, R-32) | [Product flyer ECPEN24-022](https://www.daikin.eu/content/dam/document-library/catalogues/ac/split/ftxm-a/FTXM-A,%20RXM-A_Product%20flyer_ECPEN24-022_English.pdf) | Daikin splits are sold at [neptun.al](https://www.neptun.al/manufacturers/manufacturer-products.nspx?manId=166&categories=282_338_336_355_356_361_363_362_349_354): Sensira FTXF25A/RXF25A at 73,997 lekë (regular 147,490), with 36 months warranty. The Perfera itself was **not** listed. | none | SEER and SCOP were cross-checked against the flyer's annual consumption figures (3.5 × 350 / 132 ≈ 9.28; 2.5 × 1400 / 673 = 5.20). Dimensions and weight are for the indoor unit; the outdoor unit is 610 × 923 × 367 mm and 36 kg. The Sensira FTXF25A sold in Albania is the older A version; the current flyer covers 25B, so it was not used. |
| LG DUALCOOL Deluxe DC12RK.NSJ / DC12RK.UL2 (3.5 / 4.0 kW, A++/A++, R32) | [LG Germany product page](https://www.lg.com/de/klimaanlagen/dc12rk/) · [LG Czech page](https://www.lg.com/cz/bytove-klimatizace/bytove-klimatizace/dc12rk/) | **Yes**: [neptun.al](https://www.neptun.al/manufacturers/manufacturer-products.nspx?manId=116&categories=282_338_336_355_356_361_363_362_349_354), code KO0730, 36 months warranty | **€959.81**: 86,997 lekë incl. VAT (promotional; regular 172,090 lekë), Neptun, read 2026-10-23 | SEER and SCOP are not on LG's pages; they sit in the product-fiche PDF (fiche 5401469319), which could not be downloaded. The 19 dB figure is LG's marketing claim and its footnote cites a test model, V10API. LG offers 10 years on the compressor; the general warranty was not checked. Dimensions are for the indoor unit; the outdoor unit is 770 × 545 × 288 mm and 34.1 kg. |
| Gree Pular GWH12AGB-K6DNA1A (3.2 kW, SEER 6.1 A++, SCOP 4.0 A+, R32) | [EPREL fiche 372450](https://eprel.ec.europa.eu/fiches/airconditioners/Fiche_372450_EN.pdf) | The brand is in Albania: [gree.al](https://gree.al/kondicioner-mural/) (header: "Na gjeni tek të gjitha dyqanet GLOBE") lists Bora, Fairy, U-Crown and G-Tech. **Pular is not listed there; UNVERIFIED for this model.** | none | EPREL says the model was placed on the EU market **from 31/08/2020 to 30/08/2025**, so it may be discontinued. The cooling figure is the EPREL design load. `heating_capacity_kw` is left out because EPREL gives only the design load (2.7 kW). Dimensions (779 × 260 × 185 mm) come from the Spanish distributor Remle, for a variant with a different suffix (3NGR0740). Gree's own spec PDFs on gree.al date from 2017 and lack model codes. |

## Solar water heaters (`solar-water-heaters`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Calpak Mark-5 160/2.6 (151 L, 2.60 m² gross, enamelled tank, 3.5 kW heater) | [Mark-5 brochure (EN)](https://calpak.gr/wp-content/uploads/2024/10/Mark5_brochure_2022.05.08_EN_high-res-1.pdf) · [product page](https://calpak.gr/en/portfolio-item/mark-5-160-2-6-en/) | **UNVERIFIED** (Greek brand) | none | The collector count is not stated, so `collector_count` is left out. `dimensions_mm` gives the installed footprint at 45° from the brochure (height 1989, width 1973, length 1230 mm); the axis mapping is our reading. Warranty not found. The technical manual (Mark5_Complete-English-Manual) was not opened. |
| SOLE EUROSTAR 150-1-250 (150 L, 1 × 2.31 m², glass-enamelled tank) | [EUROSTAR leaflet (EN)](https://www.sole.gr/image/catalog/pdfs/eurostar/SOLE-EUROSTAR_EN.pdf) | **UNVERIFIED**; SOLE says it exports 75 % of output to 48 countries but names none | none | The electric backup power is not in the leaflet. Dimensions are for the collector (1970 × 1175 × 86 mm, 49 kg); the tank is 1320 mm × Ø500 and 59 kg empty. The warranty PDF's Greek text did not extract (it shows "(5)" and "(10)"), so warranty is null. |
| Cosmosolar GLASS CS 170/2,52 VS (170 L, 1 × 2.52 m², double enamel with titanium, 3.5 kW) | [Product page](https://cosmosolar.com/product/%ce%b7%ce%bb%ce%b9%ce%b1%ce%ba%ce%bf%ce%af-%ce%b8%ce%b5%cf%81%ce%bc%ce%bf%cf%83%ce%af%cf%86%cf%89%ce%bd%ce%b5%cf%82-glass-gl-120-200-2/) · [product fiche](https://cosmosolar.com/wp-content/uploads/documents/Solar/CS/Product_Fiche/DP_HL_S_CS170VS_2_52.pdf) | **UNVERIFIED** | none | The product page URL slug says "gl-120-200" but the page content is GLASS CS 120–300 VS. The weight of 135.9 kg is the whole system empty. Collector depth is not given (`d` is null). The fiche PDF was linked but not opened. |

## Insulation (`insulation`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| ROCKWOOL Frontrock MAX Plus, 100 mm (A1, λD 0.035, 2.40 m²/pack) | [Albanian technical sheet 2025-04](https://brandportal.rockwool.com/public-assets/8748580/frontrock-max-plus-alb.pdf) | **Yes**: [rockwool.com/al](https://www.rockwool.com/al/produkte/frontrock-max-plus/), with an Albanian TDS (ROCKWOOL Adriatic) | none | The board is dual density (136 / 70 kg/m³), so `density_kg_m3` is left out. |
| Austrotherm EPS AF PLUS, 100 mm (graphite EPS, λ 0.031, E, 2.5 m²/pack) | [Austrotherm Serbia product catalogue 2026](https://www.austrotherm.rs/fileadmin/user_upload/RS/Download/Katalozi/Katalog_proizvoda_A5_2026_20260811.pdf) | **UNVERIFIED**; no Albanian Austrotherm site found | none | The data is from the Serbian subsidiary's catalogue (valid from 1 July 2026). Density not stated. |
| Austrotherm XPS TOP 30, 50 mm (λ 0.032, 300 kPa, E, 6.00 m²/pack) | same catalogue | **UNVERIFIED** | none | λ varies with thickness (0.032 at 40–50 mm, up to 0.036 at 140–160 mm). |
| Ceresit Ceretherm Aquastatic ETICS | [ceresit.al system page](https://www.ceresit.al/zgjidhje-sistemore/sistemet-per-termoizolim/ceretherm-aquastatic.html) | **Yes**: ceresit.al (Henkel) | none | This is a system, so λ, thickness, fire class and density depend on the board chosen; only `material` is filled. The page cites the ETA for "Ceresit Ceretherm Classic"; the ETA number was not retrieved. |

**Gap:** Knauf Insulation mineral wool. Every knauf.com page, including knauf.com/sq-AL (an Albanian Knauf site exists), returned a Cloudflare 403. A retailer-hosted Unifit 035 datasheet was 404. A search excerpt gave Unifit 035 as λD 0.035 and A1, but this was not verified, so the product was not added.

## Windows (`windows`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| VEKA SOFTLINE 82 MD (82 mm, 7-chamber frame, Uf up to 1.0, 3 sealing levels) | [VEKA AG technical sheet 01/2018 (DE)](https://sentinel-holding.eu/Kunden/VEKA%20AG/Produktunterlagen/SOFTLINE%2082%20mit%20100%20-%20Frischmaterial/TDB_SOFTLINE-82-MD_DE_2018-01.pdf) | **UNVERIFIED** | none | The sheet is from 2018 and hosted on a third-party server. `uw_w_m2k` is left out: a Polish fabricator (KMT) quotes Uw 0.91 with Ug 0.7, but that is not VEKA's figure. Warranty not found. |
| Salamander bluEvolution 82 (82 mm, 5 or 6 chambers, Uf 0.98, Uw 0.73) | [Salamander product page](https://salamander-windows.com/productworld/windows/bluevolution82_system) | **UNVERIFIED** | none | `chambers` is 6 because the page says "5- or 6-chamber". Uw 0.73 is stated without the Ug value, only "triple glazing". Seals not described. |

**Gap:** Rehau (rehau.com returned "Access Denied").

## Cement and masonry (`cement-masonry`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Antea CEM II/B-LL 32.5 R | [Antea "Our products"](https://www.anteacement.com/_home/product/) | **Yes**: Albanian maker (plant at Fushë-Krujë, TITAN Group) | none | `compressive_strength_mpa` 32.5 is the **EN 197-1 class minimum at 28 days**, not a declared test value. **Bag weight not found** (Antea's site gives no bag size), so `bag_kg` is left out. The Competition Authority release (caa.gov.al Press-Release-121) was seen only as a search excerpt: dominant position in bagged 32.5 R (2019–2022) and bulk 42.5 R (2021–2022). The anteacement.com TLS certificate has expired. |
| Antea CEM II/A-LL 42.5 R (counts as the TITAN product) | same | **Yes** | none | 42.5 is the class minimum, as above. Antea also makes CEM I 42.5 R. Colacem (which has an Albanian plant) was not reachable (colacem.com refused the connection). |
| Ytong Classic ZB 25 (625 × 250 × 200 mm, 400 kg/m³, 2.5 N/mm², λ 0.096, A1) | [Xella Serbia product page](https://www.xella.rs/sr_RS/product/ytong-classic-zb-25/20000982) (values from Xella's storefront API) | **UNVERIFIED**; no Albanian Ytong seller found | none | The characteristic compressive strength is 1.89 N/mm²; the JSON uses the mean, 2.5. Weight 16.44 kg is per block. |
| Kurum B500C Ø12 × 12 m | [Kurum catalogue (sq)](https://www.kurum.al/wp-content/uploads/2021/02/A4-katalog-shqip.pdf) · [kurum.al/hekur](https://www.kurum.al/hekur/) | **Yes**: Albanian maker (Elbasan); 40 % of output goes to the home market | none | **`weight_kg` 10.66 is computed** as 0.888 kg/m × 12 m. Rebar has no compressive strength, so that field is left out. |
| Ceresit CM 11 PLUS, 25 kg (C1T, EN 12004) | [Albanian TDS, version 06/2026](https://datasheets.tdx.henkel.com/CERESIT-CM-11-PLUS-bs_AL.pdf) | **Yes**: Albanian-language TDS, ceresit.al | none | Consumption is read from the TDS table: 3.0 / 4.0 / 5.0 / 6.0 kg/m² for 4 / 6 / 8 / 10 mm teeth. Also sold in 5 kg bags. |
| SikaTop Seal-107, 25 kg kit (EN 1504-2) | [Sika Albania PDS, edition 27/06/2016](https://alb.sika.com/dms/getdocument.get/a05977b8-79c5-4870-af67-f75cb328d378/020701010020000001_SikaTop%20Seal_107_eng.pdf) | **Yes**: Sika Albania SHPK, Tirana Business Park (address on the PDS) | none | The PDS is from 2016; check for a newer edition. Mapei was not used because mapei.com returned a Cloudflare 403. |

## Energy monitoring (`energy-monitoring`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Shelly Pro 3EM (3 × 120 A CTs, Class B, Wi-Fi/LAN/BT) | [Shelly knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-pro-3em) | **UNVERIFIED** | **€157.90**, [shelly.com EU store](https://www.shelly.com/products/shelly-pro-3em-x1) (Shopify JSON, EUR, DE storefront), read 2026-10-23, out of stock | The VAT treatment of the store price is not stated. The KB gives the size as **94 × 19 × 69 mm**, which looks like one DIN module and may be a KB error for a 3-CT meter; **verify**. Weight is null. The 5-year warranty is from the store page. |
| Fronius Smart Meter TS 65A-3 (42,0411,0345; 3 × 65 A; Class 1 / Class B; Modbus RTU) | [Siblik datasheet](https://www.siblik.com/fileadmin/mam/medias/docus/153/Artikel_PV-42.0411.0345_Datenblatt.pdf) · [Fronius datasheet copy](https://solarmagazine.nl/u/webshop/datasheet-fronius-smart-meter.pdf) | **UNVERIFIED** | **€160.00 excl. VAT**, [sun.store](https://sun.store/it/product/fronius-smart-meter-ts-65a-3-10071): lowest of 7 offers (€160–195), read 2026-10-23 | **The specs came from WebSearch excerpts of these two PDFs.** Neither PDF could be opened (network refused or 403) and the fronius.com technical-data page returned 404, so **re-check every value**. |

## LED lighting (`led-lighting`)

| Product | Datasheet | Albanian availability | Price | Doubts |
|---|---|---|---|---|
| Philips CoreLine Panel gen6 RC132V G6 36S/840 PSD W60L60 OC (26 W, 3600 lm, 140 lm/W, 4000 K, DALI) | [Signify product page 911401890885](https://www.signify.com/global/prof/indoor-luminaires/recessed/philips-coreline-panel-gen6/911401890885_EU/product) | **UNVERIFIED** | none | `cri` is 80 because Signify states "> 80". `lifetime_h` 50,000 is the L90 figure; L80 is reached at 100,000 h. |
| Philips CoreLine Panel gen6 All-in RC132V G6 40_43S/830_40 WIA (31 W, 4000/4300 lm, 3000–4000 K, wireless) | [Signify product page 911401807387](https://www.signify.com/global/prof/indoor-luminaires/recessed/philips-coreline-panel-gen6/911401807387_EU/product) | **UNVERIFIED** | none | Both output and colour temperature are switchable. The JSON uses the maximum flux (4300 lm), the 4000 K setting and the rated 140 lm/W; Signify also lists 130 lm/W, presumably for 3000 K. This is the same family as the panel above. **Ledvance was the planned second brand, but ledvance.com timed out.** |

---

## Open items for the build
- Only 3 of 26 products have a reference price (LG at Neptun Albania, Shelly, Fronius). The demo seeder sets the other categories' offers from medians or "request a quote".
- `warranty_years` is mostly null because makers publish it per country or only in warranty PDFs. The retail warranties seen at Neptun are 36 months (Daikin, LG) and 24 months (Midea).
- No Albanian-market evidence was found for the specific models of Mitsubishi, Panasonic, Vaillant, Gree Pular, the three Greek solar water heaters, Austrotherm, VEKA, Salamander, Ytong, Shelly, Fronius or Philips. Ask the client which brands its partner sellers carry.
- Neptun's catalogue also lists **Midea** splits in Albania, for example AG2Eco-12NXD0 at 59,990 lekë (regular 86,790). No Midea datasheet or EPREL record was found for that pair, so it was not added.

## Prices added 2026-10-23
One real public price per product, from the seller page named in the JSON price_source (read 2026-10-23). Where the price is in EUR no conversion was needed; no Albanian seller listing was found for any of these models. Full detail is in each product's price_note.

| Product | Price (EUR) | Seller, country, VAT, unit |
|---|---|---|
| Calpak Mark-5 160/2.6 | 1,230.00 | [Klimamichaniki SA, Greece, incl. VAT 24%, per system (double-energy version)](https://klimamichaniki.gr/product/calpak-mark5-160-2-6/) |
| Sika SikaTop Seal-107 | 32.25 | [MASTERHAUS, Bulgaria, consumer price (VAT 20% included by law), per 25 kg kit](https://www.masterhaus.bg/en/product/190793-two-component-waterproofing-top-seal-107-25-kg-sika) |
| Ytong (Xella) Classic ZB 25 | 6.36 | [BMD STIL, Croatia, consumer price (VAT 25% included by law), per block 625×250×200; density not stated on the page](https://www.bmd-stil.hr/hr/cigla-i-zidovi-882/porobeton-siporex-899/porobeton-siporex-25-cm-ytong-porobeton-zidni-blok-classic-25-20-106647/) |
| Austrotherm XPS TOP 30, 50 mm | 54.74 | [Keuck Baustoff, Germany, incl. VAT 19%, per pack of 6.00 m² (XPS TOP 30 SF)](https://keuck-baustoffe.de/product/austrotherm-xps-top-30-sf-1250-x-600-x-50-mm-6-qm1-pak-12-pakete1-palette) |
| Vaillant aroTHERM plus VWL 75/6 A 230V S2 | 5,549.00 | [HeizungsDiscount24, Germany, incl. VAT 19%, per unit (art. 0010021118; page does not print S2)](https://www.heizungsdiscount24.de/waermepumpen/vaillant-arotherm-plus-vwl-756-a-heizungswaermepumpe.html) |
| Panasonic WH-MDC09J3E5 | 3,855.00 | [immotecshop24, Germany, incl. VAT 19%, per unit (listed as WH-MDC09J3E5-1)](https://www.immotecshop24.de/Panasonic-Aquarea-HP-Monoblock-Waermepumpe-9-kW-Gen-J-230-V) |
| Gree GWH12AGB-K6DNA1A | 475.00 | [Kyriakos Electric, Cyprus, consumer price (VAT 19% included by law), per set, sale price](https://kyriakoselectric.com/product/gree-pular-12000-btu-gwh12agb-k6dna1a/) |
| Daikin FTXM35A + RXM35A | 1,140.00 | [Ydor O.E., Greece, consumer price (VAT 24% included by law), per set; outdoor listed as RXM35A9](https://www.ydor.com.gr/klimatistiko-daikin-perfera-ftxm35a-rxm35a9-12000-btu-1660.html) |
| Philips (Signify) CoreLine Panel gen6 RC132V G6 36S/840 PSD W60L60 OC (911401890885) | 190.28 | [LTT-Versand, Germany, incl. VAT 19%, per luminaire (MPN 911401890885)](https://www.ltt-versand.de/en/light/lights-for-home-commercial-use/wall-and-ceiling-lights/72126/philips-coreline-panel-gen6-26-w-600x600-mm-vpc-3600-lm-4000-k-dali) |

Still without a price: daikin-altherma-3-r-w-ehbh08e6v-erga06evh, mitsubishi-ecodan-puz-wm85vaa-bs, sole-eurostar-150-1-250, cosmosolar-glass-cs-170-2-52-vs, rockwool-frontrock-max-plus-100, austrotherm-eps-af-plus-100, ceresit-ceretherm-aquastatic-etics, veka-softline-82-md, salamander-bluevolution-82, antea-cem-ii-b-ll-32-5-r, antea-cem-ii-a-ll-42-5-r, kurum-b500c-rebar-12mm, ceresit-cm-11-plus-25kg, philips-coreline-panel-g6-rc132v-all-in-wia.
