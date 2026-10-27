// The one animation clock. GSAP's ticker owns requestAnimationFrame; Lenis steps from it (autoRaf off).
// Every page script imports gsap/ScrollTrigger from here and asks motionOn() before animating.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

let lenis: Lenis | null = null;
const listeners = new Set<(on: boolean) => void>();

export function motionOn(): boolean {
  return document.documentElement.getAttribute('data-motion') !== 'off';
}

function lenisStep(time: number) {
  lenis?.raf(time * 1000);
}

// Form pages (basket, checkout: <html data-native-scroll>, Site.astro nativeScroll) keep the browser's own scroll:
// no smooth-scroll inertia over forms and number entry (DESIGN.md "shop pages are calm").
const nativeScroll = () => document.documentElement.hasAttribute('data-native-scroll');

function startLenis() {
  if (lenis || nativeScroll()) return;
  // anchors: no offset of our own. Lenis already subtracts html's scroll-padding-top (the header, base.css) and the
  // target's scroll-margin-top; an extra -72 put sections a whole header lower again (232 px down on the guide).
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(lenisStep);
}

// A press freezes the smooth scroll where it is. While Lenis was still easing, the page moved under the pointer
// between pointerdown and pointerup, so the click went to whatever was under it on release, not the button
// pressed (the checkout's submit "did nothing" after a wheel scroll: reproduced 5 of 6 times with a 110 ms press).
window.addEventListener(
  'pointerdown',
  () => {
    if (lenis?.isScrolling === 'smooth') lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true });
  },
  { capture: true, passive: true },
);

function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(lenisStep);
  lenis.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}

/** Switch every moving part on or off: smooth scroll, GSAP tweens, ScrollTriggers (pages listen and rebuild). */
export function setMotion(on: boolean, persist = true) {
  const d = document.documentElement;
  d.setAttribute('data-motion', on ? 'on' : 'off');
  if (persist) {
    try {
      localStorage.setItem('beed-motion', on ? 'on' : 'off');
    } catch {
      /* private mode */
    }
  }
  if (on) {
    ScrollTrigger.enable();
    startLenis();
  } else stopLenis();
  listeners.forEach((fn) => fn(on));
  if (on) ScrollTrigger.refresh();
  // With motion off nothing scrolls by script: disabling ScrollTrigger also ends its idle rAF check.
  else ScrollTrigger.disable(false);
}

export function onMotionChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Touch devices keep native scrolling (Lenis leaves touch alone by default); pointer devices get the smooth wheel.
if (motionOn()) startLenis();
else ScrollTrigger.disable(false);

export { gsap, ScrollTrigger };
