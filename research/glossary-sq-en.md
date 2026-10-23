# Fjalorth shqip–anglisht / Albanian–English glossary — BeeD Energy

Read and checked: **2026-10-23**. Every term below was checked against how real Albanian sites write it. The sources are in §18 (S1…S25) and each row cites them. **UNVERIFIED** marks wording that I could not see on any sampled Albanian site. Those rows are standard Albanian, but nobody has confirmed them on a live site.

Target: **standard Albanian as written in Albania** (with ë and ç, sentence case). Kosovo sites (Gjirafa50, Foleja) were used only as secondary evidence. Their regional words are listed in §1 so that we avoid them.

---

## 0. House style (from what Albanian sites actually do)

| Rule | Detail | Evidence |
|---|---|---|
| Always write ë and ç | Neptun drops them ("Kondicionere", "Ngrohese", "Shto ne shporte") and looks careless next to ERE/OSHEE. We never drop them. | S1, S8, S9 |
| Sentence case | Use "Shto në shportë", not "Shto Në Shportë". Months and weekdays are lower case (`janar`, `e hënë`), which is already right in `src/lib/i18n.ts`. | S2, S8 |
| Formal "ju" in instructions | Use plural imperatives: "Shkruani", "Zgjidhni", "Kontrolloni". This is what Neptun FAQ, ERE and Daikin use. Short buttons can use the 2nd-person singular ("Shto", "Kërko", "Bli tani") as Vodafone and Neptun do. | S2, S6, S8, S13 |
| Currency | Plural `lekë`, singular `lek`, ISO `ALL`. Retailers abbreviate to **L** ("54,990 L" on Shpresa, "1,000L" on Neptun). ERE writes units as **lekë/kWh**. We write `lekë` in unit prices because `L` collides with litres (see §17). | S2, S5, S8 |
| Thousands | Retailers use an English comma ("10,000 Lekë", "54,990 L"). Standard Albanian uses a space and a decimal comma (`14 200 lekë`, `3,5 kW`). Pick one and use it everywhere. We recommend the Albanian style, built at build time because Chrome has no `sq` Intl data. | S2, S5 |
| Abbreviations take a hyphen before case endings | `TVSH-në`, `NIPT-i`, `MPPT-ve`, `ERE-s`. | S8, S23 ("Përfshirë TVSH-në") |

---

## 1. Albania vs Kosovo: words to avoid on an Albania-first site

| Use (Albania) | Avoid (Kosovo / regional) | Evidence |
|---|---|---|
| **Hyr** / Identifikohu | Kyçu, Kyçuni | e-Albania, Neptun and Shpresa use "Hyr" (S7, S1, S5). Gjirafa50 uses "Kyçu" (S23). |
| **Bli tani** | Blej tani | Vodafone AL uses "Bli tani" (S6). Gjirafa50 uses "Blej tani" (S23). |
| **garanci** | garancion | Neptun "Garancia normale" (S4). Gjirafa50 "me garancion" (S23). |
| energji e **rinovueshme** | e ripërtëritshme | OSHEE and Law 24/2023 "…nga Burimet e Rinovueshme" (S9). Gjirafa50 "energji të ripërtëritshme" (S23). |
| **interes** (0% interes) | kamatë | Neptun "0% interes" (S2). Gjirafa50 "pa kamatë" (S23). |
| **dërgesë / dorëzim** | liferim | Gjirafa50 "liferimi" (S23). |
| **Kreu**, **Faqja kryesore**, Kryefaqja | Ballina | None of the 11 Albanian sites sampled used "Ballina". ERE, OSHEE, Tatime and Shpresa use "Kreu". e-Albania and Vodafone eShop use "Faqja kryesore". Vodafone and Vega Solar use "Kryefaqja". |
| **bateri** (për ruajtjen e energjisë) | bateri magazinuese | Gjirafa50 "Bateri magazinuese" (S23). Vega Solar just says "Bateri" (S12). |
| **transfertë bankare** | transfer bankar | BKT "Transferta Parash" (S11). Gjirafa50 "transfer bankar" (S23). |

---

## 2. Navigation

| English | Shqip | Notes |
|---|---|---|
| Home | **Kreu** (breadcrumb), **Faqja kryesore** (link text) | See §1. Avoid "Ballina" and "Home". |
| Shop | **Dyqani** | "Dyqani online" (S23). Route `/dyqani` is fine. |
| Categories | **Kategoritë** | Shpresa, Gjirafa50 (S5, S23). |
| All products | **Të gjitha produktet** | Feminine plural agreement is correct. Vodafone's "Të gjithë produktet" is a common slip (S6). |
| Compare | **Krahaso** · page: **Krahasimi i produkteve** | "Krahaso produktet" on Neptun and Foleja (S1, S24). |
| Search | **Kërko** · placeholder: **Kërkoni produkte, marka ose kode…** | Shpresa "Kërkoni për produkte..." (S5). Daikin "Kërko" (S13). |
| Account | **Llogaria** · My account: **Llogaria ime** | Shpresa "Porositë & Llogaria" (S5). |
| Sellers | **Shitësit** | Daikin "Gjeni shitësin" (S13). |
| Sell with us | **Shit me ne** | Route `/shit-me-ne` is fine. |
| Request a quote | **Kërko ofertë** | Daikin "kërkoni ofertë", Ceresit "kërkoni një ofertë" (S13, S15). |
| Solar calculator | **Kalkulatori diellor** (alt. **Llogaritësi diellor**) | ERE "Kalkulatorë" (S8). BKT "Llogaritësi i kredisë" (S11). Both are natural. |
| About us | **Rreth nesh** | ERE, Shpresa, Vega Solar. |
| Contact | **Kontakt** · CTA: **Na kontaktoni** | Shpresa "Kontakt", Vodafone and Rockwool "Na kontaktoni". |
| FAQ | **Pyetje të shpeshta** | OSHEE "pyetje të shpeshta", ERE "Pyetjet më të shpeshta" (S9, S8). |
| Help / support | **Ndihmë** | e-Albania "Ndihmë dhe suport" (S7). |
| Language | **Shqip / English** (each name in its own language) | e-Albania's switch reads "Shqip / Anglisht" (S7). |
| Menu / Close | **Menyja / Mbyll** | ERE "Menyja e Aksesueshmërisë" (S8). |
| See more | **Shiko më shumë** | Gjirafa50, Shpresa, Vodafone. |
| Back | **Kthehu** | |

## 3. Account

| English | Shqip | Notes |
|---|---|---|
| Sign in | **Hyr** | e-Albania, Neptun, ERE, Vodafone. Never "Kyçu" (§1). |
| Register | **Regjistrohu** | e-Albania, Shpresa "Hyr / Regjistrohu". |
| Sign out | **Dil** | WooCommerce-sq uses "Dilni" (S25). |
| Password | **Fjalëkalimi** | Forgot? **Keni harruar fjalëkalimin?** (WooCommerce-sq "Harruat fjalëkalimin tuaj?", S25). ERE's "Password i harruar?" is a calque to avoid. |
| Email address | **Adresa e emailit** (label: **Email**) | WooCommerce-sq "Adresë email" (S25). Both are in use. |
| Phone | **Telefoni** / **Numri i celularit** | Shpresa checkout "Telefon" (S5). |
| Guest checkout | **Vazhdo pa llogari** | Neptun's "arkëtohuni si mysafir" is awkward (S2). |
| Delete my account | **Fshi llogarinë** | Shpresa "Fshini llogarinë tuaj" (S5). |
| Wishlist / favourites | **Të preferuarat** (or **Lista e dëshirave**) | Neptun "Shto te të preferuarat" (S1). Gjirafa50 and Foleja "Lista e dëshirave". |

## 4. Catalogue and product page

| English | Shqip | Notes |
|---|---|---|
| Product | **produkt** (m), pl. **produkte**, def. pl. **produktet** (agrees as feminine plural: "produktet e reja") | |
| Brand | **Marka** | Neptun spec field "Marka" (S1, S4). |
| Manufacturer | **Prodhuesi** | Gjirafa50 "Filtro sipas prodhuesit" (S23). |
| Model / code | **Modeli** / **Kodi** | Gjirafa50 "Kodi:" (S23). |
| Filter / Filters | **Filtro** / **Filtrat** | Gjirafa50 "Filtro sipas çmimit" (S23). |
| Sort by | **Rendit sipas** | Shpresa "Rendit sipas çmimit: nga i larti te i ulëti" (S5). |
| Price: low to high | **Çmimi: nga më i ulëti** | Shpresa/WooCommerce-sq pattern (S5, S25). |
| Price | **Çmimi** | |
| incl. VAT / excl. VAT | **me TVSH** / **pa TVSH** · "**Përfshirë TVSH-në**" | Gjirafa50 "Përfshirë TVSH-në", "Pa TVSH" (S23). |
| You save | **Kurseni** | Gjirafa50 "Ju kurseni" (S23). |
| Discount / sale | **Zbritje** · **Ulje** | Vodafone "zbritje", Neptun "ULJE" (S6, S1). |
| In stock | **Në gjendje** · short badge **Ka stok** | Neptun FAQ "nëse një produkt është në gjendje" (S2). Shpresa "Ka stok" (S5). |
| Out of stock | **S'ka në gjendje** · badge **S'ka stok** | Shpresa "S'ka stok" (S5). "Jashtë gjendjes" is understood but is a calque and was not seen on any site (UNVERIFIED). |
| Only N left | **Kanë mbetur vetëm N** | Gjirafa50's "Vetëm edhe 9" is a Kosovo pattern (S23). |
| Pre-order | **Me porosi paraprake** | Shpresa "I paraporositur" (S5). |
| Quantity | **Sasia** | Gjirafa50 "Sasia" (S23). |
| Description | **Përshkrimi** | Gjirafa50 (S23). |
| Technical specifications | **Specifikimet teknike** | ERE "specifikimet teknike" (S8). Neptun uses "karakteristikat" (S2). |
| Datasheet | **Fleta teknike (PDF)** | Rockwool "Skedat teknike" (S14). PV manual "fleta e të dhënave" (S18). Ceresit "Të dhënat teknike" (S15). Any of these works. Pick one. |
| Warranty | **Garancia** · "garanci 25-vjeçare" · "10 vjet garanci" | Neptun "Garancia normale" and "Garanci shtesë" (S4). Vega Solar "garanci 25-vjeçare" (S12). `vjet` and `vite` are both correct after a numeral. |
| Reviews | **Vlerësime** · Write a review: **Shkruani një vlerësim** | Gjirafa50 "Vlerësime", "Shto vlerësimin tuaj" (S23). Avoid WooCommerce-sq "Shqyrtime" (S25). |
| Related products | **Produkte të ngjashme** | Gjirafa50 (S23). |
| Delivery time | **Koha e dorëzimit** | Gjirafa50 says "Koha e arritjes së produktit" (S23). The standard form is UNVERIFIED. |
| Free delivery | **Transport falas** | Neptun and Gjirafa50 "transporti falas" (S2, S23). |
| Installments | **Blerje me këste** · "0% interes" | Neptun (S2). |
| Energy label / class | **Etiketa energjetike** · **Klasa e efikasitetit energjetik** | ERE (S8). Neptun field "Klasa e energjisë" (S4). |

## 5. Basket and checkout

| English | Shqip | Notes |
|---|---|---|
| Basket / cart | **Shporta** (f) · My basket: **Shporta ime** | Gjirafa50 "Shporta ime", "Shporta e blerjes". Shpresa "Totali i shportës" (S23, S5). |
| Add to basket | **Shto në shportë** | Gjirafa50 "Shto në shportë". Neptun FAQ "SHTO NË SHPORTË". Shpresa "Shtoje në shportë" (S23, S2, S5). |
| Buy now | **Bli tani** | Vodafone AL (S6). Avoid "Blej tani". |
| Continue shopping | **Vazhdo blerjet** | Neptun "Vazhdoni Blerjet" (S2). |
| Checkout (page) | **Arka** or **Kasa** · page heading: **Përfundo porosinë** | Neptun calls the step "Kasa": "Vazhdo për tek kasa" (S2). WooCommerce-sq says "Kaloni tek kasa" (S25). "Arka" (our route `/arka`) means the till and is equally clear. For the heading, prefer the action. |
| Proceed to checkout | **Vazhdo me porosinë** | UNVERIFIED wording. Neptun says "Vazhdo për tek kasa" (S2). |
| Place order (final button) | **Porosit** or **Konfirmo porosinë** | Neptun's final button is "Porosit" (S2). WooCommerce-sq "Bëje porosinë" (S25). |
| Order review | **Rishikimi i porosisë** | Neptun "RISHIKIMI I POROSISË" (S2). |
| Billing details | **Të dhënat e faturimit** · **Adresa e faturimit** | Neptun "INFORMACIONI MBI FATURIMIN", "adresën e faturimit" (S2). |
| Delivery details | **Të dhënat e dorëzimit** · **Adresa e dorëzimit** | Neptun "INFORMACIONI MBI TRANSPORTIN" (S2). |
| Delivery method | **Mënyra e dorëzimit** (Neptun: "Metoda e transportit") | S2. |
| Home delivery | **Dorëzim në adresë** | Neptun "transportin në shtëpi" (S2). |
| Pick up from seller | **Tërheqje te shitësi** | Neptun "tërhiqe në dyqanin më të afërt". WooCommerce-sq on Shpresa "Tërhiq në dyqan" (S1, S5). |
| Subtotal | **Nëntotali** | UNVERIFIED on Albanian retail sites (cart totals are rendered client-side). WooCommerce-sq uses "Nënshumë" (S25). "Vlera e produkteve" is a safe alternative. |
| Shipping cost | **Transporti** | Neptun, Gjirafa50 and Shpresa all use "Transporti" for the cost line (S2, S23, S5). |
| VAT (20%) | **TVSH (20%)** | Tatimi mbi Vlerën e Shtuar. "TVSH-ja", "me TVSH". |
| Total | **Totali** | Shpresa "Totali" (S5). |
| Coupon / discount code | **Kodi i zbritjes** | WooCommerce-sq "Kod kuponi" (S25). Avoid a bare "kupon": in Albania "kupon tatimor" is the everyday word for a fiscal receipt. That collision is UNVERIFIED on a page and comes from general usage. |
| Apply | **Apliko** | |
| Notes for the seller | **Shënime për shitësin** | |
| Terms of sale | **Kushtet e blerjes** | Neptun "Termat dhe Kushtet e Blerjes" (S3). |

## 6. Payment, invoicing and delivery

| English | Shqip | Notes |
|---|---|---|
| Payment method | **Mënyra e pagesës** | Foleja (S24). Neptun "INFORMACIONI PËR PAGESËN" (S2). |
| Cash on delivery | **Pagesë në dorëzim** · explained: **Paguani me para në dorë kur merrni porosinë** | Neptun "Pagesës në dorëzim", "Pagesë me para në dorë kur merr porosinë" (S2). |
| Bank transfer | **Transfertë bankare** · **Pagesë në llogarinë bankare** | Neptun lists both (S2). BKT "Transferta Parash" (S11). |
| Card | **Pagesë me kartë** · **Kartë debiti ose krediti** | Neptun "Pagesë me Kartë (Visa dhe Mastercard)", "Kartë bankare debiti ose krediti" (S2). |
| Secure payment | **Pagesë e sigurt** | Foleja (S24). |
| Invoice | **Fatura** (f), pl. **faturat** · fiscalised invoice: **faturë e fiskalizuar** | Tatime "Platformës Qendrore të Lëshimit të Faturave të Fiskalizuara" (S10). |
| Tax ID | **NIPT** ("NIPT-i") · also **NUIS** | Neptun's terms page labels its own ID "NUIS": a letter, 8 digits and a letter (S3). |
| Business / individual | **Biznes** / **Individ** | Tatime "Individ", "Person fizik", "Entitete" (S10). BKT "Individë / Biznes" (S11). |
| Courier | **Korrieri** | |
| Delivery (event) | **Dorëzimi** · consignment: **Dërgesa** | Neptun "dërgesat", Gjirafa50 "Dërgesa të shpejta" (S2, S23). |
| Tracking | **Ndjekja e porosisë** | UNVERIFIED wording. |

## 7. Orders and statuses (order = *porosi*, feminine, so the adjectives are feminine)

| English | Shqip | Notes |
|---|---|---|
| Order / Orders | **Porosia** / **Porositë** | Shpresa and Gjirafa50 "Porositë" (S5, S23). |
| Order number | **Kodi i porosisë** | |
| Order received | **Porosia u mor** | WooCommerce-sq (S25). |
| New | **E re** | |
| Awaiting payment | **Në pritje të pagesës** | WooCommerce-sq "Pagesë pezull" is clumsy (S25). |
| Confirmed | **E konfirmuar** | |
| Processing | **Në përpunim** | WooCommerce-sq "në përpunim" (S25). |
| Shipped | **E dërguar** | |
| Delivered | **E dorëzuar** | |
| Cancelled | **E anuluar** | WooCommerce-sq "të anuluara" (S25). |
| Returned | **E kthyer** | |
| Refunded | **E rimbursuar** | KMK leaflet "duhet të rimbursohet" (S19). |

## 8. Marketplace and price comparison

| English | Shqip | Notes |
|---|---|---|
| Seller | **shitës** (m), pl. **shitës**, def. **shitësit** | Daikin "Gjeni shitësin" (S13). |
| Supplier | **furnitor** (m), pl. **furnitorë** | KMK leaflet "furnitori" (S19). The client's brief uses "furnitorët". |
| Installer | **instalues** (m), pl. **instalues**, def. **instaluesit** | Daikin "Instaluesit" (S13). |
| Verified seller | **Shitës i verifikuar** | |
| Offer (a seller's price for a product) | **ofertë** (f) · "**3 oferta nga 3 shitës**" | Careful: in Albanian retail "Oferta" mostly means promotion or sale (Neptun "Ofertat më të fundit", S1). Label promotions **Në zbritje** so that "ofertë" can mean a seller's price. |
| Best price | **Çmimi më i mirë** | Gjirafa50 "Çmimi më i mirë i garantuar" (S23). |
| Price comparison | **Krahasimi i çmimeve** | |
| Price per Wp / kWh / m² | **Çmimi për Wp** · **lekë/Wp**, **lekë/kWh**, **lekë/m²** | ERE writes "lekë/kWh" (S8). |
| Price history | **Ecuria e çmimit** (alt. Historiku i çmimit) | UNVERIFIED on sites. "Ecuria" reads more naturally for a chart. |
| Price alert | **Njoftim për çmimin** · CTA: **Më njofto kur ulet çmimi** | UNVERIFIED wording. WooCommerce-sq uses "njoftoheni" for back-in-stock (S25). |
| Request a quote | **Kërko ofertë** · the request: **Kërkesë për ofertë** | Daikin "kërkoni ofertë", Rockwool "Kërkesë për një ofertë" / "Merr ofertë", Vega Solar "Dërgoni kërkesën tuaj" (S13, S14, S12). |
| Price list | **Çmimore** | Daikin "Katalogje dhe çmimore" (S13). |
| Volume / tier price | **Çmim sipas sasisë** | UNVERIFIED wording. |
| Pallet | **Paletë** (f), pl. **paleta** | |
| Subscription / plan | **Abonim** (m) · **Plani i abonimit** | Neptun "ABONOHU" (newsletter, S2). |
| Commission | **Komisioni** | |
| Promoted listing | **Produkt i promovuar** | |

## 9. Specification and calculator words (generic)

| English | Shqip | Notes |
|---|---|---|
| Efficiency | **Efikasiteti** | ERE and the PV manual (S8, S18). For energy efficiency of buildings, ERE, Daikin and Rockwool write **efikasitet energjetik**. The brief's "eficiencë" is also seen; use one form in the UI. |
| Rated / nominal power | **Fuqia nominale** | PV manual "Fuqia nominale (Pmax)" (S18). |
| Usable capacity | **Kapaciteti i përdorshëm** | UNVERIFIED on sites (standard form). |
| Annual yield | **Prodhimi vjetor** (i energjisë elektrike) | PV manual (S18). |
| Return on investment | **Kthimi i investimit** | PV manual "Kthimi i investimit (ROI) dhe periudha e shlyerjes" (S18). |
| Payback period | **Periudha e shlyerjes** | PV manual (S18). |
| Annual saving | **Kursimi vjetor** | ERE energy-label page "kursimi" (S8). |
| Solar irradiation | **Rrezatimi diellor** | PV manual, 108 occurrences (S18). |
| Tilt / orientation / azimuth | **Pjerrësia / Orientimi / Azimuti** | PV manual (S18). |
| Self-consumption | **Vetëkonsum** | ERE (S8). |
| Prosumer | **Vetëprodhues** | ERE "Vetëprodhuesi", OSHEE "konsumatorë vetëprodhues" (S8, S9). |
| Surplus fed to the grid | **Energjia e tepërt e dorëzuar në rrjet** | ERE (S8). |
| Distribution system operator | **Operatori i Rrjetit të Shpërndarjes (OSSH)** | ERE, OSHEE (S8, S9). |
| New grid connection | **Lidhje e re** | OSHEE (S9). |
| PV plant / installation | **Impiant fotovoltaik** | ERE and Vega Solar (S8, S12). |

## 10. Solar PV datasheet terms (from the Albanian PV installation manual, S18)

| English | Shqip |
|---|---|
| Open-circuit voltage (Voc) | **Tensioni i qarkut të hapur (Voc)** |
| Short-circuit current (Isc) | **Rryma e qarkut të shkurtër (Isc)** |
| Voltage at maximum power (Vmp) | **Tensioni në fuqinë maksimale (Vmp)** |
| Current at maximum power (Imp) | **Rryma në fuqinë maksimale (Imp)** |
| Maximum system voltage | **Tensioni maksimal i sistemit** |
| Temperature coefficient (Pmax) | **Koeficienti i temperaturës (Pmax)** |
| Depth of discharge (DoD) | **Thellësia e shkarkimit (DoD)** |
| Bifacial cells | **Qeliza bifaciale** (they take in light from both sides) |
| Monocrystalline | **Monokristalin** |
| MC4 connector | **Lidhës MC4** (pl. lidhës) |
| Solar cable | **Kabllo diellore** (kabëll, pl. kabllo) |
| DC isolator switch | **Ndërprerës DC** (manual: "Ndërprerësit e qarkut DC"). Note that **çelës** is the MC4 *spanner* in the manual ("Çelësi për lidhësit MC4"). |
| Cross-section | **Seksioni tërthor** (manual: "Seksioni tërthor i përçuesit") |

## 11. Energy and construction product terms

| English | Shqip | Notes / evidence |
|---|---|---|
| Solar panel / PV module | **Panel diellor** (m), pl. **panele diellore** · **panel fotovoltaik**, pl. **panele fotovoltaike** | OSHEE "Panelet fotovoltaike" and "panele diellore" (S9). Vega Solar "Panele Fotovoltaike" (S12). Gjirafa50 (Kosovo) "Panele solare" (S23). |
| Inverter | **Inverter** (m), pl. **inverterë** (standard alt. *invertor/invertorë*) | Vega Solar "Inverter on grid / off grid" (S12). Gjirafa50 "Inverter hibrid trefazor" (S23). The PV manual uses "inverter" forms 119 times against "invertor" 13 times (S18). |
| Hybrid inverter | **Inverter hibrid** | S23. Vega Solar "Sisteme Hibrid" (S12). |
| Grid-tied / off-grid | **I lidhur me rrjetin (on-grid)** / **i shkëputur nga rrjeti (off-grid)** | Vega Solar "Sisteme të integruara me rrjetin elektrik", "tërësisht të shkëputura" (S12). |
| Single- / three-phase | **njëfazor / trefazor** | Gjirafa50 "trefazor" (S23). |
| Lithium battery | **Bateri litiumi** (or **bateri me litium**, **Li-ion**, **LiFePO4**) | Vega Solar "Bateri me xhel dhe Lithium Ion" (S12). "Bateri litium", with no case ending, is ungrammatical. |
| Storage battery | **Bateri për ruajtjen e energjisë** | |
| EV charger | **Karikues për automjete elektrike** (everyday: **makina elektrike**) | ERE "karikues", "automjet elektrik", "pika publike karikimi", "karikim i shpejtë (DC)" (S8). |
| Mounting system | **Strukturë montimi** / **sistem montimi** | Vega Solar "Struktura", "Strukturë metalike", "Struktura alumini" (S12). |
| Heat pump | **Pompë nxehtësie** (f), pl. **pompa nxehtësie** · alt. **pompë termike** | Daikin AL uses both "Pompa nxehtësie" and "Pompat termike" (S13). |
| Air conditioner | **Kondicioner** (m), pl. **kondicionerë** | ERE and Daikin "Kondicionerë ajri" (S8, S13). Neptun gives capacity in **BTU** ("Kapaciteti në BTU") with "Klasa e energjisë" and "Niveli i zhurmës" (S4). |
| Solar water heater | **Ngrohës uji diellor** · collector: **kolektor diellor** (pl. kolektorë diellorë) · tank heater: **bojler** | PV manual "kolektorë diellorë" (S18). ERE "bojler" (S8). "Bojler diellor" is common speech (UNVERIFIED on a site). |
| Thermal insulation | **Termoizolim** / **izolim termik** | Ceresit "Sistemet për termoizolim" (S15). Rockwool "izolim termik" (S14). |
| External insulation system (ETICS) | **Sistem kapotë** / **kapotë** · formal: **termoizolim i fasadës** | Shqiptarja quoting the Tirana mayor: "pallati u vesh me sistemin kapotë, ka termoizolim" (S22). |
| Stone wool / glass wool | **Lesh guri** / **lesh xhami** | Rockwool AL "Lesh guri" (S14). "Lesh xhami" is UNVERIFIED on a site. |
| EPS / XPS | **Polisterol (EPS)** / **XPS** | UNVERIFIED on a site. |
| PVC window | **Dritare PVC** · profile: **profil PVC** | ERE "dyerve dhe dritareve" (S8). |
| Cement | **Çimento** (f) · bag: **thes** (pl. thasë) | Sika "Aditivë për çimenton" (S16). |
| Blocks / bricks | **Blloqe** / **tulla** | UNVERIFIED on a site. |
| Rebar | **Hekur betoni** (trade word) · technical: **hekur i vijaskuar B500C** | Kurum: "hekur të vijaskuar me diametër nga ɸ 8 -ɸ 32", "B500C dhe B500B" (S17). "Hekur betoni" and "armaturë" are not on Kurum's page. |
| Tile adhesive | **Ngjitës për pllaka** | Sika "Ngjitësa për ndërtimin", "Sisteme për shtrimin e pllakave". Ceresit "Sistemet për vendosjen e pllakave" (S16, S15). |
| Waterproofing | **Hidroizolim** | Ceresit "Produktet për hidroizolim", Sika "Sisteme hidroizolimi" (S15, S16). |
| Mortar / grout | **Llaç** / **fugë** | Sika "llaç të thatë". Ceresit "fugë masë" (S16, S15). |
| LED lighting | **Ndriçim LED** · lamp: **llambë LED** | ERE "Llambat LED" (S8). Neptun "Ndriçim" (S1). |
| Energy meter | **Matës energjie** | PV manual "matës" (S18). |

## 12. Admin panel

| English | Shqip | Notes |
|---|---|---|
| Admin panel | **Paneli i administrimit** | |
| Dashboard | **Pasqyra** | |
| Products / Categories | **Produktet / Kategoritë** | |
| Attributes / spec template | **Atributet** / **Shablloni i specifikimeve** | |
| Attribute type: number / text / yes-no / list | **Numër / Tekst / Po–Jo / Listë zgjedhjesh** | |
| Unit | **Njësia** | |
| Filterable / Comparable / Show on card / Required | **I filtrueshëm / I krahasueshëm / Shfaqet në kartë / I detyrueshëm** | |
| Better value: higher / lower | **Më mirë: më i lartë / më i ulët** | |
| Decimals | **Shifra dhjetore** | |
| Sellers / Offers / Orders / Customers | **Shitësit / Ofertat / Porositë / Klientët** | Daikin "Klientët" (S13). |
| Subscriptions / Commission | **Abonimet / Komisioni** | |
| Reports | **Raportet** | OSHEE "Raporte" (S9). |
| Settings | **Cilësimet** | Neptun "Cilësimet e cookies" (S1). |
| Save / Cancel / Delete / Edit / Add new / Publish / Draft | **Ruaj / Anulo / Fshi / Ndrysho / Shto të re / Publiko / Skicë** | Daikin "Ndrysho kërkimin" (S13). |
| Status (field) | **Statusi** | See §7 for the values. |

## 13. Legal, privacy and cookies

| English | Shqip | Notes |
|---|---|---|
| Terms and conditions | **Termat dhe kushtet** | Neptun "Termat dhe Kushtet e Përgjithshme", Shpresa "Termat dhe Kushtet" (S3, S5). |
| Terms of use | **Kushtet e përdorimit** | Gjirafa50 (S23). |
| Terms of sale | **Kushtet e blerjes** | Neptun "Termat dhe Kushtet e Blerjes" (S3). |
| Privacy policy | **Politika e privatësisë** | Neptun and Shpresa (S3, S5). |
| Cookie policy | **Politika e cookies** | Neptun "Politikat e cookies". e-Albania "Politikën tonë të Cookies" (S1, S7). |
| Cookie settings | **Cilësimet e cookies** | Neptun (S1). |
| Accept all / Reject | **Prano të gjitha / Refuzo** | e-Albania "Refuzo / Prano", Neptun "Pranoj të gjitha cookies", ERE "Në rregull / Refuzo" (S7, S1, S8). |
| Necessary / analytics / marketing cookies | **Cookies të domosdoshme / analitike / marketingu** | Neptun (S1). |
| **Right of withdrawal** | **E drejta e heqjes dorë nga kontrata** | This is the statutory wording in Law 9902/2008 (consolidated 2018), Art. 37/1 "E drejta e heqjes dorë nga kontrata". The period ends 14 days later (S20). The KMK leaflet uses the same wording (S19). The 2025 draft of a new consumer law writes "të drejtën për tërheqje" (S21). It has not been confirmed as adopted (UNVERIFIED). **Do not use "e drejta e tërheqjes" on the site while Law 9902 is in force.** |
| Withdrawal form | **Formulari i heqjes dorë** | Law 9902 "formularin model të heqjes dorë", Annex I(B) (S20). |
| Distance contract | **Kontratë në largësi** | Law 9902 definition (S20). KMK also says "kontratat në distancë" (S19). |
| Trader / consumer | **Tregtari / konsumatori** | Law 9902 (S20). |
| Returns / exchange policy | **Politika e kthimit dhe e zëvendësimit** | Neptun "Politika e zëvendësimit/kthimit" (S1). |
| Complaint | **Ankesë** (f) | Shpresa "E-mail për Ankesa" (S5). ERE "Formulari i Ankesave" (S8). |
| Personal data / consent | **Të dhënat personale / pëlqimi** | OSHEE "Të Dhënat Personale". Neptun "tërheqja e pëlqimit" means *withdrawal of consent*, a different "tërheqje" from the contract right (S9, S3). |
| Consumer protection authority | **Komisioni për Mbrojtjen e Konsumatorit** | KMK leaflet (S19). |

## 14. Form validation messages

| English | Shqip |
|---|---|
| This field is required. | **Kjo fushë është e detyrueshme.** |
| Please check the highlighted fields. | **Kontrolloni fushat e shënuara.** |
| Enter a valid email, e.g. name@example.al. | **Shkruani një email të vlefshëm, p.sh. emri@shembull.al.** |
| Enter an Albanian mobile number, e.g. 069 123 4567. | **Shkruani një numër celulari shqiptar, p.sh. 069 123 4567.** |
| NIPT has 10 characters: a letter, 8 digits and a letter, e.g. L12345678A. | **NIPT-i ka 10 shenja: një shkronjë, 8 shifra dhe një shkronjë në fund, p.sh. L12345678A.** |
| Choose at least one option. | **Zgjidhni të paktën një mundësi.** |
| The quantity must be at least 1. | **Sasia duhet të jetë të paktën 1.** |
| Only N available from this seller. | **Ky shitës ka vetëm N copë në gjendje.** |
| Something went wrong. Try again. | **Ndodhi një gabim. Provoni sërish.** |

## 15. Empty states and system messages

| English | Shqip |
|---|---|
| Your basket is empty. | **Shporta juaj është bosh.** (WooCommerce-sq "e zbrazët". Gjirafa50 "Ju nuk keni asnjë produkt në shportën tuaj". S25, S23) |
| No favourites yet. | **Nuk keni ende produkte të preferuara.** |
| No orders yet. | **Nuk keni ende porosi.** |
| No results. | **Nuk u gjet asnjë rezultat.** |
| Loading… | **Duke u ngarkuar…** |
| Saved. | **U ruajt.** |

## 16. Microcopy examples (bilingual)

1. **Empty basket**
   - EN: Your basket is empty. Browse solar panels, inverters and building materials to get started.
   - SQ: Shporta juaj është bosh. Shikoni panelet diellore, inverterët dhe materialet e ndërtimit për të filluar.
2. **Added-to-basket toast**
   - EN: Added to basket: 2 × Jinko Tiger Neo 620 Wp from {seller}. · [View basket]
   - SQ: U shtua në shportë: 2 × Jinko Tiger Neo 620 Wp nga {shitësi}. · [Shiko shportën]
3. **Out of stock (with alternatives)**
   - EN: This seller is out of stock. 3 other sellers have it from 14 200 lekë.
   - SQ: Ky shitës nuk e ka në gjendje. E kanë edhe 3 shitës të tjerë, nga 14 200 lekë.
4. **Compare limit reached** (Foleja has the same rule: "Numri maksimal i produkteve për të krahasuar është 4", S24)
   - EN: You can compare up to 4 products. Remove one to add this.
   - SQ: Mund të krahasoni deri në 4 produkte. Hiqni një për të shtuar këtë.
5. **Compare across categories**
   - EN: Only products from the same category can be compared.
   - SQ: Krahasohen vetëm produkte të së njëjtës kategori.
6. **Order confirmed**
   - EN: Thank you! Your order BD-2610-0042 has been received. The seller will call you to confirm delivery.
   - SQ: Faleminderit! Porosia juaj BD-2610-0042 u mor. Shitësi do t’ju telefonojë për të konfirmuar dorëzimin.
7. **Form error summary**
   - EN: Please check the highlighted fields.
   - SQ: Kontrolloni fushat e shënuara.
8. **404**
   - EN: Page not found. The link may be old or mistyped. · [Back to the shop]
   - SQ: Faqja nuk u gjet. Lidhja mund të jetë e vjetër ose e shkruar gabim. · [Kthehu te dyqani]
9. **Search with no results**
   - EN: No products match “heat pump 9 kW”. Try fewer words or another category.
   - SQ: Nuk u gjet asnjë produkt për “pompë nxehtësie 9 kW”. Provoni me më pak fjalë ose në një kategori tjetër.
10. **Price alert set**
    - EN: We’ll email you when the price drops below 18 000 lekë.
    - SQ: Do t’ju njoftojmë me email kur çmimi të bjerë nën 18 000 lekë.
11. **Quote request sent**
    - EN: Your request was sent to 3 sellers. Their quotes will appear here and in your email.
    - SQ: Kërkesa juaj u dërgua te 3 shitës. Ofertat e tyre do të shfaqen këtu dhe në email.
12. **Cash-on-delivery note**
    - EN: Pay in cash when the courier delivers your order.
    - SQ: Paguani me para në dorë kur korrieri t’ju sjellë porosinë.
13. **Add-to-basket failure** (better than Gjirafa50's "Dështoi që ta shtoni produktin…", S23)
    - EN: We couldn’t add this product. Refresh the page and try again.
    - SQ: Produkti nuk u shtua. Rifreskoni faqen dhe provoni sërish.
14. **Cookie banner**
    - EN: We use cookies the shop needs to work and, with your consent, cookies for statistics. [Accept all] [Necessary only] [Settings]
    - SQ: Përdorim cookies të domosdoshme që dyqani të funksionojë dhe, me pëlqimin tuaj, cookies statistikore. [Prano të gjitha] [Vetëm të domosdoshmet] [Cilësimet]

## 17. Corrections to existing copy

Files reviewed: `scripts/catalog/categories.mjs` and `src/lib/checkout.ts`. Neither was edited. Line numbers refer to the files as read on 2026-10-23. Every row is an error or an unnatural phrasing. The **must** rows mislead or are ungrammatical. The **should** rows are style or market fit.

### scripts/catalog/categories.mjs

| Line | Current | Correction | Why | Priority |
|---|---|---|---|---|
| 16, 38, 57, 116, 132, 148, 163 | `unit_label_sq: 'L/Wp'`, `'L/kW'`, `'L/kWh'`, `'L/litër'`, `'L/m²'` | `'lekë/Wp'`, `'lekë/kW'`, `'lekë/kWh'`, `'lekë/litër'`, `'lekë/m²'` | The catalogue also uses `L` as the litre unit (line 152 `tank_litres` unit `'L'`), so line 148 reads "litres per litre". ERE writes "lekë/kWh" (S8). | must |
| 11 | `'Mbrojtja IP'` | `'Shkalla e mbrojtjes (IP)'` | IP is a *degree* of protection. "Mbrojtja IP" reads as "IP protection". | should |
| 25 | `'Tensioni pa ngarkesë (Voc)'` | `'Tensioni i qarkut të hapur (Voc)'` | This is the term in the Albanian PV manual (S18). "Pa ngarkesë" appears there only as the explanation. | should |
| 26 | `'Rryma e lidhjes së shkurtër (Isc)'` | `'Rryma e qarkut të shkurtër (Isc)'` | Matches the manual and Voc above (S18). The current form is not wrong, only inconsistent. | should |
| 27 | `'Tensioni në fuqi maksimale (Vmp)'` | `'Tensioni në fuqinë maksimale (Vmp)'` | Needs the definite form. "Në fuqi" means "in force" (as said of laws). Manual: "Tensioni në fuqinë maksimale (Vmp)" (S18). | must |
| 28 | `'Rryma në fuqi maksimale (Imp)'` | `'Rryma në fuqinë maksimale (Imp)'` | Same reason. | must |
| 29 | `'Koeficienti termik i Pmax'` | `'Koeficienti i temperaturës (Pmax)'` | Manual "Koeficientët e temperaturës" (S18). | should |
| 37 | `name_sq: 'Invertorë'` (slug `invertore`) | `'Inverterë'` (slug `invertere`) | Albanian installers and shops write "inverter" (Vega Solar, Gjirafa50, Neptun; the manual 119:13). This matters for search. "Invertorë" is not wrong. | should |
| 39 | `'Invertorë në rrjet dhe hibridë, njëfazorë e trefazorë. Shikoni sa MPPT kanë dhe nëse pranojnë bateri.'` | `'Inverterë të lidhur me rrjetin (on-grid) dhe hibridë, njëfazorë dhe trefazorë. Shikoni sa MPPT kanë dhe nëse mund të lidhen me bateri.'` | "Në rrjet" reads as "online/on the net". Vega Solar says "të integruara me rrjetin elektrik" (S12). "Pranojnë bateri" is a calque of "accept a battery". | should |
| 44, 81, 125, 210 | `'Fazat'` | `'Numri i fazave'` | The value is a count (1 or 3). | should |
| 45 | `'Numri i MPPT'` | `'Numri i MPPT-ve'` | An abbreviation takes a hyphenated case ending (house style §0). | must |
| 56 | `name_sq: 'Bateri ruajtëse'` | `'Bateri për ruajtjen e energjisë'` (or just `'Bateri'`) | "Ruajtëse" ("guarding/keeping") is not used for storage batteries. Vega Solar just says "Bateri" (S12). | must |
| 58 | `'Bateri litium për shtëpi dhe biznes.'` | `'Bateri litiumi për shtëpi dhe biznese.'` | "Litium" needs the genitive "litiumi". | must |
| 63 | `'Kimia'` | `'Teknologjia e qelizave'` (en: 'Cell chemistry') | "Kimia: LFP" reads as "Chemistry (the subject): LFP". | should |
| 64 | `'Cikle jetëgjatësie'` | `'Jetëgjatësia (cikle)'` or `'Numri i cikleve'` | Ungrammatical: an indefinite plural followed by a bare genitive. | must |
| 65 | `'Thellësia e shkarkimit'` | `'Thellësia e shkarkimit (DoD)'` | The manual adds the abbreviation (S18), and it helps people match datasheets. | should |
| 66 | `'Fuqia e vazhdueshme'` | `'Fuqia e vazhdueshme e shkarkimit'` | Says what power is meant. | should |
| 76 | `'…me lidhje Type 2.'` | `'…me lidhës Type 2.'` | "Lidhje" means connection. Line 81 already labels the part "Lidhësi". | should |
| 91 | `'Struktura për çati me tjegulla, çati të sheshta dhe llamarinë.'` | `'Struktura për çati me tjegulla, çati të sheshta dhe çati me llamarinë.'` | As written, the structures are for "sheet metal" instead of for sheet-metal roofs. | should |
| 105 | `'Lidhës, kabllo dhe çelësa DC për instalime fotovoltaike.'` | `'Lidhës MC4, kabllo diellore dhe ndërprerës DC për impiante fotovoltaike.'` | In the Albanian PV manual "çelës" is the MC4 *spanner*, and the switch is "ndërprerës (DC)". Installers and ERE say "impiant fotovoltaik" (S18, S12, S8). | must |
| 110 | `'Seksioni'` | `'Seksioni tërthor'` | Manual "Seksioni tërthor i përçuesit" (S18). | should |
| 126 | `'Fuqia e zhurmës'` | `'Fuqia akustike'` | A literal "power of the noise". Neptun calls the related figure "Niveli i zhurmës" (S4). | should |
| 131/136 | AC capacity in kW only | Also show BTU: `'12 000 BTU (3,5 kW)'` | Albanian retail lists ACs by BTU ("Kapaciteti në BTU", "Fuqia ftohëse në BTU", S4). This is a display note, not a wording error. | should |
| 152 | `'Depozita'` | `'Vëllimi i depozitës'` | The value is litres, so the label must say volume. | should |
| 156 | `'Materiali i depozitës'` / en `'Tank lining'` | en `'Tank material'` (or sq `'Veshja e brendshme e depozitës'`) | The two languages say different things. The key is `tank_material`. | must |
| 164 | `'…dhe sisteme veshjeje termike për fasada.'` | `'…dhe sisteme termoizolimi për fasada (kapotë).'` | "Kapotë" is the word buyers use (S22). Ceresit says "Sistemet për termoizolim" (S15). | should |
| 182 | `'Dhomat'` | `'Numri i dhomave'` | The value is a count. | should |
| 205 | slug_sq `'matje-energjie'` / name `'Matës energjie'` | slug `'mates-energjie'` | The slug says "measurement" while the name says "meters". | should |
| 212 | `'Lidhja'` | `'Komunikimi'` (Wi-Fi, LAN, Modbus) | "Lidhja" is ambiguous with the electrical connection. | should |
| 226 | `'Indeksi i ngjyrave (CRI)'` | `'Indeksi i riprodhimit të ngjyrave (CRI)'` | CRI is the colour *rendering* index. | must |

These are correct and should stay as they are: `'Panele diellore'`, `'Fuqia nominale'` (S18), `'Efikasiteti i modulit'`, `'Thellësia e shkarkimit'`, `'Pompa nxehtësie'` (S13), `'Kondicionerë inverter'`, `'Ngrohës uji diellorë'`, `'Izolim termik'`, `'Përçueshmëria termike (λ)'`, `'Klasa e reagimit ndaj zjarrit'`, `'Rezistenca në shtypje'`, `'Pesha e thesit'`, `'Rezistenca elektrike'`, `'Fluksi ndriçues'`, `'Efikasiteti ndriçues'`, `'Temperatura e ngjyrës'`, `'Jetëgjatësia'`, `'Pjerrësia'`. The unit `'vjet'` is also correct; Gjirafa50 writes "25 vjet" and Neptun "5 vite".

### src/lib/checkout.ts

| Line | Current | Correction | Why | Priority |
|---|---|---|---|---|
| 28 | `'Kjo adresë email nuk duket e plotë.'` | `'Kontrolloni adresën e emailit, p.sh. emri@shembull.al.'` | The check also fires on malformed addresses, not only incomplete ones. Showing an example is clearer. ("Adresë email" itself is acceptable, S25.) | should |
| 29 | `'Për faturë biznesi na duhet një email.'` | `'Për faturën e biznesit duhet një adresë emaili.'` | "Faturë biznesi" without the article is colloquial. Minor. | should |
| 31 | `'NIPT-i ka një shkronjë, 8 shifra dhe një shkronjë, p.sh. L12345678A.'` | `'NIPT-i ka 10 shenja: një shkronjë, 8 shifra dhe një shkronjë në fund, p.sh. L12345678A.'` | Repeating "një shkronjë" with no position reads clumsily. | should |
| 33 | `'Shkruani adresën: rruga, numri, pallati ose shenja dalluese.'` | `'Shkruani adresën: rrugën, numrin e pallatit ose të shtëpisë dhe një pikë referimi.'` | The listed nouns are objects of "Shkruani", so they need the accusative (rrugën, numrin). "Shenja dalluese" is the ID-document term for a distinguishing mark. For addresses people say "pikë referimi" (common usage, UNVERIFIED on a page). | must |
| 34 | `'Pranoni kushtet e shitjes për të vazhduar.'` | `'Pranoni kushtet e blerjes për të vazhduar.'` | The buyer's perspective, as on Neptun ("Termat dhe Kushtet e Blerjes", S3). | should |
| 102 | `'Tërheqje te shitësi'` | keep | Matches Neptun "tërhiqe në dyqan" and WooCommerce-sq/Shpresa "Tërhiq në dyqan" (S1, S5). | none |

Lines 26, 27, 30, 32 and 35 are correct.

## 18. Sources (all read 2026-10-23)

- S1 Neptun homepage (Albania's largest electronics chain): https://neptun.al/
- S2 Neptun FAQ (payment methods, checkout steps): https://neptun.al/faq.nspx
- S3 Neptun terms: https://neptun.al/termat-dhe-kushtet-e-p-rgjithshme.nspx
- S4 Neptun air conditioners (spec field names): https://neptun.al/kondicionere.nspx
- S5 Shpresa AL Computers (WooCommerce, Albania): https://www.shpresa.al/, https://shpresa.al/cart/, https://shpresa.al/checkout/, https://www.shpresa.al/product/samsung-galaxy-a08-64gb/
- S6 Vodafone Albania and eShop: https://www.vodafone.al/, https://eshop.vodafone.al/
- S7 e-Albania: https://e-albania.al/
- S8 ERE: https://www.ere.gov.al/sq/, https://www.ere.gov.al/sq/eficence/veteprodhuesi, https://www.ere.gov.al/sq/eficence/automjetet-elektrike, https://www.ere.gov.al/sq/eficence/etiketa-energjetike, https://www.ere.gov.al/sq/eficence/kurseni-energjine-ne-banese, https://www.ere.gov.al/sq/eficence/kalkulatore
- S9 OSHEE: https://oshee.al/
- S10 Tax administration: https://www.tatime.gov.al/
- S11 BKT bank: https://www.bkt.com.al/
- S12 Vega Solar (Albanian PV installer): https://vegasolar.al/
- S13 Daikin Albania: https://www.daikin.al/sq_al/customers.html
- S14 Rockwool Albania: https://www.rockwool.com/al/
- S15 Ceresit Albania: https://www.ceresit.al/
- S16 Sika Albania: https://alb.sika.com/
- S17 Kurum (Albanian steel maker): https://www.kurum.al/hekur/
- S18 ERI SEE, *Manual për instalimin dhe mirëmbajtjen e sistemeve fotovoltaike diellore* (Albanian, 2025, 173 pp.): https://www.erisee.org/wp-content/uploads/2025/09/Solar-LM_AL.pdf
- S19 Consumer Protection Commission leaflet on distance contracts: https://kmk.ekonomia.gov.al/wp-content/uploads/2018/07/FP-informuese-per-kontratat-ne-largesi.pdf
- S20 Law 9902/2008 "Për mbrojtjen e konsumatorëve", consolidated 2018 (Art. 37/1): https://aac.gov.al/wp-content/uploads/2024/12/Ligji-9902-date-17.04.2008-i-ndryshuar-version-i-konsoliduar-2018.doc
- S21 Draft consumer-protection law, explanatory report (public consultation): https://www.konsultimipublik.gov.al/documents/RENJK_842_Relacioni-projekt-LMK.docx
- S22 Shqiptarja.com, Tirana Community Fund ("sistemin kapotë"): https://shqiptarja.com/lajm/veliaj-zgjidhni-administratoret-qe-br-te-perfitoni-nga-fondi-i-komunitetit-br
- S23 Gjirafa50 (Kosovo; regional-variant evidence): https://gjirafa50.com/, https://gjirafa50.com/panele-solare, https://gjirafa50.com/fotovoltaik-pv, https://gjirafa50.com/panel-diellor-ecoflow-250w-rigid-set-4-cope-efikasitet-247-i-zi
- S24 Foleja (Kosovo): https://www.foleja.com/
- S25 WooCommerce Albanian translation (one translator's idiom, used as weak evidence only): https://translate.wordpress.org/projects/wp-plugins/woocommerce/stable/sq/default/

## 19. Gaps

- None of the sampled Albanian shops rendered its basket or checkout in server HTML (Shpresa, Vodafone eShop). So **Nëntotali**, **Vazhdo me porosinë** and **Konfirmo porosinë** are standard wording that has not been seen live.
- No Albanian online shop with a basket for solar or building materials was found. Vega Solar and Daikin AL are catalogue and quote sites.
- These sites timed out from this machine and could not be checked: tirana.al, pok.al, one.al, solaron.al, kryeministria.al, qkb.gov.al. Knauf AL and Mapei AL blocked automated access.
- That "kupon" collides with "kupon tatimor" (fiscal receipt) comes from general usage and was not seen on a page.
- Whether the 2025 consumer-law draft has been adopted is not confirmed. If it is adopted, recheck the withdrawal wording ("e drejta për tërheqje").
