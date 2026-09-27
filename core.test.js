import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGlossary, shuffle, isCorrect, validateSavedSet } from './core.js';
test('import preserves definitions including colons and later separators', () => {
  const entries = parseGlossary('First\tA meaning: with :: details\r\nSecond — A meaning — with detail');
  assert.equal(entries[0].definition, 'A meaning: with :: details');
  assert.equal(entries[1].definition, 'A meaning — with detail');
});
test('alternating imports and invalid or duplicate input', () => {
  assert.equal(parseGlossary('One\nFirst definition\nTwo\nSecond definition', 'alternating').length, 2);
  assert.throws(() => parseGlossary('One\nDefinition\nTwo', 'alternating'), /no matching definition/);
  assert.throws(() => parseGlossary('One :: First\nBroken line'), /Line 2/);
  assert.throws(() => parseGlossary('One :: First\none :: Second'), /more than once/);
  assert.throws(() => parseGlossary('One :: First'), /at least two/);
});
test('grading handles blanks, wrong selections, both directions and equivalent definitions', () => {
  const entries = parseGlossary('One :: Same\nTwo :: Same\nThree :: Different');
  assert.equal(isCorrect(entries[0], '', 'definition', entries), false);
  assert.equal(isCorrect(entries[0], '2', 'definition', entries), false);
  assert.equal(isCorrect(entries[0], '1', 'definition', entries), true);
  assert.equal(isCorrect(entries[0], '2', 'term', entries), true);
  assert.equal(isCorrect(entries[0], '3', 'term', entries), false);
});
test('saved set validation and shuffle preserve all entries without mutating input', () => {
  const entries = parseGlossary('One :: First\nTwo :: Second\nThree :: Third');
  const initial = structuredClone(entries);
  assert.deepEqual(shuffle(entries, () => 0).map(item => item.id).sort(), ['1', '2', '3']);
  assert.deepEqual(entries, initial);
  assert.equal(validateSavedSet({ name: 'Test', entries }), true);
  assert.equal(validateSavedSet({ name: 'Bad', entries: [{ id: '1' }] }), false);
});
