import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getVouchHmacSecret } from '@/lib/env';

export interface VouchSignPayload {
  vouchCode: string;
  alumUserId: string;
  projectId: string | null;
  issuedAt: string;
  quote?: string;
}

/**
 * Generates a unique, human-shareable ITER Vouch Certificate code (`SOA-VOUCH-YYYY-XXXX`).
 */
export function generateVouchCode(year = new Date().getFullYear()): string {
  const token = randomBytes(2).toString('hex').toUpperCase();
  return `SOA-VOUCH-${year}-${token}`;
}

function buildCanonicalVouchMessage(payload: VouchSignPayload): string {
  return [
    payload.vouchCode.trim().toUpperCase(),
    payload.alumUserId.trim(),
    payload.projectId?.trim() ?? '',
    payload.issuedAt.trim(),
    payload.quote?.trim() ?? '',
  ].join('|');
}

/**
 * Produces a deterministic HMAC-SHA256 signature digest for a Vouch certificate.
 */
export function signVouchCertificate(payload: VouchSignPayload): string {
  const secret = getVouchHmacSecret();
  const message = buildCanonicalVouchMessage(payload);
  const hex = createHmac('sha256', secret).update(message, 'utf8').digest('hex');
  return `sha256:${hex}`;
}

/**
 * Constant-time verification of a Vouch certificate HMAC-SHA256 digest.
 */
export function verifyVouchSignature(
  payload: VouchSignPayload & { signatureDigest: string }
): boolean {
  const expected = signVouchCertificate({
    vouchCode: payload.vouchCode,
    alumUserId: payload.alumUserId,
    projectId: payload.projectId,
    issuedAt: payload.issuedAt,
    quote: payload.quote,
  });

  const providedBuf = Buffer.from(payload.signatureDigest.trim(), 'utf8');
  const expectedBuf = Buffer.from(expected, 'utf8');

  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
}
