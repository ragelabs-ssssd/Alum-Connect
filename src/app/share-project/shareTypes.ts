export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface TeammateMember {
  id: string;
  name: string;
  email: string;
  year: AcademicYear;
  regNumber: string;
  initials: string;
}

export interface VideoInputState {
  mode: 'upload' | 'link';
  fileName: string;
  url: string;
}

export interface ShareProjectFormData {
  projectName: string;
  oneLiner: string;
  shortDesc: string;
  detailedDesc: string;
  mode: 'individual' | 'group';
  academicYear: AcademicYear;
  regNumber: string;
  teammates: TeammateMember[];
  liveUrl: string;
  githubUrl: string;
  demoVideo: VideoInputState;
  pitchVideo: VideoInputState;
}

export const ITER_STUDENTS_DIRECTORY: TeammateMember[] = [
  {
    id: 'st-1',
    name: 'Ananya Mohanty',
    email: 'ananya.2341019042@soa.ac.in',
    year: '3rd Year',
    regNumber: '2341019042',
    initials: 'AM',
  },
  {
    id: 'st-2',
    name: 'Rohan Das',
    email: 'rohan.2241016108@soa.ac.in',
    year: '4th Year',
    regNumber: '2241016108',
    initials: 'RD',
  },
  {
    id: 'st-3',
    name: 'Sneha Panda',
    email: 'sneha.2341018215@soa.ac.in',
    year: '3rd Year',
    regNumber: '2341018215',
    initials: 'SP',
  },
  {
    id: 'st-4',
    name: 'Debasis Nayak',
    email: 'debasis.2441012094@soa.ac.in',
    year: '2nd Year',
    regNumber: '2441012094',
    initials: 'DN',
  },
  {
    id: 'st-5',
    name: 'Ritika Jena',
    email: 'ritika.2241017331@soa.ac.in',
    year: '4th Year',
    regNumber: '2241017331',
    initials: 'RJ',
  },
  {
    id: 'st-6',
    name: 'Subham Rout',
    email: 'subham.2341014409@soa.ac.in',
    year: '3rd Year',
    regNumber: '2341014409',
    initials: 'SR',
  },
];

export const EMPTY_SHARE_DATA: ShareProjectFormData = {
  projectName: '',
  oneLiner: '',
  shortDesc: '',
  detailedDesc: '',
  mode: 'individual',
  academicYear: '3rd Year',
  regNumber: '',
  teammates: [ITER_STUDENTS_DIRECTORY[0]],
  liveUrl: '',
  githubUrl: '',
  demoVideo: { mode: 'link', fileName: '', url: '' },
  pitchVideo: { mode: 'link', fileName: '', url: '' },
};

export const SAMPLE_GROUP_PROJECT: ShareProjectFormData = {
  projectName: 'Ragelabs Campus Proof Engine',
  oneLiner: 'Real-time GitHub sprint & alumni vouch platform for ITER engineering squads.',
  shortDesc:
    'Connects student repositories, live product demos, and 2-minute founder pitches directly with ITER alumni at top tech companies for fast-track referrals.',
  detailedDesc:
    'Problem: Static PDF resumes fail to show real engineering depth.\nArchitecture: Next.js 16 App Router, TypeScript, Tailwind CSS, and persistent API routes synced across Student, Alumni, and Dean portals.\nImpact: 18 active campus projects, 4 alumni-verified vouches, and direct internship referrals.',
  mode: 'group',
  academicYear: '3rd Year',
  regNumber: '2341019042',
  teammates: ITER_STUDENTS_DIRECTORY.slice(0, 4),
  liveUrl: 'https://alum-connect-soa.vercel.app',
  githubUrl: 'https://github.com/ragelabs-ssssd/Alum-Connect',
  demoVideo: {
    mode: 'link',
    fileName: 'ragelabs-demo-walkthrough.mp4',
    url: 'https://www.loom.com/share/iter-product-demo-2min',
  },
  pitchVideo: {
    mode: 'link',
    fileName: 'ragelabs-founder-pitch.mp4',
    url: 'https://youtu.be/iter-team-pitch-2min',
  },
};

export function detectHostingPlatform(url: string): string {
  const u = url.trim().toLowerCase();
  if (!u) return 'Awaiting URL';
  if (u.includes('vercel.app')) return 'Vercel';
  if (u.includes('github.io')) return 'GitHub Pages';
  if (u.includes('netlify.app')) return 'Netlify';
  if (u.includes('onrender.com') || u.includes('render.com')) return 'Render';
  return 'Custom Domain';
}

export function isValidIterRegNo(reg: string): boolean {
  return /^\d{10}$/.test(reg.trim());
}

export function computeReadiness(data: ShareProjectFormData): {
  pct: number;
  checks: {
    identity: boolean;
    academic: boolean;
    links: boolean;
    videos: boolean;
  };
} {
  const identity =
    data.projectName.trim().length > 1 &&
    data.oneLiner.trim().length > 5 &&
    data.shortDesc.trim().length > 10;
  const academic =
    data.mode === 'individual'
      ? isValidIterRegNo(data.regNumber)
      : data.teammates.length > 0 &&
        data.teammates.every((t) => isValidIterRegNo(t.regNumber));
  const links = data.liveUrl.trim().startsWith('http');
  const demoOk =
    Boolean(data.demoVideo.url.trim()) || Boolean(data.demoVideo.fileName.trim());
  const pitchOk =
    Boolean(data.pitchVideo.url.trim()) || Boolean(data.pitchVideo.fileName.trim());
  const videos = demoOk && pitchOk;

  const done = [identity, academic, links, videos].filter(Boolean).length;
  return {
    pct: Math.round((done / 4) * 100),
    checks: { identity, academic, links, videos },
  };
}
