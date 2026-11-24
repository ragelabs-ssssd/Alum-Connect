import {
  ALUMNI_CAREER,
  ALUMNI_DATA,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENT_ACADEMICS,
  STUDENTS_DATA,
  getIndianAvatar,
  getIndianBanner,
  type AlumniCareerExtra,
  type StudentAcademicExtra,
} from '@/data/alumConnectData';
import type {
  ChatMessageDTO,
  ChatThreadDTO,
  CoffeeChatDTO,
  EndorsementDTO,
  InstitutionalAuditLogDTO,
  JobApplicationDTO,
  JobPostingDTO,
  NotificationDTO,
  PaperDTO,
  PlacementOfferDTO,
  ProjectCardDTO,
  SessionUser,
  VerificationRequestDTO,
  VouchCertificateDTO,
} from '@/types/domain';

export interface FallbackInstitution {
  id: string;
  slug: string;
  name: string;
  allowedStudentDomains: string[];
  regNoPattern: string;
  settingsJson: Record<string, unknown>;
  createdAt: string;
}

export interface FallbackStoreState {
  institution: FallbackInstitution;
  users: SessionUser[];
  studentAcademicsByUserId: Record<string, StudentAcademicExtra>;
  alumniCareerByUserId: Record<string, AlumniCareerExtra>;
  verificationRequests: VerificationRequestDTO[];
  projects: ProjectCardDTO[];
  papers: PaperDTO[];
  endorsements: EndorsementDTO[];
  vouchCertificates: Record<string, VouchCertificateDTO>;
  jobs: JobPostingDTO[];
  jobApplications: JobApplicationDTO[];
  coffeeChats: CoffeeChatDTO[];
  offers: PlacementOfferDTO[];
  auditLogs: InstitutionalAuditLogDTO[];
  chatThreads: ChatThreadDTO[];
  notifications: NotificationDTO[];
  likedBuildKeysByUser: Record<string, Set<string>>;
  savedItemKeysByUser: Record<string, Set<string>>;
  followingIdsByUser: Record<string, Set<string>>;
}

const DEFAULT_INSTITUTION_ID = 'inst_iter_soa';
const DEFAULT_INSTITUTION_SLUG = 'iter-soa';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function makeGithubHandle(name: string): string {
  return slugify(name);
}

function makeWorkEmail(fullName: string, company: string): string {
  const first = fullName.trim().toLowerCase().split(/\s+/)[0] || 'alum';
  const last =
    fullName.trim().toLowerCase().split(/\s+/).slice(-1)[0] || 'iter';
  const companyDomainMap: Record<string, string> = {
    'HyperScale Labs': 'hyperscalelabs.ai',
    'Microsoft India': 'microsoft.com',
    Razorpay: 'razorpay.com',
    Google: 'google.com',
    'NeuroLink AI': 'neurolink.ai',
    'Amazon Web Services (AWS)': 'amazon.com',
    Flipkart: 'flipkart.com',
    'Intel Labs': 'intel.com',
    'GreenVolt Mobility': 'greenvolt.in',
    'Cisco Systems': 'cisco.com',
    PhonePe: 'phonepe.com',
    Zomato: 'zomato.com',
    'Polygon Labs': 'polygon.technology',
    Adobe: 'adobe.com',
  };
  const domain =
    companyDomainMap[company] ||
    `${slugify(company).replace(/-/g, '')}.com`;
  return `${first}.${last}@${domain}`;
}

export function parsePackageLpa(packageStr: string): number {
  const lpaMatch = packageStr.match(/([\d.]+)\s*LPA/i);
  if (lpaMatch) {
    return Number.parseFloat(lpaMatch[1]) || 0;
  }
  const monthlyMatch = packageStr.replace(/,/g, '').match(/([\d.]+)/);
  if (monthlyMatch && /month/i.test(packageStr)) {
    const monthlyInr = Number.parseFloat(monthlyMatch[1]) || 0;
    return Math.round(((monthlyInr * 12) / 100000) * 100) / 100;
  }
  return 0;
}

export function inferProjectDomain(
  techStack: string[],
  pitch: string,
  linkedPaperId: string | null
): string {
  if (linkedPaperId === 'RP-01') return 'Agentic AI & FinTech';
  if (linkedPaperId === 'RP-02') return 'Post-Quantum Cybersecurity';
  if (linkedPaperId === 'RP-03') return 'Distributed Systems & Edge AI';
  if (linkedPaperId === 'RP-04') return 'AI Safety & Formal Methods';
  if (linkedPaperId === 'RP-05') return 'CleanTech & Graph AI';

  const joined = `${techStack.join(' ')} ${pitch}`.toLowerCase();
  if (/solidity|circom|snark|zk|zero-knowledge|dao|ipfs/.test(joined)) {
    return 'Web3 & Zero-Knowledge';
  }
  if (/three\.js|webxr|webgl|glsl|mediapipe|blender/.test(joined)) {
    return 'Graphics, AR/VR & Vision';
  }
  if (/ebpf|rust|freeRTOS|arm cortex|esp32|esp8266|arduino|iot|mqtt|rfid/.test(joined)) {
    return 'Embedded, IoT & Kernel';
  }
  if (/kubernetes|go|redis|docker|grpc|prometheus|kafka|postgres/.test(joined)) {
    return 'Distributed Systems & Cloud';
  }
  if (/pytorch|langgraph|whisper|openai|claude|qdrant|milvus|llm|rag|yolov8/.test(joined)) {
    return 'AI & Intelligent Agents';
  }
  return 'Full-Stack & Product Engg';
}

function makeBatchLabel(academicYears: string): string {
  if (academicYears.includes('4th')) return 'Batch 2026';
  if (academicYears.includes('3rd')) return 'Batch 2027';
  if (academicYears.includes('2nd')) return 'Batch 2028';
  return 'ITER Campus';
}

export function createSignatureDigest(vouchCode: string, quote: string): string {
  let hash = 2166136261;
  const input = `${vouchCode}:${quote}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `sha256:iter-${hex}a94f3c8e21`;
}

function buildSeededStore(): FallbackStoreState {
  const baseTimeMs = Date.parse('2026-10-15T10:00:00.000Z');
  const isoOffset = (hoursAgo: number) =>
    new Date(baseTimeMs - hoursAgo * 3600 * 1000).toISOString();

  const institution: FallbackInstitution = {
    id: DEFAULT_INSTITUTION_ID,
    slug: DEFAULT_INSTITUTION_SLUG,
    name: "ITER, Siksha 'O' Anusandhan",
    allowedStudentDomains: ['soa.ac.in', 'iter.soa.ac.in'],
    regNoPattern: '^\\d{10}$',
    settingsJson: {
      campusCity: 'Bhubaneswar',
      state: 'Odisha',
      verificationAutoApproveCompanyMatch: true,
    },
    createdAt: '2025-08-01T00:00:00.000Z',
  };

  const studentAcademicsByUserId: Record<string, StudentAcademicExtra> = {};
  const alumniCareerByUserId: Record<string, AlumniCareerExtra> = {};

  const studentByCode = new Map<string, SessionUser>();
  const studentByName = new Map<string, SessionUser>();
  const alumniByCode = new Map<string, SessionUser>();

  // 1. Seed 31 Students
  const studentUsers: SessionUser[] = STUDENTS_DATA.map((stu, idx) => {
    const id = `user_stu_${String(idx + 1).padStart(2, '0')}`;
    const extra = STUDENT_ACADEMICS[stu.id];
    if (extra) {
      studentAcademicsByUserId[id] = extra;
    }
    const user: SessionUser = {
      id,
      legacyCode: stu.id,
      institutionId: DEFAULT_INSTITUTION_ID,
      institutionSlug: DEFAULT_INSTITUTION_SLUG,
      email: stu.email,
      fullName: stu.fullName,
      role: 'student',
      verificationStatus: 'verified',
      avatarUrl: getIndianAvatar(stu.fullName),
      bannerUrl: getIndianBanner(idx),
      linkedinUrl: `https://linkedin.com/in/${slugify(stu.fullName)}`,
      githubHandle: makeGithubHandle(stu.fullName),
      headline: `${stu.academicYear} ${stu.branch} • ${extra?.clubRole ?? 'Campus Builder'}`,
      regNo: stu.regNo,
      academicYear: stu.academicYear,
      branch: stu.branch,
      cgpa: extra?.cgpa ?? 8.9,
      bio: stu.bio,
      techStack: [...stu.techStack],
    };
    studentByCode.set(stu.id, user);
    studentByName.set(stu.fullName.toLowerCase(), user);
    return user;
  });

  // 2. Seed 14 Verified Alumni
  const verifiedAlumniUsers: SessionUser[] = ALUMNI_DATA.map((alum, idx) => {
    const id = `user_alum_${String(idx + 1).padStart(2, '0')}`;
    const career = ALUMNI_CAREER[alum.id];
    if (career) {
      alumniCareerByUserId[id] = career;
    }
    const workEmail = makeWorkEmail(alum.fullName, alum.company);
    const user: SessionUser = {
      id,
      legacyCode: alum.id,
      institutionId: DEFAULT_INSTITUTION_ID,
      institutionSlug: DEFAULT_INSTITUTION_SLUG,
      email: workEmail,
      fullName: alum.fullName,
      role: 'alumni',
      verificationStatus: 'verified',
      avatarUrl: getIndianAvatar(alum.fullName),
      bannerUrl: getIndianBanner(idx + 1),
      linkedinUrl: `https://linkedin.com/in/${slugify(alum.fullName)}`,
      githubHandle: makeGithubHandle(alum.fullName),
      headline: `${alum.designation} @ ${alum.company} • Batch '${String(alum.batchYear).slice(-2)}`,
      techStack: [...alum.techStackExpertise],
      batchYear: alum.batchYear,
      company: alum.company,
      workEmail,
      workEmailVerified: true,
      designation: alum.designation,
      personaCategory: alum.personaCategory,
      mentorshipScope: alum.mentorshipScope,
      bandwidthShield:
        alum.personaCategory === 'HR / Talent Acquisition'
          ? '4 chats / week'
          : '2 chats / week',
      totalExpYears: career?.totalYears ?? 7,
      canPostJobs: alum.canPostJobs,
    };
    alumniByCode.set(alum.id, user);
    return user;
  });

  // 3. Seed 2 Pending Review Alumni for Dean Verification Queue
  const pendingAlumniUsers: SessionUser[] = [
    {
      id: 'user_alum_pending_01',
      legacyCode: 'ALUM-P1',
      institutionId: DEFAULT_INSTITUTION_ID,
      institutionSlug: DEFAULT_INSTITUTION_SLUG,
      email: 'soumyajit.mishra@gmail.com',
      fullName: 'Soumyajit Mishra',
      role: 'alumni',
      verificationStatus: 'pending_review',
      avatarUrl: '/images/avatars/alum-m-2.jpg',
      bannerUrl: getIndianBanner(0),
      linkedinUrl: 'https://linkedin.com/in/soumyajit-mishra-iter',
      githubHandle: 'soumyajit-mishra',
      headline: "Senior SDE @ Atlassian • Batch '19",
      techStack: ['Java', 'Kotlin', 'Microservices', 'AWS', 'GraphQL'],
      batchYear: 2019,
      company: 'Atlassian',
      workEmail: 'smishra@atlassian.com',
      workEmailVerified: false,
      designation: 'Senior Software Engineer',
      personaCategory: 'Technical Mentor / Staff Engineer',
      mentorshipScope: 'Backend Systems & Resume Reviews',
      bandwidthShield: '2 chats / week',
      totalExpYears: 7,
      canPostJobs: true,
    },
    {
      id: 'user_alum_pending_02',
      legacyCode: 'ALUM-P2',
      institutionId: DEFAULT_INSTITUTION_ID,
      institutionSlug: DEFAULT_INSTITUTION_SLUG,
      email: 'ankita.panda.hr@outlook.com',
      fullName: 'Ankita Panda',
      role: 'alumni',
      verificationStatus: 'pending_review',
      avatarUrl: '/images/avatars/female-b-4.jpg',
      bannerUrl: getIndianBanner(2),
      linkedinUrl: 'https://linkedin.com/in/ankita-panda-swiggy',
      githubHandle: null,
      headline: "Lead Tech Recruiter @ Swiggy • Batch '18",
      techStack: ['Campus Hiring', 'Product Recruiting', 'Interview Calibration'],
      batchYear: 2018,
      company: 'Swiggy',
      workEmail: 'ankita.panda@swiggy.in',
      workEmailVerified: false,
      designation: 'Lead Technical Recruiter',
      personaCategory: 'HR / Talent Acquisition',
      mentorshipScope: 'Campus Hiring Drives & Portfolio Screening',
      bandwidthShield: '3 chats / week',
      totalExpYears: 8,
      canPostJobs: true,
    },
  ];

  // 4. Seed 1 Dean
  const deanUser: SessionUser = {
    id: 'user_dean_01',
    legacyCode: 'DEAN-01',
    institutionId: DEFAULT_INSTITUTION_ID,
    institutionSlug: DEFAULT_INSTITUTION_SLUG,
    email: 'dean.placement@soa.ac.in',
    fullName: 'Prof. Sujit Kumar Patra',
    role: 'dean',
    verificationStatus: 'verified',
    avatarUrl: '/images/indian-alumni-mentor.jpg',
    bannerUrl: '/images/indian-campus-lab.jpg',
    linkedinUrl: 'https://linkedin.com/in/prof-sujit-patra-soa',
    githubHandle: null,
    headline: "Dean of Placements & Industry Relations • ITER, Siksha 'O' Anusandhan",
    techStack: ['Institutional Governance', 'Placement Analytics', 'Industry Alliances'],
  };

  const users: SessionUser[] = [
    ...studentUsers,
    ...verifiedAlumniUsers,
    ...pendingAlumniUsers,
    deanUser,
  ];

  // 5. Verification Requests for the 2 pending alumni + 1 historical approved request
  const verificationRequests: VerificationRequestDTO[] = [
    {
      id: 'verif_req_01',
      alumniUserId: 'user_alum_pending_01',
      alumniName: 'Soumyajit Mishra',
      alumniEmail: 'soumyajit.mishra@gmail.com',
      alumniAvatar: '/images/avatars/alum-m-2.jpg',
      batchYear: 2019,
      company: 'Atlassian',
      designation: 'Senior Software Engineer',
      workEmail: 'smishra@atlassian.com',
      linkedinUrl: 'https://linkedin.com/in/soumyajit-mishra-iter',
      domainAutoMatched: true,
      proofNote: 'ITER CSE Batch 2019 (Reg: 1541012188). Hiring backend interns for Jira Cloud.',
      status: 'pending',
      reviewedByDeanId: null,
      reviewNote: null,
      createdAt: isoOffset(6),
      reviewedAt: null,
    },
    {
      id: 'verif_req_02',
      alumniUserId: 'user_alum_pending_02',
      alumniName: 'Ankita Panda',
      alumniEmail: 'ankita.panda.hr@outlook.com',
      alumniAvatar: '/images/avatars/female-b-4.jpg',
      batchYear: 2018,
      company: 'Swiggy',
      designation: 'Lead Technical Recruiter',
      workEmail: 'ankita.panda@swiggy.in',
      linkedinUrl: 'https://linkedin.com/in/ankita-panda-swiggy',
      domainAutoMatched: false,
      proofNote: 'ITER CSIT Batch 2018 (Reg: 1441014092). Coordinating Swiggy Instamart SDE-1 campus pool.',
      status: 'pending',
      reviewedByDeanId: null,
      reviewNote: null,
      createdAt: isoOffset(14),
      reviewedAt: null,
    },
  ];

  // 6. Seed 5 Research Papers
  const paperCodeToId = new Map<string, string>();
  const papers: PaperDTO[] = RESEARCH_PAPERS_DATA.map((rp, idx) => {
    const id = `rp_${String(idx + 1).padStart(2, '0')}`;
    paperCodeToId.set(rp.id, id);
    const leadUser =
      studentByName.get(rp.leadAuthorName.toLowerCase()) ?? studentUsers[0];
    return {
      id,
      code: rp.id,
      slug: `${slugify(rp.topic).slice(0, 64)}-${rp.id.toLowerCase()}`,
      title: rp.topic,
      subtitle: `${rp.venue} • ${rp.domain}`,
      story: rp.abstract,
      domain: rp.domain,
      venue: rp.venue,
      paperStatus: rp.status,
      authorMode: rp.authorMode,
      leadAuthorId: leadUser.id,
      leadAuthorName: rp.leadAuthorName,
      leadAuthorRegNo: rp.leadAuthorRegNo,
      leadAuthorYearBranch: rp.leadAuthorYearBranch,
      coAuthorName: rp.coAuthorName,
      coAuthorRegNo: rp.coAuthorRegNo,
      preprintUrl: rp.preprintUrl,
      pdfStoragePath: `research-pdfs/${id.toLowerCase()}.pdf`,
      codeRepoUrl: rp.codeRepoUrl,
      liveDemoUrl: rp.liveDemoUrl,
      guidanceNeeded: ['Methodology Review', 'Benchmark Calibration', 'Industry Co-Author'],
      techStack: [...rp.techStack],
      tags: [...rp.techStack, rp.domain],
      coverImage: rp.coverImage,
      authorAvatar: leadUser.avatarUrl,
      likesCount: 28 + idx * 7,
      isPaper: true,
      endorsements: [],
      createdAt: isoOffset(10 + idx * 18),
    };
  });

  // 7. Seed 45 Projects
  const projectCodeToId = new Map<string, string>();
  const projects: ProjectCardDTO[] = PROJECTS_DATA.map((proj, idx) => {
    const id = `prj_${String(idx + 1).padStart(2, '0')}`;
    projectCodeToId.set(proj.id, id);
    const leadUser =
      studentByName.get(proj.leadName.toLowerCase()) ?? studentUsers[0];
    const contributors = [
      {
        userId: leadUser.id,
        name: proj.leadName,
        regNo: proj.leadRegNo,
        academicYear: leadUser.academicYear ?? proj.academicYears,
      },
      ...proj.coContributorsNames.map((coName, coIdx) => {
        const coUser = studentByName.get(coName.toLowerCase());
        return {
          userId: coUser?.id ?? null,
          name: coName,
          regNo: proj.coContributorsRegNos[coIdx] ?? '2341010000',
          academicYear: coUser?.academicYear ?? proj.academicYears,
        };
      }),
    ];

    const linkedPaperId = proj.linkedPaperId
      ? (paperCodeToId.get(proj.linkedPaperId) ?? null)
      : null;

    return {
      id,
      code: proj.id,
      slug: `${slugify(proj.name)}-${proj.id.toLowerCase()}`,
      title: proj.name,
      subtitle: proj.pitch,
      shortDesc: proj.shortDesc,
      story: proj.detailedDesc,
      domain: inferProjectDomain(proj.techStack, proj.pitch, proj.linkedPaperId),
      collaborationMode: proj.collaborationMode,
      teamSize: proj.teamSize,
      leadId: leadUser.id,
      leadName: proj.leadName,
      leadRegNo: proj.leadRegNo,
      contributors,
      academicYears: proj.academicYears,
      batchLabel: makeBatchLabel(proj.academicYears),
      techStack: [...proj.techStack],
      tags: [...proj.techStack, proj.hostingPlatform],
      liveUrl: proj.liveUrl,
      hostingPlatform: proj.hostingPlatform,
      githubUrl: proj.githubUrl,
      demoVideoUrl: proj.demoVideoUrl,
      pitchVideoUrl: proj.pitchVideoUrl,
      linkedPaperId,
      linkedPaperCode: proj.linkedPaperId,
      coverImage: proj.coverImage,
      authorAvatar: leadUser.avatarUrl,
      status: idx < 12 ? 'verified' : 'published',
      likesCount: 19 + ((idx * 11) % 53),
      isPaper: false,
      endorsements: [],
      openRole:
        idx % 4 === 0
          ? 'Seeking Alumni Architecture Review'
          : idx % 5 === 0
            ? 'Open to Capstone Collaborators'
            : undefined,
      createdAt: isoOffset(4 + idx * 6),
    };
  });

  // 8. Seed Initial Endorsements + Vouch Certificates
  interface SeedEndorsementSpec {
    id: string;
    alumCode: string;
    targetType: 'project' | 'paper';
    targetCode: string;
    kind: 'endorsement' | 'roast' | 'vouch';
    vouchCode?: string;
    category: string;
    quote: string;
    certifiedSkills: string[];
    rating: number;
    resolved: boolean;
    hoursAgo: number;
  }

  const endorsementSpecs: SeedEndorsementSpec[] = [
    {
      id: 'end_01',
      alumCode: 'ALUM-01',
      targetType: 'project',
      targetCode: 'PRJ-01',
      kind: 'vouch',
      vouchCode: 'VOUCH-ITER-2026-001',
      category: 'Production AI Architecture',
      quote:
        'Clean multi-agent graph orchestration with deterministic fallback and crisp audit citations. Ready for enterprise FinTech pilots.',
      certifiedSkills: ['LangGraph', 'Qdrant', 'FastAPI', 'Distributed Tracing'],
      rating: 5,
      resolved: true,
      hoursAgo: 12,
    },
    {
      id: 'end_02',
      alumCode: 'ALUM-04',
      targetType: 'project',
      targetCode: 'PRJ-02',
      kind: 'vouch',
      vouchCode: 'VOUCH-ITER-2026-002',
      category: 'Embedded Cryptography',
      quote:
        'Memory-safe CRYSTALS-Kyber handshake within Cortex-M SRAM bounds is genuinely impressive for an undergraduate team.',
      certifiedSkills: ['Rust', 'ARM Cortex-M', 'Post-Quantum Crypto', 'FreeRTOS'],
      rating: 5,
      resolved: true,
      hoursAgo: 20,
    },
    {
      id: 'end_03',
      alumCode: 'ALUM-06',
      targetType: 'project',
      targetCode: 'PRJ-03',
      kind: 'endorsement',
      category: 'Distributed ML Systems',
      quote:
        'Smart gradient compression strategy over campus Wi-Fi nodes. Straggler-aware aggregation holds steady under packet drops.',
      certifiedSkills: ['PyTorch', 'Flower', 'gRPC', 'CUDA'],
      rating: 5,
      resolved: true,
      hoursAgo: 28,
    },
    {
      id: 'end_04',
      alumCode: 'ALUM-02',
      targetType: 'project',
      targetCode: 'PRJ-04',
      kind: 'vouch',
      vouchCode: 'VOUCH-ITER-2026-003',
      category: 'Formal Verification & Tooling',
      quote:
        'Coupling Tree-sitter ASTs with Z3 SMT constraints to catch Rust unsafe invariants pre-compile is staff-level engineering.',
      certifiedSkills: ['Rust', 'Z3 SMT Solver', 'Tree-sitter', 'TypeScript'],
      rating: 5,
      resolved: true,
      hoursAgo: 35,
    },
    {
      id: 'end_05',
      alumCode: 'ALUM-09',
      targetType: 'project',
      targetCode: 'PRJ-05',
      kind: 'vouch',
      vouchCode: 'VOUCH-ITER-2026-004',
      category: 'CleanTech Telemetry',
      quote:
        'Spatio-temporal GNN dispatch forecasts align closely with real microgrid inverter curtailment curves.',
      certifiedSkills: ['PyTorch Geometric', 'TimescaleDB', 'MQTT'],
      rating: 5,
      resolved: true,
      hoursAgo: 44,
    },
    {
      id: 'end_06',
      alumCode: 'ALUM-11',
      targetType: 'project',
      targetCode: 'PRJ-06',
      kind: 'roast',
      category: 'Latency & Caching',
      quote:
        'Great campus adoption, but move hostel mess queue polling from 5s HTTP intervals to Redis pub/sub + SSE to halve DB IOPS.',
      certifiedSkills: ['Redis', 'Node.js'],
      rating: 4,
      resolved: false,
      hoursAgo: 52,
    },
    {
      id: 'end_07',
      alumCode: 'ALUM-05',
      targetType: 'paper',
      targetCode: 'RP-01',
      kind: 'vouch',
      vouchCode: 'VOUCH-ITER-2026-005',
      category: 'Peer Research Validation',
      quote:
        'Strong empirical ablation across reconciliation failure modes. Recommended adding adversarial ledger perturbation benchmarks.',
      certifiedSkills: ['Agentic RAG', 'Python', 'Financial Compliance AI'],
      rating: 5,
      resolved: true,
      hoursAgo: 60,
    },
    {
      id: 'end_08',
      alumCode: 'ALUM-08',
      targetType: 'paper',
      targetCode: 'RP-02',
      kind: 'endorsement',
      category: 'Hardware Security Review',
      quote:
        'Constant-time NTT polynomial multiplication avoids timing side-channels on low-power medical wearables.',
      certifiedSkills: ['C++', 'ARM Cortex-M', 'Side-Channel Mitigation'],
      rating: 5,
      resolved: true,
      hoursAgo: 70,
    },
  ];

  const endorsements: EndorsementDTO[] = [];
  const vouchCertificates: Record<string, VouchCertificateDTO> = {};
  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const paperMap = new Map(papers.map((p) => [p.id, p]));

  for (const spec of endorsementSpecs) {
    const alum = alumniByCode.get(spec.alumCode);
    if (!alum) continue;
    const dto: EndorsementDTO = {
      id: spec.id,
      alumniUserId: alum.id,
      alumName: alum.fullName,
      alumRole: alum.designation ?? 'Verified Alumni',
      alumCompany: alum.company ?? 'Industry Partner',
      alumBatch: alum.batchYear ?? 2018,
      alumAvatar: alum.avatarUrl,
      kind: spec.kind,
      vouchCode: spec.vouchCode ?? null,
      category: spec.category,
      quote: spec.quote,
      certifiedSkills: spec.certifiedSkills,
      rating: spec.rating,
      resolved: spec.resolved,
      createdAt: isoOffset(spec.hoursAgo),
    };
    endorsements.push(dto);

    if (spec.targetType === 'project') {
      const targetId = projectCodeToId.get(spec.targetCode);
      const proj = targetId ? projectMap.get(targetId) : undefined;
      if (proj) {
        proj.endorsements.push(dto);
        if (spec.vouchCode) {
          vouchCertificates[spec.vouchCode] = {
            vouchCode: spec.vouchCode,
            valid: true,
            signatureDigest: createSignatureDigest(spec.vouchCode, spec.quote),
            issuedAt: dto.createdAt,
            projectId: proj.id,
            projectCode: proj.code,
            projectTitle: proj.title,
            studentNames: proj.contributors.map((c) => c.name),
            alumUserId: alum.id,
            alumName: alum.fullName,
            alumDesignation: alum.designation ?? 'Alumni Mentor',
            alumCompany: alum.company ?? 'Industry Partner',
            alumBatch: alum.batchYear ?? 2018,
            alumAvatar: alum.avatarUrl,
            alumVerified: true,
            quote: spec.quote,
            certifiedSkills: spec.certifiedSkills,
            publicUrl: `/vouch/${spec.vouchCode}`,
          };
        }
      }
    } else {
      const targetId = paperCodeToId.get(spec.targetCode);
      const paper = targetId ? paperMap.get(targetId) : undefined;
      if (paper) {
        paper.endorsements.push(dto);
        if (spec.vouchCode) {
          const names = paper.coAuthorName
            ? [paper.leadAuthorName, paper.coAuthorName]
            : [paper.leadAuthorName];
          vouchCertificates[spec.vouchCode] = {
            vouchCode: spec.vouchCode,
            valid: true,
            signatureDigest: createSignatureDigest(spec.vouchCode, spec.quote),
            issuedAt: dto.createdAt,
            projectId: paper.id,
            projectCode: paper.code,
            projectTitle: paper.title,
            studentNames: names,
            alumUserId: alum.id,
            alumName: alum.fullName,
            alumDesignation: alum.designation ?? 'Alumni Mentor',
            alumCompany: alum.company ?? 'Industry Partner',
            alumBatch: alum.batchYear ?? 2018,
            alumAvatar: alum.avatarUrl,
            alumVerified: true,
            quote: spec.quote,
            certifiedSkills: spec.certifiedSkills,
            publicUrl: `/vouch/${spec.vouchCode}`,
          };
        }
      }
    }
  }

  // 9. Seed 32 Job Postings (exact count matching ALUMNI_DATA activeJobOpeningsCount)
  const roleTemplatesByCategory: Record<
    string,
    Array<{
      roleTitle: string;
      jobType: 'Full-Time' | 'Internship' | 'Paid Bounty';
      location: string;
      compensation: string;
      eligibility: string;
    }>
  > = {
    'Startup Founder': [
      {
        roleTitle: 'Founding AI Systems Engineer',
        jobType: 'Full-Time',
        location: 'Bengaluru / Hybrid',
        compensation: '₹22–28 LPA + ESOPs',
        eligibility: '4th Year CSE / CSIT • Shipped AI or Distributed Build',
      },
      {
        roleTitle: 'Full-Stack Product Intern',
        jobType: 'Internship',
        location: 'Remote / Bengaluru',
        compensation: '₹55,000 / month',
        eligibility: '3rd & 4th Year • Next.js + FastAPI Portfolio',
      },
      {
        roleTitle: 'Latency Benchmark Bounty',
        jobType: 'Paid Bounty',
        location: 'Remote',
        compensation: '₹40,000 fixed bounty',
        eligibility: 'All Years • Open-source PR or Benchmark Repo',
      },
    ],
    'Executive Leadership': [
      {
        roleTitle: 'Software Development Engineer (SDE-1)',
        jobType: 'Full-Time',
        location: 'Hyderabad / Bengaluru',
        compensation: '₹26–34 LPA',
        eligibility: '4th Year CSE / CSIT / ECE • CGPA ≥ 8.0',
      },
      {
        roleTitle: 'Cloud Infrastructure & Kernel Intern',
        jobType: 'Internship',
        location: 'Bengaluru',
        compensation: '₹75,000 / month',
        eligibility: '3rd Year • Systems / Kubernetes / Go / Rust',
      },
      {
        roleTitle: 'Applied Systems Research Intern',
        jobType: 'Internship',
        location: 'Hyderabad',
        compensation: '₹70,000 / month',
        eligibility: '3rd & 4th Year • Published Paper or Verified Build',
      },
      {
        roleTitle: 'Platform Reliability Engineer (New Grad)',
        jobType: 'Full-Time',
        location: 'Chennai / Bengaluru',
        compensation: '₹24 LPA',
        eligibility: '4th Year • Linux, eBPF, Docker, Go',
      },
      {
        roleTitle: 'Developer Tooling Security Bounty',
        jobType: 'Paid Bounty',
        location: 'Remote',
        compensation: '₹50,000 bounty',
        eligibility: 'All Years • Static Analysis / SMT Verification',
      },
    ],
    'HR / Talent Acquisition': [
      {
        roleTitle: 'Campus Pool SDE-1 (Backend & Payments)',
        jobType: 'Full-Time',
        location: 'Bengaluru',
        compensation: '₹20–24 LPA',
        eligibility: '4th Year B.Tech • Strong DSA + Production Build',
      },
      {
        roleTitle: 'Frontend Platform Engineer (React / Next.js)',
        jobType: 'Full-Time',
        location: 'Gurugram / Bengaluru',
        compensation: '₹18–22 LPA',
        eligibility: '4th Year • Live Deployed Web App',
      },
      {
        roleTitle: 'Summer Engineering Intern (2027 Batch)',
        jobType: 'Internship',
        location: 'Bengaluru',
        compensation: '₹60,000 / month',
        eligibility: '3rd Year CSE / CSIT / ECE • CGPA ≥ 7.8',
      },
      {
        roleTitle: 'Data & Analytics Engineering Intern',
        jobType: 'Internship',
        location: 'Bengaluru / Hybrid',
        compensation: '₹50,000 / month',
        eligibility: '3rd Year • SQL, Python, Spark/Postgres',
      },
      {
        roleTitle: 'Mobile Apps Engineer (React Native / Flutter)',
        jobType: 'Full-Time',
        location: 'Bengaluru',
        compensation: '₹19 LPA',
        eligibility: '4th Year • Published Play Store / Expo App',
      },
      {
        roleTitle: 'UI/UX Engineering Sprint Bounty',
        jobType: 'Paid Bounty',
        location: 'Remote',
        compensation: '₹35,000 bounty',
        eligibility: '2nd–4th Year • Interactive Prototype',
      },
    ],
  };

  const jobs: JobPostingDTO[] = [];
  let jobCounter = 1;
  for (const alumRecord of ALUMNI_DATA) {
    if (!alumRecord.canPostJobs || alumRecord.activeJobOpeningsCount <= 0) {
      continue;
    }
    const alumUser = alumniByCode.get(alumRecord.id);
    if (!alumUser) continue;

    const templates =
      roleTemplatesByCategory[alumRecord.personaCategory] ??
      roleTemplatesByCategory['Startup Founder'];

    for (let i = 0; i < alumRecord.activeJobOpeningsCount; i += 1) {
      const tpl = templates[i % templates.length];
      const id = `job_${String(jobCounter).padStart(2, '0')}`;
      const deadlineDay = 10 + ((jobCounter * 3) % 18);
      jobs.push({
        id,
        postedByAlumniId: alumUser.id,
        alumniName: alumUser.fullName,
        alumniRole: `${alumRecord.designation} @ ${alumRecord.company}`,
        alumniAvatar: alumUser.avatarUrl,
        alumniVerified: true,
        roleTitle:
          i >= templates.length
            ? `${tpl.roleTitle} (Track ${i + 1})`
            : tpl.roleTitle,
        company: alumRecord.company,
        jobType: tpl.jobType,
        location: tpl.location,
        compensation: tpl.compensation,
        slots: tpl.jobType === 'Paid Bounty' ? 1 : 2 + (i % 3),
        eligibility: tpl.eligibility,
        skillsRequired: alumRecord.techStackExpertise.slice(0, 4),
        jdText: `Direct ITER Alumni referral track led by ${alumUser.fullName} (${alumRecord.designation}). Candidates must attach a live deployed project or research paper from their AlmaConnect portfolio demonstrating hands-on ownership in ${alumRecord.techStackExpertise.slice(0, 3).join(', ')}.`,
        deadline: `2026-11-${String(deadlineDay).padStart(2, '0')}`,
        status: 'open',
        applicationsCount: (jobCounter % 4) + 1,
        createdAt: isoOffset(8 + jobCounter * 4),
      });
      jobCounter += 1;
    }
  }

  // 10. Seed 10 Placement Offers
  const offers: PlacementOfferDTO[] = OFFERS_DATA.map((off, idx) => {
    const stu = studentByCode.get(off.studentId) ?? studentUsers[0];
    const alum = alumniByCode.get(off.referringAlumniId) ?? null;
    return {
      id: `off_${String(idx + 1).padStart(2, '0')}`,
      code: off.id,
      studentUserId: stu.id,
      studentName: off.studentName,
      academicYearBranch: off.academicYearBranch,
      company: off.company,
      jobRole: off.jobRole,
      packageStr: off.packageStr,
      packageLpa: parsePackageLpa(off.packageStr),
      offerType: off.offerType,
      referringAlumniId: alum?.id ?? null,
      referringAlumniName: alum?.fullName ?? null,
      status: off.status,
      verifiedByDean: true,
      createdAt: isoOffset(24 + idx * 12),
    };
  });

  // 11. Seed Job Applications
  const jobApplications: JobApplicationDTO[] = [
    {
      id: 'app_01',
      jobId: jobs[0]?.id ?? 'job_01',
      jobTitle: jobs[0]?.roleTitle ?? 'Founding AI Systems Engineer',
      company: jobs[0]?.company ?? 'HyperScale Labs',
      studentUserId: studentUsers[0].id,
      studentName: studentUsers[0].fullName,
      studentRegNo: studentUsers[0].regNo ?? '2341016214',
      studentBranch: studentUsers[0].branch ?? 'CSE',
      studentCgpa: studentUsers[0].cgpa ?? 9.42,
      studentAvatar: studentUsers[0].avatarUrl,
      showcaseProjectId: projects[0]?.id ?? null,
      showcaseProjectTitle: projects[0]?.title ?? null,
      note: 'Built FinAudit Multi-Agent with LangGraph + Qdrant; published IEEE Access paper RP-01.',
      status: 'offered',
      createdAt: isoOffset(36),
      updatedAt: isoOffset(18),
    },
    {
      id: 'app_02',
      jobId: jobs[3]?.id ?? 'job_04',
      jobTitle: jobs[3]?.roleTitle ?? 'Software Development Engineer (SDE-1)',
      company: jobs[3]?.company ?? 'Microsoft India',
      studentUserId: studentUsers[6].id,
      studentName: studentUsers[6].fullName,
      studentRegNo: studentUsers[6].regNo ?? '2341019033',
      studentBranch: studentUsers[6].branch ?? 'CSE',
      studentCgpa: studentUsers[6].cgpa ?? 9.68,
      studentAvatar: studentUsers[6].avatarUrl,
      showcaseProjectId: projects[3]?.id ?? null,
      showcaseProjectTitle: projects[3]?.title ?? null,
      note: 'ICSE Student Research Competition winner; Rust + Z3 SMT formal verification work.',
      status: 'shortlisted',
      createdAt: isoOffset(30),
      updatedAt: isoOffset(14),
    },
    {
      id: 'app_03',
      jobId: jobs[7]?.id ?? 'job_08',
      jobTitle: jobs[7]?.roleTitle ?? 'Campus Pool SDE-1 (Backend & Payments)',
      company: jobs[7]?.company ?? 'Razorpay',
      studentUserId: studentUsers[10].id,
      studentName: studentUsers[10].fullName,
      studentRegNo: studentUsers[10].regNo ?? '2341011022',
      studentBranch: studentUsers[10].branch ?? 'CSE',
      studentCgpa: studentUsers[10].cgpa ?? 9.1,
      studentAvatar: studentUsers[10].avatarUrl,
      showcaseProjectId: projects[5]?.id ?? null,
      showcaseProjectTitle: projects[5]?.title ?? null,
      note: 'Razorpay Hackathon Winner 2024; scaled CampusCart for 4,000+ ITER students.',
      status: 'under_review',
      createdAt: isoOffset(22),
      updatedAt: isoOffset(10),
    },
  ];

  // 12. Seed Coffee Chats
  const coffeeChats: CoffeeChatDTO[] = [
    {
      id: 'chat_req_01',
      studentUserId: studentUsers[0].id,
      studentName: studentUsers[0].fullName,
      studentMeta: '4th Year CSE • CGPA 9.42',
      studentAvatar: studentUsers[0].avatarUrl,
      alumniUserId: verifiedAlumniUsers[0].id,
      alumniName: verifiedAlumniUsers[0].fullName,
      alumniMeta: `${verifiedAlumniUsers[0].designation} @ ${verifiedAlumniUsers[0].company}`,
      alumniAvatar: verifiedAlumniUsers[0].avatarUrl,
      projectId: projects[0]?.id ?? null,
      projectTitle: projects[0]?.title ?? null,
      topic: 'Reviewing LangGraph agent state checkpointing at production scale',
      status: 'accepted',
      createdAt: isoOffset(40),
    },
    {
      id: 'chat_req_02',
      studentUserId: studentUsers[4].id,
      studentName: studentUsers[4].fullName,
      studentMeta: '3rd Year CSE • CGPA 9.35',
      studentAvatar: studentUsers[4].avatarUrl,
      alumniUserId: verifiedAlumniUsers[5].id,
      alumniName: verifiedAlumniUsers[5].fullName,
      alumniMeta: `${verifiedAlumniUsers[5].designation} @ ${verifiedAlumniUsers[5].company}`,
      alumniAvatar: verifiedAlumniUsers[5].avatarUrl,
      projectId: projects[2]?.id ?? null,
      projectTitle: projects[2]?.title ?? null,
      topic: 'AWS GPU cluster autoscaling tips for CampusFed GPU Mesh',
      status: 'pending',
      createdAt: isoOffset(16),
    },
    {
      id: 'chat_req_03',
      studentUserId: studentUsers[17].id,
      studentName: studentUsers[17].fullName,
      studentMeta: '2nd Year CSE • CGPA 9.38',
      studentAvatar: studentUsers[17].avatarUrl,
      alumniUserId: verifiedAlumniUsers[13].id,
      alumniName: verifiedAlumniUsers[13].fullName,
      alumniMeta: `${verifiedAlumniUsers[13].designation} @ ${verifiedAlumniUsers[13].company}`,
      alumniAvatar: verifiedAlumniUsers[13].avatarUrl,
      projectId: projects[9]?.id ?? null,
      projectTitle: projects[9]?.title ?? null,
      topic: 'WebXR shader optimization on mobile browsers',
      status: 'accepted',
      createdAt: isoOffset(12),
    },
  ];

  // 13. Seed Starter Chat Threads
  const makeMsg = (
    id: string,
    threadId: string,
    sender: SessionUser,
    senderRole: 'student' | 'alumni',
    text: string,
    hoursAgo: number
  ): ChatMessageDTO => ({
    id,
    threadId,
    senderUserId: sender.id,
    senderRole,
    senderName: sender.fullName,
    text,
    attachmentUrl: null,
    readAt: isoOffset(hoursAgo - 0.5),
    createdAt: isoOffset(hoursAgo),
  });

  const chatThreads: ChatThreadDTO[] = [
    {
      id: 'thread_01',
      studentUserId: studentUsers[0].id,
      studentName: studentUsers[0].fullName,
      studentMeta: '4th Year CSE • 2341016214',
      studentAvatar: studentUsers[0].avatarUrl,
      alumniUserId: verifiedAlumniUsers[0].id,
      alumniName: verifiedAlumniUsers[0].fullName,
      alumniMeta: 'Co-Founder & CTO @ HyperScale Labs',
      alumniAvatar: verifiedAlumniUsers[0].avatarUrl,
      topic: 'FinAudit Multi-Agent Architecture & PPO Onboarding',
      studentUnreadCount: 0,
      alumniUnreadCount: 1,
      lastMessageAt: isoOffset(3),
      messages: [
        makeMsg(
          'msg_01',
          'thread_01',
          studentUsers[0],
          'student',
          'Hi Debadatta sir! I pushed the deterministic ledger replay trace for FinAudit Multi-Agent.',
          8
        ),
        makeMsg(
          'msg_02',
          'thread_01',
          verifiedAlumniUsers[0],
          'alumni',
          'Reviewed the PR and issued VOUCH-ITER-2026-001. Let us sync on Friday for your HyperScale Systems track!',
          5
        ),
        makeMsg(
          'msg_03',
          'thread_01',
          studentUsers[0],
          'student',
          'Thank you sir! Looking forward to Friday at 4 PM IST.',
          3
        ),
      ],
    },
    {
      id: 'thread_02',
      studentUserId: studentUsers[2].id,
      studentName: studentUsers[2].fullName,
      studentMeta: '4th Year CSIT • 2341014102',
      studentAvatar: studentUsers[2].avatarUrl,
      alumniUserId: verifiedAlumniUsers[3].id,
      alumniName: verifiedAlumniUsers[3].fullName,
      alumniMeta: 'Staff Software Engineer @ Google',
      alumniAvatar: verifiedAlumniUsers[3].avatarUrl,
      topic: 'KyberMed Post-Quantum Benchmark Review',
      studentUnreadCount: 1,
      alumniUnreadCount: 0,
      lastMessageAt: isoOffset(5),
      messages: [
        makeMsg(
          'msg_04',
          'thread_02',
          studentUsers[2],
          'student',
          'Sir, we reduced Cortex-M stack usage by 18% using in-place NTT transforms.',
          9
        ),
        makeMsg(
          'msg_05',
          'thread_02',
          verifiedAlumniUsers[3],
          'alumni',
          'Awesome work Rohan. Share the latency histograms before the ACM CCS camera-ready deadline.',
          5
        ),
      ],
    },
  ];

  // 14. Seed Starter Notifications
  const notifications: NotificationDTO[] = [
    {
      id: 'notif_01',
      recipientUserId: studentUsers[0].id,
      actorUserId: verifiedAlumniUsers[0].id,
      category: 'vouch',
      title: 'New Alumni Vouch Certificate Issued',
      message: `${verifiedAlumniUsers[0].fullName} (${verifiedAlumniUsers[0].company}) certified FinAudit Multi-Agent with VOUCH-ITER-2026-001.`,
      targetSection: 'projects',
      targetEntityId: projects[0]?.id ?? null,
      actionLabel: 'View Certificate',
      isRead: false,
      createdAt: isoOffset(5),
    },
    {
      id: 'notif_02',
      recipientUserId: deanUser.id,
      actorUserId: pendingAlumniUsers[0].id,
      category: 'verification',
      title: 'Alumni Verification Pending Review',
      message: 'Soumyajit Mishra (Atlassian, Batch 2019) requested Dean verification.',
      targetSection: 'verification-queue',
      targetEntityId: 'verif_req_01',
      actionLabel: 'Review Queue',
      isRead: false,
      createdAt: isoOffset(6),
    },
    {
      id: 'notif_03',
      recipientUserId: verifiedAlumniUsers[5].id,
      actorUserId: studentUsers[4].id,
      category: 'coffee_chat',
      title: 'New Coffee Chat Request',
      message: 'Siddharth Nayak (3rd Year CSE) requested a 15-min review on CampusFed GPU Mesh.',
      targetSection: 'mentorship',
      targetEntityId: 'chat_req_02',
      actionLabel: 'Respond',
      isRead: false,
      createdAt: isoOffset(16),
    },
  ];

  // 15. Seed Institutional Audit Logs
  const auditLogs: InstitutionalAuditLogDTO[] = [
    {
      id: 'audit_01',
      actorUserId: verifiedAlumniUsers[0].id,
      actorName: verifiedAlumniUsers[0].fullName,
      category: 'vouch',
      title: 'Issued Vouch Certificate VOUCH-ITER-2026-001',
      impact: 'Certified Aarav Mohanty & team on FinAudit Multi-Agent (LangGraph, Qdrant)',
      createdAt: isoOffset(12),
    },
    {
      id: 'audit_02',
      actorUserId: deanUser.id,
      actorName: deanUser.fullName,
      category: 'offer_verified',
      title: 'Verified Google Embedded SWE PPO (₹36 LPA)',
      impact: 'Confirmed placement offer OFF-03 for Rohan Patnaik via Soumya Ranjan Panigrahi',
      createdAt: isoOffset(18),
    },
    {
      id: 'audit_03',
      actorUserId: verifiedAlumniUsers[2].id,
      actorName: verifiedAlumniUsers[2].fullName,
      category: 'job_post',
      title: 'Opened 6 Razorpay Campus Engineering Roles',
      impact: 'Enabled direct portfolio-backed applications for ITER 3rd & 4th Year builders',
      createdAt: isoOffset(26),
    },
    {
      id: 'audit_04',
      actorUserId: deanUser.id,
      actorName: deanUser.fullName,
      category: 'verification',
      title: 'Verified 14 Founding ITER Alumni Mentors',
      impact: 'Activated alumni vouching, referrals, and mentorship shields across 14 partner companies',
      createdAt: isoOffset(48),
    },
    {
      id: 'audit_05',
      actorUserId: studentUsers[0].id,
      actorName: studentUsers[0].fullName,
      category: 'mvp_ship',
      title: 'Shipped 45 Student Builds & 5 Peer-Reviewed Papers',
      impact: 'Cross-batch technical showcase indexed across CSE, CSIT, ECE, and EEE',
      createdAt: isoOffset(72),
    },
  ];

  // 16. Per-user Set<string> social & engagement trackers
  const likedBuildKeysByUser: Record<string, Set<string>> = {
    [studentUsers[0].id]: new Set(['project:prj_02', 'project:prj_04', 'paper:rp_01']),
    [verifiedAlumniUsers[0].id]: new Set(['project:prj_01', 'paper:rp_01']),
  };

  const savedItemKeysByUser: Record<string, Set<string>> = {
    [studentUsers[0].id]: new Set(['project:prj_04', 'job:job_01', 'paper:rp_02']),
    [verifiedAlumniUsers[0].id]: new Set(['project:prj_01', 'project:prj_20']),
  };

  const followingIdsByUser: Record<string, Set<string>> = {
    [studentUsers[0].id]: new Set([
      verifiedAlumniUsers[0].id,
      verifiedAlumniUsers[3].id,
      studentUsers[1].id,
    ]),
    [verifiedAlumniUsers[0].id]: new Set([studentUsers[0].id, studentUsers[9].id]),
  };

  return {
    institution,
    users,
    studentAcademicsByUserId,
    alumniCareerByUserId,
    verificationRequests,
    projects,
    papers,
    endorsements,
    vouchCertificates,
    jobs,
    jobApplications,
    coffeeChats,
    offers,
    auditLogs,
    chatThreads,
    notifications,
    likedBuildKeysByUser,
    savedItemKeysByUser,
    followingIdsByUser,
  };
}

const globalForStore = globalThis as typeof globalThis & {
  __almaConnectFallbackStore?: FallbackStoreState;
};

/**
 * Returns the shared, deterministic `globalThis`-persisted relational store
 * seeded once from `src/data/alumConnectData.ts`.
 */
export function getFallbackStore(): FallbackStoreState {
  if (!globalForStore.__almaConnectFallbackStore) {
    globalForStore.__almaConnectFallbackStore = buildSeededStore();
  }
  return globalForStore.__almaConnectFallbackStore;
}

/**
 * Resets the fallback store back to the initial deterministic seed state.
 */
export function resetFallbackStore(): FallbackStoreState {
  globalForStore.__almaConnectFallbackStore = buildSeededStore();
  return globalForStore.__almaConnectFallbackStore;
}
