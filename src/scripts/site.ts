// Shell behaviour on every public page: energy-saving switch, menu dialog, header hide on scroll,
// basket and compare forms without reloads, toasts, the once-per-session loader and simple reveals.
import { gsap, motionOn, setMotion, onMotionChange, ScrollTrigger } from './motion';

const root = document.documentElement;
const toasts = document.querySelector<HTMLElement>('[data-toasts]');
const msg: Record<string, string> = toasts ? JSON.parse(toasts.dataset.msg ?? '{}') : {};

// ---------- energy-saving switch ----------
const savers = [...document.querySelectorAll<HTMLButtonElement>('[data-saver]')];
const paintSavers = () => savers.forEach((b) => b.setAttribute('aria-pressed', String(!motionOn())));
paintSavers();
savers.forEach((b) =>
  b.addEventListener('click', () => {
    setMotion(!motionOn());
    paintSavers();
    toast(motionOn() ? msg.saverOff : msg.saverOn);
  }),
);

// ---------- toasts ----------
export function toast(text: string, link?: { href: string; label: string }) {
  if (!toasts || !text) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    el.append(a);
  }
  toasts.append(el);
  setTimeout(() => el.remove(), 4200);
}

// ---------- menu (a modal dialog: focus trapped, Esc closes, focus returns) ----------
const menu = document.querySelector<HTMLElement>('[data-menu]');
const openers = [...document.querySelectorAll<HTMLButtonElement>('[data-menu-open]')];
let lastOpener: HTMLElement | null = null;
function openMenu(from: HTMLElement) {
  if (!menu) return;
  lastOpener = from;
  menu.hidden = false;
  openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
  root.style.overflow = 'hidden';
  if (motionOn()) {
    gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.42, ease: 'power3.out' });
    gsap.fromTo(menu.querySelectorAll('.menu__cat, .menu__big a'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.018, ease: 'power2.out', delay: 0.08 });
  }
  menu.querySelector<HTMLElement>('[data-menu-close]')?.focus();
}
function closeMenu() {
  if (!menu || menu.hidden) return;
  const done = () => {
    menu.hidden = true;
    root.style.overflow = '';
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    lastOpener?.focus();
  };
  if (motionOn()) gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.28, ease: 'power2.in', onComplete: done });
  else done();
}
openers.forEach((b) => b.addEventListener('click', () => openMenu(b)));
menu?.querySelector('[data-menu-close]')?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
  if (!menu || menu.hidden) return;
  if (e.key === 'Escape') closeMenu();
  if (e.key === 'Tab') {
    const f = [...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// ---------- header hides while reading down, returns on the way up ----------
let lastY = window.scrollY;
window.addEventListener(
  'scroll',
  () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 6) return;
    root.setAttribute('data-header', y > lastY && y > 240 && !document.body.hasAttribute('data-keep-header') ? 'hidden' : 'shown');
    lastY = y;
  },
  { passive: true },
);

// ---------- counts ----------
function setCount(sel: string, n: number) {
  document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
    el.dataset.zero = n === 0 ? 'true' : 'false';
    const v = el.querySelector('[data-n]');
    if (v) v.textContent = String(n);
    const sr = el.querySelector('.visually-hidden');
    if (sr && sel === '[data-cart-count]') sr.textContent = `${n} ${msg.cartCount ?? ''}`;
    if (motionOn()) gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  });
}

// ---------- basket forms: <form data-cart-form method=post action=/api/cart> ----------
document.addEventListener('submit', async (e) => {
  const form = e.target as HTMLFormElement;
  if (!form.matches('[data-cart-form], [data-compare-form]')) return;
  e.preventDefault();
  const isCart = form.matches('[data-cart-form]');
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit], button:not([type])');
  const fd = new FormData(form, (e as SubmitEvent).submitter ?? undefined);
  const body = Object.fromEntries(fd.entries());
  btn?.setAttribute('aria-busy', 'true');
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (isCart) {
      setCount('[data-cart-count]', data.count);
      document.dispatchEvent(new CustomEvent('beed:cart', { detail: data }));
      if (body.action === 'add' || !body.action) toast(msg.added, { href: msg.cartHref, label: msg.view });
    } else {
      setCount('[data-compare-count]', data.ids.length);
      renderTray(data);
      document.dispatchEvent(new CustomEvent('beed:compare', { detail: data }));
      if (data.note === 'full') toast(msg.full);
      else if (data.note === 'reset') toast(msg.reset);
      else if (body.action !== 'remove' && body.action !== 'clear' && data.ids.includes(Number(body.productId))) toast(msg.compared, { href: `${msg.compareHref}?p=${data.ids.join(',')}`, label: '→' });
    }
  } catch {
    toast(msg.error);
  } finally {
    btn?.removeAttribute('aria-busy');
  }
});

function renderTray(data: { ids: number[]; items: { id: number; brand: string; model: string }[] }) {
  const tray = document.querySelector<HTMLElement>('[data-tray]');
  if (!tray) return;
  const list = tray.querySelector<HTMLElement>('[data-tray-items]')!;
  const removeLabel = tray.dataset.labelRemove ?? '✕';
  list.replaceChildren(
    ...data.items.map((p) => {
      const span = document.createElement('span');
      span.className = 'tray__item';
      span.append(`${p.brand} ${p.model}`);
      const f = document.createElement('form');
      f.method = 'post';
      f.action = '/api/compare';
      f.setAttribute('data-compare-form', '');
      f.innerHTML = `<input type="hidden" name="action" value="remove"><input type="hidden" name="productId" value="${p.id}"><button type="submit">✕</button>`;
      f.querySelector('button')!.setAttribute('aria-label', `${removeLabel}: ${p.brand} ${p.model}`);
      span.append(f);
      return span;
    }),
  );
  tray.querySelector('[data-tray-n]')!.textContent = String(data.items.length);
  const go = tray.querySelector<HTMLAnchorElement>('[data-tray-go]');
  if (go) go.href = `${msg.compareHref}?p=${data.ids.join(',')}`;
  const hiddenByPage = document.body.hasAttribute('data-no-tray');
  tray.hidden = hiddenByPage || data.items.length === 0;
  if (!tray.hidden && motionOn()) gsap.fromTo(tray, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });
}

// ---------- reveals: [data-reveal] fade-rise once; never on tap targets inside the first screen ----------
function reveals() {
  if (!motionOn()) return;
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  // Dimension lines draw themselves: [data-draw] svg paths/lines with pathLength.
  gsap.utils.toArray<SVGElement>('[data-draw] line, [data-draw] path, [data-draw] rect, [data-draw] circle').forEach((p) => p.setAttribute('pathLength', '1'));
}
reveals();
onMotionChange((on) => {
  if (!on) {
    ScrollTrigger.getAll().forEach((st) => st.vars.once && st.kill());
    gsap.set('[data-reveal]', { clearProps: 'opacity,transform' });
  }
});

// ---------- loader: home only, once per session, ≤ 1.6 s, hard time-out 2.5 s ----------
const loader = document.querySelector<HTMLElement>('[data-loader]');
if (loader) {
  let seen = false;
  try { seen = sessionStorage.getItem('beed-loader') === '1'; } catch { /* ignore */ }
  if (!seen && motionOn() && !location.hash) runLoader(loader);
}
function runLoader(el: HTMLElement) {
  try { sessionStorage.setItem('beed-loader', '1'); } catch { /* ignore */ }
  el.hidden = false;
  el.removeAttribute('aria-hidden');
  root.style.overflow = 'hidden';
  const words = [...el.querySelectorAll<HTMLElement>('[data-loader-word] span')];
  const pct = el.querySelector<HTMLElement>('[data-loader-pct]');
  const line = el.querySelector<HTMLElement>('[data-loader-line]');
  const counter = { v: 0 };
  const tl = gsap.timeline({ onComplete: finish });
  gsap.set(words, { yPercent: 100 });
  gsap.set(words[0], { yPercent: 0 });
  tl.to(counter, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { if (pct) pct.textContent = `${Math.round(counter.v)}%`; } }, 0);
  tl.to(line, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0);
  words.forEach((w, i) => {
    if (i === 0) return;
    tl.to(words[i - 1], { yPercent: -100, duration: 0.26, ease: 'power3.in' }, 0.22 * i);
    tl.to(w, { yPercent: 0, duration: 0.3, ease: 'power3.out' }, 0.22 * i + 0.08);
  });
  tl.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.45, ease: 'power3.inOut' }, '+=0.1');
  const timeout = setTimeout(finish, 2500);
  el.querySelector('[data-loader-skip]')?.addEventListener('click', finish);
  function finish() {
    clearTimeout(timeout);
    tl.kill();
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    root.style.overflow = '';
    document.dispatchEvent(new Event('beed:loaded'));
    ScrollTrigger.refresh();
  }
}
