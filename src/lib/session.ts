
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { type User } from './definitions';

const secretKey = process.env.SESSION_SECRET || "fallback-secret-key-for-development";
const key = new TextEncoder().encode(secretKey);

export type SessionPayload = User & {
    expires: Date;
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in 1 day
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is invalid or expired
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 1 day
  const sessionPayload: SessionPayload = { ...user, expires };

  const session = await encrypt(sessionPayload);

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  
  const session = await decrypt(sessionCookie);
  if (!session || new Date(session.expires) < new Date()) {
      // If session is invalid or expired, clear the cookie
      await deleteSession();
      return null;
  }

  return session as SessionPayload;
}

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0) });
}
