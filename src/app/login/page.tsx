'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../../components/ThemeToggle';
import AlumConnectLogo from '../../components/AlumConnectLogo';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../../data/alumConnectData';

type LoginRole = 'student' | 'alumni';

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

  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);

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
    <div className="font-luma-body relative min-h-dvh w-full overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(800px_500px_at_25%_20%,rgba(148,163,184,0.22)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-white flex flex-col justify-between transition-colors">
      {/* Panning Isometric Diamond Mesh Background */}
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

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-white/75 dark:bg-white/[0.06] border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1.5 shadow-xs backdrop-blur-md">
            <AlumConnectLogo className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <span className="font-luma-title text-sm sm:text-base text-[#0F172A] dark:text-white block">
              AlmaConnect
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Gateway
          </Link>
          <ThemeToggle compact />
        </div>
      </header>

      {/* Main Layout: Option 2 (60% Left Open Canvas / 40% Right Glass Dock) + Option 5 Quote Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 60%: Option 5 Alumni Hiring Story Quote + Live Campus Metrics */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/60 dark:bg-white/[0.05] backdrop-blur-md px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-[#0891B2] dark:text-[#22D3EE]">
              Alumni Hiring Story • ITER × SOA
            </span>

            <blockquote className="font-luma-title text-3xl sm:text-4xl xl:text-[42px] leading-[1.14] text-[#0F172A] dark:text-white">
              &ldquo;We stopped filtering resumes. On Alum Connect, we inspect{' '}
              <span className="text-[#0891B2] dark:text-[#22D3EE]">
                live student repos
              </span>{' '}
              and hire engineers in{' '}
              <span className="text-[#059669] dark:text-[#34D399]">48 hours.</span>&rdquo;
            </blockquote>

            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#0F172A] dark:text-white">
                Debadatta Rath
              </div>
              <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                CTO @ HyperScale Labs • ITER Batch &apos;18
              </div>
            </div>

            <div className="flex flex-wrap gap-8 pt-2 border-t border-[rgba(100,116,139,0.18)] dark:border-[rgba(226,232,240,0.14)]">
              <div>
                <div className="font-luma-title text-3xl text-[#0F172A] dark:text-white">
                  {projectCount}
                </div>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Live Campus Builds
                </div>
              </div>
              <div>
                <div className="font-luma-title text-3xl text-[#0891B2] dark:text-[#22D3EE]">
                  {dealCount}
                </div>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Active Hiring Deals
                </div>
              </div>
            </div>
          </div>

          {/* Right 40%: Frosted Glass Auth Dock */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/75 dark:bg-[#14171E]/75 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="space-y-1">
                <h1 className="font-luma-title text-2xl sm:text-[26px] leading-tight text-[#0F172A] dark:text-white">
                  Sign in to{' '}
                  <span className="text-[#0891B2] dark:text-[#22D3EE]">Alum Connect</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                  Build products. Showcase skills. Connect with ITER alumni.
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
              <form onSubmit={handleSignIn} className="space-y-3.5">
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
                      className="w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] pl-10 pr-4 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="login-password"
                      className="font-semibold text-[#0F172A] dark:text-white"
                    >
                      Password
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
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#475569] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] pl-10 pr-11 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all"
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

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#475569] dark:text-[#94A3B8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 accent-[#0891B2] dark:accent-[#22D3EE]"
                  />
                  <span>Remember me on this device</span>
                </label>

                {errorMsg && (
                  <div className="rounded-xl border border-[#0891B2]/25 dark:border-[#22D3EE]/25 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-3.5 py-2.5 text-xs text-[#0F172A] dark:text-white">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] py-2.5 px-5 text-sm font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)]" />
                <span className="px-3 text-[11px] font-medium text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                  or continue with email
                </span>
                <div className="w-full border-t border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)]" />
              </div>

              {/* Social / SSO Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSsoContinue('Google')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] hover:border-[#0891B2] dark:hover:border-[#22D3EE] py-2.5 px-4 text-xs font-semibold text-[#0F172A] dark:text-white transition-all cursor-pointer"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] hover:border-[#0891B2] dark:hover:border-[#22D3EE] py-2.5 px-4 text-xs font-semibold text-[#0F172A] dark:text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                  LinkedIn
                </button>
              </div>

              <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8]">
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
