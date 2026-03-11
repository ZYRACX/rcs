# Authentication System

Authentication is handled using Appwrite sessions.

## Login Flow

1. Player logs in using Appwrite.
2. Appwrite creates a session cookie.
3. Browser sends the cookie with API requests.
4. Server extracts the cookie and creates an authenticated Appwrite client.

## Session Extraction

Utility used:

```
utils/SessionCookieExtractor.js
```

Example:

```javascript
const session = extractSessionCookie(req);
```

This session is then used to create an Appwrite client.

## Authenticated Requests

All protected API routes require a valid session cookie.

Example:

```
GET /inventory
```

If the session is invalid, the server returns:

```
401 Unauthorized
```
