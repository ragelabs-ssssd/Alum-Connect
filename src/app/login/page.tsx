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
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOGIN_THEME_PALETTES } from './themes';

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

  // Locked Final Palette: 9. Clean Monochrome + Spark
  const selectedTheme = LOGIN_THEME_PALETTES[8];

  const cssVars = {
    '--primary': selectedTheme.primary,
    '--primary-hover': selectedTheme.primaryHover,
    '--accent': selectedTheme.accent,
    '--bg-main': selectedTheme.bgMain,
    '--bg-card': selectedTheme.bgCard,
    '--text-main': selectedTheme.textMain,
    '--text-muted': selectedTheme.textMuted,
    '--border-color': selectedTheme.borderColor,
  } as React.CSSProperties;

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
    <div
      style={cssVars}
      className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 flex flex-col lg:flex-row"
    >
      {/* ==================== LEFT PANEL (50% Desktop): LOGIN FORM ==================== */}
      <section className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 pb-24">
        {/* Brand Header */}
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center p-1.5 shadow-xs transition-colors duration-200">
              <img
                src="/logo.png"
                alt="Alum Connect"
                className={`h-full w-full object-contain ${
                  selectedTheme.isDark ? 'invert' : ''
                }`}
              />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-[var(--text-main)] block">
                Alum Connect
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)]">
                <GraduationCap className="w-3 h-3 text-[var(--primary)]" />
                ITER • Siksha &apos;O&apos; Anusandhan
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200"
          >
            ← Gateway
          </Link>
        </header>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Welcome back to the ecosystem
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Build products. Showcase skills. Connect with alumni.
            </p>
          </div>

          {/* Role Selector Pill */}
          <div
            className="grid grid-cols-2 gap-1 rounded-xl p-1 border border-[var(--border-color)] bg-[var(--bg-card)] transition-colors duration-200"
            role="tablist"
            aria-label="Account role"
          >
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              onClick={() => setRole('student')}
              style={
                role === 'student'
                  ? {
                      backgroundColor: selectedTheme.primary,
                      color: selectedTheme.onPrimary,
                    }
                  : undefined
              }
              className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                role === 'student'
                  ? 'shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'alumni'}
              onClick={() => setRole('alumni')}
              style={
                role === 'alumni'
                  ? {
                      backgroundColor: selectedTheme.primary,
                      color: selectedTheme.onPrimary,
                    }
                  : undefined
              }
              className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                role === 'alumni'
                  ? 'shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
                className="block text-xs font-semibold text-[var(--text-main)]"
              >
                {role === 'student' ? 'ITER Student Email' : 'Alumni Work Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[var(--text-main)]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pl-10 pr-11 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1"
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
              <label className="inline-flex items-center gap-2 cursor-pointer text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border-color)] accent-[var(--primary)]"
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
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-main)]">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: selectedTheme.primary,
                color: selectedTheme.onPrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  selectedTheme.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedTheme.primary;
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-color)]" />
            <span className="bg-[var(--bg-main)] px-3 text-[11px] font-medium text-[var(--text-muted)] whitespace-nowrap transition-colors duration-200">
              Or continue with
            </span>
            <div className="w-full border-t border-[var(--border-color)]" />
          </div>

          {/* Social / SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSsoContinue('Google')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--primary)] py-2.5 px-4 text-xs font-semibold text-[var(--text-main)] transition-all duration-200"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--primary)] py-2.5 px-4 text-xs font-semibold text-[var(--text-main)] transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
              </svg>
              LinkedIn
            </button>
          </div>

          <p className="text-center text-xs text-[var(--text-muted)] pt-1">
            New to Alum Connect?{' '}
            <Link
              href={role === 'student' ? '/student' : '/alumni'}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <footer className="text-[11px] text-[var(--text-muted)] text-center lg:text-left">
          Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
        </footer>
      </section>

      {/* ==================== RIGHT PANEL (50% Desktop): ECOSYSTEM SHOWCASE ==================== */}
      <aside
        style={{
          background: `linear-gradient(135deg, ${selectedTheme.primary} 0%, ${selectedTheme.accent} 100%)`,
        }}
        className="w-full lg:w-1/2 min-h-[540px] lg:min-h-screen p-6 sm:p-12 lg:p-16 pb-28 flex flex-col justify-between text-white relative overflow-hidden transition-all duration-200"
      >
        {/* Subtle Decorative Radial Highlights */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-20 blur-3xl bg-white"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-20 blur-3xl bg-black"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            ITER Campus-to-Industry Flywheel
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug pt-2">
            From classroom commits to verified career breakthroughs.
          </h2>
        </div>

        {/* 4 Core Pillars Flow Card */}
        <div className="relative z-10 my-8 rounded-2xl border border-white/20 bg-slate-950/35 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Ecosystem Value Flow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ECOSYSTEM_PILLARS.map((pillar) => (
              <div
                key={pillar.step}
                className="rounded-xl border border-white/15 bg-white/10 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-white">
                    {pillar.icon}
                    {pillar.title}
                  </span>
                  <span className="font-mono text-[11px] text-white/70">
                    {pillar.step}
                  </span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof / Live Metrics Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-slate-950/35 border border-white/25 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold">
            1,200+ Alumni Mentors
          </span>
          <span className="rounded-full bg-slate-950/35 border border-white/25 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold">
            350+ Student Startups &amp; Demos
          </span>
          <span className="rounded-full bg-slate-950/35 border border-white/25 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold">
            Ongoing Community Growth
          </span>
        </div>
      </aside>
    </div>
  );
}
