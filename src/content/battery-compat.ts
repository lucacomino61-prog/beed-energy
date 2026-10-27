// Which battery works with which inverter, for the six hybrid inverters and six batteries in the catalogue (6 × 6 = 36
// pairs). Data only: no db, no prices. sizeSystem() in src/lib/solar.ts pairs a battery with an inverter only when
// isCompatible() says so; the product, calculator and package views show the summary, the conditions and the sources.
//
// Where the facts come from: research/inverter-battery-compat.md (method, table, sources) and the raw matrix in
// research/inverter-battery-compat.json, checked on 2026-10-27 (COMPAT_CHECKED). Method: one researcher per maker read
// the makers' own compatibility lists and datasheets (Deye, Fronius, GoodWe, Growatt, Huawei, BYD, Dyness, Pylontech),
// a reconciler merged them into one verdict per pair, then two independent skeptics tried to refute every compatible
// pair (one checked the sources, one the exact model variants); none was refuted. Their more precise conditions and the
// newer maker documents they found are folded in below.
// Rules of the matrix:
//   compatible     — at least one maker lists this exact pair (listedBy says who), and no maker excludes it.
//   not_compatible — a maker excludes it, a maker's list is closed and leaves it out, or the voltages cannot meet.
//   unknown        — neither maker lists it and neither excludes it: never paired automatically.
// batteryPowerKw holds only figures a maker states for the pair (Fronius's tables, Huawei's 3.5 kW per module). GoodWe's
// figures (25 A × battery voltage) are our arithmetic, so they appear only as a condition worded as an estimate.
// Albanian follows the terms in src/i18n/renewables.ts and src/content/renewables.ts (inverter hibrid, tension i lartë,
// bateri 48 V, lidhur me rrjetin / on-grid, matës, fletë teknike, lista e përputhshmërisë). Decimal comma in Albanian.
import type { Lang } from '../lib/i18n';

type Bi = Record<Lang, string>;

/** The day the makers' lists and datasheets were read (kept in ./compat-checked so the browser can import it alone). */
export { COMPAT_CHECKED } from './compat-checked';

/** The six battery-capable inverters in the catalogue (products.slug). */
export const INVERTER_SLUGS = [
  'deye-sun-10k-sg04lp3-eu',
  'fronius-symo-gen24-10-plus',
  'fronius-primo-gen24-5-plus',
  'goodwe-gw10k-et-plus',
  'growatt-mod-10ktl3-xh',
  'huawei-sun2000-10ktl-m1',
] as const;
/** The six batteries in the catalogue (products.slug). */
export const BATTERY_SLUGS = [
  'byd-battery-box-premium-hvs-10-2',
  'byd-battery-box-premium-hvm-11-0',
  'dyness-powerbox-g3',
  'fronius-reserva-6-3',
  'huawei-luna2000-7-s1',
  'pylontech-us5000',
] as const;
/** Catalogue inverters with no battery input (their specs say hybrid = 0 and battery_ready = 0): no pair at all. */
export const NOT_BATTERY_CAPABLE = ['huawei-sun2000-30ktl-m3', 'sma-sunny-tripower-10'] as const;

export type InverterSlug = (typeof INVERTER_SLUGS)[number];
export type BatterySlug = (typeof BATTERY_SLUGS)[number];
export type CompatVerdict = 'compatible' | 'not_compatible' | 'unknown';
/** Who lists the pair: both makers, one of them, one maker that makes both, or nobody. */
export type ListedBy = 'both' | 'inverter-maker' | 'battery-maker' | 'same-maker' | 'none';
/** A maker document. `date` is the document's own date (YYYY, YYYY-MM or YYYY-MM-DD), null for an undated web page.
 *  `side`: whose document it is (the inverter maker's, the battery maker's, or both when one maker makes both). */
export type CompatSource = { url: string; title: string; date: string | null; side: 'inverter' | 'battery' | 'inverter+battery' };

export type CompatPair = {
  inverter: InverterSlug;
  battery: BatterySlug;
  verdict: CompatVerdict;
  listedBy: ListedBy;
  /** One or two plain sentences. */
  summary: Bi;
  /** What a buyer or an installer must know: firmware, link, meter, module counts, backup, battery power. */
  conditions: Bi[];
  /** The views' short list: indexes into `conditions`, in the order shown, at most three (firmware, on-grid only, meter,
   *  and FRONIUS_COUNTRY on every Fronius pair; the battery link where there is room, since the installer caveat covers it).
   *  The package card, the calculator, the product page and keyConditions() in src/lib/compat-view.ts show these, plus
   *  batteryPowerKw. */
  key?: number[];
  /** True when, in this pair as the catalogue sells it, the battery works on-grid only (no backup when the grid fails):
   *  the views then never let a package or a kit read as backup power. */
  onGridOnly?: boolean;
  /** Battery charge/discharge power for this pair in kW, only when a maker states it. */
  batteryPowerKw?: number;
  sources: CompatSource[];
};

/** One line on the method, for the views (the long version is research/inverter-battery-compat.md). */
export const COMPAT_METHOD: Bi = {
  sq: 'Lexuam listat e përputhshmërisë dhe fletët teknike të vetë prodhuesve më 27.10.2026. Një çift quhet i përputhshëm vetëm kur të paktën një prodhues e liston dhe asnjë nuk e përjashton. Çdo çift i përputhshëm u rishikua dy herë veçmas brenda kërkimit tonë (një herë burimet, një herë modelet e sakta) dhe asnjë nuk u rrëzua.',
  en: 'We read the makers’ own compatibility lists and datasheets on 27 Oct 2026. A pair counts as compatible only when at least one maker lists it and no maker excludes it. Every compatible pair was reviewed twice, separately, within our own research (once the sources, once the exact model variants), and none was refuted.',
};

// ---------------------------------------------------------------- maker documents (URLs exactly as fetched)
const BYD_LIST: CompatSource = {
  url: 'https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf',
  title: 'BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22',
  date: '2026-10-10',
  side: 'battery',
};
const DEYE_LIST: CompatSource = {
  url: 'https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf',
  title: 'Deye Approved Battery list DY-LV48-0128',
  date: '2026-09-04',
  side: 'inverter',
};
const DEYE_DS: CompatSource = {
  url: 'https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf',
  title: 'Deye SUN-5-12K-SG04LP3 datasheet',
  date: '2024-10-21',
  side: 'inverter',
};
// A skeptic's newer copy of the same datasheet (210 A battery current for the 10K).
const DEYE_DS_2025: CompatSource = {
  url: 'https://deyeinverter.com/deyeinverter/2025/05/16/datasheet_sun-5-12k-sg04lp3.pdf',
  title: 'Deye SUN-5-12K-SG04LP3 datasheet',
  date: '2025-05-16',
  side: 'inverter',
};
const DYNESS_LIST: CompatSource = {
  url: 'https://www.dyness.com/Public/Uploads/uploadfile/files/20260727/DynessLowvoltageBatteriesCampatibilityList20260715.pdf',
  title: 'List of the Inverter Brands Compatible with Dyness Low-voltage Batteries',
  date: '2026-07-15',
  side: 'battery',
};
const DYNESS_G3_MANUAL: CompatSource = {
  url: 'https://www.dyness.com/Public/Uploads/uploadfile/files/20260920/PowerboxG3UserManualEN20260918.pdf',
  title: 'Dyness Powerbox G3 User Manual V4.0',
  date: '2026-09-18',
  side: 'battery',
};
// Skeptics' betterSource: newer than the list, names Deye at brand level.
const DYNESS_G3_DS: CompatSource = {
  url: 'https://www.dyness.com/Public/Uploads/uploadfile/files/20261016/DynessPowerboxG3Datasheeten20261009.pdf',
  title: 'Dyness Powerbox G3 datasheet',
  date: '2026-10-09',
  side: 'battery',
};
const PYLON_LIST: CompatSource = {
  url: 'https://en.pylontech.com.cn/profile/upload/2026/07/17/Compatibility%20List%20of%20Pylontech%20Low%20Voltage%20ESS%20and%20Inverters%20Ver.2.46_1784254097873.pdf',
  title: 'Compatibility List of Pylontech Low Voltage ESS and Inverters Ver.2.46',
  date: '2026-07-07',
  side: 'battery',
};
const PYLON_MANUAL: CompatSource = {
  url: 'https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf',
  title: 'Pylontech US5000 Installation Manual V1.0',
  date: '2024-09-25',
  side: 'battery',
};
const FRONIUS_BYD_SHEET: CompatSource = {
  url: 'https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf',
  title: 'Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)',
  date: '2026-05',
  side: 'inverter',
};
// Skeptics' betterSource: Fronius's live compatibility grid for BYD (ticks HVS 10.2 and HVM 11.0 for the Symo GEN24 Plus).
const FRONIUS_BYD_HELP: CompatSource = {
  url: 'https://www.fronius.com/en/help-center/solar-energy/products/solar-energy-storage/solutions/byd/byd-battery-box-premium-hvshvm',
  title: 'Fronius help center: BYD Battery-Box Premium HVS/HVM',
  date: null,
  side: 'inverter',
};
const FRONIUS_RESERVA_SHEET: CompatSource = {
  url: 'https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_Fronius_Reserva_EN.pdf',
  title: 'Fronius Battery Storage Solution: Fronius Reserva (EN V10)',
  date: '2025-12',
  side: 'inverter+battery',
};
// Skeptic's betterSource: the Reserva datasheet, newer than the solution sheet ("Compatible inverters ... Primo GEN24 Plus (SC) Symo GEN24 Plus (SC) Verto Plus").
const FRONIUS_RESERVA_DS: CompatSource = {
  url: 'https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Reserva_EN.pdf',
  title: 'Fronius Reserva datasheet (EN V09)',
  date: '2026-09',
  side: 'inverter+battery',
};
const FRONIUS_COMPAT_PAGE: CompatSource = {
  url: 'https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/compatible-batteries',
  title: 'Fronius compatible batteries',
  date: null,
  side: 'inverter',
};
const RESERVA_PAGE: CompatSource = {
  url: 'https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/reserva',
  title: 'Fronius Reserva product page',
  date: null,
  side: 'battery',
};
const SYMO_PAGE: CompatSource = {
  url: 'https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus',
  title: 'Fronius Symo GEN24 10.0 Plus: technical data',
  date: null,
  side: 'inverter',
};
const PRIMO_PAGE: CompatSource = {
  url: 'https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus',
  title: 'Fronius Primo GEN24 5.0 Plus: technical data',
  date: null,
  side: 'inverter',
};
const GOODWE_LIST: CompatSource = {
  url: 'https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf',
  title: 'GoodWe Battery Compatibility Overview V029.1',
  date: '2026-10-22',
  side: 'inverter',
};
const GOODWE_DS: CompatSource = {
  url: 'https://emea.goodwe.com/Ftp/Downloads/Datasheet/EMEA/GW_ET%20PLUS+_Datasheet_EMEA-EN.pdf',
  title: 'GoodWe ET PLUS+ datasheet (EMEA, V1.1)',
  date: '2024-03-12',
  side: 'inverter',
};
const GROWATT_MANUAL: CompatSource = {
  url: 'https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf',
  title: 'Growatt MOD 3-10KTL3-XH User Manual',
  date: '2024-05',
  side: 'inverter',
};
const HUAWEI_M1_SPECS: CompatSource = {
  url: 'https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/',
  title: 'Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs',
  date: null,
  side: 'inverter',
};
const LUNA_DS: CompatSource = {
  url: 'https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf',
  title: 'Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)',
  date: '2025-09',
  side: 'battery',
};
const LUNA_MANUAL: CompatSource = {
  url: 'https://solar.huawei.com/dam/asset/view/7fa828aede004fb1b1658929a49d6242.pdf',
  title: 'Huawei LUNA2000-S1 User Manual, Issue 06',
  date: '2025-09-30',
  side: 'battery',
};
// Skeptic's betterSource, newer than the manual: "Die LUNA2000-S1 ist mit allen Hybridwechselrichtern von Huawei kompatibel".
const HUAWEI_CH_GUIDE: CompatSource = {
  url: 'https://solar.huawei.com/admin/asset/v1/pro/view/2e90d4e7704a401c8098ac6915beddfd.pdf',
  title: 'Huawei Digital Power Switzerland, LUNA2000-S1 guide (German)',
  date: '2025-11-10',
  side: 'inverter+battery',
};

// ---------------------------------------------------------------- shared wording
const FW_LATEST_BYD: Bi = {
  sq: 'Të dy prodhuesit kërkojnë firmware-in më të fundit në inverter dhe në bateri.',
  en: 'Both makers ask for the latest firmware on the inverter and the battery.',
};
const FRONIUS_LINK: Bi = {
  sq: 'Lidhja me baterinë: Modbus RTU (RS485) me kabllo të mbrojtur me 4 tela, CAT5 ose më mirë; fundi i linjës mbyllet me çelësin DIP te bateria.',
  en: 'Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better; the end of the line is terminated with the DIP switch on the battery.',
};
const FRONIUS_RESERVA_LINK: Bi = {
  sq: 'Lidhja me baterinë: Modbus RTU (RS485) me kabllo të mbrojtur me 4 tela, CAT5 ose më mirë.',
  en: 'Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better.',
};
const METER_SYMO: Bi = {
  sq: 'Kërkohet një matës Fronius Smart Meter në pikën e lidhjes me rrjetin; për Symo-n trefazor përshtatet një model trefazor.',
  en: 'A Fronius Smart Meter is required at the grid connection; a three-phase model suits the three-phase Symo.',
};
const METER_PRIMO: Bi = {
  sq: 'Kërkohet një matës Fronius Smart Meter në pikën e lidhjes me rrjetin; për Primo-n njëfazor përshtatet një model njëfazor.',
  en: 'A Fronius Smart Meter is required at the grid connection; a single-phase model suits the single-phase Primo.',
};
const FRONIUS_COUNTRY: Bi = {
  sq: 'Fronius e lidh disponueshmërinë me certifikimin në secilin vend; dokumentet nuk e përmendin Shqipërinë, ndaj konfirmojeni me distributorin.',
  en: 'Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.',
};
const BYD_PARALLEL: Bi = {
  sq: 'Më shumë bateri: deri në 3 kulla paralel, secila me të njëjtin numër modulesh, kurrë HVS bashkë me HVM.',
  en: 'More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM.',
};
const RESERVA_SOFTWARE: Bi = {
  sq: 'Fronius nuk jep një version minimal firmware-i: inverteri dhe bateria duhet të kenë të dy softuerin më të fundit (inverteri përditësohet përmes Solar.web).',
  en: 'Fronius gives no minimum firmware version: the inverter and the battery must both run the latest software (the inverter updates through Solar.web).',
};
const RESERVA_PARALLEL: Bi = {
  sq: 'Më shumë bateri: deri në 4 kulla Reserva paralel, secila me të njëjtin numër modulesh, me rrymë dalëse gjithsej deri në 32 A.',
  en: 'More storage: up to 4 Reserva towers in parallel, each with the same number of modules, with total output capped at 32 A.',
};
const GOODWE_FW: Bi = {
  sq: 'Firmware ARM 11 ose më i ri në inverter (e kërkojnë të dy prodhuesit); në bateri të paktën BMU 3.13 dhe BMS 3.19.',
  en: 'Inverter ARM firmware 11 or later (both makers require it); battery at least BMU 3.13 and BMS 3.19.',
};
const GOODWE_CAN: Bi = {
  sq: 'Lidhja me baterinë: CAN, cilësimi i fabrikës te inverteri; RS485 kërkon një kabllo tjetër.',
  en: 'Battery link: CAN, the inverter’s factory setting; RS485 needs a different cable.',
};

const LV_ON_HV: Bi = {
  sq: 'Bateri 48 V në një inverter për tension të lartë: tensionet nuk përputhen. Asnjë prodhues nuk e liston këtë çift.',
  en: '48 V battery on a high-voltage inverter: the voltages cannot meet. Neither maker lists the pair.',
};
const HV_ON_LV: Bi = {
  sq: 'Bateri me tension të lartë në një inverter 48 V: tensionet nuk përputhen. Asnjë prodhues nuk e liston këtë çift.',
  en: 'High-voltage battery on a 48 V inverter: the voltages cannot meet. Neither maker lists the pair.',
};
const LUNA_UNKNOWN: Bi = {
  sq: 'Asnjë prodhues nuk e liston këtë çift dhe asnjë nuk e përjashton: nuk është i verifikuar, ndaj nuk e bashkojmë kurrë vetë. Huawei e liston LUNA2000-S1 vetëm me inverterë Huawei.',
  en: 'Neither maker lists this pair and neither excludes it: it is not verified, so we never pair them ourselves. Huawei names only Huawei inverters for the LUNA2000-S1.',
};
const growatt = (sq: string, en: string): Bi => ({
  sq: `Growatt lejon te ky inverter vetëm baterinë e vet ARK-XH HV (“only” në manual). ${sq}`,
  en: `Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). ${en}`,
});
const huaweiM1 = (sq: string, en: string): Bi => ({
  sq: `Huawei lejon te M1 vetëm bateritë e veta LUNA2000-S0 dhe S1. ${sq}`,
  en: `Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. ${en}`,
});

const no = (inverter: InverterSlug, battery: BatterySlug, summary: Bi, sources: CompatSource[]): CompatPair => ({
  inverter,
  battery,
  verdict: 'not_compatible',
  listedBy: 'none',
  summary,
  conditions: [],
  sources,
});

// ---------------------------------------------------------------- the 36 pairs, inverter by inverter
export const COMPAT_PAIRS: CompatPair[] = [
  // ── Deye SUN-10K-SG04LP3-EU: a 48 V (low-voltage) hybrid, battery input 40–60 V, up to 210 A (Deye datasheet).
  no('deye-sun-10k-sg04lp3-eu', 'byd-battery-box-premium-hvs-10-2', HV_ON_LV, [BYD_LIST, DEYE_LIST, DEYE_DS]),
  no('deye-sun-10k-sg04lp3-eu', 'byd-battery-box-premium-hvm-11-0', HV_ON_LV, [BYD_LIST, DEYE_LIST]),
  {
    inverter: 'deye-sun-10k-sg04lp3-eu',
    battery: 'dyness-powerbox-g3',
    verdict: 'compatible',
    listedBy: 'battery-maker',
    key: [0, 2, 3],
    summary: {
      sq: 'Dyness e liston këtë inverter për PowerBox G3. Lista e baterive të Deye nuk e përmend G3 (përmend vetëm modele më të vjetra Dyness) dhe i kërkon blerësit ta konfirmojë me prodhuesin e baterisë.',
      en: 'Dyness lists this inverter for the PowerBox G3. Deye’s own battery list does not name the G3 (only older Dyness models) and asks buyers to confirm with the battery maker.',
    },
    conditions: [
      {
        sq: 'Lidhja me baterinë: CAN, nga porta CAN IN e baterisë te porta BMS e inverterit, me kabllon Dyness që ka etiketën e inverterit.',
        en: 'Battery link: CAN, from the battery’s CAN IN port to the inverter’s BMS port, with the Dyness cable labelled for the inverter.',
      },
      {
        sq: 'Te bateria kryesore (master) çelësi DIP #3 vendoset në ON, cilësimi i Dyness për Deye; bateritë e tjera mbeten 0000.',
        en: 'On the master battery, DIP switch #3 goes ON (Dyness’s setting for Deye); any other batteries stay at 0000.',
      },
      {
        sq: 'Asnjë prodhues nuk e publikon numrin e modalitetit Lithium të Deye për G3: konfirmojeni me Dyness para vënies në punë.',
        en: 'Neither maker publishes Deye’s Lithium-mode number for the G3: confirm it with Dyness before commissioning.',
      },
      {
        sq: 'Inverteri pranon deri në 210 A rrymë baterie; një modul G3 jep 200 A të vazhdueshme (100 A e rekomanduar), ndaj për fuqi të plotë duhen të paktën 2 module, dhe 3 për të qëndruar te rryma e rekomanduar.',
        en: 'The inverter takes up to 210 A of battery current; one G3 module gives 200 A continuous (100 A recommended), so full power needs at least 2 modules, and 3 to stay at the recommended current.',
      },
    ],
    sources: [DYNESS_LIST, DYNESS_G3_MANUAL, DYNESS_G3_DS, DEYE_LIST, DEYE_DS],
  },
  no('deye-sun-10k-sg04lp3-eu', 'fronius-reserva-6-3', {
    sq: 'Bateri me tension të lartë në një inverter 48 V, dhe Fronius e liston Reserva-n vetëm me inverterët Fronius.',
    en: 'High-voltage battery on a 48 V inverter, and Fronius lists the Reserva only with Fronius inverters.',
  }, [RESERVA_PAGE, DEYE_DS]),
  no('deye-sun-10k-sg04lp3-eu', 'huawei-luna2000-7-s1', {
    sq: 'Huawei e liston LUNA2000-S1 vetëm me inverterë Huawei, dhe tensioni i lartë i saj nuk përputhet me një inverter 48 V.',
    en: 'Huawei names only Huawei inverters for the LUNA2000-S1, and its high voltage cannot meet a 48 V inverter.',
  }, [LUNA_DS, DEYE_DS]),
  {
    inverter: 'deye-sun-10k-sg04lp3-eu',
    battery: 'pylontech-us5000',
    verdict: 'compatible',
    listedBy: 'both',
    key: [2, 0, 1],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift: Deye për SUN-10K-SG04LP3-EU, Pylontech për serinë SG04LP3, me lidhje CAN.',
      en: 'Both makers list this pair: Deye for the SUN-10K-SG04LP3-EU, Pylontech for the SG04LP3 series, over CAN.',
    },
    conditions: [
      {
        sq: 'Lidhja me baterinë: CAN, me modalitetin e baterisë në inverter Lithium, kodi 00 (lista e Deye). Deye liston edhe RS485 me kod tjetër; përdorni CAN, që e listojnë të dy prodhuesit.',
        en: 'Battery link: CAN, with the inverter’s battery mode set to Lithium, code 00 (Deye’s list). Deye also lists RS485 with another code; use CAN, which both makers list.',
      },
      {
        sq: 'Inverteri pranon deri në 210 A rrymë baterie; një US5000 jep deri në 100 A të vazhdueshme (80 A e rekomanduar). Një modul i vetëm e kufizon fuqinë e baterisë; për 210 A duhen të paktën 3 module.',
        en: 'The inverter takes up to 210 A of battery current; one US5000 gives up to 100 A continuous (80 A recommended). A single module limits the battery power; 210 A needs at least 3 modules.',
      },
      {
        sq: 'Asnjë prodhues nuk jep një version minimal firmware-i për këtë çift.',
        en: 'Neither maker gives a minimum firmware version for this pair.',
      },
    ],
    sources: [DEYE_LIST, PYLON_LIST, DEYE_DS_2025, PYLON_MANUAL],
  },

  // ── Fronius Symo GEN24 10.0 Plus: three-phase high-voltage hybrid, battery input 160–700 V.
  {
    inverter: 'fronius-symo-gen24-10-plus',
    battery: 'byd-battery-box-premium-hvs-10-2',
    verdict: 'compatible',
    listedBy: 'both',
    key: [0, 3, 5],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift. Fronius jep 9,01 kW fuqi karikimi dhe shkarkimi të baterisë me HVS 10.2.',
      en: 'Both makers list this pair. Fronius gives 9.01 kW of battery charge and discharge power with the HVS 10.2.',
    },
    conditions: [
      {
        sq: 'Firmware minimal për një kullë baterie: inverteri 1.9.7-0, BYD BMU 3.13 dhe BMS 3.19.',
        en: 'Minimum firmware for one battery tower: inverter 1.9.7-0, BYD BMU 3.13 and BMS 3.19.',
      },
      FW_LATEST_BYD,
      FRONIUS_LINK,
      METER_SYMO,
      {
        sq: 'Më shumë bateri: deri në 3 kulla paralel, secila me të njëjtin numër modulesh, kurrë HVS bashkë me HVM; paralelja kërkon inverterin 1.10.5-0, BMU 3.14 dhe BMS 3.20.',
        en: 'More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; parallel needs inverter 1.10.5-0, BMU 3.14 and BMS 3.20.',
      },
      FRONIUS_COUNTRY,
    ],
    batteryPowerKw: 9.01,
    sources: [FRONIUS_BYD_SHEET, BYD_LIST, FRONIUS_BYD_HELP],
  },
  {
    inverter: 'fronius-symo-gen24-10-plus',
    battery: 'byd-battery-box-premium-hvm-11-0',
    verdict: 'compatible',
    listedBy: 'both',
    key: [0, 4, 6],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift, por me HVM 11.0 Fronius jep vetëm 4,51 kW fuqi baterie në këtë inverter 10 kW.',
      en: 'Both makers list this pair, but with the HVM 11.0 Fronius gives only 4.51 kW of battery power on this 10 kW inverter.',
    },
    conditions: [
      {
        sq: 'Firmware minimal për një kullë baterie: inverteri 1.9.7-0, BYD BMU 3.13 dhe BMS 3.19.',
        en: 'Minimum firmware for one battery tower: inverter 1.9.7-0, BYD BMU 3.13 and BMS 3.19.',
      },
      FW_LATEST_BYD,
      {
        sq: 'Më shumë fuqi baterie kërkon një HVM më të madhe (13.8: 5,63 kW; 16.6: 6,76 kW; 19.3: 7,88 kW; 22.1: 9,01 kW) ose HVS 10.2 (9,01 kW).',
        en: 'More battery power needs a larger HVM (13.8: 5.63 kW; 16.6: 6.76 kW; 19.3: 7.88 kW; 22.1: 9.01 kW) or the HVS 10.2 (9.01 kW).',
      },
      FRONIUS_LINK,
      METER_SYMO,
      {
        sq: 'Më shumë bateri: deri në 3 kulla paralel, secila me të njëjtin numër modulesh, kurrë HVS bashkë me HVM; paralelja kërkon inverterin 1.10.5-0, BMU 3.14 dhe BMS 3.20. Fuqia e baterisë nuk rritet me kullat paralele.',
        en: 'More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; parallel needs inverter 1.10.5-0, BMU 3.14 and BMS 3.20. Battery power does not grow with parallel towers.',
      },
      FRONIUS_COUNTRY,
    ],
    batteryPowerKw: 4.51,
    sources: [BYD_LIST, FRONIUS_BYD_SHEET, FRONIUS_BYD_HELP],
  },
  no('fronius-symo-gen24-10-plus', 'dyness-powerbox-g3', LV_ON_HV, [SYMO_PAGE, DYNESS_G3_MANUAL]),
  {
    inverter: 'fronius-symo-gen24-10-plus',
    battery: 'fronius-reserva-6-3',
    verdict: 'compatible',
    listedBy: 'same-maker',
    key: [0, 2, 6],
    summary: {
      sq: 'Fronius e liston Reserva 6.3 të vetën me këtë inverter, me 4,51 kW fuqi karikimi dhe shkarkimi të baterisë.',
      en: 'Fronius lists its own Reserva 6.3 with this inverter, at 4.51 kW of battery charge and discharge power.',
    },
    conditions: [
      RESERVA_SOFTWARE,
      FRONIUS_RESERVA_LINK,
      METER_SYMO,
      {
        sq: 'Më shumë fuqi baterie kërkon një Reserva më të madhe: 9.5 jep 6,76 kW, 12.6 jep 9,01 kW, 15.8 jep 10,30 kW.',
        en: 'More battery power needs a larger Reserva: the 9.5 gives 6.76 kW, the 12.6 gives 9.01 kW, the 15.8 gives 10.30 kW.',
      },
      RESERVA_PARALLEL,
      {
        sq: 'Rezerva e plotë kur bie rrjeti (Full Backup) është e mundur me këtë inverter, me pajisje shtesë ndërrimi; rregullat e ndërrimit ndryshojnë sipas vendit.',
        en: 'Full backup when the grid fails is possible with this inverter, with extra switchover hardware; the switchover rules vary by country.',
      },
      FRONIUS_COUNTRY,
    ],
    batteryPowerKw: 4.51,
    sources: [FRONIUS_RESERVA_SHEET, FRONIUS_RESERVA_DS, FRONIUS_COMPAT_PAGE],
  },
  {
    inverter: 'fronius-symo-gen24-10-plus',
    battery: 'huawei-luna2000-7-s1',
    verdict: 'unknown',
    listedBy: 'none',
    summary: LUNA_UNKNOWN,
    conditions: [],
    sources: [LUNA_DS, SYMO_PAGE, FRONIUS_COMPAT_PAGE],
  },
  no('fronius-symo-gen24-10-plus', 'pylontech-us5000', LV_ON_HV, [SYMO_PAGE, PYLON_MANUAL]),

  // ── Fronius Primo GEN24 5.0 Plus: single-phase high-voltage hybrid, battery input 150–455 V.
  no('fronius-primo-gen24-5-plus', 'byd-battery-box-premium-hvs-10-2', {
    sq: 'Fronius e përjashton HVS 10.2 te Primo GEN24 5.0 Plus: tensioni i saj shkon deri në 480 V, mbi kufirin 455 V të baterisë te Primo. Te Primo përdorni HVM 11.0 ose Reserva 6.3.',
    en: 'Fronius excludes the HVS 10.2 on the Primo GEN24 5.0 Plus: its voltage goes up to 480 V, above the Primo’s 455 V battery limit. On the Primo use the HVM 11.0 or the Reserva 6.3.',
  }, [FRONIUS_BYD_SHEET, BYD_LIST]),
  {
    inverter: 'fronius-primo-gen24-5-plus',
    battery: 'byd-battery-box-premium-hvm-11-0',
    verdict: 'compatible',
    listedBy: 'both',
    key: [0, 5, 7],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift. Fronius jep 4,51 kW fuqi karikimi dhe shkarkimi të baterisë me HVM 11.0.',
      en: 'Both makers list this pair. Fronius gives 4.51 kW of battery charge and discharge power with the HVM 11.0.',
    },
    conditions: [
      {
        sq: 'Firmware minimal: inverteri 1.11.6-0, BYD BMU 3.15 dhe BMS 3.21 (njësoj edhe për kullat paralele).',
        en: 'Minimum firmware: inverter 1.11.6-0, BYD BMU 3.15 and BMS 3.21 (the same for parallel towers).',
      },
      FW_LATEST_BYD,
      {
        sq: 'BYD lejon te Primo 4 deri në 7 module HVM: HVM 11.0 ka 4; HVM 8.3 dhe 22.1 nuk lejohen.',
        en: 'BYD allows 4 to 7 HVM modules on the Primo: the HVM 11.0 has 4; the HVM 8.3 and 22.1 are not allowed.',
      },
      {
        sq: '5,17 kW, fuqia më e madhe e baterisë te Primo, kërkon HVM 13.8 ose më të madhe.',
        en: '5.17 kW, the Primo’s highest battery power, needs the HVM 13.8 or larger.',
      },
      FRONIUS_LINK,
      METER_PRIMO,
      {
        sq: 'Më shumë bateri: deri në 3 kulla paralel, secila me të njëjtin numër modulesh, kurrë HVS bashkë me HVM; fuqia e baterisë mbetet ajo e një kulle.',
        en: 'More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; battery power stays at the one-tower figure.',
      },
      FRONIUS_COUNTRY,
    ],
    batteryPowerKw: 4.51,
    sources: [BYD_LIST, FRONIUS_BYD_SHEET],
  },
  no('fronius-primo-gen24-5-plus', 'dyness-powerbox-g3', LV_ON_HV, [PRIMO_PAGE, DYNESS_G3_MANUAL]),
  {
    inverter: 'fronius-primo-gen24-5-plus',
    battery: 'fronius-reserva-6-3',
    verdict: 'compatible',
    listedBy: 'same-maker',
    key: [0, 3, 6],
    summary: {
      sq: 'Fronius e liston Reserva 6.3 të vetën me këtë inverter, me 4,51 kW fuqi karikimi dhe shkarkimi të baterisë.',
      en: 'Fronius lists its own Reserva 6.3 with this inverter, at 4.51 kW of battery charge and discharge power.',
    },
    conditions: [
      RESERVA_SOFTWARE,
      {
        sq: 'Te Primo GEN24 5.0 Plus lejohen vetëm Reserva 6.3 dhe 9.5 (9.5 jep 5,17 kW); 12.6 kërkon versionin Plus SC.',
        en: 'On the Primo GEN24 5.0 Plus only the Reserva 6.3 and 9.5 are allowed (the 9.5 gives 5.17 kW); the 12.6 needs the Plus SC version.',
      },
      FRONIUS_RESERVA_LINK,
      METER_PRIMO,
      RESERVA_PARALLEL,
      {
        sq: 'Rezerva kur bie rrjeti: PV Point jep deri në 3 kW njëfazor; rezerva e plotë (Full Backup) kërkon pajisje shtesë ndërrimi, me rregulla që ndryshojnë sipas vendit.',
        en: 'Backup when the grid fails: PV Point gives up to 3 kW single-phase; full backup needs extra switchover hardware, with rules that vary by country.',
      },
      FRONIUS_COUNTRY,
    ],
    batteryPowerKw: 4.51,
    sources: [FRONIUS_RESERVA_SHEET, FRONIUS_COMPAT_PAGE, FRONIUS_RESERVA_DS],
  },
  {
    inverter: 'fronius-primo-gen24-5-plus',
    battery: 'huawei-luna2000-7-s1',
    verdict: 'unknown',
    listedBy: 'none',
    summary: LUNA_UNKNOWN,
    conditions: [],
    sources: [LUNA_DS, PRIMO_PAGE],
  },
  no('fronius-primo-gen24-5-plus', 'pylontech-us5000', LV_ON_HV, [PRIMO_PAGE, PYLON_MANUAL]),

  // ── GoodWe GW10K-ET (ET PLUS+): three-phase high-voltage hybrid, battery input 180–600 V, 25 A; GoodWe's list is closed.
  {
    inverter: 'goodwe-gw10k-et-plus',
    battery: 'byd-battery-box-premium-hvs-10-2',
    verdict: 'compatible',
    listedBy: 'both',
    key: [0, 1, 2],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift, me firmware ARM 11 ose më të ri në inverter.',
      en: 'Both makers list this pair, with inverter ARM firmware 11 or later.',
    },
    conditions: [
      GOODWE_FW,
      GOODWE_CAN,
      {
        sq: 'Vetëm Battery-Box Premium HVS: modeli më i ri HVS+ nuk është në listë për këtë inverter.',
        en: 'Only the Battery-Box Premium HVS: the newer HVS+ is not listed for this inverter.',
      },
      BYD_PARALLEL,
      {
        sq: 'GoodWe e kufizon rrymën e baterisë në 25 A; me 409,6 V nominalë të HVS 10.2 kjo jep rreth 10 kW, më pak kur bateria është e shkarkuar. Është vlerësimi ynë, jo shifër e prodhuesit.',
        en: 'GoodWe caps battery current at 25 A; at the HVS 10.2’s 409.6 V nominal that is about 10 kW, less when the battery is low. This is our estimate, not a maker figure.',
      },
    ],
    sources: [GOODWE_LIST, BYD_LIST, GOODWE_DS],
  },
  {
    inverter: 'goodwe-gw10k-et-plus',
    battery: 'byd-battery-box-premium-hvm-11-0',
    verdict: 'compatible',
    listedBy: 'both',
    key: [0, 1, 5],
    summary: {
      sq: 'Të dy prodhuesit e listojnë këtë çift, me firmware ARM 11 ose më të ri në inverter. HVM 11.0 është HVM-ja më e vogël e lejuar.',
      en: 'Both makers list this pair, with inverter ARM firmware 11 or later. The HVM 11.0 is the smallest HVM allowed.',
    },
    conditions: [
      GOODWE_FW,
      GOODWE_CAN,
      {
        sq: 'HVM 8.3 nuk lejohet, dhe HVM+ nuk është në listë për këtë inverter.',
        en: 'The HVM 8.3 is not allowed, and the HVM+ is not listed for this inverter.',
      },
      BYD_PARALLEL,
      {
        sq: 'GoodWe e kufizon rrymën e baterisë në 25 A; me 204,8 V nominalë të HVM 11.0 kjo jep rreth 5,1 kW fuqi baterie në një inverter 10 kW. Është vlerësimi ynë, jo shifër e prodhuesit.',
        en: 'GoodWe caps battery current at 25 A; at the HVM 11.0’s 204.8 V nominal that is about 5.1 kW of battery power on a 10 kW inverter. This is our estimate, not a maker figure.',
      },
      {
        sq: 'HVM 11.0 punon nga 160 V, nën minimumin 180 V të inverterit për baterinë; të dy prodhuesit e listojnë sërish çiftin. Pyesni instaluesin nëse kjo e ul kapacitetin e përdorshëm.',
        en: 'The HVM 11.0 works from 160 V, below the inverter’s 180 V battery minimum; both makers still list the pair. Ask the installer whether this lowers the usable capacity.',
      },
    ],
    sources: [GOODWE_LIST, BYD_LIST, GOODWE_DS],
  },
  no('goodwe-gw10k-et-plus', 'dyness-powerbox-g3', {
    sq: 'GoodWe miraton vetëm bateritë në listën e vet dhe PowerBox G3 nuk është aty; për më tepër është bateri 48 V në një inverter për tension të lartë.',
    en: 'GoodWe approves only the batteries on its own list, and the PowerBox G3 is not on it; it is also a 48 V battery on a high-voltage inverter.',
  }, [GOODWE_LIST, DYNESS_LIST]),
  no('goodwe-gw10k-et-plus', 'fronius-reserva-6-3', {
    sq: 'GoodWe miraton vetëm bateritë në listën e vet, ku nuk ka asnjë bateri Fronius; Fronius e liston Reserva-n vetëm me inverterët Fronius.',
    en: 'GoodWe approves only the batteries on its own list, which has no Fronius battery; Fronius lists the Reserva only with Fronius inverters.',
  }, [GOODWE_LIST, RESERVA_PAGE]),
  no('goodwe-gw10k-et-plus', 'huawei-luna2000-7-s1', {
    sq: 'Lista e GoodWe nuk ka asnjë bateri Huawei, dhe Huawei e liston LUNA2000-S1 vetëm me inverterë Huawei.',
    en: 'GoodWe’s list has no Huawei battery, and Huawei names only Huawei inverters for the LUNA2000-S1.',
  }, [GOODWE_LIST, LUNA_DS]),
  no('goodwe-gw10k-et-plus', 'pylontech-us5000', {
    sq: 'GoodWe e liston US5000 vetëm për inverterët e vet 48 V (ES G2, SBP G2), jo për ET; është bateri 48 V në një inverter për tension të lartë.',
    en: 'GoodWe lists the US5000 only for its 48 V inverters (ES G2, SBP G2), not for the ET; it is a 48 V battery on a high-voltage inverter.',
  }, [GOODWE_LIST, GOODWE_DS]),

  // ── Growatt MOD 10KTL3-XH: battery port 600–950 V, "Compatible battery (only) ARK-XH HV Battery" (Growatt manual 2024-05).
  no('growatt-mod-10ktl3-xh', 'byd-battery-box-premium-hvs-10-2', growatt(
    'HVS 10.2 (deri në 480 V) është edhe nën hyrjen e tij 600–950 V për baterinë.',
    'The HVS 10.2 (up to 480 V) is also below its 600–950 V battery input.',
  ), [GROWATT_MANUAL, BYD_LIST]),
  no('growatt-mod-10ktl3-xh', 'byd-battery-box-premium-hvm-11-0', growatt(
    'HVM 11.0 është edhe shumë nën hyrjen e tij 600–950 V për baterinë.',
    'The HVM 11.0 is also far below its 600–950 V battery input.',
  ), [GROWATT_MANUAL]),
  no('growatt-mod-10ktl3-xh', 'dyness-powerbox-g3', growatt(
    'Një bateri 48 V nuk përputhet as me hyrjen e tij 600–950 V.',
    'A 48 V battery cannot meet its 600–950 V battery input either.',
  ), [GROWATT_MANUAL, DYNESS_LIST]),
  no('growatt-mod-10ktl3-xh', 'fronius-reserva-6-3', growatt(
    'Edhe Fronius e liston Reserva-n vetëm me inverterët Fronius.',
    'Fronius also lists the Reserva only with Fronius inverters.',
  ), [GROWATT_MANUAL, FRONIUS_RESERVA_SHEET]),
  no('growatt-mod-10ktl3-xh', 'huawei-luna2000-7-s1', growatt(
    'Tensionet mbivendosen, por “only” i Growatt e përjashton, dhe Huawei e liston LUNA2000-S1 vetëm me inverterë Huawei.',
    'The voltages overlap, but Growatt’s “only” rules it out, and Huawei names only Huawei inverters for the LUNA2000-S1.',
  ), [GROWATT_MANUAL, LUNA_DS]),
  no('growatt-mod-10ktl3-xh', 'pylontech-us5000', growatt(
    'Një bateri 48 V nuk përputhet as me hyrjen e tij 600–950 V.',
    'A 48 V battery cannot meet its 600–950 V battery input either.',
  ), [GROWATT_MANUAL, PYLON_LIST]),

  // ── Huawei SUN2000-10KTL-M1: three-phase, battery input 600–980 V, only LUNA2000-S0/S1 (Huawei specs page).
  no('huawei-sun2000-10ktl-m1', 'byd-battery-box-premium-hvs-10-2', huaweiM1(
    'HVS 10.2 (deri në 480 V) është edhe nën hyrjen e tij 600–980 V për baterinë.',
    'The HVS 10.2 (up to 480 V) is also below its 600–980 V battery input.',
  ), [HUAWEI_M1_SPECS]),
  no('huawei-sun2000-10ktl-m1', 'byd-battery-box-premium-hvm-11-0', huaweiM1(
    'HVM 11.0 është edhe shumë nën hyrjen e tij 600–980 V për baterinë.',
    'The HVM 11.0 is also far below its 600–980 V battery input.',
  ), [HUAWEI_M1_SPECS]),
  no('huawei-sun2000-10ktl-m1', 'dyness-powerbox-g3', huaweiM1(
    'Një bateri 48 V nuk përputhet as me hyrjen e tij 600–980 V.',
    'A 48 V battery cannot meet its 600–980 V battery input either.',
  ), [HUAWEI_M1_SPECS]),
  no('huawei-sun2000-10ktl-m1', 'fronius-reserva-6-3', huaweiM1(
    'Edhe Fronius e liston Reserva-n vetëm me inverterët Fronius.',
    'Fronius also lists the Reserva only with Fronius inverters.',
  ), [HUAWEI_M1_SPECS, RESERVA_PAGE]),
  {
    inverter: 'huawei-sun2000-10ktl-m1',
    battery: 'huawei-luna2000-7-s1',
    verdict: 'compatible',
    listedBy: 'same-maker',
    key: [1, 0, 3],
    onGridOnly: true,
    summary: {
      sq: 'Huawei e liston LUNA2000-7-S1 të vetën me këtë inverter. Me një modul baterie punon vetëm i lidhur me rrjetin (pa rezervë kur bie rrjeti) dhe jep deri në 3,5 kW fuqi baterie.',
      en: 'Huawei lists its own LUNA2000-7-S1 with this inverter. With one battery module it works on-grid only (no backup when the grid fails) and gives at most 3.5 kW of battery power.',
    },
    conditions: [
      {
        sq: 'Firmware i inverterit SUN2000MA V100R001C00SPC161 ose më i ri.',
        en: 'Inverter firmware SUN2000MA V100R001C00SPC161 or later.',
      },
      {
        sq: 'Vetëm i lidhur me rrjetin (on-grid): rezerva kur bie rrjeti kërkon të paktën dy module baterie (me modulet 7 kWh, LUNA2000-14-S1 ose më e madhe) dhe kutinë Huawei BackupBox-B1.',
        en: 'On-grid only: backup when the grid fails needs at least two battery modules (with the 7 kWh modules, the LUNA2000-14-S1 or larger) and Huawei’s BackupBox-B1.',
      },
      {
        sq: 'Një modul e kufizon karikimin dhe shkarkimin e baterisë në 3,5 kW në këtë inverter 10 kW.',
        en: 'One module caps battery charge and discharge at 3.5 kW on this 10 kW inverter.',
      },
      {
        sq: 'Modalitetet sipas orarit (TOU) dhe vetëkonsumi maksimal kërkojnë një matës fuqie në pikën e lidhjes me rrjetin (ose Huawei SmartAssistant/SmartGuard): shtojeni në kit.',
        en: 'The time-of-use and maximum self-consumption modes need a power meter at the grid connection (or a Huawei SmartAssistant/SmartGuard): add it to the kit.',
      },
      {
        sq: 'Vetëm module S1: modulet S0/E0 nuk përzihen me S1/E1.',
        en: 'S1 modules only: S0/E0 modules cannot be mixed with S1/E1.',
      },
    ],
    batteryPowerKw: 3.5,
    sources: [HUAWEI_M1_SPECS, LUNA_DS, LUNA_MANUAL, HUAWEI_CH_GUIDE],
  },
  no('huawei-sun2000-10ktl-m1', 'pylontech-us5000', huaweiM1(
    'Një bateri 48 V nuk përputhet as me hyrjen e tij 600–980 V.',
    'A 48 V battery cannot meet its 600–980 V battery input either.',
  ), [HUAWEI_M1_SPECS, PYLON_MANUAL]),
];

// ---------------------------------------------------------------- what a product page should say on its own
export type CatalogueNote = { text: Bi; sources: CompatSource[] };

/** Gaps a product page should state, by products.slug. */
export const CATALOGUE_NOTES: Partial<Record<InverterSlug | BatterySlug, CatalogueNote[]>> = {
  'growatt-mod-10ktl3-xh': [
    {
      text: {
        sq: 'Growatt lejon te ky inverter vetëm baterinë e vet ARK-XH HV (versioni BP: vetëm APX HV). Asnjëra nuk është në katalog, ndaj asnjë bateri e katalogut nuk punon me të.',
        en: 'Growatt allows only its own ARK-XH HV battery on this inverter (the BP version: only the APX HV). Neither is in the catalogue, so no battery in the catalogue works with it.',
      },
      sources: [GROWATT_MANUAL],
    },
  ],
  'huawei-luna2000-7-s1': [
    {
      text: {
        sq: 'Me Huawei SUN2000-10KTL-M1, LUNA2000-7-S1 (një modul baterie) punon vetëm e lidhur me rrjetin: rezerva kur bie rrjeti kërkon të paktën dy module, pra LUNA2000-14-S1 ose më të madhe me modulet 7 kWh.',
        en: 'With the Huawei SUN2000-10KTL-M1, the LUNA2000-7-S1 (one battery module) works on-grid only: backup when the grid fails needs at least two modules, so the LUNA2000-14-S1 or larger with the 7 kWh modules.',
      },
      sources: [LUNA_MANUAL],
    },
  ],
  'huawei-sun2000-10ktl-m1': [
    {
      text: {
        sq: 'Huawei lejon te ky inverter vetëm bateritë e veta LUNA2000-S0 dhe S1. Me LUNA2000-7-S1 të katalogut punon vetëm i lidhur me rrjetin, pa rezervë kur bie rrjeti.',
        en: 'Huawei allows only its own LUNA2000-S0 and S1 batteries on this inverter. With the LUNA2000-7-S1 in the catalogue it works on-grid only, with no backup when the grid fails.',
      },
      sources: [HUAWEI_M1_SPECS, LUNA_MANUAL],
    },
  ],
  'deye-sun-10k-sg04lp3-eu': [
    {
      text: {
        sq: 'Në faqen e Deye ky model është zëvendësuar nga SUN-10K-SG05LP3-EU-SM2, por SG04LP3-EU përmendet ende në listat e baterive të Deye dhe Dyness, dhe seria SG04LP3 në listën e Pylontech.',
        en: 'On Deye’s site this model has been replaced by the SUN-10K-SG05LP3-EU-SM2, but the SG04LP3-EU is still named on the Deye and Dyness battery lists, and its SG04LP3 series on Pylontech’s list.',
      },
      sources: [DEYE_LIST, DYNESS_LIST, PYLON_LIST],
    },
  ],
  'byd-battery-box-premium-hvs-10-2': [
    {
      text: {
        sq: 'Nuk punon me Fronius Primo GEN24 5.0 Plus: Fronius e përjashton HVS 10.2 te Primo (aty lejohen vetëm HVS 5.1 dhe 7.7, që nuk janë në katalog). Me Fronius Symo GEN24 10.0 Plus dhe GoodWe GW10K-ET është në listë.',
        en: 'Not for the Fronius Primo GEN24 5.0 Plus: Fronius excludes the HVS 10.2 on the Primo (only the HVS 5.1 and 7.7 are allowed there, and they are not in the catalogue). With the Fronius Symo GEN24 10.0 Plus and the GoodWe GW10K-ET it is listed.',
      },
      sources: [FRONIUS_BYD_SHEET, BYD_LIST],
    },
  ],
  'fronius-primo-gen24-5-plus': [
    {
      text: {
        sq: 'Fronius e përjashton BYD HVS 10.2 te ky inverter; nga bateritë e katalogut punojnë me të BYD HVM 11.0 dhe Fronius Reserva 6.3.',
        en: 'Fronius excludes the BYD HVS 10.2 on this inverter; of the catalogue’s batteries, the BYD HVM 11.0 and the Fronius Reserva 6.3 work with it.',
      },
      sources: [FRONIUS_BYD_SHEET, FRONIUS_RESERVA_SHEET],
    },
  ],
};

// ---------------------------------------------------------------- lookups
const key = (inv: string, bat: string) => `${inv}|${bat}`;
const BY_KEY = new Map(COMPAT_PAIRS.map((p) => [key(p.inverter, p.battery), p]));

/** The matrix entry for an inverter and a battery (products.slug), or null when either is not in the matrix. */
export function compatPair(inv: string, bat: string): CompatPair | null {
  return BY_KEY.get(key(inv, bat)) ?? null;
}

/** True only for verdict 'compatible'; 'unknown', 'not_compatible' and slugs outside the matrix are all false. */
export function isCompatible(inv: string, bat: string): boolean {
  return compatPair(inv, bat)?.verdict === 'compatible';
}

/** The compatible pairs for an inverter, in BATTERY_SLUGS order ([] for an inverter with no battery input). */
export function compatibleBatteries(invSlug: string): CompatPair[] {
  return COMPAT_PAIRS.filter((p) => p.inverter === invSlug && p.verdict === 'compatible');
}

/** The compatible pairs for a battery, in INVERTER_SLUGS order. */
export function compatibleInverters(batSlug: string): CompatPair[] {
  return COMPAT_PAIRS.filter((p) => p.battery === batSlug && p.verdict === 'compatible');
}

/** CATALOGUE_NOTES for one product ([] when it has none). */
export function catalogueNotes(slug: string): CatalogueNote[] {
  return CATALOGUE_NOTES[slug as InverterSlug | BatterySlug] ?? [];
}
