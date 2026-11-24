'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import AlumConnectLogo from '@/components/AlumConnectLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  signInAction,
  switchDemoPersonaAction,
} from '@/modules/identity/actions';
import type { SessionUser, UserRole } from '@/types/domain';

type LoginRole = 'student' | 'alumni';

interface LoginClientProps {
  demoEnabled: boolean;
  supabaseEnabled: boolean;
  demoPersonas: SessionUser[];
}

function getRedirectTargetForRole(role: UserRole): string {
  if (role === 'dean') return '/dean';
  if (role === 'alumni') return '/alumni';
  return '/student';
}

export default function LoginClient({
  demoEnabled,
  supabaseEnabled,
  demoPersonas,
}: LoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');
  const nextPath = searchParams.get('next');

  const [role, setRole] = useState<LoginRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switchingPersonaId, setSwitchingPersonaId] = useState<string | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState(
    callbackError === 'oauth_callback_failed'
      ? 'OAuth sign-in could not be completed. Please try again or use Demo Access.'
      : '',
  );
  const [infoMsg, setInfoMsg] = useState('');

  const quickStudent =
    demoPersonas.find((p) => p.fullName === 'Ananya Dash') ??
    demoPersonas.find((p) => p.role === 'student');
  const quickVerifiedAlum =
    demoPersonas.find((p) => p.fullName === 'Debadatta Rath') ??
    demoPersonas.find(
      (p) => p.role === 'alumni' && p.verificationStatus === 'verified',
    );
  const quickPendingAlum =
    demoPersonas.find((p) => p.fullName === 'Soumyajit Mishra') ??
    demoPersonas.find(
      (p) => p.role === 'alumni' && p.verificationStatus === 'pending_review',
    );
  const quickDean =
    demoPersonas.find((p) => p.role === 'dean') ??
    demoPersonas.find((p) => p.fullName.includes('Sujit'));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (supabaseEnabled && !demoEnabled && password.length < 6) {
      setErrorMsg('Please enter your password (minimum 6 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInAction({
        email: email.trim(),
        password: password || undefined,
        role,
      });

      if (!result.ok) {
        setErrorMsg(result.error);
        return;
      }

      const safeNext =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : getRedirectTargetForRole(result.data.role);

      router.push(safeNext);
      router.refresh();
    } catch {
      setErrorMsg('Unable to sign in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (
    persona: SessionUser | undefined,
    targetRoute: string,
  ) => {
    if (!persona) return;
    setErrorMsg('');
    setInfoMsg('');
    setSwitchingPersonaId(persona.id);

    try {
      const result = await switchDemoPersonaAction(persona.id);
      if (!result.ok) {
        setErrorMsg(result.error);
        return;
      }
      router.push(targetRoute);
      router.refresh();
    } catch {
      setErrorMsg('Could not switch demo persona. Please try again.');
    } finally {
      setSwitchingPersonaId(null);
    }
  };

  const handleSsoContinue = async (provider: 'Google' | 'LinkedIn') => {
    setErrorMsg('');
    setInfoMsg('');

    if (supabaseEnabled) {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        const redirectNext = role === 'alumni' ? '/alumni' : '/student';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider === 'Google' ? 'google' : 'linkedin_oidc',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectNext)}`,
          },
        });
        if (error) {
          setErrorMsg(error.message);
        }
        return;
      }
    }

    if (demoEnabled) {
      const targetPersona =
        role === 'alumni' ? quickVerifiedAlum : quickStudent;
      if (targetPersona) {
        setInfoMsg(
          `Demo Mode: Continuing via simulated ${provider} OAuth as ${targetPersona.fullName}...`,
        );
        await handleQuickDemo(
          targetPersona,
          getRedirectTargetForRole(targetPersona.role),
        );
        return;
      }
    }

    setErrorMsg(
      `${provider} OAuth requires Supabase credentials in .env.local.`,
    );
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
      <header className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-5 flex items-center justify-between gap-4">
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

      {/* Main Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 60%: Quote + Quick Demo Access */}
          <div className="lg:col-span-7 space-y-6">
            <blockquote className="font-luma-title text-3xl sm:text-4xl xl:text-[42px] leading-[1.14] text-[#0F172A] dark:text-white">
              &ldquo;We stopped filtering resumes. On AlmaConnect, we inspect{' '}
              <span className="text-[#0891B2] dark:text-[#22D3EE]">
                live student repos
              </span>{' '}
              and hire engineers in{' '}
              <span className="text-[#059669] dark:text-[#34D399]">
                48 hours.
              </span>
              &rdquo;
            </blockquote>

            <div className="space-y-0.5">
              <div className="text-sm font-bold text-[#0F172A] dark:text-white">
                Debadatta Rath
              </div>
              <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Co-Founder &amp; CTO @ HyperScale Labs • ITER Batch &apos;16
              </div>
            </div>

            {demoEnabled && (
              <div className="rounded-3xl border border-[rgba(100,116,139,0.24)] dark:border-[rgba(226,232,240,0.18)] bg-white/75 dark:bg-[#14171E]/75 backdrop-blur-xl p-5 shadow-lg space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#0891B2]/15 dark:bg-[#22D3EE]/15 text-[#0891B2] dark:text-[#22D3EE]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                      Quick Demo Access (1-Click)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                    Signed HTTP-only session cookie • Instant role switch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={!quickStudent || switchingPersonaId !== null}
                    onClick={() => handleQuickDemo(quickStudent, '/student')}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-white/[0.04] hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-3.5 py-2.5 text-left transition-all cursor-pointer disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-8 w-8 rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          Student ({quickStudent?.fullName ?? 'Ananya Dash'})
                        </div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                          4th Year CSE • Builds &amp; Deals
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE] shrink-0" />
                  </button>

                  <button
                    type="button"
                    disabled={!quickVerifiedAlum || switchingPersonaId !== null}
                    onClick={() =>
                      handleQuickDemo(quickVerifiedAlum, '/alumni')
                    }
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-white/[0.04] hover:border-[#059669] dark:hover:border-[#34D399] px-3.5 py-2.5 text-left transition-all cursor-pointer disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          Verified Alum (
                          {quickVerifiedAlum?.fullName ?? 'Debadatta Rath'})
                        </div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                          Vouch, Post Jobs &amp; Roast
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#059669] dark:group-hover:text-[#34D399] shrink-0" />
                  </button>

                  <button
                    type="button"
                    disabled={!quickPendingAlum || switchingPersonaId !== null}
                    onClick={() =>
                      handleQuickDemo(quickPendingAlum, '/alumni')
                    }
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-white/[0.04] hover:border-amber-500 dark:hover:border-amber-400 px-3.5 py-2.5 text-left transition-all cursor-pointer disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          Pending Alum (
                          {quickPendingAlum?.fullName ?? 'Soumyajit Mishra'})
                        </div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                          Tests Verification Gate
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-amber-500 shrink-0" />
                  </button>

                  <button
                    type="button"
                    disabled={!quickDean || switchingPersonaId !== null}
                    onClick={() => handleQuickDemo(quickDean, '/dean')}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-white/[0.04] hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-3.5 py-2.5 text-left transition-all cursor-pointer disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-8 w-8 rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          Dean T&amp;P (
                          {quickDean?.fullName ?? 'Prof. Sujit Kumar Patra'})
                        </div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                          Approve Alumni &amp; Analytics
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE] shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 40%: Frosted Glass Auth Dock */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/75 dark:bg-[#14171E]/75 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="space-y-1">
                <h1 className="font-luma-title text-2xl sm:text-[26px] leading-tight text-[#0F172A] dark:text-white">
                  Sign in to{' '}
                  <span className="text-[#0891B2] dark:text-[#22D3EE]">
                    AlmaConnect
                  </span>
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
                    {role === 'student'
                      ? 'ITER Student Email'
                      : 'Alumni / Dean Email'}
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
                          ? 'ananya.dash@soa.ac.in'
                          : 'debadatta.rath@hyperscalelabs.ai'
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
                        setInfoMsg(
                          'Password reset links are sent to your registered @soa.ac.in or alumni email.',
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
                      required={supabaseEnabled && !demoEnabled}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        demoEnabled && !supabaseEnabled
                          ? 'Optional in Demo Mode'
                          : 'Enter your password'
                      }
                      className="w-full rounded-xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-white/[0.05] pl-10 pr-11 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8]/70 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 dark:focus:ring-[#22D3EE]/30 focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
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
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300">
                    {errorMsg}
                  </div>
                )}

                {infoMsg && (
                  <div className="rounded-xl border border-[#0891B2]/25 dark:border-[#22D3EE]/25 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-3.5 py-2.5 text-xs text-[#0F172A] dark:text-white">
                    {infoMsg}
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

                <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-1">
                  New to AlmaConnect?{' '}
                  <Link
                    href="/signup"
                    className="font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                  >
                    Create an account →
                  </Link>
                </p>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)]" />
                <span className="px-3 text-[11px] font-medium text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                  or continue with
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
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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
                  <svg
                    className="w-4 h-4 fill-[#0A66C2]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Glass Pill Footer */}
      <div className="sticky bottom-0 z-20 px-4 sm:px-6 pb-3 pt-1">
        <footer className="max-w-[1440px] mx-auto rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0C0E12]/78 backdrop-blur-xl px-5 py-2 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
          <span className="font-luma-title text-[#0F172A] dark:text-white">
            AlmaConnect
          </span>
          <span>
            Institute of Technical Education &amp; Research • Siksha &apos;O&apos;
            Anusandhan (Deemed to be University)
          </span>
        </footer>
      </div>
    </div>
  );
}
