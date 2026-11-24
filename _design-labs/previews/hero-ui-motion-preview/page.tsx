'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Moon, RotateCcw, Sun } from 'lucide-react';
import {
  ALUMNI_DATA,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
} from '../../data/alumConnectData';

type UiAnimId =
  | 'live-counters'
  | 'terminal-cursor'
  | 'sync-packet'
  | 'verified-shimmer'
  | 'border-beam'
  | 'cta-glint'
  | 'live-heartbeat'
  | 'floating-tiles'
  | 'matrix-decode'
  | 'text-shimmer'
  | 'mini-heatmap'
  | 'deal-pulse'
  | 'cursor-spotlight'
  | 'stagger-cascade'
  | 'verified-orbit'
  | 'git-live-pill'
  | 'mini-sparkline'
  | 'alternating-glow'
  | 'cta-halo'
  | 'flagship-suite';

const UI_ANIM_OPTIONS: { id: UiAnimId; name: string; desc: string }[] = [
  { id: 'live-counters', name: 'Live Telemetry Count-Up (0 → 50 / 32)', desc: 'Numbers smoothly roll up to real campus totals on load or replay.' },
  { id: 'terminal-cursor', name: 'Departure Terminal Cursor (▊)', desc: 'Crisp monospace block cursor blinking after "engineering talent."' },
  { id: 'sync-packet', name: 'Students ↔ Alumni ↔ Offers Signal', desc: 'Glowing cyan-emerald pulse travelling across the Proof-of-Work sync row.' },
  { id: 'verified-shimmer', name: '100% Verified Sheen Sweep', desc: 'Periodic luminous shimmer gliding across the 100% Verified pill.' },
  { id: 'border-beam', name: 'Linear-Style Telemetry Border Glow', desc: 'Crisp cyan/emerald highlight softly tracing the 50 & 32 card borders.' },
  { id: 'cta-glint', name: 'Join the Graph Glint + Arrow Nudge', desc: 'Diagonal light sheen + subtle → motion on the primary CTA.' },
  { id: 'live-heartbeat', name: 'Real-Time Sync Live Beacon', desc: 'Pulsing emerald-cyan live status dot beside Real-Time Proof-of-Work Sync.' },
  { id: 'floating-tiles', name: 'Staggered Levitating Telemetry Tiles', desc: 'The 50, 32, and Sync cards gently breathe vertically in staggered phase.' },
  { id: 'matrix-decode', name: 'Departure Mono Scramble Decode', desc: 'Brief character-scramble decode on "engineering talent." (click Replay).' },
  { id: 'text-shimmer', name: 'Flowing Cyan-Emerald Heading Gradient', desc: 'Smooth gradient shimmer sweeping through "engineering talent."' },
  { id: 'mini-heatmap', name: 'GitHub Commit Heatmap Twinkle (50)', desc: 'Tiny 5×3 commit squares gently twinkling inside the Repositories card.' },
  { id: 'deal-pulse', name: 'Marketplace Velocity Pulse (32)', desc: 'Subtle live hiring badge & upward pulse next to 32 Deals & Paid Bounties.' },
  { id: 'cursor-spotlight', name: 'Interactive Mouse Spotlight Glow', desc: 'Move your cursor over this card to cast a cyan-chrome radial spotlight.' },
  { id: 'stagger-cascade', name: 'Staggered Spring Entrance Cascade', desc: 'Headline → Copy → CTAs → Telemetry glide in sequentially (click Replay).' },
  { id: 'verified-orbit', name: 'Orbiting Ring on 100% Verified', desc: 'Fine glowing arc rotating around the Verified badge.' },
  { id: 'git-live-pill', name: 'Live Campus Graph Status Pulse', desc: 'Minimalist live telemetry pulse dot on the Repositories & Marketplace headers.' },
  { id: 'mini-sparkline', name: 'Animated Velocity Sparkline (32)', desc: 'Tiny 6-bar cyan-emerald sparkline pulsing inside the Marketplace tile.' },
  { id: 'alternating-glow', name: 'Two-Sided Marketplace Alternating Focus', desc: 'Soft highlight alternates between Repositories (50) and Marketplace (32).' },
  { id: 'cta-halo', name: 'Expanding Halo on Join the Graph', desc: 'Primary CTA emits a soft cyan-emerald ripple ring every few seconds.' },
  { id: 'flagship-suite', name: 'Flagship Living Graph Suite (Combined)', desc: 'Terminal cursor + count-up + CTA glint + Verified shimmer + sync pulse.' },
];

function AnimatedHeroCard({
  id,
  isDark,
  projectCount,
  dealCount,
  replayKey,
}: {
  id: UiAnimId;
  isDark: boolean;
  projectCount: number;
  dealCount: number;
  replayKey: number;
}) {
  const [countProj, setCountProj] = useState(projectCount);
  const [countDeal, setCountDeal] = useState(dealCount);
  const [decodedText, setDecodedText] = useState('engineering talent.');
  const [spot, setSpot] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  // Count-up animation for live-counters and flagship-suite
  useEffect(() => {
    if (id !== 'live-counters' && id !== 'flagship-suite') {
      setCountProj(projectCount);
      setCountDeal(dealCount);
      return;
    }
    let frame = 0;
    const totalFrames = 28;
    const timer = setInterval(() => {
      frame++;
      const p = frame / totalFrames;
      const ease = 1 - Math.pow(1 - p, 3);
      setCountProj(Math.round(projectCount * ease));
      setCountDeal(Math.round(dealCount * ease));
      if (frame >= totalFrames) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [id, projectCount, dealCount, replayKey]);

  // Matrix scramble decode for matrix-decode
  useEffect(() => {
    if (id !== 'matrix-decode') {
      setDecodedText('engineering talent.');
      return;
    }
    const target = 'engineering talent.';
    const chars = '01_/<>{}λ#$%';
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDecodedText(
        target
          .split('')
          .map((ch, idx) => {
            if (ch === ' ') return ' ';
            if (idx < step) return ch;
            return chars[(idx + step * 3) % chars.length];
          })
          .join('')
      );
      if (step >= target.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, [id, replayKey]);

  const c1 = isDark ? '#22D3EE' : '#0891B2';
  const c2 = isDark ? '#34D399' : '#059669';

  return (
    <div
      onMouseMove={
        id === 'cursor-spotlight'
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSpot({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
                active: true,
              });
            }
          : undefined
      }
      onMouseLeave={
        id === 'cursor-spotlight' ? () => setSpot((s) => ({ ...s, active: false })) : undefined
      }
      className={`font-luma-body relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-colors ${
        isDark
          ? 'border-[rgba(226,232,240,0.18)] text-white'
          : 'border-[rgba(100,116,139,0.22)] text-[#0F172A]'
      }`}
      style={{
        background: isDark
          ? 'radial-gradient(800px 500px at 25% 20%, rgba(148,163,184,0.22) 0%, transparent 60%), linear-gradient(135deg, #07080A 0%, #14171F 55%, #090A0E 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      }}
    >
      {/* Selected Option 18 Panning Isometric Diamond Mesh Background */}
      <div
        className="pointer-events-none absolute -inset-12 animate-iso-bg"
        style={{
          opacity: isDark ? 0.2 : 0.32,
          backgroundImage: `linear-gradient(30deg, ${c1} 1px, transparent 1px), linear-gradient(150deg, ${c2} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Interactive Spotlight for #13 */}
      {id === 'cursor-spotlight' && spot.active && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, ${
              isDark ? 'rgba(34,211,238,0.16)' : 'rgba(8,145,178,0.14)'
            }, transparent 70%)`,
          }}
        />
      )}

      <div
        key={`${id}-${replayKey}`}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-3">
          <h3
            className={`font-luma-title text-2xl sm:text-4xl leading-[1.12] ${
              id === 'stagger-cascade' ? 'anim-enter-1' : ''
            }`}
          >
            A living graph of campus{' '}
            <span
              className={
                id === 'text-shimmer'
                  ? 'bg-clip-text text-transparent anim-text-flow'
                  : isDark
                  ? 'text-[#22D3EE]'
                  : 'text-[#0891B2]'
              }
              style={
                id === 'text-shimmer'
                  ? {
                      backgroundImage: `linear-gradient(90deg, ${c1}, ${c2}, ${
                        isDark ? '#FFFFFF' : '#0F172A'
                      }, ${c1})`,
                      backgroundSize: '200% auto',
                    }
                  : undefined
              }
            >
              {decodedText}
            </span>
            {(id === 'terminal-cursor' || id === 'flagship-suite') && (
              <span
                className="inline-block w-[0.55ch] h-[0.9em] align-middle ml-1.5 anim-blink-cursor"
                style={{ background: c2 }}
              />
            )}
          </h3>

          <p
            className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            } ${id === 'stagger-cascade' ? 'anim-enter-2' : ''}`}
          >
            Connecting{' '}
            <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>
              {projectCount} verified student builds
            </strong>{' '}
            directly to alumni mentors, 5-minute architecture roasts, and{' '}
            <strong className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>
              {dealCount} active hiring deals
            </strong>{' '}
            across ITER.
          </p>

          <div
            className={`flex flex-wrap items-center gap-2.5 pt-1 ${
              id === 'stagger-cascade' ? 'anim-enter-3' : ''
            }`}
          >
            <div className="relative inline-flex">
              {id === 'cta-halo' && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-full anim-halo"
                  style={{ border: `2px solid ${c1}` }}
                />
              )}
              <span
                className="relative overflow-hidden inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, #22D3EE 0%, #34D399 100%)'
                    : '#0F172A',
                  color: isDark ? '#041E24' : '#FFFFFF',
                }}
              >
                {(id === 'cta-glint' || id === 'flagship-suite') && (
                  <span className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-white/35 anim-glint" />
                )}
                <span>Join the Graph</span>
                <ArrowRight
                  className={`w-3.5 h-3.5 ${
                    id === 'cta-glint' || id === 'cta-halo' || id === 'flagship-suite'
                      ? 'anim-nudge'
                      : ''
                  }`}
                />
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold ${
                isDark
                  ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06] text-white'
                  : 'border-[rgba(100,116,139,0.20)] bg-white/65 text-[#0F172A]'
              }`}
            >
              Explore Talent Nodes
            </span>
          </div>
        </div>

        {/* Right Column Telemetry */}
        <div
          className={`lg:col-span-5 grid grid-cols-2 gap-3 ${
            id === 'stagger-cascade' ? 'anim-enter-4' : ''
          }`}
        >
          {/* Tile 1: Repositories */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md ${
              isDark
                ? 'border-[rgba(226,232,240,0.18)] bg-[#14171E]/68'
                : 'border-[rgba(100,116,139,0.22)] bg-white/65'
            } ${id === 'floating-tiles' ? 'anim-float-1' : ''} ${
              id === 'border-beam' ? 'anim-border-cyan' : ''
            } ${id === 'alternating-glow' ? 'anim-alt-1' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-[10px] font-mono uppercase ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                Repositories
              </div>
              {id === 'git-live-pill' && (
                <span className="h-2 w-2 rounded-full bg-[#34D399] anim-ping-dot" />
              )}
            </div>
            <div className="flex items-end justify-between mt-1">
              <div className="font-luma-title text-2xl">{countProj}</div>
              {id === 'mini-heatmap' && (
                <div className="grid grid-cols-5 gap-0.5 pb-1">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-[1px]"
                      style={{
                        background: i % 3 === 0 ? c1 : c2,
                        animation: 'ui-twinkle 2.6s ease-in-out infinite',
                        animationDelay: `${i * 0.16}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
              Live Campus Builds
            </div>
          </div>

          {/* Tile 2: Marketplace */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md ${
              isDark
                ? 'border-[rgba(226,232,240,0.18)] bg-[#14171E]/68'
                : 'border-[rgba(100,116,139,0.22)] bg-white/65'
            } ${id === 'floating-tiles' ? 'anim-float-2' : ''} ${
              id === 'border-beam' ? 'anim-border-emerald' : ''
            } ${id === 'alternating-glow' ? 'anim-alt-2' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-[10px] font-mono uppercase ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                Marketplace
              </div>
              {id === 'deal-pulse' && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full anim-soft-pulse"
                  style={{ background: `${c2}22`, color: c2 }}
                >
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-end justify-between mt-1">
              <div
                className={`font-luma-title text-2xl ${
                  isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'
                }`}
              >
                {countDeal}
              </div>
              {id === 'mini-sparkline' && (
                <div className="flex items-end gap-0.5 h-5 pb-0.5">
                  {[50, 80, 40, 95, 65, 90].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${h}%`,
                        background: i % 2 === 0 ? c1 : c2,
                        transformOrigin: 'bottom',
                        animation: `ui-eq 1.6s ease-in-out infinite`,
                        animationDelay: `${i * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
              Deals &amp; Paid Bounties
            </div>
          </div>

          {/* Tile 3: Proof-of-Work Sync */}
          <div
            className={`col-span-2 relative overflow-hidden rounded-2xl border px-4 py-3 flex items-center justify-between backdrop-blur-md ${
              isDark
                ? 'border-[rgba(226,232,240,0.18)] bg-[#14171E]/68'
                : 'border-[rgba(100,116,139,0.22)] bg-white/65'
            } ${id === 'floating-tiles' ? 'anim-float-3' : ''}`}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold">
                {id === 'live-heartbeat' && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
                  </span>
                )}
                <span>Real-Time Proof-of-Work Sync</span>
              </div>
              <div
                className={`relative text-[11px] mt-0.5 ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                {STUDENTS_DATA.length} Students ↔ {ALUMNI_DATA.length} Alumni ↔{' '}
                {OFFERS_DATA.length} Offers
                {(id === 'sync-packet' || id === 'flagship-suite') && (
                  <span
                    className="block h-[2px] w-10 rounded-full mt-1 anim-packet"
                    style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
                  />
                )}
              </div>
            </div>

            <span
              className={`relative overflow-hidden inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                isDark
                  ? 'bg-[#22D3EE]/15 border-[#22D3EE]/30 text-[#22D3EE]'
                  : 'bg-[#0891B2]/10 border-[#0891B2]/25 text-[#0891B2]'
              }`}
            >
              {(id === 'verified-shimmer' || id === 'flagship-suite') && (
                <span className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-white/30 anim-glint" />
              )}
              <CheckCircle2
                className={`w-3 h-3 ${id === 'verified-orbit' ? 'anim-spin-icon' : ''}`}
              />
              <span>100% Verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroUiMotionPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [replayKey, setReplayKey] = useState(0);
  const isDark = mode === 'dark';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <style>{`
        @keyframes iso-pan { 0% { transform: translate(0,0); } 100% { transform: translate(48px,48px); } }
        .animate-iso-bg { animation: iso-pan 10s linear infinite; }

        @keyframes blink-cursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .anim-blink-cursor { animation: blink-cursor 1s steps(1) infinite; }

        @keyframes glint-sweep { 0% { transform: translateX(-180%) skewX(-12deg); } 45%, 100% { transform: translateX(340%) skewX(-12deg); } }
        .anim-glint { animation: glint-sweep 3.4s ease-in-out infinite; }

        @keyframes arrow-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
        .anim-nudge { animation: arrow-nudge 1.8s ease-in-out infinite; }

        @keyframes packet-slide { 0%, 100% { transform: translateX(0); opacity: 0.4; } 50% { transform: translateX(130px); opacity: 1; } }
        .anim-packet { animation: packet-slide 2.8s ease-in-out infinite; }

        @keyframes text-flow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        .anim-text-flow { animation: text-flow 4s linear infinite; }

        @keyframes float-tile { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        .anim-float-1 { animation: float-tile 3.6s ease-in-out infinite; }
        .anim-float-2 { animation: float-tile 3.6s ease-in-out infinite 0.5s; }
        .anim-float-3 { animation: float-tile 3.6s ease-in-out infinite 1s; }

        @keyframes border-cyan { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); } 50% { box-shadow: 0 0 18px 0 rgba(34,211,238,0.28); } }
        .anim-border-cyan { animation: border-cyan 3s ease-in-out infinite; }
        @keyframes border-emerald { 0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); } 50% { box-shadow: 0 0 18px 0 rgba(52,211,153,0.28); } }
        .anim-border-emerald { animation: border-emerald 3s ease-in-out infinite 1.2s; }

        @keyframes ui-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.95; } }
        @keyframes ui-eq { 0%, 100% { transform: scaleY(0.45); } 50% { transform: scaleY(1); } }
        @keyframes soft-pulse { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
        .anim-soft-pulse { animation: soft-pulse 1.8s ease-in-out infinite; }

        @keyframes spin-icon { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .anim-spin-icon { animation: spin-icon 6s linear infinite; }

        @keyframes alt-glow { 0%, 45%, 100% { border-color: rgba(226,232,240,0.18); } 20% { border-color: #22D3EE; } }
        .anim-alt-1 { animation: alt-glow 4s ease-in-out infinite; }
        .anim-alt-2 { animation: alt-glow 4s ease-in-out infinite 2s; }

        @keyframes halo-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.16, 1.38); opacity: 0; } }
        .anim-halo { animation: halo-ring 2.6s ease-out infinite; }

        @keyframes enter-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .anim-enter-1 { animation: enter-up 0.45s ease-out both; }
        .anim-enter-2 { animation: enter-up 0.45s ease-out 0.1s both; }
        .anim-enter-3 { animation: enter-up 0.45s ease-out 0.2s both; }
        .anim-enter-4 { animation: enter-up 0.5s ease-out 0.3s both; }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              20 Creative UI Micro-Animations Inside Your Exact Hero Structure (Local Review)
            </h1>
            <p className="text-xs text-[#52525B]">
              Built on your Liquid Chrome + Cyan/Emerald + Panning Isometric Mesh hero. Toggle Light/Dark or Replay, then pick your favorite (1–20)!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white hover:bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-800"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay
            </button>
            <button
              type="button"
              onClick={() => setMode('light')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                !isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        {UI_ANIM_OPTIONS.map((opt, idx) => (
          <section key={opt.id} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white shrink-0">
                {idx + 1}
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold">{opt.name}</h2>
                <p className="text-xs text-[#52525B]">{opt.desc}</p>
              </div>
            </div>

            <AnimatedHeroCard
              id={opt.id}
              isDark={isDark}
              projectCount={projectCount}
              dealCount={dealCount}
              replayKey={replayKey}
            />
          </section>
        ))}
      </main>
    </div>
  );
}
