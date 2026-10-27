// The renewable-energy guide (/energji-e-rinovueshme, /en/renewable-energy) as typed data. Content only: the
// view renders it. Every number comes from research/ with its source; the research was read on 2026-10-23.
//   research/albania-energy.md (STORY NUMBERS, §1 mix, §2 capacity, §4 self-producers, §5 tariffs, §8 solar water heaters)
//   research/tariffs-prices.md (§0 PVGIS, §1 ERE 2026 tariffs and VAT, §1c surplus, §3d installed prices, §4–5 assumptions)
//   research/pvgis-albania.json (yields per city, Tirana roof variants)
//   research/products-pv.md + .json, research/products-building.md + .json (datasheet values and their links)
//   research/marketplace-ux.md (§6: Memodo's m² per kWp, Unbound's battery formula)
// Three kinds of statement are kept apart and the view must label them differently (labels in src/i18n/renewables.ts):
//   facts      — a sourced number (Fact; `computed: true` = our arithmetic from sourced numbers),
//   guidance   — general engineering guidance, not law and not a measured value (Note kind 'guidance', GuideList.guidance),
//   assumption / unknown — what BeeD assumes, and what the research could not confirm (Note kinds 'assumption', 'unknown').
// Albanian numbers use a no-break space for thousands and a decimal comma (as in src/content/story.ts).
import type { Lang } from '../lib/i18n';
import { checkedOn } from '../lib/compat-view';

export type Bi = Record<Lang, string>;
/** Same shape as `Source` in src/content/story.ts, so the same footnote component renders both. `doc`: the whole
 *  document's label, for a source whose `label` pinpoints a page or an article (guideSources() lists `doc`). */
export type Source = { label: Bi; url: string; doc?: Bi };
/** Same shape as story.ts's `Fact`, plus `computed`: true when the value is our arithmetic from the cited numbers. */
export type Fact = { value: Bi; text: Bi; source: Source; also?: Source; computed?: boolean };
export type NoteKind = 'guidance' | 'assumption' | 'unknown';
/** guidance: general rule of thumb, not law · assumption: what BeeD assumes · unknown: not confirmed in the research. */
export type Note = { kind: NoteKind; text: Bi; source?: Source; also?: Source };
/** `guidance: true`: every item is general guidance, not law; the view shows the guidance tag on the list. */
export type GuideList = { title?: Bi; ordered?: boolean; guidance?: boolean; items: Bi[]; source?: Source; also?: Source };
export type GuidePart = {
  id: string;
  title: Bi;
  paragraphs: Bi[];
  lists?: GuideList[];
  facts?: Fact[];
  notes?: Note[];
  /** Shop shelves for this part (categories.slug_en), first = main shelf. */
  categories?: string[];
};
export type GuideSectionId = 'today' | 'self-producer' | 'tariffs' | 'yield' | 'equipment' | 'faq';
export type GuideSection = Omit<GuidePart, 'id'> & {
  id: GuideSectionId;
  n: number;
  /** One line for the section index. */
  short: Bi;
  /** Sub-parts (section "equipment"). */
  parts?: GuidePart[];
};
export type Faq = { id: string; q: Bi; a: Bi[]; sources: Source[]; computed?: boolean };

export const GUIDE_RESEARCH_READ = '2026-10-23';

// ---------------------------------------------------------------- sources
const ERE_AR_URL = 'https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf';
const ereAr = (sq: string, en: string): Source => ({
  label: { sq: `ERE, Raporti vjetor 2025, ${sq}`, en: `ERE, Annual Report 2025, ${en}` },
  url: ERE_AR_URL,
  doc: { sq: 'ERE, Raporti vjetor 2025', en: 'ERE, Annual Report 2025' },
});
const INSTAT_EL: Source = { label: { sq: 'INSTAT, bilanci i energjisë elektrike 2025', en: 'INSTAT, electricity balance 2025' }, url: 'https://www.instat.gov.al/media/mngpviyc/balance-of-electric-power-2025.pdf' };
const ERE_TAR: Source = {
  label: { sq: 'ERE, tarifat për vitin 2026 (Vendimi 322/2025)', en: 'ERE, tariffs for 2026 (Decision 322/2025)' },
  url: 'https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf',
};
const ERE_VAT: Source = { label: { sq: 'ERE, njoftim i mbledhjes së bordit, 8.1.2025', en: 'ERE, board meeting notice, 8 Jan 2025' }, url: 'https://ere.gov.al/media/files/2025/01/09/Njoftim_Mbledhje_Bordi_nr._02_dt._08.01.2025.pdf' };
const LAW_24_URL = 'https://www.ere.gov.al/media/files/2024/01/31/Law_no._24_2023_On_the_promotion_of_the_use_of_energy_from_renewable_sources.pdf';
const law24 = (sq: string, en: string): Source => ({
  label: { sq: `Ligji 24/2023, ${sq}`, en: `Law 24/2023, ${en}` },
  url: LAW_24_URL,
  doc: { sq: 'Ligji 24/2023', en: 'Law 24/2023' },
});
const INSTR_URL = 'https://web.archive.org/web/20250420015647/https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf';
const instr = (sq: string, en: string): Source => ({
  label: { sq: `Ministria e Infrastrukturës dhe Energjisë, Udhëzimi 3/2019, ${sq}`, en: `Ministry of Infrastructure and Energy, Instruction 3/2019, ${en}` },
  url: INSTR_URL,
  doc: { sq: 'Ministria e Infrastrukturës dhe Energjisë, Udhëzimi 3/2019', en: 'Ministry of Infrastructure and Energy, Instruction 3/2019' },
});
const OSHEE_DOCS: Source = {
  label: { sq: 'OSHEE, dokumentacioni për impiant fotovoltaik vetëprodhues (2023)', en: 'OSHEE, documents for a self-producer PV plant (2023)' },
  url: 'https://oshee.al/wp-content/uploads/2023/11/Dokumentacion-per-impiant-PV-vetprodhues.pdf',
};
const PV_MAG: Source = { label: { sq: 'pv magazine, 27.08.2026', en: 'pv magazine, 27 Aug 2026' }, url: 'https://www.pv-magazine.com/2026/08/27/albanias-solar-market-shifts-toward-storage-market-integration/' };
const EEA: Source = { label: { sq: 'Agjencia Europiane e Mjedisit, 2025', en: 'European Environment Agency, 2025' }, url: 'https://www.eea.europa.eu/en/europe-environment-2025/countries/albania/renewable-energy-sources' };
const PVGIS_LABEL: Bi = { sq: 'PVGIS 5.3, JRC (Komisioni Europian)', en: 'PVGIS 5.3, JRC (European Commission)' };
const pvgis = (lat: number, lon: number): Source => ({ label: PVGIS_LABEL, url: `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&optimalangles=1&outputformat=json` });
const PVGIS_TIRANE = pvgis(41.32833, 19.81806);
/** One fixed-angle PVGIS run at the Tirana point: research/pvgis-albania.json tirane_variants[].api_url, exactly. */
const pvgisTirane = (q: string, sq: string, en: string): Source => ({
  label: { sq: `PVGIS 5.3, JRC (Tiranë, ${sq})`, en: `PVGIS 5.3, JRC (Tirana, ${en})` },
  url: `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=41.32833&lon=19.81806&peakpower=1&loss=14&${q}&outputformat=json`,
});
const PVGIS_T_30 = pvgisTirane('angle=30&aspect=0', '30° jug, panele të ajrosura', '30° south, ventilated panels');
const PVGIS_T_30_FLUSH = pvgisTirane('angle=30&aspect=0&mountingplace=building', '30° jug, panele ngjitur me çatinë', '30° south, panels flush with the roof');
const PVGIS_T_10 = pvgisTirane('angle=10&aspect=0', '10° jug', '10° south');
const PVGIS_T_10_EAST = pvgisTirane('angle=10&aspect=-90', '10° lindje', '10° east');
const PVGIS_T_10_WEST = pvgisTirane('angle=10&aspect=90', '10° perëndim', '10° west');
const PVGIS_T_0 = pvgisTirane('angle=0&aspect=0', '0°', '0°');
const PVGIS_MANUAL: Source = {
  label: { sq: 'PVGIS, manuali i përdoruesit (JRC)', en: 'PVGIS user manual (JRC)' },
  url: 'https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/pvgis-user-manual_en',
};
const DEGRADATION: Source = { label: { sq: 'Jordan & Kurtz, NREL, 2013', en: 'Jordan & Kurtz, NREL, 2013' }, url: 'https://www.osti.gov/biblio/1045052' };
const MEMODO: Source = { label: { sq: 'Memodo, kalkulatori i pavarësisë energjetike', en: 'Memodo, independence calculator' }, url: 'https://www.memodo-shop.com/m/tools/independence-calculator/' };
const UNBOUND: Source = { label: { sq: 'Unbound Solar, përmasimi i baterisë', en: 'Unbound Solar, battery bank sizing' }, url: 'https://www.unboundsolar.com/solar-information/battery-bank-sizing' };
const IEA_IT: Source = { label: { sq: 'IEA PVPS, raporti kombëtar i Italisë 2024', en: 'IEA PVPS, National Survey Report Italy 2024' }, url: 'https://iea-pvps.org/national_survey/nsr-italy-2024/' };
const PRISHTINA: Source = { label: { sq: 'Prishtina Insight, 21.07.2025', en: 'Prishtina Insight, 21 Jul 2025' }, url: 'https://prishtinainsight.com/kosovo-households-and-businesses-turn-to-solar-energy-to-reduce-costs-mag/' };
const BOA: Source = { label: { sq: 'Banka e Shqipërisë, kursi zyrtar më 22.10.2026', en: 'Bank of Albania, official rate on 22 Oct 2026' }, url: 'https://www.bankofalbania.org/Tregjet/Kursi_zyrtar_i_kembimit/' };
const UNDP_SWH: Source = {
  label: { sq: 'UNDP/GEF, programi i ngrohjes diellore të ujit (2013)', en: 'UNDP/GEF Solar Water Heating programme (2013)' },
  url: 'https://solarthermalworld.org/wp-content/uploads/2013/04/albania_presentation_kamberi_undp_workshop.pdf',
};
const sheet = (name: string, url: string): Source => ({ label: { sq: `${name}, fleta teknike`, en: `${name}, datasheet` }, url });
const JINKO = sheet('Jinko Tiger Neo 3.0 670 Wp', 'https://jinkosolarcdn.shwebspace.com/uploads/6aac905e/JKM650-670N-66QL6-BDV-F4-EN.pdf');
const TRINA = sheet('Trina Vertex N 650 Wp', 'https://www-cdn.trinasolar.com/wwwstorage/sites/3/DT-M-0045-G-EN-K-Datasheet_Vertex_NEG19RC.20_2025_D.pdf');
const REC = sheet('REC Alpha Pure-R 430 Wp', 'https://www.recgroup.com/sites/default/files/2025-01/Web_DS_REC_Alpha_Pure-R_EN.pdf');
const AIKO = sheet('AIKO Neostar 3S54 475 Wp', 'https://aikosolar.com/wp-content/uploads/2026/10/Neostar-3S54_193-AIKO-A-MCE54Mb_460-475W-1762%C3%971134%C3%9730_202608_V1_1_EN.pdf');
const SMA = sheet('SMA Sunny Tripower 10.0', 'https://files.sma.de/downloads/STP8-10-3AV-40-DS-en-41.pdf');
const HUAWEI_M1 = sheet('Huawei SUN2000-10KTL-M1', 'https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/');
const HUAWEI_M3 = sheet('Huawei SUN2000-30KTL-M3', 'https://solar.huawei.com/en/products/sun2000-30-36-40ktl-m3/');
const DEYE_INV = sheet('Deye SUN-10K-SG04LP3-EU', 'https://hqcdn.hqsmartcloud.com/deyeinverter/2026/09/15/BDatasheetSUN-5-12K-SG04LP320260911en.pdf');
const FRONIUS_PRIMO = sheet('Fronius Primo GEN24 5.0 Plus', 'https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus');
const PYLONTECH = sheet('Pylontech US5000', 'https://en.pylontech.com.cn/profile/upload/2026/06/23/US%205000%20Spec_1782186290116.pdf');
const BYD_HVS = sheet('BYD Battery-Box Premium HVS 10.2', 'https://bydbatterybox.com/uploads/downloads/BCU2.0_BBOX_HVS_Datasheet_EN_V1.0_250328-67ee42d4ced21.pdf');
const DAIKIN_HP = sheet(
  'Daikin Altherma 3 R',
  'https://www.daikin.eu/content/dam/global-assets/internet-denv/catalogues_brochures/commercial/Daikin%20Altherma%203%20R%20Product%20Catalogue%20ECPEN22-786.pdf',
);
const VAILLANT = sheet('Vaillant aroTHERM plus VWL 75/6', 'https://www.vaillant.co.uk/product-images/0020330791-03.pdf.pdf');
const VAILLANT_PAGE: Source = { label: { sq: 'Vaillant, faqja e aroTHERM plus', en: 'Vaillant, aroTHERM plus page' }, url: 'https://www.vaillant.co.uk/product-systems/heat-pumps/arotherm-plus/' };
const CALPAK = sheet('Calpak Mark-5 160/2.6', 'https://calpak.gr/wp-content/uploads/2024/10/Mark5_brochure_2022.05.08_EN_high-res-1.pdf');
const WATTPILOT = sheet('Fronius Wattpilot Flex Home 22', 'https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Wattpilot_Flex_EN.pdf');

// ---------------------------------------------------------------- solar yield data (research/pvgis-albania.json)
/** PVGIS 5.3, 1 kWp crystalline silicon, free-standing, optimal tilt and azimuth, 14% losses, 2005–2023. Azimuth: 0 = south, −90 = east, +90 = west. */
export type CityYield = {
  slug: string;
  name: Bi;
  kwhPerKwp: number;
  tiltDeg: number;
  azimuthDeg: number;
  /** Worst month (December in every city) and best month (July in every city), kWh per kWp. */
  decKwhPerKwp: number;
  julKwhPerKwp: number;
  source: Source;
};
const cy = (slug: string, sq: string, en: string, lat: number, lon: number, kwhPerKwp: number, tiltDeg: number, azimuthDeg: number, dec: number, jul: number): CityYield => ({
  slug, name: { sq, en }, kwhPerKwp, tiltDeg, azimuthDeg, decKwhPerKwp: dec, julKwhPerKwp: jul, source: pvgis(lat, lon),
});
/** Highest yield first. */
export const CITY_YIELDS: CityYield[] = [
  cy('fier', 'Fier', 'Fier', 40.725, 19.55722, 1520.98, 35, 0, 85.69, 166.59),
  cy('durres', 'Durrës', 'Durrës', 41.31333, 19.44583, 1517.05, 36, 1, 81.26, 168.55),
  cy('sarande', 'Sarandë', 'Sarandë', 39.875, 20.01, 1500.04, 34, 2, 81.44, 167.59),
  cy('lushnje', 'Lushnjë', 'Lushnjë', 40.933, 19.7, 1493.99, 36, -1, 85.16, 163.92),
  cy('vlore', 'Vlorë', 'Vlorë', 40.46667, 19.48333, 1489.21, 35, -1, 81.33, 165.72),
  cy('lezhe', 'Lezhë', 'Lezhë', 41.78194, 19.64444, 1473.71, 36, 3, 79.08, 166.41),
  cy('elbasan', 'Elbasan', 'Elbasan', 41.11111, 20.08056, 1451.4, 36, -5, 83.76, 160.56),
  cy('berat', 'Berat', 'Berat', 40.70222, 19.95833, 1447.5, 35, -10, 81.38, 162.51),
  cy('tirane', 'Tiranë', 'Tirana', 41.32833, 19.81806, 1435.3, 36, -4, 81.83, 161.07),
  cy('shkoder', 'Shkodër', 'Shkodër', 42.06806, 19.51194, 1428.48, 36, 0, 77.03, 161.97),
  cy('gjirokaster', 'Gjirokastër', 'Gjirokastër', 40.067, 20.133, 1383.93, 34, -16, 71.42, 162.2),
  cy('pogradec', 'Pogradec', 'Pogradec', 40.9, 20.65, 1379.19, 34, -13, 63.85, 161.84),
  cy('korce', 'Korçë', 'Korçë', 40.61667, 20.76667, 1371.26, 34, -8, 69.91, 156.8),
  cy('kukes', 'Kukës', 'Kukës', 42.083, 20.417, 1357.55, 35, -6, 63.85, 159.45),
];

/** Tirana roof variants (same point, 14% losses). `vsOptimalPct` is computed: yield ÷ 1435.3 − 1, rounded to 0.1. */
export type RoofVariant = { key: string; label: Bi; tiltDeg: number; azimuth: Bi; kwhPerKwp: number; vsOptimalPct: number; note?: Bi };
export const TIRANE_ROOF_VARIANTS: RoofVariant[] = [
  { key: 'optimal', label: { sq: 'Pjerrësia më e mirë, strukturë e ajrosur', en: 'Best tilt, ventilated frame' }, tiltDeg: 36, azimuth: { sq: 'jug (−4°)', en: 'south (−4°)' }, kwhPerKwp: 1435.3, vsOptimalPct: 0 },
  { key: 'south_30', label: { sq: 'Çati e pjerrët 30°, panele të ajrosura nga pas', en: 'Pitched roof 30°, panels ventilated at the back' }, tiltDeg: 30, azimuth: { sq: 'jug', en: 'south' }, kwhPerKwp: 1428.52, vsOptimalPct: -0.5 },
  {
    key: 'south_30_building', label: { sq: 'Çati e pjerrët 30°, panele ngjitur me çatinë', en: 'Pitched roof 30°, panels flush with the roof' }, tiltDeg: 30, azimuth: { sq: 'jug', en: 'south' }, kwhPerKwp: 1368.56, vsOptimalPct: -4.6,
    note: { sq: '4,2% më pak se e njëjta çati me panele të ajrosura: pa ajër nga pas, panelet nxehen më shumë.', en: '4.2% less than the same roof with ventilated panels: with no air behind them, the panels run hotter.' },
  },
  { key: 'south_10', label: { sq: 'Tarracë, 10°', en: 'Flat roof, 10°' }, tiltDeg: 10, azimuth: { sq: 'jug', en: 'south' }, kwhPerKwp: 1321.36, vsOptimalPct: -7.9 },
  {
    key: 'east_west_10', label: { sq: 'Tarracë, 10°, gjysma nga lindja e gjysma nga perëndimi', en: 'Flat roof, 10°, half east and half west' }, tiltDeg: 10, azimuth: { sq: 'lindje–perëndim', en: 'east–west' }, kwhPerKwp: 1208.71, vsOptimalPct: -15.8,
    note: { sq: 'Mesatarja e dy llogaritjeve PVGIS, lindje (1 213,96) dhe perëndim (1 203,46).', en: 'Mean of two PVGIS runs, east (1,213.96) and west (1,203.46).' },
  },
  { key: 'horizontal', label: { sq: 'Horizontale (0°)', en: 'Horizontal (0°)' }, tiltDeg: 0, azimuth: { sq: '—', en: '—' }, kwhPerKwp: 1219.84, vsOptimalPct: -15 },
];
/** One PVGIS run per row (east–west is the mean of the east and west runs), in the table's order. */
export const TIRANE_ROOF_SOURCES: Source[] = [
  { label: { sq: 'PVGIS 5.3, JRC (Tiranë, pjerrësia më e mirë)', en: 'PVGIS 5.3, JRC (Tirana, best tilt)' }, url: PVGIS_TIRANE.url },
  PVGIS_T_30,
  PVGIS_T_30_FLUSH,
  PVGIS_T_10,
  PVGIS_T_10_EAST,
  PVGIS_T_10_WEST,
  PVGIS_T_0,
];

// ---------------------------------------------------------------- the guide
export const GUIDE: GuideSection[] = [
  {
    id: 'today',
    n: 1,
    title: { sq: 'Energjia elektrike e Shqipërisë sot', en: 'Albania’s electricity today' },
    short: { sq: 'Hidrocentralet, dielli, vitet e thata dhe importi', en: 'Hydro, solar, dry years and imports' },
    paragraphs: [
      {
        sq: 'Shumica e madhe e energjisë elektrike që prodhohet në Shqipëri vjen nga hidrocentralet. Prandaj prodhimi ndryshon shumë nga një vit në tjetrin: kur bie pak shi, vendi importon; kur bie shumë, eksporton.',
        en: 'Most of the electricity made in Albania comes from hydropower plants, so output swings a lot from one year to the next: when little rain falls the country imports, and when a lot falls it exports.',
      },
      {
        sq: 'Dielli po zë vend shpejt. Kapaciteti i centraleve fotovoltaike u rrit nga 21 MW në 2020 në 631 MW në fund të 2025, dhe vetëm në 2025 u shtuan 13 centrale diellore me 182 MW. Era ende nuk prodhon: në fund të 2025 nuk kishte asnjë central me erë në punë.',
        en: 'Solar is catching up fast. Photovoltaic plant capacity grew from 21 MW in 2020 to 631 MW at the end of 2025, and 13 solar plants with 182 MW were added in 2025 alone. Wind does not produce yet: no wind farm was in operation at the end of 2025.',
      },
      {
        sq: 'Peshat e prodhimit më poshtë janë të INSTAT-it; kapaciteti dhe vitet e thata janë të ERE-s. Dy institucionet i numërojnë ndryshe centralet diellore, prandaj shifrat e tyre nuk mblidhen bashkë.',
        en: 'The generation shares below are INSTAT’s; capacity and the dry-year figures are ERE’s. The two count solar plants differently, so their figures should not be added together.',
      },
    ],
    facts: [
      {
        value: { sq: '86,8%', en: '86.8%' },
        text: {
          sq: 'e energjisë elektrike të prodhuar në vend në 2025 erdhi nga hidrocentralet dhe 13,2% nga prodhues të tjerë të energjisë së rinovueshme. Në 2024 pesha e hidrocentraleve ishte 93,5%.',
          en: 'of the electricity generated in Albania in 2025 came from hydropower and 13.2% from other renewable producers. In 2024 hydro’s share was 93.5%.',
        },
        source: INSTAT_EL,
      },
      {
        value: { sq: '21 → 631 MW', en: '21 → 631 MW' },
        text: {
          sq: 'kapaciteti i centraleve fotovoltaike nga 2020 deri në fund të 2025: rreth 18% e 3 475 MW që kanë gjithsej centralet e vendit.',
          en: 'of photovoltaic plant capacity from 2020 to the end of 2025: about 18% of the 3,475 MW of all the country’s power plants.',
        },
        source: ereAr('f. 15 dhe 42', 'pp. 15 and 42'),
      },
      {
        value: { sq: '4 174 / 8 076 GWh', en: '4,174 / 8,076 GWh' },
        text: {
          sq: 'prodhoi vendi në një vit të thatë (2017) dhe në një vit me reshje (2018): prodhimi pothuajse u dyfishua nga njëri vit te tjetri.',
          en: 'generated in a dry year (2017) and in a wet one (2018): output almost doubled from one year to the next.',
        },
        source: ereAr('tabela 10, f. 48', 'Table 10, p. 48'),
      },
      {
        value: { sq: '−21%', en: '−21%' },
        text: {
          sq: 'ishin prurjet në rezervuarin e Fierzës (kaskada e Drinit) në 2025, krahasuar me mesataren 30-vjeçare.',
          en: 'was the inflow to the Fierza reservoir (Drin cascade) in 2025, against its 30-year average.',
        },
        source: ereAr('f. 13', 'p. 13'),
      },
      {
        value: { sq: '3 375 GWh', en: '3,375 GWh' },
        text: {
          sq: 'energji elektrike importoi Shqipëria në 2025; pasi zbriten eksportet, importi neto ishte 877 GWh.',
          en: 'of electricity were imported in 2025; after exports, net imports were 877 GWh.',
        },
        source: INSTAT_EL,
        also: ereAr('f. 78', 'p. 78'),
      },
      {
        value: { sq: '0 MW', en: '0 MW' },
        text: {
          sq: 'centrale me erë në punë në fund të 2025. Licenca e parë për prodhim nga era (3 MW) u dha po atë vit.',
          en: 'of wind power in operation at the end of 2025. The first wind generation licence (3 MW) was granted that same year.',
        },
        source: ereAr('f. 126', 'p. 126'),
      },
      {
        value: { sq: '46,6% → 54,4%', en: '46.6% → 54.4%' },
        text: {
          sq: 'e konsumit final bruto të energjisë mbulohej nga burimet e rinovueshme në 2023; ligji synon 54,4% deri në 2030. Këtu hyn e gjithë energjia, jo vetëm ajo elektrike.',
          en: 'of gross final energy consumption came from renewable sources in 2023; the law targets 54.4% by 2030. This covers all energy, not only electricity.',
        },
        source: EEA,
        also: law24('neni 6', 'Art. 6'),
      },
    ],
  },
  {
    id: 'self-producer',
    n: 2,
    title: { sq: 'Si bëheni vetëprodhues', en: 'Becoming a self-producer' },
    short: { sq: 'Kush mund, hapat me OSSH-në, teprica dhe pyetjet për instaluesin', en: 'Who may, the steps with the grid operator, surplus, questions for the installer' },
    paragraphs: [
      {
        sq: 'Vetëprodhues është familja, biznesi ose institucioni që prodhon vetë energji nga burime të rinovueshme për nevojat e veta. Ligji 24/2023 (neni 20) u jep vetëprodhuesve të drejtën të prodhojnë, të konsumojnë, të ruajnë dhe të shesin energjinë që u tepron, me një impiant deri në 500 kW.',
        en: 'A self-producer is a household, business or institution that generates renewable energy for its own use. Law 24/2023 (Article 20) gives self-producers the right to generate, consume, store and sell their surplus, with a plant of up to 500 kW.',
      },
      {
        sq: '500 kW është kufiri i sipërm, jo madhësia që ju takon. Madhësinë e cakton konsumi juaj: Udhëzimi 3/2019 e llogarit nga konsumi vjetor i dy viteve të fundit (ose nga një auditim energjetik), me 1 400 kWh në vit për çdo kWp, në çdo zonë të vendit. OSHEE mund ta shkëpusë një impiant të projektuar për të prodhuar më shumë se konsumi vjetor i klientit.',
        en: '500 kW is the ceiling, not your entitlement. Your consumption sets the size: Instruction 3/2019 works it out from your yearly use over the last two years (or from an energy audit), at 1,400 kWh a year per kWp anywhere in the country. OSHEE may disconnect a plant designed to produce more than the customer’s yearly use.',
      },
      {
        sq: 'Hapat më poshtë janë ata të Udhëzimit 3/2019 dhe të listës së dokumenteve që OSHEE publikoi në nëntor 2023. Udhëzimi u nxor sipas ligjit të vjetër (7/2017) dhe mbetet në fuqi derisa të miratohen aktet e reja (Ligji 24/2023, neni 31). Sipas pv magazine, rregullat e nxjerra në maj 2026 caktojnë procedurën e lidhjes dhe të kompensimit për vetëprodhuesit me faturim neto (net billing). Ne nuk i kemi lexuar këto rregulla, prandaj pyesni OSSH-në cilën procedurë dhe cilat dokumente kërkon sot.',
        en: 'The steps below are those of Instruction 3/2019 and of the document checklist OSHEE published in November 2023. The instruction was issued under the old law (7/2017) and stays in force until the new by-laws are adopted (Law 24/2023, Art. 31). According to pv magazine, rules issued in May 2026 set the connection and compensation procedure for self-producers under net billing. We have not read those rules, so ask the grid operator (OSSH) which procedure and which documents it asks for today.',
      },
    ],
    lists: [
      {
        title: { sq: 'Hapat sipas Udhëzimit 3/2019 dhe listës së OSHEE-së', en: 'The steps under Instruction 3/2019 and OSHEE’s checklist' },
        ordered: true,
        source: instr('pikat 2, 4, 6, 7, 8 dhe 13', 'points 2, 4, 6, 7, 8 and 13'),
        also: OSHEE_DOCS,
        items: [
          {
            sq: 'Mblidhni faturat e dy viteve të fundit: konsumi vjetor është baza e përmasimit. Në vend të tyre mund të paraqitet një auditim energjetik.',
            en: 'Gather the last two years of bills: yearly consumption is the basis for sizing. An energy audit can be submitted instead.',
          },
          {
            sq: 'Një projektues i licencuar harton projektin dhe raportin teknik. Lista e OSHEE-së kërkon licencën e projektuesit (kategoria 10C) dhe të zbatuesit (NP-10).',
            en: 'A licensed designer draws up the project and the technical report. OSHEE’s checklist asks for the designer’s licence (category 10C) and the installer’s (NP-10).',
          },
          {
            sq: 'Merrni lejen e bashkisë për punime me deklaratë paraprake (VKM 408/2015). Impianti vendoset në ndërtesën tuaj.',
            en: 'Get the municipality’s permit for works with a prior declaration (DCM 408/2015). The plant goes on your own building.',
          },
          {
            sq: 'Dorëzojini OSSH-së kërkesën me dokumentet: deklaratën e konsumit mesatar vjetor ose auditimin, projektin, propozimin për matësin dypalësh, raportin teknik, të dhënat e inverterit dhe të matësit të prodhimit, licencën e projektuesit, lejen e bashkisë, kartën e identitetit dhe numrin e kontratës ekzistuese, pa detyrime të papaguara.',
            en: 'Submit the request to OSSH with: the average yearly consumption declaration or the audit, the project, the two-way meter proposal, the technical report, the inverter and production-meter data, the designer’s licence, the municipal permit, your ID card and your existing contract number, with nothing left unpaid.',
          },
          {
            sq: 'OSSH përgjigjet brenda 30 ditëve pune. Nëse mungon një dokument, ju njofton brenda 5 ditëve dhe ju keni 10 ditë për ta plotësuar.',
            en: 'OSSH answers within 30 working days. If a document is missing it tells you within 5 days, and you have 10 days to complete it.',
          },
          {
            sq: 'Pas miratimit keni 6 muaj për instalimin. Vendosen dy matës, me shpenzimet tuaja: një matës inteligjent dypalësh në pikën e lidhjes me rrjetin dhe një matës prodhimi pas inverterit.',
            en: 'After approval you have 6 months to install. Two meters go in, at your cost: a smart two-way meter at the grid connection and a production meter after the inverter.',
          },
        ],
      },
      {
        title: { sq: 'Çfarë ndodh me energjinë që tepron', en: 'What happens to your surplus' },
        items: [
          {
            sq: 'Udhëzimi 3/2019 (pika 3) e bën balancën neto çdo muaj. Energjia mbi konsumin e muajit do t’i shitej Furnizuesit të Shërbimit Universal (FSHU) pasi të miratohej metodologjia e çmimit; deri atëherë, sipas pikës 17, teprica i kalon FSHU-së pa kundërshpërblim.',
            en: 'Instruction 3/2019 (point 3) nets production against use every month. Energy above the month’s use was to be sold to the Universal Service Supplier (FSHU) once a price method was approved; until then, under point 17, the surplus passes to FSHU without payment.',
          },
          {
            sq: 'Ligji 24/2023 kalon te faturimi neto (net billing): çmimin e energjisë së dorëzuar në rrjet e cakton ERE dhe ai duhet të pasqyrojë vlerën e saj në treg (neni 20). Neni 20 zbatohet nga 1 janari 2024 (neni 30).',
            en: 'Law 24/2023 moves to net billing: ERE sets the price of energy fed into the grid, and it must reflect that energy’s market value (Art. 20). Article 20 applies from 1 January 2024 (Art. 30).',
          },
          {
            sq: 'Në mars 2026 ERE shkruante se projektvendimi për metodologjinë e çmimit, me një çmim tavan dhe një çmim dysheme për vetëprodhuesit, ishte në miratim përfundimtar. A u miratua më pas, nuk e kemi verifikuar.',
            en: 'In March 2026 ERE wrote that the draft decision on the price method, with a price cap and a price floor for self-producers, was in final approval. Whether it was adopted since, we have not verified.',
          },
          {
            sq: 'Rregullat e majit 2026 caktojnë procedurën e kompensimit me faturim neto (pv magazine). Për këto rregulla nuk kemi gjetur ende një çmim të publikuar në lekë/kWh për energjinë që i jepni rrjetit.',
            en: 'The May 2026 rules set the compensation procedure under net billing (pv magazine). For those rules we have not yet found a published price in lekë/kWh for the energy you feed into the grid.',
          },
        ],
        source: instr('pikat 3 dhe 17', 'points 3 and 17'),
        also: PV_MAG,
      },
      {
        title: { sq: 'Çfarë t’i kërkoni instaluesit', en: 'What to ask an installer' },
        guidance: true,
        items: [
          { sq: 'Cilën procedurë do të ndjekë me OSSH-në (Udhëzimi 3/2019 apo rregullat e majit 2026) dhe kush i dorëzon dokumentet.', en: 'Which procedure they will follow with OSSH (Instruction 3/2019 or the May 2026 rules) and who submits the documents.' },
          { sq: 'Licencat: të projektuesit (10C) dhe të zbatuesit (NP-10), siç i kërkon lista e OSHEE-së.', en: 'Their licences: the designer’s (10C) and the installer’s (NP-10), as OSHEE’s checklist requires.' },
          { sq: 'Si e ka përmasuar impiantin: nga konsumi juaj i dy viteve, me sa kWh për kWp në qytetin dhe në çatinë tuaj, dhe a e kalon konsumin vjetor.', en: 'How they sized the plant: from your two years of use, at how many kWh per kWp for your city and roof, and whether it exceeds your yearly use.' },
          { sq: 'Fletët teknike të paneleve, të inverterit dhe të baterisë, dhe a punon bateria me inverterin (tension i lartë apo 48 V).', en: 'The datasheets of the panels, the inverter and the battery, and whether the battery works with the inverter (high voltage or 48 V).' },
          { sq: 'Çfarë përfshin çmimi: strukturën e montimit, kabllot dhe lidhësit, ndërprerësin DC dhe mbrojtjet, dy matësit, projektin, instalimin, lejet dhe aplikimin te OSSH.', en: 'What the price includes: mounting, cables and connectors, the DC isolator and protection devices, both meters, the project, installation, permits and the OSSH application.' },
          { sq: 'Garancitë me shkrim: e produktit dhe e performancës për panelet, e inverterit, e baterisë dhe e punës së instalimit, si dhe kush i trajton reklamimet.', en: 'Written warranties: product and performance warranties for the panels, the inverter’s, the battery’s and the installation work’s, and who handles claims.' },
          { sq: 'Si do ta shihni prodhimin (monitorimi) dhe kush e mirëmban impiantin.', en: 'How you will see production (monitoring) and who maintains the plant.' },
          { sq: 'Afatet: kur dorëzohet kërkesa, kur pritet përgjigjja e OSSH-së dhe kur instalohet.', en: 'The timeline: when the request is filed, when OSSH’s answer is due and when the plant goes in.' },
        ],
      },
    ],
    facts: [
      {
        value: { sq: '500 kW', en: '500 kW' },
        text: {
          sq: 'është kufiri ligjor i impiantit të një vetëprodhuesi, familje ose biznes; madhësia varet nga konsumi vjetor dhe miratohet nga OSSH.',
          en: 'is the legal cap for a self-producer’s plant, home or business; the size follows yearly use and is approved by the grid operator.',
        },
        source: law24('neni 20', 'Art. 20'),
        also: instr('pikat 4, 6 dhe 15', 'points 4, 6 and 15'),
      },
      {
        value: { sq: '3 551', en: '3,551' },
        text: {
          sq: 'vetëprodhues ishin në fund të 2025: 2 377 jo-familjarë, 1 089 familje, 69 institucione publike dhe 16 institucione jobuxhetore.',
          en: 'self-producers existed at the end of 2025: 2,377 non-household, 1,089 households, 69 public institutions and 16 non-budgetary institutions.',
        },
        source: ereAr('f. 226–227', 'pp. 226–227'),
      },
      {
        value: { sq: '1 135', en: '1,135' },
        text: {
          sq: 'nga 1 261 aplikues i miratoi OSSH si vetëprodhues në 2025, 27,96% më shumë se në 2024.',
          en: 'of 1,261 applicants were approved as self-producers by the grid operator in 2025, 27.96% more than in 2024.',
        },
        source: ereAr('f. 226', 'p. 226'),
      },
      {
        value: { sq: '30 ditë pune', en: '30 working days' },
        text: {
          sq: 'ka OSSH për t’iu përgjigjur kërkesës sipas Udhëzimit 3/2019; pas miratimit, impianti instalohet brenda 6 muajve.',
          en: 'is the grid operator’s deadline to answer a request under Instruction 3/2019; after approval, the plant must be installed within 6 months.',
        },
        source: instr('pikat 8 dhe 13', 'points 8 and 13'),
      },
    ],
    notes: [
      {
        kind: 'unknown',
        text: {
          sq: 'Nuk e dimë nëse balanca bëhet sot çdo muaj (Udhëzimi 3/2019) apo çdo vit (Ligji 24/2023, neni 30/9), as nëse rregullat e majit 2026 i kanë ndryshuar afatet dhe dokumentet e mësipërme.',
          en: 'We do not know whether netting is done monthly today (Instruction 3/2019) or yearly (Law 24/2023, Art. 30(9)), nor whether the May 2026 rules changed the deadlines and documents above.',
        },
        source: law24('neni 30/9', 'Art. 30(9)'),
        also: PV_MAG,
      },
      {
        kind: 'assumption',
        text: {
          sq: 'Prandaj në kalkulator energjinë që tepron e llogarisim me 0 lekë. Energjia që përdorni vetë vlen sa tarifa që nuk e paguani më.',
          en: 'So in the calculator we count surplus energy at 0 lekë. Energy you use yourself is worth the tariff you no longer pay.',
        },
        source: instr('pika 17', 'point 17'),
      },
      {
        kind: 'unknown',
        text: {
          sq: 'Sipas pv magazine, Ligji 59/2026 për sektorin e energjisë elektrike hyri në fuqi në korrik 2026 dhe njeh “klientë aktivë” që prodhojnë, konsumojnë, ruajnë dhe shesin energji. Si ndikon kjo te vetëprodhuesit, nuk e kemi verifikuar në tekstin e ligjit.',
          en: 'According to pv magazine, Law 59/2026 on the power sector entered into force in July 2026 and recognises “active clients” who generate, consume, store and sell electricity. How this affects self-producers we have not checked in the law itself.',
        },
        source: PV_MAG,
      },
    ],
    categories: ['solar-panels', 'inverters', 'energy-monitoring'],
  },
  {
    id: 'tariffs',
    n: 3,
    title: { sq: 'Tarifat e energjisë për 2026', en: 'Electricity tariffs in 2026' },
    short: { sq: 'Kufiri i 700 kWh, bizneset në 0,4 kV, karikimi i makinave, orët e pikut', en: 'The 700 kWh cliff, businesses at 0.4 kV, EV charging, peak hours' },
    paragraphs: [
      {
        sq: 'ERE cakton çmimet e Furnizuesit të Shërbimit Universal (FSHU), që furnizon familjet dhe bizneset e lidhura në tension të ulët (0,4 kV). Për 1 janar – 31 dhjetor 2026 vlen Vendimi nr. 322 i ERE-s, datë 15.12.2025. Bizneset e lidhura në 35 kV ose në 20/10/6 kV blejnë në tregun e lirë ose te furnizuesi i mundësisë së fundit, jo me këto çmime.',
        en: 'ERE sets the prices of the Universal Service Supplier (FSHU), which supplies households and businesses connected at low voltage (0.4 kV). From 1 January to 31 December 2026, ERE Decision no. 322 of 15 December 2025 applies. Businesses connected at 35 kV or 20/10/6 kV buy on the free market or from the supplier of last resort, not at these prices.',
      },
      {
        sq: 'Për familjet, 700 kWh në muaj nuk është një shkallë, por një prag: kur konsumi i muajit kalon 700 kWh, e gjithë sasia e muajit faturohet me 9,5 lekë/kWh, që nga kilovat-ora e parë. Prandaj çdo kWh që e mban muajin nën 700 vlen shumë më tepër se tarifa.',
        en: 'For households, 700 kWh a month is not a band but a cliff: once the month passes 700 kWh, the whole month is billed at 9.5 lekë/kWh, from the first kilowatt-hour. So every kWh that keeps the month under 700 is worth far more than the tariff.',
      },
      {
        sq: 'Orët e pikut vlejnë vetëm aty ku tabela e ERE-s jep një çmim piku: për bizneset në 0,4 kV dhe për pikat e karikimit të makinave. Familjet nuk kanë çmim piku.',
        en: 'Peak hours apply only where ERE’s table gives a peak price: businesses at 0.4 kV and EV charging points. Households have no peak price.',
      },
    ],
    facts: [
      {
        value: { sq: '8,5 lekë/kWh', en: '8.5 lekë/kWh' },
        text: { sq: 'paguajnë familjet që konsumojnë deri në 700 kWh në muaj.', en: 'is what households using up to 700 kWh a month pay.' },
        source: ERE_TAR,
      },
      {
        value: { sq: '9,5 lekë/kWh', en: '9.5 lekë/kWh' },
        text: {
          sq: 'mbi 700 kWh në muaj, “për të gjithë sasinë e konsumuar gjatë një muaji”, sipas shënimit të ERE-s.',
          en: 'above 700 kWh a month, on the whole month’s consumption (“për të gjithë sasinë e konsumuar gjatë një muaji”, ERE’s footnote).',
        },
        source: ERE_TAR,
      },
      {
        value: { sq: '87%', en: '87%' },
        text: { sq: 'e familjeve konsumojnë nën 700 kWh në muaj, sipas ERE-s.', en: 'of household customers use less than 700 kWh a month, according to ERE.' },
        source: ereAr('f. 136', 'p. 136'),
      },
      {
        value: { sq: '14 lekë/kWh', en: '14 lekë/kWh' },
        text: { sq: 'paguajnë bizneset e lidhura në 0,4 kV; 16,1 lekë/kWh në orët e pikut.', en: 'is what businesses connected at 0.4 kV pay; 16.1 lekë/kWh at peak hours.' },
        source: ERE_TAR,
      },
      {
        value: { sq: '22 lekë/kWh', en: '22 lekë/kWh' },
        text: {
          sq: 'paguajnë pikat dhe stacionet e karikimit mbi 11 kW në 0,4 kV që nga 1 nëntori 2025 (25,3 në orët e pikut); karikuesi i shtëpisë deri në 11 kW mbetet me çmimin e kategorisë së klientit.',
          en: 'is what charging points and stations above 11 kW at 0.4 kV pay from 1 November 2025 (25.3 at peak hours); a home charger up to 11 kW stays on the customer’s normal price.',
        },
        source: ERE_TAR,
        also: ereAr('f. 19 dhe 137', 'pp. 19 and 137'),
      },
      {
        value: { sq: '18–22 · 19–23', en: '18–22 · 19–23' },
        text: {
          sq: 'janë orët e pikut: nga 1 nëntori deri më 31 mars 18:00–22:00, nga 1 prilli deri më 31 tetor 19:00–23:00.',
          en: 'are the peak hours: 18:00–22:00 from 1 November to 31 March, 19:00–23:00 from 1 April to 31 October.',
        },
        source: ERE_TAR,
      },
      {
        value: { sq: '23,5 lekë', en: '23.5 lekë' },
        text: {
          sq: 'kushton secila nga 50 kWh-të që e çojnë një familje nga 700 në 750 kWh: 5 950 lekë bëhen 7 125 lekë, pa TVSH.',
          en: 'is what each of the 50 kWh that take a household from 700 to 750 kWh costs: 5,950 lekë become 7,125 lekë, excluding VAT.',
        },
        source: ERE_TAR,
        computed: true,
      },
    ],
    notes: [
      {
        kind: 'assumption',
        text: {
          sq: 'Njoftimi i ERE-s i 8 janarit 2025 i jep çmimet e familjeve, 8,5 dhe 9,5 lekë/kWh, “pa TVSH”. Tabela e 2026 përsërit të njëjtat vlera pa e thënë, dhe ne supozojmë të njëjtën bazë. Me TVSH 20% ato bëhen 10,2 dhe 11,4 lekë/kWh (llogaritje). Kontrollojeni në një faturë të OSHEE-së.',
          en: 'ERE’s notice of 8 January 2025 gives the household prices, 8.5 and 9.5 lekë/kWh, as “pa TVSH” (excluding VAT). The 2026 table repeats the same values without saying, and we assume the same basis. With 20% VAT they become 10.2 and 11.4 lekë/kWh (our arithmetic). Check it on an OSHEE bill.',
        },
        source: ERE_VAT,
        also: ERE_TAR,
      },
    ],
  },
  {
    id: 'yield',
    n: 4,
    title: { sq: 'Sa prodhon dielli në qytetin tuaj', en: 'Solar yield by city' },
    short: { sq: 'kWh për kWp në 14 qytete, pjerrësia më e mirë dhe llojet e çatisë', en: 'kWh per kWp in 14 cities, the best tilt, and roof types' },
    paragraphs: [
      {
        sq: 'Shifrat janë nga PVGIS 5.3 i Qendrës së Përbashkët Kërkimore (JRC) të Komisionit Europian: sa kWh prodhon në vit 1 kWp panele në qendër të qytetit, me pjerrësinë dhe drejtimin më të mirë, me 14% humbje në kabllo, inverter dhe pluhur, mesatarisht për vitet 2005–2023. Modeli përfshin edhe horizontin e maleve, një arsye pse Tirana, me malin e Dajtit në lindje, prodhon më pak se Durrësi.',
        en: 'The figures come from PVGIS 5.3 by the European Commission’s Joint Research Centre (JRC): how many kWh 1 kWp of panels makes in a year in the city centre, at the best tilt and orientation, with 14% losses in cables, inverter and dirt, averaged over 2005–2023. The model includes the mountain horizon, one reason why Tirana, with Mount Dajti to its east, makes less than Durrës.',
      },
      {
        sq: 'Për prodhimin e një impianti, shumëzoni shifrën e qytetit me fuqinë e paneleve në kWp: 5 kWp në Tiranë japin rreth 5 × 1 435 = 7 175 kWh në vit. Prodhimi ndryshon nga viti në vit me rreth 4%, dhe dhjetori jep sa gjysma e korrikut.',
        en: 'For a plant’s output, multiply the city’s figure by the panels’ power in kWp: 5 kWp in Tirana give about 5 × 1,435 = 7,175 kWh a year. Output varies by about 4% from year to year, and December gives about half of July.',
      },
      {
        sq: 'Çatia ndryshon më shumë se qyteti. Në Tiranë, një çati e pjerrët 30° nga jugu prodhon pothuajse sa pjerrësia më e mirë; nëse panelet vendosen ngjitur me çatinë, pa ajër nga pas, nxehen më shumë dhe prodhojnë rreth 4% më pak. Në tarracë, panelet 10° nga lindja dhe perëndimi prodhojnë rreth 16% më pak për kWp.',
        en: 'The roof matters more than the city. In Tirana a 30° south-facing roof makes almost as much as the best tilt; if the panels sit flush with the roof, with no air behind them, they run hotter and make about 4% less. On a flat roof, panels at 10° facing east and west make about 16% less per kWp.',
      },
      {
        sq: 'Udhëzimi 3/2019 përdor 1 400 kWh/kWp për çdo zonë kur përmason impiantin e një vetëprodhuesi. PVGIS jep më shumë se kaq në 10 nga 14 qytetet dhe pak më pak në Korçë, Pogradec, Gjirokastër dhe Kukës.',
        en: 'Instruction 3/2019 uses 1,400 kWh/kWp for every area when it sizes a self-producer’s plant. PVGIS gives more than that in 10 of the 14 cities, and slightly less in Korçë, Pogradec, Gjirokastër and Kukës.',
      },
    ],
    facts: [
      {
        value: { sq: '1 521 kWh', en: '1,521 kWh' },
        text: { sq: 'në vit për 1 kWp në Fier, më e larta nga 14 qytetet; Kukësi jep më pak, 1 358 kWh.', en: 'a year per kWp in Fier, the highest of the 14 cities; Kukës gives the least, 1,358 kWh.' },
        source: pvgis(40.725, 19.55722),
        also: pvgis(42.083, 20.417),
      },
      {
        value: { sq: '1 435 kWh', en: '1,435 kWh' },
        text: { sq: 'në vit për 1 kWp në Tiranë, me pjerrësi 36° nga jugu. Në dhjetor 82 kWh, në korrik 161 kWh.', en: 'a year per kWp in Tirana, tilted 36° to the south. 82 kWh in December, 161 kWh in July.' },
        source: PVGIS_TIRANE,
      },
      {
        value: { sq: '≈ 4%', en: '≈ 4%' },
        text: {
          sq: 'ndryshon prodhimi nga një vit në tjetrin: devijimi standard është 52–66 kWh për kWp në vit sipas qytetit, nga 52 në Pogradec deri në 66 në Elbasan.',
          en: 'is how much output varies from one year to the next: the standard deviation is 52–66 kWh per kWp a year depending on the city, from 52 in Pogradec to 66 in Elbasan.',
        },
        source: pvgis(40.9, 20.65),
        also: pvgis(41.11111, 20.08056),
        computed: true,
      },
      {
        value: { sq: '−4%', en: '−4%' },
        text: {
          sq: 'prodhojnë panelet e vendosura ngjitur me një çati 30° në Tiranë, krahasuar me panelet e ajrosura nga pas në të njëjtën çati (1 368,56 kundrejt 1 428,52 kWh/kWp).',
          en: 'is what panels flush with a 30° roof in Tirana make compared with ventilated panels on the same roof (1,368.56 against 1,428.52 kWh/kWp).',
        },
        source: PVGIS_T_30_FLUSH,
        also: PVGIS_T_30,
        computed: true,
      },
      {
        value: { sq: '−16%', en: '−16%' },
        text: {
          sq: 'për kWp jep një tarracë me panele 10° lindje–perëndim në Tiranë, krahasuar me pjerrësinë më të mirë (1 208,71 kundrejt 1 435,3 kWh/kWp).',
          en: 'per kWp is what a flat roof with 10° east–west panels gives in Tirana, compared with the best tilt (1,208.71 against 1,435.3 kWh/kWp).',
        },
        source: PVGIS_T_10_EAST,
        also: PVGIS_T_10_WEST,
        computed: true,
      },
    ],
    notes: [
      {
        kind: 'guidance',
        text: {
          sq: 'Raportet e Tiranës për llojet e çatisë mund të përdoren si përafrim për qytetet e tjera: p.sh. një tarracë 10° lindje–perëndim jep rreth 0,84 herë prodhimin e pjerrësisë më të mirë. Është përafrim, jo llogaritje PVGIS për atë qytet.',
          en: 'Tirana’s roof ratios can be used as an approximation for other cities: e.g. a 10° east–west flat roof gives about 0.84 times the best-tilt yield. It is an approximation, not a PVGIS run for that city.',
        },
        source: PVGIS_T_10_EAST,
        also: PVGIS_T_10_WEST,
      },
      {
        kind: 'guidance',
        text: {
          sq: 'Në tarracë, panelet lindje–perëndim me pjerrësi të vogël zakonisht vendosen më afër njëri-tjetrit, prandaj në të njëjtën sipërfaqe hyjnë më shumë kWp. Kërkojini instaluesit planin e çatisë me hijet.',
          en: 'On a flat roof, low east–west panels are usually placed closer together, so more kWp fit on the same area. Ask the installer for a roof layout with the shading.',
        },
      },
      {
        kind: 'unknown',
        text: {
          sq: 'PVGIS nuk e llogarit plakjen e paneleve. Mediana (vlera mesore) e matjeve në terren është 0,5% humbje në vit.',
          en: 'PVGIS does not model panel ageing. The median of field measurements is a 0.5% loss a year.',
        },
        source: PVGIS_MANUAL,
        also: DEGRADATION,
      },
    ],
    categories: ['solar-panels', 'mounting-systems'],
  },
  {
    id: 'equipment',
    n: 5,
    title: { sq: 'Si zgjidhni pajisjet', en: 'Choosing the equipment' },
    short: { sq: 'Panele, inverterë, bateri, pompa nxehtësie, ngrohës uji diellorë, karikues', en: 'Panels, inverters, batteries, heat pumps, solar water heaters, chargers' },
    paragraphs: [
      {
        sq: 'Shumica e shifrave në këtë seksion janë nga fletët teknike të produkteve në katalogun tonë dhe tregojnë sa ndryshojnë modelet nga njëri-tjetri. Rregullat që nuk vijnë nga një fletë teknike ose nga një ligj janë shënuar si udhëzime të përgjithshme: instaluesi juaj vendos për impiantin tuaj.',
        en: 'Most figures in this section come from the datasheets of products in our catalogue and show how far models differ. Rules that do not come from a datasheet or a law are marked as general guidance: your installer decides for your plant.',
      },
    ],
    parts: [
      {
        id: 'panels',
        title: { sq: 'Panelet diellore', en: 'Solar panels' },
        categories: ['solar-panels', 'mounting-systems', 'pv-accessories'],
        paragraphs: [
          {
            sq: 'Fuqia nominale (Wp) është prodhimi i panelit në kushtet standarde të provës; efikasiteti tregon sa prodhon për metër katror. Dy panele me të njëjtën fuqi mund të kenë përmasa të ndryshme. Për të krahasuar çmimet, shikoni çmimin për Wp.',
            en: 'Rated power (Wp) is the panel’s output under standard test conditions; efficiency tells you how much it makes per square metre. Two panels with the same power can differ in size. To compare prices, look at the price per Wp.',
          },
        ],
        lists: [
          {
            title: { sq: 'Çfarë të krahasoni', en: 'What to compare' },
            guidance: true,
            items: [
              { sq: 'Efikasiteti: sa më i lartë, aq më pak çati ju duhet për të njëjtën fuqi. Ka rëndësi kur çatia është e vogël.', en: 'Efficiency: the higher it is, the less roof you need for the same power. It matters when the roof is small.' },
              { sq: 'Teknologjia e qelizave: TOPCon (N-type, më e shpeshta në katalog), HJT (heterojunction) dhe ABC/back-contact, ku kontaktet elektrike janë të gjitha në anën e pasme të qelizës.', en: 'Cell technology: TOPCon (N-type, the most common in the catalogue), HJT (heterojunction) and ABC/back-contact, where all the electrical contacts sit on the back of the cell.' },
              { sq: 'Bifacial: paneli kap dritë edhe nga pas. Fiton më shumë mbi sipërfaqe të çelëta ose mbi struktura të ngritura, më pak kur është ngjitur me çatinë.', en: 'Bifacial: the panel also takes in light from the back. It gains most over light surfaces or on raised frames, least when it sits flush with the roof.' },
              { sq: 'Koeficienti i temperaturës (Pmax): sa përqind fuqie humbet paneli për çdo gradë mbi 25 °C. Sa më afër zeros, aq më mirë në verë.', en: 'Temperature coefficient (Pmax): the percentage of power the panel loses for every degree above 25 °C. The closer to zero, the better in summer.' },
              { sq: 'Dy garanci të ndryshme: garancia e produktit mbulon defektet; garancia e performancës thotë sa fuqi duhet të ketë paneli pas 25 ose 30 vjetësh.', en: 'Two different warranties: the product warranty covers defects; the performance warranty states how much power the panel must still have after 25 or 30 years.' },
              { sq: 'Sipërfaqja: një furnitor llogarit rreth 6,5 m² çati për çdo kWp.', en: 'Area: one supplier counts about 6.5 m² of roof per kWp.' },
            ],
            source: MEMODO,
          },
        ],
        facts: [
          {
            value: { sq: '22,3–24,8%', en: '22.3–24.8%' },
            text: { sq: 'është efikasiteti i paneleve në katalog, nga REC Alpha Pure-R (HJT) te Jinko Tiger Neo 3.0 (TOPCon).', en: 'is the efficiency range of the panels in the catalogue, from REC Alpha Pure-R (HJT) to Jinko Tiger Neo 3.0 (TOPCon).' },
            source: JINKO,
            also: REC,
          },
          {
            value: { sq: '−0,24 … −0,29 %/°C', en: '−0.24 … −0.29 %/°C' },
            text: { sq: 'është koeficienti i temperaturës në katalog: −0,24 te paneli HJT i REC, −0,29 te disa panele TOPCon si Trina Vertex N.', en: 'is the temperature coefficient range in the catalogue: −0.24 for REC’s HJT panel, −0.29 for some TOPCon panels such as Trina Vertex N.' },
            source: REC,
            also: TRINA,
          },
          {
            value: { sq: '12 / 30 vjet', en: '12 / 30 years' },
            text: {
              sq: 'garanci produkti dhe performance për Jinko Tiger Neo 3.0, me 88,85% të fuqisë në fund. AIKO Neostar 3S54 jep 25 vjet garanci produkti.',
              en: 'of product and performance warranty on the Jinko Tiger Neo 3.0, with 88.85% of power at the end. AIKO Neostar 3S54 gives 25 years of product warranty.',
            },
            source: JINKO,
            also: AIKO,
          },
          {
            value: { sq: 'deri në 15 °C', en: 'up to 15 °C' },
            text: { sq: 'më shumë nxehen panelet pa ajrim nga pas, në 1 000 W/m² diell.', en: 'hotter is how much panels with restricted rear airflow can run, at 1,000 W/m² of sunlight.' },
            source: PVGIS_MANUAL,
          },
          {
            value: { sq: '0,5% në vit', en: '0.5% a year' },
            text: { sq: 'humbin panelet nga plakja, sipas medianës (vlerës mesore) së rreth 2 000 matjeve në terren.', en: 'is what panels lose to ageing, the median of about 2,000 field measurements.' },
            source: DEGRADATION,
          },
        ],
      },
      {
        id: 'inverters',
        title: { sq: 'Inverteri', en: 'The inverter' },
        categories: ['inverters'],
        paragraphs: [
          {
            sq: 'Inverteri e kthen rrymën e vazhduar (DC) të paneleve në rrymë alternative (AC) për shtëpinë dhe për rrjetin. Një inverter i lidhur me rrjetin (on-grid) punon vetëm me panelet; një inverter hibrid lidhet edhe me një bateri.',
            en: 'The inverter turns the panels’ direct current (DC) into alternating current (AC) for the house and the grid. A grid-tied (on-grid) inverter works with panels only; a hybrid inverter also connects to a battery.',
          },
        ],
        lists: [
          {
            title: { sq: 'Çfarë të kontrolloni', en: 'What to check' },
            guidance: true,
            items: [
              { sq: 'Fazat: inverter njëfazor për lidhje njëfazore, trefazor për lidhje trefazore. Shikoni kontratën ose pyesni OSHEE-në nëse nuk e dini.', en: 'Phases: a single-phase inverter for a single-phase connection, three-phase for three-phase. Check your contract or ask OSHEE if you are unsure.' },
              { sq: 'Përmasimi: kufiri që vlen është “fuqia maksimale PV” në fletën teknike. Kalkulatori dhe paketat tona kërkojnë një inverter me fuqi AC të paktën 70% të fuqisë së paneleve.', en: 'Sizing: the limit that counts is the “max PV power” on the datasheet. Our calculator and packages ask for an inverter with AC power of at least 70% of the panels’ power.' },
              { sq: 'MPPT: çdo MPPT ndjek veçmas një varg panelesh. Dy MPPT ndihmojnë kur panelet janë në dy drejtime, p.sh. lindje dhe perëndim, ose kur një pjesë bie në hije.', en: 'MPPT: each MPPT tracks one string of panels separately. Two MPPTs help when the panels face two ways, e.g. east and west, or when part of them is shaded.' },
              { sq: 'Hibrid ose “gati për bateri”, nëse mendoni të shtoni një bateri më vonë.', en: 'Hybrid or “battery ready”, if you may add a battery later.' },
              { sq: 'Efikasiteti europian është më afër përdorimit të përditshëm se efikasiteti maksimal.', en: 'European efficiency is closer to everyday use than peak efficiency.' },
            ],
          },
        ],
        facts: [
          {
            value: { sq: '10 kW → 15 kWp', en: '10 kW → 15 kWp' },
            text: { sq: 'panele pranojnë si maksimum shumë inverterë 10 kW në katalog, p.sh. SMA Sunny Tripower 10.0 dhe Huawei SUN2000-10KTL-M1.', en: 'of panels is the maximum many 10 kW inverters in the catalogue accept, e.g. SMA Sunny Tripower 10.0 and Huawei SUN2000-10KTL-M1.' },
            source: SMA,
            also: HUAWEI_M1,
          },
          {
            value: { sq: '5 kW · 7,5 kWp', en: '5 kW · 7.5 kWp' },
            text: { sq: 'ka Fronius Primo GEN24 5.0 Plus, një inverter hibrid njëfazor: fuqi AC dhe fuqi maksimale PV.', en: 'are the AC power and max PV power of the Fronius Primo GEN24 5.0 Plus, a single-phase hybrid inverter.' },
            source: FRONIUS_PRIMO,
          },
          {
            value: { sq: '97,0–98,4%', en: '97.0–98.4%' },
            text: { sq: 'është efikasiteti europian i inverterëve në katalog, nga Deye SUN-10K te Huawei SUN2000-30KTL-M3.', en: 'is the European efficiency range of the inverters in the catalogue, from Deye SUN-10K to Huawei SUN2000-30KTL-M3.' },
            source: DEYE_INV,
            also: HUAWEI_M3,
          },
          {
            value: { sq: '5 → 10 vjet', en: '5 → 10 years' },
            text: { sq: 'garanci jep SMA për Sunny Tripower 10.0: 5 vjet si standard, 10 vjet falas me regjistrim, 15 vjet si opsion.', en: 'of warranty on the SMA Sunny Tripower 10.0: 5 years as standard, 10 years free with registration, 15 years as an option.' },
            source: SMA,
          },
        ],
      },
      {
        id: 'batteries',
        title: { sq: 'Bateria', en: 'The battery' },
        categories: ['batteries'],
        paragraphs: [
          {
            sq: 'Bateria ruan energjinë e paneleve për mbrëmjen dhe natën. Krahasoni kapacitetin e përdorshëm, jo kapacitetin nominal: kapaciteti i përdorshëm është sa kWh merrni realisht.',
            en: 'A battery stores the panels’ energy for the evening and the night. Compare usable capacity, not nominal capacity: usable capacity is how many kWh you actually get.',
          },
          {
            sq: 'Sa vlen një bateri varet nga çmimi që merrni për tepricën. Derisa ky çmim të njihet, energjia që tepron dhe nuk ruhet e llogarisim me 0 lekë.',
            en: 'What a battery is worth depends on the price you get for surplus. Until that price is known, we count surplus that is not stored at 0 lekë.',
          },
        ],
        lists: [
          {
            title: { sq: 'Çfarë të kontrolloni', en: 'What to check' },
            guidance: true,
            items: [
              { sq: 'Tensioni: një bateri me tension të lartë kërkon inverter hibrid për tension të lartë, dhe një bateri 48 V inverter hibrid 48 V. Tensioni i njëjtë nuk mjafton: vetëm listat e përputhshmërisë së prodhuesve tregojnë cilat çifte punojnë.', en: 'Voltage: a high-voltage battery needs a high-voltage hybrid inverter, and a 48 V battery a 48 V hybrid. A matching voltage is not enough: only the makers’ compatibility lists say which pairs work.' },
              { sq: 'Thellësia e shkarkimit (DoD): sa përqind e kapacitetit mund të përdoret pa e dëmtuar baterinë.', en: 'Depth of discharge (DoD): what share of the capacity can be used without harming the battery.' },
              { sq: 'Jetëgjatësia në cikle: jo çdo fletë teknike e jep; kur mungon, pyesni për garancinë me shkrim.', en: 'Cycle life: not every datasheet gives it; when it is missing, ask for the written warranty.' },
              { sq: 'Fuqia e vazhdueshme e shkarkimit (kW): sa pajisje mund të ushqejë bateria njëkohësisht.', en: 'Continuous discharge power (kW): how many appliances the battery can run at once.' },
              { sq: 'Modulariteti: sa mund ta zgjeroni më vonë (kapaciteti minimal dhe maksimal i sistemit).', en: 'Modularity: how far you can extend it later (minimum and maximum system capacity).' },
              { sq: 'Formula e Unbound Solar për madhësinë: kWh të nevojshme = kWh ditore ÷ DoD. Për një impiant të lidhur me rrjetin, në vend të kWh ditore vendosni kWh që përdorni në mbrëmje e natë (përshtatja jonë).', en: 'Unbound Solar’s sizing formula: kWh needed = daily kWh ÷ DoD. For a grid-tied plant, put the kWh you use in the evening and night in place of the daily kWh (our adaptation).' },
            ],
            source: UNBOUND,
          },
        ],
        facts: [
          {
            value: { sq: 'LFP', en: 'LFP' },
            text: { sq: '(litium-hekur-fosfat, LiFePO4) është teknologjia e të gjashta baterive në katalog.', en: '(lithium iron phosphate, LiFePO4) is the chemistry of all six batteries in the catalogue.' },
            source: PYLONTECH,
            also: BYD_HVS,
          },
          {
            value: { sq: '4,56 nga 4,8 kWh', en: '4.56 of 4.8 kWh' },
            text: {
              sq: 'janë të përdorshme te Pylontech US5000, një bateri 48 V me thellësi shkarkimi 95% dhe 6 000 cikle sipas fletës teknike (faqja e prodhuesit thotë 8 000).',
              en: 'are usable on the Pylontech US5000, a 48 V battery with 95% depth of discharge and 6,000 cycles per the datasheet (the maker’s web page says 8,000).',
            },
            source: PYLONTECH,
          },
          {
            value: { sq: '409,6 V', en: '409.6 V' },
            text: { sq: 'është tensioni nominal i BYD Battery-Box Premium HVS 10.2: bateri me tension të lartë, 10,24 kWh, 10 vjet garanci.', en: 'is the nominal voltage of the BYD Battery-Box Premium HVS 10.2: a high-voltage battery, 10.24 kWh, 10-year warranty.' },
            source: BYD_HVS,
          },
          {
            value: { sq: '48 V', en: '48 V' },
            text: { sq: 'është tensioni i baterive me të cilat punon Deye SUN-10K-SG04LP3-EU, një inverter hibrid trefazor për tension të ulët.', en: 'is the battery voltage the Deye SUN-10K-SG04LP3-EU works with: a three-phase low-voltage hybrid inverter.' },
            source: DEYE_INV,
          },
        ],
        notes: [
          {
            // src/lib/solar.ts sizeSystem() pairs only what src/content/battery-compat.ts lists as compatible.
            kind: 'guidance',
            text: {
              sq: `Kalkulatori dhe paketat e bashkojnë një bateri me një inverter vetëm kur të paktën një prodhues e liston çiftin si të përputhshëm dhe asnjë nuk e përjashton (listat u lexuan më ${checkedOn('sq').text}); faqja e çdo inverteri hibrid dhe e çdo baterie tregon me çfarë punon. Instaluesi vendos përsëri firmware-in, lidhjen e komunikimit dhe cilësimet, dhe konfirmon listën e pajisjeve.`,
              en: `The calculator and the packages pair a battery with an inverter only when at least one maker lists the pair as compatible and none excludes it (lists read on ${checkedOn('en').text}); the page of each hybrid inverter and battery shows what it works with. The installer still sets the firmware, the communication link and the settings, and confirms the equipment list.`,
            },
          },
        ],
      },
      {
        id: 'heat-pumps',
        title: { sq: 'Pompa e nxehtësisë', en: 'The heat pump' },
        categories: ['heat-pumps', 'air-conditioners'],
        paragraphs: [
          {
            sq: 'Pompa e nxehtësisë ajër–ujë merr nxehtësi nga ajri i jashtëm dhe e çon në ujin e ngrohjes dhe të përdorimit; disa modele edhe ftohin verës. COP tregon sa kWh nxehtësi jep për 1 kWh energji elektrike në një pikë prove; SCOP është mesatarja për gjithë sezonin e ngrohjes.',
            en: 'An air-to-water heat pump takes heat from the outside air and moves it into the heating and domestic hot water; some models also cool in summer. COP tells you how many kWh of heat it gives per 1 kWh of electricity at one test point; SCOP is the average over the whole heating season.',
          },
          {
            sq: 'A7/W35 do të thotë: ajri jashtë 7 °C, uji që del nga pompa 35 °C, temperaturë e përshtatshme për ngrohje me dysheme. Me radiatorë që kërkojnë ujë më të nxehtë, pompa punon me efikasitet më të ulët.',
            en: 'A7/W35 means outside air at 7 °C and water leaving the pump at 35 °C, a temperature suited to underfloor heating. With radiators that need hotter water, the pump runs less efficiently.',
          },
        ],
        lists: [
          {
            title: { sq: 'Çfarë të kontrolloni', en: 'What to check' },
            guidance: true,
            items: [
              { sq: 'Fuqia e ngrohjes (kW): e cakton humbja e nxehtësisë së shtëpisë. Kërkojini instaluesit llogaritjen, mos e zgjidhni sipas syrit.', en: 'Heating capacity (kW): the house’s heat loss sets it. Ask the installer for the calculation rather than guessing.' },
              { sq: 'COP dhe SCOP në temperaturën e ujit që do të përdorni (35 °C ose 55 °C).', en: 'COP and SCOP at the water temperature you will use (35 °C or 55 °C).' },
              { sq: 'Gazi ftohës (p.sh. R32 ose R290), numri i fazave dhe fuqia akustike e njësisë së jashtme, në dB(A).', en: 'The refrigerant (e.g. R32 or R290), the number of phases and the outdoor unit’s sound power, in dB(A).' },
              { sq: 'Konsumi i dimrit: pompa shton kWh në faturë. Nëse muaji kalon 700 kWh, e gjithë fatura e familjes llogaritet me 9,5 lekë/kWh.', en: 'Winter use: the pump adds kWh to the bill. If a month passes 700 kWh, the household’s whole bill is charged at 9.5 lekë/kWh.' },
            ],
          },
        ],
        facts: [
          {
            value: { sq: 'COP 4,85', en: 'COP 4.85' },
            text: { sq: 'jep Daikin Altherma 3 R 6 kW në A7/W35, me SCOP 4,47 në klimë mesatare dhe klasë A+++.', en: 'is what the Daikin Altherma 3 R 6 kW gives at A7/W35, with SCOP 4.47 in an average climate and class A+++.' },
            source: DAIKIN_HP,
          },
          {
            value: { sq: 'A+++ → A++', en: 'A+++ → A++' },
            text: {
              sq: 'A+++ është klasa e gamës Vaillant aroTHERM plus me ujë 35 °C; me ujë 55 °C modeli VWL 75/6 ka klasën A++, me efikasitet sezonal 133%.',
              en: 'A+++ is the Vaillant aroTHERM plus range’s class with 35 °C water; with 55 °C water the VWL 75/6 model is class A++, with 133% seasonal efficiency.',
            },
            source: VAILLANT,
            also: VAILLANT_PAGE,
          },
        ],
      },
      {
        id: 'solar-water-heaters',
        title: { sq: 'Ngrohësi diellor i ujit', en: 'The solar water heater' },
        categories: ['solar-water-heaters'],
        paragraphs: [
          {
            sq: 'Ngrohësi diellor me termosifon ka një kolektor në çati dhe një depozitë mbi të. Uji i ngrohur në kolektor ngjitet vetë në depozitë, pa pompë; një rezistencë elektrike e ndihmon në ditët pa diell.',
            en: 'A thermosiphon solar water heater has a collector on the roof and a tank above it. Water warmed in the collector rises into the tank by itself, with no pump; an electric heating element helps on days without sun.',
          },
        ],
        lists: [
          {
            title: { sq: 'Çfarë të kontrolloni', en: 'What to check' },
            guidance: true,
            items: [
              { sq: 'Vëllimin e depozitës (litra) dhe sipërfaqen e kolektorit (m²).', en: 'Tank volume (litres) and collector area (m²).' },
              { sq: 'Materialin e depozitës, p.sh. çelik i emaluar.', en: 'The tank material, e.g. enamelled steel.' },
              { sq: 'Fuqinë e rezistencës elektrike për ditët pa diell.', en: 'The electric element’s power for sunless days.' },
              { sq: 'Peshën me ujë: çdo litër ujë peshon rreth 1 kg, prandaj pyesni nëse çatia e mban.', en: 'The filled weight: each litre of water weighs about 1 kg, so ask whether the roof can carry it.' },
            ],
          },
        ],
        facts: [
          {
            value: { sq: '151 L · 2,6 m²', en: '151 L · 2.6 m²' },
            text: { sq: 'ka Calpak Mark-5 160/2.6, një sistem me termosifon me rezistencë elektrike 3,5 kW.', en: 'are the tank and collector of the Calpak Mark-5 160/2.6, a thermosiphon system with a 3.5 kW electric element.' },
            source: CALPAK,
          },
          {
            value: { sq: '111 920 m²', en: '111,920 m²' },
            text: {
              sq: 'kolektorë diellorë ishin instaluar gjithsej në Shqipëri sipas programit UNDP/GEF, rreth vitit 2012 (viti nuk shkruhet në grafik).',
              en: 'of solar collectors had been installed in Albania in total according to the UNDP/GEF programme, around 2012 (the chart does not label the year).',
            },
            source: UNDP_SWH,
          },
        ],
        notes: [
          {
            kind: 'unknown',
            text: { sq: 'Nuk gjetëm një numër zyrtar të sotëm për ngrohësit diellorë të ujit në Shqipëri.', en: 'We found no current official count of solar water heaters in Albania.' },
          },
        ],
      },
      {
        id: 'ev-charging',
        title: { sq: 'Karikimi i makinës elektrike', en: 'Charging an electric car' },
        categories: ['ev-chargers', 'energy-monitoring'],
        paragraphs: [
          {
            sq: 'ERE ka një tarifë të veçantë për pikat dhe stacionet e karikimit mbi 11 kW: 22 lekë/kWh, 25,3 në orët e pikut. Karikuesi i shtëpisë deri në 11 kW mbetet me çmimin e kategorisë suaj, p.sh. 8,5 ose 9,5 lekë/kWh për një familje.',
            en: 'ERE has a separate tariff for charging points and stations above 11 kW: 22 lekë/kWh, 25.3 at peak hours. A home charger up to 11 kW stays on your customer category’s price, e.g. 8.5 or 9.5 lekë/kWh for a household.',
          },
          {
            sq: 'Karikuesit në katalog janë 22 kW, trefazorë dhe 32 A; lidhësi është Type 2 te ata që e shkruajnë në fletën teknike. Disa ndërrojnë vetë nga një fazë në tri për të karikuar me tepricën e paneleve.',
            en: 'The chargers in the catalogue are 22 kW, three-phase and 32 A; the connector is Type 2 on those whose datasheet names it. Some switch by themselves between one and three phases to charge from the panels’ surplus.',
          },
        ],
        lists: [
          {
            title: { sq: '11 kW apo 22 kW', en: '11 kW or 22 kW' },
            guidance: true,
            items: [
              { sq: 'Fuqia ≈ numri i fazave × 230 V × rryma: 1 fazë me 32 A ≈ 7,4 kW; 3 faza me 16 A ≈ 11 kW; 3 faza me 32 A ≈ 22 kW.', en: 'Power ≈ phases × 230 V × current: 1 phase at 32 A ≈ 7.4 kW; 3 phases at 16 A ≈ 11 kW; 3 phases at 32 A ≈ 22 kW.' },
              { sq: 'Për 11 kW ose 22 kW ju duhet lidhje trefazore.', en: 'For 11 kW or 22 kW you need a three-phase connection.' },
              { sq: 'Makina merr aq sa lejon karikuesi i saj i brendshëm (AC): shikoni fletën e makinës para se të paguani për 22 kW.', en: 'The car takes only as much as its own on-board (AC) charger allows: check the car’s specification before paying for 22 kW.' },
              { sq: 'Me panele, zgjidhni një karikues që karikon me tepricën e diellit dhe që e kufizon fuqinë kur shtëpia ka ngarkesë të madhe.', en: 'With panels, choose a charger that can charge from solar surplus and limits its power when the house is under heavy load.' },
            ],
          },
        ],
        facts: [
          {
            value: { sq: '22 lekë/kWh', en: '22 lekë/kWh' },
            text: { sq: 'për karikimin mbi 11 kW nga 1 nëntori 2025, 25,3 në orët e pikut.', en: 'for charging above 11 kW from 1 November 2025, 25.3 at peak hours.' },
            source: ERE_TAR,
            also: ereAr('f. 19 dhe 137', 'pp. 19 and 137'),
          },
          {
            value: { sq: '225', en: '225' },
            text: { sq: 'pika karikimi u instaluan në 2025, 47 më shumë se në 2024.', en: 'charging points were installed in 2025, 47 more than in 2024.' },
            source: ereAr('f. 18', 'p. 18'),
          },
          {
            value: { sq: '1,38–22 kW', en: '1.38–22 kW' },
            text: { sq: 'karikon Fronius Wattpilot Flex Home 22 me tepricën e paneleve, duke kaluar vetë nga një në tri faza.', en: 'is the range the Fronius Wattpilot Flex Home 22 charges at from solar surplus, switching itself between one and three phases.' },
            source: WATTPILOT,
          },
        ],
        notes: [
          {
            kind: 'unknown',
            text: {
              sq: 'Nëse një karikues 22 kW në një shtëpi private hyn në tarifën 22 lekë/kWh, dokumentet që lexuam nuk e thonë. Pyesni OSHEE-në para se të zgjidhni 22 kW.',
              en: 'Whether a 22 kW charger in a private home falls under the 22 lekë/kWh tariff, the documents we read do not say. Ask OSHEE before choosing 22 kW.',
            },
            source: ereAr('f. 19 dhe 137', 'pp. 19 and 137'),
          },
        ],
      },
    ],
  },
  {
    id: 'faq',
    n: 6,
    title: { sq: 'Pyetje të shpeshta', en: 'Frequently asked questions' },
    short: { sq: 'Leja, madhësia, teprica, kostoja, bateria, TVSH-ja, pallati, karikimi', en: 'Permits, size, surplus, cost, battery, VAT, apartment blocks, charging' },
    paragraphs: [],
  },
];

export const FAQ: Faq[] = [
  {
    id: 'permit',
    q: { sq: 'A më duhet leje për panele në çati?', en: 'Do I need a permit for rooftop panels?' },
    a: [
      {
        sq: 'Po. Sipas Udhëzimit 3/2019, impianti i një vetëprodhuesi është punim me deklaratë paraprake (VKM 408/2015), prandaj ju duhet leja e bashkisë, dhe OSSH duhet t’ju miratojë si vetëprodhues. OSSH përgjigjet brenda 30 ditëve pune dhe pas miratimit keni 6 muaj për instalimin.',
        en: 'Yes. Under Instruction 3/2019 a self-producer’s plant counts as works with a prior declaration (DCM 408/2015), so you need the municipality’s permit, and the grid operator (OSSH) must approve you as a self-producer. OSSH answers within 30 working days, and after approval you have 6 months to install.',
      },
      {
        sq: 'Nëse rregullat e majit 2026 e kanë ndryshuar procedurën, nuk e kemi verifikuar: pyesni OSSH-në.',
        en: 'Whether the May 2026 rules changed the procedure we have not verified: ask OSSH.',
      },
    ],
    sources: [instr('pikat 2, 8 dhe 13', 'points 2, 8 and 13'), OSHEE_DOCS, PV_MAG],
  },
  {
    id: 'size',
    q: { sq: 'Sa i madh mund të jetë impianti im?', en: 'How big can my plant be?' },
    a: [
      {
        sq: 'Ligji lejon deri në 500 kW, por në praktikë sa konsumi juaj: Udhëzimi 3/2019 e përmason sipas konsumit vjetor të dy viteve të fundit, me 1 400 kWh për kWp. Për shembull, 350 kWh në muaj, pra 4 200 kWh në vit, japin 3 kWp. OSHEE mund ta shkëpusë një impiant të projektuar për të prodhuar më shumë se konsumi vjetor.',
        en: 'The law allows up to 500 kW, but in practice as much as you use: Instruction 3/2019 sizes the plant from your yearly use over the last two years, at 1,400 kWh per kWp. For example, 350 kWh a month, i.e. 4,200 kWh a year, gives 3 kWp. OSHEE may disconnect a plant designed to produce more than the yearly use.',
      },
    ],
    sources: [law24('neni 20', 'Art. 20'), instr('pikat 4, 6 dhe 15', 'points 4, 6 and 15')],
    computed: true,
  },
  {
    id: 'surplus',
    q: { sq: 'Sa më paguajnë për energjinë që i jap rrjetit?', en: 'What am I paid for the energy I feed into the grid?' },
    a: [
      {
        sq: 'Nuk e dimë ende. Udhëzimi 3/2019 (pika 17) e kalonte tepricën mujore te FSHU pa kundërshpërblim. Ligji 24/2023 parashikon faturim neto me një çmim që e cakton ERE, dhe rregullat e majit 2026 caktojnë procedurën e kompensimit, por për to nuk kemi gjetur ende një çmim të publikuar.',
        en: 'We do not know yet. Instruction 3/2019 (point 17) passed the monthly surplus to FSHU unpaid. Law 24/2023 provides for net billing at a price set by ERE, and the May 2026 rules set the compensation procedure, but for those rules we have not yet found a published price.',
      },
      {
        sq: 'Në kalkulator tepricën e llogarisim me 0 lekë. Nëse çmimi i tepricës del mbi zero, kursimi do të jetë më i madh.',
        en: 'In the calculator we count surplus at 0 lekë. If the surplus price turns out above zero, the saving will be larger.',
      },
    ],
    sources: [instr('pika 17', 'point 17'), law24('neni 20', 'Art. 20'), PV_MAG],
  },
  {
    id: 'yield',
    q: { sq: 'Sa prodhon 1 kWp në qytetin tim?', en: 'How much does 1 kWp make in my city?' },
    a: [
      {
        sq: 'Sipas PVGIS, me pjerrësinë më të mirë, nga 1 358 kWh në vit në Kukës deri në 1 521 kWh në Fier; Tirana jep 1 435 kWh. Një tarracë me panele 10° lindje–perëndim jep rreth 16% më pak. Shikoni tabelën e qyteteve më lart.',
        en: 'According to PVGIS, at the best tilt, from 1,358 kWh a year in Kukës to 1,521 kWh in Fier; Tirana gives 1,435 kWh. A flat roof with 10° east–west panels gives about 16% less. See the city table above.',
      },
    ],
    sources: [PVGIS_TIRANE, pvgis(40.725, 19.55722), pvgis(42.083, 20.417)],
  },
  {
    id: 'cost',
    q: { sq: 'Sa kushton një impiant i plotë?', en: 'What does a complete plant cost?' },
    a: [
      {
        sq: 'Nuk kemi gjetur një burim publik për çmimin e një impianti të instaluar në Shqipëri. Si krahasim: në Itali një impiant shtëpie i plotë kushtonte 1,2–1,6 €/W në 2024; në Kosovë, një impiant familjar 5 kW kushtonte rreth 3 000 € në 2025, nga të cilat rreth 1 300 € i paguante shteti.',
        en: 'We have not found a public source for the installed price of a plant in Albania. For comparison: in Italy a complete home system cost €1.2–1.6 per W in 2024; in Kosovo a 5 kW family system cost about €3,000 in 2025, of which the government paid about €1,300.',
      },
      {
        sq: 'Paketat tona japin çmimin e pajisjeve nga ofertat e sotme të shitësve, pa montimin, kabllot, instalimin dhe lejet. Për çmimin e plotë kërkoni ofertë.',
        en: 'Our packages give the equipment price from sellers’ offers today, without mounting, cables, installation and permits. For the full price, request a quote.',
      },
    ],
    sources: [IEA_IT, PRISHTINA],
  },
  {
    id: 'payback',
    q: { sq: 'Për sa vite shlyhet investimi?', en: 'How many years until it pays back?' },
    a: [
      {
        sq: 'Varet nga sa energji përdorni vetë dhe nga çmimi i impiantit. Një ilustrim me supozime të qarta: 1 kWp në Tiranë, i gjithë prodhimi i përdorur vetë, tarifa e familjes 10,2 lekë/kWh me TVSH, kursi 90,64 lekë për euro dhe çmimi italian 1 200–1 600 € për kWp, shlyhet për rreth 7,4–9,9 vjet. Për një biznes me 14 lekë/kWh, rreth 5,4–7,2 vjet.',
        en: 'It depends on how much energy you use yourself and on the plant’s price. An illustration with its assumptions in the open: 1 kWp in Tirana, all of its output used on site, the household tariff of 10.2 lekë/kWh with VAT, 90.64 lekë to the euro and the Italian price of €1,200–1,600 per kWp pays back in about 7.4–9.9 years. For a business at 14 lekë/kWh, about 5.4–7.2 years.',
      },
      {
        sq: 'Nëse përdorni vetë vetëm një pjesë dhe teprica llogaritet 0, periudha zgjatet. Kalkulatori e llogarit me konsumin tuaj, qytetin tuaj dhe ofertat e sotme.',
        en: 'If you use only part of it yourself and surplus counts as 0, it takes longer. The calculator works it out with your use, your city and today’s offers.',
      },
    ],
    sources: [PVGIS_TIRANE, ERE_TAR, BOA, IEA_IT],
    computed: true,
  },
  {
    id: 'battery',
    q: { sq: 'A ia vlen një bateri?', en: 'Is a battery worth it?' },
    a: [
      {
        sq: 'Nuk mund ta themi me siguri nga të dhënat që kemi. Bateria ju lejon të përdorni në mbrëmje energjinë që përndryshe do t’i kalonte rrjetit; sa vlen kjo varet nga çmimi i tepricës, që ende nuk e kemi gjetur, dhe nga çmimi i baterisë.',
        en: 'We cannot say for sure from the data we have. A battery lets you use in the evening the energy that would otherwise go to the grid; what that is worth depends on the surplus price, which we have not found yet, and on the battery’s price.',
      },
      {
        sq: 'Kalkulatori supozon se pa bateri përdorni vetë 45% të prodhimit dhe me bateri 80%: janë supozime inxhinierike, jo matje. Për bizneset në 0,4 kV, ora e pikut kushton 16,1 lekë/kWh në vend të 14; familjet nuk kanë çmim piku.',
        en: 'The calculator assumes you use 45% of the output yourself without a battery and 80% with one: engineering assumptions, not measurements. For businesses at 0.4 kV a peak hour costs 16.1 lekë/kWh instead of 14; households have no peak price.',
      },
    ],
    sources: [instr('pika 17', 'point 17'), ERE_TAR],
  },
  {
    id: 'vat',
    q: { sq: 'A e përfshijnë TVSH-në tarifat e ERE-s?', en: 'Do ERE’s tariffs include VAT?' },
    a: [
      {
        sq: 'Supozojmë që jo. Njoftimi i ERE-s i 8 janarit 2025 i jep çmimet e familjeve, 8,5 dhe 9,5 lekë/kWh, “pa TVSH”; tabela e 2026 nuk e thotë. Me TVSH 20% bëhen 10,2 dhe 11,4 lekë/kWh. Bizneset zakonisht e zbresin TVSH-në, prandaj për to llogarisim 14 lekë/kWh pa TVSH.',
        en: 'We assume not. ERE’s notice of 8 January 2025 gives the household prices, 8.5 and 9.5 lekë/kWh, as “pa TVSH” (excluding VAT); the 2026 table does not say. With 20% VAT they become 10.2 and 11.4 lekë/kWh. Businesses usually recover VAT, so for them we count 14 lekë/kWh without VAT.',
      },
    ],
    sources: [ERE_VAT, ERE_TAR],
  },
  {
    id: 'apartments',
    q: { sq: 'Jetoj në pallat. A mund të kemi panele të përbashkëta?', en: 'I live in an apartment block. Can we share panels?' },
    a: [
      {
        sq: 'Ligji 24/2023 (neni 20) lejon që vetëprodhuesit në të njëjtën ndërtesë, edhe në pallate, të veprojnë së bashku dhe ta ndajnë energjinë. Procedurën konkrete për këtë nuk e gjetëm në dokumentet që lexuam; pyesni OSSH-në dhe administratorin e pallatit.',
        en: 'Law 24/2023 (Art. 20) lets self-producers in the same building, apartment blocks included, act jointly and share energy. We did not find the actual procedure for this in the documents we read; ask OSSH and the building’s administrator.',
      },
    ],
    sources: [law24('neni 20/8', 'Art. 20(8)')],
  },
  {
    id: 'ev-tariff',
    q: { sq: 'A paguaj 22 lekë/kWh nëse karikoj makinën në shtëpi?', en: 'Do I pay 22 lekë/kWh to charge my car at home?' },
    a: [
      {
        sq: 'ERE e ka caktuar këtë tarifë për pikat dhe stacionet e karikimit mbi 11 kW në 0,4 kV; karikuesi i shtëpisë deri në 11 kW mbetet me çmimin e kategorisë suaj. Nëse një karikues 22 kW në shtëpi hyn në tarifën e veçantë, dokumentet që lexuam nuk e thonë: pyesni OSHEE-në para se të zgjidhni 22 kW.',
        en: 'ERE set that tariff for charging points and stations above 11 kW at 0.4 kV; a home charger up to 11 kW stays on your category’s price. Whether a 22 kW charger at home falls under the special tariff, the documents we read do not say: ask OSHEE before choosing 22 kW.',
      },
    ],
    sources: [ERE_TAR, ereAr('f. 19 dhe 137', 'pp. 19 and 137')],
  },
];

/** Every source the guide cites, de-duplicated by URL, for a "Sources" list at the foot of the page. */
export function guideSources(): Source[] {
  const seen = new Map<string, Source>();
  // A document cited at several pinpoints (pages, articles, points) is listed once, under its document-level label.
  const add = (s?: Source) => { if (s && !seen.has(s.url)) seen.set(s.url, s.doc ? { label: s.doc, url: s.url } : s); };
  const part = (p: Omit<GuidePart, 'id'>) => {
    p.facts?.forEach((f) => { add(f.source); add(f.also); });
    p.notes?.forEach((n) => { add(n.source); add(n.also); });
    p.lists?.forEach((l) => { add(l.source); add(l.also); });
  };
  for (const s of GUIDE) { part(s); s.parts?.forEach(part); }
  CITY_YIELDS.forEach((c) => add(c.source));
  TIRANE_ROOF_SOURCES.forEach(add);
  FAQ.forEach((f) => f.sources.forEach(add));
  return [...seen.values()];
}
