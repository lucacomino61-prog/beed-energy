# Albania energy facts — for the scroll story and the solar calculator

Research stream: `energy`. Compiled 2026-10-23. Every figure carries its source and the date it was read (all sources read 2026-10-23 unless stated).

## How to read this file

- **Primary sources used first:** ERE annual report 2025, the ERE 2026 tariff table, INSTAT electricity balances, the text of Law 24/2023, Ministry Instruction 3/2019, and the World Bank Global Solar Atlas API.
- **UNVERIFIED** marks anything I could not confirm in a primary source.
- **ERE domain blocked:** `ere.gov.al` refused connections (port 443) from this machine and from WebFetch on 2026-10-23. ERE documents were read from Internet Archive copies of the official URLs, and both URLs are given. Local copies and text extracts for the fact-checker are in `C:/Users/User/AppData/Local/Temp/claude/C--Users-User-Documents-LC/fa85b45b-d856-4812-a1c9-44840e102171/scratchpad/research/energy/`:
  - `ere_annual_2025_en.pdf` and its text, `ere2025en.txt`
  - `tarifat2026.pdf` and `tarifat2026.txt`
  - `law24_2023_en.pdf` and `law24.txt`
  - `udhezim3_2019.pdf` and `udhezim3.txt`
  - `instat_elec_2025.pdf`
  - `instat_q2_2026.pdf`
  - `gsa_cities.json`
- **Number formatting:** English uses `8,345` and `86.8`. Albanian copy should use `8.345` and `86,8`, as the Albanian sentences below do.

### Key sources (short names used below)

| Short name | Document | URL(s) |
|---|---|---|
| **ERE-AR2025** | ERE, *Annual Report — The State of the Power Sector and the Activities of ERE in 2025* (English edition, dated March 2026) | Official: https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf · Archived copy used: https://web.archive.org/web/20261001153435/https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf · Albanian edition: https://www.ere.gov.al/images/files/2026/07/14/RAPORTI_VJETOR_2025.pdf |
| **ERE-TAR2026** | ERE, *Tarifat dhe Çmimet e energjisë Elektrike dhe Gazit natyror për VITIN 2026* | Official: https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf · Archived: https://web.archive.org/web/20260411182557/https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf |
| **INSTAT-2025** | INSTAT, *Balance of Electric Power, Year 2025* (published 03/03/2026) | https://www.instat.gov.al/media/mngpviyc/balance-of-electric-power-2025.pdf · release page: https://www.instat.gov.al/en/themes/environment-and-energy/energy/publication/2025/balance-of-electric-power-2025/ |
| **INSTAT-Q2-2026** | INSTAT, *Balance of Electric Power, Quarter II 2026* (published 26/08/2026) | https://www.instat.gov.al/media/of2fq1vf/balance-of-electric-power-q2_2026.pdf |
| **LAW-24/2023** | Law No. 24/2023 "On the promotion of the use of energy from renewable sources" (ERE's unofficial English translation) | Official: https://www.ere.gov.al/media/files/2024/01/31/Law_no._24_2023_On_the_promotion_of_the_use_of_energy_from_renewable_sources.pdf · Archived: https://web.archive.org/web/20240915055859/https://www.ere.gov.al/media/files/2024/01/31/Law_no._24_2023_On_the_promotion_of_the_use_of_energy_from_renewable_sources.pdf |
| **UDH-3/2019** | Ministry of Infrastructure and Energy, *Udhëzim Nr. 3, datë 20.6.2019* (simplified connection procedure for solar self-producers) | Official: https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf · Archived: https://web.archive.org/web/20250420015647/https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf |
| **GSA** | World Bank / ESMAP Global Solar Atlas API (Solargis model; data version 1.7, layers updated 2026-04-01, period to 2025) | `https://api.globalsolaratlas.info/data/lta?loc=<lat>,<lon>` |

---

## 1. Electricity generation mix, generation, consumption, imports

### 1.1 Latest year (2025)

| Indicator | 2024 | 2025 | Source |
|---|---|---|---|
| Net domestic generation | 7,836,625 MWh | **7,467,589 MWh** (−4.7%) | INSTAT-2025 Tab. 1; ERE-AR2025 Table 1, p. 28 |
| of which hydro (public + independent) | 7,330,077 MWh (**93.5%**) | 6,483,521 MWh (**86.8%**) | INSTAT-2025 Tab. 1 (shares computed from the table) |
| of which "other producers (other renewable)", mainly solar | 506,548 MWh (6.5%) | 984,068 MWh (**13.2%**) | INSTAT-2025 |
| of which thermal | 0 | 0 | INSTAT-2025 |
| Photovoltaic plant generation (ERE count) | 484,188 MWh | **832,347 MWh (≈11%)** | ERE-AR2025 Fig. 15, p. 42; text p. 15 and p. 39 |
| Public producer KESH, share of generation | 55.7% | 46.2% | ERE-AR2025 p. 28 |
| Available electricity / consumption | 8,170,517 MWh | **8,345,057 MWh** (+2.1%) | INSTAT-2025; ERE-AR2025 p. 18 |
| Gross imports | 2,668,771 MWh | **3,375,269 MWh** (+26.5%) | INSTAT-2025 |
| Gross exports | 2,334,878 MWh | 2,497,802 MWh | INSTAT-2025 |
| Net imports | 334 GWh | **877 GWh** | INSTAT-2025; ERE-AR2025 p. 78 |
| Household consumption | 3,408,870 MWh | 3,641,101 MWh | INSTAT-2025 |
| Total losses (transmission + distribution) | 19.8% of available electricity | 19.1% | INSTAT-2025 |
| Distribution losses (OSSH) | 17.93% | 16.96% | ERE-AR2025 p. 18 |

- **2025 was a dry year.** Average inflow to the Fierza reservoir was about 145 m³/s, against a 30-year (1995–2024) average of 183 m³/s, about 21% lower. The Drin cascade energy reserve at the start of 2025 was 477 GWh, about 52% of the 913 GWh it held at the start of 2024. Source: ERE-AR2025 p. 13 and p. 16.
- **Drin cascade gross output (KESH):** 3,404 GWh in 2025 against a 2016–2025 high of 5,851 GWh in 2018. Source: ERE-AR2025 p. 33.
- **Customers:** 1,377,204 electricity customers at the end of 2025. Households were about 85.7% of the customers supplied by FSHU. Source: ERE-AR2025 p. 18.
- **EV charging:** "A total of 225 charging points were installed during the year" (2025), "an increase of 47 units compared with 2024". Source: ERE-AR2025 p. 18.

**Two official sources split hydro and solar differently.**
- INSTAT reports 86.8% hydro and 13.2% "other renewable" for 2025.
- ERE counts licensed PV plants at 832.3 GWh, about 11%. On that basis, non-PV generation would be about 89%, a derived figure.
- The roughly 150 GWh gap is probably a difference in how self-producers or other injections are classified. This is UNVERIFIED.
- **Recommendation:** for the story, use one pair consistently. Either INSTAT's "≈87% hydro" or ERE's "solar 832 GWh ≈ 11%", each with its own footnote. Do not add the two together.

### 1.2 Dry years and wet years: the swing (2016–2025)

Source: the OST energy balance in ERE-AR2025, Table 10, p. 48 (domestic generation, imports and exports on the interconnectors, in GWh). Net imports are computed as imports minus exports.

| Year | Domestic generation | Imports | Exports | Net imports (+) / net exports (−) |
|---|---|---|---|---|
| 2016 | 6,636 | 1,827 | 1,869 | −42 |
| 2017 (dry) | **4,174** | 3,403 | 488 | **+2,915** |
| 2018 (wet) | **8,076** | 1,772 | 2,685 | **−913** |
| 2019 | 4,767 | 3,177 | 770 | +2,407 |
| 2020 | 4,892 | 3,238 | 963 | +2,275 |
| 2021 (wet) | 8,432 | 2,253 | 2,800 | −547 |
| 2022 | 6,504 | 3,044 | 2,123 | +921 |
| 2023 | 8,226 | 1,922 | 2,842 | −920 |
| 2024 | 7,836 | 2,668 | 2,334 | +334 |
| 2025 (dry) | 7,467 | 3,375 | 2,497 | +878 (ERE gives 877) |

- **Story point:** the same grid produced 4,174 GWh in 2017 and 8,076 GWh in 2018. Output roughly doubles or halves with rainfall.
- ERE: "during periods of abundant hydrological inflows, Albania is able to export electricity, whereas during dry periods it imports electricity" (ERE-AR2025 p. 78).
- **Consumption range:** consumption peaked at 8,414 GWh in 2021 and was lowest at 7,094 GWh in 2016 over 2016–2025 (ERE-AR2025 p. 77).

### 1.3 Most recent quarter (Q2 2026)

Source: INSTAT-Q2-2026.

- Net domestic production: 2,361 GWh, against 1,757 GWh in Q2 2025 (+34.4%).
- Shares: public hydro 42.8%, private and concession hydro 38.2%, **other renewables 19.0%**.
- Gross imports 569 GWh; gross exports 991 GWh. The quarter was a net export quarter.

---

## 2. Installed capacity by technology

### 2.1 Totals at 31 Dec 2025

| Item | Value | Source |
|---|---|---|
| Total installed generation capacity | **3,475 MW** (+262 MW vs 2024) | ERE-AR2025 p. 13 and p. 15 |
| Connected to transmission / distribution | 2,905 MW / 570 MW | ERE-AR2025 p. 15 |
| KESH (state) | 1,563 MW, about 45% of total | ERE-AR2025 p. 15 and p. 32 |
| KESH Drin cascade hydro | **1,350 MW**: Fierza 500 MW, Koman 600 MW, Vau i Dejës 250 MW | ERE-AR2025 p. 32 (Figure 5 table) |
| KESH thermal | Vlora TPP 98 MW (out of service since an August 2023 cooling-system failure); floating thermal Tigri 1 & Tigri 3, 110 MW | ERE-AR2025 p. 32 and p. 172 |
| KESH floating PV, Qyrsaq dam (Vau i Dejës) | 5.14 MW; out of operation throughout 2025 | ERE-AR2025 p. 32 and p. 39 |
| **Photovoltaic** | **631.07 MW**, about 18% of total capacity | ERE-AR2025 p. 15 and p. 39 |
| Hydro (all owners) | **≈2,636 MW, DERIVED** (3,475 − 631 PV − 208 KESH thermal). ERE gives no single national hydro total. Treat as approximate. | derived from ERE-AR2025 |
| Wind | **0 MW in operation.** The first wind generation licence was issued in 2025: "NIKOLICA SKI RESORT", aeolian plant, 3 MW, ERE Decision no. 301 of 17.11.2025. | ERE-AR2025 p. 126 |
| Licensed but not yet built (PV) | ERE had licensed 980.624 MW of PV by the end of 2025, against 631.07 MW in operation | ERE-AR2025 p. 126 |
| Added in 2025 | 21 plants, 262 MW: 13 PV (181.98 MW) and 8 hydro (80.02 MW) | ERE-AR2025 p. 43 |

### 2.2 Solar growth since 2020

Values read from the ERE charts (ERE-AR2025 Figures 13–15, p. 42; the chart images were extracted from the PDF):

| Year | PV plants (count) | PV installed capacity | PV generation |
|---|---|---|---|
| 2020 | 10 | 21 MW | 32,265 MWh |
| 2021 | 11 | 23 MW | 40,756 MWh |
| 2022 | 11 | 23 MW | 50,092 MWh |
| 2023 | 21 | 188 MW | 80,874 MWh |
| 2024 | 40 | 449 MW | 484,188 MWh |
| 2025 | 53 | 631 MW | 832,347 MWh |

- **Plant count discrepancy:** ERE's own text gives 53 PV plants on p. 16 and 52 on p. 39. The chart shows 53.
- **2019 baseline:** not in ERE's charts. UNVERIFIED.
- These figures are licensed PV *plants*. Rooftop self-producers are counted separately (see section 4).

### 2.3 Named large plants

- **Karavasta Solar (Fier):** 140 MW, connected at 220 kV. It generated 259,224 MWh in 2025 and sells its entire output to KESH. Source: ERE-AR2025 Table 4, p. 41, and p. 16. The developer (Voltalia) is not named in the ERE report and is UNVERIFIED here.
- **Other transmission-connected PV in 2025** (ERE-AR2025 Table 4, p. 41). In 2025 generation order:

  | Plant | Capacity | 2025 generation |
  |---|---|---|
  | Spv Blue 1 | 50 MW | 120,830 MWh |
  | Nova Solar | 50 MW | 113,099 MWh |
  | Sunny Side Solar (commissioned 2025) | 100 MW | 48,919 MWh |
  | Erseka Solar Park 1 | 20 MW | 47,264 MWh |
  | Spv Blue 2 (commissioned 2025) | 50 MW | 30,906 MWh |

  Transmission-level PV totals 410 MW and 620,242 MWh. The table's text extraction is column-shifted. The MW, name and MWh pairs above were checked against the column sums (410 MW and 620,242 MWh) and against Table 5.
- **Spitalla Solar:** 90 MW PV, generation licence by ERE Decision no. 302 of 17.11.2025 (ERE-AR2025 p. 126). Not yet in operation in 2025.
- **Statkraft Devoll hydro:**
  - Moglicë: 184 MW, commercial operation June 2020, about 450 GWh/yr. Source: Balkan Green Energy News, 23 June 2020, https://balkangreenenergynews.com/?p=33338.
  - Banja: about 72 MW, commercial operation autumn 2016, about 255 GWh/yr. Source: statkraft.com Banja page as indexed by search; the page returned 404 on direct fetch 2026-10-23. Partly UNVERIFIED.
  - Devoll valley total: about 700 GWh/yr (same BGEN article).
- **Auctions:** solar and wind auctions have been held since 2019. They produced two solar PV projects totalling 240 MW, and the first successful wind auction (July 2023) awarded three projects totalling 222.48 MW. Source: CMS Expert Guide, last updated 22 Feb 2024, https://cms.law/en/int/expert-guides/cms-expert-guide-to-renewable-energy/albania. This is a law-firm source; the project names and the "Kolonja" wind project are UNVERIFIED.

---

## 3. Solar resource

### 3.1 Global horizontal irradiation by city (GSA)

Source: World Bank/ESMAP Global Solar Atlas API, read 2026-10-23. City-centre coordinates are listed in the table.
- GHI is global horizontal irradiation.
- GTI_opta is irradiation on a plane at the optimum tilt.
- PVOUT is the Solargis-modelled specific yield of a reference fixed-tilt crystalline-silicon system. It is *not* the calculator yield: use the PVGIS stream file `pvgis-albania.json` for the calculator.

| City | lat, lon | GHI kWh/m²/yr | GTI at optimum tilt kWh/m²/yr | Optimum tilt | PVOUT kWh/kWp/yr | Mean air temp °C |
|---|---|---|---|---|---|---|
| Sarandë | 39.8756, 20.0053 | 1,665 | 1,921 | 33° | 1,558 | 16.6 |
| Vlorë | 40.4667, 19.4897 | 1,662 | 1,923 | 34° | 1,550 | 17.3 |
| Fier | 40.7239, 19.5561 | 1,661 | 1,933 | 34° | 1,567 | 16.4 |
| Durrës | 41.3231, 19.4414 | 1,631 | 1,893 | 34° | 1,537 | 16.7 |
| Tiranë | 41.3275, 19.8187 | 1,591 | 1,855 | 34° | 1,504 | 15.4 |
| Korçë | 40.6186, 20.7808 | 1,582 | 1,833 | 34° | 1,505 | 11.3 |
| Gjirokastër | 40.0758, 20.1389 | 1,580 | 1,795 | 34° | 1,450 | 15.9 |
| Elbasan | 41.1125, 20.0822 | 1,573 | 1,832 | 35° | 1,487 | 14.9 |
| Shkodër | 42.0683, 19.5126 | 1,569 | 1,836 | 35° | 1,495 | 15.5 |
| Kukës | 42.0769, 20.4219 | 1,465 | 1,669 | 33° | 1,364 | 12.8 |

Example API call: https://api.globalsolaratlas.info/data/lta?loc=41.3275,19.8187

### 3.2 Older national maps

- **Source:** UNDP/GEF Solar Water Heating programme, presentation by M. Kamberi at the Regional Workshop, Tirana, 20–21 March 2013, slide 2. https://solarthermalworld.org/wp-content/uploads/2013/04/albania_presentation_kamberi_undp_workshop.pdf. The underlying data source of the maps is not named.
- **Annual irradiation map ("Rrezatimi mesatar vjetor"):** the legend runs from <1,200 kWh/m² (northern mountains) to >1,650 kWh/m². The Fier and Vlorë coast sits in the top classes.
- **Annual sunshine-hours map ("Sasia vjetore e orëve me diell"), as read from the map:**
  - **>2,700 h/yr:** Fier–Vlorë coastal plain.
  - **2,500–2,700 h:** Durrës, Tiranë, Lushnjë, Berat, Sarandë.
  - **2,300–2,500 h:** Shkodër, Elbasan, Korçë, Gjirokastër.
  - **2,100–2,300 h:** the north-east, Kukës.
  - **<2,100 h:** the highest mountains.
- **Single city sunshine-hour normals** (e.g. "Tirana 2,544 h") were found only in non-official sources. UNVERIFIED; do not publish.
- **Regulatory sizing assumption:** Instruction 3/2019, point 6, says the installed power of a self-producer's PV plant is sized on an averaged yield of **1,400 kWh/kWp**, "regardless of the region of Albania", until an irradiation map is approved. Source: UDH-3/2019.

---

## 4. Rooftop solar rules: self-producers (vetëprodhues)

### 4.1 The law in force (Law 24/2023)

- Law 24/2023 was approved on 23.3.2023 and repealed Law 7/2017 (Art. 31). Sources: LAW-24/2023, text end and Art. 31.
- Publication in the Official Gazette (no. 64, 14.4.2023) and entry into force on 29.4.2023 are reported by KPMG Albania (https://kpmg.com/al/en/home/insights/2023/05/new-law-on--promotion-of-the-use-of-energy-from-renewable-source.html). This is a secondary source.

**Article 20, "Renewable self-generators":**
- Maximum capacity is **500 kW**.
- They have the right "to generate, consume, store and sell their excess generation", including through bilateral agreements with suppliers.
- The compensation scheme is to be based on **net invoicing (net billing)**. It is set by a Council of Ministers decision together with the application procedure, meter requirements and "the annual period that shall serve to meter their generation" (Art. 20(2)–(3)).
- The price for injected energy is set by ERE under a methodology approved by the Council of Ministers. It must reflect "the market value of energy fed into the grid" (Art. 20(4)).
- Self-generators in the same building, including apartment blocks, may act jointly and share energy (Art. 20(8)).
- Renewable energy communities are covered by Art. 21.

**Article 30(9), transitional provision:**
- Art. 20 "is applicable beginning from 1 January 2024".
- Until then, customers could install up to 500 kW under the **net metering** scheme with a two-way meter at their own cost.
- ERE's English translation says "The net balance and invoice shall be on annual basis for each metering point". This differs from the 2019 instruction's *monthly* netting (see 4.2). Which period applies in practice is UNVERIFIED.

**Article 31(2):** by-laws issued under Law 7/2017 stay in force until the new by-laws are approved.

### 4.2 The by-law still applied: Instruction 3/2019

Source: UDH-3/2019, Ministry of Infrastructure and Energy, 20.6.2019.

- **Who and how much (point 1):** an SME or household may install up to **500 kWp** of solar for self-production.
- **Where (point 2):** on the customer's own building, as "works carried out with a prior declaration" under DCM 408/2015.
- **Netting (point 3):** the net balance and invoicing are done **monthly** for each metering point.
- **Surplus (point 3):** energy above monthly consumption is to be sold to the Universal Service Supplier (FSHU), *after* a purchase-price methodology is approved.
- **Until that methodology exists (point 17):** "teprica e energjisë, që tejkalon konsumin mujor, do t'i kalojë Furnizuesit të Shërbimit Universal pa kundërshpërblim për vetëprodhuesit". In plain terms: monthly surplus passes to FSHU **without payment**.
- **Sizing (points 4 and 6):** the plant is sized on the customer's annual consumption over the last two years (or an energy audit), at the 1,400 kWh/kWp assumption. OSHEE may disconnect a plant designed to exceed the customer's annual consumption (point 15).
- **Meters (point 7d):** a smart **two-way meter** at the grid connection plus a production meter after the inverter, both at the customer's cost.
- **Procedure (points 8 and 13):**
  - OSHEE/OSSH answers within **30 working days**.
  - Missing documents are notified within 5 days and must be completed within 10 days.
  - The customer must install within 6 months of approval.
- **Documents OSSH asks for:** OSHEE's checklist "Dokumentacion për impiant fotovoltaik vetëprodhues" (Nov 2023), https://oshee.al/wp-content/uploads/2023/11/Dokumentacion-per-impiant-PV-vetprodhues.pdf, lists:
  - the request to OSSH
  - the average annual consumption declaration, or an energy audit
  - a project by a licensed designer
  - the two-way meter proposal
  - a technical report
  - inverter and production-meter data
  - the designer's licence (category 10C, implementer NP-10)
  - the municipality permit for works with prior declaration (DCM 408/2015)
  - the ID card
  - the existing contract number, with no unpaid balance

### 4.3 Status 2025–2026 (ERE)

- **Counts:** in 2025 OSSH approved self-producer status for **1,135** of 1,261 applicants (+27.96% vs 2024). That brought the total to **3,551** self-producers (ERE-AR2025 p. 226). The same report says "1,139 new self-producers were connected" on p. 237: an internal discrepancy (1,135 vs 1,139).
- **By category, end-2025** (p. 227):

  | Category | Self-producers |
  |---|---|
  | Non-household | 2,377 |
  | Household | 1,089 |
  | Public institutions | 69 |
  | Non-budgetary institutions | 16 |

- **Growth:** from 175 new self-producers in 2021 to 1,135 in 2025 (p. 227). Most are connected at 0.4 kV.
- **Pending price decision:** the draft Council of Ministers decision on the self-producer price methodology ("a price cap and a price floor applicable to self-producers") was "submitted for comments on 19 December 2025 and is currently undergoing the final approval process" as of the report date (March 2026). After it is approved, ERE will set the sale price (ERE-AR2025 p. 242). **Whether it was adopted after March 2026: UNVERIFIED.**
- **2023 status:** in October 2023 the press reported that surplus could not be sold because no price existed (Shqiptarja.com, 23.10.2023, https://shqiptarja.com/lajm/mie-pengon-shitjen-e-energjise-diellore-nuk-cakton-cmimin-1620-subjekte-spo-shesin-tepricen-ministria-ka-6-muaj-qe-smiraton-aktet-nenligjore). This is consistent with Instruction 3/2019 point 17.
- **ERE purchase price for existing priority producers in 2026:** **10 lekë/kWh** (ERE Decision no. 324, 15.12.2025, in ERE-TAR2026). This is for priority (FiT-era) producers, *not* rooftop self-producers.

**For the calculator:** the honest default is self-consumption savings at the retail tariff, with surplus valued at 0 until a self-producer price is published. Show this as an assumption the user can change.

---

## 5. Regulated electricity tariffs (2025–2026)

### 5.1 In force for 1 Jan – 31 Dec 2026

Retail prices of the Universal Service Supplier (FSHU), approved by **ERE Decision no. 322, 15.12.2025**. Source: ERE-TAR2026.

| Customer group | Price | Peak-hour price |
|---|---|---|
| **Households consuming up to 700 kWh/month** | **8.5 lekë/kWh** | — |
| **Households consuming more than 700 kWh/month** | **9.5 lekë/kWh on the whole month's consumption** ("për të gjithë sasinë e konsumuar", from the 701st kWh the whole bill is at 9.5) | — |
| Common areas of residential buildings (stair lighting, pumps, lifts) | 9.5 lekë/kWh | — |
| Customers connected at 0.4 kV (non-household, low voltage) | **14 lekë/kWh** | **16.1 lekë/kWh** |
| Bakeries / flour production, cat. I | 7.6 lekë/kWh | 8.74 |
| Bakeries with flour products and pastry, cat. II | 9.5 lekë/kWh | 10.93 |
| Bakeries with pastry and coffee service, cat. III | 12 lekë/kWh | 13.80 |
| Places of worship | 9.5 lekë/kWh | — |
| EV charging points/stations above 11 kW at 0.4 kV | **22 lekë/kWh** | **25.3 lekë/kWh** |

- **Peak hours:** 1 Nov – 31 Mar, 18:00–22:00; 1 Apr – 31 Oct, 19:00–23:00 (ERE-TAR2026).
- **Network tariffs in the same table:**
  - Transmission: 0.85 lekë/kWh (Decision 279, 16.12.2024, valid 2025–2027).
  - Distribution, valid 1 Jan – 30 Apr 2026 (Decision 312, 12.12.2025): 1.55 lekë/kWh at 35 kV, 3.99 lekë/kWh at 20/10/6 kV, 6.42 lekë/kWh at 0.4 kV.
  - Fixed charge for a "zero" reading: 200 lekë/month.
  - Reactive energy: 1.92 lekë/kVArh.
- **VAT:** the ERE retail table does not state whether the retail prices include VAT. ERE's market-operator section of the same report says "Mbi tarifat do të aplikohet TVSH-ja" for the exchange tariffs only. **Whether the household 8.5/9.5 prices include VAT is UNVERIFIED.** Check an OSHEE bill or FSHU before showing "incl. VAT".
- **Who is on these prices:** non-household customers at 35 kV and 20/10/6 kV are on the free market or the Supplier of Last Resort, not on these prices.
  - SoLR at 20/10/6 kV: 18.26 lekë/kWh in 2025 (Decision 33, 10.2.2025).
  - SoLR at 35 kV: averaged 15.34 lekë/kWh in 2025.
  - Water utilities: 9.33 lekë/kWh at 35 kV and 11.77 lekë/kWh at 20/10/6 kV (Decision 34, 10.2.2025).
  - Source: ERE-AR2025 p. 19.

### 5.2 Changes in 2025

- **The 2025 decision:** ERE Decision **no. 10, 8.1.2025**, effective 1 Feb – 31 Dec 2025, set households ≤700 kWh/month at 8.5 lekë/kWh and >700 kWh/month at 9.5 lekë/kWh. Non-household prices were unchanged (ERE-AR2025 p. 19 and p. 136).
  - About **87%** of household customers consume below 700 kWh/month (p. 136).
  - The 2025 billing table shows 1,143,413 household bills or customers at 8.50 and 36,599 at 9.50 lekë/kWh; low-voltage non-household customers were at 14.00 lekë/kWh (ERE-AR2025 p. 81).
- **The previous structure** (e.g. 9.5 lekë/kWh up to 800 kWh/month and a higher rate above) is **UNVERIFIED** here.
  - ERE's own report is inconsistent: it calls the 8.5 tier a "reduction" on p. 247 (consumer-protection chapter), while the summary on p. 19 says it "remained" 8.5.
  - Do not publish the old thresholds without the 2024 tariff table.
- **New EV-charging tariff:** Decision **no. 255, 15.10.2025**, effective 1 Nov 2025: 22 lekë/kWh and 25.3 lekë/kWh at peak for chargers above 11 kW. Home chargers up to 11 kW stay on the normal customer-category price (ERE-AR2025 p. 19 and p. 137).
- **Regional comparison (Eurostat, before VAT, 2025):**
  - The average household price in the region's countries was 13.16 lekë/kWh, and the average non-household price 17.43 lekë/kWh (ERE-AR2025 p. 147–148).
  - ERE: "the price level in Albania remains relatively competitive".

---

## 6. Energy efficiency in buildings

- **Law No. 116/2016, "Për performancën e energjisë së ndërtesave"**, dated 10.11.2016.
  - It introduced energy performance certificates.
  - Partial alignment with Directive 2010/31/EU is stated in the co-PLAN/CSO statement, Feb 2025, https://co-plan.org/wp-content/uploads/2025/02/Deklarate-e-OSHC-ve-mbi-Projektligjin-Per-performancen-energjitike-te-ndertesave.pdf (read via search index).
  - The law text is at https://azht.gov.al/wp-content/uploads/2023/12/6.-Ligji-Nr.116-dt.10.11.2016-Per-performancen-e-energjise-se-ndertesave.doc.pdf. That host refused the connection on 2026-10-23, so the article-level details are UNVERIFIED.
- **How certificates work today** (Citizens.al, 5 Dec 2025, https://www.citizens.al/en/2025/12/05/Buildings-without-energy-class--certification-obligations-remain-on-paper/):
  - Certificates are issued by licensed energy auditors.
  - The scale runs from **A+ (most efficient) to G**.
  - Each certificate is deposited with the **Energy Efficiency Agency (Agjencia për Efiçiencën e Energjisë)** within 3 days.
  - A certificate is required for new buildings and major renovations, and must be handed to each buyer or tenant.
  - The EEA told Citizens.al that "**over 150,000 new building units have been certified** to date".
  - No certificates have been issued for existing buildings before 2021.
  - The EEA's certificate archive is not public.
  - Buildings account for **37.08%** of energy consumption.
  - The draft National Building Renovation Plan counts **632,936 dwellings** (2023; 71.2% inhabited), 9,492 public buildings and 85,098 commercial service buildings.
  - All of these are attributed to the EEA or the draft plan through a journalistic source. Treat as secondary.
- **New law on the energy performance of buildings:**
  - A government draft ("Projektligj Nr.___/2024 Për performancën energjetike të ndërtesave") transposes **Directive (EU) 2024/1275**. Source: https://infrastruktura.gov.al/wp-content/uploads/2024/11/Ligji-per-performancen-Energjetike-te-ndertesave.docx (read via search index).
  - The EU Build Up portal (11 Nov 2024, https://build-up.ec.europa.eu/en/news-and-events/news/albanias-step-towards-climate-neutral-building-sector) summarises the draft:
    - minimum energy performance standards for all new and renovated buildings from 2026
    - new public buildings emission-free from 2027
    - all new buildings emission-free from 2030
    - certificates displayed by public institutions
  - A2 News reported parliament approved the law (headline "Parliament approves the law 'on the energy performance of buildings'"). **The law number, adoption date and entry into force are UNVERIFIED**; the page returned 403.
- **Energy efficiency law:** Law No. 124/2015 "Për efiçiencën e energjisë" was amended by Law No. 28/2021 (8.3.2021). This is inferred from the official document title `ligj-2021-03-08-28-ndryshimet-ligjore-per-eficencen-e-energjise.pdf` on bashkiashkoder.gov.al. **UNVERIFIED (content not read).**
- **Municipal programmes** (e.g. Tirana facade insulation or solar subsidies, with amounts): **none found** in tirana.al results or news on 2026-10-23. Gap.
- **ERE awareness strategy:** ERE Decision no. 299 of 17.11.2025 approved a "Strategy … for raising awareness on energy saving and the use of alternative resources, 2025–2030" (ERE-AR2025 p. 195 and p. 246).

---

## 7. Targets and obligations

- **Renewables share target for 2030:** **54.4%** of gross final energy consumption. Law 24/2023, Art. 6(1): "The part of energy from renewable sources to the gross final consumption of energy on 2030 shall be 54.4%."
- **Current renewables share:** **46.6% in 2023**, up from 29.6% in 2004. Source: European Environment Agency, *Europe's environment 2025 – Albania – Renewable energy sources*, published 29 Sept 2025, https://www.eea.europa.eu/en/europe-environment-2025/countries/albania/renewable-energy-sources.
  - The EEA also notes that the National Energy Strategy 2018–2030 aimed at 42%, and that the 2021 NECP aims at 54.4%.
  - The EEA cites a revised NECP 2020–2030 dated October 2024 (details UNVERIFIED).
- **Other NECP headline targets:**
  - GHG emissions −18.7% by 2030 and final energy consumption −8.4%. Source: exit.al, via search index: https://exit.al/en/albania-makes-progress-in-draft-national-energy-and-climate-plan. **UNVERIFIED against the NECP document itself.**
  - The NECP adoption date is reported as 29 Dec 2021 or Feb 2022 by different secondary sources. UNVERIFIED.
- **Capacity targets:** solar or wind MW targets for 2030 were **not found** in a primary source. Gap.
- **Energy Community / EU:**
  - Law 24/2023's stated purpose includes complying "with its commitments under the Energy Community Treaty" (Art. 1).
  - ERE runs a Guarantees of Origin registry within the regional Energy Community system, maintained by EEX/Grexel to the EECS standard (ERE-AR2025 p. 242).
  - Albania–Kosovo market coupling on ALPEX ran through 2025. Traded volumes rose about 32% (ERE-AR2025 p. 14 and p. 20).
  - CACM Regulation entry into force was postponed to 1 July 2026 (ERE-AR2025 p. 19).

---

## 8. Solar water heaters

- **No current (2020s) official count was found.** Gap.
- **UNDP/GEF "Solar Water Heating Market Transformation" programme** (presentation, March 2013, cited in 3.2):
  - Cumulative installed collector area rose year by year to **111,920 m²**, the last bar of the chart. The year is not labelled on the extracted chart; it is probably 2012.
  - Programme objective: 75,000 m² of new collectors over the project, annual sales of 20,000 m², and **520,000 m² by 2020**.
  - The legal framework then included mandatory SWH in new or renovated buildings, plus VAT and customs-duty exemption for imported SWH systems and parts. These 2013 statements are not checked against the current law: UNVERIFIED for today.
- **Later figures (UNVERIFIED):** UNDP web pages (blocked, 403) are cited by search results for 209,745 m² cumulative and 21,701 m²/yr of sales by June 2017, and 74.5 m² per 1,000 inhabitants in 2017. Not confirmed.
- **Hot water from electric boilers:** the statement "over 70% of domestic hot water needs … supplied by electric boilers" comes from the National Energy Strategy era. Old and UNVERIFIED.

---

## STORY NUMBERS

One line each: number · English · Albanian · source · year. Albanian uses `.` for thousands and `,` for decimals.

1. **86,8% / 86.8%** · EN: In 2025, 86.8% of the electricity made in Albania came from hydropower. · SQ: Në vitin 2025, 86,8% e energjisë elektrike të prodhuar në Shqipëri erdhi nga hidrocentralet. · https://www.instat.gov.al/media/mngpviyc/balance-of-electric-power-2025.pdf · 2025
2. **93.5% → 86.8%** · EN: In one year, hydro's share fell from 93.5% to 86.8% as solar came online. · SQ: Brenda një viti, pesha e hidrocentraleve ra nga 93,5% në 86,8%, ndërsa dielli hyri në rrjet. · INSTAT-2025 (same URL) · 2024–2025
3. **21 MW → 631 MW** · EN: Solar plant capacity grew thirtyfold, from 21 MW in 2020 to 631 MW at the end of 2025. · SQ: Kapaciteti i centraleve diellore u rrit tridhjetë herë: nga 21 MW në 2020 në 631 MW në fund të 2025. · https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf (Fig. 14, p. 42) · 2020–2025
4. **832 GWh** · EN: Solar plants generated 832 GWh in 2025, about 11% of domestic electricity. · SQ: Centralet fotovoltaike prodhuan 832 GWh në 2025, rreth 11% e energjisë elektrike vendase. · ERE-AR2025 p. 15 · 2025
5. **4.174 vs 8.076 GWh** · EN: A dry year (2017) gave 4,174 GWh; a wet one (2018) gave 8,076 GWh. Rain still decides the grid. · SQ: Një vit i thatë (2017) dha 4.174 GWh; një vit me reshje (2018) dha 8.076 GWh. Shiu ende vendos për rrjetin. · ERE-AR2025 Table 10, p. 48 · 2017–2018
6. **−21%** · EN: In 2025, water flowing into the Drin cascade was 21% below its 30-year average. · SQ: Në 2025, prurjet në kaskadën e Drinit ishin 21% nën mesataren 30-vjeçare. · ERE-AR2025 p. 13 · 2025
7. **3.375 GWh** · EN: Albania imported 3,375 GWh of electricity in 2025; net imports reached 877 GWh. · SQ: Shqipëria importoi 3.375 GWh energji elektrike në 2025; importi neto arriti 877 GWh. · INSTAT-2025; ERE-AR2025 p. 78 · 2025
8. **3.475 MW** · EN: Albania's power plants add up to 3,475 MW, 262 MW more than a year earlier. · SQ: Centralet e Shqipërisë kanë gjithsej 3.475 MW, 262 MW më shumë se një vit më parë. · ERE-AR2025 p. 13 · 2025
9. **140 MW** · EN: Karavasta, the country's largest solar plant, has 140 MW and generated 259 GWh in 2025. · SQ: Karavasta, centrali më i madh diellor në vend, ka 140 MW dhe prodhoi 259 GWh në 2025. · ERE-AR2025 Table 4, p. 41 · 2025. (Check "largest" against Sunny Side Solar at 100 MW: true by MW at end 2025 per Table 4.)
10. **3.551** · EN: 3,551 homes, businesses and institutions were producing their own solar power by the end of 2025. · SQ: 3.551 familje, biznese dhe institucione prodhonin vetë energji diellore në fund të 2025. · ERE-AR2025 p. 226 · 2025
11. **500 kW** · EN: Any home or business may install up to 500 kW of renewable power for its own use. · SQ: Çdo familje ose biznes mund të instalojë deri në 500 kW energji të rinovueshme për nevojat e veta. · LAW-24/2023 Art. 20(1) · 2023
12. **8,5 lekë/kWh** · EN: Households using up to 700 kWh a month pay 8.5 lekë per kWh in 2026; above that, 9.5 lekë on every kWh. · SQ: Familjet që konsumojnë deri në 700 kWh në muaj paguajnë 8,5 lekë/kWh në 2026; mbi këtë kufi, 9,5 lekë për çdo kWh. · ERE-TAR2026 (Decision 322/2025) · 2026
13. **14 lekë/kWh** · EN: Small businesses on the low-voltage grid pay 14 lekë per kWh, 16.1 at peak hours. · SQ: Bizneset e lidhura në tension të ulët paguajnë 14 lekë/kWh, 16,1 lekë në orët e pikut. · ERE-TAR2026 · 2026
14. **1.665 kWh/m²** · EN: Sarandë, Vlorë and Fier receive about 1,660 kWh of sunlight per square metre each year. · SQ: Saranda, Vlora dhe Fieri marrin rreth 1.660 kWh rrezatim diellor për metër katror në vit. · https://api.globalsolaratlas.info/data/lta?loc=40.7239,19.5561 · long-term average to 2025
15. **46,6% → 54,4%** · EN: Renewables covered 46.6% of Albania's final energy use in 2023; the law targets 54.4% by 2030. · SQ: Burimet e rinovueshme mbuluan 46,6% të konsumit final të energjisë në 2023; ligji synon 54,4% deri në 2030. · https://www.eea.europa.eu/en/europe-environment-2025/countries/albania/renewable-energy-sources and LAW-24/2023 Art. 6 · 2023 / 2030

Use with care:
- **No. 9:** "largest" relies on the ERE capacity table only.
- **No. 4 vs No. 1:** the two use different sources and should not be summed (see section 1.1).
- **Not recommended as story numbers:** "19.0% other renewables in Q2 2026" (INSTAT-Q2-2026) is a single quarter. "150,000+ certified new building units" (Citizens.al quoting the EEA) is secondary.

## Open gaps (summary)

- Whether the Council of Ministers adopted the self-producer price methodology (price cap and floor) after March 2026, and the resulting ERE price.
- Whether netting is monthly (Instruction 3/2019) or annual (Law 24/2023 Art. 30(9)) in practice today.
- Whether household tariffs include VAT, and the pre-2025 household tariff structure (the "800 kWh" threshold).
- An official national hydro capacity figure (≈2,636 MW is derived) and PV capacity in 2019.
- NECP 2030 solar and wind MW targets, and the NECP adoption date and decision number.
- The number, date and entry into force of the 2025 law on the energy performance of buildings.
- Municipal programmes (Tirana facade insulation or solar subsidies) with amounts.
- Current solar-water-heater stock or sales figures.
- City sunshine-hour normals from the hydrometeorological institute (IGEWE).
