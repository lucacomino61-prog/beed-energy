// The seven layers of the house and the numbers behind them. Every number has its source.
// Sources: research/albania-energy.md, research/albania-construction-commerce.md, research/tariffs-prices.md.
import type { Lang } from '../lib/i18n';

export type Source = { label: Record<Lang, string>; url: string };
// `also`: a second source when one sentence of the fact comes from another document.
export type Fact = { value: Record<Lang, string>; text: Record<Lang, string>; source: Source; also?: Source };

export type Layer = {
  n: number;
  name: Record<Lang, string>;
  short: Record<Lang, string>;
  categories: string[]; // categories.slug_en
  fact: Fact | 'insulation' | 'windows' | 'heat'; // dynamic facts are computed from product datasheets in the database
  extra?: Fact;
};

const INSTAT_GDP: Source = { label: { sq: 'INSTAT, PBB 2025', en: 'INSTAT, GDP 2025' }, url: 'https://www.instat.gov.al/media/441igujp/gross-domestic-product-2025.pdf' };
const INSTAT_FIRMS: Source = { label: { sq: 'INSTAT, njësi aktive 2025', en: 'INSTAT, active enterprises 2025' }, url: 'https://www.instat.gov.al/media/fz4pqhun/tab-2-nj%C3%ABsi-ligjore-aktive-sipas-aktivitetit-ekonomik-dhe-pron%C3%ABsis%C3%AB.xlsx' };
const PVGIS: Source = { label: { sq: 'PVGIS 5.3, JRC', en: 'PVGIS 5.3, JRC' }, url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=41.32833&lon=19.81806&peakpower=1&loss=14&optimalangles=1&outputformat=json' };
const ERE_AR: Source = { label: { sq: 'ERE, Raporti vjetor 2025', en: 'ERE, Annual Report 2025' }, url: 'https://www.ere.gov.al/images/files/2026/09/11/Annual_Report_2025.pdf' };
const ERE_AR_T10: Source = { label: { sq: 'ERE, Raporti vjetor 2025, tabela 10, f. 48', en: 'ERE, Annual Report 2025, Table 10, p. 48' }, url: ERE_AR.url };
const INSTR_URL = 'https://web.archive.org/web/20250420015647/https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf';
const INSTR_3: Source = { label: { sq: 'Ministria e Infrastrukturës dhe Energjisë, Udhëzimi 3/2019, pika 17', en: 'Ministry of Infrastructure and Energy, Instruction 3/2019, point 17' }, url: INSTR_URL };
const INSTR_3_SIZE: Source = { label: { sq: 'Udhëzimi 3/2019, pikat 4, 6 dhe 15', en: 'Instruction 3/2019, points 4, 6 and 15' }, url: INSTR_URL };
const ERE_TAR: Source = { label: { sq: 'ERE, Vendimi 322/2025', en: 'ERE, Decision 322/2025' }, url: 'https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf' };
const INSTAT_EL: Source = { label: { sq: 'INSTAT, bilanci i energjisë elektrike 2025', en: 'INSTAT, electricity balance 2025' }, url: 'https://www.instat.gov.al/media/mngpviyc/balance-of-electric-power-2025.pdf' };

export const LAYERS: Layer[] = [
  {
    n: 1,
    name: { sq: 'Themeli dhe muret', en: 'Foundation and walls' },
    short: { sq: 'Çimento, blloqe, hekur betoni, ngjitës', en: 'Cement, blocks, rebar, adhesives' },
    categories: ['cement-and-masonry'],
    fact: {
      value: { sq: '12,56%', en: '12.56%' },
      text: { sq: 'e prodhimit të brendshëm bruto të Shqipërisë në vitin 2025 erdhi nga ndërtimi.', en: 'of Albania’s GDP in 2025 came from construction.' },
      source: INSTAT_GDP,
    },
    extra: { value: { sq: '8 335', en: '8,335' }, text: { sq: 'firma ndërtimi aktive në fund të vitit 2025', en: 'construction firms active at the end of 2025' }, source: INSTAT_FIRMS },
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
    extra: { value: { sq: '3 551', en: '3,551' }, text: { sq: 'familje, biznese dhe institucione prodhonin vetë energji diellore në fund të vitit 2025', en: 'homes, businesses and institutions made their own solar power by the end of 2025' }, source: ERE_AR },
  },
  {
    n: 5,
    name: { sq: 'Inverteri dhe bateria', en: 'Inverter and battery' },
    short: { sq: 'Inverterë të lidhur me rrjetin dhe hibridë, bateri litiumi', en: 'Grid-tied and hybrid inverters, lithium batteries' },
    categories: ['inverters', 'batteries'],
    fact: {
      value: { sq: '0 lekë', en: '0 lekë' },
      text: {
        sq: 'është vlera që i japim energjisë që tepron mbi konsumin e muajit. Udhëzimi 3/2019 (pika 17) e kalonte tepricën te furnizuesi pa pagesë; për rregullat e net billing të majit 2026 nuk kemi gjetur ende një çmim të publikuar. Energjia që përdorni vetë vlen sa tarifa.',
        en: 'is the value we give to power left over beyond the month’s use. Instruction 3/2019 (point 17) passed the surplus to the supplier unpaid; for the net-billing rules of May 2026 we have not yet found a published price. Power you use yourself is worth the tariff.',
      },
      source: INSTR_3,
    },
    extra: { value: { sq: '19:00–23:00', en: '19:00–23:00' }, text: { sq: 'orët e pikut (prill–tetor) për bizneset në 0,4 kV: 16,1 lekë/kWh; familjet nuk kanë çmim për orët e pikut', en: 'peak hours (Apr–Oct) for businesses at 0.4 kV: 16.1 lekë/kWh; households have no peak price' }, source: ERE_TAR },
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
      text: { sq: 'e energjisë elektrike të prodhuar në Shqipëri në vitin 2025 erdhi nga hidrocentralet. Një vit i thatë (2017) dha 4 174 GWh, një vit me shi (2018) 8 076 GWh: shiu ende vendos për rrjetin.', en: 'of the electricity made in Albania in 2025 came from hydropower. A dry year (2017) gave 4,174 GWh, a wet one (2018) 8,076 GWh: rain still decides the grid.' },
      source: INSTAT_EL,
      also: ERE_AR_T10,
    },
    extra: { value: { sq: '−21%', en: '−21%' }, text: { sq: 'prurjet në kaskadën e Drinit në vitin 2025, nën mesataren 30-vjeçare', en: 'inflow to the Drin cascade in 2025, below the 30-year average' }, source: ERE_AR },
  },
];

/** Albania in numbers: the stat stack on the home page. */
export const NUMBERS: Fact[] = [
  { value: { sq: '21 → 631 MW', en: '21 → 631 MW' }, text: { sq: 'Kapaciteti i centraleve diellore u rrit tridhjetë herë nga viti 2020 deri në fund të vitit 2025.', en: 'Solar plant capacity grew thirtyfold from 2020 to the end of 2025.' }, source: { label: { sq: 'ERE, Raporti vjetor 2025, f. 42', en: 'ERE, Annual Report 2025, p. 42' }, url: ERE_AR.url } },
  { value: { sq: '832 GWh', en: '832 GWh' }, text: { sq: 'prodhuan centralet fotovoltaike në vitin 2025.', en: 'came from solar plants in 2025.' }, source: { label: { sq: 'ERE, Raporti vjetor 2025, f. 15', en: 'ERE, Annual Report 2025, p. 15' }, url: ERE_AR.url } },
  { value: { sq: '3 375 GWh', en: '3,375 GWh' }, text: { sq: 'energji elektrike importoi Shqipëria në vitin 2025; importi neto arriti 877 GWh.', en: 'of electricity were imported in 2025; net imports reached 877 GWh.' }, source: INSTAT_EL },
  { value: { sq: '500 kW', en: '500 kW' }, text: { sq: 'është kufiri ligjor për impiantin e një vetëprodhuesi (familje ose biznes); madhësia varet nga konsumi vjetor dhe miratohet nga OSSH.', en: 'is the legal cap for a home or business producing its own power; the size is set by yearly use and approved by the grid operator.' }, source: { label: { sq: 'Ligji 24/2023, neni 20', en: 'Law 24/2023, Art. 20' }, url: 'https://www.ere.gov.al/media/files/2024/01/31/Law_no._24_2023_On_the_promotion_of_the_use_of_energy_from_renewable_sources.pdf' }, also: INSTR_3_SIZE },
  { value: { sq: '45,4%', en: '45.4%' }, text: { sq: 'e shqiptarëve 16–74 vjeç blenë diçka online në 12 muajt e fundit (2025).', en: 'of Albanians aged 16–74 bought something online in the last 12 months (2025).' }, source: { label: { sq: 'INSTAT, TIK 2025', en: 'INSTAT, ICT survey 2025' }, url: 'https://www.instat.gov.al/media/4jkhqz0c/ict-2025_english.pdf' } },
];
