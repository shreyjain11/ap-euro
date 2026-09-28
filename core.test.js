import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, isCorrect, filterAnswers } from './core.js';
import { periods } from './periods.js';

test('exactly the three supplied periods, with complete unique pairs', () => {
  assert.deepEqual(periods.map(p => [p.id, p.entries.length]), [['2', 34], ['3', 53], ['5', 32]]);
  for (const period of periods) {
    assert.equal(new Set(period.entries.map(e => e.id)).size, period.entries.length);
    assert.equal(new Set(period.entries.map(e => e.word)).size, period.entries.length);
    assert.ok(period.entries.every(e => e.word && e.definition && e.id.startsWith(period.id + '-')));
  }
});
test('grading uses only entries from the active period in both directions', () => {
  for (const period of periods) {
    const entry = period.entries[0];
    assert.equal(isCorrect(entry, entry.id, 'definition', period.entries), true);
    assert.equal(isCorrect(entry, entry.id, 'term', period.entries), true);
    assert.equal(isCorrect(entry, '', 'definition', period.entries), false);
    assert.equal(isCorrect(entry, period.entries[1].id, 'definition', period.entries), false);
    const other = periods.find(p => p.id !== period.id);
    assert.equal(isCorrect(entry, other.entries[0].id, 'definition', period.entries), false);
  }
});
test('shuffle preserves the complete selected period without changing source order', () => {
  for (const period of periods) {
    const before = structuredClone(period.entries);
    const after = shuffle(period.entries, () => 0);
    assert.deepEqual(after.map(e => e.id).sort(), before.map(e => e.id).sort());
    assert.deepEqual(period.entries, before);
  }
});

test('search is case-insensitive, prioritizes prefixes, and stays inside the round', () => {
  const entries = [{id:'a',word:'John Calvin',definition:'A reformer'}, {id:'b',word:'Calvinism',definition:'A religious belief'}];
  assert.deepEqual(filterAnswers(entries, ' CAL ', 'definition').map(e => e.id), ['b','a']);
  assert.deepEqual(filterAnswers(entries, 'reformer', 'term').map(e => e.id), ['a']);
  assert.deepEqual(filterAnswers(entries, 'unknown', 'definition'), []);
  assert.deepEqual(filterAnswers(entries, '', 'definition'), entries);
  assert.deepEqual(filterAnswers([entries[0]], 'cal', 'definition').map(e => e.id), ['a']);
});
