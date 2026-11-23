'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  Rocket,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../../components/ThemeToggle';

type LoginRole = 'student' | 'alumni';

const ECOSYSTEM_PILLARS = [
  {
    step: '01',
    title: 'Community Inputs',
    desc: 'ITER students & verified alumni bringing real ideas and domain expertise.',
    icon: <Users className="w-4 h-4" />,
  },
  {
    step: '02',
    title: 'Platform Engagement',
    desc: 'Structured mentorship, 5-min async roasts, jobs & paid sprint internships.',
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    step: '03',
    title: 'Creation & Showcase',
    desc: 'Live GitHub repositories, product demos & alumni-endorsed skill cards.',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    step: '04',
    title: 'Ecosystem Outcomes',
    desc: 'Campus startups, direct industry exposure & fast-track career growth.',
    icon: <Rocket className="w-4 h-4" />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, allPresetUsers } = useApp();

  const [role, setRole] = useState<LoginRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
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
            cohort: '3rd_year',
          }),
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          setCurrentUser(data.user);
        } else {
          const fallback = allPresetUsers.find((u) => u.role === 'student');
          if (fallback) setCurrentUser(fallback);
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
              persona: 'manager',
              shield: '5-min async roast',
            },
          }),
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          setCurrentUser(data.user);
        } else {
          const fallback = allPresetUsers.find((u) => u.role === 'alumni');
          if (fallback) setCurrentUser(fallback);
        }
        router.push('/alumni');
      }
    } catch {
      const fallback = allPresetUsers.find((u) => u.role === role);
      if (fallback) setCurrentUser(fallback);
      router.push(role === 'student' ? '/student' : '/alumni');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSsoContinue = (provider: 'Google' | 'LinkedIn') => {
    const fallback = allPresetUsers.find((u) => u.role === role);
    if (fallback) {
      setCurrentUser(fallback);
    }
    setErrorMsg('');
    router.push(role === 'student' ? '/student' : '/alumni');
    void provider;
  };

  return (
    <div className="font-luma-body relative min-h-dvh w-full overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(800px_500px_at_25%_20%,rgba(148,163,184,0.22)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-white transition-colors flex flex-col lg:flex-row">
      {/* Panning Isometric Diamond Mesh Background (matching Landing Page) */}
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
        className="pointer-events-none fixed -inset-12 opacity-35 animate-iso-drift dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(30deg, #0891B2 1px, transparent 1px), linear-gradient(150deg, #059669 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* ==================== LEFT PANEL (50% Desktop): LOGIN FORM ==================== */}
      <section className="relative z-10 w-full lg:w-1/2 min-h-dvh flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-6">
        {/* Brand Header */}
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1.5 shadow-xs backdrop-blur-md">
              <img
                src="/logo.png"
                alt="Alum Connect"
                className="h-full w-full object-contain dark:invert"
              />
            </div>
            <div className="leading-tight">
              <span className="font-luma-title text-sm sm:text-base tracking-tight text-[#0F172A] dark:text-white block">
                Alum Connect
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] dark:text-[#94A3B8]">
                <GraduationCap className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />
                ITER • Siksha &apos;O&apos; Anusandhan
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
            >
              ← Gateway
            </Link>
            <ThemeToggle compact />
          </div>
        </header>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/70 dark:bg-[#14171E]/72 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="space-y-1.5">
              <h1 className="font-luma-title text-2xl sm:text-[28px] leading-[1.15] text-[#0F172A] dark:text-white">
                Welcome back to the{' '}
                <span className="text-[#0891B2] dark:text-[#22D3EE]">ecosystem</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                Build products. Showcase skills. Connect with alumni.
              </p>
            </div>

            {/* Role Selector Pill */}
            <div
              className="grid grid-cols-2 gap-1 rounded-xl p-1 border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.04)] dark:bg-white/[0.04]"
              role="tablist"
              aria-label="Account role"
            >
              <button
                type="button"
                role="tab"
                aria-selected={role === 'student'}
                onClick={() => setRole('student')}
                className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-xs'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === 'alumni'}
                onClick={() => setRole('alumni')}
                className={`rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                  role === 'alumni'
                    ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-xs'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Alumni
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                >
                  {role === 'student' ? 'ITER Student Email' : 'Alumni Work Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === 'student'
                        ? 'name@iter.ac.in'
                        : 'alumni@company.com'
                    }
                    className="w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/80 dark:bg-white/[0.05] pl-10 pr-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[#0F172A] dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/80 dark:bg-white/[0.05] pl-10 pr-11 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all"
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

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer text-[#475569] dark:text-[#94A3B8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-[#0891B2] dark:accent-[#22D3EE]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setErrorMsg(
                      'Password reset links are sent to your verified @iter.ac.in or alumni email.'
                    )
                  }
                  className="font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-[#0891B2]/25 dark:border-[#22D3EE]/25 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-3.5 py-2.5 text-xs text-[#0F172A] dark:text-white">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] py-2.5 px-4 text-sm font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)]" />
              <span className="px-3 text-[11px] font-medium text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                Or continue with
              </span>
              <div className="w-full border-t border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)]" />
            </div>

            {/* Social / SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSsoContinue('Google')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/80 dark:bg-white/[0.05] hover:border-[#0891B2] dark:hover:border-[#22D3EE] py-2.5 px-4 text-xs font-semibold text-[#0F172A] dark:text-white transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.3 0 6.07-1.09 8.09-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.21 1.18-3.23 0-5.97-2.18-6.95-5.12H1.05v3.14C3.06 21.19 7.21 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.05 14.05c-.25-.74-.39-1.53-.39-2.35s.14-1.61.39-2.35V6.21H1.05C.38 7.55 0 9.03 0 10.6s.38 3.05 1.05 4.39l4-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.06 1.19 15.3 0 12 0 7.21 0 3.06 2.81 1.05 6.81l4 3.14c.98-2.94 3.72-5.2 6.95-5.2Z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSsoContinue('LinkedIn')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/80 dark:bg-white/[0.05] hover:border-[#0891B2] dark:hover:border-[#22D3EE] py-2.5 px-4 text-xs font-semibold text-[#0F172A] dark:text-white transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                </svg>
                LinkedIn
              </button>
            </div>

            <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-1">
              New to Alum Connect?{' '}
              <Link
                href={role === 'student' ? '/student' : '/alumni'}
                className="font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <footer className="text-[11px] text-[#475569] dark:text-[#94A3B8] text-center lg:text-left">
          Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
        </footer>
      </section>

      {/* ==================== RIGHT PANEL (50% Desktop): ECOSYSTEM SHOWCASE ==================== */}
      <aside className="relative z-10 w-full lg:w-1/2 min-h-[540px] lg:min-h-dvh p-6 sm:p-12 lg:p-14 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)] bg-white/45 dark:bg-[#0D1118]/60 backdrop-blur-xl">
        <div className="relative z-10 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 border border-[#0891B2]/25 dark:border-[#22D3EE]/30 px-3 py-1 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">
            ITER Campus-to-Industry Flywheel
          </span>
          <h2 className="font-luma-title text-2xl sm:text-3xl leading-snug pt-1 text-[#0F172A] dark:text-white">
            From classroom commits to{' '}
            <span className="text-[#0891B2] dark:text-[#34D399]">
              verified career breakthroughs.
            </span>
          </h2>
        </div>

        {/* 4 Core Pillars Flow Card */}
        <div className="relative z-10 my-6 rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/65 dark:bg-[#14171E]/75 backdrop-blur-xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            Ecosystem Value Flow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ECOSYSTEM_PILLARS.map((pillar) => (
              <div
                key={pillar.step}
                className="rounded-2xl border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)] bg-[rgba(15,23,42,0.04)] dark:bg-white/[0.05] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                    <span className="text-[#0891B2] dark:text-[#22D3EE]">{pillar.icon}</span>
                    {pillar.title}
                  </span>
                  <span className="font-mono text-[11px] text-[#0891B2] dark:text-[#22D3EE]">
                    {pillar.step}
                  </span>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof / Live Metrics Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-white/70 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-white">
            1,200+ Alumni Mentors
          </span>
          <span className="rounded-full bg-white/70 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">
            350+ Student Startups &amp; Demos
          </span>
          <span className="rounded-full bg-white/70 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-[#059669] dark:text-[#34D399]">
            Ongoing Community Growth
          </span>
        </div>
      </aside>
    </div>
  );
}
