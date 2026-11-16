'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LinkedinIcon } from './BrandIcons';
import {
  X,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Shield,
  ArrowRight,
  Mail,
  Sparkles,
  Layers,
} from 'lucide-react';
import { StudentCohort, AlumniTier, AlumniPersona, BandwidthShield, UserProfile } from '../types';

export default function OnboardingModal() {
  const { activeModal, closeModal, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'student' | 'alumni'>('student');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentCohort, setStudentCohort] = useState<StudentCohort>('2nd_year');
  const [studentBranch, setStudentBranch] = useState('CSE');
  const [studentGoal, setStudentGoal] = useState<'Build Squad' | 'Internship' | 'HS'>('Build Squad');
  const [selectedTech, setSelectedTech] = useState<string[]>(['React', 'Next.js', 'PostgreSQL']);
  const [studentOtp, setStudentOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Alumni Form State
  const [alumName, setAlumName] = useState('');
  const [alumEmail, setAlumEmail] = useState('');
  const [alumCompany, setAlumCompany] = useState('');
  const [alumDesignation, setAlumDesignation] = useState('');
  const [alumBatchYear, setAlumBatchYear] = useState<number>(2018);
  const [alumTier, setAlumTier] = useState<AlumniTier>('0-5');
  const [alumPersona, setAlumPersona] = useState<AlumniPersona>('ic');
  const [alumBandwidth, setAlumBandwidth] = useState<BandwidthShield>('2 async reviews/mo');

  if (activeModal !== 'onboarding') return null;

  const techOptions = [
    'React',
    'Next.js',
    'TypeScript',
    'FastAPI',
    'Go',
    'PostgreSQL',
    'Tailwind CSS',
    'Docker',
    'Redis',
    'Flutter',
    'Python AI/ML',
    'Figma',
  ];

  const handleTechToggle = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleCompleteStudentSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const cohortLabels = {
      '1st_year': { tag: 'Campus Ops & Beta Scout', label: '1st Year (Batch 2028)' },
      '2nd_year': { tag: 'Core Squad Builder', label: '2nd Year (Batch 2027)' },
      '3rd_year': { tag: '10-Day Bounty Sprinter', label: '3rd Year (Batch 2026)' },
      '4th_year': { tag: 'Lead / Off-Campus / HS', label: '4th Year (Batch 2025)' },
    };

    const newStudentUser: UserProfile = {
      id: `student_${Date.now()}`,
      name: studentName.trim() || 'ITER Student Builder',
      role: 'student',
      email: studentEmail.trim() || `${studentRegNo || '2341019000'}@soa.ac.in`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      headline: `${cohortLabels[studentCohort].label} • ${cohortLabels[studentCohort].tag} • ${studentBranch}`,
      cohort: studentCohort,
      cohortTag: cohortLabels[studentCohort].tag,
      studentYearLabel: cohortLabels[studentCohort].label,
      branch: studentBranch,
      techStack: selectedTech,
      skillsEndorsed: [
        { name: selectedTech[0] || 'Next.js', count: 1, endorserRoles: ['Community Verified'] },
      ],
      squadName: studentGoal === 'Build Squad' ? 'New SOA Squad' : undefined,
      squadRole: 'Squad Founder',
      vouchCardsCount: 0,
    };

    setCurrentUser(newStudentUser);
    closeModal();
  };

  const handleCompleteAlumniSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlumUser: UserProfile = {
      id: `alumni_${Date.now()}`,
      name: alumName.trim() || 'ITER Alumni Leader',
      role: 'alumni',
      email: alumEmail.trim() || 'alumni@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      headline: `ITER '${String(alumBatchYear).slice(2)} • ${alumDesignation || 'Senior Engineer'} @ ${alumCompany || 'Tech Corp'}`,
      alumniTier: alumTier,
      alumniPersona: alumPersona,
      company: alumCompany || 'Tech Corp',
      designation: alumDesignation || 'Software Engineer',
      batchYear: alumBatchYear,
      bandwidthShield: alumBandwidth,
      vouchCardsCount: 0,
    };

    setCurrentUser(newAlumUser);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-500/30 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-200 border border-blue-400/30">
              DUAL ONBOARDING ENGINE
            </span>
            <span className="text-xs text-blue-200">Siksha 'O' Anusandhan</span>
          </div>
          <h3 className="mt-1 text-xl font-bold tracking-tight">Join ITER Alum Connect</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Auto-routing by academic year for students, and experience tier for alumni & hiring leads.
          </p>

          {/* Toggle Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/30 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Onboarding (@soa.ac.in)
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'alumni'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Alumni / Partner (LinkedIn Auth)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {activeTab === 'student' ? (
            <form onSubmit={handleCompleteStudentSignup} className="space-y-4">
              {/* @soa.ac.in OTP Verification Simulation */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>SOA Institutional Verification</span>
                </div>
                <p className="mt-1 text-slate-600 text-[11px]">
                  Requires authenticated @soa.ac.in student email or university registration number to safeguard project integrity.
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      SOA Student Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. 2341019042@soa.ac.in"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Registration / Roll No.
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 2341019042"
                        value={studentRegNo}
                        onChange={(e) => setStudentRegNo(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setOtpSent(true)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-white font-bold whitespace-nowrap hover:bg-blue-500"
                      >
                        {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                </div>

                {otpSent && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded border border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">OTP: [8491] simulated</span>
                    <input
                      type="text"
                      placeholder="Enter 8491"
                      value={studentOtp}
                      onChange={(e) => setStudentOtp(e.target.value)}
                      className="w-24 rounded border border-emerald-300 px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Student Name & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Mohapatra"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Branch / Dept</label>
                  <select
                    value={studentBranch}
                    onChange={(e) => setStudentBranch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="CSE">Computer Science & Engineering (CSE)</option>
                    <option value="CSIT">Computer Science & Information Tech (CSIT)</option>
                    <option value="ECE">Electronics & Communication (ECE)</option>
                    <option value="EE">Electrical Engineering (EE)</option>
                    <option value="ME">Mechanical Engineering (ME)</option>
                  </select>
                </div>
              </div>

              {/* Cohort Auto-Routing (Year Selection) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Academic Year (Auto-Routes Cohort Tag & Privileges)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: '1st_year', label: '1st Year', tag: 'Campus Ops & Beta Scout', desc: 'Hostel beta tests & discovery bounties' },
                    { id: '2nd_year', label: '2nd Year', tag: 'Core Squad Builder', desc: 'Form 3-person squads, ship working MVPs' },
                    { id: '3rd_year', label: '3rd Year', tag: '10-Day Bounty Sprinter', desc: 'Industry microservices & paid sprints' },
                    { id: '4th_year', label: '4th Year', tag: 'Lead / Off-Campus / HS', desc: 'Direct MNC referrals & acqui-hire loops' },
                  ].map((cohort) => (
                    <div
                      key={cohort.id}
                      onClick={() => setStudentCohort(cohort.id as StudentCohort)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        studentCohort === cohort.id
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cohort.label}</span>
                        {studentCohort === cohort.id && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="text-[11px] font-semibold text-blue-700 mt-0.5">{cohort.tag}</div>
                      <p className="text-[10px] text-slate-500 mt-1">{cohort.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Primary Intent / Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Build Squad', label: 'Build Squad', desc: 'Find teammates' },
                    { id: 'Internship', label: 'Internship', desc: 'Summer 2026' },
                    { id: 'HS', label: 'Higher Studies / Off-Campus', desc: 'Referral ready' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setStudentGoal(goal.id as any)}
                      className={`rounded-lg border p-2 text-center transition-all ${
                        studentGoal === goal.id
                          ? 'border-blue-600 bg-blue-600 text-white font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-semibold">{goal.label}</div>
                      <div className="text-[9px] opacity-80">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Primary Tech Stack (Select 3-5)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {techOptions.map((tech) => {
                    const isSelected = selectedTech.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechToggle(tech)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2"
              >
                Complete Student Onboarding <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCompleteAlumniSignup} className="space-y-4">
              {/* LinkedIn OAuth Simulation Banner */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <LinkedinIcon className="h-4 w-4 text-indigo-600" />
                  <span>LinkedIn Professional Verification</span>
                </div>
                <p className="mt-1 text-slate-600 text-[11px]">
                  Verifies company employment and connects your ITER graduation batch year to prevent cold email spam.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded bg-indigo-600 px-3 py-1 text-white font-semibold text-[11px]">
                    LinkedIn OAuth Connected ✓
                  </span>
                  <span className="text-[11px] text-slate-500">Auto-synced current company & title</span>
                </div>
              </div>

              {/* Name, Company, Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Mohanty"
                    value={alumName}
                    onChange={(e) => setAlumName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ankit@microsoft.com"
                    value={alumEmail}
                    onChange={(e) => setAlumEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft / PayPulse / Oracle"
                    value={alumCompany}
                    onChange={(e) => setAlumCompany(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">ITER Batch Year</label>
                  <input
                    type="number"
                    min={1998}
                    max={2026}
                    value={alumBatchYear}
                    onChange={(e) => setAlumBatchYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience Tier & Decision Persona */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Decision Persona (Determines Actions Available on Product Cards)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'ic', title: 'MNC Employee / IC', tier: '0–5 Yrs', desc: 'Unlocks: Issue Verified Vouch Card & Internal MNC Referral' },
                    { id: 'manager', title: 'Engineering / Product Manager', tier: '5–15 Yrs', desc: 'Unlocks: 5-Min Async Roast & Fast-Track Interview Loop' },
                    { id: 'founder', title: 'Startup Founder / Firm Owner', tier: '10–25 Yrs', desc: 'Unlocks: Direct Deal Room (Acqui-hire Squad) & Bounties' },
                    { id: 'chro', title: 'CHRO / Hiring Lead', tier: '15–25 Yrs', desc: 'Unlocks: Vouched Talent Shortlist & Campus Drive Booking' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setAlumPersona(p.id as AlumniPersona);
                        if (p.id === 'ic') setAlumTier('0-5');
                        if (p.id === 'manager') setAlumTier('5-10');
                        if (p.id === 'founder') setAlumTier('10-15');
                        if (p.id === 'chro') setAlumTier('15-25');
                      }}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        alumPersona === p.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{p.title}</span>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                          {p.tier}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bandwidth Shield */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Bandwidth Shield (Guarantees Zero Cold Email Spam)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  How much time do you want to commit to mentoring or evaluating student MVPs?
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {[
                    '2 async reviews/mo',
                    '5-min async roast',
                    '1 session/quarter',
                    'Direct deal room only',
                  ].map((shield) => (
                    <button
                      key={shield}
                      type="button"
                      onClick={() => setAlumBandwidth(shield as BandwidthShield)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        alumBandwidth === shield
                          ? 'border-indigo-600 bg-indigo-600 text-white font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px]">{shield}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-sm flex items-center justify-center gap-2"
              >
                Complete Alumni Onboarding <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
