import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for secure authentication');
}

export async function createToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function validateCredentials(username, password) {
  // Check username first
  if (username !== process.env.ADMIN_USERNAME) {
    return false;
  }

  // Validate password using bcrypt
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
  }

  const isPasswordValid = await bcrypt.compare(password, storedHash);
  return isPasswordValid;
}

// Helper function to generate password hash for setup
export async function generatePasswordHash(password, rounds = 12) {
  return await bcrypt.hash(password, rounds);
}
