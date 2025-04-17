import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

type UserPayload = {
  id: string;
  email: string;
};

export function generateToken(id: string, email: string): string {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyJwt(): Promise<UserPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
  
    if (!token) return null;
  
    try {
      const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
      return payload;
    } catch (err) {
      console.error('JWT verification failed:', err);
      return null;
    }
  }
  


export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const user = await verifyJwt();
  return user;
}
