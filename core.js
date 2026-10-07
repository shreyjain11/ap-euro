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

export function filterAnswers(entries, query, direction) {
  const normalized = query.trim().toLocaleLowerCase();
  const text = entry => (direction === 'definition' ? entry.word : entry.definition).toLocaleLowerCase();
  return entries.filter(entry => text(entry).includes(normalized)).sort((a, b) =>
    Number(text(b).startsWith(normalized)) - Number(text(a).startsWith(normalized)));
}

export function createStudySession(entries, size, random = Math.random) {
  const remaining = shuffle(entries, random);
  let roundNumber = 0;
  return {
    get remaining() { return remaining.length; },
    get roundNumber() { return roundNumber; },
    next() {
      if (!remaining.length) return [];
      roundNumber++;
      return remaining.splice(0, size || entries.length);
    }
  };
}
