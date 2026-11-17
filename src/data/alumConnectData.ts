export interface ProjectRecord {
  id: string;
  name: string;
  pitch: string;
  shortDesc: string;
  detailedDesc: string;
  collaborationMode: 'Group' | 'Solo';
  teamSize: number;
  leadName: string;
  leadRegNo: string;
  coContributorsNames: string[];
  coContributorsRegNos: string[];
  academicYears: string;
  techStack: string[];
  liveUrl: string;
  hostingPlatform: string;
  githubUrl: string;
  demoVideoUrl: string;
  pitchVideoUrl: string;
  linkedPaperId: string | null;
  coverImage: string;
}

export interface ResearchPaperRecord {
  id: string;
  topic: string;
  abstract: string;
  domain: string;
  venue: string;
  status: 'Published' | 'Accepted' | 'Under Peer Review';
  authorMode: 'Dual' | 'Solo';
  leadAuthorName: string;
  leadAuthorRegNo: string;
  leadAuthorYearBranch: string;
  coAuthorName: string | null;
  coAuthorRegNo: string | null;
  coAuthorYearBranch: string | null;
  preprintUrl: string;
  codeRepoUrl: string;
  liveDemoUrl: string;
  techStack: string[];
  coverImage: string;
}

export interface StudentRecord {
  id: string;
  fullName: string;
  regNo: string;
  academicYear: string;
  branch: string;
  isResearchAuthor: boolean;
  researchPaperIds: string[];
  projectIds: string[];
  totalProjectsCount: number;
  email: string;
  bio: string;
  techStack: string[];
}

export interface AlumniRecord {
  id: string;
  fullName: string;
  batchYear: number;
  company: string;
  designation: string;
  personaCategory: string;
  mentorshipScope: string;
  linkedStudentIds: string[];
  linkedProjectIds: string[];
  linkedPaperIds: string[];
  canPostJobs: boolean;
  activeJobOpeningsCount: number;
  techStackExpertise: string[];
}

export interface OfferRecord {
  id: string;
  studentId: string;
  studentName: string;
  academicYearBranch: string;
  company: string;
  jobRole: string;
  packageStr: string;
  offerType: 'PPO' | 'Internship';
  referringAlumniId: string;
  status: 'Accepted' | 'Joined';
}

export const INDIAN_GENERAL_IMAGES = [
  '/images/indian-student-tech.jpg',
  '/images/indian-student-team.jpg',
  '/images/indian-campus-lab.jpg',
  '/images/indian-alumni-mentor.jpg',
] as const;

export const INDIAN_FEMALE_AVATARS = [
  '/images/avatar-female-1.jpg',
  '/images/avatar-female-2.jpg',
] as const;

export const INDIAN_MALE_AVATARS = [
  '/images/avatar-male-1.jpg',
  '/images/avatar-male-2.jpg',
  '/images/indian-alumni-mentor.jpg',
] as const;

const FEMALE_FIRST_NAMES = new Set([
  'ananya',
  'sneha',
  'priyanka',
  'meera',
  'kabita',
  'ipsita',
  'shreya',
  'divya',
  'pooja',
  'nandini',
  'chinmayee',
  'ishani',
  'manaswini',
  'priyadarshini',
  'anindita',
  'smriti',
  'subhasmita',
  'rina',
  'ankita',
  'priya',
]);

export const PERSON_AVATAR_MAP: Record<string, string> = {
  // Male Students (18 unique)
  'aarav mohanty': '/images/avatar-male-1.jpg',
  'rohan patnaik': '/images/avatar-male-2.jpg',
  'siddharth nayak': '/images/avatars/male-a-0.jpg',
  'vikramaditya sen': '/images/avatars/male-a-1.jpg',
  'debashish panda': '/images/avatars/male-a-2.jpg',
  'aditya rath': '/images/avatars/male-a-3.jpg',
  'subham swain': '/images/avatars/male-a-4.jpg',
  'tanmay das': '/images/avatars/male-a-5.jpg',
  'ritwik mohapatra': '/images/avatars/male-a-6.jpg',
  'sourav patra': '/images/avatars/male-a-7.jpg',
  'pranav kulkarni': '/images/avatars/male-a-8.jpg',
  'ayushman jena': '/images/avatars/male-b-0.jpg',
  'harshvardhan sahu': '/images/avatars/male-b-1.jpg',
  'nikhil parida': '/images/avatars/male-b-2.jpg',
  'swastik lenka': '/images/avatars/male-b-3.jpg',
  'kunal barik': '/images/avatars/male-b-4.jpg',
  'abhishek mahanta': '/images/avatars/male-b-5.jpg',
  'ankit biswal': '/images/avatars/male-b-6.jpg',

  // Female Students (13 unique)
  'ananya dash': '/images/avatar-female-1.jpg',
  'ananya mohanty': '/images/avatar-female-1.jpg',
  'sneha mishra': '/images/avatar-female-2.jpg',
  'priyanka sahoo': '/images/avatars/female-a-0.jpg',
  'meera krishnan': '/images/avatars/female-a-1.jpg',
  'kabita behera': '/images/avatars/female-a-2.jpg',
  'ipsita tripathy': '/images/avatars/female-a-3.jpg',
  'shreya nanda': '/images/avatars/female-a-4.jpg',
  'divya rout': '/images/avatars/female-a-5.jpg',
  'pooja samal': '/images/avatars/female-a-6.jpg',
  'nandini kar': '/images/avatars/female-a-7.jpg',
  'chinmayee das': '/images/avatars/female-a-8.jpg',
  'ishani roy': '/images/avatars/female-b-0.jpg',
  'manaswini sahu': '/images/avatars/female-b-1.jpg',

  // Male Alumni (8 unique)
  'debadatta rath': '/images/indian-alumni-mentor.jpg',
  'rajesh kumar mohanty': '/images/avatars/alum-m-0.jpg',
  'soumya ranjan panigrahi': '/images/avatars/alum-m-1.jpg',
  'siddharth shekhar das': '/images/avatars/alum-m-2.jpg',
  'bikash chandra sahoo': '/images/avatars/alum-m-3.jpg',
  'tapas ranjan nayak': '/images/avatars/alum-m-4.jpg',
  'manoj kumar behera': '/images/avatars/alum-m-5.jpg',
  'alok mohapatra': '/images/avatars/alum-m-6.jpg',

  // Female Alumni (6 unique)
  'priyadarshini tripathy': '/images/avatars/female-b-2.jpg',
  'anindita pattnaik': '/images/avatars/female-b-3.jpg',
  'smriti rekha samal': '/images/avatars/female-b-4.jpg',
  'subhasmita rout': '/images/avatars/female-b-5.jpg',
  'rina pradhan': '/images/avatars/female-b-6.jpg',
  'ankita acharya': '/images/avatars/female-b-7.jpg',
};

export function getIndianAvatar(name: string): string {
  const primary = name.split('&')[0].trim().toLowerCase();
  if (PERSON_AVATAR_MAP[primary]) {
    return PERSON_AVATAR_MAP[primary];
  }
  const first = primary.split(/\s+/)[0] || '';
  const hash = primary.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  if (FEMALE_FIRST_NAMES.has(first)) {
    return INDIAN_FEMALE_AVATARS[hash % INDIAN_FEMALE_AVATARS.length];
  }
  return INDIAN_MALE_AVATARS[hash % INDIAN_MALE_AVATARS.length];
}

export function getIndianBanner(seed: number): string {
  return INDIAN_GENERAL_IMAGES[Math.abs(seed) % 3];
}

export interface StudentAcademicExtra {
  cgpa: number;
  class10School: string;
  class10Board: string;
  class10Pct: string;
  class12School: string;
  class12Board: string;
  class12Pct: string;
  primaryClub: string;
  secondaryClub: string;
  clubRole: string;
  achievement: string;
}

export const STUDENT_ACADEMICS: Record<string, StudentAcademicExtra> = {
  'STU-01': { cgpa: 9.42, class10School: 'DAV Public School Chandrasekharpur', class10Board: 'CBSE', class10Pct: '95.4%', class12School: 'SAI International School Bhubaneswar', class12Board: 'CBSE', class12Pct: '94.2%', primaryClub: 'ACM Student Chapter', secondaryClub: 'Coding Club - CDPC', clubRole: 'Chair & Lead Systems Architect', achievement: 'SIH 2024 Grand Winner & Best Systems Paper' },
  'STU-02': { cgpa: 9.28, class10School: 'DPS Kalinga Cuttack', class10Board: 'CBSE', class10Pct: '96.2%', class12School: 'DPS Kalinga Cuttack', class12Board: 'CBSE', class12Pct: '93.8%', primaryClub: 'AI/ML Society', secondaryClub: 'Toastmasters ITER', clubRole: 'Research Lead & VP Education', achievement: 'Published in Interspeech Workshop 2024' },
  'STU-03': { cgpa: 9.55, class10School: 'Loyola School Bhubaneswar', class10Board: 'ICSE', class10Pct: '94.8%', class12School: 'Loyola School Bhubaneswar', class12Board: 'ISC', class12Pct: '92.6%', primaryClub: 'IoT & Embedded Lab', secondaryClub: 'GDSC ITER', clubRole: 'Embedded Systems Lead', achievement: 'Google Summer of Code (GSoC) 2024 Contributor' },
  'STU-04': { cgpa: 8.95, class10School: "Mother's Public School Bhubaneswar", class10Board: 'CBSE', class10Pct: '93.5%', class12School: "Mother's Public School Bhubaneswar", class12Board: 'CBSE', class12Pct: '91.2%', primaryClub: 'IEEE Student Branch', secondaryClub: 'Robotics Club - Robocon', clubRole: 'Hardware Security Lead', achievement: 'Intel Hardware Security Hackathon 1st Runner-Up' },
  'STU-05': { cgpa: 9.35, class10School: "St. Xavier's High School Khandagiri", class10Board: 'ICSE', class10Pct: '92.0%', class12School: 'DAV Public School Unit-8', class12Board: 'CBSE', class12Pct: '90.5%', primaryClub: 'GDSC ITER', secondaryClub: 'Coding Club - CDPC', clubRole: 'Cloud Architecture Lead', achievement: 'AWS Certified Solutions Architect Associate' },
  'STU-06': { cgpa: 8.88, class10School: 'Kendriya Vidyalaya No. 1 Bhubaneswar', class10Board: 'CBSE', class10Pct: '91.5%', class12School: 'BJB Junior College Bhubaneswar', class12Board: 'CHSE', class12Pct: '89.5%', primaryClub: 'Web Development Club', secondaryClub: 'Design & Media Club', clubRole: 'Frontend Core Coordinator', achievement: 'Smart Odisha Hackathon 2nd Place' },
  'STU-07': { cgpa: 9.68, class10School: 'Stewart School Cuttack', class10Board: 'ICSE', class10Pct: '97.0%', class12School: 'Stewart School Cuttack', class12Board: 'ISC', class12Pct: '95.2%', primaryClub: 'Coding Club - CDPC', secondaryClub: 'ACM Student Chapter', clubRole: 'Competitive Programming Lead', achievement: 'ICPC Amritapuri Regionalist & Codeforces Master' },
  'STU-08': { cgpa: 8.92, class10School: 'Chinmaya Vidyalaya Rourkela', class10Board: 'CBSE', class10Pct: '92.8%', class12School: 'Chinmaya Vidyalaya Rourkela', class12Board: 'CBSE', class12Pct: '91.0%', primaryClub: 'Robotics Club - Robocon', secondaryClub: 'IEEE Student Branch', clubRole: 'EV Powertrain Lead', achievement: 'National E-Mobility Challenge 2024 Finalist' },
  'STU-09': { cgpa: 9.15, class10School: 'DAV Public School Pokhariput', class10Board: 'CBSE', class10Pct: '94.0%', class12School: 'DAV Public School Pokhariput', class12Board: 'CBSE', class12Pct: '92.5%', primaryClub: 'AI/ML Society', secondaryClub: 'GDSC ITER', clubRole: 'Data Analytics Lead', achievement: 'IEEE Student Research Colloquium Best Poster' },
  'STU-10': { cgpa: 8.74, class10School: "St. Joseph's High School Bhubaneswar", class10Board: 'ICSE', class10Pct: '89.5%', class12School: 'Ravenshaw Junior College Cuttack', class12Board: 'CHSE', class12Pct: '88.0%', primaryClub: 'Cyber Security Club', secondaryClub: 'Coding Club - CDPC', clubRole: 'Network Security Analyst', achievement: 'Capture The Flag (CTF) National Top 10' },
  'STU-11': { cgpa: 9.1, class10School: 'DPS Kalinga Cuttack', class10Board: 'CBSE', class10Pct: '93.2%', class12School: 'SAI International School Bhubaneswar', class12Board: 'CBSE', class12Pct: '91.8%', primaryClub: 'Coding Club - CDPC', secondaryClub: 'Literary Society', clubRole: 'Full-Stack Project Head', achievement: 'Razorpay Hackathon Winner 2024' },
  'STU-12': { cgpa: 9.05, class10School: "Mother's Public School Bhubaneswar", class10Board: 'CBSE', class10Pct: '92.5%', class12School: "Mother's Public School Bhubaneswar", class12Board: 'CBSE', class12Pct: '90.2%', primaryClub: 'GDSC ITER', secondaryClub: 'Toastmasters ITER', clubRole: 'Community Outreach Lead', achievement: 'Grace Hopper Celebration India Scholar' },
  'STU-13': { cgpa: 8.85, class10School: 'Kendriya Vidyalaya No. 2 CRPF', class10Board: 'CBSE', class10Pct: '88.5%', class12School: 'BJB Junior College Bhubaneswar', class12Board: 'CHSE', class12Pct: '87.2%', primaryClub: 'Web Development Club', secondaryClub: 'Social Service Guild', clubRole: 'DevOps Specialist', achievement: 'SOA Community Tech Outreach Award' },
  'STU-14': { cgpa: 8.9, class10School: 'DAV Public School CDA Cuttack', class10Board: 'CBSE', class10Pct: '91.0%', class12School: 'Ravenshaw Junior College Cuttack', class12Board: 'CHSE', class12Pct: '89.0%', primaryClub: 'IoT & Embedded Lab', secondaryClub: 'Robotics Club - Robocon', clubRole: 'Sensor Fusion Lead', achievement: 'National IoT Expo Innovation Award' },
  'STU-15': { cgpa: 9.22, class10School: 'SAI International School Bhubaneswar', class10Board: 'CBSE', class10Pct: '95.0%', class12School: 'SAI International School Bhubaneswar', class12Board: 'CBSE', class12Pct: '93.0%', primaryClub: 'AI/ML Society', secondaryClub: 'Coding Club - CDPC', clubRole: 'NLP Research Lead', achievement: 'SIH 2023 Hardware Edition Finalist' },
  'STU-16': { cgpa: 8.65, class10School: 'Stewart School Bhubaneswar', class10Board: 'ICSE', class10Pct: '88.0%', class12School: 'Stewart School Bhubaneswar', class12Board: 'ISC', class12Pct: '86.5%', primaryClub: 'IEEE Student Branch', secondaryClub: 'Robotics Club - Robocon', clubRole: 'Circuit Design Lead', achievement: 'Texas Instruments Innovation Challenge Semi-Finalist' },
  'STU-17': { cgpa: 9.45, class10School: "St. Paul's School Rourkela", class10Board: 'ICSE', class10Pct: '96.0%', class12School: 'DPS R.K. Puram New Delhi', class12Board: 'CBSE', class12Pct: '94.0%', primaryClub: 'Coding Club - CDPC', secondaryClub: 'ACM Student Chapter', clubRole: 'Systems & Kernel Lead', achievement: 'Linux Foundation Kernel Mentorship Fellow' },
  'STU-18': { cgpa: 9.38, class10School: 'DAV Public School Chandrasekharpur', class10Board: 'CBSE', class10Pct: '96.5%', class12School: 'SAI International School Bhubaneswar', class12Board: 'CBSE', class12Pct: '94.5%', primaryClub: 'GDSC ITER', secondaryClub: 'Design & Media Club', clubRole: 'AR/VR & XR Lead', achievement: 'Adobe GenSolve National Runner-Up' },
  'STU-19': { cgpa: 8.98, class10School: 'DPS Kalinga Cuttack', class10Board: 'CBSE', class10Pct: '91.5%', class12School: 'DPS Kalinga Cuttack', class12Board: 'CBSE', class12Pct: '90.0%', primaryClub: 'Web Development Club', secondaryClub: 'Coding Club - CDPC', clubRole: 'Backend Core Member', achievement: 'HackOdisha 3.0 Top 5 Team' },
  'STU-20': { cgpa: 8.8, class10School: "Mother's Public School Bhubaneswar", class10Board: 'CBSE', class10Pct: '90.5%', class12School: "Mother's Public School Bhubaneswar", class12Board: 'CBSE', class12Pct: '88.5%', primaryClub: 'IEEE Student Branch', secondaryClub: 'Toastmasters ITER', clubRole: 'Microelectronics Member', achievement: 'Women In Tech Early Explorer Grant' },
  'STU-21': { cgpa: 9.02, class10School: 'Kendriya Vidyalaya No. 1 Sambalpur', class10Board: 'CBSE', class10Pct: '92.0%', class12School: 'Gangadhar Meher Junior College', class12Board: 'CHSE', class12Pct: '89.8%', primaryClub: 'Cyber Security Club', secondaryClub: 'ACM Student Chapter', clubRole: 'Cloud Security Lead', achievement: 'Nullcon Bug Bounty Top 20 Contributor' },
  'STU-22': { cgpa: 8.78, class10School: 'DAV Public School Kalinga Nagar', class10Board: 'CBSE', class10Pct: '89.5%', class12School: 'BJB Junior College Bhubaneswar', class12Board: 'CHSE', class12Pct: '87.5%', primaryClub: 'Coding Club - CDPC', secondaryClub: 'Web Development Club', clubRole: 'Database Architecture Member', achievement: 'SOA Internal Hackathon 1st Position' },
  'STU-23': { cgpa: 8.84, class10School: "St. Xavier's High School Cuttack", class10Board: 'ICSE', class10Pct: '91.2%', class12School: 'Ravenshaw Junior College Cuttack', class12Board: 'CHSE', class12Pct: '88.8%', primaryClub: 'Robotics Club - Robocon', secondaryClub: 'SAE Collegiate Club', clubRole: 'Power Electronics Lead', achievement: 'E-Baja Formula Student Electrical Team Lead' },
  'STU-24': { cgpa: 8.9, class10School: 'Loyola School Bhubaneswar', class10Board: 'ICSE', class10Pct: '93.0%', class12School: 'Loyola School Bhubaneswar', class12Board: 'ISC', class12Pct: '91.5%', primaryClub: 'IEEE Student Branch', secondaryClub: 'AI/ML Society', clubRole: 'Smart Grid Researcher', achievement: 'IEEE PES Student Paper Presenter' },
  'STU-25': { cgpa: 8.7, class10School: 'DAV Public School Unit-8 Bhubaneswar', class10Board: 'CBSE', class10Pct: '88.5%', class12School: 'DAV Public School Unit-8 Bhubaneswar', class12Board: 'CBSE', class12Pct: '87.0%', primaryClub: 'IoT & Embedded Lab', secondaryClub: 'Cyber Security Club', clubRole: 'Firmware Tester', achievement: 'Embedded Linux Conference Attendee & Speaker' },
  'STU-26': { cgpa: 9.12, class10School: 'SAI International School Bhubaneswar', class10Board: 'CBSE', class10Pct: '94.5%', class12School: 'SAI International School Bhubaneswar', class12Board: 'CBSE', class12Pct: '92.2%', primaryClub: 'GDSC ITER', secondaryClub: 'Literary Society', clubRole: 'Technical Content Head & SWE', achievement: 'Flipkart GRiD 5.0 Semi-Finalist' },
  'STU-27': { cgpa: 8.85, class10School: 'Stewart School Cuttack', class10Board: 'ICSE', class10Pct: '90.0%', class12School: 'Stewart School Cuttack', class12Board: 'ISC', class12Pct: '88.0%', primaryClub: 'Coding Club - CDPC', secondaryClub: 'Design & Media Club', clubRole: 'UI/UX Lead & Full Stack Developer', achievement: 'Devfolio Community Builder Fellow' },
  'STU-28': { cgpa: 9.05, class10School: "Mother's Public School Bhubaneswar", class10Board: 'CBSE', class10Pct: '93.8%', class12School: "Mother's Public School Bhubaneswar", class12Board: 'CBSE', class12Pct: '91.5%', primaryClub: 'Web Development Club', secondaryClub: 'AI/ML Society', clubRole: 'Mobile App Developer', achievement: 'Flutter International Hackathon Special Mention' },
  'STU-29': { cgpa: 9.5, class10School: 'DPS Kalinga Cuttack', class10Board: 'CBSE', class10Pct: '97.5%', class12School: 'DPS Kalinga Cuttack', class12Board: 'CBSE', class12Pct: '95.8%', primaryClub: 'ACM Student Chapter', secondaryClub: 'Coding Club - CDPC', clubRole: 'President & Lead Researcher', achievement: 'Published in IEEE Transactions on Big Data' },
  'STU-30': { cgpa: 8.92, class10School: 'DAV Public School Chandrasekharpur', class10Board: 'CBSE', class10Pct: '92.2%', class12School: 'DAV Public School Chandrasekharpur', class12Board: 'CBSE', class12Pct: '90.5%', primaryClub: 'GDSC ITER', secondaryClub: 'Robotics Club - Robocon', clubRole: 'AI Vision Member', achievement: 'Smart India Hackathon Junior Winner' },
  'STU-31': { cgpa: 8.82, class10School: 'Kendriya Vidyalaya No. 1 Bhubaneswar', class10Board: 'CBSE', class10Pct: '91.0%', class12School: 'BJB Junior College Bhubaneswar', class12Board: 'CHSE', class12Pct: '89.0%', primaryClub: 'IEEE Student Branch', secondaryClub: 'IoT & Embedded Lab', clubRole: 'Signal Processing Associate', achievement: 'IEEE Women in Engineering Star Award' },
};

export interface AlumniCareerExtra {
  schooling: string;
  totalYears: number;
  careerStage: string;
  earlyCareer: string;
  midCareer: string;
  founderStatus: string;
}

export const ALUMNI_CAREER: Record<string, AlumniCareerExtra> = {
  'ALUM-01': { schooling: 'DAV Public School Chandrasekharpur (10th: 95.2%, 12th: 93.6%)', totalYears: 10, careerStage: 'Founder / C-Suite', earlyCareer: 'Mindtree (Junior SWE, 2016-2018)', midCareer: 'Hasura (Lead Platform Architect, 2018-2021)', founderStatus: 'Founder (AI & Systems Infrastructure)' },
  'ALUM-02': { schooling: "Mother's Public School Bhubaneswar (10th: 96.0%, 12th: 94.4%)", totalYears: 12, careerStage: 'Executive Director', earlyCareer: 'Oracle India (Systems Software Engineer, 2014-2017)', midCareer: 'InMobi (Principal Architect, 2017-2020)', founderStatus: 'Corporate Executive' },
  'ALUM-03': { schooling: 'BJB Collegiate School & Ravenshaw (10th: 91.8%, 12th: 89.5%)', totalYears: 11, careerStage: 'Corporate Leadership', earlyCareer: 'Wipro Technologies (Talent Analyst, 2015-2017)', midCareer: 'Swiggy (Senior Talent Acquisition Manager, 2017-2021)', founderStatus: 'Corporate Leadership' },
  'ALUM-04': { schooling: 'Loyola School Bhubaneswar (10th: 97.4%, 12th: 96.2%)', totalYears: 9, careerStage: 'Staff Engineer', earlyCareer: 'Texas Instruments (Embedded SWE, 2017-2019)', midCareer: 'Postman (Senior Systems Engineer, 2019-2022)', founderStatus: 'Staff Technical Specialist' },
  'ALUM-05': { schooling: 'DPS Kalinga Cuttack (10th: 95.8%, 12th: 94.0%)', totalYears: 10, careerStage: 'Founder / C-Suite', earlyCareer: 'Mu Sigma (Decision Scientist, 2016-2018)', midCareer: 'Fractal Analytics (Lead AI Researcher, 2018-2021)', founderStatus: 'Founder (Generative & Speech AI)' },
  'ALUM-06': { schooling: 'Stewart School Cuttack (10th: 94.6%, 12th: 93.0%)', totalYears: 13, careerStage: 'Executive Leadership (VP)', earlyCareer: 'Cognizant (Cloud Infrastructure Engineer, 2013-2016)', midCareer: 'Flipkart (Director of Cloud Infrastructure, 2016-2020)', founderStatus: 'Corporate Executive' },
  'ALUM-07': { schooling: 'SAI International School Bhubaneswar (10th: 93.5%, 12th: 91.8%)', totalYears: 8, careerStage: 'Corporate Specialist', earlyCareer: 'Infosys (Campus Recruitment Lead, 2018-2020)', midCareer: 'Urban Company (Talent Acquisition Specialist, 2020-2022)', founderStatus: 'Corporate Specialist' },
  'ALUM-08': { schooling: 'Kendriya Vidyalaya No. 1 BBSR (10th: 92.4%, 12th: 90.5%)', totalYears: 7, careerStage: 'Senior Research Specialist', earlyCareer: 'Qualcomm India (Hardware Security Intern to SWE, 2019-2021)', midCareer: 'CryptoQuant Tech (Security Firmware Engineer, 2021-2023)', founderStatus: 'Senior Research Specialist' },
  'ALUM-09': { schooling: 'Chinmaya Vidyalaya Rourkela (10th: 93.0%, 12th: 91.2%)', totalYears: 9, careerStage: 'Founder / CEO', earlyCareer: 'Tata Motors (EV Powertrain Engineer, 2017-2019)', midCareer: 'Ather Energy (Lead BMS Architect, 2019-2022)', founderStatus: 'Founder (CleanTech & EV Mobility)' },
  'ALUM-10': { schooling: "St. Joseph's High School BBSR (10th: 96.5%, 12th: 95.0%)", totalYears: 12, careerStage: 'Senior Director', earlyCareer: 'Juniper Networks (Network Protocols SWE, 2014-2017)', midCareer: 'Arista Networks (Director of Engineering, 2017-2021)', founderStatus: 'Corporate Executive' },
  'ALUM-11': { schooling: 'DAV Public School CDA Cuttack (10th: 91.5%, 12th: 89.2%)', totalYears: 7, careerStage: 'Staff Engineer', earlyCareer: 'Capgemini (Backend Associate, 2019-2021)', midCareer: 'Zeta Suite (Senior Distributed Systems SWE, 2021-2023)', founderStatus: 'Staff Technical Specialist' },
  'ALUM-12': { schooling: "Mother's Public School Bhubaneswar (10th: 92.8%, 12th: 90.4%)", totalYears: 9, careerStage: 'Corporate Leadership', earlyCareer: 'Tech Mahindra (HR Executive, 2017-2019)', midCareer: 'Cleartrip (HR Manager - Tech Hiring, 2019-2022)', founderStatus: 'Corporate Leadership' },
  'ALUM-13': { schooling: 'Stewart School Bhubaneswar (10th: 94.0%, 12th: 92.5%)', totalYears: 6, careerStage: 'Senior Protocol Engineer', earlyCareer: 'Infosys Finacle (Blockchain Associate, 2020-2021)', midCareer: 'Biconomy (Protocol SWE & ZK Researcher, 2021-2023)', founderStatus: 'Senior Technical Specialist' },
  'ALUM-14': { schooling: 'DAV Public School Pokhariput (10th: 95.0%, 12th: 93.8%)', totalYears: 8, careerStage: 'Senior Computer Vision Specialist', earlyCareer: 'Samsung R&D Bangalore (Computer Vision Engineer, 2018-2021)', midCareer: 'Glance / InMobi (Senior Graphics & AR SWE, 2021-2023)', founderStatus: 'Senior Technical Specialist' },
};

export interface WorkExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  detail: string;
}

export function getStudentExperience(
  student: StudentRecord,
  offer?: OfferRecord
): WorkExperienceItem[] {
  const extra = STUDENT_ACADEMICS[student.id];
  const items: WorkExperienceItem[] = [];
  if (offer) {
    items.push({
      role: offer.jobRole,
      company: offer.company,
      period: offer.offerType === 'PPO' ? 'Accepted PPO • 2026' : 'Joined Intern • 2026',
      location: 'India',
      summary: `${offer.offerType} (${offer.packageStr}) via ITER Alumni Referral.`,
    });
  }
  if (extra) {
    items.push({
      role: extra.clubRole,
      company: `${extra.primaryClub} & ${extra.secondaryClub}`,
      period: student.academicYear === '4th Year' ? '2024 – Present' : '2025 – Present',
      location: 'ITER, Bhubaneswar',
      summary: `${extra.achievement}. Shipped ${student.totalProjectsCount} projects (${student.techStack.slice(0, 3).join(', ')}).`,
    });
  }
  return items;
}

export function getStudentEducation(student: StudentRecord): EducationItem[] {
  const extra = STUDENT_ACADEMICS[student.id];
  const gradYear =
    student.academicYear === '4th Year'
      ? 2026
      : student.academicYear === '3rd Year'
        ? 2027
        : 2028;
  const startYear = gradYear - 4;
  const items: EducationItem[] = [
    {
      degree: `B.Tech in ${student.branch}`,
      institution: "ITER, Siksha 'O' Anusandhan",
      period: `${startYear} – ${gradYear}`,
      detail: `CGPA: ${extra ? extra.cgpa.toFixed(2) : '9.00'} • Reg: ${student.regNo}`,
    },
  ];
  if (extra) {
    items.push({
      degree: `Class XII (${extra.class12Board})`,
      institution: extra.class12School,
      period: `${startYear - 2} – ${startYear}`,
      detail: `Score: ${extra.class12Pct}`,
    });
    items.push({
      degree: `Class X (${extra.class10Board})`,
      institution: extra.class10School,
      period: `${startYear - 4} – ${startYear - 2}`,
      detail: `Score: ${extra.class10Pct}`,
    });
  }
  return items;
}

export function getAlumniExperience(alumni: AlumniRecord): WorkExperienceItem[] {
  const career = ALUMNI_CAREER[alumni.id];
  if (!career) return [];
  return [
    {
      role: alumni.designation,
      company: alumni.company,
      period: `${career.totalYears} yrs total exp • Current`,
      location: career.careerStage,
      summary: `${career.founderStatus} • Mentors on ${alumni.mentorshipScope}.`,
    },
    {
      role: 'Mid-Career Role',
      company: career.midCareer,
      period: 'Mid-Career',
      location: 'India',
      summary: `Expertise: ${alumni.techStackExpertise.slice(0, 4).join(', ')}.`,
    },
    {
      role: 'Early Career Role',
      company: career.earlyCareer,
      period: `Post-Batch '${String(alumni.batchYear).slice(-2)}`,
      location: 'India',
      summary: 'Foundation engineering & product delivery.',
    },
  ];
}

export function getAlumniEducation(alumni: AlumniRecord): EducationItem[] {
  const career = ALUMNI_CAREER[alumni.id];
  return [
    {
      degree: 'B.Tech • Undergraduate Engineering',
      institution: "ITER, Siksha 'O' Anusandhan",
      period: `${alumni.batchYear - 4} – ${alumni.batchYear}`,
      detail: `Graduation Batch ${alumni.batchYear} • Verified ITER Alum`,
    },
    ...(career
      ? [
          {
            degree: 'Schooling (Class X & Class XII)',
            institution: career.schooling,
            period: `Pre-${alumni.batchYear - 4}`,
            detail: 'Secondary & Senior Secondary Qualification',
          },
        ]
      : []),
  ];
}

const pickCoverImage = (idx: number) => INDIAN_GENERAL_IMAGES[idx % 3];

const rawProjects: Omit<ProjectRecord, 'coverImage'>[] = [
  {
    id: 'PRJ-01',
    name: 'FinAudit Multi-Agent',
    pitch: 'Autonomous compliance verifier for enterprise ledger anomalies',
    shortDesc: 'An agentic AI workflow that ingests double-entry accounting records, detects reconciliations anomalies, and drafts regulatory compliance audit reports.',
    detailedDesc: 'Built with multi-agent orchestration via LangGraph, FinAudit cross-references general ledger entries against statutory financial rules, flags high-risk discrepancies using semantic vector embeddings, and generates automated audit trails for compliance officers.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Aarav Mohanty',
    leadRegNo: '2341016214',
    coContributorsNames: ['Ananya Dash', 'Kabita Behera'],
    coContributorsRegNos: ['2341016089', '2341016301'],
    academicYears: '4th Year',
    techStack: ['Python', 'LangGraph', 'Qdrant', 'FastAPI', 'Next.js'],
    liveUrl: 'https://finaudit-ai.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-alum/finaudit-ai',
    demoVideoUrl: 'https://youtu.be/finaudit-demo-prj01',
    pitchVideoUrl: 'https://youtu.be/finaudit-pitch-prj01',
    linkedPaperId: 'RP-01',
  },
  {
    id: 'PRJ-02',
    name: 'KyberMed Edge Vault',
    pitch: 'Post-quantum encrypted telemetry bridge for wearable ICU monitors',
    shortDesc: 'A quantum-resilient cryptographic firmware bridge securing real-time telemetry streaming from intensive care medical sensors to hospital intranets.',
    detailedDesc: 'Implements CRYSTALS-Kyber post-quantum key encapsulation on ARM Cortex-M microcontrollers to safeguard sensitive cardiac and pulse-oximetry telemetry against harvest-now-decrypt-later cyberattacks in clinical network environments.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Rohan Patnaik',
    leadRegNo: '2341014102',
    coContributorsNames: ['Sneha Mishra'],
    coContributorsRegNos: ['2441013045'],
    academicYears: '4th / 3rd Year',
    techStack: ['C++', 'Rust', 'ARM Cortex-M', 'FreeRTOS', 'WebSockets'],
    liveUrl: 'https://kybermed.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/iter-sec/kybermed-vault',
    demoVideoUrl: 'https://youtu.be/kybermed-demo-prj02',
    pitchVideoUrl: 'https://youtu.be/kybermed-pitch-prj02',
    linkedPaperId: 'RP-02',
  },
  {
    id: 'PRJ-03',
    name: 'CampusFed GPU Mesh',
    pitch: 'Decentralized model training across idle hostel laptops',
    shortDesc: 'A federated compute cluster harnessing idle student GPU hardware across campus Wi-Fi for collective deep learning model fine-tuning.',
    detailedDesc: 'Utilizes Flower federated framework with custom gradient quantization to coordinate distributed model training over student laptops, featuring automated heartbeat health checks and dropout-tolerant weight averaging.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Siddharth Nayak',
    leadRegNo: '2441015198',
    coContributorsNames: ['Priyanka Sahoo', 'Debashish Panda'],
    coContributorsRegNos: ['2441015211', '2441015044'],
    academicYears: '3rd Year',
    techStack: ['PyTorch', 'Flower', 'CUDA', 'gRPC', 'React'],
    liveUrl: 'https://campusfed.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-sys/campusfed-mesh',
    demoVideoUrl: 'https://youtu.be/campusfed-demo-prj03',
    pitchVideoUrl: 'https://youtu.be/campusfed-pitch-prj03',
    linkedPaperId: 'RP-03',
  },
  {
    id: 'PRJ-04',
    name: 'RustGuard Z3',
    pitch: 'Formal verification playground catching memory leaks in AI-generated Rust',
    shortDesc: 'An automated AST analyzer translating AI-synthesized Rust unsafe blocks into Z3 SMT queries to mathematically prove memory safety.',
    detailedDesc: 'Employs Tree-sitter AST extraction and Z3 theorem proving to verify lifetime invariants, pointer validity, and borrow-checker guarantees in autonomous code generation pipelines before runtime compilation.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Vikramaditya Sen',
    leadRegNo: '2341019033',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Rust', 'Z3 SMT Solver', 'Tree-sitter', 'WebAssembly', 'React'],
    liveUrl: 'https://rustguard-z3.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/vikram-sen/rustguard-z3',
    demoVideoUrl: 'https://youtu.be/rustguard-demo-prj04',
    pitchVideoUrl: 'https://youtu.be/rustguard-pitch-prj04',
    linkedPaperId: 'RP-04',
  },
  {
    id: 'PRJ-05',
    name: 'GridPulse Bhubaneswar',
    pitch: 'Spatio-temporal load balancer for campus solar microgrids',
    shortDesc: 'A graph neural network dashboard forecasting campus solar generation and automating peak-load redistribution across academic blocks.',
    detailedDesc: 'Ingests rooftop solar PV metrics and feeder sensor streams into a spatio-temporal graph attention network to predict microgrid brownouts and automatically route battery storage power during high-demand classroom hours.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Meera Krishnan',
    leadRegNo: '2441018072',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['PyTorch Geometric', 'TimescaleDB', 'Python', 'Fastify', 'Next.js'],
    liveUrl: 'https://gridpulse-iter.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/meera-k/gridpulse-iter',
    demoVideoUrl: 'https://youtu.be/gridpulse-demo-prj05',
    pitchVideoUrl: 'https://youtu.be/gridpulse-pitch-prj05',
    linkedPaperId: 'RP-05',
  },
  {
    id: 'PRJ-06',
    name: 'SOA OneCampus',
    pitch: 'Unified campus app for cafeteria pre-orders, placement prep & admin routing',
    shortDesc: 'An integrated super-app streamlining student life with live canteen queues, training & placement mock tests, and smart grievance tickets.',
    detailedDesc: 'Connects over 10,000 students via role-based access control, PostgreSQL connection pooling, and push notifications, reducing cafeteria wait times by 40% and centralizing placement notifications.',
    collaborationMode: 'Group',
    teamSize: 4,
    leadName: 'Aditya Rath',
    leadRegNo: '2341011022',
    coContributorsNames: ['Ipsita Tripathy', 'Subham Swain', 'Tanmay Das'],
    coContributorsRegNos: ['2341011088', '2341012019', '2341012077'],
    academicYears: '4th Year',
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    liveUrl: 'https://soa-onecampus.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-campus/soa-onecampus',
    demoVideoUrl: 'https://youtu.be/onecampus-demo-prj06',
    pitchVideoUrl: 'https://youtu.be/onecampus-pitch-prj06',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-07',
    name: 'SQLPilot Copilot',
    pitch: 'Natural-language to optimized Oracle PL/SQL query debugger',
    shortDesc: 'An intelligent developer tool that translates plain English prompts into tuned Oracle SQL queries and explains execution plan bottlenecks.',
    detailedDesc: 'Combines LLM prompt engineering with static SQL AST parsing to flag full-table scans, suggest missing composite indexes, and optimize joins for enterprise Oracle and PostgreSQL relational databases.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Ritwik Mohapatra',
    leadRegNo: '2441016112',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['TypeScript', 'Monaco Editor', 'OpenAI API', 'Oracle SQL'],
    liveUrl: 'https://sqlpilot.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/ritwik-m/sqlpilot-copilot',
    demoVideoUrl: 'https://youtu.be/sqlpilot-demo-prj07',
    pitchVideoUrl: 'https://youtu.be/sqlpilot-pitch-prj07',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-08',
    name: 'VaniSetu Odia ASR',
    pitch: 'Low-resource speech-to-text API for Odia telemedicine kiosks',
    shortDesc: 'A fine-tuned acoustic speech recognition engine transcribing regional Odia dialects for rural public health clinic intake systems.',
    detailedDesc: 'Fine-tunes Whisper models on over 300 hours of curated Odia speech data with customized phonetic vocabulary, running inference on lightweight edge servers to transcribe patient symptoms with high word accuracy.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Ananya Dash',
    leadRegNo: '2341016089',
    coContributorsNames: ['Sourav Patra'],
    coContributorsRegNos: ['2441013190'],
    academicYears: '4th / 3rd Year',
    techStack: ['PyTorch', 'Whisper', 'FastAPI', 'ONNX Runtime', 'Streamlit'],
    liveUrl: 'https://vanisetu-asr.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/ananya-dash/vanisetu-odia-asr',
    demoVideoUrl: 'https://youtu.be/vanisetu-demo-prj08',
    pitchVideoUrl: 'https://youtu.be/vanisetu-pitch-prj08',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-09',
    name: 'ZeroTrust API Shield',
    pitch: 'eBPF-based microservice rate limiter and anomaly blocker',
    shortDesc: 'A kernel-level security daemon that intercepts HTTP/gRPC requests in the Linux kernel to block volumetric DDoS and token abuse.',
    detailedDesc: 'Runs custom eBPF bytecode inside Linux kernel network sockets to enforce token-bucket rate limits and inspect malicious payload signatures with sub-microsecond latency, protecting student container clusters.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Pranav Kulkarni',
    leadRegNo: '2341014055',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Go', 'C', 'eBPF (Cilium/ebpf)', 'Grafana', 'Prometheus'],
    liveUrl: 'https://zerotrust-ebpf.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/pranav-kulkarni/zerotrust-shield',
    demoVideoUrl: 'https://youtu.be/zerotrust-demo-prj09',
    pitchVideoUrl: 'https://youtu.be/zerotrust-pitch-prj09',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-10',
    name: 'MediScan AR',
    pitch: 'WebXR anatomy overlay for first-year medical students',
    shortDesc: 'An immersive browser-based augmented reality tool projecting 3D anatomical models and dissection slices on mobile screens.',
    detailedDesc: 'Uses Three.js and WebXR device APIs to render interactive, high-polygon 3D cardiovascular and nervous system models with interactive dissection planes, organ slicing, and bilingual voice guides.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Shreya Nanda',
    leadRegNo: '2541011041',
    coContributorsNames: ['Ayushman Jena', 'Divya Rout'],
    coContributorsRegNos: ['2541011099', '2541013012'],
    academicYears: '2nd Year',
    techStack: ['Three.js', 'WebXR', 'React', 'Blender', 'GLTF'],
    liveUrl: 'https://mediscan-ar.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/shreya-nanda/mediscan-ar',
    demoVideoUrl: 'https://youtu.be/mediscan-demo-prj10',
    pitchVideoUrl: 'https://youtu.be/mediscan-pitch-prj10',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-11',
    name: 'WealthPulse Quant',
    pitch: 'Backtesting engine for Indian equity momentum strategies with Zerodha webhook alerts',
    shortDesc: 'A high-speed quantitative backtester simulating Nifty 50 momentum strategies and dispatching algorithmic trade signals via webhooks.',
    detailedDesc: 'Processes minute-level OHLCV data using vectorized NumPy operations, calculates Sharpe ratios and drawdown risk metrics, and integrates with Zerodha Kite Connect APIs for automated order simulation.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Harshvardhan Sahu',
    leadRegNo: '2341016402',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Python', 'Pandas', 'NumPy', 'FastAPI', 'Zerodha Kite API'],
    liveUrl: 'https://wealthpulse.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/harsh-sahu/wealthpulse-quant',
    demoVideoUrl: 'https://youtu.be/wealthpulse-demo-prj11',
    pitchVideoUrl: 'https://youtu.be/wealthpulse-pitch-prj11',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-12',
    name: 'CodeReview Bot PR',
    pitch: 'GitHub App that flags OWASP vulnerabilities before merge',
    shortDesc: 'An automated pull request reviewer auditing pull request diffs for injection flaws, secret leakage, and insecure dependencies.',
    detailedDesc: 'Hooks into GitHub Webhooks to run static taint analysis and LLM security audits on incoming PR diffs, publishing inline code annotations with recommended mitigation snippets and CWE references.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Vikramaditya Sen',
    leadRegNo: '2341019033',
    coContributorsNames: ['Nikhil Parida'],
    coContributorsRegNos: ['2441016220'],
    academicYears: '4th / 3rd Year',
    techStack: ['TypeScript', 'Probot', 'GitHub Octokit', 'Claude API', 'Docker'],
    liveUrl: 'https://codereview-pr.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/vikram-sen/codereview-bot',
    demoVideoUrl: 'https://youtu.be/codereview-demo-prj12',
    pitchVideoUrl: 'https://youtu.be/codereview-pitch-prj12',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-13',
    name: 'AgroDrone Vision',
    pitch: 'Edge YOLO pipeline detecting rice blast disease from drone feeds',
    shortDesc: 'An airborne computer vision system performing automated crop health inspection and early leaf lesion detection from multispectral drone video.',
    detailedDesc: 'Deploys quantized YOLOv8 models on Raspberry Pi and Jetson edge devices mounted on agricultural drones, classifying rice blast, brown spot, and bacterial blight lesions with GPS coordinates for targeted spraying.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Swastik Lenka',
    leadRegNo: '2441018019',
    coContributorsNames: ['Pooja Samal', 'Kunal Barik'],
    coContributorsRegNos: ['2441018065', '2441013118'],
    academicYears: '3rd Year',
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'Jetson Nano', 'Flask'],
    liveUrl: 'https://agrodrone.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/swastik-lenka/agrodrone-vision',
    demoVideoUrl: 'https://youtu.be/agrodrone-demo-prj13',
    pitchVideoUrl: 'https://youtu.be/agrodrone-pitch-prj13',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-14',
    name: 'HireLens ATS',
    pitch: 'Semantic resume-to-JD matcher built for campus placement cells',
    shortDesc: 'An AI recruiting assistant comparing PDF candidate resumes against technical job descriptions using dense vector similarity and skill gap scoring.',
    detailedDesc: 'Extracts unstructured resume sections via pdfplumber, embeds competencies using Sentence-Transformers, and ranks student applicants for campus placement drives while highlighting missing technical prerequisites.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Nandini Kar',
    leadRegNo: '2341012145',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Python', 'Sentence-Transformers', 'FastAPI', 'PostgreSQL', 'Vue.js'],
    liveUrl: 'https://hirelens-ats.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/nandini-kar/hirelens-ats',
    demoVideoUrl: 'https://youtu.be/hirelens-demo-prj14',
    pitchVideoUrl: 'https://youtu.be/hirelens-pitch-prj14',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-15',
    name: 'LogStream Lite',
    pitch: 'Sub-millisecond distributed log viewer written in Go and React',
    shortDesc: 'A lightweight log ingestion and live tailing platform providing instant regex filtering across microservice containers.',
    detailedDesc: 'Built with a Go WebSocket pipeline and memory-mapped append-only ring buffers, LogStream Lite ingests 50k log entries per second with minimal memory footprint and zero external database dependencies.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Abhishek Mahanta',
    leadRegNo: '2441015089',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['Go', 'WebSockets', 'React', 'Tailwind CSS', 'Docker'],
    liveUrl: 'https://logstream.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/abhishek-m/logstream-lite',
    demoVideoUrl: 'https://youtu.be/logstream-demo-prj15',
    pitchVideoUrl: 'https://youtu.be/logstream-pitch-prj15',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-16',
    name: 'SmartPark ITER',
    pitch: 'Computer-vision gate occupancy tracker for campus two-wheeler zones',
    shortDesc: 'An automated CCTV parking slot detector calculating live bay vacancy rates and routing campus commuters to empty parking stalls.',
    detailedDesc: 'Utilizes OpenCV perspective warping and background subtraction on existing security camera feeds to detect parked two-wheelers in real-time, broadcasting vacancy counts to electronic gate displays and a web dashboard.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Rohan Patnaik',
    leadRegNo: '2341014102',
    coContributorsNames: ['Chinmayee Das'],
    coContributorsRegNos: ['2541012034'],
    academicYears: '4th / 2nd Year',
    techStack: ['Python', 'OpenCV', 'MQTT', 'Node.js', 'Leaflet.js'],
    liveUrl: 'https://smartpark-iter.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/rohan-patnaik/smartpark-iter',
    demoVideoUrl: 'https://youtu.be/smartpark-demo-prj16',
    pitchVideoUrl: 'https://youtu.be/smartpark-pitch-prj16',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-17',
    name: 'DocuSign ZK',
    pitch: 'Zero-knowledge academic transcript verifier for alumni background checks',
    shortDesc: 'A cryptographic credential verification platform allowing graduates to prove CGPA and degree authenticity without revealing grades or transcripts.',
    detailedDesc: 'Leverages Circom zero-knowledge snark circuits and Ethereum smart contracts to issue cryptographic proofs of graduation criteria, enabling employers to instantly verify university credentials with zero data leakage.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Aarav Mohanty',
    leadRegNo: '2341016214',
    coContributorsNames: ['Pranav Kulkarni', 'Ishani Roy'],
    coContributorsRegNos: ['2341014055', '2341016178'],
    academicYears: '4th Year',
    techStack: ['Circom', 'SnarkJS', 'Solidity', 'Ethers.js', 'Next.js'],
    liveUrl: 'https://docusign-zk.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-crypto/docusign-zk',
    demoVideoUrl: 'https://youtu.be/docusignzk-demo-prj17',
    pitchVideoUrl: 'https://youtu.be/docusignzk-pitch-prj17',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-18',
    name: 'MockMate AI',
    pitch: 'Real-time voice system-design interviewer with whiteboard feedback',
    shortDesc: 'An interactive mock interviewer conducting live audio technical interviews with dynamic architecture diagram evaluations.',
    detailedDesc: 'Combines Whisper real-time audio transcription with an LLM interviewer persona and an Excalidraw canvas evaluator to assess system design trade-offs, scalability thinking, and latency calculations.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Tanmay Das',
    leadRegNo: '2341012077',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['WebRTC', 'Python', 'OpenAI Realtime API', 'Excalidraw', 'Next.js'],
    liveUrl: 'https://mockmate-sys.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/tanmay-das/mockmate-ai',
    demoVideoUrl: 'https://youtu.be/mockmate-demo-prj18',
    pitchVideoUrl: 'https://youtu.be/mockmate-pitch-prj18',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-19',
    name: 'WattWise Hostel',
    pitch: 'Smart plug telemetry dashboard gamifying hostel electricity savings',
    shortDesc: 'An IoT energy tracking system displaying floor-by-floor hostel power usage with leaderboards rewarding conservation efforts.',
    detailedDesc: 'Polls ESP8266 power-monitoring sockets over MQTT, ingests kilowatt-hour telemetry into InfluxDB, and renders responsive charts showing phantom power waste and floor consumption rankings.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Meera Krishnan',
    leadRegNo: '2441018072',
    coContributorsNames: ['Swastik Lenka'],
    coContributorsRegNos: ['2441018019'],
    academicYears: '3rd Year',
    techStack: ['ESP8266', 'MQTT', 'InfluxDB', 'Node.js', 'Chart.js'],
    liveUrl: 'https://wattwise.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/meera-k/wattwise-hostel',
    demoVideoUrl: 'https://youtu.be/wattwise-demo-prj19',
    pitchVideoUrl: 'https://youtu.be/wattwise-pitch-prj19',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-20',
    name: 'KubeCost Cut',
    pitch: 'Kubernetes pod right-sizing recommender for student cloud credits',
    shortDesc: 'A cost-optimization controller analyzing pod CPU/memory utilization metrics to recommend minimal container resource allocations.',
    detailedDesc: 'Collects historical Prometheus container metrics, runs quartile sizing algorithms to detect over-provisioned limits, and exports automated Kubernetes mutating webhook patches to stretch student cloud credits.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Debashish Panda',
    leadRegNo: '2441015044',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['Go', 'Kubernetes Client-go', 'Prometheus', 'Helm', 'Svelte'],
    liveUrl: 'https://kubecost-cut.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/debashish-p/kubecost-cut',
    demoVideoUrl: 'https://youtu.be/kubecost-demo-prj20',
    pitchVideoUrl: 'https://youtu.be/kubecost-pitch-prj20',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-21',
    name: 'SignBridge ISL',
    pitch: 'Real-time Indian Sign Language to text translator via webcam',
    shortDesc: 'An accessible computer vision app translating Indian Sign Language hand gestures into fluent English and Odia subtitles.',
    detailedDesc: 'Tracks 21 3D hand landmarks using MediaPipe and feeds temporal landmark sequence embeddings into an LSTM classifier, translating ISL signs to natural speech audio in real time.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Sneha Mishra',
    leadRegNo: '2441013045',
    coContributorsNames: ['Shreya Nanda', 'Ankit Biswal'],
    coContributorsRegNos: ['2541011041', '2541011130'],
    academicYears: '3rd / 2nd Year',
    techStack: ['MediaPipe', 'TensorFlow.js', 'Web Speech API', 'React'],
    liveUrl: 'https://signbridge-isl.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/sneha-mishra/signbridge-isl',
    demoVideoUrl: 'https://youtu.be/signbridge-demo-prj21',
    pitchVideoUrl: 'https://youtu.be/signbridge-pitch-prj21',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-22',
    name: 'AlgoViz 3D',
    pitch: 'Interactive Three.js visualizer for graph and dynamic programming algorithms',
    shortDesc: 'A spatial 3D learning platform illustrating pathfinding, tree balancing, and matrix DP states with step-by-step memory inspections.',
    detailedDesc: 'Renders nodes, edges, and memoization tables in a dynamic 3D WebGL scene with interactive step execution, variable watch windows, and custom test-case generation to assist data structures students.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Ayushman Jena',
    leadRegNo: '2541011099',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '2nd Year',
    techStack: ['Three.js', 'JavaScript', 'HTML5 Canvas', 'CSS Grid'],
    liveUrl: 'https://algoviz3d.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/ayushman-jena/algoviz3d',
    demoVideoUrl: 'https://youtu.be/algoviz-demo-prj22',
    pitchVideoUrl: 'https://youtu.be/algoviz-pitch-prj22',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-23',
    name: 'SynthData Health',
    pitch: 'Differential-privacy tabular synthetic data generator for clinical trials',
    shortDesc: 'A privacy-preserving generator producing realistic synthetic patient records for healthcare research without breaching HIPAA or confidentiality.',
    detailedDesc: 'Uses Conditional GANs with Rényi differential privacy guarantees to learn statistical correlations from hospital electronic health records, exporting synthetic anonymized datasets for clinical trial research.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Siddharth Nayak',
    leadRegNo: '2441015198',
    coContributorsNames: ['Ritwik Mohapatra'],
    coContributorsRegNos: ['2441016112'],
    academicYears: '3rd Year',
    techStack: ['PyTorch', 'Opacus', 'CTGAN', 'FastAPI', 'Tailwind CSS'],
    liveUrl: 'https://synthdata-med.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-sys/synthdata-health',
    demoVideoUrl: 'https://youtu.be/synthdata-demo-prj23',
    pitchVideoUrl: 'https://youtu.be/synthdata-pitch-prj23',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-24',
    name: 'GitPulse Analytics',
    pitch: 'Engineering velocity tracker measuring PR cycle time and review bottlenecks',
    shortDesc: 'An engineering dashboard quantifying code review turnaround times, team churn, and pull request review bottlenecks.',
    detailedDesc: 'Connects to GitHub GraphQL APIs to calculate DORA metrics including lead time to changes, deployment frequency, and PR approval delays, generating weekly actionable velocity digests for engineering leads.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Kabita Behera',
    leadRegNo: '2341016301',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Next.js', 'GitHub GraphQL API', 'Prisma', 'PostgreSQL', 'Tremor'],
    liveUrl: 'https://gitpulse-dev.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/kabita-behera/gitpulse-dev',
    demoVideoUrl: 'https://youtu.be/gitpulse-demo-prj24',
    pitchVideoUrl: 'https://youtu.be/gitpulse-pitch-prj24',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-25',
    name: 'RailTrack Odisha',
    pitch: 'Live crowd-sourced local train delay predictor with offline SMS fallback',
    shortDesc: 'A community transit monitor predicting local passenger train arrival delays across the Khurda Road division with SMS alerts.',
    detailedDesc: 'Synthesizes passenger geolocation pings with Indian Railways historical timetables and weather conditions using XGBoost, providing commuters with delay estimates and an offline Twilio SMS enquiry fallback.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Sourav Patra',
    leadRegNo: '2441013190',
    coContributorsNames: ['Subham Swain', 'Manaswini Sahu'],
    coContributorsRegNos: ['2341012019', '2541013088'],
    academicYears: '3rd / 4th / 2nd Year',
    techStack: ['Python', 'XGBoost', 'Twilio API', 'Leaflet.js', 'React'],
    liveUrl: 'https://railtrack-od.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/sourav-patra/railtrack-odisha',
    demoVideoUrl: 'https://youtu.be/railtrack-demo-prj25',
    pitchVideoUrl: 'https://youtu.be/railtrack-pitch-prj25',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-26',
    name: 'PromptForge Eval',
    pitch: 'Regression testing harness for LLM prompts across latency and accuracy',
    shortDesc: 'A developer benchmarking harness running automated CI/CD regression tests on prompt templates across OpenAI, Anthropic, and open-source models.',
    detailedDesc: 'Implements semantic similarity scoring, token latency telemetry, and cost profiling per prompt permutation, alerting engineering teams to breaking prompt degradations prior to production deployment.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Priyanka Sahoo',
    leadRegNo: '2441015211',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['Python', 'Pydantic', 'FastAPI', 'OpenAI API', 'Next.js'],
    liveUrl: 'https://promptforge.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/priyanka-sahoo/promptforge-eval',
    demoVideoUrl: 'https://youtu.be/promptforge-demo-prj26',
    pitchVideoUrl: 'https://youtu.be/promptforge-pitch-prj26',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-27',
    name: 'LabReserve IoT',
    pitch: 'RFID-integrated hardware checkout and oscilloscope booking portal',
    shortDesc: 'An automated university hardware lab inventory management system tracking microcontroller checkouts via RFID cards and calendar slots.',
    detailedDesc: 'Integrates RC522 RFID readers with an ESP32 web gateway and relational booking database to track digital storage oscilloscopes, solder stations, and FPGA boards, logging equipment custody in real time.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Kunal Barik',
    leadRegNo: '2441013118',
    coContributorsNames: ['Pooja Samal'],
    coContributorsRegNos: ['2441018065'],
    academicYears: '3rd Year',
    techStack: ['ESP32', 'RFID RC522', 'Node.js', 'Express', 'PostgreSQL', 'HTML5'],
    liveUrl: 'https://labreserve.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/kunal-barik/labreserve-iot',
    demoVideoUrl: 'https://youtu.be/labreserve-demo-prj27',
    pitchVideoUrl: 'https://youtu.be/labreserve-pitch-prj27',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-28',
    name: 'PaySplit UPI',
    pitch: 'Group trip expense splitter with instant UPI deep-link settlement',
    shortDesc: 'A mobile-friendly web expense organizer calculating minimal debt settlement transactions and generating instant UPI QR and deep links.',
    detailedDesc: 'Formulates debt simplification as a directed graph flow minimization problem, enabling college trip organizers to settle multi-currency and shared expense balances via one-click UPI apps.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Divya Rout',
    leadRegNo: '2541013012',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '2nd Year',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'UPI Deep Links', 'Vite'],
    liveUrl: 'https://paysplit-upi.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/divya-rout/paysplit-upi',
    demoVideoUrl: 'https://youtu.be/paysplit-demo-prj28',
    pitchVideoUrl: 'https://youtu.be/paysplit-pitch-prj28',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-29',
    name: 'RAGBench Legal',
    pitch: 'Citation-grounded Indian Supreme Court judgment search engine',
    shortDesc: 'A domain-adapted legal research assistant providing verified semantic search over decades of Indian landmark judicial case law.',
    detailedDesc: 'Indexes over 50,000 Supreme Court rulings into vector and BM25 hybrid indices, generating answers strictly backed by cited paragraphs and statute sections to eliminate hallucinated legal precedents.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Ananya Dash',
    leadRegNo: '2341016089',
    coContributorsNames: ['Nandini Kar'],
    coContributorsRegNos: ['2341012145'],
    academicYears: '4th Year',
    techStack: ['Python', 'LlamaIndex', 'Milvus', 'FastAPI', 'React'],
    liveUrl: 'https://ragbench-law.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/ananya-dash/ragbench-legal',
    demoVideoUrl: 'https://youtu.be/ragbench-demo-prj29',
    pitchVideoUrl: 'https://youtu.be/ragbench-pitch-prj29',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-30',
    name: 'CacheFlow Redis',
    pitch: 'Visual Redis memory profiler and hot-key detector',
    shortDesc: 'A real-time telemetry dashboard visualizing key namespace memory consumption and alerting on distributed cache hot keys.',
    detailedDesc: 'Streams Redis INFO and MONITOR command buffers into an in-memory sliding window aggregator, plotting memory distribution treemaps and detecting hot-key skew that degrades cluster performance.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Abhishek Mahanta',
    leadRegNo: '2441015089',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['Go', 'Redis', 'D3.js', 'WebSockets', 'Docker'],
    liveUrl: 'https://cacheflow.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/abhishek-m/cacheflow-redis',
    demoVideoUrl: 'https://youtu.be/cacheflow-demo-prj30',
    pitchVideoUrl: 'https://youtu.be/cacheflow-pitch-prj30',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-31',
    name: 'NoteGraph Obsidian',
    pitch: 'Auto-linking lecture notes into interactive knowledge graphs using embeddings',
    shortDesc: 'An intelligent markdown notebook synthesizer connecting university lecture notes into dynamic 3D concept relationship graphs.',
    detailedDesc: 'Runs local sentence embeddings over Markdown study materials, detecting shared semantic concepts, unresolved questions, and bidirectional prerequisite links rendered in an interactive force-directed graph.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Ipsita Tripathy',
    leadRegNo: '2341011088',
    coContributorsNames: ['Ishani Roy'],
    coContributorsRegNos: ['2341016178'],
    academicYears: '4th Year',
    techStack: ['TypeScript', 'Electron', 'D3-Force', 'LangChain', 'SQLite'],
    liveUrl: 'https://notegraph-ai.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/ipsita-t/notegraph-obsidian',
    demoVideoUrl: 'https://youtu.be/notegraph-demo-prj31',
    pitchVideoUrl: 'https://youtu.be/notegraph-pitch-prj31',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-32',
    name: 'PacketSniff Web',
    pitch: 'Browser-based PCAP analyzer for computer networks lab students',
    shortDesc: 'A client-side Wireshark alternative parsing network packet captures directly in modern web browsers without server uploads.',
    detailedDesc: 'Uses WebAssembly-compiled Libtins and PcapPlusPlus to parse Ethernet, IP, TCP, and TLS packets entirely in client memory, generating protocol hierarchy charts and conversation timelines for lab coursework.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Rohan Patnaik',
    leadRegNo: '2341014102',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['C++', 'WebAssembly', 'React', 'Web Workers', 'Chart.js'],
    liveUrl: 'https://packetsniff.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/rohan-patnaik/packetsniff-web',
    demoVideoUrl: 'https://youtu.be/packetsniff-demo-prj32',
    pitchVideoUrl: 'https://youtu.be/packetsniff-pitch-prj32',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-33',
    name: 'CanteenRush Forecast',
    pitch: 'Peak-hour food demand predictor helping campus vendors cut waste by 30%',
    shortDesc: 'A predictive demand forecasting tool predicting meal plate requirements across student cafeterias based on academic timetables and weather.',
    detailedDesc: 'Evaluates academic timetables, exam calendars, and regional weather forecast features with gradient boosting trees to predict daily meal demand, reducing surplus cafeteria food waste by over 30%.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Aditya Rath',
    leadRegNo: '2341011022',
    coContributorsNames: ['Chinmayee Das', 'Ankit Biswal'],
    coContributorsRegNos: ['2541012034', '2541011130'],
    academicYears: '4th / 2nd Year',
    techStack: ['Python', 'LightGBM', 'FastAPI', 'React', 'PostgreSQL'],
    liveUrl: 'https://canteenrush.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/aditya-rath/canteenrush-forecast',
    demoVideoUrl: 'https://youtu.be/canteenrush-demo-prj33',
    pitchVideoUrl: 'https://youtu.be/canteenrush-pitch-prj33',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-34',
    name: 'ShaderLab Studio',
    pitch: 'Collaborative WebGL fragment shader playground with live export',
    shortDesc: 'A live-coding shader environment supporting multi-user canvas collaboration, audio-reactive buffers, and GLSL export.',
    detailedDesc: 'Provides interactive syntax highlighting, uniform parameter sliders, and WebRTC peer data synchronization so graphics students can simultaneously code and test GLSL fragment shaders in browser windows.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Nikhil Parida',
    leadRegNo: '2441016220',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['WebGL', 'GLSL', 'Monaco Editor', 'WebRTC', 'React'],
    liveUrl: 'https://shaderlab.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/nikhil-parida/shaderlab-studio',
    demoVideoUrl: 'https://youtu.be/shaderlab-demo-prj34',
    pitchVideoUrl: 'https://youtu.be/shaderlab-pitch-prj34',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-35',
    name: 'EdgeCache CDN',
    pitch: 'Geo-distributed static asset proxy built on Cloudflare Workers',
    shortDesc: 'A serverless edge content delivery network cache routing student assets to the nearest point-of-presence with Brotli compression.',
    detailedDesc: 'Deploys edge compute workers on Cloudflare Edge to handle caching policies, on-the-fly WebP image conversions, and stale-while-revalidate stale asset invalidation across global edge locations.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Vikramaditya Sen',
    leadRegNo: '2341019033',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['TypeScript', 'Cloudflare Workers', 'KV Storage', 'Web Crypto'],
    liveUrl: 'https://edgecache-cf.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/vikram-sen/edgecache-cdn',
    demoVideoUrl: 'https://youtu.be/edgecache-demo-prj35',
    pitchVideoUrl: 'https://youtu.be/edgecache-pitch-prj35',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-36',
    name: 'EVRoute NH16',
    pitch: 'Charging-station-aware route planner along the Bhubaneswar-Visakhapatnam highway',
    shortDesc: 'An electric vehicle navigation utility calculating optimal highway charging stops taking battery depletion and charger queue times into account.',
    detailedDesc: 'Models vehicle drag, incline profiles along the NH16 corridor, and live EV charging station availability to compute minimal-stop road trips with battery range confidence intervals.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Meera Krishnan',
    leadRegNo: '2441018072',
    coContributorsNames: ['Harshvardhan Sahu'],
    coContributorsRegNos: ['2341016402'],
    academicYears: '3rd / 4th Year',
    techStack: ['Python', 'OpenStreetMap', 'OSRM', 'Turf.js', 'React'],
    liveUrl: 'https://evroute-nh16.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/meera-k/evroute-nh16',
    demoVideoUrl: 'https://youtu.be/evroute-demo-prj36',
    pitchVideoUrl: 'https://youtu.be/evroute-pitch-prj36',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-37',
    name: 'CronMonitor',
    pitch: "Dead-man's-switch alerting SaaS for student side-project background jobs",
    shortDesc: 'A heartbeat monitoring service notifying developers via Telegram and email whenever periodic crons or scraper scripts miss scheduled runs.',
    detailedDesc: 'Exposes zero-dependency HTTP ping endpoints for cron tasks, tracking expected periodicity, alerting on timeouts via webhooks and Telegram bots, and recording execution run histories.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Ritwik Mohapatra',
    leadRegNo: '2441016112',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '3rd Year',
    techStack: ['Go', 'Redis', 'SQLite', 'Telegram Bot API', 'Tailwind CSS'],
    liveUrl: 'https://cronmonitor.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/ritwik-m/cronmonitor',
    demoVideoUrl: 'https://youtu.be/cronmonitor-demo-prj37',
    pitchVideoUrl: 'https://youtu.be/cronmonitor-pitch-prj37',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-38',
    name: 'VoiceForm Clinic',
    pitch: 'Multilingual voice-filled outpatient intake forms for rural health camps',
    shortDesc: 'An accessible tablet portal converting spoken clinical symptoms in Odia, Hindi, and English into structured medical EHR intake fields.',
    detailedDesc: 'Integrates multi-dialect speech models with medical entity extraction to populate standardized health questionnaires automatically, empowering frontline community health workers.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Priyanka Sahoo',
    leadRegNo: '2441015211',
    coContributorsNames: ['Manaswini Sahu', 'Shreya Nanda'],
    coContributorsRegNos: ['2541013088', '2541011041'],
    academicYears: '3rd / 2nd Year',
    techStack: ['Whisper', 'Python', 'FastAPI', 'React', 'SQLite', 'Web Speech API'],
    liveUrl: 'https://voiceform-med.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/priyanka-sahoo/voiceform-clinic',
    demoVideoUrl: 'https://youtu.be/voiceform-demo-prj38',
    pitchVideoUrl: 'https://youtu.be/voiceform-pitch-prj38',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-39',
    name: 'DiffViewer SQL',
    pitch: 'Schema migration diff generator for PostgreSQL and Oracle databases',
    shortDesc: 'A database developer utility parsing DDL dumps to generate safe forward and backward schema migration SQL scripts.',
    detailedDesc: 'Compares database catalogs, table constraints, foreign keys, and index configurations across staging and production environments, generating safe idempotent ALTER scripts and warning of potential data-destructive changes.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Subham Swain',
    leadRegNo: '2341012019',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Rust', 'SQLParser', 'React', 'Monaco Editor', 'WebAssembly'],
    liveUrl: 'https://diffviewer-sql.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/subham-swain/diffviewer-sql',
    demoVideoUrl: 'https://youtu.be/diffviewer-demo-prj39',
    pitchVideoUrl: 'https://youtu.be/diffviewer-pitch-prj39',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-40',
    name: 'BioAuth Keystroke',
    pitch: 'Continuous user authentication via typing cadence dynamics',
    shortDesc: 'A non-intrusive security system identifying authorized operators based on individual keystroke hold and flight time distributions.',
    detailedDesc: 'Captures millisecond-level keypress hold and inter-key latency features during normal typing sessions, training a one-class SVM to detect unauthorized workstation takeovers without biometric scanners.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Sneha Mishra',
    leadRegNo: '2441013045',
    coContributorsNames: ['Pranav Kulkarni'],
    coContributorsRegNos: ['2341014055'],
    academicYears: '3rd / 4th Year',
    techStack: ['Python', 'Scikit-learn', 'WebSockets', 'JavaScript', 'Flask'],
    liveUrl: 'https://bioauth-keys.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/sneha-mishra/bioauth-keystroke',
    demoVideoUrl: 'https://youtu.be/bioauth-demo-prj40',
    pitchVideoUrl: 'https://youtu.be/bioauth-pitch-prj40',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-41',
    name: 'StudyPod Focus',
    pitch: 'WebRTC virtual study rooms with Pomodoro sync and ambient soundscapes',
    shortDesc: 'A synchronized collaborative virtual library featuring low-latency study rooms, shared focus timers, and generative soundscapes.',
    detailedDesc: 'Facilitates student group study using mesh WebRTC audio-video channels, synchronized Pomodoro focus intervals, task accountability boards, and customizable binaural background soundscapes.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Chinmayee Das',
    leadRegNo: '2541012034',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '2nd Year',
    techStack: ['WebRTC', 'PeerJS', 'React', 'Tone.js', 'Tailwind CSS'],
    liveUrl: 'https://studypod-live.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/chinmayee-das/studypod-focus',
    demoVideoUrl: 'https://youtu.be/studypod-demo-prj41',
    pitchVideoUrl: 'https://youtu.be/studypod-pitch-prj41',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-42',
    name: 'FleetPulse Logistics',
    pitch: 'Cold-chain temperature anomaly tracker for vaccine transport trucks',
    shortDesc: 'An industrial IoT sensor network tracking refrigeration temperatures and container seal integrity across pharmaceutical shipping routes.',
    detailedDesc: 'Combines DS18B20 digital temperature sensors with GPS/GSM cellular units on vehicle fleet containers to transmit thermal readings to an anomaly engine, alerting dispatchers before vaccine spoilage occurs.',
    collaborationMode: 'Group',
    teamSize: 3,
    leadName: 'Siddharth Nayak',
    leadRegNo: '2441015198',
    coContributorsNames: ['Kunal Barik', 'Swastik Lenka'],
    coContributorsRegNos: ['2441013118', '2441018019'],
    academicYears: '3rd Year',
    techStack: ['C++', 'Arduino', 'GSM/GPS Shield', 'Node.js', 'Leaflet', 'TimescaleDB'],
    liveUrl: 'https://fleetpulse-iot.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/iter-sys/fleetpulse-logistics',
    demoVideoUrl: 'https://youtu.be/fleetpulse-demo-prj42',
    pitchVideoUrl: 'https://youtu.be/fleetpulse-pitch-prj42',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-43',
    name: 'PDF2LaTeX Pro',
    pitch: 'Vision-LLM converter turning handwritten math notes into compilable LaTeX',
    shortDesc: 'A specialized document digitization pipeline converting complex mathematical notation, matrices, and equations into clean LaTeX markup.',
    detailedDesc: 'Utilizes fine-tuned multimodal vision transformers to detect inline and block mathematical formulas from mobile camera photos, outputting tested LaTeX source code with Overleaf direct-export compatibility.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Aarav Mohanty',
    leadRegNo: '2341016214',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Python', 'Vision Transformers', 'FastAPI', 'Next.js', 'MathJax'],
    liveUrl: 'https://pdf2latex.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/aarav-mohanty/pdf2latex-pro',
    demoVideoUrl: 'https://youtu.be/pdf2latex-demo-prj43',
    pitchVideoUrl: 'https://youtu.be/pdf2latex-pitch-prj43',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-44',
    name: 'ClubLedger DAO',
    pitch: 'Transparent multi-sig treasury and event budget tracker for college clubs',
    shortDesc: 'A transparent student organization treasury ledger requiring multi-signature officer sign-offs for student society disbursements.',
    detailedDesc: 'Features role-gated budget allocations, receipt uploads with IPFS pinning, and multi-signature transaction confirmations to ensure zero financial misallocations in college technical societies and fests.',
    collaborationMode: 'Group',
    teamSize: 2,
    leadName: 'Ishani Roy',
    leadRegNo: '2341016178',
    coContributorsNames: ['Harshvardhan Sahu'],
    coContributorsRegNos: ['2341016402'],
    academicYears: '4th Year',
    techStack: ['Solidity', 'Hardhat', 'IPFS', 'Ethers.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://clubledger.github.io',
    hostingPlatform: 'GitHub Pages',
    githubUrl: 'https://github.com/iter-campus/clubledger-dao',
    demoVideoUrl: 'https://youtu.be/clubledger-demo-prj44',
    pitchVideoUrl: 'https://youtu.be/clubledger-pitch-prj44',
    linkedPaperId: null,
  },
  {
    id: 'PRJ-45',
    name: 'QueryBench Vector',
    pitch: 'Latency & recall benchmark suite comparing Qdrant, pgvector, and Milvus',
    shortDesc: 'An automated performance benchmarking tool measuring indexing throughput and recall-at-k across leading open-source vector databases.',
    detailedDesc: 'Executes standardized HNSW and IVF-PQ recall tests on 1M+ 1536-dimensional embeddings, generating comparative latency percentiles and memory overhead dashboards to assist AI teams in vector engine selection.',
    collaborationMode: 'Solo',
    teamSize: 1,
    leadName: 'Kabita Behera',
    leadRegNo: '2341016301',
    coContributorsNames: [],
    coContributorsRegNos: [],
    academicYears: '4th Year',
    techStack: ['Python', 'Docker', 'Qdrant', 'pgvector', 'Milvus', 'Plotly', 'Streamlit'],
    liveUrl: 'https://querybench-vec.vercel.app',
    hostingPlatform: 'Vercel',
    githubUrl: 'https://github.com/kabita-behera/querybench-vector',
    demoVideoUrl: 'https://youtu.be/querybench-demo-prj45',
    pitchVideoUrl: 'https://youtu.be/querybench-pitch-prj45',
    linkedPaperId: null,
  },
];

export const PROJECTS_DATA: ProjectRecord[] = rawProjects.map((p, idx) => ({
  ...p,
  coverImage: pickCoverImage(idx),
}));

export const RESEARCH_PAPERS_DATA: ResearchPaperRecord[] = [
  {
    id: 'RP-01',
    topic: 'Agentic RAG & Self-Correcting Multi-Agent Workflows in Enterprise FinTech',
    abstract: 'Autonomous multi-agent verification and self-correcting RAG architecture for detecting financial ledger anomalies and streamlining regulatory compliance.',
    domain: 'Agentic AI & FinTech',
    venue: 'IEEE Access (2026)',
    status: 'Published',
    authorMode: 'Dual',
    leadAuthorName: 'Aarav Mohanty',
    leadAuthorRegNo: '2341016214',
    leadAuthorYearBranch: '4th Year, CSE',
    coAuthorName: 'Ananya Dash',
    coAuthorRegNo: '2341016089',
    coAuthorYearBranch: '4th Year, CSE',
    preprintUrl: 'https://arxiv.org/abs/2604.01928',
    codeRepoUrl: 'https://github.com/iter-research/agentic-fin-rag',
    liveDemoUrl: 'https://agentic-rag-eval.vercel.app',
    techStack: ['Python', 'LangGraph', 'Qdrant', 'FastAPI'],
    coverImage: '/images/indian-campus-lab.jpg',
  },
  {
    id: 'RP-02',
    topic: 'Post-Quantum Lattice Cryptography for Edge IoT Medical Devices',
    abstract: 'Lightweight post-quantum lattice-based key encapsulation mechanisms engineered specifically for resource-constrained wearable ICU biometric devices.',
    domain: 'Post-Quantum Cybersecurity',
    venue: 'ACM CCS IoT Security Track',
    status: 'Under Peer Review',
    authorMode: 'Dual',
    leadAuthorName: 'Rohan Patnaik',
    leadAuthorRegNo: '2341014102',
    leadAuthorYearBranch: '4th Year, CSIT',
    coAuthorName: 'Sneha Mishra',
    coAuthorRegNo: '2441013045',
    coAuthorYearBranch: '3rd Year, ECE',
    preprintUrl: 'https://eprint.iacr.org/2026/412',
    codeRepoUrl: 'https://github.com/iter-sec/pqc-edge-iot',
    liveDemoUrl: 'https://pqc-benchmark.github.io',
    techStack: ['C++', 'Rust', 'ARM Cortex-M', 'Zero-Knowledge Proofs'],
    coverImage: '/images/indian-student-tech.jpg',
  },
  {
    id: 'RP-03',
    topic: 'Low-Latency Federated Learning on Heterogeneous Edge GPUs',
    abstract: 'Adaptive gradient compression and straggler-resilient consensus protocols enabling low-latency distributed deep learning on mobile edge clusters.',
    domain: 'Distributed Systems & Edge AI',
    venue: 'NeurIPS Edge AI Workshop 2026',
    status: 'Accepted',
    authorMode: 'Dual',
    leadAuthorName: 'Siddharth Nayak',
    leadAuthorRegNo: '2441015198',
    leadAuthorYearBranch: '3rd Year, CSE',
    coAuthorName: 'Priyanka Sahoo',
    coAuthorRegNo: '2441015211',
    coAuthorYearBranch: '3rd Year, CSE',
    preprintUrl: 'https://arxiv.org/abs/2608.07741',
    codeRepoUrl: 'https://github.com/iter-sys/fed-edge-compress',
    liveDemoUrl: 'https://fed-edge-sim.vercel.app',
    techStack: ['PyTorch', 'Flower', 'CUDA', 'gRPC'],
    coverImage: '/images/indian-student-team.jpg',
  },
  {
    id: 'RP-04',
    topic: 'Neuro-Symbolic Verification for Autonomous Code Generation',
    abstract: 'Coupling neural generative code models with automated SMT theorem proving to mathematically certify program correctness and memory safety.',
    domain: 'AI Safety & Formal Methods',
    venue: 'ICSE Student Research Competition',
    status: 'Published',
    authorMode: 'Solo',
    leadAuthorName: 'Vikramaditya Sen',
    leadAuthorRegNo: '2341019033',
    leadAuthorYearBranch: '4th Year, CSE',
    coAuthorName: null,
    coAuthorRegNo: null,
    coAuthorYearBranch: null,
    preprintUrl: 'https://arxiv.org/abs/2605.11204',
    codeRepoUrl: 'https://github.com/vikram-sen/neuro-rust-verify',
    liveDemoUrl: 'https://neuro-verify.vercel.app',
    techStack: ['Rust', 'Z3 Solver', 'Tree-sitter', 'TypeScript'],
    coverImage: '/images/indian-campus-lab.jpg',
  },
  {
    id: 'RP-05',
    topic: 'Spatio-Temporal Graph Neural Networks for Urban Microgrid Load Forecasting',
    abstract: 'Dynamic spatial-temporal graph neural networks for multi-scale renewable energy load forecasting and microgrid battery dispatch optimization.',
    domain: 'CleanTech & Graph AI',
    venue: 'IEEE SmartGridComm 2026',
    status: 'Accepted',
    authorMode: 'Solo',
    leadAuthorName: 'Meera Krishnan',
    leadAuthorRegNo: '2441018072',
    leadAuthorYearBranch: '3rd Year, EEE',
    coAuthorName: null,
    coAuthorRegNo: null,
    coAuthorYearBranch: null,
    preprintUrl: 'https://arxiv.org/abs/2609.03381',
    codeRepoUrl: 'https://github.com/meera-k/st-gnn-microgrid',
    liveDemoUrl: 'https://microgrid-gnn.vercel.app',
    techStack: ['PyTorch Geometric', 'TimescaleDB', 'Python', 'React'],
    coverImage: '/images/indian-student-tech.jpg',
  },
];

export const STUDENTS_DATA: StudentRecord[] = [
  { id: 'STU-01', fullName: 'Aarav Mohanty', regNo: '2341016214', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: true, researchPaperIds: ['RP-01'], projectIds: ['PRJ-01', 'PRJ-17', 'PRJ-43'], totalProjectsCount: 3, email: 'aarav.mohanty@soa.ac.in', bio: 'Final-year CSE researcher and developer specializing in agentic AI workflows, zero-knowledge proofs, and document vision systems.', techStack: ['Python', 'LangGraph', 'Qdrant', 'FastAPI', 'Next.js', 'Circom', 'SnarkJS', 'Solidity', 'Ethers.js', 'Vision Transformers', 'MathJax'] },
  { id: 'STU-02', fullName: 'Ananya Dash', regNo: '2341016089', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: true, researchPaperIds: ['RP-01'], projectIds: ['PRJ-01', 'PRJ-08', 'PRJ-29'], totalProjectsCount: 3, email: 'ananya.dash@soa.ac.in', bio: 'Final-year CSE researcher engineering speech AI, legal RAG systems, and autonomous multi-agent financial auditing architectures.', techStack: ['Python', 'PyTorch', 'Whisper', 'LangGraph', 'LlamaIndex', 'Qdrant', 'Milvus', 'FastAPI', 'ONNX Runtime', 'Next.js', 'React', 'Streamlit'] },
  { id: 'STU-03', fullName: 'Rohan Patnaik', regNo: '2341014102', academicYear: '4th Year', branch: 'CSIT', isResearchAuthor: true, researchPaperIds: ['RP-02'], projectIds: ['PRJ-02', 'PRJ-16', 'PRJ-32'], totalProjectsCount: 3, email: 'rohan.patnaik@soa.ac.in', bio: 'CSIT senior specializing in post-quantum embedded cryptography, web-based packet analysis, and edge computer vision.', techStack: ['C++', 'Rust', 'ARM Cortex-M', 'FreeRTOS', 'WebAssembly', 'Python', 'OpenCV', 'MQTT', 'Node.js', 'React', 'WebSockets'] },
  { id: 'STU-04', fullName: 'Sneha Mishra', regNo: '2441013045', academicYear: '3rd Year', branch: 'ECE', isResearchAuthor: true, researchPaperIds: ['RP-02'], projectIds: ['PRJ-02', 'PRJ-21', 'PRJ-40'], totalProjectsCount: 3, email: 'sneha.mishra@soa.ac.in', bio: '3rd-year ECE researcher bridging embedded systems security, real-time computer vision accessibility, and keystroke biometric auth.', techStack: ['C++', 'Rust', 'ARM Cortex-M', 'FreeRTOS', 'Python', 'Scikit-learn', 'MediaPipe', 'TensorFlow.js', 'React', 'WebSockets', 'Flask'] },
  { id: 'STU-05', fullName: 'Siddharth Nayak', regNo: '2441015198', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: true, researchPaperIds: ['RP-03'], projectIds: ['PRJ-03', 'PRJ-23', 'PRJ-42'], totalProjectsCount: 3, email: 'siddharth.nayak@soa.ac.in', bio: '3rd-year CSE researcher developing federated GPU compute meshes, differential-privacy GANs, and cellular IoT cold-chain trackers.', techStack: ['PyTorch', 'CUDA', 'Flower', 'gRPC', 'CTGAN', 'Opacus', 'C++', 'Arduino', 'TimescaleDB', 'Node.js', 'React', 'FastAPI'] },
  { id: 'STU-06', fullName: 'Priyanka Sahoo', regNo: '2441015211', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: true, researchPaperIds: ['RP-03'], projectIds: ['PRJ-03', 'PRJ-26', 'PRJ-38'], totalProjectsCount: 3, email: 'priyanka.sahoo@soa.ac.in', bio: '3rd-year CSE researcher working on distributed federated learning, LLM prompt evaluation harnesses, and speech-enabled clinical EHR tools.', techStack: ['Python', 'PyTorch', 'Flower', 'CUDA', 'Whisper', 'OpenAI API', 'FastAPI', 'Pydantic', 'React', 'Next.js', 'SQLite', 'gRPC'] },
  { id: 'STU-07', fullName: 'Vikramaditya Sen', regNo: '2341019033', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: true, researchPaperIds: ['RP-04'], projectIds: ['PRJ-04', 'PRJ-12', 'PRJ-35'], totalProjectsCount: 3, email: 'vikramaditya.sen@soa.ac.in', bio: 'Final-year CSE researcher focusing on formal methods, SMT theorem proving for Rust safety, code review bots, and edge CDN systems.', techStack: ['Rust', 'Z3 SMT Solver', 'Tree-sitter', 'WebAssembly', 'TypeScript', 'Cloudflare Workers', 'Docker', 'Probot', 'Claude API', 'React'] },
  { id: 'STU-08', fullName: 'Meera Krishnan', regNo: '2441018072', academicYear: '3rd Year', branch: 'EEE', isResearchAuthor: true, researchPaperIds: ['RP-05'], projectIds: ['PRJ-05', 'PRJ-19', 'PRJ-36'], totalProjectsCount: 3, email: 'meera.krishnan@soa.ac.in', bio: '3rd-year EEE researcher and developer building spatio-temporal graph neural networks for microgrids, IoT energy monitors, and EV routing.', techStack: ['Python', 'PyTorch Geometric', 'TimescaleDB', 'InfluxDB', 'ESP8266', 'MQTT', 'OSRM', 'Fastify', 'Next.js', 'Node.js', 'React'] },
  { id: 'STU-09', fullName: 'Kabita Behera', regNo: '2341016301', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-01', 'PRJ-24', 'PRJ-45'], totalProjectsCount: 3, email: 'kabita.behera@soa.ac.in', bio: 'Final-year CSE engineer specializing in vector database benchmarking, developer engineering metrics, and full-stack enterprise analytics.', techStack: ['Python', 'FastAPI', 'Next.js', 'Prisma', 'PostgreSQL', 'Qdrant', 'pgvector', 'Milvus', 'Docker', 'GraphQL', 'Tremor', 'Streamlit'] },
  { id: 'STU-10', fullName: 'Debashish Panda', regNo: '2441015044', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-03', 'PRJ-20'], totalProjectsCount: 2, email: 'debashish.panda@soa.ac.in', bio: '3rd-year CSE cloud systems developer building Kubernetes resource right-sizing controllers and federated GPU cluster pipelines.', techStack: ['Go', 'Kubernetes', 'Prometheus', 'Helm', 'Svelte', 'PyTorch', 'Flower', 'CUDA', 'gRPC', 'React'] },
  { id: 'STU-11', fullName: 'Aditya Rath', regNo: '2341011022', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-06', 'PRJ-33'], totalProjectsCount: 2, email: 'aditya.rath@soa.ac.in', bio: 'Final-year CSE full-stack and mobile engineer creating campus-scale mobile super-apps and predictive machine learning demand models.', techStack: ['React Native', 'React', 'Node.js', 'Python', 'LightGBM', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'] },
  { id: 'STU-12', fullName: 'Ipsita Tripathy', regNo: '2341011088', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-06', 'PRJ-31'], totalProjectsCount: 2, email: 'ipsita.tripathy@soa.ac.in', bio: '4th-year CSE developer building cross-platform desktop knowledge graph synthesizers and university-wide mobile applications.', techStack: ['TypeScript', 'React Native', 'Node.js', 'Electron', 'D3-Force', 'LangChain', 'PostgreSQL', 'Redis', 'SQLite', 'Docker'] },
  { id: 'STU-13', fullName: 'Subham Swain', regNo: '2341012019', academicYear: '4th Year', branch: 'CSIT', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-06', 'PRJ-25', 'PRJ-39'], totalProjectsCount: 3, email: 'subham.swain@soa.ac.in', bio: 'Final-year CSIT developer building database DDL diff engines in Rust, crowd-sourced transit predictors, and scalable backend platforms.', techStack: ['Rust', 'WebAssembly', 'Python', 'XGBoost', 'Node.js', 'React', 'React Native', 'PostgreSQL', 'Redis', 'Docker', 'Leaflet.js'] },
  { id: 'STU-14', fullName: 'Tanmay Das', regNo: '2341012077', academicYear: '4th Year', branch: 'CSIT', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-06', 'PRJ-18'], totalProjectsCount: 2, email: 'tanmay.das@soa.ac.in', bio: '4th-year CSIT engineer crafting real-time WebRTC AI voice interviewers and high-traffic campus mobile systems.', techStack: ['WebRTC', 'Python', 'OpenAI Realtime API', 'Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Excalidraw'] },
  { id: 'STU-15', fullName: 'Ritwik Mohapatra', regNo: '2441016112', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-07', 'PRJ-23', 'PRJ-37'], totalProjectsCount: 3, email: 'ritwik.mohapatra@soa.ac.in', bio: '3rd-year CSE software engineer building SQL query debuggers, Go-based heartbeat monitoring tools, and privacy-preserving data pipelines.', techStack: ['Go', 'TypeScript', 'Python', 'PyTorch', 'CTGAN', 'Redis', 'SQLite', 'Oracle SQL', 'OpenAI API', 'FastAPI', 'Monaco Editor', 'Tailwind CSS'] },
  { id: 'STU-16', fullName: 'Sourav Patra', regNo: '2441013190', academicYear: '3rd Year', branch: 'ECE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-08', 'PRJ-25'], totalProjectsCount: 2, email: 'sourav.patra@soa.ac.in', bio: '3rd-year ECE engineer developing edge speech recognition for regional dialects and ML-powered public transit delay forecasting.', techStack: ['Python', 'PyTorch', 'Whisper', 'XGBoost', 'FastAPI', 'ONNX Runtime', 'Twilio API', 'React', 'Streamlit', 'Leaflet.js'] },
  { id: 'STU-17', fullName: 'Pranav Kulkarni', regNo: '2341014055', academicYear: '4th Year', branch: 'CSIT', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-09', 'PRJ-17', 'PRJ-40'], totalProjectsCount: 3, email: 'pranav.kulkarni@soa.ac.in', bio: 'Final-year CSIT systems engineer building Linux eBPF kernel network filters, zero-knowledge verification circuits, and keystroke biometrics.', techStack: ['Go', 'C', 'eBPF', 'Circom', 'SnarkJS', 'Solidity', 'Python', 'Scikit-learn', 'Prometheus', 'Grafana', 'Next.js', 'WebSockets'] },
  { id: 'STU-18', fullName: 'Shreya Nanda', regNo: '2541011041', academicYear: '2nd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-10', 'PRJ-21', 'PRJ-38'], totalProjectsCount: 3, email: 'shreya.nanda@soa.ac.in', bio: '2nd-year CSE developer creating immersive WebXR anatomical visualizers, sign language translators, and multilingual healthcare intake apps.', techStack: ['Three.js', 'WebXR', 'MediaPipe', 'TensorFlow.js', 'Whisper', 'Python', 'FastAPI', 'React', 'SQLite', 'Blender'] },
  { id: 'STU-19', fullName: 'Ayushman Jena', regNo: '2541011099', academicYear: '2nd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-10', 'PRJ-22'], totalProjectsCount: 2, email: 'ayushman.jena@soa.ac.in', bio: '2nd-year CSE developer specializing in 3D WebGL computer graphics, interactive algorithm visualizers, and browser augmented reality.', techStack: ['Three.js', 'WebGL', 'WebXR', 'JavaScript', 'React', 'HTML5 Canvas', 'Blender', 'GLTF'] },
  { id: 'STU-20', fullName: 'Divya Rout', regNo: '2541013012', academicYear: '2nd Year', branch: 'ECE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-10', 'PRJ-28'], totalProjectsCount: 2, email: 'divya.rout@soa.ac.in', bio: '2nd-year ECE front-end developer building graph-based UPI debt settlement utilities and interactive WebXR educational tools.', techStack: ['TypeScript', 'React', 'Vite', 'Three.js', 'WebXR', 'Tailwind CSS', 'UPI Deep Links'] },
  { id: 'STU-21', fullName: 'Harshvardhan Sahu', regNo: '2341016402', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-11', 'PRJ-36', 'PRJ-44'], totalProjectsCount: 3, email: 'harshvardhan.sahu@soa.ac.in', bio: '4th-year CSE developer focusing on algorithmic equity backtesting engines, DAO multi-sig treasuries, and geospatial EV route optimization.', techStack: ['Python', 'Pandas', 'NumPy', 'FastAPI', 'Solidity', 'Hardhat', 'IPFS', 'Ethers.js', 'React', 'Zerodha Kite API', 'OSRM'] },
  { id: 'STU-22', fullName: 'Nikhil Parida', regNo: '2441016220', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-12', 'PRJ-34'], totalProjectsCount: 2, email: 'nikhil.parida@soa.ac.in', bio: '3rd-year CSE engineer combining interactive WebGL shader programming with automated GitHub PR vulnerability audit bots.', techStack: ['TypeScript', 'WebGL', 'GLSL', 'WebRTC', 'Monaco Editor', 'React', 'Docker', 'Probot', 'Claude API'] },
  { id: 'STU-23', fullName: 'Swastik Lenka', regNo: '2441018019', academicYear: '3rd Year', branch: 'EEE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-13', 'PRJ-19', 'PRJ-42'], totalProjectsCount: 3, email: 'swastik.lenka@soa.ac.in', bio: '3rd-year EEE IoT engineer designing edge AI drone crop diagnostics, smart power telemetry, and cellular cold-chain tracking systems.', techStack: ['Python', 'C++', 'Arduino', 'ESP8266', 'Jetson Nano', 'YOLOv8', 'OpenCV', 'MQTT', 'TimescaleDB', 'InfluxDB', 'Node.js'] },
  { id: 'STU-24', fullName: 'Pooja Samal', regNo: '2441018065', academicYear: '3rd Year', branch: 'EEE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-13', 'PRJ-27'], totalProjectsCount: 2, email: 'pooja.samal@soa.ac.in', bio: '3rd-year EEE hardware developer developing RFID-integrated laboratory asset trackers and edge computer vision drone inspection tools.', techStack: ['Python', 'YOLOv8', 'OpenCV', 'ESP32', 'RFID RC522', 'Jetson Nano', 'Node.js', 'Express', 'PostgreSQL', 'Flask'] },
  { id: 'STU-25', fullName: 'Kunal Barik', regNo: '2441013118', academicYear: '3rd Year', branch: 'ECE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-13', 'PRJ-27', 'PRJ-42'], totalProjectsCount: 3, email: 'kunal.barik@soa.ac.in', bio: '3rd-year ECE embedded developer building edge vision drone pipelines, RFID laboratory checkouts, and telemetry logistics sensors.', techStack: ['C++', 'Python', 'Arduino', 'ESP32', 'Jetson Nano', 'RFID', 'YOLOv8', 'OpenCV', 'GSM/GPS', 'TimescaleDB', 'Node.js'] },
  { id: 'STU-26', fullName: 'Nandini Kar', regNo: '2341012145', academicYear: '4th Year', branch: 'CSIT', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-14', 'PRJ-29'], totalProjectsCount: 2, email: 'nandini.kar@soa.ac.in', bio: 'Final-year CSIT developer building semantic ATS resume matchers and citation-grounded Indian Supreme Court legal search engines.', techStack: ['Python', 'Sentence-Transformers', 'LlamaIndex', 'Milvus', 'PostgreSQL', 'FastAPI', 'Vue.js', 'React'] },
  { id: 'STU-27', fullName: 'Abhishek Mahanta', regNo: '2441015089', academicYear: '3rd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-15', 'PRJ-30'], totalProjectsCount: 2, email: 'abhishek.mahanta@soa.ac.in', bio: '3rd-year CSE systems programmer engineering low-latency distributed log streamers and real-time Redis cache profilers in Go.', techStack: ['Go', 'Redis', 'WebSockets', 'Docker', 'D3.js', 'React', 'Tailwind CSS'] },
  { id: 'STU-28', fullName: 'Chinmayee Das', regNo: '2541012034', academicYear: '2nd Year', branch: 'CSIT', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-16', 'PRJ-33', 'PRJ-41'], totalProjectsCount: 3, email: 'chinmayee.das@soa.ac.in', bio: '2nd-year CSIT developer building synchronized WebRTC study rooms, gate occupancy detectors, and demand forecasting systems.', techStack: ['Python', 'OpenCV', 'LightGBM', 'WebRTC', 'PeerJS', 'FastAPI', 'React', 'Node.js', 'PostgreSQL', 'Tone.js'] },
  { id: 'STU-29', fullName: 'Ishani Roy', regNo: '2341016178', academicYear: '4th Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-17', 'PRJ-31', 'PRJ-44'], totalProjectsCount: 3, email: 'ishani.roy@soa.ac.in', bio: 'Final-year CSE blockchain engineer building zero-knowledge academic credential verifiers, DAO multi-sig treasuries, and knowledge graphs.', techStack: ['Solidity', 'Circom', 'SnarkJS', 'Hardhat', 'Ethers.js', 'IPFS', 'TypeScript', 'Electron', 'LangChain', 'Next.js', 'React'] },
  { id: 'STU-30', fullName: 'Ankit Biswal', regNo: '2541011130', academicYear: '2nd Year', branch: 'CSE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-21', 'PRJ-33'], totalProjectsCount: 2, email: 'ankit.biswal@soa.ac.in', bio: '2nd-year CSE developer creating gesture-based sign language translation interfaces and tabular machine learning demand forecasters.', techStack: ['Python', 'LightGBM', 'MediaPipe', 'TensorFlow.js', 'FastAPI', 'React', 'PostgreSQL', 'Web Speech API'] },
  { id: 'STU-31', fullName: 'Manaswini Sahu', regNo: '2541013088', academicYear: '2nd Year', branch: 'ECE', isResearchAuthor: false, researchPaperIds: [], projectIds: ['PRJ-25', 'PRJ-38'], totalProjectsCount: 2, email: 'manaswini.sahu@soa.ac.in', bio: '2nd-year ECE engineer developing multilingual speech-to-text EHR clinic tools and crowd-sourced train delay prediction apps.', techStack: ['Python', 'Whisper', 'XGBoost', 'FastAPI', 'React', 'SQLite', 'Twilio API', 'Leaflet.js', 'Web Speech API'] },
];

export const ALUMNI_DATA: AlumniRecord[] = [
  { id: 'ALUM-01', fullName: 'Debadatta Rath', batchYear: 2016, company: 'HyperScale Labs', designation: 'Co-Founder & CTO', personaCategory: 'Startup Founder', mentorshipScope: 'Capstone Projects & Startup Incubation', linkedStudentIds: ['STU-01', 'STU-10'], linkedProjectIds: ['PRJ-01', 'PRJ-20'], linkedPaperIds: ['RP-01'], canPostJobs: true, activeJobOpeningsCount: 3, techStackExpertise: ['Python', 'Rust', 'Go', 'Kubernetes', 'Qdrant', 'Distributed Systems'] },
  { id: 'ALUM-02', fullName: 'Priyadarshini Tripathy', batchYear: 2014, company: 'Microsoft India', designation: 'Partner Director of Engineering', personaCategory: 'Executive Leadership', mentorshipScope: 'Research Papers & System Architecture', linkedStudentIds: ['STU-07', 'STU-15'], linkedProjectIds: ['PRJ-04', 'PRJ-12'], linkedPaperIds: ['RP-04'], canPostJobs: true, activeJobOpeningsCount: 4, techStackExpertise: ['C++', 'Rust', 'Z3 SMT Solver', 'Azure Cloud', 'Distributed Systems', 'Tree-sitter'] },
  { id: 'ALUM-03', fullName: 'Rajesh Kumar Mohanty', batchYear: 2015, company: 'Razorpay', designation: 'Head of Talent Acquisition & HR', personaCategory: 'HR / Talent Acquisition', mentorshipScope: 'Mock Interviews, Career Coaching & Hiring Drives', linkedStudentIds: ['STU-11', 'STU-13'], linkedProjectIds: ['PRJ-06', 'PRJ-25'], linkedPaperIds: [], canPostJobs: true, activeJobOpeningsCount: 6, techStackExpertise: ['Talent Ops', 'Technical Sourcing', 'Engineering Hiring', 'Leadership Dev'] },
  { id: 'ALUM-04', fullName: 'Soumya Ranjan Panigrahi', batchYear: 2017, company: 'Google', designation: 'Staff Software Engineer', personaCategory: 'Technical Mentor / Staff Engineer', mentorshipScope: 'Research Papers & Capstone Projects', linkedStudentIds: ['STU-03', 'STU-04'], linkedProjectIds: ['PRJ-02', 'PRJ-16'], linkedPaperIds: ['RP-02'], canPostJobs: false, activeJobOpeningsCount: 0, techStackExpertise: ['C++', 'Rust', 'ARM Cortex-M', 'FreeRTOS', 'Cryptography', 'WebAssembly'] },
  { id: 'ALUM-05', fullName: 'Anindita Pattnaik', batchYear: 2016, company: 'NeuroLink AI', designation: 'Founder & Chief AI Officer', personaCategory: 'Startup Founder', mentorshipScope: 'Deep Learning Research & Product Mentorship', linkedStudentIds: ['STU-02', 'STU-06'], linkedProjectIds: ['PRJ-08', 'PRJ-26'], linkedPaperIds: ['RP-01', 'RP-03'], canPostJobs: true, activeJobOpeningsCount: 2, techStackExpertise: ['PyTorch', 'Whisper', 'LLMs', 'LangGraph', 'Vector DBs', 'FastAPI', 'CUDA'] },
  { id: 'ALUM-06', fullName: 'Siddharth Shekhar Das', batchYear: 2013, company: 'Amazon Web Services (AWS)', designation: 'VP of Cloud Infrastructure & Management', personaCategory: 'Executive Leadership', mentorshipScope: 'Cloud Architecture & High-Scale Systems', linkedStudentIds: ['STU-10', 'STU-27'], linkedProjectIds: ['PRJ-03', 'PRJ-15'], linkedPaperIds: ['RP-03'], canPostJobs: true, activeJobOpeningsCount: 5, techStackExpertise: ['AWS', 'Kubernetes', 'Go', 'Distributed Storage', 'Redis', 'Linux eBPF'] },
  { id: 'ALUM-07', fullName: 'Smriti Rekha Samal', batchYear: 2018, company: 'Flipkart', designation: 'Senior Technical Recruiter & HR Lead', personaCategory: 'HR / Talent Acquisition', mentorshipScope: 'Resume Structuring, Portfolio Review & Off-Campus Hiring', linkedStudentIds: ['STU-09', 'STU-14'], linkedProjectIds: ['PRJ-18', 'PRJ-24'], linkedPaperIds: [], canPostJobs: true, activeJobOpeningsCount: 4, techStackExpertise: ['Tech Recruiting', 'HR Analytics', 'Talent Strategy', 'ATS Systems'] },
  { id: 'ALUM-08', fullName: 'Bikash Chandra Sahoo', batchYear: 2019, company: 'Intel Labs', designation: 'Senior Embedded Security Researcher', personaCategory: 'Technical Mentor / Staff Engineer', mentorshipScope: 'Embedded Hardware & Cryptographic Research', linkedStudentIds: ['STU-04', 'STU-17'], linkedProjectIds: ['PRJ-09', 'PRJ-40'], linkedPaperIds: ['RP-02'], canPostJobs: false, activeJobOpeningsCount: 0, techStackExpertise: ['C', 'C++', 'ARM Cortex-M', 'FreeRTOS', 'eBPF', 'Keystroke Biometrics', 'Rust'] },
  { id: 'ALUM-09', fullName: 'Tapas Ranjan Nayak', batchYear: 2017, company: 'GreenVolt Mobility', designation: 'Co-Founder & CEO', personaCategory: 'Startup Founder', mentorshipScope: 'CleanTech IoT Hardware & Smart Mobility Projects', linkedStudentIds: ['STU-08', 'STU-23'], linkedProjectIds: ['PRJ-05', 'PRJ-19'], linkedPaperIds: ['RP-05'], canPostJobs: true, activeJobOpeningsCount: 2, techStackExpertise: ['Python', 'PyTorch Geometric', 'TimescaleDB', 'InfluxDB', 'ESP8266', 'MQTT', 'OSRM'] },
  { id: 'ALUM-10', fullName: 'Subhasmita Rout', batchYear: 2014, company: 'Cisco Systems', designation: 'Senior Director, Enterprise Networking', personaCategory: 'Executive Leadership', mentorshipScope: 'Kernel Networking, SRE Practices & Leadership', linkedStudentIds: ['STU-17', 'STU-28'], linkedProjectIds: ['PRJ-09', 'PRJ-30'], linkedPaperIds: [], canPostJobs: true, activeJobOpeningsCount: 3, techStackExpertise: ['Go', 'C', 'eBPF', 'Linux Kernel', 'TCP/IP', 'Prometheus', 'Grafana'] },
  { id: 'ALUM-11', fullName: 'Manoj Kumar Behera', batchYear: 2019, company: 'PhonePe', designation: 'Staff Backend Engineer', personaCategory: 'Technical Mentor / Staff Engineer', mentorshipScope: 'High-Throughput Databases & Distributed Systems', linkedStudentIds: ['STU-13', 'STU-21'], linkedProjectIds: ['PRJ-11', 'PRJ-39'], linkedPaperIds: [], canPostJobs: false, activeJobOpeningsCount: 0, techStackExpertise: ['Rust', 'PostgreSQL', 'Redis', 'Kafka', 'Go', 'Distributed Consensus', 'WebAssembly'] },
  { id: 'ALUM-12', fullName: 'Rina Pradhan', batchYear: 2017, company: 'Zomato', designation: 'Lead HR Business Partner - Engineering', personaCategory: 'HR / Talent Acquisition', mentorshipScope: 'Behavioral Interviews, Offer Negotiation & Early Talent', linkedStudentIds: ['STU-12', 'STU-30'], linkedProjectIds: ['PRJ-06', 'PRJ-31'], linkedPaperIds: [], canPostJobs: true, activeJobOpeningsCount: 3, techStackExpertise: ['Campus Outreach', 'People Analytics', 'Engineering HRBP', 'Talent Assessments'] },
  { id: 'ALUM-13', fullName: 'Alok Mohapatra', batchYear: 2020, company: 'Polygon Labs', designation: 'Senior Protocol Engineer', personaCategory: 'Technical Mentor / Staff Engineer', mentorshipScope: 'Zero-Knowledge Proofs, Smart Contracts & Web3 Projects', linkedStudentIds: ['STU-01', 'STU-29'], linkedProjectIds: ['PRJ-17', 'PRJ-44'], linkedPaperIds: ['RP-01'], canPostJobs: false, activeJobOpeningsCount: 0, techStackExpertise: ['Solidity', 'Circom', 'SnarkJS', 'Hardhat', 'Ethers.js', 'Rust', 'Zero-Knowledge Rollups'] },
  { id: 'ALUM-14', fullName: 'Ankita Acharya', batchYear: 2018, company: 'Adobe', designation: 'Senior Computer Vision Engineer', personaCategory: 'Technical Mentor / Staff Engineer', mentorshipScope: 'Interactive Computer Graphics & 3D WebXR', linkedStudentIds: ['STU-18', 'STU-19'], linkedProjectIds: ['PRJ-10', 'PRJ-21'], linkedPaperIds: [], canPostJobs: false, activeJobOpeningsCount: 0, techStackExpertise: ['Three.js', 'WebXR', 'WebGL', 'MediaPipe', 'TensorFlow.js', 'GLSL', 'React', 'Python'] },
];

export const OFFERS_DATA: OfferRecord[] = [
  { id: 'OFF-01', studentId: 'STU-01', studentName: 'Aarav Mohanty', academicYearBranch: '4th Year CSE', company: 'HyperScale Labs', jobRole: 'Founding AI Systems Engineer', packageStr: '₹28 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-01', status: 'Accepted' },
  { id: 'OFF-02', studentId: 'STU-02', studentName: 'Ananya Dash', academicYearBranch: '4th Year CSE', company: 'NeuroLink AI', jobRole: 'Speech AI Research Engineer', packageStr: '₹24 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-05', status: 'Accepted' },
  { id: 'OFF-03', studentId: 'STU-03', studentName: 'Rohan Patnaik', academicYearBranch: '4th Year CSIT', company: 'Google', jobRole: 'Embedded Software Engineer', packageStr: '₹36 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-04', status: 'Accepted' },
  { id: 'OFF-04', studentId: 'STU-07', studentName: 'Vikramaditya Sen', academicYearBranch: '4th Year CSE', company: 'Microsoft India', jobRole: 'Systems Engineer - Rust & Core Tools', packageStr: '₹32 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-02', status: 'Accepted' },
  { id: 'OFF-05', studentId: 'STU-11', studentName: 'Aditya Rath', academicYearBranch: '4th Year CSE', company: 'Razorpay', jobRole: 'Software Development Engineer (SDE-1)', packageStr: '₹22 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-03', status: 'Accepted' },
  { id: 'OFF-06', studentId: 'STU-17', studentName: 'Pranav Kulkarni', academicYearBranch: '4th Year CSIT', company: 'Cisco Systems', jobRole: 'Network Systems Engineer (eBPF)', packageStr: '₹26 LPA', offerType: 'PPO', referringAlumniId: 'ALUM-10', status: 'Accepted' },
  { id: 'OFF-07', studentId: 'STU-04', studentName: 'Sneha Mishra', academicYearBranch: '3rd Year ECE', company: 'Intel Labs', jobRole: 'Embedded Security Research Intern', packageStr: '₹65,000 / month', offerType: 'Internship', referringAlumniId: 'ALUM-08', status: 'Joined' },
  { id: 'OFF-08', studentId: 'STU-05', studentName: 'Siddharth Nayak', academicYearBranch: '3rd Year CSE', company: 'Amazon Web Services (AWS)', jobRole: 'Cloud Systems Intern (GPU Distributed)', packageStr: '₹80,000 / month', offerType: 'Internship', referringAlumniId: 'ALUM-06', status: 'Joined' },
  { id: 'OFF-09', studentId: 'STU-08', studentName: 'Meera Krishnan', academicYearBranch: '3rd Year EEE', company: 'GreenVolt Mobility', jobRole: 'IoT Energy Systems Intern', packageStr: '₹50,000 / month', offerType: 'Internship', referringAlumniId: 'ALUM-09', status: 'Joined' },
  { id: 'OFF-10', studentId: 'STU-18', studentName: 'Shreya Nanda', academicYearBranch: '2nd Year CSE', company: 'Adobe', jobRole: 'Computer Vision & WebXR Research Intern', packageStr: '₹75,000 / month', offerType: 'Internship', referringAlumniId: 'ALUM-14', status: 'Joined' },
];


// ==================== PHASE 1: NORMALIZED & SYNTHESIZED RELATIONAL TABLES ====================

export interface UnifiedStudent extends StudentRecord {
  avatarUrl: string;
  academics: StudentAcademicExtra;
}

export interface UnifiedAlumni extends AlumniRecord {
  avatarUrl: string;
  linkedinUrl: string;
  career: AlumniCareerExtra;
}

export interface UnifiedOffer extends OfferRecord {
  triggeredByProjectId: string;
}

export interface JobReferralRecord {
  id: string;
  alumniId: string;
  postedBy: string;
  company: string;
  designation: string;
  roleTitle: string;
  roleType: 'Full-Time' | 'Internship' | 'Paid Bounty';
  compensation: string;
  location: string;
  skills: string[];
  lastDate: string;
}

export interface SquadOpeningRecord {
  id: string;
  projectId: string;
  projectName: string;
  leadStudentId: string;
  leadName: string;
  roleNeeded: string;
  skillsRequired: string[];
  teamSize: number;
}

export interface AlumniCritiqueRecord {
  id: string;
  projectId: string;
  alumniId: string;
  alumniName: string;
  alumniRole: string;
  comment: string;
  timestamp: string;
  endorsed: boolean;
}

export interface OfficeHourSlot {
  id: string;
  alumniId: string;
  alumniName: string;
  company: string;
  topic: string;
  dayTime: string;
  durationMin: number;
}

export interface AcquiHireInquiry {
  id: string;
  founderAlumniId: string;
  founderName: string;
  company: string;
  targetProjectId: string;
  targetProjectName: string;
  squadSize: number;
  offerType: string;
  status: 'Active Discussion' | 'Due Diligence' | 'Term Sheet Sent';
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const UNIFIED_STUDENTS: UnifiedStudent[] = STUDENTS_DATA.map((s) => ({
  ...s,
  avatarUrl: getIndianAvatar(s.fullName),
  academics: STUDENT_ACADEMICS[s.id],
}));

const OFFER_ISSUING_ALUM_IDS = new Set(OFFERS_DATA.map((o) => o.referringAlumniId));

export const UNIFIED_ALUMNI: UnifiedAlumni[] = ALUMNI_DATA.map((a) => {
  const issuedOffer = OFFER_ISSUING_ALUM_IDS.has(a.id);
  const canPostJobs = a.canPostJobs || issuedOffer;
  const activeJobOpeningsCount =
    a.activeJobOpeningsCount > 0 ? a.activeJobOpeningsCount : issuedOffer ? 1 : 0;
  return {
    ...a,
    canPostJobs,
    activeJobOpeningsCount,
    avatarUrl: getIndianAvatar(a.fullName),
    linkedinUrl: `https://linkedin.com/in/${slugify(a.fullName)}-iter`,
    career: ALUMNI_CAREER[a.id],
  };
});

const OFFER_TRIGGER_PROJECT_MAP: Record<string, string> = {
  'OFF-01': 'PRJ-01',
  'OFF-02': 'PRJ-08',
  'OFF-03': 'PRJ-02',
  'OFF-04': 'PRJ-04',
  'OFF-05': 'PRJ-06',
  'OFF-06': 'PRJ-09',
  'OFF-07': 'PRJ-21',
  'OFF-08': 'PRJ-03',
  'OFF-09': 'PRJ-05',
  'OFF-10': 'PRJ-10',
};

export const UNIFIED_OFFERS: UnifiedOffer[] = OFFERS_DATA.map((o) => ({
  ...o,
  triggeredByProjectId: OFFER_TRIGGER_PROJECT_MAP[o.id] || 'PRJ-01',
}));

export const JOB_REFERRALS_32: JobReferralRecord[] = (() => {
  const list: JobReferralRecord[] = [];
  let counter = 1;
  ALUMNI_DATA.filter((a) => a.canPostJobs && a.activeJobOpeningsCount > 0).forEach((alum) => {
    for (let i = 0; i < alum.activeJobOpeningsCount; i++) {
      if (list.length >= 32) break;
      const skill = alum.techStackExpertise[i % alum.techStackExpertise.length] || 'Systems';
      const isIntern = i % 3 === 1;
      list.push({
        id: `REF-${String(counter).padStart(2, '0')}`,
        alumniId: alum.id,
        postedBy: alum.fullName,
        company: alum.company,
        designation: alum.designation,
        roleTitle: isIntern
          ? `${skill} Engineering Intern`
          : `${skill} Software Engineer (SDE-${(i % 2) + 1})`,
        roleType: isIntern ? 'Internship' : 'Full-Time',
        compensation: isIntern ? '₹55,000 – ₹80,000 / mo' : '₹22 – 36 LPA',
        location: i % 2 === 0 ? 'Bangalore (Hybrid)' : 'Hyderabad / Remote',
        skills: alum.techStackExpertise.slice(0, 4),
        lastDate: `2026-12-${String(10 + ((counter * 2) % 18)).padStart(2, '0')}`,
      });
      counter++;
    }
  });
  return list;
})();

export const SQUAD_OPENINGS: SquadOpeningRecord[] = PROJECTS_DATA.filter(
  (p) => p.collaborationMode === 'Group'
)
  .slice(0, 10)
  .map((p, idx) => {
    const stu = STUDENTS_DATA.find((s) => s.fullName === p.leadName);
    return {
      id: `SQD-${String(idx + 1).padStart(2, '0')}`,
      projectId: p.id,
      projectName: p.name,
      leadStudentId: stu?.id || 'STU-01',
      leadName: p.leadName,
      roleNeeded: idx % 2 === 0 ? 'Backend / Systems Co-Builder' : 'Frontend / UI Engineer',
      skillsRequired: p.techStack.slice(0, 3),
      teamSize: p.teamSize,
    };
  });

export const ALUMNI_CRITIQUES: AlumniCritiqueRecord[] = PROJECTS_DATA.slice(0, 16).map(
  (p, idx) => {
    const alum =
      ALUMNI_DATA.find((a) => a.linkedProjectIds.includes(p.id)) ||
      ALUMNI_DATA[idx % ALUMNI_DATA.length];
    return {
      id: `CRT-${String(idx + 1).padStart(2, '0')}`,
      projectId: p.id,
      alumniId: alum.id,
      alumniName: alum.fullName,
      alumniRole: `${alum.designation} @ ${alum.company} • '${String(alum.batchYear).slice(-2)}`,
      comment: `Strong ${p.techStack[0]} architecture on ${p.name}. Clean separation of concerns and verified ${p.hostingPlatform} deployment.`,
      timestamp: `${idx + 1}h ago`,
      endorsed: true,
    };
  }
);

export const OFFICE_HOURS: OfficeHourSlot[] = ALUMNI_DATA.map((a, idx) => ({
  id: `OH-${String(idx + 1).padStart(2, '0')}`,
  alumniId: a.id,
  alumniName: a.fullName,
  company: a.company,
  topic: a.mentorshipScope,
  dayTime: ['Sat, 11:00 AM', 'Sun, 5:00 PM', 'Wed, 7:30 PM', 'Fri, 6:00 PM'][idx % 4],
  durationMin: 15,
}));

export const ACQUI_HIRE_INQUIRIES: AcquiHireInquiry[] = [
  {
    id: 'ACQ-01',
    founderAlumniId: 'ALUM-01',
    founderName: 'Debadatta Rath',
    company: 'HyperScale Labs',
    targetProjectId: 'PRJ-01',
    targetProjectName: 'FinAudit Multi-Agent',
    squadSize: 3,
    offerType: 'Full Squad PPO / IP Licensing',
    status: 'Term Sheet Sent',
  },
  {
    id: 'ACQ-02',
    founderAlumniId: 'ALUM-05',
    founderName: 'Anindita Pattnaik',
    company: 'NeuroLink AI',
    targetProjectId: 'PRJ-08',
    targetProjectName: 'VaniSetu Odia ASR',
    squadSize: 2,
    offerType: 'Speech AI Squad Acqui-Hire',
    status: 'Active Discussion',
  },
  {
    id: 'ACQ-03',
    founderAlumniId: 'ALUM-09',
    founderName: 'Tapas Ranjan Nayak',
    company: 'GreenVolt Mobility',
    targetProjectId: 'PRJ-05',
    targetProjectName: 'GridPulse Bhubaneswar',
    squadSize: 1,
    offerType: 'CleanTech R&D Residency',
    status: 'Due Diligence',
  },
];
