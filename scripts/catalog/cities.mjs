// Delivery cities. Zone 1 = Tirana–Durrës area, 2 = central and coastal cities within ~2 h, 3 = far north, east and south.
// Coordinates are city centres; PVGIS yields are joined from research/pvgis-albania.json by slug.
export const CITY_ZONES = [
  { slug: 'tirane', name_sq: 'Tiranë', name_en: 'Tirana', zone: 1, lat: 41.3275, lon: 19.8187 },
  { slug: 'durres', name_sq: 'Durrës', name_en: 'Durrës', zone: 1, lat: 41.3231, lon: 19.4414 },
  { slug: 'kavaje', name_sq: 'Kavajë', name_en: 'Kavajë', zone: 1, lat: 41.185, lon: 19.5569 },
  { slug: 'kruje', name_sq: 'Krujë', name_en: 'Krujë', zone: 1, lat: 41.5092, lon: 19.7928 },
  { slug: 'elbasan', name_sq: 'Elbasan', name_en: 'Elbasan', zone: 2, lat: 41.1125, lon: 20.0822 },
  { slug: 'fier', name_sq: 'Fier', name_en: 'Fier', zone: 2, lat: 40.7239, lon: 19.5561 },
  { slug: 'lushnje', name_sq: 'Lushnjë', name_en: 'Lushnjë', zone: 2, lat: 40.9419, lon: 19.705 },
  { slug: 'berat', name_sq: 'Berat', name_en: 'Berat', zone: 2, lat: 40.7058, lon: 19.9522 },
  { slug: 'kucove', name_sq: 'Kuçovë', name_en: 'Kuçovë', zone: 2, lat: 40.8003, lon: 19.9144 },
  { slug: 'vlore', name_sq: 'Vlorë', name_en: 'Vlorë', zone: 2, lat: 40.4667, lon: 19.4897 },
  { slug: 'shkoder', name_sq: 'Shkodër', name_en: 'Shkodër', zone: 2, lat: 42.0683, lon: 19.5126 },
  { slug: 'lezhe', name_sq: 'Lezhë', name_en: 'Lezhë', zone: 2, lat: 41.7836, lon: 19.6436 },
  { slug: 'lac', name_sq: 'Laç', name_en: 'Laç', zone: 2, lat: 41.6353, lon: 19.7131 },
  { slug: 'korce', name_sq: 'Korçë', name_en: 'Korçë', zone: 3, lat: 40.6186, lon: 20.7808 },
  { slug: 'pogradec', name_sq: 'Pogradec', name_en: 'Pogradec', zone: 3, lat: 40.9025, lon: 20.6525 },
  { slug: 'gjirokaster', name_sq: 'Gjirokastër', name_en: 'Gjirokastër', zone: 3, lat: 40.0758, lon: 20.1389 },
  { slug: 'sarande', name_sq: 'Sarandë', name_en: 'Sarandë', zone: 3, lat: 39.8756, lon: 20.0053 },
  { slug: 'kukes', name_sq: 'Kukës', name_en: 'Kukës', zone: 3, lat: 42.0769, lon: 20.4219 },
  { slug: 'peshkopi', name_sq: 'Peshkopi', name_en: 'Peshkopi', zone: 3, lat: 41.685, lon: 20.4289 },
  { slug: 'permet', name_sq: 'Përmet', name_en: 'Përmet', zone: 3, lat: 40.2336, lon: 20.3517 },
];
