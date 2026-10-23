// Terms of use and privacy policy — DRAFTS built only from research/albania-construction-commerce.md
// (Law 10128/2009 e-commerce, Law 9902/2008 consumer protection as consolidated in 2018, Law 124/2024 personal data,
// VAT Law 92/2014 via PwC, Law 87/2019 + Instruction 16/2020 fiscalisation, Law 50/2025 CEFTA e-commerce).
// Text in [square brackets] is a placeholder the client's lawyer must complete. Not legal advice.
import type { Lang } from '../lib/i18n';

export type LegalSection = { id: string; title: string; paras?: string[]; list?: string[]; after?: string[] };
export type LegalDoc = { title: string; description: string; eyebrow: string; h1: string; draft: string; draftTitle: string; updated: string; toc: string; sources: string; sections: LegalSection[]; lawLinks: { label: string; url: string }[] };

const LAWS_SQ = [
  { label: 'Ligji 10128/2009 “Për tregtinë elektronike”, i ndryshuar (tekst i konsoliduar, IDP)', url: 'https://idp.al/wp-content/uploads/2024/01/ligji_10128_per_tregtine_elektronike_i_ndryshuar.pdf' },
  { label: 'Ligji 9902/2008 “Për mbrojtjen e konsumatorëve”, version i konsoliduar 2018', url: 'https://aac.gov.al/wp-content/uploads/2024/12/Ligji-9902-date-17.04.2008-i-ndryshuar-version-i-konsoliduar-2018.doc' },
  { label: 'Ligji 124/2024 “Për mbrojtjen e të dhënave personale”', url: 'https://idp.al/wp-content/uploads/2025/07/ligj-2024-12-19-124.pdf' },
  { label: 'Udhëzimi nr. 16, 3.4.2020 “Për faturën dhe sistemin e monitorimit të qarkullimit”', url: 'https://qeverisjavendore.gov.al/wp-content/uploads/2024/08/Udhezim-nr.-16-date-3.4.-2020-Per-faturen-dhe-sistemin-e-monitorimit-te-qarkullimit.pdf' },
];
const LAWS_EN = [
  { label: 'Law 10128/2009 “On electronic commerce”, as amended (consolidated text, IDP)', url: LAWS_SQ[0].url },
  { label: 'Law 9902/2008 “On consumer protection”, consolidated version 2018', url: LAWS_SQ[1].url },
  { label: 'Law 124/2024 “On the protection of personal data”', url: LAWS_SQ[2].url },
  { label: 'Instruction no. 16, 3.4.2020 “On the invoice and the turnover monitoring system”', url: LAWS_SQ[3].url },
];

export const legal: Record<Lang, { terms: LegalDoc; privacy: LegalDoc; operator: string; contactSoon: string }> = {
  sq: {
    operator: 'BeeD Consulting sh.p.k. · NIPT M41722050A · Tiranë',
    contactSoon: '[adresa e selisë, emaili dhe telefoni: do të publikohen së shpejti]',
    terms: {
      title: 'Kushtet e përdorimit dhe të blerjes (draft)',
      description: 'Kushtet e BeeD Energy: roli i platformës dhe i shitësve, çmimet, porosia, pagesat, dërgesa, e drejta e heqjes dorë nga kontrata, garancia dhe ankesat.',
      eyebrow: 'Ligjore',
      h1: 'Kushtet e përdorimit',
      draftTitle: 'Draft për t’u rishikuar',
      draft: 'Ky tekst është një draft i përgatitur nga burime publike (ligjet e listuara në fund) dhe duhet rishikuar nga një jurist para nisjes së tregut. Nuk është këshillë ligjore. Pjesët në [kllapa katrore] mungojnë ende.',
      updated: 'Draft i 23 tetorit 2026',
      toc: 'Përmbajtja',
      sources: 'Ligjet mbi të cilat bazohet ky draft',
      lawLinks: LAWS_SQ,
      sections: [
        {
          id: 'platforma',
          title: '1. Kush jemi dhe si funksionon tregu',
          paras: [
            'BeeD Energy është një treg online që drejtohet nga BeeD Consulting sh.p.k., NIPT M41722050A, me seli në Tiranë, e regjistruar në Qendrën Kombëtare të Biznesit më 22 maj 2024. [Adresa e plotë e selisë, emaili dhe telefoni.]',
            'Produktet në BeeD Energy i shesin shitës të pavarur: furnitorë, instalues, prodhues dhe kompani ndërtimi. Kontrata e shitjes lidhet ndërmjet jush dhe shitësit. Emri, NIPT-i dhe kontaktet e shitësit shfaqen në faqen e tij dhe në porosi.',
            'BeeD Energy ruan ofertat që publikojnë shitësit. Kur na njoftoni për një ofertë të paligjshme ose mashtruese, e shqyrtojmë dhe, nëse është e paligjshme, e heqim pa vonesë (ligji 10128/2009, neni 17). Njoftimet na i dërgoni përmes faqes së kontaktit.',
          ],
        },
        {
          id: 'perdorimi',
          title: '2. Përdorimi i faqes',
          list: [
            'Faqja ofrohet në shqip dhe në anglisht. Informacioni për konsumatorin është gjithmonë në shqip.',
            'Ju lutemi jepni të dhëna të sakta në porosi, në kërkesat për ofertë dhe në mesazhe.',
            'Nuk lejohet përdorimi i faqes për përmbajtje të paligjshme, për reklama të pakërkuara ose për të ngarkuar sistemin me kërkesa automatike.',
            'Mesazhet tregtare që dërgojmë ne ose shitësit shënohen qartë si të tilla; promovimet e paguara të shitësve shënohen “Sponsorizuar”.',
          ],
        },
        {
          id: 'cmimet',
          title: '3. Çmimet',
          list: [
            'Çmimet shfaqen vetëm në lekë dhe janë përfundimtare: përfshijnë TVSH-në 20% (për shitësit e regjistruar për TVSH).',
            'Kostoja e dërgesës shfaqet në shportë, për çdo shitës, para se të porosisni.',
            'Për produktet që shiten me sasi shfaqet edhe çmimi për njësi (për m², kg, Wp ose kWh).',
            'Çmimet sipas sasisë zbatohen automatikisht kur sasia arrin pragun e treguar nga shitësi.',
          ],
        },
        {
          id: 'porosia',
          title: '4. Si bëhet një porosi',
          list: [
            'Shtoni ofertat në shportë. Në shportë mund të ndryshoni sasitë ose të hiqni produkte: këtu korrigjoni çdo gabim.',
            'Në arkë shkruani të dhënat, zgjidhni dërgesën dhe pagesën. Mënyrat e pagesës dhe kufizimet e dërgesës shfaqen që në fillim të arkës.',
            'Para porosisë shihni përmbledhjen e plotë: produktet, shitësit, dërgesën dhe totalin. Butoni i fundit tregon qartë se porosia përfshin detyrimin për të paguar.',
            'Pas porosisë hapet faqja e porosisë me një lidhje private. [Konfirmimi me email, me këto kushte dhe formularin e heqjes dorë, do të aktivizohet para nisjes.]',
            'Çdo shitës e dërgon pjesën e vet të porosisë si paketë më vete.',
          ],
        },
        {
          id: 'pagesat',
          title: '5. Pagesat',
          list: [
            'Pagesë në dorëzim, deri në kufirin e treguar në arkë.',
            'Transfertë bankare, me të dhënat që shfaqen në faqen e porosisë.',
            'Kartë debiti ose krediti përmes POK (RPAY sh.p.k., institucion i parasë elektronike i licencuar nga Banka e Shqipërisë), me 3-D Secure.',
            'Nuk shtohet asnjë tarifë për mënyrën e pagesës mbi koston reale (ligji 9902/2008, neni 37/11).',
            'Faturën e fiskalizuar (me NIVF, NSLF dhe kod QR) e lëshon shitësi. Për pagesat me kartë fatura mund t’ju dërgohet me email si PDF; për bizneset që paguajnë me transfertë, shitësi lëshon faturë elektronike.',
          ],
        },
        {
          id: 'dergesa',
          title: '6. Dërgesa',
          list: [
            'Shitësi dërgon brenda afatit të shfaqur në ofertë, dhe jo më vonë se 30 ditë nga porosia, përveç kur bini dakord ndryshe (ligji 9902/2008, neni 37/10).',
            'Kostoja varet nga shitësi dhe nga zona e qytetit tuaj; disa shitës dërgojnë falas mbi një vlerë të caktuar.',
            'Produktet e mëdha (paleta, panele të gjata, çimento) mund të kërkojnë transport me çmim sipas kërkesës; këtë e shënon shitësi.',
            'Rreziku për produktet kalon te ju kur i merrni fizikisht në dorë (neni 37/12).',
            'Kur shitësi e lejon, mund ta tërhiqni porosinë te shitësi.',
          ],
        },
        {
          id: 'kthimet',
          title: '7. E drejta e heqjes dorë nga kontrata dhe kthimet',
          paras: [
            'Si konsumator, keni të drejtë të hiqni dorë nga kontrata brenda 14 ditëve, pa dhënë arsye (ligji 9902/2008, neni 37/1). Afati fillon ditën kur merrni produktin në dorë; për porosi të ndara, nga produkti i fundit.',
          ],
          list: [
            'Na njoftoni ose njoftoni shitësin me një deklaratë të qartë, ose me formularin model. [Formulari model sipas Aneksit I(B) të ligjit 9902/2008 do të shtohet këtu nga juristi.]',
            'Ktheni produktin brenda 14 ditëve nga njoftimi. Përgjigjeni vetëm për uljen e vlerës së produktit që vjen nga përdorimi përtej asaj që nevojitet për ta kontrolluar.',
            'Shitësi ju kthen të gjitha pagesat, përfshirë dërgesën standarde, brenda 14 ditëve nga njoftimi juaj (neni 37/5).',
            'Kush paguan kthimin: [për t’u përcaktuar nga çdo shitës dhe treguar para porosisë, përfshirë koston për produktet që nuk dërgohen me postë].',
            'Përjashtime (neni 37/8): produktet e bëra sipas specifikimeve tuaja ose qartësisht të personalizuara (p.sh. dritare me masë, materiale të prera me porosi), produktet që prishen shpejt dhe produktet e vulosura që nuk kthehen për arsye higjiene pasi hapen.',
            'Kjo e drejtë vlen për konsumatorët. Blerjet si biznes ndjekin kushtet e shitësit. [Për t’u konfirmuar nga juristi.]',
          ],
        },
        {
          id: 'garancia',
          title: '8. Garancia ligjore',
          list: [
            'Shitësi përgjigjet për çdo mospërputhje që shfaqet brenda 2 vjetëve nga dorëzimi (neni 30). Defektet që shfaqen në 6 muajt e parë konsiderohen se ekzistonin që në dorëzim.',
            'Riparimi ose zëvendësimi bëhet brenda një afati të arsyeshëm, jo më shumë se 30 ditë kalendarike (neni 31).',
            'Kur instalimi është pjesë e shitjes, një instalim i gabuar llogaritet si mospërputhje (neni 29.4).',
            'Garancia e prodhuesit, kur ka, është shtesë dhe nuk e zëvendëson garancinë ligjore.',
          ],
        },
        {
          id: 'ankesat',
          title: '9. Ankesat',
          list: [
            'Shkruajini fillimisht shitësit përmes porosisë ose bisedës së kërkesës. Nëse nuk zgjidhet, na shkruani te faqja e kontaktit.',
            'Mund t’i drejtoheni edhe Komisionit për Mbrojtjen e Konsumatorit.',
          ],
        },
        {
          id: 'shitesit',
          title: '10. Detyrimet e shitësve',
          list: [
            'Publikojnë oferta të sakta, me çmim përfundimtar në lekë me TVSH, stok dhe afat dërgese.',
            'Lëshojnë faturë të fiskalizuar për çdo shitje dhe zbatojnë të drejtën e heqjes dorë dhe garancinë ligjore.',
            'Paguajnë abonimin dhe komisionin e planit të tyre, siç shfaqen në faqen “Shit me ne”.',
            'Verifikohen me dokumentet e listuara në faqen “Shit me ne”.',
          ],
        },
        {
          id: 'ligji',
          title: '11. Ligji i zbatueshëm dhe ndryshimet',
          paras: [
            'Për këto kushte zbatohet ligji shqiptar, përfshirë ligjin 10128/2009 për tregtinë elektronike, ligjin 9902/2008 për mbrojtjen e konsumatorëve, ligjin 124/2024 për të dhënat personale dhe ligjin 50/2025 që ratifikon vendimin e CEFTA-s për tregtinë elektronike [teksti i ligjit 50/2025: për t’u verifikuar nga juristi]. [Gjykata kompetente: për t’u përcaktuar nga juristi.]',
            'Kur i ndryshojmë këto kushte, publikojmë datën e versionit të ri. Porositë e bëra më parë ndjekin kushtet e asaj dite.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Politika e privatësisë (draft)',
      description: 'Si i përdor BeeD Energy të dhënat personale sipas ligjit 124/2024: çfarë mbledhim, pse, me kë i ndajmë, sa i ruajmë, cookies dhe të drejtat tuaja.',
      eyebrow: 'Ligjore',
      h1: 'Politika e privatësisë',
      draftTitle: 'Draft për t’u rishikuar',
      draft: 'Ky tekst është një draft i përgatitur nga burime publike (ligji 124/2024 dhe ligjet e listuara në fund) dhe duhet rishikuar nga një jurist para nisjes. Nuk është këshillë ligjore. Pjesët në [kllapa katrore] mungojnë ende.',
      updated: 'Draft i 23 tetorit 2026',
      toc: 'Përmbajtja',
      sources: 'Ligjet mbi të cilat bazohet ky draft',
      lawLinks: LAWS_SQ,
      sections: [
        {
          id: 'kontrolluesi',
          title: '1. Kush i përpunon të dhënat',
          paras: [
            'Kontrolluesi është BeeD Consulting sh.p.k., NIPT M41722050A, Tiranë. [Adresa dhe emaili për çështjet e privatësisë.] [Nëse caktohet një nëpunës për mbrojtjen e të dhënave (neni 33), emri dhe kontakti i tij.]',
            'Kur porosisni ose kërkoni ofertë, shitësi që ju shërben bëhet edhe ai kontrollues për të dhënat që i duhen për shitjen.',
          ],
        },
        {
          id: 'te-dhenat',
          title: '2. Çfarë të dhënash mbledhim',
          list: [
            'Porositë: emri, telefoni, emaili, qyteti, adresa, shënimet; për bizneset kompania dhe NIPT-i.',
            'Kërkesat për ofertë: të njëjtat të dhëna kontakti, përshkrimi i projektit, buxheti nëse e jepni, dhe mesazhet e bisedës.',
            'Aplikimet e shitësve: emri i biznesit, NIPT-i, personi i kontaktit, telefoni, emaili dhe mesazhi.',
            'Mesazhet e kontaktit dhe njoftimet për çmimin: emri, emaili ose telefoni dhe teksti.',
            'Të dhëna teknike: adresa IP mbahet përkohësisht në kujtesën e serverit për të kufizuar dërgimet e shumta të formularëve; nuk ruhet në bazën e të dhënave.',
          ],
        },
        {
          id: 'qellimet',
          title: '3. Pse i përdorim dhe me çfarë baze ligjore',
          list: [
            'Për të kryer porosinë ose kërkesën tuaj: baza është kontrata (neni 7).',
            'Për faturat dhe kontabilitetin: detyrim ligjor.',
            'Për sigurinë e faqes dhe parandalimin e abuzimit: interes legjitim.',
            'Për email ose SMS marketingu: vetëm me pëlqimin tuaj të veçantë, të dhënë në një kuti që nuk është e shënuar paraprakisht. Pëlqimin mund ta tërhiqni kur të doni. Sot nuk dërgojmë mesazhe marketingu.',
          ],
        },
        {
          id: 'ndarja',
          title: '4. Me kë i ndajmë',
          list: [
            'Me shitësin që përmbush porosinë ose që i përgjigjet kërkesës suaj, vetëm të dhënat që i duhen.',
            'Me korrierin që dërgon paketën: emri, telefoni dhe adresa.',
            'Me ofruesin e pagesave me kartë, kur paguani me kartë. Të dhënat e kartës i futni te faqja e ofruesit; ne nuk i shohim.',
            'Me administratën tatimore, përmes faturës së fiskalizuar të shitësit.',
            'Nuk i shesim të dhënat tuaja. [Vendi ku ndodhen serverët dhe çdo transferim jashtë Shqipërisë: për t’u konfirmuar para nisjes.]',
          ],
        },
        {
          id: 'ruajtja',
          title: '5. Sa kohë i ruajmë',
          paras: ['[Afatet e ruajtjes për çdo lloj të dhëne: për t’u përcaktuar nga juristi dhe kontabilisti, duke respektuar afatet e ruajtjes së dokumenteve tatimore.]'],
        },
        {
          id: 'cookies',
          title: '6. Cookies dhe ruajtja në shfletues',
          paras: ['Përdorim vetëm cookies të domosdoshme për funksionimin e faqes:'],
          list: [
            'beed_cart: përmbajtja e shportës (30 ditë).',
            'beed_cmp: produktet që po krahasoni.',
            'beed_city: qyteti i dërgesës që zgjodhët, që shporta dhe arka ta kenë gati (30 ditë).',
            'Sesioni i panelit të administrimit, vetëm për shitësit dhe administratorët që hyjnë.',
            'beed-motion në ruajtjen lokale të shfletuesit: nëse keni ndezur “Kursim energjie”.',
          ],
          after: ['Nuk përdorim cookies analitike apo reklamash. Nëse i shtojmë, do të ngarkohen vetëm pasi t’i pranoni në një banderolë ku “Prano të gjitha” dhe “Refuzo” kanë të njëjtën peshë.'],
        },
        {
          id: 'te-drejtat',
          title: '7. Të drejtat tuaja',
          list: [
            'Të shihni të dhënat që kemi për ju, t’i korrigjoni ose t’i fshini.',
            'Të kufizoni përpunimin ose të merrni të dhënat në një format të lexueshëm.',
            'Të kundërshtoni përpunimin, sidomos për marketing të drejtpërdrejtë, në çdo kohë (neni 19.2).',
            'Të tërhiqni pëlqimin, pa prekur përpunimin e bërë më parë.',
            'Të ankoheni te Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale (idp.al).',
          ],
        },
        {
          id: 'femijet',
          title: '8. Të miturit',
          paras: ['Pëlqimi për shërbime online është i vlefshëm nga mosha 16 vjeç. Nën këtë moshë duhet pëlqimi i prindit (neni 8.6).'],
        },
        {
          id: 'siguria',
          title: '9. Siguria',
          paras: [
            'Faqja përdor lidhje të koduar (HTTPS). Lidhjet e porosive dhe të kërkesave kanë një kod të rastësishëm që nuk merret me mend. Seancat e administrimit ruhen si hash.',
            'Nëse ndodh një shkelje e sigurisë së të dhënave, njoftojmë Komisionerin brenda 72 orëve (neni 29.1) dhe ju, kur rreziku për ju është i lartë.',
          ],
        },
        {
          id: 'ndryshimet',
          title: '10. Ndryshimet',
          paras: ['Kur e ndryshojmë këtë politikë, publikojmë datën e versionit të ri në krye të faqes.'],
        },
      ],
    },
  },
  en: {
    operator: 'BeeD Consulting sh.p.k. · NIPT M41722050A · Tirana',
    contactSoon: '[registered address, email and phone: coming soon]',
    terms: {
      title: 'Terms of use and purchase (draft)',
      description: 'BeeD Energy terms: the role of the platform and sellers, prices, ordering, payments, delivery, the right of withdrawal, the legal guarantee and complaints.',
      eyebrow: 'Legal',
      h1: 'Terms of use',
      draftTitle: 'Draft for review',
      draft: 'This text is a draft prepared from public sources (the laws listed at the end) and must be reviewed by a lawyer before the marketplace launches. It is not legal advice. Parts in [square brackets] are still missing. The Albanian version is the one consumers rely on.',
      updated: 'Draft of 23 October 2026',
      toc: 'Contents',
      sources: 'The laws this draft is based on',
      lawLinks: LAWS_EN,
      sections: [
        {
          id: 'platforma',
          title: '1. Who we are and how the marketplace works',
          paras: [
            'BeeD Energy is an online marketplace run by BeeD Consulting sh.p.k., NIPT M41722050A, based in Tirana, registered with the National Business Centre on 22 May 2024. [Full registered address, email and phone.]',
            'Products on BeeD Energy are sold by independent sellers: suppliers, installers, manufacturers and construction companies. The sales contract is between you and the seller. The seller’s name, NIPT and contacts are shown on its page and on the order.',
            'BeeD Energy hosts the offers sellers publish. When you tell us about an unlawful or misleading offer, we review it and, if it is unlawful, remove it without delay (Law 10128/2009, Art. 17). Send your notices to us through the contact page.',
          ],
        },
        {
          id: 'perdorimi',
          title: '2. Using the site',
          list: [
            'The site is offered in Albanian and English. Consumer information is always available in Albanian.',
            'Please give accurate details in orders, quote requests and messages.',
            'The site may not be used for unlawful content, unsolicited advertising or loading the system with automated requests.',
            'Commercial messages sent by us or by sellers are clearly marked as such; sellers’ paid promotions are marked “Sponsored”.',
          ],
        },
        {
          id: 'cmimet',
          title: '3. Prices',
          list: [
            'Prices are shown only in lekë and are final: they include 20% VAT (for VAT-registered sellers).',
            'The delivery cost is shown in the basket, per seller, before you order.',
            'Products sold by quantity also show a unit price (per m², kg, Wp or kWh).',
            'Volume prices apply automatically when the quantity reaches the seller’s threshold.',
          ],
        },
        {
          id: 'porosia',
          title: '4. How an order is made',
          list: [
            'Add offers to the basket. In the basket you can change quantities or remove products: this is where you correct any mistake.',
            'At checkout you enter your details and choose delivery and payment. Payment methods and delivery restrictions are shown at the start of checkout.',
            'Before ordering you see the full summary: products, sellers, delivery and total. The final button says clearly that the order involves an obligation to pay.',
            'After ordering, the order page opens with a private link. [Email confirmation, with these terms and the withdrawal form, will be switched on before launch.]',
            'Each seller ships its part of the order as its own parcel.',
          ],
        },
        {
          id: 'pagesat',
          title: '5. Payments',
          list: [
            'Cash on delivery, up to the limit shown at checkout.',
            'Bank transfer, with the details shown on the order page.',
            'Debit or credit card through POK (RPAY sh.p.k., an electronic money institution licensed by the Bank of Albania), with 3-D Secure.',
            'No fee is added for a payment method beyond its real cost (Law 9902/2008, Art. 37/11).',
            'The fiscalised invoice (with NIVF, NSLF and QR code) is issued by the seller. For card payments it can be emailed to you as a PDF; for businesses paying by transfer, the seller issues an electronic invoice.',
          ],
        },
        {
          id: 'dergesa',
          title: '6. Delivery',
          list: [
            'The seller ships within the time shown in the offer, and no later than 30 days after the order unless you agree otherwise (Law 9902/2008, Art. 37/10).',
            'The cost depends on the seller and on your city’s zone; some sellers deliver free above a set amount.',
            'Large goods (pallets, long panels, cement) may need freight priced on request; the seller says so.',
            'The risk passes to you when you physically take the goods (Art. 37/12).',
            'Where the seller allows it, you can collect the order from the seller.',
          ],
        },
        {
          id: 'kthimet',
          title: '7. The right of withdrawal and returns',
          paras: [
            'As a consumer, you may withdraw from the contract within 14 days without giving a reason (Law 9902/2008, Art. 37/1). The period starts on the day you take the goods; for split deliveries, from the last item.',
          ],
          list: [
            'Tell us or the seller with a clear statement, or with the model form. [The model form of Annex I(B) of Law 9902/2008 will be added here by the lawyer.]',
            'Return the goods within 14 days of your notice. You are liable only for loss of value from handling beyond what is needed to inspect them.',
            'The seller refunds every payment, including standard delivery, within 14 days of your notice (Art. 37/5).',
            'Who pays for the return: [to be set by each seller and shown before ordering, including the cost for goods that cannot go by post].',
            'Exceptions (Art. 37/8): goods made to your specifications or clearly personalised (e.g. made-to-measure windows, materials cut to order), goods that spoil quickly, and sealed goods not suitable for return for hygiene reasons once opened.',
            'This right is for consumers. Purchases as a business follow the seller’s terms. [To be confirmed by the lawyer.]',
          ],
        },
        {
          id: 'garancia',
          title: '8. Legal guarantee',
          list: [
            'The seller is liable for any lack of conformity that appears within 2 years of delivery (Art. 30). Defects appearing in the first 6 months are presumed to have existed at delivery.',
            'Repair or replacement happens within a reasonable time, no more than 30 calendar days (Art. 31).',
            'When installation is part of the sale, faulty installation counts as a lack of conformity (Art. 29.4).',
            'A manufacturer’s warranty, where there is one, is in addition to the legal guarantee and does not replace it.',
          ],
        },
        {
          id: 'ankesat',
          title: '9. Complaints',
          list: [
            'Write to the seller first, through the order or the quote thread. If it is not resolved, write to us through the contact page.',
            'You can also turn to the Consumer Protection Commission.',
          ],
        },
        {
          id: 'shitesit',
          title: '10. Sellers’ obligations',
          list: [
            'Publish accurate offers with a final price in lekë incl. VAT, stock and delivery time.',
            'Issue a fiscalised invoice for every sale and honour the right of withdrawal and the legal guarantee.',
            'Pay their plan’s subscription and commission, as shown on the “Sell with us” page.',
            'Be verified with the documents listed on the “Sell with us” page.',
          ],
        },
        {
          id: 'ligji',
          title: '11. Applicable law and changes',
          paras: [
            'These terms are governed by Albanian law, including Law 10128/2009 on electronic commerce, Law 9902/2008 on consumer protection, Law 124/2024 on personal data and Law 50/2025 ratifying the CEFTA decision on electronic commerce [the text of Law 50/2025: to be checked by the lawyer]. [Competent court: to be set by the lawyer.]',
            'When we change these terms, we publish the date of the new version. Orders placed earlier follow the terms of that day.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy policy (draft)',
      description: 'How BeeD Energy uses personal data under Law 124/2024: what we collect, why, who we share it with, how long we keep it, cookies and your rights.',
      eyebrow: 'Legal',
      h1: 'Privacy policy',
      draftTitle: 'Draft for review',
      draft: 'This text is a draft prepared from public sources (Law 124/2024 and the laws listed at the end) and must be reviewed by a lawyer before launch. It is not legal advice. Parts in [square brackets] are still missing.',
      updated: 'Draft of 23 October 2026',
      toc: 'Contents',
      sources: 'The laws this draft is based on',
      lawLinks: LAWS_EN,
      sections: [
        {
          id: 'kontrolluesi',
          title: '1. Who processes the data',
          paras: [
            'The controller is BeeD Consulting sh.p.k., NIPT M41722050A, Tirana. [Address and email for privacy questions.] [If a data protection officer is appointed (Art. 33), their name and contact.]',
            'When you order or request a quote, the seller serving you also becomes a controller for the data it needs for the sale.',
          ],
        },
        {
          id: 'te-dhenat',
          title: '2. What data we collect',
          list: [
            'Orders: name, phone, email, city, address, notes; for businesses the company and NIPT.',
            'Quote requests: the same contact details, the project description, the budget if you give one, and the thread’s messages.',
            'Seller applications: business name, NIPT, contact person, phone, email and message.',
            'Contact messages and price alerts: name, email or phone and the text.',
            'Technical data: the IP address is held briefly in the server’s memory to limit repeated form posts; it is not stored in the database.',
          ],
        },
        {
          id: 'qellimet',
          title: '3. Why we use it and on what legal basis',
          list: [
            'To carry out your order or request: the basis is the contract (Art. 7).',
            'For invoices and accounting: legal obligation.',
            'For site security and abuse prevention: legitimate interest.',
            'For marketing email or SMS: only with your separate consent, given in a box that is not ticked in advance. You can withdraw it at any time. Today we send no marketing messages.',
          ],
        },
        {
          id: 'ndarja',
          title: '4. Who we share it with',
          list: [
            'The seller fulfilling your order or answering your request, only the data it needs.',
            'The courier delivering the parcel: name, phone and address.',
            'The card payment provider, when you pay by card. You enter card details on the provider’s page; we never see them.',
            'The tax administration, through the seller’s fiscalised invoice.',
            'We do not sell your data. [Server location and any transfer outside Albania: to be confirmed before launch.]',
          ],
        },
        {
          id: 'ruajtja',
          title: '5. How long we keep it',
          paras: ['[Retention periods for each kind of data: to be set by the lawyer and accountant, respecting the retention periods for tax documents.]'],
        },
        {
          id: 'cookies',
          title: '6. Cookies and browser storage',
          paras: ['We use only cookies the site needs to work:'],
          list: [
            'beed_cart: the basket’s contents (30 days).',
            'beed_cmp: the products you are comparing.',
            'beed_city: the delivery city you chose, so the basket and checkout start with it (30 days).',
            'The admin panel session, only for sellers and administrators who sign in.',
            'beed-motion in the browser’s local storage: whether you switched on “Energy saving”.',
          ],
          after: ['We use no analytics or advertising cookies. If we add any, they will load only after you accept them in a banner where “Accept all” and “Reject” carry equal weight.'],
        },
        {
          id: 'te-drejtat',
          title: '7. Your rights',
          list: [
            'To see the data we hold about you, correct it or erase it.',
            'To restrict processing or receive your data in a readable format.',
            'To object to processing, especially for direct marketing, at any time (Art. 19.2).',
            'To withdraw consent, without affecting earlier processing.',
            'To complain to the Commissioner for the Right to Information and Personal Data Protection (idp.al).',
          ],
        },
        {
          id: 'femijet',
          title: '8. Minors',
          paras: ['Consent for online services is valid from age 16. Below that age a parent must consent (Art. 8.6).'],
        },
        {
          id: 'siguria',
          title: '9. Security',
          paras: [
            'The site uses an encrypted connection (HTTPS). Order and request links carry a random code that cannot be guessed. Admin sessions are stored hashed.',
            'If a personal data breach happens, we notify the Commissioner within 72 hours (Art. 29.1), and you, when the risk to you is high.',
          ],
        },
        {
          id: 'ndryshimet',
          title: '10. Changes',
          paras: ['When we change this policy, we publish the date of the new version at the top of the page.'],
        },
      ],
    },
  },
};
