// Albanian for free-text spec values that the datasheets give in English (product_specs.value_text holds one
// language). Codes such as IP65, A+++, R32, EN 197-1 or B500C read the same in both languages and are left out.
// New products: add their English values here, or type the Albanian in the admin's spec form.
export const SPEC_TEXT_SQ: Record<string, string> = {
  'Class 1 (EN 62053-21) / Class B (EN 50470-3)': 'Klasa 1 (EN 62053-21) / Klasa B (EN 50470-3)',
  'Class B (active energy), ±1%': 'Klasa B (energji aktive), ±1%',
  'Heterojunction (HJT)': 'Teknologji HJT (heterojunction)',
  'N-type ABC (all back contact)': 'Tip N, ABC (të gjitha kontaktet në pjesën e pasme)',
  'N-type TOPCon': 'Tip N, TOPCon',
  'N-type i-TOPCon': 'Tip N, i-TOPCon',
  'N-type monocrystalline': 'Tip N, monokristalor',
  'IEC Type 2 (7.5 m tethered cable)': 'IEC Type 2 (kabllo e fiksuar 7,5 m)',
  'Tethered cable 4.2 m (plug type not stated in datasheet)': 'Kabllo e fiksuar 4,2 m (lloji i spinës nuk jepet në fletën teknike)',
  'Type 2 (6 m tethered cable)': 'Type 2 (kabllo e fiksuar 6 m)',
  'Type 2 socket': 'Prizë Type 2',
  '≈2.0 kg/m² per mm of thickness; minimum total thickness 2 mm': '≈2,0 kg/m² për çdo mm trashësi; trashësia minimale gjithsej 2 mm',
  '≈3.0 / 4.0 / 5.0 / 6.0 kg/m² with 4 / 6 / 8 / 10 mm notched trowel': '≈3,0 / 4,0 / 5,0 / 6,0 kg/m² me mistri me dhëmbë 4 / 6 / 8 / 10 mm',
  '1 kit (25 kg) ≈ 12.5 l of mortar': '1 komplet (25 kg) ≈ 12,5 l llaç',
  'Ø12 mm × 12 m (range Ø8–Ø32 mm; 12 m standard, 14 m to order)': 'Ø12 mm × 12 m (gama Ø8–Ø32 mm; 12 m standard, 14 m me porosi)',
  'Aluminium EN AW-6063 T66': 'Alumin EN AW-6063 T66',
  'Aluminium, EPDM, stainless steel': 'Alumin, EPDM, çelik inoks',
  'ETICS: EPS (EN 13163) + Ceresit CT 85 + CT 325 mesh + CT 174/175 render': 'Kapotë (ETICS): EPS (EN 13163) + Ceresit CT 85 + rrjetë CT 325 + suva CT 174/175',
  'Graphite EPS (EN 13163)': 'EPS me grafit (EN 13163)',
  'Roof hooks: stainless steel, high-tensile steel with zinc-flake coating, or aluminium': 'Grepa çatie: çelik inoks, çelik me rezistencë të lartë me veshje zinku, ose alumin',
  'Stone wool (dual density)': 'Lesh guri (me dy dendësi)',
  'Flat roof': 'Çati e sheshtë',
  'Pitched roof (tiles, sheet metal and others via K2 roof hooks or fasteners)': 'Çati me pjerrësi (tjegulla, llamarinë etj., me grepa ose fiksues K2)',
  'Pitched roof with tiles': 'Çati me pjerrësi me tjegulla',
  '3 sealing levels: outer, centre and rebate (stop) seal': '3 nivele guarnicionesh: i jashtëm, qendror dhe i batutës',
  'Fast, PV-priority, PV+battery and scheduled charging; dynamic load control; Wi-Fi, Bluetooth, LAN, 2 × RS485; Modbus TCP; RFID and app start':
    'Karikim i shpejtë, me përparësi PV, PV + bateri dhe me orar; kontroll dinamik i ngarkesës; Wi-Fi, Bluetooth, LAN, 2 × RS485; Modbus TCP; nisje me RFID dhe aplikacion',
  'OCPP 1.6J; Modbus RTU link to a smart meter for dynamic load management; Wi-Fi, Bluetooth, Ethernet, optional 4G; RFID; ChargerSync app':
    'OCPP 1.6J; lidhje Modbus RTU me matës inteligjent për menaxhim dinamik të ngarkesës; Wi-Fi, Bluetooth, Ethernet, 4G sipas dëshirës; RFID; aplikacioni ChargerSync',
  'PV-surplus charging with automatic 1-/3-phase switching (1.38-22 kW); LAN and Wi-Fi; integrated 20 mA AC / 6 mA DC residual current detection':
    'Karikim me tepricën PV me kalim automatik 1/3 faza (1,38–22 kW); LAN dhe Wi-Fi; zbulim i integruar i rrymës së mbetur 20 mA AC / 6 mA DC',
  'Wi-Fi, BLE and LoRa; Deye Cloud monitoring and control; scheduled and solar-only charging': 'Wi-Fi, BLE dhe LoRa; monitorim dhe kontroll me Deye Cloud; karikim me orar dhe vetëm me diell',
  'AAC 2.5 N/mm² · 400 kg/m³': 'Beton qelizor (AAC) 2,5 N/mm² · 400 kg/m³',
  thermosiphon: 'termosifon',
  'Directly enamelled DC-03 steel (DIN 4753/3)': 'Çelik DC-03 i emaluar drejtpërdrejt (DIN 4753/3)',
  'Double-enamelled steel with titanium (DIN 4753)': 'Çelik me emalim të dyfishtë me titan (DIN 4753)',
  'Glass-enamelled steel': 'Çelik i emaluar me qelq',
};

export function specTextSq(v: string): string {
  return SPEC_TEXT_SQ[v] ?? v;
}
