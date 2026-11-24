/**
 * Shared Domain Contracts for AlmaConnect (Next.js 16 + Supabase + Drizzle)
 *
 * Next.js 16 Implementation Guardrails (verified from node_modules/next/dist/docs/):
 * 1. Use `src/proxy.ts` with `export function proxy(request: NextRequest)` (NOT middleware.ts).
 * 2. Runtime APIs (`cookies()`, `headers()`, `params`, `searchParams`) are ASYNC (`await`).
 * 3. With `cacheComponents: true` in next.config.ts:
 *    - Never call `cookies()` / `headers()` outside `<Suspense>` or `'use cache: private'`.
 *    - Never call `cookies()` inside plain `'use cache'` functions; pass extracted IDs in.
 *    - `revalidateTag(tag, 'max')` requires a cacheLife profile; use `updateTag(tag)` in Server Actions.
 */

export type UserRole = 'student' | 'alumni' | 'dean';

export type VerificationStatus =
  | 'unverified'
  | 'pending_review'
  | 'verified'
  | 'rejected';

export interface ActionSuccess<T> {
  ok: true;
  data: T;
}

export interface ActionFailure {
  ok: false;
  error: string;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'UNVERIFIED_ALUMNI' | 'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR';
}

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

export interface SessionUser {
  id: string;
  legacyCode?: string | null;
  institutionId: string;
  institutionSlug: string;
  email: string;
  fullName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  avatarUrl: string;
  bannerUrl: string;
  linkedinUrl?: string | null;
  githubHandle?: string | null;
  headline: string;
  // Student attributes
  regNo?: string | null;
  academicYear?: string | null;
  branch?: string | null;
  cgpa?: number | null;
  bio?: string | null;
  techStack: string[];
  // Alumni attributes
  batchYear?: number | null;
  company?: string | null;
  workEmail?: string | null;
  workEmailVerified?: boolean;
  designation?: string | null;
  personaCategory?: string | null;
  mentorshipScope?: string | null;
  bandwidthShield?: string | null;
  totalExpYears?: number | null;
  canPostJobs?: boolean;
}

export interface EndorsementDTO {
  id: string;
  alumniUserId: string;
  alumName: string;
  alumRole: string;
  alumCompany: string;
  alumBatch: number;
  alumAvatar: string;
  kind: 'endorsement' | 'roast' | 'vouch';
  vouchCode?: string | null;
  category: string;
  quote: string;
  certifiedSkills: string[];
  rating: number;
  resolved: boolean;
  createdAt: string;
}

export interface ProjectCardDTO {
  id: string;
  code: string;
  slug: string;
  title: string;
  subtitle: string; // pitch
  shortDesc: string;
  story: string; // detailedDesc
  domain: string;
  collaborationMode: 'Solo' | 'Group';
  teamSize: number;
  leadId: string;
  leadName: string;
  leadRegNo: string;
  contributors: Array<{
    userId?: string | null;
    name: string;
    regNo: string;
    academicYear: string;
  }>;
  academicYears: string;
  batchLabel: string;
  techStack: string[];
  tags: string[];
  liveUrl: string;
  hostingPlatform: string;
  githubUrl: string;
  demoVideoUrl: string;
  pitchVideoUrl: string;
  linkedPaperId?: string | null;
  linkedPaperCode?: string | null;
  coverImage: string;
  authorAvatar: string;
  status: 'draft' | 'published' | 'verified';
  likesCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  isMine?: boolean;
  isPaper: false;
  endorsements: EndorsementDTO[];
  openRole?: string;
  createdAt: string;
}

export interface PaperDTO {
  id: string;
  code: string;
  slug: string;
  title: string; // topic
  subtitle: string;
  story: string; // abstract
  domain: string;
  venue: string;
  paperStatus: 'Draft' | 'Under Peer Review' | 'Accepted' | 'Published';
  authorMode: 'Solo' | 'Dual';
  leadAuthorId: string;
  leadAuthorName: string;
  leadAuthorRegNo: string;
  leadAuthorYearBranch: string;
  coAuthorName?: string | null;
  coAuthorRegNo?: string | null;
  preprintUrl: string;
  pdfStoragePath?: string | null;
  codeRepoUrl: string;
  liveDemoUrl: string;
  guidanceNeeded: string[];
  techStack: string[];
  tags: string[];
  coverImage: string;
  authorAvatar: string;
  likesCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  isMine?: boolean;
  isPaper: true;
  endorsements: EndorsementDTO[];
  createdAt: string;
}

export type FeedBuildItem = ProjectCardDTO | PaperDTO;

export interface JobPostingDTO {
  id: string;
  postedByAlumniId: string;
  alumniName: string;
  alumniRole: string;
  alumniAvatar: string;
  alumniVerified: boolean;
  roleTitle: string;
  company: string;
  jobType: 'Full-Time' | 'Internship' | 'Paid Bounty';
  location: string;
  compensation: string;
  slots: number;
  eligibility: string;
  skillsRequired: string[];
  jdText: string;
  deadline: string;
  status: 'open' | 'closed';
  applicationsCount: number;
  appliedByMe?: boolean;
  savedByMe?: boolean;
  myApplicationStatus?: JobApplicationDTO['status'] | null;
  createdAt: string;
}

export interface JobApplicationDTO {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  studentUserId: string;
  studentName: string;
  studentRegNo: string;
  studentBranch: string;
  studentCgpa?: number | null;
  studentAvatar: string;
  showcaseProjectId?: string | null;
  showcaseProjectTitle?: string | null;
  note: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'offered' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeChatDTO {
  id: string;
  studentUserId: string;
  studentName: string;
  studentMeta: string;
  studentAvatar: string;
  alumniUserId: string;
  alumniName: string;
  alumniMeta: string;
  alumniAvatar: string;
  projectId?: string | null;
  projectTitle?: string | null;
  topic: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface VouchCertificateDTO {
  vouchCode: string;
  valid: boolean;
  signatureDigest: string;
  issuedAt: string;
  projectId?: string | null;
  projectCode?: string | null;
  projectTitle: string;
  studentNames: string[];
  alumUserId: string;
  alumName: string;
  alumDesignation: string;
  alumCompany: string;
  alumBatch: number;
  alumAvatar: string;
  alumVerified: boolean;
  quote: string;
  certifiedSkills: string[];
  publicUrl: string;
}

export interface ChatMessageDTO {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: 'student' | 'alumni';
  senderName: string;
  text: string;
  attachmentUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface ChatThreadDTO {
  id: string;
  studentUserId: string;
  studentName: string;
  studentMeta: string;
  studentAvatar: string;
  alumniUserId: string;
  alumniName: string;
  alumniMeta: string;
  alumniAvatar: string;
  topic: string;
  studentUnreadCount: number;
  alumniUnreadCount: number;
  lastMessageAt: string;
  messages: ChatMessageDTO[];
}

export interface NotificationDTO {
  id: string;
  recipientUserId: string;
  actorUserId?: string | null;
  category: string;
  title: string;
  message: string;
  targetSection: string;
  targetEntityId?: string | null;
  actionLabel: string;
  isRead: boolean;
  createdAt: string;
}

export interface VerificationRequestDTO {
  id: string;
  alumniUserId: string;
  alumniName: string;
  alumniEmail: string;
  alumniAvatar: string;
  batchYear: number;
  company: string;
  designation: string;
  workEmail: string;
  linkedinUrl: string;
  domainAutoMatched: boolean;
  proofNote: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedByDeanId?: string | null;
  reviewNote?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface PlacementOfferDTO {
  id: string;
  code: string;
  studentUserId: string;
  studentName: string;
  academicYearBranch: string;
  company: string;
  jobRole: string;
  packageStr: string;
  packageLpa: number;
  offerType: 'PPO' | 'Internship';
  referringAlumniId?: string | null;
  referringAlumniName?: string | null;
  status: 'Accepted' | 'Joined';
  verifiedByDean: boolean;
  createdAt: string;
}

export interface InstitutionalAuditLogDTO {
  id: string;
  actorUserId: string;
  actorName: string;
  category: 'verification' | 'vouch' | 'job_post' | 'offer_verified' | 'mvp_ship';
  title: string;
  impact: string;
  createdAt: string;
}

export interface DeanAnalyticsDTO {
  totalStudents: number;
  totalAlumni: number;
  verifiedAlumniCount: number;
  pendingVerificationsCount: number;
  totalProjects: number;
  totalPapers: number;
  totalOpenings: number;
  totalOffers: number;
  ppoCount: number;
  internshipCount: number;
  avgCgpa: string;
  totalAlumExpYears: number;
  branchBreakdown: Array<{ branch: string; count: number }>;
  domainBreakdown: Array<{ domain: string; count: number }>;
  topStudents: Array<{
    userId: string;
    code: string;
    name: string;
    branch: string;
    academicYear: string;
    cgpa: number;
    projectsCount: number;
    papersCount: number;
    score: number;
    offerLabel?: string | null;
    avatarUrl: string;
  }>;
  topAlumni: Array<{
    userId: string;
    code: string;
    name: string;
    company: string;
    designation: string;
    batchYear: number;
    openingsCount: number;
    mentoredCount: number;
    endorsedCount: number;
    impactScore: number;
    avatarUrl: string;
  }>;
}

export interface SearchHitDTO {
  kind: 'student' | 'alumni' | 'project' | 'paper' | 'job';
  id: string;
  title: string;
  subtitle: string;
  href: string;
  avatarUrl?: string;
  badge?: string;
}

export interface EcosystemStatsDTO {
  buildsCount: number;
  projectsCount: number;
  papersCount: number;
  studentsCount: number;
  alumniCount: number;
  openDealsCount: number;
  offersCount: number;
}
