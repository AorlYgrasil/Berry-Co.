import { SignJWT, jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET || 'berry-co-demo-secret';
const secret = new TextEncoder().encode(jwtSecret);

export interface AdminPayload {
  id: string;
  name: string;
  role: 'super_admin' | 'admin' | 'staff';
}

export async function signToken(payload: AdminPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}