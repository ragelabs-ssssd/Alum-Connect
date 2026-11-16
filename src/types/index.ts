export type UserRole = 'student' | 'alumni' | 'tp_admin';

export type StudentCohort = '1st_year' | '2nd_year' | '3rd_year' | '4th_year';

export type AlumniTier = '0-5' | '5-10' | '10-15' | '15-25';

export type AlumniPersona = 'ic' | 'manager' | 'founder' | 'chro';

export type BandwidthShield =
  | '2 async reviews/mo'
  | '5-min async roast'
  | '1 session/quarter'
  | 'Direct deal room only';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  headline: string;
  cohort?: StudentCohort;
  cohortTag?: string;
  studentYearLabel?: string;
  branch?: string;
  alumniTier?: AlumniTier;
  alumniPersona?: AlumniPersona;
  company?: string;
  designation?: string;
  batchYear?: number;
  bandwidthShield?: BandwidthShield;
  techStack?: string[];
  skillsEndorsed?: { name: string; count: number; endorserRoles: string[] }[];
  squadName?: string;
  squadRole?: string;
  vouchCardsCount?: number;
}

export interface SquadMember {
  name: string;
  year: string;
  cohort: StudentCohort;
  role: string;
  avatar: string;
  branch: string;
  githubHandle?: string;
}

export interface RoastAnnotation {
  id: string;
  alumName: string;
  alumRole: string;
  alumCompany: string;
  alumBatch: number;
  alumAvatar: string;
  category: 'ui_ux' | 'api_architecture' | 'roadmap' | 'performance';
  feedback: string;
  rating: number; // 1 to 5
  resolved: boolean;
  timestamp: string;
}

export interface VouchEndorsement {
  id: string;
  vouchCode: string;
  alumName: string;
  alumRole: string;
  alumCompany: string;
  alumBatch: number;
  alumAvatar: string;
  quote: string;
  date: string;
  certifiedSkills: string[];
  publicUrl?: string;
}

export interface ProjectTask {
  name: string;
  assignee: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  notes: string;
}

export interface CampusProduct {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'web_app' | 'mobile_app' | 'ai_ml' | 'dev_tool' | 'iot';
  status: 'verified' | 'in_review' | 'beta';
  userTraction: number;
  tractionLabel: string;
  githubUrl: string;
  commitsCount: number;
  recentCommits: { hash: string; message: string; author: string; timeAgo: string }[];
  liveDemoUrl: string;
  previewImage: string;
  videoDemoUrl?: string;
  squadMembers: SquadMember[];
  vouches: VouchEndorsement[];
  roasts: RoastAnnotation[];
  tags: string[];
  problemStatement?: string;
  rolesNeeded?: string[];
  tasks?: ProjectTask[];
  timeline?: string;
  hiringStatus: 'Open for Acqui-hire' | 'Open for Internships' | 'Looking for 1st Yr Scouts' | 'Funded & Scaling';
  publishedAt: string;
  viewsCount: number;
}

export interface Bounty {
  id: string;
  title: string;
  company: string;
  alumName: string;
  alumBatch: number;
  alumAvatar: string;
  stipend: string;
  duration: string;
  targetCohort: StudentCohort | 'All';
  description: string;
  deliverables: string[];
  skillsRequired: string[];
  appliedSquadsCount: number;
  status: 'Open' | 'In Progress' | 'Completed';
  deadline: string;
}

export interface AlumSpotlight {
  id: string;
  alumName: string;
  batch: number;
  currentCompany: string;
  currentRole: string;
  previousCompany?: string;
  avatar: string;
  headline: string;
  type: 'job_switch' | 'leadership_talk' | 'mentorship_open';
  details: string;
  slotsAvailable?: number;
  date: string;
}

export interface DealRoomAction {
  id: string;
  productId: string;
  productTitle: string;
  senderName: string;
  senderRole: string;
  senderCompany: string;
  actionType: 'acqui_hire' | 'paid_gig' | 'fast_track_interview' | 'campus_shortlist';
  message: string;
  proposedCompensation?: string;
  timestamp: string;
  status: 'Pending Review' | 'Accepted' | 'Interview Scheduled';
}
