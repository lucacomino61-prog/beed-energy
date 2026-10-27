// The renewable-energy navigation (docs/renewable-focus-plan.md §2, §6): which shelves the header links stand for,
// the sibling shelves shown on a category page, the guide part each energy shelf deep-links to, and the two display
// groups of the menu, footer and shop landing. Shelves are named here by categories.slug_en only to find their
// database rows; every link is built from the row's own slug_sq / slug_en.
import type { Category } from './catalog';
import { href, type Lang } from './i18n';

/** Header links to shelves, in plan order: the shelf linked, and the shelves for which it is the current page. */
export const HEADER_SHELVES = [
  { label: 'solar', shelf: 'solar-panels', current: ['solar-panels', 'inverters', 'mounting-systems', 'pv-accessories', 'energy-monitoring'] },
  { label: 'storage', shelf: 'batteries', current: ['batteries'] },
  { label: 'heatPumps', shelf: 'heat-pumps', current: ['heat-pumps', 'solar-water-heaters'] },
  { label: 'ev', shelf: 'ev-chargers', current: ['ev-chargers'] },
] as const;

/** Shelf families shown as a row of sibling links on each other's category pages (plan §2), in this order. */
export const SIBLING_GROUPS: { label: 'solar' | 'heatPumps'; shelves: string[] }[] = [
  { label: 'solar', shelves: ['solar-panels', 'inverters', 'mounting-systems', 'pv-accessories', 'energy-monitoring'] },
  { label: 'heatPumps', shelves: ['heat-pumps', 'solar-water-heaters'] },
];

/** The guide part each energy shelf's "read more" link opens (ids in src/views/Guide.astro). */
export const GUIDE_PART: Record<string, string> = {
  'solar-panels': 'panels',
  'mounting-systems': 'panels',
  'pv-accessories': 'panels',
  inverters: 'inverters',
  batteries: 'batteries',
  'heat-pumps': 'heat-pumps',
  'solar-water-heaters': 'solar-water-heaters',
  'ev-chargers': 'ev-charging',
  'energy-monitoring': 'self-producer',
};

/** The database keeps three group keys; the site shows two groups: renewable energy, then efficiency + building. */
export type DisplayGroup = 'energy' | 'efficiency-build';
export const DISPLAY_GROUPS: DisplayGroup[] = ['energy', 'efficiency-build'];
export const displayGroup = (groupKey: string): DisplayGroup => (groupKey === 'energy' ? 'energy' : 'efficiency-build');

/** Active categories split into the two display groups, each in categories.sort order. */
export function groupCategories<C extends Pick<Category, 'group_key'>>(cats: C[]): { key: DisplayGroup; cats: C[] }[] {
  return DISPLAY_GROUPS.map((key) => ({ key, cats: cats.filter((c) => displayGroup(c.group_key) === key) })).filter((g) => g.cats.length);
}

export const categoryHref = (lang: Lang, c: Pick<Category, 'slug_sq' | 'slug_en'>) => href(lang, 'category', { slug: lang === 'sq' ? c.slug_sq : c.slug_en });
export const categoryName = (lang: Lang, c: Pick<Category, 'name_sq' | 'name_en'>) => (lang === 'sq' ? c.name_sq : c.name_en);
