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
