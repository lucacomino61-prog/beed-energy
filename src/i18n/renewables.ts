// Copy for the renewable-energy focus: new nav labels, the guide and packages pages (titles, meta, page labels),
// the energy line on product cards and short buying-guide intros for the energy categories.
// Content of the guide itself: src/content/renewables.ts; package definitions: src/content/packages.ts.
// Titles: Site.astro appends " · BeeD Energy" (14 characters), so every `title` here is ≤ 51 characters and the full
// <title> lands in 25–65. Descriptions are 70–160 characters. Numbers in the intros come from research/ (sources below).
import type { Lang } from '../lib/i18n';
import type { Source } from '../content/renewables';

/** Energy categories (categories.slug_en, scripts/catalog/categories.mjs, group_key 'energy'). */
export type EnergyCategory =
  | 'solar-panels'
  | 'inverters'
  | 'batteries'
  | 'heat-pumps'
  | 'solar-water-heaters'
  | 'ev-chargers'
  | 'energy-monitoring'
  | 'mounting-systems'
  | 'pv-accessories';

export const ENERGY_CATEGORIES: EnergyCategory[] = [
  'solar-panels', 'inverters', 'batteries', 'heat-pumps', 'solar-water-heaters', 'ev-chargers', 'energy-monitoring', 'mounting-systems', 'pv-accessories',
];

type Meta = { title: string; description: string };

export type RenewablesCopy = {
  nav: {
    solar: string;
    storage: string;
    heatPumps: string;
    ev: string;
    packages: string;
    guide: string;
    calculator: string;
    /** Menu/footer/shop heading over the efficiency + build categories (group_key 'efficiency' and 'build'). */
    efficiencyBuild: string;
  };
  guide: Meta & {
    eyebrow: string;
    h1: string;
    lede: string;
    index: string;
    source: string;
    sources: string;
    alsoSource: string;
    tags: { guidance: string; assumption: string; unknown: string; computed: string };
    table: { city: string; yield: string; tilt: string; azimuth: string; dec: string; jul: string; caption: string };
    roofTable: { roof: string; tilt: string; facing: string; yield: string; vsBest: string; caption: string };
    toShop: string;
    /** Category pages: the link under the buying-guide intro to the matching part of the guide. */
    readMore: string;
    toPackages: string;
    toCalculator: string;
    read: (date: string) => string;
    /** The drawing sheet beside the poster: the PV module and three city yields on leader lines. */
    sheetTitle: string;
    /** Title-block cells under the poster. */
    tb: { sections: string; sources: string; questions: string; read: string };
    /** Shop shelf line: live product count and lowest price. */
    shelf: (n: number, from: string | null) => string;
  };
  packages: Meta & {
    eyebrow: string;
    h1: string;
    lede: string;
    city: string;
    cityApply: string;
    size: (kwp: string, panels: number, wp: string) => string;
    year: (kwh: string, city: string) => string;
    priceLabel: string;
    priceNote: string;
    incomplete: string;
    suits: string;
    notIncluded: string;
    roof: (m2: number) => string;
    includes: string;
    lines: { panel: string; inverter: string; battery: string; extra: string };
    overSize: string;
    /** Beside the price of a battery package whose inverter + battery pair is on the makers' lists (src/content/battery-compat.ts). */
    batteryCheck: string;
    assumptions: string;
    toCalculator: string;
    quote: string;
    toGuide: string;
    /** Title-block cells under the poster. */
    tb: { yield: string; tariff: string; prices: string; pricesValue: string };
    /** The key plan beside the poster: every package's panel array at one scale. */
    planTitle: string;
    /** One click puts every line of a complete package in the basket (/api/cart add-many). */
    addAll: string;
    /** Word tag on the over-size note (never colour alone). */
    caution: string;
    /** Before the list of parts with no offer, on an incomplete card. */
    missing: string;
    /** A delivery city without a PVGIS yield: the page prices for Tirana and says so. */
    cityFallback: (asked: string, shown: string) => string;
  };
  card: {
    /** Solar panels: kWh is panelYearKwh() formatted with num(), city is cities.name_sq / name_en. */
    panelYear: (kwh: string, city: string) => string;
    panelYearTitle: string;
    /** Batteries: usable_capacity_kwh formatted with num(…, 2). */
    batteryUsable: (kwh: string) => string;
    batteryUsableTitle: string;
    /** Heat pumps: cop_a7w35 formatted with num(…, 2). */
    heatPumpCop: (cop: string) => string;
    heatPumpCopTitle: string;
  };
  categoryIntro: Record<EnergyCategory, string>;
  home: {
    packagesEyebrow: string;
    packagesTitle: string;
    packagesText: string;
    packagesCta: string;
    packagesFrom: (price: string) => string;
    /** Under the "from" price: the city the packages were priced for (the remembered one, else Tirana). */
    packagesFor: (city: string) => string;
    guideEyebrow: string;
    /** Heading over the guide's six sections in the home teaser. */
    guideIndex: string;
    guideTitle: string;
    guideText: string;
    guideCta: string;
  };
};

/** Annual kWh for a panel card: power_wp × the city's PVGIS yield (kWh per kWp per year) ÷ 1000, rounded. */
export function panelYearKwh(powerWp: number, yieldKwhPerKwp: number): number {
  return Math.round((powerWp * yieldKwhPerKwp) / 1000);
}

// The PVGIS runs each intro figure comes from (the same URLs as src/content/renewables.ts and research/pvgis-albania.json).
// Category pages print only the label, so it names the city and, for the Tirana roof runs, the mounting.
const PVGIS_KUKES: Source = {
  label: { sq: 'PVGIS 5.3, JRC (Kukës)', en: 'PVGIS 5.3, JRC (Kukës)' },
  url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=42.083&lon=20.417&peakpower=1&loss=14&optimalangles=1&outputformat=json',
};
const PVGIS_FIER: Source = {
  label: { sq: 'PVGIS 5.3, JRC (Fier)', en: 'PVGIS 5.3, JRC (Fier)' },
  url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=40.725&lon=19.55722&peakpower=1&loss=14&optimalangles=1&outputformat=json',
};
const PVGIS_TIRANE_30: Source = {
  label: { sq: 'PVGIS 5.3, JRC (Tiranë, 30°, panele të ajrosura)', en: 'PVGIS 5.3, JRC (Tirana, 30°, ventilated panels)' },
  url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=41.32833&lon=19.81806&peakpower=1&loss=14&angle=30&aspect=0&outputformat=json',
};
const PVGIS_TIRANE_30_FLUSH: Source = {
  label: { sq: 'PVGIS 5.3, JRC (Tiranë, 30°, panele ngjitur me çatinë)', en: 'PVGIS 5.3, JRC (Tirana, 30°, panels flush with the roof)' },
  url: 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=41.32833&lon=19.81806&peakpower=1&loss=14&angle=30&aspect=0&mountingplace=building&outputformat=json',
};
const PV_MAG: Source = {
  label: { sq: 'pv magazine, 27.08.2026', en: 'pv magazine, 27 Aug 2026' },
  url: 'https://www.pv-magazine.com/2026/08/27/albanias-solar-market-shifts-toward-storage-market-integration/',
};
const ERE_TAR: Source = {
  label: { sq: 'ERE, tarifat për vitin 2026 (Vendimi 322/2025)', en: 'ERE, tariffs for 2026 (Decision 322/2025)' },
  url: 'https://ere.gov.al/media/files/2025/12/24/Tarifat_dhe_%C3%87mimet_e_energjis%C3%AB_Elektrike_dhe_Gazit_natyror_p%C3%ABr_VITIN_2026.pdf',
};
const INSTR_3: Source = {
  label: { sq: 'Ministria e Infrastrukturës dhe Energjisë, Udhëzimi 3/2019, pika 7/d', en: 'Ministry of Infrastructure and Energy, Instruction 3/2019, point 7(d)' },
  url: 'https://web.archive.org/web/20250420015647/https://ere.gov.al/doc/Udhezim_3_20.06.2019%20(2).pdf',
};
const PVGIS_MANUAL: Source = {
  label: { sq: 'PVGIS, manuali i përdoruesit (JRC)', en: 'PVGIS user manual (JRC)' },
  url: 'https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/pvgis-user-manual_en',
};

/** Sources for the numbers in categoryIntro (show as a footnote under the intro). Intros without numbers have none. */
export const CATEGORY_INTRO_SOURCES: Partial<Record<EnergyCategory, Source[]>> = {
  'solar-panels': [PVGIS_KUKES, PVGIS_FIER],
  'ev-chargers': [ERE_TAR],
  'energy-monitoring': [INSTR_3, PV_MAG],
  'mounting-systems': [PVGIS_MANUAL, PVGIS_TIRANE_30, PVGIS_TIRANE_30_FLUSH],
};

export const renewables: Record<Lang, RenewablesCopy> = {
  sq: {
    nav: {
      solar: 'Energji diellore',
      storage: 'Ruajtja',
      heatPumps: 'Pompa nxehtësie',
      ev: 'Karikim EV',
      packages: 'Paketa',
      guide: 'Udhëzuesi',
      calculator: 'Kalkulatori',
      // Same word as common.ts's "Efikasitet energjetik" (glossary: one form in the UI), decided 2026-10-27.
      efficiencyBuild: 'Efikasitet dhe ndërtim',
    },
    guide: {
      title: 'Energjia e rinovueshme: udhëzues për Shqipërinë',
      description: 'Si bëheni vetëprodhues, tarifat e ERE-s për 2026, sa prodhon dielli në 14 qytete dhe si zgjidhni panelet, inverterin, baterinë dhe pompën e nxehtësisë.',
      eyebrow: 'Udhëzues · Energji e rinovueshme në Shqipëri',
      h1: 'Energjia e rinovueshme, hap pas hapi',
      lede: 'Çfarë thonë ligji dhe tarifat, sa prodhon dielli në qytetin tuaj dhe si zgjidhni pajisjet. Çdo shifër ka burimin e vet; aty ku nuk dimë diçka, e themi.',
      index: 'Në këtë faqe',
      source: 'Burimi',
      sources: 'Burimet',
      alsoSource: 'Edhe',
      tags: {
        guidance: 'Udhëzim i përgjithshëm, jo rregull ligjor',
        assumption: 'Supozimi ynë',
        unknown: 'E pa verifikuar',
        computed: 'Llogaritje jona',
      },
      table: {
        city: 'Qyteti',
        yield: 'kWh/kWp në vit',
        tilt: 'Pjerrësia më e mirë',
        azimuth: 'Drejtimi',
        dec: 'Dhjetor',
        jul: 'Korrik',
        caption: 'Prodhimi vjetor i 1 kWp panele, me pjerrësinë dhe drejtimin më të mirë, humbje 14% (PVGIS 5.3, 2005–2023). Drejtimi: 0° = jug, minus = drejt lindjes.',
      },
      roofTable: {
        roof: 'Çatia',
        tilt: 'Pjerrësia',
        facing: 'Drejtimi',
        yield: 'kWh/kWp në vit',
        vsBest: 'Krahasuar me më të mirën',
        caption: 'Tiranë: e njëjta pikë, lloje të ndryshme çatie (PVGIS 5.3, humbje 14%).',
      },
      toShop: 'Shiko në dyqan',
      readMore: 'Lexoni më shumë në udhëzues',
      toPackages: 'Shiko paketat diellore',
      toCalculator: 'Llogaritni impiantin tuaj',
      read: (date) => `Burimet u lexuan më ${date}.`,
      sheetTitle: 'Sa prodhon 1 kWp panele në vit',
      tb: { sections: 'Seksione', sources: 'Burime', questions: 'Pyetje', read: 'Lexuar më' },
      shelf: (n, from) => `${n} ${n === 1 ? 'produkt' : 'produkte'}${from ? `, nga ${from}` : ''}`,
    },
    packages: {
      title: 'Paketa diellore për shtëpi dhe biznes',
      description: 'Gjashtë paketa diellore, nga 3 kWp për shtëpi te 20 kWp për biznes, me çmimet e pajisjeve nga ofertat e sotme të shitësve që dërgojnë në qytetin tuaj.',
      eyebrow: 'Paketa · Panele, inverter, bateri',
      h1: 'Gjashtë paketa diellore',
      lede: 'Çdo paketë llogaritet për qytetin tuaj me prodhimin e PVGIS dhe me ofertën më të lirë në gjendje për çdo pajisje, nga shitës që dërgojnë aty; me bateri, inverteri dhe bateria janë çifti më i lirë në gjendje që të paktën një prodhues e liston si të përputhshëm. Çmimi është për pajisjet; instalimi kërkohet me ofertë.',
      city: 'Qyteti',
      cityApply: 'Llogarit',
      size: (kwp, panels, wp) => `${kwp} kWp · ${panels} panele × ${wp} Wp`,
      year: (kwh, city) => `≈ ${kwh} kWh në vit në ${city}`,
      priceLabel: 'Pajisjet, me TVSH',
      priceNote: 'Ofertat më të lira në gjendje sot, nga shitës që dërgojnë në qytetin tuaj.',
      incomplete: 'Për këtë qytet sot mungon një ofertë në gjendje për një nga pajisjet, prandaj nuk japim çmim të plotë.',
      suits: 'Për kë është',
      notIncluded: 'Nuk përfshihet në çmim',
      roof: (m2) => `Rreth ${m2} m² çati`,
      includes: 'Në paketë',
      lines: { panel: 'Panele', inverter: 'Inverter', battery: 'Bateri', extra: 'Pompë nxehtësie' },
      overSize: 'Me 1 400 kWh/kWp të Udhëzimit 3/2019, kjo madhësi e kalon konsumin vjetor; OSSH mund të kërkojë një impiant më të vogël.',
      batteryCheck: 'Të paktën një prodhues e liston këtë çift inverteri dhe baterie si të përputhshëm dhe asnjë prodhues nuk e përjashton; kush e liston, shihet te “Çift i kontrolluar”. Instaluesi vendos përsëri firmware-in, lidhjen e komunikimit dhe cilësimet, dhe konfirmon listën e pajisjeve.',
      assumptions: 'Supozimet: prodhimi PVGIS për qytetin; madhësia e impiantit synon 90% të konsumit vjetor të paketës (80% te paketat e biznesit). Kursimin dhe periudhën e shlyerjes i llogarit kalkulatori, me tarifat e ERE-s për 2026 dhe tepricën në rrjet me 0 lekë.',
      toCalculator: 'Ndryshoni konsumin në kalkulator',
      quote: 'Kërko ofertë për instalimin',
      toGuide: 'Si bëheni vetëprodhues',
      tb: { yield: 'Rendimenti', tariff: 'Tarifa', prices: 'Çmimet', pricesValue: 'Ofertat e sotme' },
      planTitle: 'Gjashtë impiante në të njëjtën shkallë',
      addAll: 'Shtoni paketën në shportë',
      caution: 'Kujdes',
      missing: 'Mungon sot',
      cityFallback: (asked, shown) => `Për ${asked} nuk kemi prodhimin e PVGIS-it, prandaj paketat janë llogaritur për ${shown}.`,
    },
    card: {
      panelYear: (kwh, city) => `≈ ${kwh} kWh/vit në ${city}`,
      panelYearTitle: 'Prodhimi vjetor i një paneli me pjerrësinë më të mirë (PVGIS 5.3, humbje 14%)',
      batteryUsable: (kwh) => `${kwh} kWh të përdorshme`,
      batteryUsableTitle: 'Kapaciteti i përdorshëm sipas fletës teknike, jo ai nominal',
      heatPumpCop: (cop) => `COP ${cop}`,
      heatPumpCopTitle: 'Ajri jashtë 7 °C, uji 35 °C (A7/W35)',
    },
    categoryIntro: {
      'solar-panels':
        'Panele fotovoltaike me fletë teknike publike. Krahasoni fuqinë (Wp), efikasitetin, koeficientin e temperaturës dhe çmimin për Wp; garancia e produktit dhe ajo e performancës janë dy gjëra të ndryshme. Në Shqipëri 1 kWp panele prodhon në vit nga 1 358 kWh në Kukës deri në 1 521 kWh në Fier.',
      inverters:
        'Inverteri e kthen rrymën e paneleve në rrymë për shtëpinë dhe rrjetin. Zgjidhni njëfazor ose trefazor sipas lidhjes suaj, shikoni sa MPPT ka dhe sa kWp panele pranon, dhe merrni një hibrid nëse do të shtoni bateri.',
      batteries:
        'Bateri litiumi për të përdorur në mbrëmje energjinë e paneleve. Krahasoni kapacitetin e përdorshëm, jo atë nominal, dhe çmimin për kWh. Bateritë me tension të lartë dhe ato 48 V nuk zëvendësojnë njëra-tjetrën: kontrolloni që inverteri juaj e mbështet modelin.',
      'heat-pumps':
        'Pompa nxehtësie ajër–ujë për ngrohje, ujë të ngrohtë dhe, te disa modele, ftohje. COP tregon sa kWh nxehtësi jep pompa për 1 kWh energji elektrike, me ajrin jashtë 7 °C dhe ujin 35 °C; SCOP është mesatarja e sezonit. Fuqinë e duhur e llogarit instaluesi nga humbjet e nxehtësisë së shtëpisë.',
      'solar-water-heaters':
        'Ngrohës uji diellorë me termosifon: kolektori në çati ngroh ujin, që ngjitet vetë në depozitë pa pompë. Krahasoni vëllimin e depozitës, sipërfaqen e kolektorit dhe rezistencën elektrike për ditët pa diell.',
      'ev-chargers':
        'Karikues muri për makina elektrike. Karikuesit 22 kW në katalog janë trefazorë, prandaj kërkojnë lidhje trefazore. ERE ka një tarifë të veçantë, 22 lekë/kWh (25,3 në orët e pikut), për pikat e karikimit mbi 11 kW; karikuesi i shtëpisë deri në 11 kW mbetet me tarifën tuaj të zakonshme.',
      'energy-monitoring':
        'Matës inteligjentë për të parë prodhimin e paneleve dhe konsumin në kohë reale. Udhëzimi 3/2019 kërkon nga vetëprodhuesi dy matës me shpenzimet e tij: një matës dypalësh në lidhjen me rrjetin dhe një matës prodhimi pas inverterit. Para se të blini, pyesni OSSH-në nëse rregullat e majit 2026 e kanë ndryshuar këtë dhe cilat modele pranon.',
      'mounting-systems':
        'Struktura për çati me tjegulla, çati të sheshta dhe çati me llamarinë. Panelet pa ajër nga pas nxehen deri në 15 °C më shumë: në një çati 30° në Tiranë prodhojnë rreth 4% më pak. Ngarkesën e erës dhe të borës prodhuesit e llogaritin për çdo çati me programet e tyre.',
      'pv-accessories':
        'Kabllo diellore, lidhës dhe ndërprerës DC për impiante fotovoltaike. Lidhësit duhet të jenë të të njëjtit lloj me ata të paneleve: shumica e paneleve në katalog vijnë me lidhës MC4-EVO2, ndërsa Amphenol H4 lidhet vetëm me H4. Seksionin e kabllos e zgjedh instaluesi sipas rrymës dhe gjatësisë së linjës.',
    },
    home: {
      packagesEyebrow: 'Paketa diellore',
      packagesTitle: 'Nga 3 kWp për shtëpi te 20 kWp për biznes.',
      packagesText: 'Gjashtë paketa me panele dhe inverter, dy prej tyre me bateri, të llogaritura për qytetin tuaj me ofertat e sotme.',
      packagesCta: 'Shiko paketat',
      packagesFrom: (price) => `Pajisjet nga ${price}`,
      packagesFor: (city) => `${city} · ofertat e sotme në gjendje`,
      guideEyebrow: 'Udhëzuesi',
      guideIndex: 'Në udhëzues',
      guideTitle: 'Si bëheni vetëprodhues.',
      guideText: 'Hapat me OSSH-në, tarifat e 2026, sa prodhon dielli në qytetin tuaj dhe si zgjidhni pajisjet, me burimet për çdo shifër.',
      guideCta: 'Lexoni udhëzuesin',
    },
  },
  en: {
    nav: {
      solar: 'Solar',
      storage: 'Storage',
      heatPumps: 'Heat pumps',
      ev: 'EV charging',
      packages: 'Packages',
      guide: 'Guide',
      calculator: 'Calculator',
      efficiencyBuild: 'Efficiency & building',
    },
    guide: {
      title: 'Renewable energy in Albania: a buyer’s guide',
      description: 'How to become a self-producer, ERE’s 2026 tariffs, solar yield in 14 cities, and how to choose panels, inverters, batteries and heat pumps.',
      eyebrow: 'Guide · Renewable energy in Albania',
      h1: 'Renewable energy, step by step',
      lede: 'What the law and the tariffs say, how much the sun makes in your city and how to choose the equipment. Every figure has its source; where we do not know something, we say so.',
      index: 'On this page',
      source: 'Source',
      sources: 'Sources',
      alsoSource: 'Also',
      tags: {
        guidance: 'General guidance, not a legal rule',
        assumption: 'Our assumption',
        unknown: 'Not verified',
        computed: 'Our arithmetic',
      },
      table: {
        city: 'City',
        yield: 'kWh/kWp a year',
        tilt: 'Best tilt',
        azimuth: 'Facing',
        dec: 'December',
        jul: 'July',
        caption: 'Yearly output of 1 kWp of panels at the best tilt and orientation, 14% losses (PVGIS 5.3, 2005–2023). Facing: 0° = south, minus = towards east.',
      },
      roofTable: {
        roof: 'Roof',
        tilt: 'Tilt',
        facing: 'Facing',
        yield: 'kWh/kWp a year',
        vsBest: 'Against the best',
        caption: 'Tirana: the same point, different roofs (PVGIS 5.3, 14% losses).',
      },
      toShop: 'See in the shop',
      readMore: 'Read more in the guide',
      toPackages: 'See the solar packages',
      toCalculator: 'Work out your plant',
      read: (date) => `Sources read on ${date}.`,
      sheetTitle: 'What 1 kWp of panels makes in a year',
      tb: { sections: 'Sections', sources: 'Sources', questions: 'Questions', read: 'Read on' },
      shelf: (n, from) => `${n} ${n === 1 ? 'product' : 'products'}${from ? `, from ${from}` : ''}`,
    },
    packages: {
      title: 'Solar packages for homes and businesses',
      description: 'Six solar packages, from 3 kWp for a home to 20 kWp for a business, with equipment priced from today’s offers by sellers who deliver to your city.',
      eyebrow: 'Packages · Panels, inverter, battery',
      h1: 'Six solar packages',
      lede: 'Each package is worked out for your city with PVGIS yields and the cheapest in-stock offer for each part, from sellers who deliver there; with a battery, the inverter and the battery are the cheapest in-stock pair that at least one maker lists as compatible. The price covers the equipment; installation is by quote.',
      city: 'City',
      cityApply: 'Work it out',
      size: (kwp, panels, wp) => `${kwp} kWp · ${panels} panels × ${wp} Wp`,
      year: (kwh, city) => `≈ ${kwh} kWh a year in ${city}`,
      priceLabel: 'Equipment, incl. VAT',
      priceNote: 'The cheapest in-stock offers today, from sellers who deliver to your city.',
      incomplete: 'Today one of the parts has no in-stock offer for this city, so we show no full price.',
      suits: 'Who it suits',
      notIncluded: 'Not included in the price',
      roof: (m2) => `About ${m2} m² of roof`,
      includes: 'In the package',
      lines: { panel: 'Panels', inverter: 'Inverter', battery: 'Battery', extra: 'Heat pump' },
      overSize: 'At Instruction 3/2019’s 1,400 kWh/kWp this size exceeds the yearly use; the grid operator may ask for a smaller plant.',
      batteryCheck: 'At least one maker lists this inverter and battery pair as compatible and no maker excludes it; who lists it is under “Checked pair”. The installer still sets the firmware, the communication link and the settings, and confirms the equipment list.',
      assumptions: 'Assumptions: PVGIS yield for the city; each plant is sized for 90% of the package’s yearly use (80% for the business packages). The calculator works out the saving and the payback, with ERE’s 2026 tariffs and surplus fed to the grid at 0 lekë.',
      toCalculator: 'Change the consumption in the calculator',
      quote: 'Request an installation quote',
      toGuide: 'How to become a self-producer',
      tb: { yield: 'Yield', tariff: 'Tariff', prices: 'Prices', pricesValue: 'Today’s offers' },
      planTitle: 'Six plants at one scale',
      addAll: 'Add the package to the basket',
      caution: 'Caution',
      missing: 'Missing today',
      cityFallback: (asked, shown) => `We have no PVGIS yield for ${asked}, so the packages are worked out for ${shown}.`,
    },
    card: {
      panelYear: (kwh, city) => `≈ ${kwh} kWh/yr in ${city}`,
      panelYearTitle: 'Yearly output of one panel at the best tilt (PVGIS 5.3, 14% losses)',
      batteryUsable: (kwh) => `${kwh} kWh usable`,
      batteryUsableTitle: 'Usable capacity from the datasheet, not the nominal one',
      heatPumpCop: (cop) => `COP ${cop}`,
      heatPumpCopTitle: 'Outside air 7 °C, water 35 °C (A7/W35)',
    },
    categoryIntro: {
      'solar-panels':
        'Photovoltaic modules with public datasheets. Compare rated power (Wp), efficiency, the temperature coefficient and the price per Wp; the product warranty and the performance warranty are two different things. In Albania 1 kWp of panels makes from 1,358 kWh a year in Kukës to 1,521 kWh in Fier.',
      inverters:
        'The inverter turns the panels’ current into power for the house and the grid. Choose single or three phase to match your connection, check how many MPPTs it has and how many kWp of panels it accepts, and take a hybrid if you will add a battery.',
      batteries:
        'Lithium batteries to use the panels’ energy in the evening. Compare usable capacity, not nominal, and the price per kWh. High-voltage and 48 V batteries do not replace each other: check that your inverter supports the model.',
      'heat-pumps':
        'Air-to-water heat pumps for heating, hot water and, on some models, cooling. COP tells you how many kWh of heat the pump gives per 1 kWh of electricity, with outside air at 7 °C and water at 35 °C; SCOP is the season’s average. The installer works out the right capacity from the house’s heat loss.',
      'solar-water-heaters':
        'Thermosiphon solar water heaters: the collector on the roof warms the water, which rises into the tank by itself, with no pump. Compare the tank volume, the collector area and the electric element for sunless days.',
      'ev-chargers':
        'Wall chargers for electric cars. The 22 kW chargers in the catalogue are three-phase, so they need a three-phase connection. ERE has a separate tariff, 22 lekë/kWh (25.3 at peak hours), for charging points above 11 kW; a home charger up to 11 kW stays on your normal tariff.',
      'energy-monitoring':
        'Smart meters to see the panels’ production and your consumption in real time. Instruction 3/2019 requires self-producers to fit two meters at their own cost: a two-way meter at the grid connection and a production meter after the inverter. Before you buy, ask the grid operator whether the May 2026 rules changed this and which models it accepts.',
      'mounting-systems':
        'Frames for tiled, flat and metal roofs. Panels with no air behind them run up to 15 °C hotter: on a 30° roof in Tirana they make about 4% less. Makers work out wind and snow loads for each roof with their own planning tools.',
      'pv-accessories':
        'Solar cable, connectors and DC isolators for PV installations. Connectors must match the type on the panels: most panels in the catalogue ship with MC4-EVO2 connectors, while Amphenol H4 mates only with H4. The installer chooses the cable cross-section from the current and the length of the run.',
    },
    home: {
      packagesEyebrow: 'Solar packages',
      packagesTitle: 'From 3 kWp for a home to 20 kWp for a business.',
      packagesText: 'Six packages with panels and an inverter, two with a battery, worked out for your city with today’s offers.',
      packagesCta: 'See the packages',
      packagesFrom: (price) => `Equipment from ${price}`,
      packagesFor: (city) => `${city} · today’s in-stock offers`,
      guideEyebrow: 'Guide',
      guideIndex: 'In the guide',
      guideTitle: 'How to become a self-producer.',
      guideText: 'The steps with the grid operator, the 2026 tariffs, how much the sun makes in your city and how to choose the equipment, with a source for every figure.',
      guideCta: 'Read the guide',
    },
  },
};

export const tr = (lang: Lang): RenewablesCopy => renewables[lang];
