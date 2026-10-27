// Splits a heading into poster lines: first at commas, then greedily into lines of at most `max` characters, so a
// condensed uppercase poster keeps whole words and natural breaks ("ENERGJIA E / RINOVUESHME, / HAP PAS HAPI").
export function posterLines(text: string, max = 12): string[] {
  const lines: string[] = [];
  for (const part of text.split(/(?<=,)\s+/)) {
    let line = '';
    for (const word of part.split(/\s+/).filter(Boolean)) {
      if (line && line.length + 1 + word.length > max) {
        lines.push(line);
        line = word;
      } else line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
  }
  return lines;
}
