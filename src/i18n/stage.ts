import type { Lang } from '../lib/i18n';

// The home stage's realistic house: what is said on and about the render (ASSETS.md: AI illustration, not a photo).
// The copy (drawingTitle, drawingAlt, chapters) lives in home.ts and content/story.ts.
export const stage = {
  sq: {
    stamp: 'Ilustrim i krijuar me AI · jo fotografi',
    shopLink: 'Në dyqan',
  },
  en: {
    stamp: 'AI-generated illustration · not a photo',
    shopLink: 'In the shop',
  },
} as const;

export const ts = (lang: Lang) => stage[lang];
