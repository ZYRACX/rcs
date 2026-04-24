import test from 'node:test';
import assert from 'node:assert/strict';

import RandomItemPicker from '../src/utils/randomItemPicker.js';

test('RandomItemPicker throws for invalid inputs', () => {
  assert.throws(() => RandomItemPicker([], 0, 100), /itemList must be a non-empty array/);
  assert.throws(() => RandomItemPicker([{ $id: 'i1', chanceOfGetting: 1 }], -1, 100), /minimumRange cannot be negative/);
  assert.throws(() => RandomItemPicker([{ $id: 'i1', chanceOfGetting: 1 }], 0, 99), /maximumRange must be at least 100/);
  assert.throws(() => RandomItemPicker([{ $id: 'i1', chanceOfGetting: 1 }], 100, 100), /minimumRange must be smaller than maximumRange/);
});

test('RandomItemPicker returns picks within roll range', () => {
  const originalRandom = Math.random;
  const values = [0, 0.0, 0.9];
  let index = 0;
  Math.random = () => values[index++] ?? 0;

  const result = RandomItemPicker(
    [
      { $id: 'common', chanceOfGetting: 80 },
      { $id: 'rare', chanceOfGetting: 20 }
    ],
    100,
    101
  );

  Math.random = originalRandom;

  assert.equal(result.length, 100);
  assert.equal(result[0], 'common');
  assert.equal(result[1], 'rare');
  assert.ok(result.every((itemId) => itemId === 'common' || itemId === 'rare'));
});
