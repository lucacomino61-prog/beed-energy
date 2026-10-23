// The seven layers of the house and the numbers behind them. Every number has its source.
// Sources: research/albania-energy.md, research/albania-construction-commerce.md, research/tariffs-prices.md.
import type { Lang } from '../lib/i18n';

export type Source = { label: string; url: string };
export type Fact = { value: Record<Lang, string>; text: Record<Lang, string>; source: Source };

export type Layer = {
  n: number;
  name: Record<Lang, string>;
  short: Record<Lang, string>;
  categories: string[]; // categories.slug_en
  fact: Fact | 'insulation' | 'windows' | 'heat'; // dynamic facts are computed from product datasheets in the database
  extra?: Fact;
};

const INSTAT_GDP: Source = { label: 'INSTAT, PBB 2025', url: 'https://www.instat.gov.al/media/441igujp/gross-domestic-product-2025.pdf' };
const INSTAT_FIRMS: Source = { label: 'INSTAT, njësi aktive 2025', url: 'https://www.instat.gov.al/media/fz4pqhun/tab-2-nj%C3%ABsi-ligjore-aktive-sipas-aktivitetit-ekonomik-dhe-pron%C3%ABsis%C3%AB.xlsx' };
const PVGIS: Source = { label: 'PVGIS 5.3, JRC', url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=41.32833&lon=19.81806&peakpower=1&loss=14&optimalangles=1&outputformat=json' };
const ERE_AR: Source = { label: 'ERE, Raporti vjetor 2025', url: 'https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf' };
const INSTR_3: Source = { label: 'ERE, Udhëzimi 3/2019, pika 17', url: 'https://web.archive.org/web/20250420015647/https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf' };
const ERE_TAR: Source = { label: 'ERE, Vendimi 322/2025', url: 'https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf' };
const INSTAT_EL: Source = { label: 'INSTAT, bilanci i energjisë 2025', url: 'https://www.instat.gov.al/media/mngpviyc/balance-of-electric-power-2025.pdf' };

export const LAYERS: Layer[] = [
  {
    n: 1,
    name: { sq: 'Themeli dhe muret', en: 'Foundation and walls' },
    short: { sq: 'Çimento, blloqe, hekur betoni, ngjitës', en: 'Cement, blocks, rebar, adhesives' },
    categories: ['cement-and-masonry'],
    fact: {
      value: { sq: '12,56%', en: '12.56%' },
      text: { sq: 'e prodhimit të Shqipërisë në 2025 erdhi nga ndërtimi. Në fund të vitit punonin 8 335 firma ndërtimi.', en: 'of Albania’s output in 2025 came from construction. 8,335 construction firms were active at year end.' },
      source: INSTAT_GDP,
    },
    extra: { value: { sq: '8 335', en: '8,335' }, text: { sq: 'firma ndërtimi aktive', en: 'active construction firms' }, source: INSTAT_FIRMS },
  },
  {
    n: 2,
    name: { sq: 'Izolimi', en: 'Insulation' },
    short: { sq: 'Lesh guri, EPS, XPS, kapotë', en: 'Stone wool, EPS, XPS, ETICS' },
    categories: ['insulation'],
    fact: 'insulation',
  },
  {
    n: 3,
    name: { sq: 'Dritaret', en: 'Windows' },
    short: { sq: 'Profile PVC me vlera U të deklaruara', en: 'PVC profiles with declared U-values' },
    categories: ['windows'],
    fact: 'windows',
  },
  {
    n: 4,
    name: { sq: 'Çatia dhe panelet', en: 'Roof and panels' },
    short: { sq: 'Panele, struktura montimi, kabllo dhe lidhës', en: 'Panels, mounting, cable and connectors' },
    categories: ['solar-panels', 'mounting-systems', 'pv-accessories'],
    fact: {
      value: { sq: '1 435 kWh', en: '1,435 kWh' },
      text: { sq: 'prodhon në vit 1 kWp panele në Tiranë, me pjerrësinë më të mirë. Në Fier arrin 1 521 kWh.', en: 'a year from 1 kWp of panels in Tirana at the best tilt. In Fier it reaches 1,521 kWh.' },
      source: PVGIS,
    },
    extra: { value: { sq: '3 551', en: '3,551' }, text: { sq: 'familje, biznese dhe institucione prodhonin vetë energji diellore në fund të 2025', en: 'homes, businesses and institutions made their own solar power by the end of 2025' }, source: ERE_AR },
  },
  {
    n: 5,
    name: { sq: 'Inverteri dhe bateria', en: 'Inverter and battery' },
    short: { sq: 'Inverterë në rrjet dhe hibridë, bateri litiumi', en: 'Grid-tied and hybrid inverters, lithium batteries' },
    categories: ['inverters', 'batteries'],
    fact: {
      value: { sq: '0 lekë', en: '0 lekë' },
      text: { sq: 'merr vetëprodhuesi për energjinë që tepron mbi konsumin e muajit, sipas rregullit në fuqi: ajo kalon te furnizuesi pa pagesë. Rregullat e reja të majit 2026 ende nuk kanë publikuar çmim. Prandaj vlen ta ruani.', en: 'is what a self-producer is paid for power left over beyond the month’s use under the rule in force: it passes to the supplier unpaid. The new rules of May 2026 have not published a price yet. That is why storing it pays.' },
      source: INSTR_3,
    },
    extra: { value: { sq: '19:00–23:00', en: '19:00–23:00' }, text: { sq: 'orët e pikut nga prilli në tetor, kur dielli ka perënduar', en: 'peak hours from April to October, after sunset' }, source: ERE_TAR },
  },
  {
    n: 6,
    name: { sq: 'Ngrohja, ftohja, drita', en: 'Heating, cooling, light' },
    short: { sq: 'Pompa nxehtësie, kondicionerë, ngrohës uji diellorë, LED', en: 'Heat pumps, air conditioners, solar water heaters, LED' },
    categories: ['heat-pumps', 'air-conditioners', 'solar-water-heaters', 'led-lighting'],
    fact: 'heat',
  },
  {
    n: 7,
    name: { sq: 'Matësi dhe rrjeti', en: 'Meter and grid' },
    short: { sq: 'Matës energjie, karikues për makina elektrike', en: 'Energy meters, EV chargers' },
    categories: ['energy-monitoring', 'ev-chargers'],
    fact: {
      value: { sq: '86,8%', en: '86.8%' },
      text: { sq: 'e energjisë elektrike të prodhuar në Shqipëri në 2025 erdhi nga hidrocentralet. Një vit i thatë dha 4 174 GWh, një vit me shi 8 076 GWh: shiu ende vendos për rrjetin.', en: 'of the electricity made in Albania in 2025 came from hydropower. A dry year gave 4,174 GWh, a wet one 8,076 GWh: rain still decides the grid.' },
      source: INSTAT_EL,
    },
    extra: { value: { sq: '−21%', en: '−21%' }, text: { sq: 'prurjet në kaskadën e Drinit në 2025, nën mesataren 30-vjeçare', en: 'inflow to the Drin cascade in 2025, against the 30-year average' }, source: ERE_AR },
  },
];

/** Albania in numbers: the stat stack on the home page. */
export const NUMBERS: Fact[] = [
  { value: { sq: '21 → 631 MW', en: '21 → 631 MW' }, text: { sq: 'Kapaciteti i centraleve diellore u rrit tridhjetë herë nga 2020 deri në fund të 2025.', en: 'Solar plant capacity grew thirtyfold from 2020 to the end of 2025.' }, source: { label: 'ERE, Raporti vjetor 2025, f. 42', url: ERE_AR.url } },
  { value: { sq: '832 GWh', en: '832 GWh' }, text: { sq: 'prodhuan centralet fotovoltaike në 2025, rreth 11% e energjisë elektrike vendase.', en: 'came from solar plants in 2025, about 11% of domestic electricity.' }, source: { label: 'ERE, Raporti vjetor 2025, f. 15', url: ERE_AR.url } },
  { value: { sq: '3 375 GWh', en: '3,375 GWh' }, text: { sq: 'energji elektrike importoi Shqipëria në 2025; importi neto arriti 877 GWh.', en: 'of electricity were imported in 2025; net imports reached 877 GWh.' }, source: INSTAT_EL },
  { value: { sq: '500 kW', en: '500 kW' }, text: { sq: 'mund të instalojë çdo familje ose biznes për nevojat e veta, sipas ligjit për energjinë e rinovueshme.', en: 'of renewable power may be installed by any home or business for its own use, under the renewables law.' }, source: { label: 'Ligji 24/2023, neni 20', url: 'https://www.ere.gov.al/media/files/2024/01/31/Law_no._24_2023_On_the_promotion_of_the_use_of_energy_from_renewable_sources.pdf' } },
  { value: { sq: '45,4%', en: '45.4%' }, text: { sq: 'e shqiptarëve 16–74 vjeç blenë diçka online në 12 muajt e fundit.', en: 'of Albanians aged 16–74 bought something online in the last 12 months.' }, source: { label: 'INSTAT, TIK 2025', url: 'https://www.instat.gov.al/media/4jkhqz0c/ict-2025_english.pdf' } },
];
