import crypto from 'crypto';

export function generateApiKey(): string {
  return `es_${crypto.randomBytes(32).toString('hex')}`;
}
