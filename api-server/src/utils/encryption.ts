import crypto from "crypto";

const ALGORITHM = "aes-256-ecb";
const ENCODING = "utf8";
const OUTPUT_FORMAT = "hex";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables");
  }
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes for AES-256");
  }
  return Buffer.from(key, "utf8");
}

export function encrypt(data: string): string {
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, null);
  let encrypted = cipher.update(data, ENCODING, OUTPUT_FORMAT);
  encrypted += cipher.final(OUTPUT_FORMAT);
  return encrypted;
}

export function decrypt(encryptedData: string): string {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, null);
  let decrypted = decipher.update(encryptedData, OUTPUT_FORMAT, ENCODING);
  decrypted += decipher.final(ENCODING);
  return decrypted;
}
