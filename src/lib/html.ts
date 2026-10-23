// JSON that goes inside a <script> element through set:html. JSON.stringify alone leaves "</script>"
// and "<!--" intact, so a seller name like "</script><script>…" would end the element and run as code.
// Escaping <, > and & as backslash-u escapes keeps the JSON identical once parsed; the line and
// paragraph separators (U+2028, U+2029) are escaped too because older JavaScript parsers end lines there.
const BS = String.fromCharCode(92); // a backslash, spelled out so no tool or editor turns it into a control character
const escapeOf = (code: number) => `${BS}u${code.toString(16).padStart(4, '0')}`;
const UNSAFE = new RegExp(`[<>&${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`, 'g');

export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(UNSAFE, (c) => escapeOf(c.charCodeAt(0)));
}

/** Names that end up in HTML, JSON-LD and e-mails: no angle brackets at all. */
export const hasAngle = (s: string) => /[<>]/.test(s);
