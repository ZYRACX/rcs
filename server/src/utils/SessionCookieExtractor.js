import { request } from "express"
import { config } from "dotenv"
config()
/**
 * 
 * @param {request} req 
 * @returns {string} The session cookie value
 */

export function extractSessionCookie(req) {
    const {APPWRITE_PROJECT_ID} = process.env
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map(c => c.split("="))
    );

    const sessionCookieName = `a_session_${APPWRITE_PROJECT_ID}_legacy` || `a_session_${APPWRITE_PROJECT_ID}`;

    return cookies[sessionCookieName] || null;
}