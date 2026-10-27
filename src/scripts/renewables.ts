// Guide and packages pages. Every tween goes through motion.ts (GSAP's ticker, the one requestAnimationFrame owner),
// asks motionOn() first and leaves forms, prices and tap targets alone:
//  - the poster lines rise into place once (text only, not links or buttons), only if nothing has been painted yet;
//  - the leader lines on the guide's sheet draw from the module to their labels, on the same condition;
//  - each package's panel array is assembled panel by panel the first time it scrolls into view (the drawing only);
//  - the guide's section index marks the section being read (aria-current="location"), via ScrollTrigger.
import { gsap, motionOn, onMotionChange, ScrollTrigger } from './motion';

const reduced = () => !motionOn();
// The first screen is never taken away once the browser has shown it: when this module arrives after the first paint
// (a slow network), the poster and the guide's sheet stay as they are instead of vanishing and rising in again
// (site.ts skips first-screen reveals for the same reason). Browsers without paint timing keep the entrance.
const painted = () => performance.getEntriesByName('first-contentful-paint').length > 0;
const firstScreenStill = !painted();

// ---------- poster ----------
const poster = document.querySelector<HTMLElement>('[data-rn-poster]');
if (poster && !reduced() && firstScreenStill) {
  gsap.fromTo(
    poster.querySelectorAll('.rn-poster__line'),
    { opacity: 0, yPercent: 40 },
    { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.05, clearProps: 'opacity,transform' },
  );
}

// ---------- leader lines on the guide's sheet ----------
const leaders = document.querySelectorAll<SVGElement>('[data-rn-leader]');
if (leaders.length && !reduced() && firstScreenStill) {
  // polylines with pathLength 1 and dasharray 1 (renewables.css), listed from the label to the module: drawn that way
  gsap.fromTo(leaders, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power2.inOut', delay: 0.35, clearProps: 'strokeDashoffset' });
  gsap.fromTo('[data-rn-callout]', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.12, ease: 'power1.out', delay: 0.75, clearProps: 'opacity' });
}

// ---------- package arrays: assembled once, in view ----------
function assemble() {
  if (reduced()) return;
  document.querySelectorAll<SVGSVGElement>('[data-rn-array]').forEach((svg) => {
    const panels = svg.querySelectorAll<SVGGElement>('.pk__panel');
    if (!panels.length || svg.getBoundingClientRect().top < innerHeight * 0.9) return;
    gsap.fromTo(
      panels,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.22,
        ease: 'power1.out',
        stagger: { each: Math.min(0.05, 0.9 / panels.length) },
        clearProps: 'opacity',
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
      },
    );
  });
}
assemble();

// ---------- guide: the section being read, marked in the index ----------
const indexLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-rn-index] a[href^="#"]')];
const triggers: ScrollTrigger[] = [];
function watchIndex() {
  triggers.splice(0).forEach((t) => t.kill());
  if (!indexLinks.length || reduced()) return;
  // Two levels: the six sections and, inside 05, the equipment parts; each level marks one link at a time.
  const levelOf = new Map<HTMLAnchorElement, 'section' | 'part'>();
  for (const a of indexLinks) {
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target) continue;
    const level = target.matches('[data-rn-section]') ? 'section' : target.matches('[data-rn-part]') ? 'part' : null;
    if (!level) continue;
    levelOf.set(a, level);
    triggers.push(
      ScrollTrigger.create({
        trigger: target,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) {
            levelOf.forEach((l, link) => l === level && link !== a && link.removeAttribute('aria-current'));
            a.setAttribute('aria-current', 'location');
          } else a.removeAttribute('aria-current');
        },
      }),
    );
  }
}
watchIndex();

onMotionChange((on) => {
  if (!on) {
    triggers.splice(0).forEach((t) => t.kill());
    indexLinks.forEach((a) => a.removeAttribute('aria-current'));
    gsap.set('.rn-poster__line, [data-rn-callout], .pk__panel', { clearProps: 'opacity,transform' });
    gsap.set('[data-rn-leader]', { clearProps: 'strokeDashoffset' });
  } else watchIndex();
});
