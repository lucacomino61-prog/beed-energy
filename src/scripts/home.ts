// Home choreography. Each chapter that reaches the middle of the screen becomes the live layer:
// its parts slide out along their explode vector and turn copper, the rest settle back and recede.
// After the seventh layer the house reassembles and its windows light up. All through motion.ts.
import { gsap, ScrollTrigger, motionOn, onMotionChange } from './motion';

const stage = document.querySelector<HTMLElement>('[data-stage]');
const house = document.querySelector<SVGSVGElement>('[data-house]');

type Part = { el: SVGGElement; layer: number; dx: number; dy: number };
const parts: Part[] = house
  ? [...house.querySelectorAll<SVGGElement>('.part')].map((el) => {
      const s = el.getAttribute('style') ?? '';
      const dx = Number(/--dx:\s*(-?[\d.]+)px/.exec(s)?.[1] ?? 0);
      const dy = Number(/--dy:\s*(-?[\d.]+)px/.exec(s)?.[1] ?? 0);
      return { el, layer: Number(el.dataset.layer), dx, dy };
    })
  : [];
const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
const keys = [...document.querySelectorAll<HTMLAnchorElement>('[data-key-link]')];
const caption = document.querySelector<HTMLElement>('[data-caption-layer]');
let current = 0;
let triggers: ScrollTrigger[] = [];

function setLayer(n: number) {
  if (!house || n === current) return;
  current = n;
  const live = n >= 1 && n <= 7;
  stage?.setAttribute('data-active', String(n));
  if (n === 0) stage?.removeAttribute('data-active');
  chapters.forEach((c) => c.classList.toggle('is-active', Number(c.dataset.chapter) === n));
  keys.forEach((k) => (Number(k.dataset.keyLink) === n ? k.setAttribute('aria-current', 'step') : k.removeAttribute('aria-current')));
  if (live) house.setAttribute('data-dim', '');
  else house.removeAttribute('data-dim');
  if (n === 8) house.setAttribute('data-lit', '');
  else house.removeAttribute('data-lit');
  for (const p of parts) {
    const on = p.layer === n;
    p.el.classList.toggle('is-live', on);
    gsap.to(p.el, { x: on ? p.dx : 0, y: on ? p.dy : 0, duration: on ? 0.9 : 0.6, ease: on ? 'power3.out' : 'power2.inOut', overwrite: 'auto' });
  }
  if (caption) {
    const ch = chapters.find((c) => Number(c.dataset.chapter) === n);
    caption.textContent = ch ? `${String(Math.min(n, 7)).padStart(2, '0')} · ${ch.querySelector('h2')?.textContent ?? ''}` : '';
  }
}

function build() {
  triggers.forEach((t) => t.kill());
  triggers = [];
  if (!motionOn() || !house) {
    // Static: every part shown at its exploded offset by CSS, every chapter readable. Tweens still
    // running from the last layer change would write their transform back after clearProps: kill first.
    const els = parts.map((p) => p.el);
    gsap.killTweensOf(els);
    els.forEach((el) => el.classList.remove('is-live'));
    parts.forEach((p) => gsap.set(p.el, { clearProps: 'transform' }));
    house?.removeAttribute('data-dim');
    current = -1;
    return;
  }
  parts.forEach((p) => gsap.set(p.el, { x: 0, y: 0 }));
  current = -1;
  setLayer(0);
  for (const c of chapters) {
    const n = Number(c.dataset.chapter);
    triggers.push(
      ScrollTrigger.create({
        trigger: c,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setLayer(n);
          else if (n === 1 && self.direction < 0) setLayer(0);
        },
      }),
    );
  }
  // Poster lines step in on arrival (opacity + small rise; the CTAs below never move).
  const lines = document.querySelectorAll('.stage__line');
  gsap.fromTo(lines, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: document.querySelector('[data-loader]:not([hidden])') ? 1.7 : 0.1 });
  // Manifesto: words ink in as the paragraph crosses the screen.
  const words = gsap.utils.toArray<HTMLElement>('[data-manifesto] .w');
  if (words.length) {
    triggers.push(
      ScrollTrigger.create({
        trigger: '[data-manifesto]',
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: true,
        onUpdate: (self) => {
          const lit = self.progress * words.length;
          words.forEach((w, i) => w.style.setProperty('--o', String(Math.min(1, Math.max(0.16, lit - i + 0.16)))));
        },
      }),
    );
  }
}

// The yearly production counter in the last chapter follows the chosen city.
const final = document.querySelector<HTMLElement>('[data-final]');
if (final) {
  const data: { s: string; y: number }[] = JSON.parse(final.dataset.cities ?? '[]');
  const sel = final.querySelector<HTMLSelectElement>('[data-final-city]');
  const out = final.querySelector<HTMLElement>('[data-final-num]');
  const sq = document.documentElement.lang === 'sq';
  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sq ? ' ' : ',');
  sel?.addEventListener('change', () => {
    const y = data.find((d) => d.s === sel.value)?.y ?? 0;
    if (!out) return;
    if (!motionOn()) {
      out.textContent = fmt(y);
      return;
    }
    const from = { v: Number(out.textContent?.replace(/\D/g, '') || 0) };
    gsap.to(from, { v: y, duration: 0.6, ease: 'power2.out', onUpdate: () => (out.textContent = fmt(from.v)) });
  });
}

document.addEventListener('beed:loaded', () => ScrollTrigger.refresh());
build();
onMotionChange(() => build());
