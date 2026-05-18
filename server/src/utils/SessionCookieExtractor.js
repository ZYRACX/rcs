import { request } from "express";

/**
 * @param {request} req
 * @returns {string|null}
 */
export function extractSessionCookie(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(cookieHeader.split("; ").map((c) => c.split("=")));
  return cookies["sb-access-token"] || null;
}
