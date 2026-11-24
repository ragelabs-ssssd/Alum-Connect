import assert from 'node:assert/strict';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  listEndorsementsForAlumniQuery,
  verifyVouchByCodeQuery,
} from '@/modules/endorsements/queries';
import {
  generateVouchCode,
  signVouchCertificate,
  verifyVouchSignature,
} from '@/modules/endorsements/vouchCrypto';
import {
  listCoffeeChatsQuery,
  listJobsQuery,
} from '@/modules/hiring/queries';
import {
  listMyNotificationsQuery,
  listMyThreadsQuery,
} from '@/modules/messaging/queries';

async function main() {
  // 1. Verify generateVouchCode() format (SOA-VOUCH-YYYY-XXXX)
  const code = generateVouchCode(2026);
  assert.match(
    code,
    /^SOA-VOUCH-2026-[A-F0-9]{4}$/,
    `Expected SOA-VOUCH-2026-XXXX format, got ${code}`
  );
  const currentYearCode = generateVouchCode();
  assert.match(
    currentYearCode,
    /^SOA-VOUCH-\d{4}-[A-F0-9]{4}$/,
    `Expected SOA-VOUCH-YYYY-XXXX format, got ${currentYearCode}`
  );

  // 2. Verify signVouchCertificate() + verifyVouchSignature() round-trip & tamper rejection
  const payload = {
    vouchCode: code,
    alumUserId: 'usr_alum_01',
    projectId: 'prj_01',
    issuedAt: '2026-11-24T12:00:00.000Z',
    quote: 'Production-grade distributed architecture verified end-to-end.',
  };

  const signatureDigest = signVouchCertificate(payload);
  assert.ok(
    signatureDigest.startsWith('sha256:'),
    'Signature digest must start with sha256:'
  );

  assert.equal(
    verifyVouchSignature({ ...payload, signatureDigest }),
    true,
    'Valid payload and digest must verify as true'
  );

  assert.equal(
    verifyVouchSignature({
      ...payload,
      quote: 'Tampered endorsement quote',
      signatureDigest,
    }),
    false,
    'Tampered quote must be strictly rejected'
  );

  assert.equal(
    verifyVouchSignature({
      ...payload,
      vouchCode: 'SOA-VOUCH-2026-FFFF',
      signatureDigest,
    }),
    false,
    'Tampered vouchCode must be strictly rejected'
  );

  assert.equal(
    verifyVouchSignature({
      ...payload,
      signatureDigest: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    }),
    false,
    'Tampered signatureDigest must be strictly rejected'
  );

  // 3. Verify seeded Vouch codes resolve cleanly with valid: true
  const store = getFallbackStore();
  const seededCodes = Object.keys(store.vouchCertificates);
  assert.ok(seededCodes.length >= 1, 'Fallback store must contain seeded vouch certificates');

  for (const seededCode of seededCodes) {
    const cert = await verifyVouchByCodeQuery(seededCode);
    assert.ok(cert, `Seeded vouch ${seededCode} must resolve`);
    assert.equal(cert.valid, true, `Seeded vouch ${seededCode} must be valid: true`);
    assert.equal(cert.vouchCode, seededCode);
    assert.ok(cert.certifiedSkills.length > 0, 'Seeded vouch must include certifiedSkills');
  }

  const missingCert = await verifyVouchByCodeQuery('SOA-VOUCH-9999-NONE');
  assert.equal(missingCert, null, 'Unknown vouch code must return null');

  // 4. Verify queries return valid DTOs
  const verifiedAlum = store.users.find(
    (u) => u.role === 'alumni' && u.verificationStatus === 'verified'
  );
  const firstStudent = store.users.find((u) => u.role === 'student');
  assert.ok(verifiedAlum, 'Seeded verified alumnus must exist');
  assert.ok(firstStudent, 'Seeded student must exist');

  const alumEndorsements = await listEndorsementsForAlumniQuery(verifiedAlum.id);
  assert.ok(Array.isArray(alumEndorsements) && alumEndorsements.length > 0);
  assert.ok(alumEndorsements[0].quote.length > 0);

  const jobs = await listJobsQuery({ viewerUserId: firstStudent.id });
  assert.ok(Array.isArray(jobs) && jobs.length > 0, 'listJobsQuery must return seeded jobs');
  assert.equal(typeof jobs[0].roleTitle, 'string');
  assert.equal(typeof jobs[0].company, 'string');
  assert.equal(typeof jobs[0].alumniVerified, 'boolean');

  const coffeeChats = await listCoffeeChatsQuery(verifiedAlum.id, 'alumni');
  assert.ok(Array.isArray(coffeeChats), 'listCoffeeChatsQuery must return an array');
  if (coffeeChats.length > 0) {
    assert.equal(typeof coffeeChats[0].topic, 'string');
    assert.ok(['pending', 'accepted', 'declined'].includes(coffeeChats[0].status));
  }

  const threads = await listMyThreadsQuery(firstStudent.id);
  assert.ok(Array.isArray(threads) && threads.length > 0, 'listMyThreadsQuery must return threads');
  assert.ok(Array.isArray(threads[0].messages), 'Thread DTO must contain messages array');

  const notifications = await listMyNotificationsQuery(firstStudent.id);
  assert.ok(Array.isArray(notifications), 'listMyNotificationsQuery must return array');
  if (notifications.length > 0) {
    assert.equal(typeof notifications[0].title, 'string');
    assert.equal(typeof notifications[0].isRead, 'boolean');
  }

  console.log(
    JSON.stringify({
      ok: true,
      generatedVouchCode: code,
      seededVouchesVerified: seededCodes.length,
      jobsCount: jobs.length,
      coffeeChatsCount: coffeeChats.length,
      threadsCount: threads.length,
      notificationsCount: notifications.length,
    })
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
