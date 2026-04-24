import test from 'node:test';
import assert from 'node:assert/strict';

import { extractSessionCookie } from '../src/utils/SessionCookieExtractor.js';

test('extractSessionCookie returns null when no cookie header', () => {
  process.env.APPWRITE_PROJECT_ID = 'proj123';
  const req = { headers: {} };
  assert.equal(extractSessionCookie(req), null);
});

test('extractSessionCookie returns legacy session cookie value', () => {
  process.env.APPWRITE_PROJECT_ID = 'proj123';
  const req = {
    headers: {
      cookie: 'foo=bar; a_session_proj123_legacy=session-value; another=value'
    }
  };

  assert.equal(extractSessionCookie(req), 'session-value');
});

test('extractSessionCookie returns null when expected cookie is missing', () => {
  process.env.APPWRITE_PROJECT_ID = 'proj123';
  const req = {
    headers: {
      cookie: 'foo=bar; a_session_proj123=non-legacy-value'
    }
  };

  assert.equal(extractSessionCookie(req), null);
});
