import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(stored: string, supplied: string) {
  return await bcrypt.compare(supplied, stored);
}
