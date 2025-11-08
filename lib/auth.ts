import { cookies } from 'next/headers';
// `jsonwebtoken` types may not be available until dependencies are installed in the workspace.
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'session';

export type SessionPayload = {
  userId: string;
  email?: string | null;
  name?: string | null;
};

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (err) {
    return null;
  }
}

export function createSessionCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const secure = process.env.NODE_ENV === 'production';
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` + (secure ? '; Secure' : '');
  return cookie;
}

export function getSessionFromRequest() {
  // `cookies()` can be typed differently in various Next.js versions; cast to any to be resilient here.
  const cookieStore: any = cookies();
  const token = cookieStore?.get?.(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function clearSessionCookie() {
  // set cookie with max-age=0 to clear
  const secure = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` + (secure ? '; Secure' : '');
}
