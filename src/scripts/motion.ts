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

function startLenis() {
  if (lenis) return;
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(lenisStep);
}

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
