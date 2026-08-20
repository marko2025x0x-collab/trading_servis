import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a 32-byte key from master secret using SHA-256
 */
function getDerivedKey(): Buffer {
  const masterSecret = process.env.ENCRYPTION_MASTER_KEY;
  if (!masterSecret) {
    throw new Error('ENCRYPTION_MASTER_KEY is not set. Refusing to encrypt/decrypt with a default key.');
  }
  return crypto.createHash('sha256').update(masterSecret).digest();
}

export interface EncryptedPayload {
  encryptedText: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts sensitive text using AES-256-GCM (GDPR Compliant)
 */
export function encryptSensitiveData(text: string): EncryptedPayload {
  const iv = crypto.randomBytes(16);
  const key = getDerivedKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedText: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypts AES-256-GCM encrypted payload
 */
export function decryptSensitiveData(encryptedHex: string, ivHex: string, authTagHex: string): string {
  const key = getDerivedKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
