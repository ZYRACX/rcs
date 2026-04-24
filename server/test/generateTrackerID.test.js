import test from 'node:test';
import assert from 'node:assert/strict';

import generateTrackerID from '../src/utils/generateTrackerID.js';

test('generateTrackerID returns a non-empty string', () => {
  const trackerId = generateTrackerID();

  assert.equal(typeof trackerId, 'string');
  assert.ok(trackerId.length > 0);
});

test('generateTrackerID usually produces different values', () => {
  const first = generateTrackerID();
  const second = generateTrackerID();

  assert.notEqual(first, second);
});
