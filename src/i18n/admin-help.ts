// Plain-language help for every page of the admin panel (components/AdminHelp.astro). Written for someone
// opening the panel for the first time: what the page is for, how to work it, and what each option means.
// Editors that differ from their list page have their own entry (product, category, offer, order).
import type { Lang } from '../lib/i18n';

export type HelpKey =
  | 'dashboard' | 'orders' | 'order' | 'products' | 'product' | 'categories' | 'category' | 'sellers'
  | 'offers' | 'offer' | 'monitor' | 'quotes' | 'applications' | 'messages' | 'settings';

export type Help = {
  what: string;
  steps: string[];
  terms: [string, string][];
  /** Shown to seller accounts only. */
  seller?: string;
};

type Chrome = { summary: string; steps: string; terms: string };

const chrome: Record<Lang, Chrome> = {
  sq: { summary: 'Si funksionon kjo faqe dhe çfarë do të thonë opsionet', steps: 'Hap pas hapi', terms: 'Opsionet dhe fjalët në këtë faqe' },
  en: { summary: 'How this page works and what the options mean', steps: 'Step by step', terms: 'The options and words on this page' },
};

const sq: Record<HelpKey, Help> = {
  dashboard: {
    what: 'Përmbledhja e dyqanit: shitjet, porositë dhe çfarë pret për ju. Shumat përfshijnë TVSH-në 20%; porositë e anuluara nuk llogariten.',
    steps: [
      'Filloni te “Në pritje të veprimit”: çdo numër është lidhje te gjërat që duan ju.',
      '“Stok i ulët” tregon ofertat me 3 copë ose më pak, që shitësi të furnizohet para se të mbarojë produkti.',
      'Kaloni mbi një shtyllë te “Shitjet në ditë” për shumën e asaj dite; “Shiko si tabelë” i jep të gjitha ditët.',
    ],
    terms: [
      ['Porosi të hapura', 'Të reja, të konfirmuara ose në përpunim: ende pa u dërguar.'],
      ['Shitjet me TVSH', 'Sa paguan blerësit për produktet, me TVSH, pa transportin.'],
      ['Komisioni i platformës', 'Pjesa e BeeD nga këto shitje, sipas përqindjes së secilit shitës.'],
      ['Porositë sipas gjendjes', 'Ku ndodhen sot porositë e 90 ditëve të fundit.'],
      ['Fotot e katalogut', 'Sa produkte të publikuara kanë të paktën një foto. Ku mungon, dyqani shfaq markën.'],
    ],
    seller: 'Si shitës shihni vetëm rreshtat e porosive dhe ofertat tuaja.',
  },
  orders: {
    what: 'Të gjitha porositë e dyqanit, më të rejat në fillim. Porosia e një blerësi ndahet në një pako për çdo shitës.',
    steps: [
      'Filtroni sipas gjendjes, ose kërkoni me kodin e porosisë (BD-…) ose me numrin e telefonit.',
      'Hapni një porosi për të parë blerësin, pakot dhe historikun, dhe për t’i ndryshuar gjendjen.',
      'Çojeni porosinë përpara sapo ndodh diçka: E konfirmuar → Në përpunim → E dërguar → E dorëzuar.',
    ],
    terms: [
      ['E re', 'Blerësi e bëri, askush nuk e ka parë ende.'],
      ['E konfirmuar', 'Kontrolluat stokun dhe çmimin dhe e njoftuat blerësin.'],
      ['Në përpunim', 'Po paketohet ose po përgatitet.'],
      ['E dërguar / E dorëzuar', 'Në rrugë / në duart e blerësit.'],
      ['E anuluar', 'E ndalur. Stoku kthehet vetë në shitje, dhe një porosi e anuluar nuk rihapet.'],
      ['Pagesa', 'Para në dorë, transfertë bankare ose kartë. Porositë me kartë pa paguar pas 45 minutash anulohen vetë.'],
    ],
    seller: 'Shihni vetëm porositë që kanë produkte tuajat, dhe shumat e rreshtave tuaj.',
  },
  order: {
    what: 'Një porosi: kush bleu çfarë, nga cilët shitës, dhe gjithçka që i ka ndodhur.',
    steps: [
      'Kontrolloni të dhënat e blerësit dhe adresën e dorëzimit.',
      'Ndryshoni gjendjen me formularin; shtoni një shënim kur diçka duhet shpjeguar. Shënimet dalin në historik.',
      'Kur mbërrijnë paratë e një transferte, shënoni pagesën. “Printo” jep fletën për paketimin.',
    ],
    terms: [
      ['Pako', 'Produktet e një shitësi, që nisen bashkë me tarifën e transportit të atij shitësi.'],
      ['Komisioni', 'Pjesa e BeeD nga çdo rresht.'],
      ['Historiku', 'Çdo ndryshim: çfarë, kush dhe kur.'],
      ['Anulimi', 'Kthen stokun në shitje. Nuk mund të zhbëhet.'],
    ],
  },
  products: {
    what: 'Katalogu: çdo produkt që dyqani mund të shesë. Çmimet nuk vendosen këtu: çdo shitës shton një ofertë me çmimin e vet.',
    steps: [
      'Filtroni sipas kategorisë, gjendjes ose fotos, ose kërkoni me markë, model ose adresë.',
      'Hapni një produkt për t’i ndryshuar të dhënat, specifikimet dhe fotot.',
      '“Pa foto” shënon produktet që në dyqan shfaqin ende markën në vend të një fotoje.',
    ],
    terms: [
      ['Publikuar', 'Duket në dyqan.'],
      ['Skicë', 'E ruajtur por e fshehur: përdoreni kur produkti është ende në përgatitje.'],
      ['Arkivuar', 'E hequr nga dyqani; ruhet që porositë e vjetra ta tregojnë.'],
      ['I zgjedhur', 'Shfaqet në faqen kryesore.'],
      ['Oferta / Nga', 'Sa shitës e shesin, dhe çmimi më i ulët.'],
    ],
    seller: 'Katalogun e mban BeeD. Për të shitur një produkt, përdorni “Shto ofertën time” dhe vendosni çmimin dhe stokun tuaj.',
  },
  product: {
    what: 'Gjithçka që dyqani tregon për një produkt. Çmimi dhe stoku u përkasin ofertave, jo kësaj faqeje.',
    steps: [
      'Zgjidhni në fillim kategorinë: ajo vendos cilat fusha specifikimesh dalin.',
      'Plotësoni emrat dhe përshkrimet në të dyja gjuhët, pastaj specifikimet.',
      'Ruajeni, pastaj shtoni foto në të djathtë (në telefon: poshtë). Fotoja e parë është ajo që blerësit shohin në fillim.',
    ],
    terms: [
      ['Adresa (slug)', 'Fundi i adresës së produktit, p.sh. /produkt/jinko-tiger-neo. Lëreni bosh dhe krijohet nga marka dhe modeli.'],
      ['Përmasat', 'Në milimetra, si te fleta teknike; shfaqen në faqen e produktit.'],
      ['Specifikimet', 'Vlerat teknike me të cilat blerësit filtrojnë dhe krahasojnë. Ato të detyrueshme janë të shënuara.'],
      ['Fleta teknike', 'PDF-ja e prodhuesit, që hapet nga faqja e produktit.'],
      ['Fotot', 'JPG, PNG ose WebP. Zvogëlohen vetë; “Bëje kryesore” zgjedh atë që del në karta.'],
      ['Gjendja', 'Skicë (e fshehur), Publikuar (në dyqan) ose Arkivuar (e hequr, ruhet për porositë e vjetra).'],
      ['I zgjedhur', 'Produkti del në faqen kryesore të dyqanit.'],
    ],
  },
  categories: {
    what: 'Repartet e dyqanit dhe, për secilin, lista e specifikimeve që kanë produktet e tij.',
    steps: [
      'Hapni një kategori për t’i ndryshuar emrat, adresat ose modelin e specifikimeve.',
      'Modeli vendos fushat në formularin e produktit dhe filtrat në dyqan.',
    ],
    terms: [
      ['Adresat', 'Adresa e kategorisë në internet, për secilën gjuhë.'],
      ['Grupi', 'Ku del në menunë e dyqanit: energji, efiçencë ose ndërtim.'],
      ['Atributet', 'Specifikimet në modelin e saj.'],
      ['Aktive', 'Duket në dyqan. Një kategori joaktive fshihet bashkë me produktet e saj.'],
      ['Renditja', 'Numrat më të vegjël dalin të parët.'],
    ],
  },
  category: {
    what: 'Një kategori: emrat e saj dhe modeli i specifikimeve me të cilin plotësohen produktet.',
    steps: [
      'Vendosni emrat dhe hyrjen e shkurtër në të dyja gjuhët.',
      'Në model, shtoni një rresht për çdo specifikim; shënoni ato me të cilat blerësit duhet të filtrojnë ose krahasojnë.',
      'Nëse ndryshoni llojin e një specifikimi, vlerat ekzistuese kthehen; ato që nuk kthehen dot hiqen, dhe ju tregohet sa.',
    ],
    terms: [
      ['Çelësi', 'Emri i brendshëm i specifikimit, vetëm shkronja dhe _, p.sh. power_wp. Mos e ndryshoni pasi produktet e përdorin.'],
      ['Lloji', 'Numër (me njësi), listë (zgjedhje të caktuara), po/jo, ose tekst.'],
      ['Filtër', 'Del si filtër në dyqan.'],
      ['Krahasim', 'Del në tabelën e krahasimit.'],
      ['Në kartë', 'Shfaqet në kartën e produktit.'],
      ['Më mirë', 'Për numrat: më i lartë apo më i ulët është më mirë; krahasimi shënon vlerën më të mirë.'],
      ['Specifikimi për çmimin për njësi', 'Një numër (p.sh. fuqia në Wp) me të cilin pjesëtohet çmimi, që jep lekë/Wp ose lekë/m².'],
    ],
  },
  sellers: {
    what: 'Bizneset që shesin në dyqan: të dhënat, plani, komisioni dhe gjendja e tyre.',
    steps: [
      'Hapni një shitës për t’i ndryshuar të dhënat e kompanisë, planin dhe komisionin.',
      'Shitësit e rinj zakonisht vijnë nga “Aplikimet”: miratimi i një aplikimi e krijon shitësin këtu.',
    ],
    terms: [
      ['Plani', 'Start, Pro ose Partner; plani vendos komisionin.'],
      ['Komisioni', 'Përqindja e çdo shitjeje që shkon te BeeD.'],
      ['I verifikuar', 'Dokumentet e tij janë kontrolluar; dyqani tregon një shenjë.'],
      ['Gjendja', 'Ofertat e shitësve aktivë duken në dyqan; gjendjet e tjera i fshehin.'],
    ],
  },
  offers: {
    what: 'Kush shet çfarë, me çfarë çmimi dhe sa stok. Një produkt mund të ketë oferta nga shumë shitës; blerësit i shohin krah për krah.',
    steps: [
      'Ndryshoni çmimin dhe stokun drejt në listë dhe shtypni “Ruaj” në atë rresht.',
      'Përdorni “Ndrysho çdo fushë” për transportin, sasinë minimale dhe çmimet për sasi.',
      'Mbajeni stokun të saktë: një porosi nuk mund të marrë më shumë se stoku.',
    ],
    terms: [
      ['Çmimi', 'Për njësi, me TVSH, në lekë.'],
      ['Stoku', 'Copët që ka sot. Porositë e ulin; anulimet e kthejnë.'],
      ['Aktive / Joaktive', 'Ofertat joaktive fshihen nga blerësit.'],
      ['E sponsorizuar', 'Vend me pagesë: del e para mes ofertave.'],
    ],
    seller: 'Shihni dhe ndryshoni vetëm ofertat tuaja.',
  },
  offer: {
    what: 'Oferta e një shitësi për një produkt: çmimi, stoku, transporti dhe çmimet për sasi.',
    steps: [
      'Vendosni çmimin për njësi me TVSH, dhe stokun.',
      'Vendosni transportin: tarifën për zonën 1 dhe, nëse doni, shumën mbi të cilën transporti është falas.',
      'Shtoni çmime për sasi nëse sasitë e mëdha marrin çmim më të ulët për njësi.',
    ],
    terms: [
      ['Ditët e dorëzimit', 'Sa ditë pune zgjat zakonisht dorëzimi.'],
      ['Sasia minimale', 'Sasia më e vogël që mund të porosisë blerësi.'],
      ['Tarifa e transportit', 'Për porosi, deri në zonën 1; zonat 2 dhe 3 shtojnë shtesën e qytetit nga “Cilësimet”.'],
      ['Transport falas mbi', 'Shuma e porosisë nga e cila ky shitës nuk merr transport.'],
      ['Çmimet për sasi', 'Çmim më i ulët për njësi nga një sasi e caktuar, p.sh. nga 20 copë.'],
      ['Montimi', 'Shitësi mund edhe ta montojë produktin.'],
      ['Historiku i çmimit', 'Çdo ndryshim çmimi ruhet dhe u tregohet blerësve si grafik 90-ditor.'],
    ],
  },
  monitor: {
    what: 'Ku duan një sy çmimet: produktet ku shitësit ndryshojnë më shumë, produktet me një shitës të vetëm, dhe ato pa asnjë.',
    steps: [
      'Një diferencë e madhe mund të jetë gabim shtypi në një çmim: hapni ofertën dhe kontrollojeni.',
      'Produktet pa ofertë janë rast për të ftuar një shitës.',
    ],
    terms: [
      ['Diferenca', 'Sa është çmimi më i lartë mbi më të ulëtin, në përqindje.'],
      ['Një ofertë e vetme', 'Blerësi nuk ka me se ta krahasojë çmimin.'],
      ['Pa ofertë', 'Dyqani tregon “Kërko ofertë” në vend të çmimit.'],
      ['Çmimi i referencës', 'Një çmim publik i gjetur gjatë kërkimit, për krahasim.'],
    ],
  },
  quotes: {
    what: 'Kërkesa nga blerës që duan një çmim për një projekt të tërë. Shitësit përgjigjen në bisedën e kërkesës.',
    steps: [
      'Hapni një kërkesë për të lexuar projektin dhe produktet e kërkuara.',
      'Përgjigjuni në bisedë me një çmim; blerësi e sheh në faqen e tij private.',
      'Mbylleni kërkesën kur zgjidhet.',
    ],
    terms: [
      ['E hapur / E mbyllur', 'Kërkesat e hapura marrin përgjigje; të mbyllurat jo.'],
      ['Kontakti i blerësit', 'E mban BeeD; shitësit flasin me blerësin përmes bisedës.'],
      ['Çmimi i ofruar', 'Me TVSH; del i theksuar në bisedë.'],
    ],
  },
  applications: {
    what: 'Bizneset që kërkuan të shesin në dyqan përmes formularit “Shit me ne”.',
    steps: [
      'Lexoni aplikimin: kompania, NIPT-i, kategoritë dhe plani që duan.',
      'Miratojeni për ta krijuar shitësin (aktiv, me komisionin e planit), ose refuzojeni.',
      'Pas miratimit, hapni shitësin dhe kontrolloni të dhënat.',
    ],
    terms: [
      ['Plani i kërkuar', 'Plani që zgjodhi biznesi; komisioni merret nga Cilësimet → planet.'],
      ['NIPT', 'Numri tatimor shqiptar: një shkronjë, tetë shifra, një shkronjë.'],
    ],
  },
  messages: {
    what: 'Mesazhet e dërguara përmes formularit të kontaktit të dyqanit.',
    steps: [
      'Përgjigjuni me email ose telefon nga të dhënat në mesazh.',
      'Shënojeni si të trajtuar kur mbaroni, që të dalë nga numri “Në pritje të veprimit”.',
    ],
    terms: [['I trajtuar / I patrajtuar', 'Nëse dikush i është përgjigjur apo jo.']],
  },
  settings: {
    what: 'Vlerat që përdor gjithë dyqani: zonat e transportit, mënyrat e pagesës, banka, kontakti, kursi i këmbimit dhe tarifat e energjisë.',
    steps: [
      'Çdo kuti ruhet më vete me “Ruaj këtë pjesë”.',
      'Ndryshimet vlejnë menjëherë për porositë dhe kërkesat e reja; porositë e bëra i mbajnë çmimet e tyre.',
    ],
    terms: [
      ['Shtesa e zonës', 'I shtohet tarifës së transportit të çdo shitësi për qytetet e zonave 2 dhe 3.'],
      ['Marrja te shitësi', 'Blerësit mund ta marrin vetë mallin në vend që të paguajnë transport.'],
      ['Kufiri për para në dorë', 'Mbi këtë shumë, blerësit paguajnë me transfertë ose kartë.'],
      ['Të dhënat bankare', 'U tregohen blerësve që zgjedhin transfertë bankare.'],
      ['Planet', 'Komisioni në përqindje për çdo plan shitësi.'],
      ['Kursi i këmbimit', 'Lekë për një euro, për çmimet e referencës në euro.'],
      ['Tarifat e energjisë', 'I përdor kalkulatori diellor për të vlerësuar kursimin.'],
    ],
  },
};

const en: Record<HelpKey, Help> = {
  dashboard: {
    what: 'A summary of the shop: sales, orders and what is waiting for you. Figures include 20% VAT; cancelled orders are left out.',
    steps: [
      'Start with “Waiting for action”: each number is a link to the things that need you.',
      '“Low stock” lists offers with 3 pieces or fewer, so the seller can restock before the product sells out.',
      'Point at a column in “Sales per day” for that day’s total; “Show as a table” lists every day.',
    ],
    terms: [
      ['Open orders', 'New, confirmed or in progress: not shipped yet.'],
      ['Sales incl. VAT', 'What buyers paid for products, VAT included, delivery left out.'],
      ['Platform commission', 'BeeD’s share of those sales, at each seller’s rate.'],
      ['Orders by status', 'Where the orders of the last 90 days stand today.'],
      ['Catalogue photos', 'How many published products have at least one photo. Where one is missing, the shop shows the brand.'],
    ],
    seller: 'As a seller you see only your own order lines and offers.',
  },
  orders: {
    what: 'Every order placed in the shop, newest first. A buyer’s order is split into one parcel per seller.',
    steps: [
      'Filter by status, or search by order code (BD-…) or phone number.',
      'Open an order to see the buyer, the parcels and the timeline, and to change its status.',
      'Move the order forward as things happen: Confirmed → In progress → Shipped → Delivered.',
    ],
    terms: [
      ['New', 'The buyer placed it; nobody has looked at it yet.'],
      ['Confirmed', 'You checked stock and price and told the buyer.'],
      ['In progress', 'Being packed or prepared.'],
      ['Shipped / Delivered', 'On its way / in the buyer’s hands.'],
      ['Cancelled', 'Stopped. The stock goes back on sale by itself, and a cancelled order cannot be reopened.'],
      ['Payment', 'Cash on delivery, bank transfer or card. Card orders still unpaid after 45 minutes are cancelled automatically.'],
    ],
    seller: 'You see only orders that contain your products, and the totals of your own lines.',
  },
  order: {
    what: 'One order: who bought what, from which sellers, and everything that has happened to it.',
    steps: [
      'Check the buyer’s details and the delivery address.',
      'Change the status with the form; add a note when something needs explaining. Notes appear in the timeline.',
      'When a bank transfer arrives, record the payment. “Print” gives the packing slip.',
    ],
    terms: [
      ['Parcel', 'The products from one seller, sent together with that seller’s delivery fee.'],
      ['Commission', 'BeeD’s share of each line.'],
      ['Timeline', 'Every change: what, who and when.'],
      ['Cancelling', 'Puts the stock back on sale. It cannot be undone.'],
    ],
  },
  products: {
    what: 'The catalogue: every product the shop can sell. Prices are not set here: each seller adds an offer with their own price.',
    steps: [
      'Filter by category, status or photo, or search by brand, model or address.',
      'Open a product to edit its details, specifications and photos.',
      '“No photo” marks products that still show the brand in the shop instead of a picture.',
    ],
    terms: [
      ['Published', 'Visible in the shop.'],
      ['Draft', 'Saved but hidden: use it while a product is still being prepared.'],
      ['Archived', 'Taken out of the shop; kept so old orders still show it.'],
      ['Featured', 'Shown on the home page.'],
      ['Offers / From', 'How many sellers sell it, and the lowest price.'],
    ],
    seller: 'BeeD manages the catalogue. To sell a product, use “Add my offer” and set your own price and stock.',
  },
  product: {
    what: 'Everything the shop shows about one product. Price and stock belong to the offers, not to this page.',
    steps: [
      'Choose the category first: it decides which specification fields appear.',
      'Fill in the names and descriptions in both languages, then the specifications.',
      'Save, then add photos on the right (on a phone: further down). The first photo is the one buyers see first.',
    ],
    terms: [
      ['Address (slug)', 'The end of the product’s web address, e.g. /en/product/jinko-tiger-neo. Leave it empty and it is made from brand and model.'],
      ['Dimensions', 'In millimetres, as on the datasheet; shown on the product page.'],
      ['Specifications', 'The technical values buyers filter and compare by. Required ones are marked.'],
      ['Datasheet link', 'The manufacturer’s PDF, opened from the product page.'],
      ['Photos', 'JPG, PNG or WebP. They are resized automatically; “Make main” picks the one shown on cards.'],
      ['Status', 'Draft (hidden), Published (in the shop) or Archived (removed, kept for old orders).'],
      ['Featured', 'The product appears on the shop’s home page.'],
    ],
  },
  categories: {
    what: 'The shop’s departments and, for each one, the list of specifications its products have.',
    steps: [
      'Open a category to change its names, its addresses or its specification template.',
      'The template decides the fields in the product form and the filters in the shop.',
    ],
    terms: [
      ['Addresses', 'The category’s web address in each language.'],
      ['Group', 'Where it appears in the shop menu: energy, efficiency or building.'],
      ['Attributes', 'The specifications in its template.'],
      ['Active', 'Shown in the shop. An inactive category is hidden together with its products.'],
      ['Order', 'Lower numbers come first.'],
    ],
  },
  category: {
    what: 'One category: its names and the specification template its products are filled in with.',
    steps: [
      'Set the names and the short introduction in both languages.',
      'In the template, add a row for each specification; mark the ones buyers should filter or compare by.',
      'If you change a specification’s type, existing values are converted; values that cannot be are removed, and you are told how many.',
    ],
    terms: [
      ['Key', 'The specification’s internal name, letters and _ only, e.g. power_wp. Do not change it once products use it.'],
      ['Type', 'Number (with a unit), list (fixed choices), yes/no, or text.'],
      ['Filter', 'Appears as a filter in the shop.'],
      ['Compare', 'Appears in the comparison table.'],
      ['On the card', 'Shown on the product card.'],
      ['Better', 'For numbers: whether higher or lower is better; the comparison marks the best value.'],
      ['Spec for the unit price', 'A number (e.g. power in Wp) the price is divided by, giving ALL/Wp or ALL/m².'],
    ],
  },
  sellers: {
    what: 'The businesses that sell in the shop: their details, plan, commission and status.',
    steps: [
      'Open a seller to edit their company details, plan and commission.',
      'New sellers usually come from “Applications”: approving one creates the seller here.',
    ],
    terms: [
      ['Plan', 'Start, Pro or Partner; the plan sets the commission.'],
      ['Commission', 'The percentage of each sale that goes to BeeD.'],
      ['Verified', 'Their documents have been checked; the shop shows a mark.'],
      ['Status', 'Offers from active sellers appear in the shop; any other status hides them.'],
    ],
  },
  offers: {
    what: 'Who sells what, at which price, with how much stock. One product can have offers from many sellers; buyers see them side by side.',
    steps: [
      'Change price and stock straight in the list and press “Save” on that row.',
      'Use “Edit every field” for delivery, minimum quantity and volume prices.',
      'Keep stock accurate: an order can never take more than the stock.',
    ],
    terms: [
      ['Price', 'Per unit, VAT included, in lekë.'],
      ['Stock', 'Pieces available now. Orders lower it; cancellations put it back.'],
      ['Active / Inactive', 'Inactive offers are hidden from buyers.'],
      ['Sponsored', 'Paid placement: shown first among the offers.'],
    ],
    seller: 'You see and edit only your own offers.',
  },
  offer: {
    what: 'One seller’s offer for one product: price, stock, delivery and volume prices.',
    steps: [
      'Set the price per unit with VAT, and the stock.',
      'Set delivery: the fee to zone 1 and, if you like, an order total above which delivery is free.',
      'Add volume prices if larger quantities get a lower unit price.',
    ],
    terms: [
      ['Delivery days', 'How many working days delivery usually takes.'],
      ['Minimum quantity', 'The smallest amount a buyer can order.'],
      ['Delivery fee', 'Per order, to zone 1; zones 2 and 3 add the city surcharge from Settings.'],
      ['Free delivery above', 'The order total from which this seller does not charge delivery.'],
      ['Volume prices', 'A lower unit price from a given quantity, e.g. from 20 pieces.'],
      ['Installation', 'The seller can also install the product.'],
      ['Price history', 'Every price change is kept and shown to buyers as a 90-day chart.'],
    ],
  },
  monitor: {
    what: 'Where prices need a look: products whose sellers disagree most, products with a single seller, and products with none.',
    steps: [
      'A big spread can be a typing mistake in a price: open the offer and check.',
      'Products without an offer are a chance to invite a seller.',
    ],
    terms: [
      ['Spread', 'How far the highest price is above the lowest, in percent.'],
      ['Single offer', 'The buyer has nothing to compare the price with.'],
      ['No offer', 'The shop shows “Request a quote” instead of a price.'],
      ['Reference price', 'A public price found during research, for comparison.'],
    ],
  },
  quotes: {
    what: 'Requests from buyers who want a price for a whole project. Sellers answer in the request’s thread.',
    steps: [
      'Open a request to read the project and the products asked for.',
      'Reply in the thread with a price; the buyer sees it on their private page.',
      'Close the request once it is settled.',
    ],
    terms: [
      ['Open / Closed', 'Open requests take replies; closed ones do not.'],
      ['Buyer contact', 'Kept by BeeD; sellers talk to the buyer through the thread.'],
      ['Quoted price', 'VAT included; it stands out in the thread.'],
    ],
  },
  applications: {
    what: 'Businesses that asked to sell in the shop through the “Sell with us” form.',
    steps: [
      'Read the application: company, NIPT, categories and the plan they want.',
      'Approve it to create the seller (active, with the plan’s commission), or reject it.',
      'After approving, open the seller and check their details.',
    ],
    terms: [
      ['Requested plan', 'The plan the business chose; the commission comes from Settings → plans.'],
      ['NIPT', 'The Albanian tax number: one letter, eight digits, one letter.'],
    ],
  },
  messages: {
    what: 'Messages sent through the shop’s contact form.',
    steps: [
      'Answer by email or phone using the details in the message.',
      'Mark it handled when you are done, so it leaves the “Waiting for action” count.',
    ],
    terms: [['Handled / Not handled', 'Whether someone has answered it.']],
  },
  settings: {
    what: 'Values the whole shop uses: delivery zones, payment options, bank details, contact, exchange rate and electricity tariffs.',
    steps: [
      'Each box saves on its own with “Save this section”.',
      'Changes apply at once to new orders and quotes; orders already placed keep their prices.',
    ],
    terms: [
      ['Zone surcharge', 'Added to every seller’s delivery fee for cities in zones 2 and 3.'],
      ['Pick-up', 'Buyers can collect from the seller instead of paying for delivery.'],
      ['Cash-on-delivery limit', 'Above this total, buyers pay by transfer or card.'],
      ['Bank details', 'Shown to buyers who choose bank transfer.'],
      ['Plans', 'The commission percentage for each seller plan.'],
      ['Exchange rate', 'Lekë per euro, for reference prices in euro.'],
      ['Electricity tariffs', 'Used by the solar calculator to estimate savings.'],
    ],
  },
};

const help: Record<Lang, Record<HelpKey, Help>> = { sq, en };

export const helpChrome = (lang: Lang): Chrome => chrome[lang];
export const helpFor = (lang: Lang, key: HelpKey): Help => help[lang][key];
export const isHelpKey = (k: unknown): k is HelpKey => typeof k === 'string' && k in sq;
