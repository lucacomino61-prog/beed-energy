// INVENTED sellers for the local demo only (--demo). Names checked for obvious collisions with real
// Albanian companies; every row is is_demo = 1 and shows a "shembull / sample" tag on the site.
export const DEMO_SELLERS = [
  { slug: 'rrezja-energji', name: 'Rrezja Energji', kind: 'supplier', city: 'tirane', plan: 'partner', commission_pct: 6, verified: true, rating: 4.7, rating_count: 128, zones: '1,2,3',
    about_sq: 'Furnitor panelesh, invertorësh dhe baterish me magazinë në Tiranë.', about_en: 'Supplier of panels, inverters and batteries with a warehouse in Tirana.' },
  { slug: 'adriatik-solar-supply', name: 'Adriatik Solar Supply', kind: 'supplier', city: 'durres', plan: 'pro', commission_pct: 7, verified: true, rating: 4.5, rating_count: 64, zones: '1,2,3',
    about_sq: 'Importues pajisjesh fotovoltaike pranë portit të Durrësit.', about_en: 'Importer of PV equipment near the port of Durrës.' },
  { slug: 'jugu-instalime', name: 'Jugu Instalime', kind: 'installer', city: 'vlore', plan: 'pro', commission_pct: 8, verified: true, rating: 4.8, rating_count: 41, zones: '2,3',
    about_sq: 'Instalues sistemesh diellore dhe pompash nxehtësie në jug.', about_en: 'Installer of solar systems and heat pumps in the south.' },
  { slug: 'kantieri-qendror', name: 'Kantieri Qendror', kind: 'contractor', city: 'elbasan', plan: 'start', commission_pct: 9, verified: false, rating: 4.2, rating_count: 23, zones: '1,2',
    about_sq: 'Materiale ndërtimi për kantier, me dërgesë me kamion.', about_en: 'Building materials for the site, delivered by truck.' },
  { slug: 'veriu-termo', name: 'Veriu Termo', kind: 'supplier', city: 'shkoder', plan: 'pro', commission_pct: 7, verified: true, rating: 4.6, rating_count: 37, zones: '1,2,3',
    about_sq: 'Kondicionerë, pompa nxehtësie dhe ngrohës uji diellorë.', about_en: 'Air conditioners, heat pumps and solar water heaters.' },
  { slug: 'korca-ngrohje', name: 'Korça Ngrohje', kind: 'installer', city: 'korce', plan: 'start', commission_pct: 9, verified: false, rating: 4.4, rating_count: 18, zones: '3',
    about_sq: 'Ngrohje dhe izolim për klimën e ftohtë të juglindjes.', about_en: 'Heating and insulation for the cold south-east.' },
  { slug: 'fasada-pro', name: 'Fasada Pro', kind: 'supplier', city: 'tirane', plan: 'partner', commission_pct: 6, verified: true, rating: 4.6, rating_count: 52, zones: '1,2,3',
    about_sq: 'Sisteme veshjeje termike, lesh guri dhe dritare PVC.', about_en: 'External insulation systems, stone wool and PVC windows.' },
];
