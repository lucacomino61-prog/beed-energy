# Tariffs, exchange rate, solar prices and payback assumptions

Stream: `pvgis` · read on **2026-10-23** unless a line says otherwise · companion data file: `pvgis-albania.json`

Everything below is either quoted from the cited source or marked **computed** (our arithmetic from cited numbers) or **UNVERIFIED** (seen only second-hand, or not found). Nothing is estimated.

---

## 0. PVGIS solar yields for 14 Albanian cities (summary of `pvgis-albania.json`)

Source: PVGIS 5.3 (EU Joint Research Centre), PVcalc API, `peakpower=1`, `loss=14`, `optimalangles=1`, crystalline silicon, free-standing mounting, horizon from DEM. Radiation database **PVGIS-SARAH3**, temperature/wind **ERA5**, years **2005–2023** (as returned by the API). All 14 calls answered on `v5_3`; none needed the `v5_2` fallback. City-centre coordinates are taken from each city's English Wikipedia infobox (article URL stored per city in `city_details[slug].coord_source`).

PVGIS azimuth convention: 0 = south, −90 = east, +90 = west.

| City | lat, lon | elev. m | **kWh/kWp/yr** | optimal tilt / azimuth | in-plane irradiation kWh/m²/yr | worst month – best month (kWh/kWp) | year-to-year SD kWh/kWp |
|---|---|---|---|---|---|---|---|
| Tiranë | 41.32833, 19.81806 | 112 | **1435.3** | 36° / −4° | 1852.31 | 81.83 (Dec) – 161.07 (Jul) | 62.6 |
| Durrës | 41.31333, 19.44583 | 12 | **1517.05** | 36° / 1° | 1932.02 | 81.26 (Dec) – 168.55 (Jul) | 52.76 |
| Vlorë | 40.46667, 19.48333 | 0 | **1489.21** | 35° / −1° | 1925.37 | 81.33 (Dec) – 165.72 (Jul) | 61.78 |
| Shkodër | 42.06806, 19.51194 | 13 | **1428.48** | 36° / 0° | 1852.86 | 77.03 (Dec) – 161.97 (Jul) | 58.47 |
| Elbasan | 41.11111, 20.08056 | 128 | **1451.4** | 36° / −5° | 1881.39 | 83.76 (Dec) – 160.56 (Jul) | 65.52 |
| Korçë | 40.61667, 20.76667 | 857 | **1371.26** | 34° / −8° | 1739.84 | 69.91 (Dec) – 156.8 (Jul) | 64.72 |
| Fier | 40.725, 19.55722 | 22 | **1520.98** | 35° / 0° | 1969.91 | 85.69 (Dec) – 166.59 (Jul) | 55.36 |
| Berat | 40.70222, 19.95833 | 56 | **1447.5** | 35° / −10° | 1868.4 | 81.38 (Dec) – 162.51 (Jul) | 58.78 |
| Gjirokastër | 40.067, 20.133 | 452 | **1383.93** | 34° / −16° | 1788.87 | 71.42 (Dec) – 162.2 (Jul) | 58.98 |
| Sarandë | 39.875, 20.01 | 11 | **1500.04** | 34° / 2° | 1949.55 | 81.44 (Dec) – 167.59 (Jul) | 53.76 |
| Kukës | 42.083, 20.417 | 350 | **1357.55** | 35° / −6° | 1710.4 | 63.85 (Dec) – 159.45 (Jul) | 63.96 |
| Lezhë | 41.78194, 19.64444 | 5 | **1473.71** | 36° / 3° | 1896.58 | 79.08 (Dec) – 166.41 (Jul) | 57.56 |
| Pogradec | 40.9, 20.65 | 788 | **1379.19** | 34° / −13° | 1754.11 | 63.85 (Dec) – 161.84 (Jul) | 52.43 |
| Lushnjë | 40.933, 19.7 | 10 | **1493.99** | 36° / −1° | 1953.5 | 85.16 (Dec) – 163.92 (Jul) | 55.68 |

Range across the 14 cities: **1357.55 (Kukës) – 1520.98 (Fier) kWh per kWp per year**; simple mean 1446.4 (**computed**). Coastal/lowland cities (Fier, Durrës, Sarandë, Lushnjë, Vlorë) yield most; mountain towns (Kukës, Korçë, Pogradec, Gjirokastër) least. Tiranë sits below Durrës because PVGIS includes the terrain horizon (Dajti range to the east); this is the API's own horizon model, not an adjustment of ours.

Notes on the inputs:
- Vlorë returned elevation 0 m at the Wikipedia infobox coordinate (coastal point); the API still answered normally.
- Kukës (42.083, 20.417), Lushnjë (40.933, 19.700) and Gjirokastër (40.067, 20.133) have only 3-decimal coordinates in their infoboxes (degrees + minutes). That is ≤ ~1 km of uncertainty; yields change negligibly over such a distance.

### Tiranë roof variants (same coordinates, `loss=14`)

| Variant | tilt / azimuth | kWh/kWp/yr | irradiation kWh/m²/yr |
|---|---|---|---|
| Optimal (free-standing) | 36° / −4° | 1435.3 | 1852.31 |
| Pitched roof, 30°, south, free-standing (ventilated) | 30° / 0 | 1428.52 | 1844.52 |
| Pitched roof, 30°, south, `mountingplace=building` (flush / integrated, no rear ventilation) | 30° / 0 | 1368.56 | 1844.52 |
| Flat roof, 10°, south | 10° / 0 | 1321.36 | 1712.56 |
| Flat roof, 10°, east | 10° / −90 | 1213.96 | 1580.62 |
| Flat roof, 10°, west | 10° / +90 | 1203.46 | 1569.95 |
| Flat roof, 10°, east-west (mean of the two runs, **computed**) | 10° / ±90 | 1208.71 | 1575.29 |
| Horizontal 0° (= global horizontal irradiation) | 0° | 1219.84 | **1589.68** (GHI) |

Raw API URLs for every run are in `pvgis-albania.json` (`api_url`). Monthly kWh/kWp for every city and variant are there too (`monthly_kwh_per_kwp`, January → December).

---

## 1. Electricity tariffs in force (ERE, 2026)

**Primary source:** ERE table "Tarifat dhe Çmimet e energjisë elektrike dhe gazit natyror për vitin 2026", published on ERE's tariffs page (file dated 2025-12-24):
https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf
Listing page (checked 2026-10-23, this is the newest tariff table listed): https://ere.gov.al/sq/tarifat/tarifat-dhe-cmimet

### 1a. Retail prices for customers of the Universal Service Supplier (FSHU)
**ERE Decision no. 322, dated 15.12.2025, valid 1 January – 31 December 2026.**

| Customer category (ERE wording) | Energy price, lekë/kWh, excl. VAT | Peak-hour price, lekë/kWh |
|---|---|---|
| **Households ("Familjarë") consuming up to 700 kWh/month** | **8.5** | — |
| **Households consuming more than 700 kWh/month** | **9.5** — applies to the **whole** month's consumption, from the first kWh | — |
| Common areas of residential buildings (stair lighting, pumps, lifts) | 9.5 | — |
| **Non-household customers connected at 0.4 kV ("Klientë të lidhur në 0.4 kV")** | **14** | **16.1** |
| Bakeries / flour production, category I (0.4 kV) | 7.6 | 8.74 |
| Bakeries + associated flour products and pastry, category II (0.4 kV) | 9.5 | 10.93 |
| Bakeries + pastry + coffee service, category III (0.4 kV) | 12 | 13.80 |
| Religious buildings and communities | 9.5 | — |
| **EV charging points/stations > 11 kW at 0.4 kV** (same decision no. 322; first introduced by decision no. 255 of 15.10.2025 from 1 Nov 2025) | **22** | **25.3** |

ERE footnote, verbatim (Albanian): "Për konsumatorët familjarë të cilët konsumojnë 701 kWh në muaj e më tej, çmimi i energjisë elektrike do të jetë 9.5 lekë/kWh për të gjithë sasinë e konsumuar gjatë një muaji."

**Peak hours** (apply where a peak price is listed): 1 November – 31 March, 18:00–22:00; 1 April – 31 October, 19:00–23:00.

**VAT:** ERE's board notice of 08.01.2025 states the household prices explicitly as "**8.5 Lekë/kWh pa TVSH**" and "**9.5 Lekë/kWh pa TVSH**" (= excluding VAT): https://ere.gov.al/media/files/2025/01/09/Njoftim_Mbledhje_Bordi_nr._02_dt._08.01.2025.pdf (the notice is misdated "09.01.2024" on its letterhead; the meeting date inside is 08 January 2025). The 2026 table repeats the same values without restating the VAT basis; we assume the same basis (excl. VAT) — the verifier should confirm on an OSHEE bill or decision 322 itself.

VAT-inclusive equivalents at the standard 20 % VAT rate (**computed**; the 20 % rate itself is covered in `albania-construction-commerce.md`):
- household ≤ 700 kWh: 8.5 × 1.2 = **10.2 lekë/kWh**
- household > 700 kWh: 9.5 × 1.2 = **11.4 lekë/kWh**
- non-household 0.4 kV: 14 × 1.2 = 16.8 lekë/kWh (businesses normally recover VAT, so use 14 for them)

EUR equivalents at the Bank of Albania rate of 22.10.2026 (90.64 lekë/EUR, section 2) (**computed**): 8.5 lekë = €0.0938; 9.5 = €0.1048; 10.2 = €0.1125; 11.4 = €0.1258; 14 = €0.1545; 16.1 = €0.1776 per kWh.

**History:** the 8.5 / 9.5 lekë structure with the 700 kWh threshold already applied from **1 February to 31 December 2025** under **ERE Decision no. 10 of 08.01.2025** (same values, same footnote): https://ere.gov.al/media/files/2025/01/13/Vendim_Nr_10_2025.pdf and table https://ere.gov.al/media/files/2025/11/13/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_periudh%C3%ABn_1_Shkurt-31_Dhjetor_2025.pdf.
- From the text of Decision no. 10: before it, prices were set by ERE Decision no. 74 of 13.04.2022 (extended to 31.01.2025); the average sales price for universal-service customers at 0.4 kV was set at **10.24 lekë/kWh** for 2025; KESH sells to FSHU at **2.34 lekë/kWh** (down from 2.6), and to last-resort customers at 12 lekë/kWh; FSHU expected customers at **10 kV (except water utilities) to be supplied on the free market** in 2025, with 5,343 GWh expected to be sold to FSHU customers in 2025.
- That households paid 9.5 lekë/kWh excl. VAT (11.4 with VAT) before 1 Feb 2025, i.e. a 1-lek cut: **UNVERIFIED** (reported by a2news / shqiptarja.com in search snippets; articles not opened).
- The temporary 2022 tier for consumption above 800 kWh/month no longer appears in the 2025 or 2026 tables.

**Who is on these prices:** households and small non-household customers at 0.4 kV supplied by FSHU (Furnizuesi i Shërbimit Universal). Larger businesses (10 kV and above) buy on the free market at negotiated prices; there is no regulated business tariff for them. Exact eligibility criteria for universal service (e.g. employee / turnover limits under Law 43/2015): **UNVERIFIED**, not checked here.

### 1b. Network tariffs and other regulated charges (same 2026 table)

| Item | Decision | Value | Validity |
|---|---|---|---|
| Transmission service tariff (OST) | no. 279, 16.12.2024 | 0.85 lekë/kWh | 1 Jan 2025 – 31 Dec 2027 |
| Distribution tariff, 35 kV | no. 312, 12.12.2025 | 1.55 lekë/kWh | 1 Jan – 30 Apr 2026 |
| Distribution tariff, 20/10/6 kV | no. 312, 12.12.2025 | 3.99 lekë/kWh | 1 Jan – 30 Apr 2026 |
| Distribution tariff, 0.4 kV | no. 312, 12.12.2025 | 6.42 lekë/kWh | 1 Jan – 30 Apr 2026 |
| Fixed fee for a "zero" meter reading | no. 312, 12.12.2025 | 200 lekë/month | 1 Jan – 30 Apr 2026 |
| Reactive energy | no. 312, 12.12.2025 | 1.92 lekë/kVArh | 1 Jan – 30 Apr 2026 |
| Purchase price for existing priority producers (small hydro etc.) | no. 324, 15.12.2025 | 10 lekë/kWh | 1 Jan – 31 Dec 2026 |
| Natural-gas transmission tariff | no. 313, 12.12.2025 | 28 lekë/m³ (2.6457 lekë/kWh) | 2026 |

The distribution tariffs in the 2026 table are stated as valid only to 30 April 2026; no later distribution-tariff table is listed on ERE's tariffs page as of 2026-10-23 → the tariff from 1 May 2026 is **UNVERIFIED** (gap). The 2025 values (decision no. 288 of 23.12.2024) were identical.

### 1c. Surplus from rooftop solar (self-producers / "vetëprodhues")
- ERE's self-producer page (https://ere.gov.al/sq/eficence/veteprodhuesi) says surplus energy fed into the grid "kompensohet sipas rregullave të miratuara nga ERE" but publishes **no compensation price**.
- pv magazine (Patrick Jowett, 27 Aug 2026) reports: ERE annual data confirm **631 MW** cumulative solar at end-2025; rules issued in **May 2026** set grid-connection and compensation procedures for self-producers under a **net-billing** methodology; the new electricity-sector **Law no. 59/2026** entered into force in **July 2026**, adding storage and aggregation as licensed activities and allowing "active clients" that "can generate, consume, store and sell electricity". https://www.pv-magazine.com/2026/08/27/albanias-solar-market-shifts-toward-storage-market-integration/
- **The lekë/kWh value paid for exported surplus under net billing: UNVERIFIED / not found.** See `albania-energy.md` §4 for the legal detail. Until confirmed, the calculator should value self-consumed kWh at the tariff and treat exported kWh as a user-editable value defaulting to 0.

---

## 2. Exchange rate (Bank of Albania)

| Pair | Official rate | Date / time stamp on the page |
|---|---|---|
| **EUR / ALL** | **90.64** lekë per euro (change −0.10) | **22.10.2026, 12:10:43** |
| USD / ALL | 80.73 lekë per dollar (−0.13) | 22.10.2026, 12:10:43 |
| EUR averaged bid / ask | 90.29 / 91.02 | same section |

Sources (both pages show the same values, read 2026-10-23): https://www.bankofalbania.org/Tregjet/Kursi_zyrtar_i_kembimit/ · https://www.bankofalbania.org/Markets/Official_exchange_rate/

---

## 3. Solar equipment price index

### 3a. Modules — sun.store "pv.index" (EU B2B solar marketplace)
**September 2026** (PV Tech, published 7 Oct 2026): https://www.pv-tech.org/european-pv-module-prices-ease-out-in-september/

| Technology | €/Wp | m/m change |
|---|---|---|
| TOPCon bifacial (cheapest) | **0.114** (US$0.128) | −1.3 % |
| TOPCon monofacial | ~**0.12** (article rounds) | −2.3 % |
| Back-contact (BC) | **0.128** | −3.6 % |
| Full black (most expensive) | **0.129** | −1.1 % |

**August 2026** (PV Europe, published 12 Sep 2026): https://www.pveurope.eu/markets/august-pv-index-premium-modules-hold-ground-demand-cools — Back Contact €0.133/Wp (−1 %), Full Black €0.130 (−6 %), TOPCon monofacial €0.122 (−5 %), TOPCon bifacial €0.116 (+6 %); sun.store PV PMI 65 (historical band ≈ 68).

No HJT price is given in either month's article. The articles call these "average price" figures from the sun.store marketplace; whether they are offer or transaction averages, and the VAT basis, are **not stated** (sun.store is a B2B platform, so net-of-VAT is likely but **UNVERIFIED**).

### 3b. Inverters — sun.store pv.index, September 2026 (same PV Tech article)
- Hybrid 1–20 kW: **€94.66/kW** (+5.8 %)
- Hybrid > 20 kW: **€59.93/kW** (−6.9 %)
- String / on-grid > 20 kW: **€22.03/kW** (−10.5 %; the August PV Europe article attributes such moves mainly to a shift in the mix of models sold)

### 3c. Batteries
- **BloombergNEF battery price survey, 9 Dec 2025:** average Li-ion **pack** price **$108/kWh** in 2025 (−8 % vs 2024); **stationary-storage packs $70/kWh** (−45 %), now the cheapest segment; BNEF expects a further decrease in 2026 (no figure). https://about.bnef.com/insights/clean-energy/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/ — note: pack prices, not installed home-battery prices.
- **2026 cell prices rising:** Mercom India (30 Jun 2026), reporting SolarPower Europe: storage cells ~$51/kWh by April 2026, up ~9 % from ~$47/kWh at end-2025; "an increase of over 15 % in mainstream residential storage cell prices" since early 2026. https://mercomindia.com/europes-battery-storage-market-crosses-100-gwh-in-2025
- Average **end-customer** price of European residential storage: a search snippet attributes "EUR 711/kWh in H2 2025 (≤ 20 kWh systems, −46.6 % vs H1 2023)" to EUPD Research — **UNVERIFIED** (the pv magazine and solarserver.de articles on EUPD's H1-2026 report that we opened contain no price).
- sun.store's pv.index articles for Aug/Sep 2026 publish **no battery €/kWh** figure.

### 3d. Installed cost of residential rooftop PV (region)
- **Italy — IEA PVPS National Survey Report 2024** (F. Tilli et al., October 2025): turnkey **residential 1.2–1.6 €/W** (= €1,200–1,600 per kWp), utility-scale 0.66–0.9 €/W, average module price 0.28 €/W (2024). https://iea-pvps.org/national_survey/nsr-italy-2024/
- **Kosovo — Prishtina Insight, 21 Jul 2025:** a household 5 kW system ~€3,000 total with ~€1,300 from the government (≈ €600/kW, **computed**); Ministry of Economy subsidy €250 per installed kW (Mar–May 2024); installer MuqaSolar quotes a 7 kW on-grid family system at ~€6,000 (≈ €857/kW, **computed**) and hybrid with batteries "up to 12,000 euros". https://prishtinainsight.com/kosovo-households-and-businesses-turn-to-solar-energy-to-reduce-costs-mag/
- **Albania: no public, sourced installed price per kWp found** (gap). Greece and North Macedonia: not found in this pass (gap).
- China module spot benchmark (OPIS CMM, TOPCon > 600 W, ~$0.089/W FOB, +1.14 % in a 21 Oct 2026 update): **UNVERIFIED** (search snippet; article did not load).

---

## 4. Lifetime, losses and degradation assumptions (for payback)

| Assumption | Value | Source |
|---|---|---|
| System losses in PVGIS run | 14 % (PVGIS default); covers "losses in cables, power inverters, dirt (sometimes snow) on the modules" | PVGIS user manual https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/pvgis-user-manual_en |
| Ageing in PVGIS | **not modelled**; manual: "Over the years the modules also tend to lose a bit of their power", lifetime average "a few percent lower" than first years | same manual |
| Default lifetime in PVGIS cost calculation | **25 years** (`lifetime` parameter default) | PVGIS API docs https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/api-non-interactive-service_en |
| Field degradation, literature median | **0.5 %/year** (≈ 2,000 measured rates) | Jordan & Kurtz, "Photovoltaic Degradation Rates — An Analytical Review", NREL/JA-5200-51664, Prog. Photovolt. 2013 — https://www.osti.gov/biblio/1045052 |
| Degradation for LCA practice | **0.7 %-points/year** ("confirmed") | IEA PVPS Task 12, Methodology Guidelines on LCA of PV Electricity, 4th ed., July 2020 (summary slides) https://iea-pvps.org/wp-content/uploads/2020/07/IEA_PVPS_PV-LCA-methodology-guideline_summary.pdf |
| Default performance ratio | 0.75 residential, 0.8 utility-scale | same IEA PVPS Task 12 summary |
| Roof mounting effect | modules with restricted rear airflow "can get considerably hotter (up to 15 °C at 1000 W/m²)"; Tiranë 30° south: 1428.52 free vs 1368.56 building-mounted = **−4.2 %** (**computed** from our runs) | PVGIS manual + `pvgis-albania.json` |
| Year-to-year variability | SD 52–66 kWh/kWp (≈ 4 % of annual yield) across the 14 cities | PVGIS output `SD_y`, in `city_details` |
| Module power warranties (product level) | see `products-pv.json` (`performance_warranty_years`, `performance_warranty_end_pct`) | manufacturer datasheets (other stream) |
| Inverter service life | **UNVERIFIED** — no source opened; use the product warranty from `products-pv.json` as the replacement horizon |

---

## 5. Calculator recipe and worked example (**all computed**, not source facts)

Inputs: city → `monthly_kwh_per_kwp[12]` from `pvgis-albania.json`; system size kWp; orientation variant (Tiranë ratios can scale other cities: e.g. 10° east-west = 1208.71 / 1435.3 = 0.842 of optimal); household monthly consumption; self-consumption share; tariff; cost per kWp; degradation 0.5 %/yr; lifetime 25 yr.

Monthly bill rule (households): bill = kWh × 8.5 if kWh ≤ 700, else kWh × 9.5 for **all** kWh (+ 20 % VAT). Because of this cliff, solar that pulls a household from above 700 to ≤ 700 kWh in a month saves more than the tariff: e.g. 750 kWh → 7,125 lekë excl. VAT; 700 kWh → 5,950 lekë; the last 50 kWh are worth 1,175 lekë (23.5 lekë/kWh).

Worked example, 1 kWp optimal in Tiranë, 100 % self-consumed, year 1:
- Household (10.2 lekë/kWh incl. VAT): 1435.3 × 10.2 = 14,640 lekë ≈ **€161.5/yr** at 90.64 → simple payback on €1,200–1,600/kWp (Italian turnkey range) ≈ **7.4–9.9 years**.
- Business at 0.4 kV (14 lekë/kWh, VAT recoverable): 1435.3 × 14 = 20,094 lekë ≈ **€221.7/yr** → simple payback ≈ **5.4–7.2 years**.
- With 0.5 %/yr degradation the 25-year average output is ≈ 94 % of year 1.
These use the Italian price range only because no Albanian installed-price source was found; the site should show them as an illustration with the assumptions visible, and let sellers' real offers replace the cost input.

---

## Sources opened (all read 2026-10-23)
- PVGIS API: https://re.jrc.ec.europa.eu/api/v5_3/PVcalc (individual URLs in `pvgis-albania.json`)
- City coordinates: English Wikipedia articles listed in `pvgis-albania.json` → `city_details[slug].coord_source` (Wikipedia API `prop=coordinates` for 10 cities; infobox read for Shkodër, Gjirokastër, Kukës, Lushnjë)
- ERE 2026 tariffs table; ERE 2025 tariffs table; ERE Decision no. 10/2025; ERE board notice 08.01.2025; ERE tariffs page; ERE self-producer page (URLs above)
- Bank of Albania official rates (sq + en pages)
- PV Tech 7 Oct 2026; PV Europe 12 Sep 2026; BNEF 9 Dec 2025; Mercom India 30 Jun 2026; pv magazine 27 Aug 2026 and 8 Sep 2026; solarserver.de 7 Sep 2026
- IEA PVPS NSR Italy 2024 page; IEA PVPS Task 12 LCA guideline summary (July 2020)
- Prishtina Insight 21 Jul 2025
- PVGIS user manual and API documentation (JRC)
- OSTI record 1045052 (Jordan & Kurtz)
