// Words for a checked inverter + battery pair (src/content/battery-compat.ts) on the package cards, in the calculator
// and on product pages. Pure and browser-safe: the calculator's script reaches it through src/lib/compat-view.ts.
// Albanian follows the matrix's own terms (lista e përputhshmërisë, lidhur me rrjetin, rezervë kur bie rrjeti).
import type { Lang } from '../lib/i18n';

const words = {
  sq: {
    /** Heading of the pair block on a package card. */
    pairH: 'Çift i kontrolluar',
    listedLabel: 'Kush e liston',
    checkedLabel: 'Kontrolluar më',
    conditionsLabel: 'Kushtet kryesore',
    sourcesLabel: 'Dokumentet e prodhuesve',
    newTab: ' (hapet në skedë të re)',
    listedBy: {
      both: (inv: string, bat: string) => `Në listat e të dy prodhuesve, ${inv} dhe ${bat}`,
      'battery-maker': (inv: string, bat: string) => `Vetëm në listën e prodhuesit të baterisë, ${bat}; ${inv} nuk e liston`,
      'inverter-maker': (inv: string, bat: string) => `Vetëm në listën e prodhuesit të inverterit, ${inv}; ${bat} nuk e liston`,
      'same-maker': (inv: string, _bat: string) => `${inv} i prodhon të dyja dhe e liston çiftin`,
      none: (_inv: string, _bat: string) => '',
    },
    power: (kw: string) => `Fuqia e baterisë me këtë çift: deri në ${kw} kW karikim dhe shkarkim, sipas prodhuesit.`,
    /** The package card, beside the price: replaces the old "picked separately" caution. */
    installTag: 'Para instalimit',
    onGridTag: 'Pa rezervë',
    onGrid: 'Me këtë çift bateria punon vetëm e lidhur me rrjetin: kur bie rrjeti nuk ka energji rezervë.',
    /** Why a battery package has no price for this city. */
    packageIssue: {
      'no-inverter': 'Për këtë qytet sot nuk ka asnjë inverter të përshtatshëm që pranon bateri me ofertë në gjendje, prandaj nuk japim çmim të plotë.',
      'no-battery-offer': 'Për këtë qytet sot nuk ka asnjë bateri të madhësisë së duhur me ofertë në gjendje, prandaj nuk japim çmim të plotë.',
      'no-compatible-pair': 'Asnjë bateri në gjendje për këtë qytet nuk është e konfirmuar nga prodhuesit se punon me inverterët në gjendje këtu, prandaj nuk japim çmim të plotë.',
    },
    /** The calculator: one line under the kit table, and the reason a kit has no battery. */
    calcPairLabel: 'Çift i kontrolluar:',
    calcChecked: 'Kontrolluar më',
    calcSources: 'Burimet:',
    calcLedeBattery: 'Me bateri, inverteri dhe bateria janë çifti më i lirë në gjendje që të paktën një prodhues e liston si të përputhshëm, ndaj secila pjesë mund të kushtojë më shumë se oferta më e lirë për atë pjesë veçmas. Matësi i energjisë që kërkojnë disa çifte në pikën e lidhjes me rrjetin nuk është në kit.',
    /** The installer caveat under the calculator's pair line (the same words as packages.batteryCheck and worksLede). */
    calcInstall: 'Instaluesi vendos përsëri firmware-in, lidhjen e komunikimit dhe cilësimet, dhe konfirmon listën e pajisjeve.',
    /** After the package card's price note, on a battery package. */
    priceNoteBattery: 'Inverteri dhe bateria janë çifti më i lirë në gjendje që të paktën një prodhues e liston si të përputhshëm.',
    calcIssue: {
      'no-inverter': (city: string) => `Asnjë inverter që pranon bateri, me madhësinë dhe fazat që i duhen këtij impianti, nuk ka sot ofertë në gjendje nga shitës që dërgojnë në ${city}, ndaj kiti nuk ka inverter, as bateri, as total.`,
      'no-battery-offer': (city: string) => `Asnjë bateri e madhësisë që i duhet këtij impianti nuk ka sot ofertë në gjendje nga shitës që dërgojnë në ${city}, ndaj kiti nuk ka bateri dhe as total.`,
      'no-compatible-pair': (city: string) => `Asnjë bateri e madhësisë së duhur në gjendje për ${city} nuk është e konfirmuar nga prodhuesit se punon me inverterët në gjendje këtu, ndaj kiti nuk ka bateri dhe as total.`,
    },
    noPayback: 'Pa total, periudha e shlyerjes nuk llogaritet.',
    /** The product page section. */
    worksH: 'Punon me',
    worksLede: {
      inverter: 'Bateritë në katalog që të paktën një prodhues i liston si të përputhshme me këtë inverter. Instaluesi vendos përsëri firmware-in, lidhjen e komunikimit dhe cilësimet, dhe konfirmon listën e pajisjeve.',
      battery: 'Inverterët në katalog që të paktën një prodhues i liston si të përputhshëm me këtë bateri. Instaluesi vendos përsëri firmware-in, lidhjen e komunikimit dhe cilësimet, dhe konfirmon listën e pajisjeve.',
    },
    worksNone: {
      inverter: 'Asnjë bateri në katalog nuk është në listat e prodhuesve për këtë inverter.',
      battery: 'Asnjë inverter në katalog nuk është në listat e prodhuesve për këtë bateri.',
    },
    noteTag: 'Shënim për katalogun',
  },
  en: {
    pairH: 'Checked pair',
    listedLabel: 'Listed by',
    checkedLabel: 'Checked on',
    conditionsLabel: 'Key conditions',
    sourcesLabel: 'Makers’ documents',
    newTab: ' (opens in a new tab)',
    listedBy: {
      both: (inv: string, bat: string) => `On both makers’ lists, ${inv} and ${bat}`,
      'battery-maker': (inv: string, bat: string) => `Only on the battery maker’s list, ${bat}; ${inv} does not list it`,
      'inverter-maker': (inv: string, bat: string) => `Only on the inverter maker’s list, ${inv}; ${bat} does not list it`,
      'same-maker': (inv: string, _bat: string) => `${inv} makes both and lists the pair`,
      none: (_inv: string, _bat: string) => '',
    },
    power: (kw: string) => `Battery power with this pair: up to ${kw} kW charge and discharge, as the maker states.`,
    installTag: 'Before installation',
    onGridTag: 'No backup',
    onGrid: 'With this pair the battery works on-grid only: there is no backup power when the grid fails.',
    packageIssue: {
      'no-inverter': 'Today no suitable inverter that takes a battery has an in-stock offer for this city, so we show no full price.',
      'no-battery-offer': 'Today no battery of the right size has an in-stock offer for this city, so we show no full price.',
      'no-compatible-pair': 'No battery in stock for this city is confirmed by the makers to work with the inverters in stock here, so we show no full price.',
    },
    calcPairLabel: 'Checked pair:',
    calcChecked: 'Checked on',
    calcSources: 'Sources:',
    calcLedeBattery: 'With a battery, the inverter and the battery are the cheapest in-stock pair that at least one maker lists as compatible, so either part can cost more than the cheapest offer for that part alone. The energy meter some pairs need at the grid connection is not in the kit.',
    calcInstall: 'The installer still sets the firmware, the communication link and the settings, and confirms the equipment list.',
    priceNoteBattery: 'The inverter and the battery are the cheapest in-stock pair that at least one maker lists as compatible.',
    calcIssue: {
      'no-inverter': (city: string) => `No inverter that takes a battery, with the size and phases this system needs, has an in-stock offer today from sellers who deliver to ${city}, so the kit has no inverter, no battery and no total.`,
      'no-battery-offer': (city: string) => `No battery of the size this system needs has an in-stock offer today from sellers who deliver to ${city}, so the kit has no battery and no total.`,
      'no-compatible-pair': (city: string) => `No battery of the right size in stock for ${city} is confirmed by the makers to work with the inverters in stock here, so the kit has no battery and no total.`,
    },
    noPayback: 'Without a total, the payback period is not worked out.',
    worksH: 'Works with',
    worksLede: {
      inverter: 'The batteries in the catalogue that at least one maker lists as compatible with this inverter. The installer still sets the firmware, the communication link and the settings, and confirms the equipment list.',
      battery: 'The inverters in the catalogue that at least one maker lists as compatible with this battery. The installer still sets the firmware, the communication link and the settings, and confirms the equipment list.',
    },
    worksNone: {
      inverter: 'No battery in the catalogue is on the makers’ lists for this inverter.',
      battery: 'No inverter in the catalogue is on the makers’ lists for this battery.',
    },
    noteTag: 'Catalogue note',
  },
};

export type CompatWords = (typeof words)['sq'];
export const tc = (lang: Lang): CompatWords => words[lang];
