// Header and dock counters (basket, compare): the visible number, its screen-reader sentence and a small stamp.
// The sentences come from the layout's toast words (singular and plural, see Site.astro data-msg), so a screen
// reader never hears the count from page load after the basket or the compare list changed.
import { gsap, motionOn } from './motion';

type Kind = 'cart' | 'compare';
const SEL: Record<Kind, string> = { cart: '[data-cart-count]', compare: '[data-compare-count]' };

function words(): Record<string, string> {
  try {
    return JSON.parse(document.querySelector<HTMLElement>('[data-toasts]')?.dataset.msg ?? '{}');
  } catch {
    return {};
  }
}

/** The page's own singular/plural sentence for n; without it, the old sentence with its leading number replaced. */
function sentence(kind: Kind, n: number, old: string): string {
  const w = words();
  const one = w[kind === 'cart' ? 'srCart1' : 'srCompare1'];
  const many = w[kind === 'cart' ? 'srCartN' : 'srCompareN'];
  if (one && many) return n === 1 ? one : many.replace('{n}', String(n));
  return /^\d+/.test(old) ? old.replace(/^\d+/, String(n)) : `${n} ${old}`;
}

export function setCount(kind: Kind, n: number, stamp = true) {
  document.querySelectorAll<HTMLElement>(SEL[kind]).forEach((el) => {
    el.dataset.zero = n === 0 ? 'true' : 'false';
    const v = el.querySelector('[data-n]');
    if (v) v.textContent = String(n);
    const sr = el.querySelector('.visually-hidden');
    if (sr) sr.textContent = sentence(kind, n, sr.textContent ?? '');
    if (stamp && motionOn()) gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  });
}
