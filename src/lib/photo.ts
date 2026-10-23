// A product's photo, or, until it has one, its brand and model set as type in the same box. This
// replaced the generated line drawings: every product picture on the shop side goes through here or
// through ProductPhoto.astro, which renders the same markup for templates.

export type PhotoInput = {
  src: string | null | undefined;
  brand: string;
  model: string;
  /** Empty for a decorative picture next to the product's own name (cards, basket lines). */
  alt?: string;
  width?: number | null;
  height?: number | null;
  eager?: boolean;
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** HTML for places that build markup as a string (basket and order lines). */
export function photoHtml(p: PhotoInput): string {
  const alt = p.alt ?? '';
  if (p.src) {
    const size = p.width && p.height ? ` width="${p.width}" height="${p.height}"` : '';
    return `<img class="ph" src="${esc(p.src)}" alt="${esc(alt)}"${size} ${p.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;
  }
  const label = alt ? ` role="img" aria-label="${esc(alt)}"` : ' aria-hidden="true"';
  return `<span class="ph ph--none"${label}><b translate="no">${esc(p.brand)}</b><span translate="no">${esc(p.model)}</span></span>`;
}
