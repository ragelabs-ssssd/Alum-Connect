'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  GitBranch,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ALUMNI_DATA,
  STUDENTS_DATA,
  getIndianAvatar,
} from '../../data/alumConnectData';
import { AlumniPersona, BandwidthShield, StudentCohort } from '../../types';
import AlumConnectLogo from '../../components/AlumConnectLogo';
import ThemeToggle from '../../components/ThemeToggle';

type SignUpRole = 'student' | 'alumni';

export default function SignUpPage() {
  const router = useRouter();
  const { setCurrentUser, allPresetUsers } = useApp();

  const [role, setRole] = useState<SignUpRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinExtracted, setLinkedinExtracted] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student-specific fields
  const [cohort, setCohort] = useState<StudentCohort>('3rd_year');
  const [branch, setBranch] = useState('CSE');
  const [githubHandle, setGithubHandle] = useState('');
  const [techStack, setTechStack] = useState('Next.js, TypeScript, FastAPI');

  // Alumni-specific fields
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [batchYear, setBatchYear] = useState('2019');
  const [persona, setPersona] = useState<AlumniPersona>('manager');
  const [shield, setShield] = useState<BandwidthShield>('5-min async roast');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const linkedinMatch = linkedinUrl.match(/linkedin\.com\/in\/([^/?#\s]+)/i);
  const linkedinSlug = linkedinMatch?.[1] || '';
  const linkedinDisplayName = linkedinSlug
    ? linkedinSlug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';
  const normalizedSlug = linkedinSlug.toLowerCase().replace(/[-_]+/g, ' ');
  const matchedAlum = linkedinSlug
    ? ALUMNI_DATA.find((a) => a.fullName.toLowerCase().includes(normalizedSlug))
    : undefined;
  const matchedStudent = linkedinSlug
    ? STUDENTS_DATA.find((s) => s.fullName.toLowerCase().includes(normalizedSlug))
    : undefined;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!linkedinUrl.trim() || !linkedinUrl.toLowerCase().includes('linkedin.com/')) {
      setErrorMsg('Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/your-handle).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Please choose a password of at least 6 characters.');
      return;
    }
    if (role === 'alumni' && (!company.trim() || !designation.trim())) {
      setErrorMsg('Please enter your current company and designation.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (role === 'student') {
        const res = await fetch('/api/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            identifier: email.trim(),
            cohort,
          }),
        });
        const data = await res.json();
        const base =
          (res.ok && data?.user) ||
          allPresetUsers.find((u) => u.role === 'student');

        if (base) {
          setCurrentUser({
            ...base,
            name: fullName.trim(),
            email: email.trim(),
            cohort,
            branch,
            techStack: techStack
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            headline: `${branch} Builder${githubHandle.trim() ? ` • @${githubHandle.trim().replace(/^@/, '')}` : ''} • ${techStack}`,
          });
        }
        router.push('/student');
      } else {
        const res = await fetch('/api/alumni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            payload: {
              identifier: email.trim(),
              persona,
              shield,
            },
          }),
        });
        const data = await res.json();
        const base =
          (res.ok && data?.user) ||
          allPresetUsers.find((u) => u.role === 'alumni');

        if (base) {
          setCurrentUser({
            ...base,
            name: fullName.trim(),
            email: email.trim(),
            company: company.trim(),
            designation: designation.trim(),
            batchYear: Number(batchYear) || 2019,
            alumniPersona: persona,
            bandwidthShield: shield,
            headline: `${designation.trim()} @ ${company.trim()} • Batch '${String(batchYear).slice(-2)}`,
          });
        }
        router.push('/alumni');
      }
    } catch {
      const fallback = allPresetUsers.find((u) => u.role === role);
      if (fallback) {
        setCurrentUser({
          ...fallback,
          name: fullName.trim() || fallback.name,
          email: email.trim() || fallback.email,
        });
      }
      router.push(role === 'student' ? '/student' : '/alumni');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] px-3.5 py-2 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all';

  return (
    <div className="font-luma-body relative min-h-dvh w-full overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(800px_500px_at_25%_20%,rgba(148,163,184,0.22)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-white flex flex-col justify-between transition-colors">
      {/* Panning Isometric Mesh Background */}
      <div
        className="pointer-events-none fixed -inset-12 opacity-20 animate-iso-drift hidden dark:block"
        style={{
          backgroundImage:
            'linear-gradient(30deg, #22D3EE 1px, transparent 1px), linear-gradient(150deg, #34D399 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -inset-12 opacity-40 animate-iso-drift dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(30deg, #0891B2 1px, transparent 1px), linear-gradient(150deg, #059669 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-white/75 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1.5 shadow-xs backdrop-blur-md shrink-0">
            <AlumConnectLogo className="h-6 w-6" />
          </div>
          <span className="font-luma-title text-lg sm:text-xl leading-none tracking-tight text-[#0F172A] dark:text-white inline-flex items-center translate-y-[0.5px]">
            AlmaConnect
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Page
          </Link>
          <ThemeToggle compact />
        </div>
      </header>

      {/* Main Split Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left 5 Cols: Value Props & Role Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/60 dark:bg-white/[0.05] backdrop-blur-md px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-[#0891B2] dark:text-[#22D3EE]">
                Create Your Profile
              </span>
              <h1 className="font-luma-title text-2xl sm:text-3xl xl:text-[36px] leading-[1.14] text-[#0F172A] dark:text-white">
                <span className="block sm:whitespace-nowrap">Join the campus</span>
                <span className="block text-[#0891B2] dark:text-[#22D3EE]">
                  proof-of-work network.
                </span>
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Set up a verified builder or alumni profile in 60 seconds—tailored to your cohort, tech stack, or hiring bandwidth.
              </p>
            </div>

            {linkedinSlug ? (
              <div className="rounded-3xl border border-[#0A66C2]/40 bg-white/85 dark:bg-[#111724]/90 backdrop-blur-xl p-5 shadow-lg space-y-4 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#0A66C2] text-white text-xs font-extrabold">
                      in
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                      LinkedIn Profile Preview
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {linkedinExtracted ? 'Confirmed' : 'Detected'}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] p-3.5">
                  <img
                    src={getIndianAvatar(
                      matchedAlum?.fullName ||
                        matchedStudent?.fullName ||
                        fullName ||
                        linkedinDisplayName
                    )}
                    alt={linkedinDisplayName}
                    className="h-12 w-12 rounded-full object-cover border border-[#0A66C2]/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                      {fullName.trim() ||
                        matchedAlum?.fullName ||
                        matchedStudent?.fullName ||
                        linkedinDisplayName}
                    </div>
                    <div className="text-xs text-[#475569] dark:text-zinc-300 truncate">
                      {matchedAlum
                        ? `${matchedAlum.designation} @ ${matchedAlum.company}`
                        : matchedStudent
                          ? `${matchedStudent.branch} • ${matchedStudent.academicYear}`
                          : role === 'alumni' && company.trim()
                            ? `${designation.trim() || 'Alumni'} @ ${company.trim()}`
                            : `${branch} • ${role === 'student' ? 'Student Builder' : 'Alumni Mentor'}`}
                    </div>
                    <div className="text-[11px] font-mono text-[#0A66C2] dark:text-sky-400 truncate mt-0.5">
                      linkedin.com/in/{linkedinSlug}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName.trim()) {
                        setFullName(
                          matchedAlum?.fullName ||
                            matchedStudent?.fullName ||
                            linkedinDisplayName
                        );
                      }
                      if (matchedAlum) {
                        setRole('alumni');
                        setCompany(matchedAlum.company);
                        setDesignation(matchedAlum.designation);
                      } else if (role === 'student' && !githubHandle.trim()) {
                        setGithubHandle(linkedinSlug);
                      }
                      setLinkedinExtracted(true);
                      setErrorMsg('');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {linkedinExtracted ? "Profile Confirmed ✓" : "Yes, that's my profile"}
                  </button>
                  <a
                    href={
                      linkedinUrl.startsWith('http')
                        ? linkedinUrl
                        : `https://${linkedinUrl}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-zinc-300 dark:border-white/20 px-3.5 py-2 text-xs font-semibold hover:border-[#0A66C2] transition-colors"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {[
                  {
                    icon: Code2,
                    title: 'Students: Link GitHub & Cohort',
                    desc: 'Auto-attach your repositories and sprint builds to every alumni bounty and job.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Alumni: Set Your Bandwidth Shield',
                    desc: 'Choose 5-min async roasts or Deal Room access—zero calendar spam.',
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Verified Vouch & Referral Graph',
                    desc: 'Earn and issue Vouch Cards backed by real shipped engineering craft.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.14)] bg-white/65 dark:bg-white/[0.04] backdrop-blur-md p-3.5 flex items-start gap-3"
                  >
                    <item.icon className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right 7 Cols: Detailed Sign Up Dock */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/75 dark:bg-[#14171E]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-luma-title text-xl sm:text-2xl text-[#0F172A] dark:text-white">
                    Create{' '}
                    <span className="text-[#0891B2] dark:text-[#22D3EE]">
                      AlmaConnect
                    </span>{' '}
                    Account
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Complete your onboarding details below.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                >
                  Already have an account? Sign In
                </Link>
              </div>

              {/* Role Switcher */}
              <div
                role="tablist"
                aria-label="Select sign up role"
                className="grid grid-cols-2 gap-1 rounded-xl border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.04] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === 'student'}
                  onClick={() => setRole('student')}
                  className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                    role === 'student'
                      ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-xs'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student Builder
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === 'alumni'}
                  onClick={() => setRole('alumni')}
                  className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                    role === 'alumni'
                      ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-xs'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Alumni Mentor / Hiring
                </button>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Aarav Mohanty"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                    >
                      {role === 'student' ? 'Student Email' : 'Work Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          role === 'student' ? 'name@campus.edu' : 'name@company.com'
                        }
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                {/* Required LinkedIn Profile URL + Auto-Extract */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="signup-linkedin"
                      className="font-semibold text-[#0F172A] dark:text-white"
                    >
                      LinkedIn Profile URL <span className="text-[#0891B2] dark:text-[#22D3EE]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
                        if (match?.[1]) {
                          const cleaned = match[1]
                            .replace(/[-_]+/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                          if (!fullName.trim()) setFullName(cleaned);
                          if (role === 'student' && !githubHandle.trim()) {
                            setGithubHandle(match[1]);
                          }
                          setLinkedinExtracted(true);
                          setErrorMsg('');
                        } else {
                          setErrorMsg('Enter a valid linkedin.com/in/username URL to extract profile details.');
                        }
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                    >
                      {linkedinExtracted ? 'Profile Extracted ✓' : 'Extract from LinkedIn'}
                    </button>
                  </div>
                  <input
                    id="signup-linkedin"
                    type="url"
                    required
                    value={linkedinUrl}
                    onChange={(e) => {
                      setLinkedinUrl(e.target.value);
                      setLinkedinExtracted(false);
                    }}
                    placeholder="https://www.linkedin.com/in/your-handle"
                    className={inputClass}
                  />
                </div>

                {/* Role-Specific Fields */}
                {role === 'student' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label
                          htmlFor="signup-cohort"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Current Year / Cohort
                        </label>
                        <select
                          id="signup-cohort"
                          value={cohort}
                          onChange={(e) =>
                            setCohort(e.target.value as StudentCohort)
                          }
                          className={inputClass}
                        >
                          <option value="1st_year">1st Year (Batch 2028) • Beta Scout</option>
                          <option value="2nd_year">2nd Year (Batch 2027) • Core Builder</option>
                          <option value="3rd_year">3rd Year (Batch 2026) • Bounty Sprinter</option>
                          <option value="4th_year">4th Year (Batch 2025) • Squad Lead</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="signup-branch"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Department / Branch
                        </label>
                        <select
                          id="signup-branch"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className={inputClass}
                        >
                          <option value="CSE">Computer Science (CSE)</option>
                          <option value="CSIT">CS &amp; Information Tech (CSIT)</option>
                          <option value="ECE">Electronics &amp; Comm (ECE)</option>
                          <option value="EEE">Electrical &amp; Electronics (EEE)</option>
                          <option value="MCA">MCA / Post-Grad</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label
                          htmlFor="signup-github"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          GitHub Handle
                        </label>
                        <div className="relative">
                          <GitBranch className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="signup-github"
                            type="text"
                            value={githubHandle}
                            onChange={(e) => setGithubHandle(e.target.value)}
                            placeholder="github.com/username"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="signup-stack"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Primary Tech Stack
                        </label>
                        <input
                          id="signup-stack"
                          type="text"
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          placeholder="Next.js, FastAPI, LangGraph"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="space-y-1">
                        <label
                          htmlFor="signup-company"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Current Company
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="signup-company"
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Razorpay / Microsoft"
                            className={`${inputClass} pl-9`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="signup-designation"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Designation
                        </label>
                        <input
                          id="signup-designation"
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="SDE-2 / Engineering Mgr"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="signup-batch"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Graduation Batch
                        </label>
                        <input
                          id="signup-batch"
                          type="number"
                          min="2000"
                          max="2026"
                          value={batchYear}
                          onChange={(e) => setBatchYear(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label
                          htmlFor="signup-persona"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Alumni Persona
                        </label>
                        <select
                          id="signup-persona"
                          value={persona}
                          onChange={(e) =>
                            setPersona(e.target.value as AlumniPersona)
                          }
                          className={inputClass}
                        >
                          <option value="ic">MNC IC (0–5 Yrs) • Vouch &amp; Referrals</option>
                          <option value="manager">Hiring Manager (5–15 Yrs) • Roasts &amp; Fast-Track</option>
                          <option value="founder">Startup Founder (10–25 Yrs) • Acqui-Hire &amp; Bounties</option>
                          <option value="chro">CHRO / Recruiter • Campus Shortlist</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="signup-shield"
                          className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                        >
                          Bandwidth Shield
                        </label>
                        <select
                          id="signup-shield"
                          value={shield}
                          onChange={(e) =>
                            setShield(e.target.value as BandwidthShield)
                          }
                          className={inputClass}
                        >
                          <option value="5-min async roast">5-min async roast</option>
                          <option value="2 async reviews/mo">2 async reviews/mo</option>
                          <option value="1 session/quarter">1 session/quarter</option>
                          <option value="Direct deal room only">Direct deal room only</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="signup-password"
                    className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                  >
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className={`${inputClass} pl-9 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-[#0891B2]/25 dark:border-[#22D3EE]/25 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-3.5 py-2 text-xs text-[#0F172A] dark:text-white">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] py-2.5 px-5 text-sm font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? 'Creating Account...'
                      : role === 'student'
                        ? 'Create Student Builder Account'
                        : 'Create Alumni Mentor Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pb-5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#475569] dark:text-[#94A3B8]">
        <span className="font-luma-title text-[#0F172A] dark:text-white">AlmaConnect</span>
        <span className="font-mono">Proof-of-Work Network</span>
      </footer>
    </div>
  );
}
