# BeeD Energy copy review: proofreading and fact-check

Nothing in the project was edited. I read the glossary, all five research files and every copy file you listed. I also read `src/lib/checkout.ts` and `src/lib/solar.ts`, because both put text or figures on screen. Line numbers are from the files as read on 2026-10-23.

**Most urgent (must):**
1. **Albanian on English pages.** The source labels in `story.ts` are Albanian-only strings ("PBB", "Raporti vjetor", "f. 42"), and `Home.astro` shows them on the English home page too.
2. **Unsupported energy claims on the home page:**
   - The "0 lekë" surplus fact is stated as the rule in force, which is stronger than the research supports.
   - The "19:00–23:00 … after sunset" fact is wrong: those peak hours don't apply to households, and the sun is still up at 19:00 for most of that period.
   - "500 kW" is missing "up to".
3. **Calculator:** panel ageing is set to 0.4%/yr, but the research gives 0.5%. The number is also in the code (`src/lib/solar.ts:30`). "Pagesa e investimit" is the wrong term for payback, and the English page title has a different meaning from the Albanian one.
4. **Checkout:** the page says "three steps" but has four. The English status "Paid on delivery" reads as already paid. The privacy line says data goes "only to sellers", which contradicts the privacy policy.
5. **Grammar:** "T'i kundërshtoni përpunimit", "i fut" (wrong register), "materialet … që ju tepron". In terms §7 the Albanian says "dëmtimin" (damage) where the law, and the English text, mean loss of value.
6. **Legal gaps before launch:**
   - No registered address, email or phone.
   - No model withdrawal form.
   - Return costs not stated.
   - Email confirmation not switched on.
   - The terms promise a unit price per kg, but no category has one (cement is sold by the bag).
   - Bank transfers go to BeeD while the seller issues the invoice. This payment model isn't in the research.

---

## src/i18n/common.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 21 footer.operator | Operuar nga BeeD Consulting sh.p.k. · NIPT … · Tiranë | Tregu drejtohet nga BeeD Consulting sh.p.k. · NIPT … · [adresa] · [email] · [telefon] | "Operuar nga" copies "operated by". Law 10128 art. 7 also needs the registered address and an email address; the research says the client must supply them. | should (wording) / must (missing details) |
| 22 footer.prices | …përfshijnë TVSH-në 20%. | …përfshijnë TVSH-në 20% (për shitësit e regjistruar për TVSH). | Sellers under the ALL 10 million turnover threshold charge no VAT (research D1), and the seller check collects "statusi i TVSH-së". | should |
| 12 groups.efficiency | Eficiencë | Efikasitet | The glossary says to pick one form. The spec labels use "Efikasiteti", and home.ts uses "eficiente". | should |
| 15 tray.full | Mund të krahasoni deri në 4 produkte. | …4 produkte. Hiqni një për të shtuar këtë. | The message should say how to fix it (glossary §16.4). The English line 40 needs the same: "Remove one to add this." | should |
| 17 loader.loading | Duke ngarkuar | Duke u ngarkuar | Glossary §15. | should |
| 27 dock.categories | Kategori | Kategoritë | The nav (line 8) uses "Kategoritë". | should |
| 40 EN tray.reset | …only products from one category compare. | Comparison restarted: only products from the same category can be compared. | "Compare" can't be used without an object here. | should |

## src/i18n/home.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 26 windows | …midis brendisë dhe jashtë | …midis brenda dhe jashtë | It pairs a noun ("brendisë") with an adverb ("jashtë"). | must |
| 28 heat | pompa më eficiente … (ajër 7 °C, ujë 35 °C) | pompa më efikase … (ajri 7 °C, uji 35 °C) | Same efficiency term as the specs. The labels need the definite form. | should |
| 11 quote | Kërko ofertë për projektin | Kërko ofertë për projektin tuaj | "Projektin" is definite but no project has been mentioned. | should |
| 40 manifesto | …blihen ende me telefonata, oferta në letër dhe çmime që nuk krahasohen dot. (EN 109 "at prices nobody can compare") | …blihen shpesh me telefonata dhe oferta në letër, me çmime të vështira për t'u krahasuar. | The research has no data on how people buy. It only says "we found no specialised platform". | should |
| 53 s[1] | Listoni ofertat … mbi produkte me fletë teknike | Publikoni ofertat … për produkte me fletë teknike | "Listoni" and "mbi" are calques. | should |
| 54 s[2] / EN 123 | Komision vetëm për shitjet. / Commission on sales only. | Abonim mujor dhe komision për shitjet e kryera. / A monthly plan plus commission on completed sales. | "Only" contradicts the subscription plans (sellBand, the Sell page, settings.json). | should |
| EN 121 s[0] | contractors | construction companies | The footer and about text in English say "construction companies". | should |

## src/content/story.ts (shown on the home page)

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 17–23, 99–103 source labels | 'INSTAT, PBB 2025', 'ERE, Raporti vjetor 2025, f. 42', 'Ligji 24/2023, neni 20', 'INSTAT, TIK 2025'… (one string each) | Make them `Record<Lang,string>`. EN: "INSTAT, GDP 2025", "ERE, Annual Report 2025, p. 42", "Law 24/2023, Art. 20", "INSTAT, ICT survey 2025"… | `Home.astro` lines 114, 116 and 223 show these on the English page, so Albanian appears there. pages.ts already has `srcEn`. | must |
| 21 INSTR_3 | ERE, Udhëzimi 3/2019, pika 17 | Ministria e Infrastrukturës dhe Energjisë, Udhëzimi 3/2019, pika 17 | The Ministry issued the instruction; ERE only hosts the file (research UDH-3/2019). pages.ts line 238 already has it right. | must |
| 71 layer 5 fact "0 lekë" | …merr vetëprodhuesi … sipas rregullit në fuqi: ajo kalon te furnizuesi pa pagesë. Rregullat e reja të majit 2026 ende nuk kanë publikuar çmim. Prandaj vlen ta ruani. | SQ: "është vlera që i japim energjisë që tepron mbi konsumin e muajit. Udhëzimi 3/2019 (pika 17) e kalonte tepricën te furnizuesi pa pagesë; për rregullat e net billing të majit 2026 nuk kemi gjetur ende një çmim të publikuar. Energjia që përdorni vetë vlen sa tarifa." EN to match; remove "That is why storing it pays". | Law 24/2023 (net billing from 2024), the May 2026 rules and Law 59/2026 mean the 2019 rule may no longer apply. The research says the price was not found and should be treated as an assumption. "Not found" is not the same as "not published". "Storing it pays" isn't in the research. | must |
| 74 layer 5 extra | 19:00–23:00 · orët e pikut nga prilli në tetor, kur dielli ka perënduar / after sunset | orët e pikut (prill–tetor) për bizneset në 0,4 kV: 16,1 lekë/kWh; familjet nuk kanë tarifë pikut / peak hours (Apr–Oct) for businesses at 0.4 kV: 16.1 lekë/kWh; households have no peak price | Peak prices apply only to non-household customers (ERE-TAR2026, where households show "—"). In Tirana the sun sets after 19:00 from about April to September (general knowledge; not in the research). | must |
| 102 NUMBERS "500 kW" | mund të instalojë çdo familje ose biznes… / may be installed by any home or business | është kufiri ligjor për impiantin e një vetëprodhuesi (familje ose biznes); madhësia varet nga konsumi vjetor dhe miratohet nga OSSH. / is the legal cap for a home or business producing its own power; the size is set by yearly use and approved by the grid operator. | As written it reads as "can install 500 kW". The law sets a maximum, and Instruction 3/2019 points 4, 6 and 15 limit size by consumption. | must |
| 33 layer 1 | …e prodhimit të Shqipërisë… (EN "output") | …e prodhimit të brendshëm bruto të Shqipërisë… / of Albania's GDP | It is a share of GDP, as pages.ts line 77 says. | should |
| 33 + 36 | 8 335 appears in the fact text and again in the extra, with the GDP source | Remove the sentence from the fact text | It repeats the extra, and the number is credited to the GDP source instead of the business register. | should |
| 67 layer 5 short | Inverterë në rrjet dhe hibridë | Inverterë të lidhur me rrjetin dhe hibridë | "Në rrjet" reads as "online" (glossary §17, already fixed in categories). | should |
| 90 layer 7 | Një vit i thatë dha 4 174 GWh, një vit me shi 8 076 GWh | Një vit i thatë (2017) dha 4 174 GWh, një vit me shi (2018) 8 076 GWh | Without years it reads as recent. The source is ERE-AR2025 Table 10, not INSTAT. | should |
| 93 EN extra | against the 30-year average | below the 30-year average | Ambiguous. | should |
| 90 + 100 | 86.8% hydro (INSTAT) and "≈11%" solar (ERE) on the same page | Use one source pair | Research §1.1 says to use one pair consistently. Readers may add them up (97.8%). | should |
| 103 | …në 12 muajt e fundit. | …në 12 muajt e fundit (2025). | The data is from 2025; pages.ts line 93 already adds the year. | should |
| 62, 33, etc. | në fund të 2025 / në 2025 | në fund të vitit 2025 / në vitin 2025 | Standard Albanian form. | should |

## src/i18n/pages.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 14 PROJECTS.battery | Bateri ruajtëse | Bateri për ruajtjen e energjisë | Glossary marks "ruajtëse" as must. Categories already fixed. | must |
| 206 calc.kitIncomplete | …pagesa e investimit nuk llogaritet pa kitin e plotë. | Disa pjesë nuk kanë ende ofertë, ndaj periudha e shlyerjes nuk llogaritet. | "Pagesa" means payment, not payback (the label is "Shlyerja e investimit"). | must |
| 221, 230 (+ EN 599, 608) | me rënie 0,4% në vit / 0.4% a year | 0,5% / 0.5% | The research gives 0.5%/yr (Jordan & Kurtz; tariffs-prices §4–5). 0.4% has no source. Also change `src/lib/solar.ts:30`. | must |
| 228 how[3] (+ EN 606) | Teprica në rrjet paguhet 0 lekë: … | Tepricën në rrjet e llogarisim me 0 lekë: sipas pikës 17 të Udhëzimit 3/2019 … Për rregullat e net billing (maj 2026) nuk kemi gjetur ende çmim. / We count surplus at 0 lekë: … | Same issue as story layer 5: stated as fact when the research says it is an assumption. | must |
| 303 sell.who contractor | materialet e kantierit që ju tepron | …që ju tepërojnë | Plural subject needs a plural verb. | must |
| 310 sell.how Pagesat (+ EN 688) | Merrni vlerën e shitjeve minus komisionin e planit tuaj. | Abonimin dhe komisionin jua faturon BeeD. Faturën e fiskalizuar për blerësin e lëshoni ju. [Rrjedha e pagesave: për t'u konfirmuar.] | Saying BeeD pays sellers out is not in the research. Research D2 has BeeD invoicing sellers. See the legal section. | must |
| 284, 287 seller.th.lead / lead | Dërgohet / `${d} ditë` (EN Ships in / days) | Dorëzimi / `${d} ditë pune` (EN Delivery / working days) | Sellers enter "ditë pune" (admin line 464), but buyers see calendar days. Also aligns with shop line 23 and checkout line 34. | must |
| 529 EN calc.title | Solar calculator: what a roof that produces costs | Solar calculator: what your roof would make | Different meaning from the Albanian. | must |
| 461 contact.soon | do të publikohet së shpejti | (fill in) | Law 10128 art. 7 and 9902 art. 36 require an email and address. | must before launch |
| 225 how[0] | …me kënd optimal… | …me kënd optimal, montim i lirë; në çati pa ajrim ose të sheshta prodhimi është 4–16% më i ulët | Research: Tiranë 30° roof-mounted is −4.2%, flat 10° east-west is about −16%. "Sa prodhon çatia juaj" overstates. | should |
| 191, 229 cliff / how[4] | …lekë/kWh pa TVSH… familjet me TVSH 20% | Keep, but mark "(supozim; kontrolloni faturën e OSHEE-së)" | The VAT basis for 2026 is assumed (tariffs §1a) and marked UNVERIFIED (energy §5.1). | should |
| 191 cliff | i gjithë muaji faturohet ${high} lekë/kWh | …faturohet me ${high} lekë/kWh | Missing preposition. | should |
| 192 cliffCross (+ EN 570) | kurseni më shumë se sa vetë energjia e prodhuar | kurseni më shumë se vlera e energjisë që prodhon | Compares money with energy. | should |
| 193 bizTariff | TVSH-në e rimarrin | zakonisht e rimarrin TVSH-në | Research says "normally". | should |
| 195 billGap | Nga rregulli i kufirit … e afrojmë te kufiri. | Për shkak të kufirit prej 700 kWh … faturën tuaj e afrojmë te kufiri. | "Nga rregulli" is a calque, and "e" has no clear referent. | should |
| 189 noSaving (+ EN 567) | Tarifa për këtë lidhje nuk është në cilësimet. | Kursimi nuk u llogarit: mungon tarifa për këtë lloj klienti. Na kontaktoni. | Shows internal settings to users and doesn't say what to do. | should |
| 166 calc.kind | Lidhja (EN Connection) | Lloji i klientit (EN Customer type) | The options are household and business. | should |
| 207, 225, 231, 300, 417 | Invertor / invertor / invertorin / invertorë | Inverter / inverterin / inverterë | Categories now say "Inverterë" (glossary §11), so there are two words for one thing. | should |
| 239 / 617 src.boa | Banka e Shqipërisë, kursi zyrtar i këmbimit | (remove) | The calculator shows no EUR (shop-data enforces lekë only), so the source isn't used. | should |
| 242, 262 mapDesc | …është me bakër / Pikat me bakër | …shënohet me ngjyrë bakri / Pikat me ngjyrë bakri | Unnatural. | should |
| 258 sellers.rating | `${n} vlerësime` | singular "vlerësim" when n is 1 (as in shop line 134) | Wrong for n=1 in Albanian and English. | should |
| 280 zoneNames | Zona 1 / 2 / 3 | Zona 1 · Tiranë–Durrës, Zona 2 · qendra dhe bregdeti, Zona 3 · veriu, lindja dhe jugu | Means nothing to buyers. Admin line 419 already has these labels. | should |
| 286 seller.out | Mbaroi | S'ka stok | Shop and glossary §4 use "S'ka stok". | should |
| 294, 300 | listoni ofertat | publikoni ofertat | Calque. | should |
| 302 manufacturer | pa ndërmjetës | pa rrjet shpërndarësish | The platform is itself an intermediary that takes commission. | should |
| 315 onRequest | Sipas ofertës | Me kërkesë | "Ofertë" means a seller's price. Admin line 617 says "me kërkesë". | should |
| 33 TOPICS | Një porosi e bërë / Të shes në platformë | Një porosi që kam bërë / Shitja në platformë | Unnatural. | should |
| 129, 136 NIPT | …8 shifra dhe një shkronjë, p.sh. | …8 shifra dhe një shkronjë në fund, p.sh. | Checkout (`lib/checkout.ts:31`) and glossary §14 include "në fund". | should |
| 134 err.contact | një email ose një telefon | një email ose një numër telefoni | "Telefon" alone means the device. | should |
| 138–139 err.details/body | 20 / 10 shkronja | 20 / 10 shenja | The check counts characters (the English says characters). | should |
| 152 calc.description | kursimin me tarifat ERE 2026 | kursimin me tarifat e ERE-s për 2026 | Needs the genitive with a hyphen (house style §0). | should |
| 329, 385 | brenda ditëve të punës (EN 763 "within working days") | në ditët e punës (EN "on working days") | No number of days is given. Contact uses "në ditët e punës". | should |
| 345 quote.description | shitësit e verifikuar ju dërgojnë… | shitësit e zonës ju dërgojnë… | Unverified sellers exist (demo data) and the criteria are only proposed. | should |
| 348 quote.lede | projekte që nuk mbushen me një shportë | projekte që nuk futen në një shportë | Calque. | should |
| 60, 84, 85 | 3.551, 8.335, 5.531 | 3 551, 8 335, 5 531 | story.ts and money.ts use a space. Glossary §0 says use one style. | should |
| 79 | gjysmë-përfundimtare | gjysmëpërfundimtare | Written as one word. | should |
| 101 (+ EN 102) | …në konsumin final të energjisë… | …e konsumit final bruto të energjisë… / of gross final energy consumption | Law 24/2023 art. 6 says "gross". | should |
| 413 about.mission | platformë moderne dhe të integruar tregtare | platformë tregtare moderne dhe të integruar | Adjective order. | should |
| 416 about.problem[0] | Sot një familje … duhet të telefonojë disa instalues… | Sot një familje shpesh duhet të telefonojë… | General claim not in the research. | should |
| 417 | panele çati | panele për çati | Missing preposition. | should |
| 422 about.offer[1] | Pagesa online të sigurta | (keep, but the card payment is in test mode and the provider is unconfirmed: see terms §5) | Stronger than the current state. | should |
| 436, 438 | paguajnë një plan mujor / Vendosje e promovuar | paguajnë një abonim mujor / Produkte të promovuara | Calques. Glossary §8 has "Produkt i promovuar". | should |
| 454 (+ EN 832) | Për një projekt me çmim… / For a priced project… | Nëse doni çmim për një projekt, … / If you want a price for a project, … | Unclear in both languages. | should |
| 7–8 KINDS EN, 623 | Contractor / contractors | Construction company | The footer, home page and admin line 1011 say "construction company". | should |
| 786 EN about.facts | Seat | Registered office | Natural English. | should |

## src/i18n/shop.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 23 (+ EN 240) | Afati: ${d} ditë | Dorëzimi: ${d} ditë pune | Same lead-time problem as pages.ts lines 284/287. | must |
| 32, 213 | invertorë | inverterë | Inconsistent with the category name. | should |
| 38 | Eficiencë | Efikasitet | Same as common line 12. | should |
| 60, 161 | Nga ${lo} deri ${hi} | Nga ${lo} deri në ${hi} | Standard form. | should |
| 123 | Kryesoret | Të dhënat kryesore | Unnatural as a heading. | should |
| 125, 129 | totalit të dorëzuar / Totali i dorëzuar | totalit me dërgesë / Totali me dërgesë | Calque. Line 179 already says "Me dërgesë". | should |
| 169 | Do t'ju shkruajmë | Do t’ju shkruajmë | Straight apostrophe; everywhere else uses ’. | should |
| 221 | Kërkimi nuk e bën dallimin për ë dhe ç. | Mund të shkruani edhe pa ë dhe ç. | Clumsy. | should |
| 223 | Asnjë produkt për “${q}”. | Nuk u gjet asnjë produkt për “${q}”. | Glossary §16.9. | should |
| EN 273, 382 | Price (ALL) / target price (ALL) | Price (lekë) | English uses "lekë" elsewhere (calculator, budget, footer). Pick one. | should |
| EN 423 | Only products of one category compare… | Only products from the same category can be compared… | Grammar. | should |

## src/i18n/checkout.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 82 co.intro (+ EN 282) | Një faqe, tre hapa. | Një faqe, katër hapa. | Checkout.astro has sections 01–04. | must |
| 143 co.privacy (+ EN 343) | Të dhënat tuaja u jepen vetëm shitësve të kësaj porosie. | …u jepen shitësve të kësaj porosie dhe, kur duhet, korrierit dhe ofruesit të pagesës me kartë. | Contradicts privacy §4 (courier, card provider and tax office). | must |
| EN 212 payStatus.cod | Paid on delivery | Pay on delivery | Reads as already paid. The Albanian "Paguhet në dorëzim" is right. | must |
| 34 cart.lead | Koha e dorëzimit: ${n} ditë | …${n} ditë pune | Sellers enter working days. | must |
| 82 (+ EN) | Dërgojmë vetëm brenda Shqipërisë. | Shitësit dërgojnë vetëm brenda Shqipërisë. | The contract is with the seller (terms §1). | should |
| 10 status.paid | Pagesa u krye | E paguar | Every other status is an adjective. Admin line 159 uses a third wording ("Pagesa u mor"). | should |
| 13 method.cod | Pagesë me para në dorë në dorëzim | Pagesë në dorëzim | "Në dorë në dorëzim" repeats itself (glossary §6). | should |
| 20 sum.vat | nga të cilat TVSH 20% | Përfshirë TVSH-në 20% | Glossary §4. Admin line 203 has a third wording. | should |
| 113 bankHint | Porosia nis kur mbërrin pagesa. | Porosia dërgohet pasi të mbërrijë pagesa. | "Nis" is vague. | should |
| 114–115 | formularin e sigurt të POK … Portë prove | …të POK-ut … Mënyrë prove | Abbreviation takes a hyphen (house style). "Portë" copies "gateway". | should |
| 124 legal.delivery | …brenda 30 ditëve, përveç kur bihemi dakord ndryshe. | …brenda 30 ditëve nga porosia, përveç kur bini dakord ndryshe me shitësin. | Must match terms §6. The contract is with the seller, and the law counts from the contract. | should |
| 184 invoice.seller | Faturën tatimore | Faturën e fiskalizuar | Terms and glossary §6 say "e fiskalizuar"; the Sell page says "fiskale". Three terms for one thing. | should |

Related, in `src/lib/checkout.ts` (outside your list but shown on screen): English line 40, "This email address looks incomplete.", should be "Check the email address, e.g. name@example.al." It doesn't say how to fix, and the Albanian was already corrected. **should**.

## src/i18n/legal.ts

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 109 terms §7 | Përgjigjeni vetëm për dëmtimin që vjen nga përdorimi përtej asaj që duhet për ta provuar. | Përgjigjeni vetëm për uljen e vlerës së produktit që vjen nga përdorimi përtej asaj që nevojitet për ta kontrolluar. | Art. 37/6 speaks of loss of value from handling beyond inspection. "Dëmtim" (damage) changes the legal meaning and doesn't match the English "loss of value". | must |
| 201 privacy §4 | Të dhënat e kartës i fut te faqja e ofruesit | …i futni te faqja e ofruesit | Second-person singular breaks the formal "ju" register. | must |
| 229 privacy §7 | T’i kundërshtoni përpunimit… | Të kundërshtoni përpunimin… | "Kundërshtoj" takes the accusative. | must |
| 64 terms §3 (+ EN 295) | çmimi për njësi (për m², kg, Wp ose kWh) | Either add lekë/kg for cement and lekë/m for cable, or remove "kg". | No category has a kg unit price (cement `unit_basis: null`). Law 9902 art. 9 requires a unit price for packaged goods. | must |
| 43, 170, 26 | [Adresa e plotë e selisë, emaili dhe telefoni.] | (fill in) | Law 10128 art. 7; 9902 art. 36. | must before launch |
| 75 | [Konfirmimi me email … do të aktivizohet] | (switch on) | 9902 art. 37.7; 10128 art. 14. | must before launch |
| 108 | [Formulari model … do të shtohet] | (add Annex I(B)) | Art. 36. If it's missing, art. 37/2 extends the withdrawal period by up to 12 months. | must before launch |
| 111 | Kush paguan kthimin: [për t'u përcaktuar…] | (fill in) | Art. 36 requires it before the order. | must before launch |
| 43 | i operuar nga | që drejtohet nga | Calque. | should |
| 45 (+ EN 276) | …e shqyrtojmë dhe e heqim pa vonesë… Njoftimet dërgohen te faqja e kontaktit. | …e shqyrtojmë dhe, nëse është e paligjshme, e heqim pa vonesë… Njoftimet na i dërgoni përmes faqes së kontaktit. | Art. 17 requires removing illegal content, not every reported offer. The passive form is awkward. | should |
| 55 | Mesazhet tregtare që marrim ose dërgojmë… | Mesazhet tregtare që dërgojmë ne ose shitësit… | We can't label messages we receive. Doesn't match the English. | should |
| 74 | porosia ka detyrim pagese | porosia përfshin detyrimin për të paguar | Smoother. | should |
| 85 (+ EN 316) | [Ofruesi përfundimtar do të konfirmohet] | Name POK (RPAY sh.p.k., licensed e-money institution) or remove "POK" from checkout | Checkout already names POK. | should |
| 96 | transport me ofertë | transport me çmim sipas kërkesës | Calque. | should |
| 131 (+ EN) | Komisionit për Mbrojtjen e Konsumatorëve | Komisionit për Mbrojtjen e Konsumatorit | The glossary §13 form is sourced to KMK's own leaflet (the commerce file has a third form). Confirm the official name. | should |
| 148 | ligjin 50/2025… | (keep, mark for the lawyer) | Only the PwC summary was read (research C1). | should |
| 192 (+ EN 423) | pëlqimin tuaj të veçantë, të pashënuar paraprakisht | …të dhënë në një kuti që nuk është e shënuar paraprakisht | Consent can't be "unticked"; the box can. | should |
| 221 | “Pranoj” dhe “Refuzoj” | “Prano të gjitha” dhe “Refuzo” | Glossary §13. | should |
| 243 vs EN 474 | ruhen të koduara / stored hashed | Make both say the same (e.g. "ruhen si hash") | The two languages differ. | should |

## scripts/catalog/categories.mjs

Most of the glossary §17 corrections have been applied. These remain:

| Line | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 190–201 cement (and 103 accessories) | `unit_basis: null` | `unit_basis: 'bag_kg'` → `lekë/kg`; cable → `lekë/m` | Law 9902 art. 9 unit price for packaged goods; terms §3 promises kg. | must |
| 40 EN | whether a battery fits | whether they can take a battery | Same meaning as the Albanian. | should |
| 77 EN | with a Type 2 connection | with a Type 2 connector | The Albanian was corrected to "lidhës". | should |
| 106 EN | Connectors, cable and DC switches… | MC4 connectors, solar cable and DC isolators… | Same meaning as the Albanian. | should |
| 142 | Zhurma minimale e njësisë së brendshme | Niveli minimal i zhurmës (njësia e brendshme) | Neptun uses "Niveli i zhurmës" (glossary §11). | should |
| 149 | …të zakonshme në çatitë shqiptare / a common sight | (remove, or source it) | Research §8 found no current count. | should |

## scripts/catalog/demo-sellers.mjs

| Line | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 5 | invertorësh | inverterësh | Term consistency. | should |
| 17 | Sisteme veshjeje termike | Sisteme termoizolimi (kapotë) | Glossary §11 and §17. | should |
| 11 EN | Building materials for the site | Building materials for building sites | Unclear. | should |
| 8 | Jugu Instalime: plan 'pro', commission_pct 8 | 7 | The Pro plan is 7% in settings.json. | should |
| 4–16 | `verified: true` on invented sellers | false, or note it | The "I verifikuar" badge appears on invented sellers while the criteria are only "proposed". | should |

## scripts/catalog/settings.json

| Line / key | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 36 bank.beneficiary | BeeD Consulting sh.p.k. | (confirm the model) | Buyers pay BeeD, but the seller issues the fiscal invoice (terms §5). The research (D2) only has BeeD invoicing sellers for commission and says to check with a tax adviser. | must (to confirm) |
| 41–47 contact | all null | (fill in) | See the legal section. | must before launch |
| 71 | Oferta pa limit | Oferta pa kufi | Calque. | should |
| 87 | Gjithçka te Pro | Gjithçka nga plani Pro | Unnatural. | should |
| 88 (+ EN) | Vendosje e promovuar / Promoted placement | Produkte të promovuara / Promoted listings | Glossary §8. | should |

## Views and components

| File:line | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| Home.astro 114, 116, 223 | `{fact.source.label}` | language-specific label | See story.ts. | must |
| Home.astro 154 | aria-label="Manifest" | {sq: 'Manifesti', en: 'Manifesto'} | Wrong in both languages. | should |
| Home.astro 202 | `{p.offer_count} oferta` | "ofertë" when the count is 1 | Agreement. | should |
| Calculator.astro 149 | Bank of Albania source link | remove | No EUR is shown. | should |
| Menu.astro 40 | p.sh. invertor hibrid… | p.sh. inverter hibrid… | Term consistency. | should |
| Header.astro 14 | aria-label 'Kryesore' | 'Navigimi kryesor' | An adjective alone. | should |
| Dock.astro 9 | 'Shpejt' / 'Quick' | 'Lidhje të shpejta' / 'Quick links' | An adverb alone. | should |
| Order.astro 20 vs 23 | "ose ka skaduar" vs "ose nuk është e saktë" | Use one wording | Inconsistent, and the English differs. | should |

## src/i18n/admin.ts (internal; style only)

| Line | Current | Corrected | Reason | Pri |
|---|---|---|---|---|
| 293 | I veçuar në ballinë | I veçuar në faqen kryesore | "Ballina" is a Kosovo word (glossary §1). | should |
| 10 | dashboard: 'Paneli' | 'Pasqyra' | Glossary §12. It collides with "Paneli i administrimit" and with solar panels. | should |
| 111 | Email-i | Emaili | The public pages write "emaili". | should |
| 159, 203 | Pagesa u mor / Nga ky, TVSH 20% | Match the public wording | Inconsistent with checkout. | should |
| 333, 336, 611 | L/Wp, L/kWh | lekë/Wp, lekë/kWh | Glossary §17; the categories were already changed. | should |
| 507 | won: 'E fituar', answered: 'Me përgjigje' | 'E zgjedhur', 'Ka përgjigje' | The public thread uses different words. | should |
| EN 1011 | Construction company | (pick one English term with pages.ts) | Inconsistent. | should |

---

## Legal check (point 4)

| Requirement | Status |
|---|---|
| Withdrawal wording "e drejta e heqjes dorë nga kontrata" | **Pass** everywhere: footer, checkout line 122, terms §7, order line 195. "E drejta e tërheqjes" is not used anywhere. |
| Prices only in lekë (Law 9902 art. 9.4) | **Pass**: no EUR on public pages. The Bank of Albania source in the calculator should go. Unit price per kg is missing for cement (must). |
| Order button with obligation to pay (art. 37.2) | **Pass**: "Porosit me detyrim pagese" / "Place order with obligation to pay". |
| Payment methods and delivery limits at the start of checkout (art. 37.3) | **Pass**, apart from the "tre hapa" error. |
| 2-year guarantee, 6-month presumption, 30-day repair (arts. 30–31) | **Pass**: checkout line 125, terms §8. |
| 14-day withdrawal, 14-day return, 14-day refund including delivery, 30-day delivery | **Pass**, except the "dëmtimin" wording in §7 (must). |
| Law 124/2024 (art. 7 lawful bases, 8.6 age 16, 19.2 objection, 29.1 72-hour breach notice, 33 data protection officer) | **Pass** on the references. Grammar fixes needed on privacy lines 201 and 229. |
| Trader identity and contacts, model withdrawal form, return costs, email confirmation | **Missing** (placeholders). Must before launch. |
| Platform vs seller role | **Inconsistent**: the terms say the contract is with the seller, but buyers pay BeeD ("Përfituesi" is BeeD) and the copy says "Dërgojmë" and "Merrni vlerën e shitjeve minus komisionin". Confirm the payment and invoicing model with the client's accountant or lawyer (research D2). |

**No invented company facts found.** Clients, awards, team and years in business don't appear. The QKB facts (NIPT, 22 May 2024, Tirana, SHPK) match `company.md`. The sample sellers are labelled as samples.