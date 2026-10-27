// Six solar packages (/paketa-diellore, /en/solar-packages). Definitions only: NO PRICES here. The build step prices each
// package per city with sizeSystem() from src/lib/solar.ts (cheapest in-stock offers from sellers who deliver to the city).
// Sources for the numbers in the copy: research/tariffs-prices.md (§0 PVGIS Tirana 1 435,3 kWh/kWp, §1 ERE 2026 tariffs),
// research/albania-energy.md §4 (Instruction 3/2019: sizing at 1 400 kWh/kWp, point 15, meters at the customer's cost),
// research/marketplace-ux.md §6 (Memodo: about 6.5 m² of roof per kWp, a supplier's rule of thumb, shown as guidance).
//
// ── For the builder ───────────────────────────────────────────────────────────────────────────────────────────────
// Put the server code in a new src/lib/packages.ts (this content file must stay free of db imports):
//
//   import type { Kit, SolarResult } from './solar';
//   export type PricedPackage = {
//     pkg: SolarPackage;
//     citySlug: string;
//     result: SolarResult | null;   // null when the city has no PVGIS yield: sizeSystem() returns null (only the 14 cities of
//                                   // pvCities() in src/lib/pages-db.ts have one — Kavajë, Krujë, Kuçovë, Laç, Peshkopi, Përmet do not)
//     extras: Kit[];                // pkg.extras priced the same way as the kit (cheapest in-stock offer delivering to the zone)
//     total: number | null;         // result.kitTotal + extras, in lekë incl. VAT; null when any line is missing
//     complete: boolean;            // result?.kitTotal !== null && every extra found
//     overRegulatorySize: boolean;  // result.kwp × REGULATORY_KWH_PER_KWP > kwhMonth × 12 (Instruction 3/2019 points 4, 6, 15)
//   };
//   /** sizeSystem(sizeInputFor(pkg, citySlug)), then the extras; never throws, never caches across cities. */
//   export async function pricePackage(pkg: SolarPackage, citySlug?: string): Promise<PricedPackage>;
//   export async function pricePackages(citySlug?: string): Promise<PricedPackage[]>;   // PACKAGES in order
//
// Built (src/lib/packages.ts); it prices the extras with solar.ts's exported cheapest(). Since 2026-10-27 sizeSystem()
// pairs a battery with an inverter only when src/content/battery-compat.ts lists the pair as compatible (the makers' own
// lists, checked on COMPAT_CHECKED; 'unknown' never pairs) and takes the cheapest such pair. With no compatible pair in
// stock the kit has no battery line and no total (PricedPackage.batteryIssue says why). BATTERY_NOTE below states that
// rule; the card shows the pair itself (who lists it, key conditions, the makers' documents) and packages.batteryCheck
// in src/i18n/renewables.ts (the installer still sets firmware, link and settings and confirms the equipment list).
// The `solarAssumptions` setting is read with await (solarAssumptions() in solar.ts), so admin values apply.
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import type { Lang } from '../lib/i18n';
import type { sizeSystem } from '../lib/solar';
import { checkedOn } from '../lib/compat-view';

type Bi = Record<Lang, string>;

/** The input sizeSystem() takes. Tied to its real signature, so a change there fails the type check here. */
export type SizeInput = Parameters<typeof sizeSystem>[0];

export type PackageId = 'home-3' | 'home-5-battery' | 'home-7-battery-3ph' | 'business-10' | 'business-20' | 'heat-pump-solar';

/** Something the package adds beyond sizeSystem()'s kit (panels, inverter, battery). */
export type PackageExtra = {
  categorySlugEn: string; // categories.slug_en
  qty: number;
  /** Exact-match spec filters (product_specs value_num), e.g. { phases: 1 }. */
  specEquals?: Record<string, number>;
  /** Inclusive [min, max] spec ranges. */
  specRange?: Record<string, [number, number]>;
  /** Why the filter is what it is (shown in the admin help or a tooltip, not on the card). */
  why: Bi;
};

export type SolarPackage = {
  id: PackageId;
  n: number;
  /** The size in the name. The card also shows the real kWp from sizeSystem() for the chosen city (module wattage varies). */
  nominalKwp: number;
  name: Bi;
  summary: Bi;
  /** sizeSystem() input; citySlug is the default city. */
  input: SizeInput;
  /** Who it suits: short lines for a list. */
  suits: Bi[];
  /** Roof area as guidance: nominalKwp × ROOF_M2_PER_KWP, rounded. Shown with the guidance tag. */
  roofM2: number;
  extras?: PackageExtra[];
  /** What the price does NOT include: NOT_INCLUDED plus these. */
  notIncludedExtra?: Bi[];
  notes?: Bi[];
};

export const DEFAULT_PACKAGE_CITY = 'tirane';
/** Instruction 3/2019 point 6: self-producer plants are sized at 1 400 kWh per kWp, whatever the region. */
export const REGULATORY_KWH_PER_KWP = 1400;
/** Memodo's planning note (research/marketplace-ux.md §6): "approx. 6.5 square meters" per kWp. Guidance, not a rule. */
export const ROOF_M2_PER_KWP = 6.5;

/** Not in any package price: sizeSystem() prices panels, inverter and battery only. */
export const NOT_INCLUDED: Bi[] = [
  { sq: 'Struktura e montimit në çati ose në tarracë', en: 'The roof or flat-roof mounting system' },
  { sq: 'Kabllot diellore, lidhësit MC4, ndërprerësi DC dhe mbrojtjet', en: 'Solar cable, MC4 connectors, the DC isolator and protection devices' },
  { sq: 'Matësi dypalësh dhe matësi i prodhimit, me shpenzimet tuaja sipas Udhëzimit 3/2019', en: 'The two-way meter and the production meter, at your cost under Instruction 3/2019' },
  { sq: 'Projekti nga një projektues i licencuar', en: 'The design by a licensed designer' },
  { sq: 'Instalimi', en: 'Installation' },
  { sq: 'Leja e bashkisë dhe aplikimi te OSSH', en: 'The municipal permit and the application to the grid operator (OSSH)' },
];

// The pairing rule (src/lib/solar.ts sizeSystem + src/content/battery-compat.ts). No backup promise: some listed pairs
// work on-grid only (CompatPair.onGridOnly), and the card says so when the chosen pair is one of them.
const BATTERY_NOTE: Bi = {
  sq: `Inverteri dhe bateria bashkohen vetëm kur të paktën njëri nga dy prodhuesit e liston çiftin si të përputhshëm dhe asnjëri nuk e përjashton (listat u lexuan më ${checkedOn('sq').text}); nga këto çifte merret më i liri në gjendje. Kur për qytetin nuk ka në gjendje asnjë çift të tillë, paketa mbetet pa çmim.`,
  en: `The inverter and the battery are paired only when at least one of the two makers lists the pair as compatible and neither excludes it (lists read on ${checkedOn('en').text}); of those pairs, the cheapest in stock is used. When no such pair is in stock for the city, the package has no price.`,
};
const BUSINESS_NOTE: Bi = {
  sq: 'Paketat e biznesit llogariten për 80% të konsumit vjetor, që në Tiranë impianti të dalë afër madhësisë që tregon emri i paketës. Kalkulatori llogarit për 90%, prandaj me të njëjtin konsum jep një impiant pak më të madh.',
  en: 'Business packages are sized for 80% of yearly use, so that in Tirana the plant comes out close to the size in the package’s name. The calculator sizes for 90%, so with the same use it gives a slightly larger plant.',
};
// Business packages pass coverage 0.8 so the array lands on the nominal size in Tirana (1 500 × 12 × 0.8 ÷ 1 435.3 ≈ 10 kWp).
// It is a package choice, not a rule; it also keeps the plant well under the yearly use (Instruction 3/2019 point 15).
const BUSINESS_COVERAGE = 0.8;

const roof = (kwp: number) => Math.round(kwp * ROOF_M2_PER_KWP);

export const PACKAGES: SolarPackage[] = [
  {
    id: 'home-3',
    n: 1,
    nominalKwp: 3,
    name: { sq: 'Shtëpi 3 kWp', en: 'Home 3 kWp' },
    summary: {
      sq: 'Panele dhe një inverter njëfazor për një familje që konsumon rreth 350 kWh në muaj. Pa bateri: energjia përdoret kur prodhohet.',
      en: 'Panels and a single-phase inverter for a household using about 350 kWh a month. No battery: the energy is used as it is made.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 350, kind: 'household', battery: false, phases: 1 },
    suits: [
      { sq: 'Familje me rreth 350 kWh në muaj, pra rreth 4 200 kWh në vit', en: 'A household using about 350 kWh a month, about 4,200 kWh a year' },
      { sq: 'Lidhje njëfazore me rrjetin', en: 'A single-phase grid connection' },
      { sq: 'Shtëpi ku shumica e energjisë përdoret ditën', en: 'A home that uses most of its power in the daytime' },
    ],
    roofM2: roof(3),
  },
  {
    id: 'home-5-battery',
    n: 2,
    nominalKwp: 5,
    name: { sq: 'Shtëpi 5 kWp + bateri', en: 'Home 5 kWp + battery' },
    summary: {
      sq: 'Panele, një inverter hibrid njëfazor dhe një bateri për një familje me rreth 600 kWh në muaj, që përdor shumë energji në mbrëmje.',
      en: 'Panels, a single-phase hybrid inverter and a battery for a household using about 600 kWh a month, much of it in the evening.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 600, kind: 'household', battery: true, phases: 1 },
    suits: [
      { sq: 'Familje me rreth 600 kWh në muaj', en: 'A household using about 600 kWh a month' },
      { sq: 'Konsum i madh në mbrëmje dhe natën', en: 'High use in the evening and at night' },
      { sq: 'Familje që në disa muaj i afrohet kufirit të 700 kWh: çdo kWh nga dielli që përdorni vetë e ul konsumin e faturuar', en: 'A household that nears the 700 kWh cliff in some months: every solar kWh you use yourself lowers the billed use' },
      { sq: 'Lidhje njëfazore me rrjetin', en: 'A single-phase grid connection' },
    ],
    roofM2: roof(5),
    notes: [BATTERY_NOTE],
  },
  {
    id: 'home-7-battery-3ph',
    n: 3,
    nominalKwp: 7,
    name: { sq: 'Shtëpi 7 kWp + bateri, trefazor', en: 'Home 7 kWp + battery, three-phase' },
    summary: {
      sq: 'Panele, një inverter hibrid trefazor dhe një bateri për një familje me rreth 900 kWh në muaj, mbi kufirin ku e gjithë fatura e muajit llogaritet me 9,5 lekë/kWh.',
      en: 'Panels, a three-phase hybrid inverter and a battery for a household using about 900 kWh a month, above the cliff where the whole month is billed at 9.5 lekë/kWh.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 900, kind: 'household', battery: true, phases: 3 },
    suits: [
      { sq: 'Familje me rreth 900 kWh në muaj, mbi kufirin e 700 kWh', en: 'A household using about 900 kWh a month, above the 700 kWh cliff' },
      { sq: 'Lidhje trefazore me rrjetin', en: 'A three-phase grid connection' },
      { sq: 'Konsum i madh në mbrëmje dhe natën', en: 'High use in the evening and at night' },
    ],
    roofM2: roof(7),
    notes: [BATTERY_NOTE],
  },
  {
    id: 'business-10',
    n: 4,
    nominalKwp: 10,
    name: { sq: 'Biznes i vogël 10 kWp', en: 'Small business 10 kWp' },
    summary: {
      sq: 'Panele dhe një inverter trefazor për një biznes të lidhur në 0,4 kV, me rreth 1 500 kWh në muaj, që paguan 14 lekë/kWh dhe 16,1 në orët e pikut.',
      en: 'Panels and a three-phase inverter for a business connected at 0.4 kV, using about 1,500 kWh a month and paying 14 lekë/kWh, 16.1 at peak hours.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 1500, kind: 'business', battery: false, phases: 3, coverage: BUSINESS_COVERAGE },
    suits: [
      { sq: 'Dyqan, zyrë ose punishte e lidhur në tension të ulët (0,4 kV)', en: 'A shop, office or workshop on the low-voltage grid (0.4 kV)' },
      { sq: 'Rreth 1 500 kWh në muaj, kryesisht gjatë ditës', en: 'About 1,500 kWh a month, mostly in the daytime' },
      { sq: 'Lidhje trefazore me rrjetin', en: 'A three-phase grid connection' },
    ],
    roofM2: roof(10),
    notes: [BUSINESS_NOTE],
  },
  {
    id: 'business-20',
    n: 5,
    nominalKwp: 20,
    name: { sq: 'Biznes 20 kWp', en: 'Business 20 kWp' },
    summary: {
      sq: 'Panele dhe një inverter trefazor për një biznes në 0,4 kV me rreth 3 000 kWh në muaj, për çati të mëdha ose tarraca.',
      en: 'Panels and a three-phase inverter for a business at 0.4 kV using about 3,000 kWh a month, for large roofs or flat roofs.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 3000, kind: 'business', battery: false, phases: 3, coverage: BUSINESS_COVERAGE },
    suits: [
      { sq: 'Biznes me rreth 3 000 kWh në muaj, kryesisht gjatë ditës', en: 'A business using about 3,000 kWh a month, mostly in the daytime' },
      { sq: 'Lidhje trefazore në 0,4 kV', en: 'A three-phase connection at 0.4 kV' },
      { sq: 'Çati e madhe ose tarracë pa hije', en: 'A large, unshaded roof or flat roof' },
    ],
    roofM2: roof(20),
    notes: [BUSINESS_NOTE],
  },
  {
    id: 'heat-pump-solar',
    n: 6,
    nominalKwp: 5,
    name: { sq: 'Pompë nxehtësie + diell', en: 'Heat pump + solar' },
    summary: {
      sq: 'Një pompë nxehtësie ajër–ujë dhe rreth 5 kWp panele me inverter njëfazor, për një familje me rreth 650 kWh në muaj bashkë me pompën.',
      en: 'An air-to-water heat pump and about 5 kWp of panels with a single-phase inverter, for a household using about 650 kWh a month including the pump.',
    },
    input: { citySlug: DEFAULT_PACKAGE_CITY, kwhMonth: 650, kind: 'household', battery: false, phases: 1 },
    suits: [
      { sq: 'Familje që do të ngrohet me pompë nxehtësie dhe të ketë ujë të ngrohtë prej saj', en: 'A household that wants heating and hot water from a heat pump' },
      { sq: 'Rreth 650 kWh në muaj bashkë me pompën: pompa nuk duhet ta çojë muajin mbi 700 kWh', en: 'About 650 kWh a month including the pump: the pump should not push the month over 700 kWh' },
      { sq: 'Ngrohje me dysheme ose radiatorë me temperaturë të ulët, ku pompa punon me efikasitet më të lartë', en: 'Underfloor heating or low-temperature radiators, where the pump runs most efficiently' },
      { sq: 'Lidhje njëfazore me rrjetin', en: 'A single-phase grid connection' },
    ],
    roofM2: roof(5),
    extras: [
      {
        categorySlugEn: 'heat-pumps',
        qty: 1,
        specEquals: { phases: 1 },
        specRange: { heating_capacity_kw: [4, 10] },
        why: {
          sq: 'Njëfazore, si inverteri i paketës. 4–10 kW mbulon pompat për shtëpi në katalogun e sotëm (4,6–9 kW); nuk është përmasim: fuqinë e duhur e llogarit instaluesi nga humbjet e nxehtësisë së shtëpisë.',
          en: 'Single-phase, like the package’s inverter. 4–10 kW covers the home-size pumps in today’s catalogue (4.6–9 kW); it is not sizing: the installer works out the right capacity from the house’s heat loss.',
        },
      },
    ],
    notIncludedExtra: [
      { sq: 'Njësia e brendshme ose depozita e ujit, kur modeli i kërkon veç', en: 'The indoor unit or the hot-water tank, when the model needs them separately' },
      { sq: 'Tubacionet dhe lidhja me radiatorët ose me ngrohjen me dysheme', en: 'Pipework and the connection to radiators or underfloor heating' },
      { sq: 'Llogaritja e humbjeve të nxehtësisë së shtëpisë', en: 'The house’s heat-loss calculation' },
    ],
    notes: [
      {
        sq: 'Madhësia e pompës në paketë është një zgjedhje e katalogut, jo një llogaritje për shtëpinë tuaj.',
        en: 'The pump in the package is a catalogue pick, not a calculation for your home.',
      },
    ],
  },
];

/** The sizeSystem() input for a package in a city (default: the package's own city). Pure: no db. */
export function sizeInputFor(pkg: SolarPackage, citySlug?: string): SizeInput {
  return { ...pkg.input, citySlug: citySlug || pkg.input.citySlug };
}

/** Everything the price leaves out, the common list first. */
/** On a battery package: the meter some listed pairs require (Fronius Smart Meter, Huawei power meter; see the pair's
 *  key conditions) is not in the kit either. */
export const PAIR_METER_NOT_INCLUDED: Bi = {
  sq: 'Matësi i energjisë në pikën e lidhjes me rrjetin, kur çifti inverter + bateri e kërkon (p.sh. Fronius Smart Meter; shihni kushtet kryesore)',
  en: 'The energy meter at the grid connection, when the inverter + battery pair needs one (e.g. the Fronius Smart Meter; see the key conditions)',
};

export function notIncluded(pkg: SolarPackage): Bi[] {
  return [...NOT_INCLUDED, ...(pkg.input.battery ? [PAIR_METER_NOT_INCLUDED] : []), ...(pkg.notIncludedExtra ?? [])];
}

/** Instruction 3/2019 sizes at 1 400 kWh/kWp; a plant above the yearly use at that rate may be refused (point 15). */
export function overRegulatorySize(kwp: number, kwhMonth: number): boolean {
  return kwp * REGULATORY_KWH_PER_KWP > kwhMonth * 12;
}

export const packageById = (id: string): SolarPackage | undefined => PACKAGES.find((p) => p.id === id);
