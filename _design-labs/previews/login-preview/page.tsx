'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';

type ConceptId =
  | 'luma-centered'
  | 'linear-dock-right'
  | 'vercel-proof-split'
  | 'raycast-sso-first'
  | 'supabase-quote-split'
  | 'clerk-framed-card'
  | 'editorial-poster'
  | 'hiring-wall-sheet'
  | 'aurora-border-focus'
  | 'stripe-asymmetric';

const CONCEPTS: { id: ConceptId; name: string; vibe: string }[] = [
  { id: 'luma-centered', name: 'Luma Centered Glass', vibe: 'Pure centered frosted card, generous whitespace, bottom company strip' },
  { id: 'linear-dock-right', name: 'Linear Full-Height Dock', vibe: '60% open Departure Mono canvas left + 40% full-height glass dock right' },
  { id: 'vercel-proof-split', name: 'Vercel Proof-of-Work Split', vibe: 'Borderless airy form left + live PRJ-01 & Alumni Offer cards right' },
  { id: 'raycast-sso-first', name: 'Raycast SSO-First Spotlight', vibe: 'Google / LinkedIn SSO on top, clean email/password below, zero clutter' },
  { id: 'supabase-quote-split', name: 'Supabase Founder Quote Split', vibe: 'Spacious left form + real CTO alumni testimonial quote right' },
  { id: 'clerk-framed-card', name: 'Clerk Dual-Layer Framed Card', vibe: 'Elevated outer glass frame with crisp header band and clean footer' },
  { id: 'editorial-poster', name: 'Typographic Poster Split', vibe: 'Bold stacked BUILD. SHIP. CONNECT. poster left + borderless form right' },
  { id: 'hiring-wall-sheet', name: 'Hiring Wall + Raised Auth Card', vibe: 'Top hiring companies showcase + sleek raised Sign-In card below' },
  { id: 'aurora-border-focus', name: 'Luminous Border Focus Card', vibe: 'Single centered card with subtle cyan-emerald edge glow, zero distractions' },
  { id: 'stripe-asymmetric', name: 'Stripe Asymmetric Editorial', vibe: 'Top-left editorial headline + bottom-right elevated glass form' },
];

function FullForm({
  isDark,
  role,
  setRole,
  ssoFirst = false,
  bordered = true,
}: {
  isDark: boolean;
  role: 'student' | 'alumni';
  setRole: (r: 'student' | 'alumni') => void;
  ssoFirst?: boolean;
  bordered?: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const border = isDark ? 'border-[rgba(226,232,240,0.16)]' : 'border-[rgba(100,116,139,0.22)]';
  const muted = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const inputBg = isDark ? 'bg-white/[0.05] text-white' : 'bg-white/85 text-[#0F172A]';
  const accentText = isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]';

  const ssoBlock = (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border ${border} ${inputBg} py-2.5 px-4 text-xs font-semibold hover:opacity-90 transition-opacity`}
      >
        Google
      </button>
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border ${border} ${inputBg} py-2.5 px-4 text-xs font-semibold hover:opacity-90 transition-opacity`}
      >
        LinkedIn
      </button>
    </div>
  );

  const divider = (
    <div className="relative flex items-center justify-center">
      <div className={`w-full border-t ${border}`} />
      <span className={`px-3 text-[11px] font-medium ${muted} whitespace-nowrap`}>
        or continue with email
      </span>
      <div className={`w-full border-t ${border}`} />
    </div>
  );

  return (
    <div
      className={
        bordered
          ? `rounded-3xl border ${border} ${
              isDark ? 'bg-[#14171E]/75' : 'bg-white/75'
            } backdrop-blur-xl p-7 sm:p-8 shadow-xl space-y-5`
          : 'space-y-5'
      }
    >
      <div className="space-y-1.5">
        <h1 className="font-luma-title text-2xl sm:text-[26px] leading-tight">
          Sign in to <span className={accentText}>Alum Connect</span>
        </h1>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Build products. Showcase skills. Connect with ITER alumni.
        </p>
      </div>

      <div
        className={`grid grid-cols-2 gap-1 rounded-xl p-1 border ${border} ${
          isDark ? 'bg-white/[0.04]' : 'bg-slate-900/[0.04]'
        }`}
      >
        {(['student', 'alumni'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg py-2 text-xs font-semibold capitalize transition-all ${
              role === r
                ? isDark
                  ? 'bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] shadow-xs'
                  : 'bg-[#0F172A] text-white shadow-xs'
                : muted
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {ssoFirst && (
        <>
          {ssoBlock}
          {divider}
        </>
      )}

      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold">
            {role === 'student' ? 'ITER Student Email' : 'Alumni Work Email'}
          </label>
          <div className="relative">
            <Mail className={`w-4 h-4 ${muted} absolute left-3.5 top-1/2 -translate-y-1/2`} />
            <input
              readOnly
              value={role === 'student' ? 'aarav.mohanty@iter.ac.in' : 'debadatta@hyperscale.ai'}
              className={`w-full rounded-xl border ${border} ${inputBg} pl-10 pr-4 py-2.5 text-sm outline-none`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold">Password</label>
            <span className={`font-semibold ${accentText}`}>Forgot?</span>
          </div>
          <div className="relative">
            <Lock className={`w-4 h-4 ${muted} absolute left-3.5 top-1/2 -translate-y-1/2`} />
            <input
              readOnly
              type={showPw ? 'text' : 'password'}
              value="••••••••••••"
              className={`w-full rounded-xl border ${border} ${inputBg} pl-10 pr-10 py-2.5 text-sm outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 text-sm font-semibold transition-all"
        style={{
          background: isDark ? 'linear-gradient(90deg, #22D3EE 0%, #34D399 100%)' : '#0F172A',
          color: isDark ? '#041E24' : '#FFFFFF',
        }}
      >
        Sign In <ArrowRight className="w-4 h-4" />
      </button>

      {!ssoFirst && (
        <>
          {divider}
          {ssoBlock}
        </>
      )}
    </div>
  );
}

export default function LoginPreviewPage() {
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [role, setRole] = useState<'student' | 'alumni'>('student');

  const active = CONCEPTS[idx];
  const isDark = mode === 'dark';
  const c1 = isDark ? '#22D3EE' : '#0891B2';
  const c2 = isDark ? '#34D399' : '#059669';
  const border = isDark ? 'border-[rgba(226,232,240,0.16)]' : 'border-[rgba(100,116,139,0.22)]';
  const card = isDark ? 'bg-[#14171E]/72' : 'bg-white/75';
  const muted = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const accentText = isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]';

  return (
    <div className="min-h-dvh flex flex-col bg-[#FAFAFA] text-[#18181B]">
      {/* Sticky Option Switcher Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/95 backdrop-blur px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-[#18181B] text-white px-2.5 py-0.5 text-xs font-bold">
              {idx + 1} / {CONCEPTS.length}
            </span>
            <div>
              <div className="text-sm font-bold leading-tight">{active.name}</div>
              <div className="text-[11px] text-[#52525B]">{active.vibe}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-1 rounded-full bg-zinc-100 p-1">
              {CONCEPTS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`h-6 w-6 rounded-full text-[11px] font-bold transition-colors ${
                    idx === i ? 'bg-[#18181B] text-white' : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + CONCEPTS.length) % CONCEPTS.length)}
              className="rounded-full border border-[#E4E4E7] bg-white p-1.5 hover:bg-zinc-50"
              aria-label="Previous option"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % CONCEPTS.length)}
              className="rounded-full border border-[#E4E4E7] bg-white p-1.5 hover:bg-zinc-50"
              aria-label="Next option"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Scale Live Canvas */}
      <div
        className={`font-luma-body relative flex-1 overflow-hidden flex flex-col justify-between transition-colors ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
        style={{
          background: isDark
            ? 'radial-gradient(800px 500px at 25% 20%, rgba(148,163,184,0.22) 0%, transparent 60%), linear-gradient(135deg, #07080A 0%, #14171F 55%, #090A0E 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute -inset-12"
          style={{
            opacity: isDark ? 0.18 : 0.3,
            backgroundImage: `linear-gradient(30deg, ${c1} 1px, transparent 1px), linear-gradient(150deg, ${c2} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        {/* Top Bar inside preview */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap className={`w-5 h-5 ${accentText}`} />
            <span className="font-luma-title text-sm sm:text-base">Alum Connect</span>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${muted}`}>
            <ArrowLeft className="w-3.5 h-3.5" /> Gateway
          </span>
        </div>

        {/* Concept Body */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          {(active.id === 'luma-centered' || active.id === 'raycast-sso-first') && (
            <div className="w-full max-w-md">
              <FullForm
                isDark={isDark}
                role={role}
                setRole={setRole}
                ssoFirst={active.id === 'raycast-sso-first'}
              />
            </div>
          )}

          {active.id === 'linear-dock-right' && (
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className={`inline-flex rounded-full border ${border} px-3 py-1 text-xs font-semibold ${accentText}`}>
                  ITER • Siksha &apos;O&apos; Anusandhan
                </span>
                <h2 className="font-luma-title text-4xl sm:text-5xl leading-[1.1]">
                  A living graph of campus <span className={accentText}>engineering talent.</span>
                </h2>
                <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${muted}`}>
                  Sign in to publish live builds, request 5-minute architecture roasts, and connect directly with hiring alumni.
                </p>
                <div className="flex gap-6 pt-2">
                  <div>
                    <div className="font-luma-title text-3xl">50</div>
                    <div className={`text-xs ${muted}`}>Live Campus Builds</div>
                  </div>
                  <div>
                    <div className={`font-luma-title text-3xl ${accentText}`}>32</div>
                    <div className={`text-xs ${muted}`}>Active Hiring Deals</div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <FullForm isDark={isDark} role={role} setRole={setRole} />
              </div>
            </div>
          )}

          {active.id === 'vercel-proof-split' && (
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <FullForm isDark={isDark} role={role} setRole={setRole} bordered={false} />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div className={`rounded-3xl border ${border} ${card} backdrop-blur-xl p-6 flex items-center justify-between`}>
                  <div className="space-y-1">
                    <span className={`text-[11px] font-mono ${accentText}`}>FEATURED BUILD • PRJ-01</span>
                    <div className="font-luma-title text-lg">Distributed Raft KV Store</div>
                    <div className={`text-xs ${muted}`}>Aarav Mohanty (CSE &apos;26) • Endorsed by HyperScale Labs</div>
                  </div>
                  <BadgeCheck className={`w-6 h-6 ${accentText} shrink-0`} />
                </div>
                <div className={`rounded-3xl border ${border} ${card} backdrop-blur-xl p-6 flex items-center justify-between`}>
                  <div className="space-y-1">
                    <span className={`text-[11px] font-mono ${accentText}`}>VERIFIED OFFER • OFF-01</span>
                    <div className="font-luma-title text-lg">₹28 LPA PPO • Backend Systems</div>
                    <div className={`text-xs ${muted}`}>Referred by Soumya Ranjan Panigrahi (Google)</div>
                  </div>
                  <Sparkles className={`w-6 h-6 ${accentText} shrink-0`} />
                </div>
              </div>
            </div>
          )}

          {active.id === 'supabase-quote-split' && (
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <FullForm isDark={isDark} role={role} setRole={setRole} bordered={false} />
              </div>
              <div className={`lg:col-span-7 rounded-3xl border ${border} ${card} backdrop-blur-xl p-8 sm:p-10 space-y-6`}>
                <span className={`text-xs font-mono uppercase tracking-wider ${accentText}`}>Alumni Hiring Story</span>
                <blockquote className="font-luma-title text-2xl sm:text-3xl leading-snug">
                  &ldquo;We stopped filtering resumes. On Alum Connect, we inspect live student repos and hire engineers in 48 hours.&rdquo;
                </blockquote>
                <div className="pt-2">
                  <div className="text-sm font-bold">Debadatta Rath</div>
                  <div className={`text-xs ${muted}`}>CTO @ HyperScale Labs • ITER Batch &apos;18</div>
                </div>
              </div>
            </div>
          )}

          {active.id === 'clerk-framed-card' && (
            <div className={`w-full max-w-md rounded-3xl border ${border} ${card} backdrop-blur-xl p-2 shadow-2xl`}>
              <div className="rounded-2xl p-6 sm:p-7">
                <FullForm isDark={isDark} role={role} setRole={setRole} bordered={false} />
              </div>
              <div className={`border-t ${border} px-6 py-3.5 text-center text-xs ${muted}`}>
                Secured by ITER Proof-of-Work Identity
              </div>
            </div>
          )}

          {active.id === 'editorial-poster' && (
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-2">
                <div className="font-luma-title text-5xl sm:text-6xl leading-[1.02]">BUILD.</div>
                <div className={`font-luma-title text-5xl sm:text-6xl leading-[1.02] ${accentText}`}>SHIP.</div>
                <div className="font-luma-title text-5xl sm:text-6xl leading-[1.02]">CONNECT.</div>
                <p className={`text-sm pt-4 max-w-md ${muted}`}>
                  The proof-of-work network connecting ITER engineering students directly with hiring alumni.
                </p>
              </div>
              <div className="lg:col-span-6 max-w-md w-full mx-auto">
                <FullForm isDark={isDark} role={role} setRole={setRole} bordered={false} />
              </div>
            </div>
          )}

          {active.id === 'hiring-wall-sheet' && (
            <div className="max-w-4xl w-full space-y-6">
              <div className="text-center space-y-2">
                <span className={`text-xs font-mono uppercase ${accentText}`}>Alumni Reviewing &amp; Hiring From</span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {HIRING_COMPANIES.slice(0, 8).map((c) => (
                    <span key={c.name} className={`rounded-full border ${border} ${card} px-3.5 py-1 text-xs font-semibold`}>
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="max-w-md mx-auto">
                <FullForm isDark={isDark} role={role} setRole={setRole} />
              </div>
            </div>
          )}

          {active.id === 'aurora-border-focus' && (
            <div
              className="w-full max-w-md rounded-3xl p-[1.5px] shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c2}, transparent 75%)` }}
            >
              <div className={`rounded-[22px] ${isDark ? 'bg-[#0B0F17]/95' : 'bg-white/95'} backdrop-blur-xl p-7 sm:p-8`}>
                <FullForm isDark={isDark} role={role} setRole={setRole} bordered={false} />
              </div>
            </div>
          )}

          {active.id === 'stripe-asymmetric' && (
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-6 pb-4 space-y-3">
                <h2 className="font-luma-title text-4xl sm:text-5xl leading-[1.08]">
                  Welcome back to <span className={accentText}>ITER&apos;s</span> talent graph.
                </h2>
                <p className={`text-sm ${muted}`}>
                  50 live student builds • 14 verified alumni mentors • 32 active openings.
                </p>
              </div>
              <div className="lg:col-span-6 max-w-md w-full lg:ml-auto">
                <FullForm isDark={isDark} role={role} setRole={setRole} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={`relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pb-5 flex items-center justify-between text-[11px] ${muted}`}>
          <span>Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan</span>
          <span className="font-mono">Option {idx + 1}: {active.name}</span>
        </div>
      </div>
    </div>
  );
}
