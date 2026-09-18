const crypto = require('crypto');

// Generate 32 bytes cryptographically secure string
const generateOAuthState = () => {
  return crypto.randomBytes(32).toString('hex');
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const ALGORITHM = 'aes-256-gcm';

// We'll throw an error on boot if key is invalid, so it fails fast
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
  console.warn('WARNING: ENCRYPTION_KEY is not set or invalid (must be 32 bytes hex). Tokens will NOT be encrypted.');
}

const encrypt = (text) => {
  if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) return text;
  
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedText
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return encryptedText; // Probably not encrypted
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const text = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

module.exports = {
  generateOAuthState,
  encrypt,
  decrypt
};
