import assert from 'node:assert/strict';
import { getFallbackStore, resetFallbackStore } from './fallbackStore';
import {
  getBuildBySlugOrCodeQuery,
  listBuildsCursorQuery,
} from '../modules/builds/queries';
import { createSignedMediaUploadUrl } from '../modules/builds/storage';
import { unifiedSearchQuery } from '../modules/search/queries';

async function main() {
  // Ensure clean deterministic seed state before running assertions
  const store = resetFallbackStore();
  assert.equal(getFallbackStore(), store, 'getFallbackStore must return globalThis singleton');

  // 1. Seeded totals verification
  assert.equal(store.institution.id, 'inst_iter_soa');
  const students = store.users.filter((u) => u.role === 'student');
  const verifiedAlumni = store.users.filter(
    (u) => u.role === 'alumni' && u.verificationStatus === 'verified'
  );
  const pendingAlumni = store.users.filter(
    (u) => u.role === 'alumni' && u.verificationStatus === 'pending_review'
  );
  const deans = store.users.filter((u) => u.role === 'dean');

  assert.equal(students.length, 31, 'Expected 31 seeded students');
  assert.equal(verifiedAlumni.length, 14, 'Expected 14 seeded verified alumni');
  assert.equal(pendingAlumni.length, 2, 'Expected 2 seeded pending_review alumni');
  assert.equal(
    store.verificationRequests.filter((r) => r.status === 'pending').length,
    2,
    'Expected 2 open VerificationRequestDTO rows'
  );
  assert.equal(deans.length, 1, 'Expected 1 seeded dean');
  assert.equal(store.projects.length, 45, 'Expected 45 seeded projects');
  assert.equal(store.papers.length, 5, 'Expected 5 seeded papers');
  assert.equal(store.jobs.length, 32, 'Expected 32 seeded job postings');
  assert.equal(store.offers.length, 10, 'Expected 10 seeded placement offers');
  console.log('PASS [1/5] FallbackStore seeded totals verified.');

  // 2. Keyset pagination completeness & domain filtering
  const seenIds = new Set<string>();
  let cursor: string | null = null;
  let pages = 0;

  while (true) {
    const page = await listBuildsCursorQuery({
      kind: 'all',
      limit: 12,
      cursor,
    });
    pages += 1;
    assert.equal(page.totalCount, 50, 'Total published builds should be 50');

    for (const item of page.items) {
      assert.equal(
        seenIds.has(item.id),
        false,
        `Duplicate item ${item.id} found across cursor pages`
      );
      seenIds.add(item.id);
    }

    if (!page.hasMore) {
      assert.equal(page.nextCursor, null, 'Final page must have nextCursor = null');
      break;
    }
    assert.ok(page.nextCursor, 'Non-final page must return nextCursor');
    cursor = page.nextCursor;
    assert.ok(pages <= 10, 'Pagination loop exceeded expected page count');
  }

  assert.equal(seenIds.size, 50, 'All 50 builds (45 projects + 5 papers) must be yielded');

  const papersOnly = await listBuildsCursorQuery({ kind: 'paper', limit: 20 });
  assert.equal(papersOnly.items.length, 5, 'Expected 5 papers when kind=paper');
  assert.ok(papersOnly.items.every((item) => item.isPaper));

  const domainFiltered = await listBuildsCursorQuery({
    kind: 'project',
    domain: 'Agentic AI & FinTech',
    limit: 20,
  });
  assert.ok(domainFiltered.items.length >= 1, 'Expected domain filter to match projects');
  assert.ok(
    domainFiltered.items.every(
      (item) => !item.isPaper && item.domain === 'Agentic AI & FinTech'
    )
  );
  console.log(`PASS [2/5] Keyset cursor pagination (${pages} pages, 50 unique items) & domain filtering verified.`);

  // 3. Unified search across all 5 scopes
  const allHits = await unifiedSearchQuery({ q: 'LangGraph', scope: 'all', limit: 10 });
  assert.ok(allHits.length > 0, 'Expected hits for LangGraph in all scope');

  const studentHits = await unifiedSearchQuery({ q: 'Aarav', scope: 'students', limit: 10 });
  assert.ok(studentHits.length > 0, 'Expected hits for Aarav in students scope');
  assert.ok(studentHits.every((h) => h.kind === 'student'));

  const alumniHits = await unifiedSearchQuery({ q: 'HyperScale', scope: 'alumni', limit: 10 });
  assert.ok(alumniHits.length > 0, 'Expected hits for HyperScale in alumni scope');
  assert.ok(alumniHits.every((h) => h.kind === 'alumni'));

  const buildHits = await unifiedSearchQuery({ q: 'KyberMed', scope: 'builds', limit: 10 });
  assert.ok(buildHits.length > 0, 'Expected hits for KyberMed in builds scope');
  assert.ok(buildHits.every((h) => h.kind === 'project' || h.kind === 'paper'));

  const jobHits = await unifiedSearchQuery({ q: 'Razorpay', scope: 'jobs', limit: 10 });
  assert.ok(jobHits.length > 0, 'Expected hits for Razorpay in jobs scope');
  assert.ok(jobHits.every((h) => h.kind === 'job'));
  console.log('PASS [3/5] Unified search verified across all, students, alumni, builds, and jobs scopes.');

  // 4. Signed media upload allowlists & size caps
  const invalidMime = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'avatars',
    fileName: 'notes.txt',
    mimeType: 'text/plain',
    sizeBytes: 1024,
  });
  assert.equal(invalidMime.ok, false, 'Should reject text/plain on avatars');

  const invalidPdfMime = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'research-pdfs',
    fileName: 'diagram.png',
    mimeType: 'image/png',
    sizeBytes: 1024,
  });
  assert.equal(invalidPdfMime.ok, false, 'Should reject image/png on research-pdfs');

  const oversizedAvatar = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'avatars',
    fileName: 'huge.png',
    mimeType: 'image/png',
    sizeBytes: 11 * 1024 * 1024,
  });
  assert.equal(oversizedAvatar.ok, false, 'Should reject >10MB image on avatars');

  const oversizedPdf = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'research-pdfs',
    fileName: 'thesis.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 26 * 1024 * 1024,
  });
  assert.equal(oversizedPdf.ok, false, 'Should reject >25MB PDF on research-pdfs');

  const oversizedVideo = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'project-media',
    fileName: 'demo.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 151 * 1024 * 1024,
  });
  assert.equal(oversizedVideo.ok, false, 'Should reject >150MB video on project-media');

  const validMp4 = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'project-media',
    fileName: 'demo.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 42 * 1024 * 1024,
  });
  assert.equal(validMp4.ok, true, 'Should accept valid <=150MB MP4 on project-media');

  const validPdf = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'research-pdfs',
    fileName: 'paper.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4 * 1024 * 1024,
  });
  assert.equal(validPdf.ok, true, 'Should accept valid <=25MB PDF on research-pdfs');

  const validPng = await createSignedMediaUploadUrl({
    userId: 'user_stu_01',
    bucket: 'avatars',
    fileName: 'avatar.png',
    mimeType: 'image/png',
    sizeBytes: 2 * 1024 * 1024,
  });
  assert.equal(validPng.ok, true, 'Should accept valid <=10MB PNG on avatars');
  console.log('PASS [4/5] Signed upload MIME allowlists & byte caps verified.');

  // 5. Slug & Code resolution
  const prj01 = await getBuildBySlugOrCodeQuery('PRJ-01');
  assert.ok(prj01, 'Expected PRJ-01 to resolve');
  assert.equal(prj01.code, 'PRJ-01');
  assert.equal(prj01.isPaper, false);

  const prj01BySlug = await getBuildBySlugOrCodeQuery(prj01.slug);
  assert.ok(prj01BySlug, 'Expected PRJ-01 to resolve by slug');
  assert.equal(prj01BySlug.id, prj01.id);

  const rp01 = await getBuildBySlugOrCodeQuery('RP-01');
  assert.ok(rp01, 'Expected RP-01 to resolve');
  assert.equal(rp01.code, 'RP-01');
  assert.equal(rp01.isPaper, true);

  const rp01BySlug = await getBuildBySlugOrCodeQuery(rp01.slug);
  assert.ok(rp01BySlug, 'Expected RP-01 to resolve by slug');
  assert.equal(rp01BySlug.id, rp01.id);
  console.log('PASS [5/5] getBuildBySlugOrCodeQuery verified for PRJ-01 & RP-01 (by code and slug).');

  console.log('\nALL AGENT 1 VERIFICATION CHECKS PASSED (5/5).');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
