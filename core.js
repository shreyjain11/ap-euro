export function parseGlossary(text, format = 'auto') {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).map((value, index) => ({ value: value.trim(), line: index + 1 })).filter(item => item.value);
  if (!lines.length) throw new Error('Paste at least two terms and their definitions.');
  const entries = [];
  const errors = [];
  if (format === 'alternating') {
    if (lines.length % 2 !== 0) throw new Error(`Line ${lines.at(-1).line} has no matching definition. Each term needs a definition on the next line.`);
    for (let i = 0; i < lines.length; i += 2) entries.push({ word: lines[i].value, definition: lines[i + 1].value });
  } else {
    for (const { value, line } of lines) {
      const match = /\t+|\s*::\s*|\s+[—–-]\s+/.exec(value);
      if (!match) { errors.push(`Line ${line}: separate the term and definition with a tab or ::.`); continue; }
      const word = value.slice(0, match.index).trim();
      const definition = value.slice(match.index + match[0].length).trim();
      if (!word || !definition) errors.push(`Line ${line}: both a term and definition are required.`);
      else entries.push({ word, definition });
    }
  }
  if (errors.length) throw new Error(errors.slice(0, 4).join('\n') + (errors.length > 4 ? `\n…and ${errors.length - 4} more lines to fix.` : ''));
  if (entries.length < 2) throw new Error('Add at least two terms to make a matching round.');
  if (entries.length > 1000) throw new Error('Please split this into sets of 1,000 terms or fewer.');
  const seen = new Set();
  return entries.map((entry, index) => {
    const key = entry.word.toLocaleLowerCase();
    if (seen.has(key)) throw new Error(`“${entry.word}” appears more than once. Give each term a unique name.`);
    seen.add(key);
    return { id: String(index + 1), ...entry };
  });
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function isCorrect(entry, selectedId, direction, entries) {
  const selected = entries.find(item => item.id === selectedId);
  if (!selected) return false;
  return direction === 'definition' ? selected.word === entry.word : selected.definition === entry.definition;
}

export function validateSavedSet(value) {
  return Boolean(value && typeof value.name === 'string' && Array.isArray(value.entries) && value.entries.length >= 2 && value.entries.length <= 1000 && value.entries.every(entry => entry && typeof entry.id === 'string' && typeof entry.word === 'string' && entry.word.trim() && typeof entry.definition === 'string' && entry.definition.trim()) && new Set(value.entries.map(entry => entry.id)).size === value.entries.length);
}
