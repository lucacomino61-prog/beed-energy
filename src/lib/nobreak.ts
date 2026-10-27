// Albanian acronyms take their case ending after a hyphen (ERE-s, OSHEE-së, TVSH-në, FSHU-së). A line must never
// end on "ERE-" with "s" on the next one, so at render time a WORD JOINER (U+2060, invisible, no break on either side)
// goes after that hyphen. Not U+2011 NON-BREAKING HYPHEN: neither Archivo nor Geist Mono (public/fonts) has that
// glyph, so it would be drawn from a fallback font. Only an all-capital word of 2+ letters followed by a 1–4 letter
// lower-case ending is touched, so ordinary hyphenated words ("on-grid", "PV-mounted") keep their break.
const WORD_JOINER = String.fromCharCode(0x2060);
const ACRONYM_CASE = /(?<![A-Za-zËÇëç])([A-ZËÇ]{2,})-([a-zëç]{1,4})(?![A-Za-zËÇëç])/g;

export const keepAcronyms = (text: string): string =>
  text.replace(ACRONYM_CASE, (_m, word: string, ending: string) => `${word}-${WORD_JOINER}${ending}`);
