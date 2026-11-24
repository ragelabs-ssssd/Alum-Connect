import assert from 'node:assert/strict';
import {
  getDefaultPersonaForRole,
  listDemoPersonas,
} from '@/lib/auth';
import {
  buildDeanCsvReport,
  getDeanAnalyticsQuery,
  listVerificationRequestsQuery,
} from '@/modules/governance/queries';
import {
  isCorporateDomainMatch,
  signUpSchema,
} from '@/modules/identity/validators';

async function main() {
  // 1. Validate signUpSchema rejections & acceptances
  const invalidStudentRegNo = signUpSchema.safeParse({
    role: 'student',
    fullName: 'Aarav Mohanty',
    email: 'aarav@soa.ac.in',
    regNo: '234101608', // 9 digits (invalid, must be 10)
    academicYear: '4th Year',
    branch: 'CSE',
  });
  assert.equal(
    invalidStudentRegNo.success,
    false,
    'signUpSchema must reject 9-digit student regNo',
  );

  const validStudent = signUpSchema.safeParse({
    role: 'student',
    fullName: 'Ananya Dash',
    email: 'ananya.dash@soa.ac.in',
    regNo: '2341016089',
    academicYear: '4th Year',
    branch: 'CSE',
    linkedinUrl: 'https://www.linkedin.com/in/ananya-dash',
    techStack: ['Python', 'PyTorch', 'LangGraph'],
  });
  assert.equal(
    validStudent.success,
    true,
    'signUpSchema must accept valid 10-digit student payload',
  );

  const invalidAlumLinkedin = signUpSchema.safeParse({
    role: 'alumni',
    fullName: 'Debadatta Rath',
    email: 'debadatta@gmail.com',
    linkedinUrl: 'https://example.com/not-linkedin',
    company: 'Microsoft',
    designation: 'Principal Engineer',
    batchYear: 2016,
  });
  assert.equal(
    invalidAlumLinkedin.success,
    false,
    'signUpSchema must reject malformed non-LinkedIn URLs for alumni',
  );

  const validAlum = signUpSchema.safeParse({
    role: 'alumni',
    fullName: 'Soumyajit Mishra',
    email: 'soumyajit@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/soumyajit-mishra-iter',
    company: 'Atlassian',
    designation: 'Senior Software Engineer',
    batchYear: 2019,
    workEmail: 'smishra@atlassian.com',
  });
  assert.equal(
    validAlum.success,
    true,
    'signUpSchema must accept valid alumni payload with LinkedIn & workEmail',
  );

  // 2. Verify corporate domain matching
  assert.equal(
    isCorporateDomainMatch('arjun.patel@microsoft.com', 'Microsoft'),
    true,
    'Corporate domain @microsoft.com must match Microsoft',
  );
  assert.equal(
    isCorporateDomainMatch('debadatta@hyperscalelabs.ai', 'HyperScale Labs'),
    true,
    'Corporate domain @hyperscalelabs.ai must match HyperScale Labs',
  );
  assert.equal(
    isCorporateDomainMatch('engineer@gmail.com', 'Google'),
    false,
    'Free consumer domain @gmail.com must return false even for Google',
  );
  assert.equal(
    isCorporateDomainMatch('recruiter@outlook.com', 'Microsoft'),
    false,
    'Free consumer domain @outlook.com must return false even for Microsoft',
  );

  // 3. Verify demo persona helpers
  const defaultStudent = getDefaultPersonaForRole('student');
  const defaultAlum = getDefaultPersonaForRole('alumni');
  const defaultDean = getDefaultPersonaForRole('dean');

  assert.ok(defaultStudent, 'Default student persona must exist');
  assert.equal(defaultStudent.role, 'student');
  assert.equal(defaultStudent.fullName, 'Ananya Dash');

  assert.ok(defaultAlum, 'Default alumni persona must exist');
  assert.equal(defaultAlum.role, 'alumni');
  assert.equal(defaultAlum.verificationStatus, 'verified');
  assert.equal(defaultAlum.fullName, 'Debadatta Rath');

  assert.ok(defaultDean, 'Default dean persona must exist');
  assert.equal(defaultDean.role, 'dean');
  assert.equal(defaultDean.fullName, 'Prof. Sujit Kumar Patra');

  const personas = listDemoPersonas();
  assert.ok(
    personas.some((p) => p.role === 'student'),
    'listDemoPersonas must include a student persona',
  );
  assert.ok(
    personas.some(
      (p) => p.role === 'alumni' && p.verificationStatus === 'verified',
    ),
    'listDemoPersonas must include a verified alumni persona',
  );
  assert.ok(
    personas.some(
      (p) => p.role === 'alumni' && p.verificationStatus === 'pending_review',
    ),
    'listDemoPersonas must include a pending_review alumni persona',
  );
  assert.ok(
    personas.some((p) => p.role === 'dean'),
    'listDemoPersonas must include a dean persona',
  );

  // 4. Verify governance analytics, pending queue, and RFC-4180 CSV export
  const analytics = await getDeanAnalyticsQuery();
  assert.ok(
    analytics.totalStudents >= 31,
    `Expected at least 31 seeded students, got ${analytics.totalStudents}`,
  );
  assert.ok(
    analytics.verifiedAlumniCount >= 14,
    `Expected at least 14 verified alumni, got ${analytics.verifiedAlumniCount}`,
  );
  assert.ok(
    analytics.totalProjects >= 45,
    `Expected at least 45 projects, got ${analytics.totalProjects}`,
  );
  assert.ok(
    analytics.totalPapers >= 5,
    `Expected at least 5 papers, got ${analytics.totalPapers}`,
  );
  assert.ok(
    analytics.topStudents.length > 0 && analytics.topAlumni.length > 0,
    'Leaderboards must include top students and top alumni',
  );

  const pendingRequests = await listVerificationRequestsQuery('pending');
  assert.ok(
    pendingRequests.length >= 2,
    `Expected at least 2 pending alumni verification requests, got ${pendingRequests.length}`,
  );
  assert.equal(
    analytics.pendingVerificationsCount,
    pendingRequests.length,
    'Analytics pendingVerificationsCount must match pending queue length',
  );

  const csv = await buildDeanCsvReport();
  assert.ok(csv.includes('\r\n'), 'CSV export must use RFC-4180 CRLF line endings');
  const csvLines = csv.split('\r\n');
  assert.equal(
    csvLines[0],
    'RecordType,CodeOrID,Name,EmailOrPartner,DepartmentOrCompany,Status,MetricOrPackage,NotesOrTimestamp',
    'CSV header row must match expected schema',
  );
  assert.ok(
    csvLines.some((line) => line.startsWith('STUDENT,')),
    'CSV report must include STUDENT records',
  );
  assert.ok(
    csvLines.some((line) => line.startsWith('ALUMNI,')),
    'CSV report must include ALUMNI records',
  );
  assert.ok(
    csvLines.some((line) => line.startsWith('PLACEMENT_OFFER,')),
    'CSV report must include PLACEMENT_OFFER records',
  );
  assert.ok(
    csvLines.some((line) => line.startsWith('ALUMNI_VERIFICATION,')),
    'CSV report must include ALUMNI_VERIFICATION records',
  );
  // Check RFC-4180 quoting on fields containing commas (e.g. proof notes or designations)
  assert.ok(
    csv.includes('"'),
    'CSV report must RFC-4180 quote fields containing commas or special characters',
  );

  console.log(
    `ALL VERIFICATION CHECKS PASSED: ${personas.length} demo personas, ${analytics.totalStudents} students, ${analytics.verifiedAlumniCount} verified alumni, ${pendingRequests.length} pending verifications, ${csvLines.length} CSV rows.`,
  );
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
