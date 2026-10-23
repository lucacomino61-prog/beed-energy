# PV, storage and EV product catalogue — sources and doubts

Read on 2026-10-23. Data file: `products-pv.json` (32 products). Every spec value comes from the manufacturer document or official product page linked below. Where the source does not state a value, the JSON has `null`; I did not estimate any.

**Prices.** The only public prices found come from **Alma Solar** (alma-solarshop.com), an EU online solar shop. It shows prices as "VAT incl." for its default delivery country, Luxembourg, and recalculates VAT for the buyer's country at checkout. These are **not Albanian prices**. I found no public prices on Albanian retailer sites (none were checked successfully, see Gaps). sun.store, Segen and Memodo show prices only after a B2B login, or render them in JavaScript.

**Values I calculated** from datasheet figures. They are marked here and are not quoted from a source:
- Battery `max_continuous_power_kw` where the datasheet gives only current: BYD HVS 10.2 (25 A × 409.6 V), BYD HVM 11.0 (50 A × 204.8 V), Pylontech US5000 (100 A × 48 V), Fronius Reserva 6.3 (32 A × 204.8 V; Fronius notes the inverter limits the current).
- Canadian Solar `performance_warranty_end_pct` (87.4%): 1% loss in year 1, then 0.4% a year to year 30, as stated on the datasheet.

## Solar panels (`solar-panels`)

| Product | Datasheet | Price | Doubts |
|---|---|---|---|
| Jinko Tiger Neo 3.0 JKM670N-66QL6-BDV | [PDF](https://jinkosolarcdn.shwebspace.com/uploads/6aac905e/JKM650-670N-66QL6-BDV-F4-EN.pdf) (linked from jinkosolar.com/en/site/dwtigerneo) | none | Cell count is "264 (66×4)", cut cells. Large 2382 mm format for C&I and ground use. |
| Trina Vertex N TSM-NEG19RC.20, 650 W bin | [PDF](https://www-cdn.trinasolar.com/wwwstorage/sites/3/DT-M-0045-G-EN-K-Datasheet_Vertex_NEG19RC.20_2025_D.pdf) | none | — |
| Trina Vertex S+ TSM-NEG9RP.28Z, 485 W bin | [PDF](https://www-cdn.trinasolar.com/wwwstorage/sites/3/dt-m-0138-g-en-a-datasheet-vertex-sgen3-neg9rp.28z-2026-a-20260811022447788004.pdf) | none | Warranty is contradictory: the warranty graphic says "15-year Product Warranty", a bullet says "up to … 25 year product warranty". JSON uses 15. The datasheet gives no bifaciality, so `bifacial: false` (dual glass). "150 cells" is as printed. |
| AIKO Neostar 3S54 AIKO-A475-MCE54Mb | [PDF](https://aikosolar.com/wp-content/uploads/2026/10/Neostar-3S54_193-AIKO-A-MCE54Mb_460-475W-1762%C3%971134%C3%9730_202608_V1_1_EN.pdf) | none | — |
| Canadian Solar TOPBiHiKu6 CS6.2-54TB-535 | [PDF](https://static.csisolar.com/wp-content/uploads/2022/09/03091611/CS-Datasheet-TOPBiHiKu6_TOPCon-Gen2_CS6.2-54TB_v1.3_EN.pdf) | none | End-of-warranty % is calculated (see above). |
| Canadian Solar TOPHiKu6 All-Black CS6.2-48TD-470 | [PDF](https://static.csisolar.com/wp-content/uploads/2022/09/08131535/CS-Datasheet-TOPHiKu6_All-Black_CS6.2-48TD_v1.5_EN.pdf) | none | The product-warranty years are inside a graphic and cannot be extracted, so `null`. Bifacial set to false because the model is TOPHiKu (monofacial line, not TOPBiHiKu) and the datasheet gives no bifaciality. |
| REC Alpha Pure-R REC430AA | [PDF](https://www.recgroup.com/sites/default/files/2025-01/Web_DS_REC_Alpha_Pure-R_EN.pdf) | none | **This is the HJT module.** Warranty is the standard 20 / 25 years with 92% in year 25. REC ProTrust gives 25 years product warranty, but only with an REC-certified installer. Max system voltage is 1000 V. |
| DMEGC Infinity RT 3.0 DM535G12RT-G54HBW | [PDF](https://www.dmegcsolar.com/upload/img/2026-09/6abb74b3ac921.pdf) | none | Alma Solar sells DM515G12RT-G54**HBB** (bifacial, black, EUR 105). That is a different variant from the HBW datasheet used here, so I attached no price. |

## Inverters (`inverters`)

| Product | Datasheet / official page | Price | Doubts |
|---|---|---|---|
| Huawei SUN2000-10KTL-M1 (hybrid, 3-ph) | [specs page](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/) | EUR 1,169, [Alma](https://www.alma-solarshop.com/huawei-inverter/1577-hybrid-huawei-inverter-sun2000-10ktl-m1-three-phase.html) | Huawei does not label 525/470/146.5 mm as W/H/D; Alma lists L×H×D in that order. Warranty is not on the specs page (Alma says 10 years, not verified). |
| Huawei SUN2000-30KTL-M3 (on-grid C&I) | [official URL, serves the spec PDF](https://solar.huawei.com/en/products/sun2000-30-36-40ktl-m3/) | EUR 2,489, [Alma](https://www.alma-solarshop.com/huawei-inverter/3353-huawei-inverter-sun2000-30ktl-m3.html) | The spec sheet states no max PV power, so `null`. |
| Fronius Symo GEN24 10.0 Plus | [help-center tech data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus) · [datasheet PDF](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Symo_GEN24_GEN24Plus_3_to_10_kW_EN.pdf) | EUR 2,885, [Alma](https://www.alma-solarshop.com/fronius-inverter/1283-hybrid-fronius-inverter-symo-gen24-100-plus.html) | Warranty depends on country and registration, so `null`. |
| Fronius Primo GEN24 5.0 Plus (1-ph) | [help-center tech data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus) | EUR 1,885, [Alma](https://www.alma-solarshop.com/fronius-inverter/1286-hybrid-fronius-inverter-primo-gen24-50-plus.html) | Euro efficiency is 96.3 / 97.2 / 96.7% at 230 / 400 / 530 Vdc; JSON uses 97.2 (400 Vdc nominal). |
| SMA Sunny Tripower 10.0 STP10.0-3AV-40 | [PDF](https://files.sma.de/downloads/STP8-10-3AV-40-DS-en-41.pdf) | EUR 1,209, [Alma](https://www.alma-solarshop.com/sma-inverter/1197-sma-solar-inverter-tripower-100.html) | Warranty 5 years standard; free extension to 10 years with registration, 15 years optional. Set as not battery-ready (no DC battery input). |
| Deye SUN-10K-SG04LP3-EU (48 V hybrid) | [PDF](https://hqcdn.hqsmartcloud.com/deyeinverter/2026/09/15/BDatasheetSUN-5-12K-SG04LP320260911en.pdf) | none | `max_pv_power_kwp` = 20 is "Max. PV access power"; "Max. PV input power" is 15 kW. Warranty "5 Years / Up to 10 Years" depending on country. |
| GoodWe GW10K-ET (ET PLUS+) | [PDF](https://en.goodwe.com/Ftp/EN/Downloads/Datasheet/GW_ET%20PLUS+_Datasheet-EN.pdf) | none | Warranty not on the datasheet. |
| Growatt MOD 10KTL3-XH | [PDF (Growatt AU site, English)](https://au.growatt.com/upload/file/20220815/282c8955f3e1459448fdb889e6ed07bb.pdf) | none | The datasheet is from 2022 (newer German version: de.growatt.com/upload/file/MOD_3-10KTL3-XH_Datenblatt_DE_202306.pdf). Warranty 5 years standard, 10 optional. |

## Batteries (`batteries`)

| Product | Datasheet / official page | Price | Doubts |
|---|---|---|---|
| Huawei LUNA2000-7-S1 | [specs page](https://solar.huawei.com/en/products/luna2000-7-14-21-s1/specs/) | EUR 3,389, [Alma](https://www.alma-solarshop.com/huawei-batterie/3070-huawei-battery-luna2000-s1-7kwh-high-voltage.html) | Huawei lists 3.5 / 7 / 10.5 kW charge-discharge power and 510 / 870 / 1230 mm system heights without saying which goes with which configuration; I matched the first of each to one module. No nominal voltage (only operating ranges 350–560 V 1-ph, 600–980 V 3-ph), no cycle life, no warranty on the page. DoD 100% is the test condition. |
| BYD Battery-Box Premium HVS 10.2 | [PDF](https://bydbatterybox.com/uploads/downloads/BCU2.0_BBOX_HVS_Datasheet_EN_V1.0_250328-67ee42d4ced21.pdf) | none for full tower (Alma: HVS 2.56 module EUR 999 + BCU EUR 535) | Max power is calculated. No cycle life stated. |
| BYD Battery-Box Premium HVM 11.0 | [PDF](https://www.bydbatterybox.com/uploads/downloads/BCU2.0_BBOX_HVM_Datasheet_EN_V1.0_250328-67ee3a426f6ce.pdf) | none | Weight is 153–167 kg depending on module version; JSON uses 167. Max power is calculated. Max 66.24 kWh = 3 × HVM 22.1 towers. |
| Pylontech US5000 | [spec PDF](https://en.pylontech.com.cn/profile/upload/2026/06/23/US%205000%20Spec_1782186290116.pdf) | EUR 879 promo (regular EUR 969), [Alma](https://www.alma-solarshop.com/pylontech-batteries/3451-lithium-battery-pylontech-us5000-48kwh.html) | The PDF's nominal-voltage glyph does not extract ("8"); 48 V is from the product page title. The spec PDF and the web page disagree: cycles >6,000 vs >8,000, max string 20 vs 16. JSON uses the PDF (6,000; 20 × 4.8 = 96 kWh). Indoor IP20. Warranty not verified for the EU. |
| Dyness PowerBox G3 | [product page](https://www.dyness.com/powerbox-g3-low-voltage-residential-battery) · [PDF](https://www.dyness.com/Public/Uploads/uploadfile/files/20261016/DynessPowerboxG3Datasheeten20261009.pdf) | none | The PDF is image-only, so the values come from the official product page. Recommended charge/discharge power is 5.12 kW; JSON uses the 10.24 kW (1C) max discharge. |
| Fronius Reserva 6.3 | [product page tech table](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/reserva) · [datasheet PDF](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Reserva_EN_web.pdf) | EUR 3,229, [Alma](https://www.alma-solarshop.com/batterie-fronius/3554-reserva-631kw-battery-fronius.html) | No DoD or warranty stated. Cycle life 6,000 is from "over 6,000 tested charging cycles". Max power is calculated. |

## EV chargers (`ev-chargers`)

| Product | Datasheet | Price | Doubts |
|---|---|---|---|
| ABB Terra AC W22-T-R-0 (6AGC082152) | [ABB brochure PDF, German](https://library.e.abb.com/public/94d268170a534044bbe5a009b1208af8/9AKK108467A6364_Rev_B_Terra+AC+Wallbox_DE_broschuere_042023.pdf?x-sign=jPSZyI%2FJLlkLjHOo8B8vyf1ZLyQl%2F1Kry89AhEfYXD3mDzgAGOr0lICe7l+6NrOe) | none | 2023 document. Weight not stated. Warranty 24 months, not extendable. |
| Fronius Wattpilot Flex Home 22 C6 | [page](https://www.fronius.com/en/solar-energy/solar-solutions/e-mobility/wattpilot-flex) · [PDF](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Wattpilot_Flex_EN.pdf) | none | Fronius lists 325 × 195 × 105 mm as l × w × h; JSON maps this to h 325, w 195, d 105. The note that the 22 kW model is "currently available in 11 kW" applies to the Flex **Pro**, not the Home. |
| GoodWe HCA G2 GW22K-HCA-20 | [PDF (AU edition)](https://admin.goodwe.com/Ftp/Downloads/Datasheet/AU/GW_HCA-G2_Datasheet-AU.pdf) | none | Only the Australian datasheet was published; check that the EU variant is identical. |
| Deye SUN-EVSE22K01-EU-AC | [PDF](https://hqcdn.hqsmartcloud.com/deyeinverter/2026/08/21/BDatasheetSmartEVCharger20260821en.pdf) | none | The datasheet does not name the plug type (it says only "gun cable 4.2 m"). Housing 104 × 264 × 57.5 mm, as printed. |

## Mounting (`mounting`)

Mounting manufacturers publish no single wind or snow load per product; K2 and Schletter size each roof with their planning tools (K2 Base, Schletter Creator). All load fields are therefore `null`.

| Product | Source | Price | Doubts |
|---|---|---|---|
| K2 SingleRail System (rail SingleRail 36, item 2004258) | [K2 catalogue](https://catalogue.k2-systems.com/en-uk/mounting-systems/pitched-roof-systems/k2-singlerail-system/) | none | Dimensions = rail length only (3,650 mm). Warranty not stated. |
| K2 Dome 6 System (D-Dome 6.10 Base Set, item 2003620) | [K2 catalogue](https://catalogue.k2-systems.com/en-uk/mounting-systems/flat-roof-systems/k2-dome-6-system/) | none | Tilt not stated in the text read (variant names 6.07 / 6.10 / 6.15 suggest the angle, but this is UNVERIFIED), so `null`. Dimension = BasicRail length 2,480 mm. |
| Schletter tiled-roof system (roof hooks + rails & clamps) | [Schletter tiled-roof page](https://www.schletter-group.com/mounting-systems/tiled/) | none | Product family, not one SKU; no dimensions. The 25-year warranty is stated for rails and clamps. The Schletter roof brochure PDF returned 404. |

## PV accessories (`pv-accessories`)

| Product | Datasheet | Price | Doubts |
|---|---|---|---|
| Top Cable TOPSOLAR PV H1Z2Z2-K 1×6 mm² | [PDF](https://www.topcable.com/downloads/pdf/en/topcable-datasheet-topsolar-pv-h1z2z2-k-en.pdf) | none (Alma sells an unbranded "100 m of 6 mm² black solar cable", EUR 134, not matched) | `rated_current_a` = 70 A, for a single cable in free air (67 A on a surface, 57 A for two adjacent cables). Weight is per metre (0.08 kg). |
| IMO SI32-PEL64R-4 enclosed DC isolator | [IMO 2025 Solar brochure](https://imopc-website-files.s3.eu-west-1.amazonaws.com/pdf_catalogues/documents/2025%20Solar%20Product%20Range%20Brochure.pdf) | none | 32 A at 1000 V is for 4 poles in series (DC-PV1). In an outdoor enclosure at 40 °C, Ithe is 30.7 A (25.5 A at 60 °C with solar effects). The part number is built from IMO's ordering scheme. Dimensions are only in drawings. |
| Amphenol Amphe-PV H4 Plus (6 mm²) | [PDF](https://amphenol-industrial.com/wp-content/uploads/amphenol/amphe-pv-h4-plus-cc-ids-106.pdf) | none | Used **instead of Stäubli MC4-Evo 2**, because staubli.com returned 403 to every request. Most modules in this catalogue ship with MC4-EVO2 connectors; H4 only mates with H4 (e.g. Huawei SUN2000-30KTL-M3 uses Amphenol H4 DC connectors). |

## Gaps
- **LONGi and JA Solar**: their sites blocked both fetch routes (longi.com JS-only or blocked, jasolar.com 403/406), so they are not in the catalogue. SolarEdge (403), Zaptec and Wallbox EU (unreachable / 404 / 500), Sungrow (500), Stäubli (403) and Huasun (connection refused) are missing for the same reason.
- **No Albanian retailer or distributor** was checked successfully, so "sold in Albania" is unverified for every product.
- Warranty years are `null` wherever the manufacturer document does not state them (Huawei, Fronius, GoodWe, Pylontech, chargers).
- All prices are from one EU retailer and include its default (Luxembourg) VAT. They are reference prices only.
