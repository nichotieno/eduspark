import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { type User } from './definitions';

// For development, we use a hardcoded secret. For production, this should be
// securely managed as an environment variable from a secrets manager.
// Using a hardcoded key here to ensure consistency between Edge and Node runtimes
// in this specific development environment.
const secretKey = "AIzaSyDAyahmUbo2M4m6POx-3kI0OAOz8SYHtuk";
const key = new TextEncoder().encode(secretKey);

// The SessionPayload no longer needs a custom expires field.
// `jose` handles expiration with the standard `exp` claim.
export type SessionPayload = User;

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in 1 day, this sets the 'exp' claim
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    // jwtVerify automatically checks the 'exp' claim and throws if it's expired.
    return payload;
  } catch (error) {
    // This will catch errors from an invalid signature or an expired token.
    // console.log("Error decrypting session:", error);
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 1 day
  
  // We only pass the user data to the session payload.
  const session = await encrypt({ ...user });

  // The cookie itself needs an expiration date.
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

  // If decrypt returns null, it means the token is invalid or expired.
  // In that case, we ensure the cookie is deleted.
  if (!session) {
      await deleteSession();
      return null;
  }

  return session as SessionPayload;
}

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0) });
}
