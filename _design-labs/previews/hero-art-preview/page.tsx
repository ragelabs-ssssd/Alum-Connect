'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Moon, Sun } from 'lucide-react';
import {
  ALUMNI_DATA,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
} from '../../data/alumConnectData';

type HeroArtId =
  | 'pure-chrome'
  | 'glass-shards'
  | 'contour-waves'
  | 'iso-cubes'
  | 'orbit-arcs'
  | 'pixel-cascade'
  | 'caustic-ribbon'
  | 'micro-crosshairs'
  | 'vertical-bars'
  | 'origami-fold'
  | 'stipple-spotlight'
  | 'sine-mesh';

const HERO_ART_OPTIONS: { id: HeroArtId; name: string; desc: string }[] = [
  {
    id: 'pure-chrome',
    name: 'Pure Liquid Chrome (No Lines/Dots)',
    desc: 'Ultra-clean editorial hero with only the sculptural chrome reflection sweep.',
  },
  {
    id: 'glass-shards',
    name: 'Translucent Diagonal Glass Shards',
    desc: 'Crisp angled glass planes catching cyan & emerald light.',
  },
  {
    id: 'contour-waves',
    name: 'Topographic Elevation Contours',
    desc: 'Smooth curved elevation lines behind the telemetry cards.',
  },
  {
    id: 'iso-cubes',
    name: 'Isometric Engineering Wireframe',
    desc: 'Minimal architectural isometric grid in the corner — zero random dots.',
  },
  {
    id: 'orbit-arcs',
    name: 'Concentric Orbit Arcs',
    desc: 'Clean partial circular arcs framing the right-hand telemetry.',
  },
  {
    id: 'pixel-cascade',
    name: 'Stepped Pixel Cascade (Departure Harmony)',
    desc: 'Subtle pixel-mosaic blocks echoing the Departure Mono heading font.',
  },
  {
    id: 'caustic-ribbon',
    name: 'Glowing Caustic Silk Ribbon',
    desc: 'Dual-tone cyan-to-emerald ribbon sweeping smoothly across the hero.',
  },
  {
    id: 'micro-crosshairs',
    name: 'Micro-Drafting Crosshairs (+)',
    desc: 'Ultra-faint architectural + registration marks with hairline precision.',
  },
  {
    id: 'vertical-bars',
    name: 'Vertical Telemetry Light Bars',
    desc: 'Soft vertical metric bars fading upward behind the telemetry tiles.',
  },
  {
    id: 'origami-fold',
    name: 'Layered Origami Fold',
    desc: 'Clean diagonal light-and-shadow plane splitting the hero subtly.',
  },
  {
    id: 'stipple-spotlight',
    name: 'Luma Stippled Spotlight (Zero Vectors)',
    desc: 'Pure radial cyan-chrome spotlight + fine grain, zero vector geometry.',
  },
  {
    id: 'sine-mesh',
    name: 'Kinetic Sine-Wave Mesh',
    desc: 'Multi-strand smooth harmonic curves along the lower hero canvas.',
  },
];

function HeroArtSvg({ art, isDark }: { art: HeroArtId; isDark: boolean }) {
  const c1 = isDark ? '#22D3EE' : '#0891B2';
  const c2 = isDark ? '#34D399' : '#059669';
  const subtle = isDark ? '#CBD5E1' : '#64748B';

  if (art === 'pure-chrome') return null;

  if (art === 'stipple-spotlight') {
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(520px 320px at 78% 38%, rgba(34,211,238,0.16) 0%, transparent 70%)'
            : 'radial-gradient(520px 320px at 78% 38%, rgba(8,145,178,0.12) 0%, transparent 70%)',
        }}
      />
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 420"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {art === 'glass-shards' && (
        <>
          <polygon points="740,0 960,0 790,420 570,420" fill={c1} fillOpacity={isDark ? 0.08 : 0.06} />
          <polygon points="910,0 1120,0 950,420 740,420" fill={c2} fillOpacity={isDark ? 0.07 : 0.05} />
          <line x1="740" y1="0" x2="570" y2="420" stroke={c1} strokeOpacity="0.28" strokeWidth="1.2" />
          <line x1="910" y1="0" x2="740" y2="420" stroke={c2} strokeOpacity="0.22" strokeWidth="1.2" />
        </>
      )}

      {art === 'contour-waves' && (
        <>
          <ellipse cx="960" cy="210" rx="190" ry="120" stroke={c1} strokeOpacity="0.22" strokeWidth="1.2" />
          <ellipse cx="960" cy="210" rx="280" ry="175" stroke={c2} strokeOpacity="0.18" strokeWidth="1.2" />
          <ellipse cx="960" cy="210" rx="380" ry="235" stroke={subtle} strokeOpacity="0.16" strokeWidth="1" />
        </>
      )}

      {art === 'iso-cubes' && (
        <>
          {[0, 1, 2].map((i) => {
            const x = 860 + i * 90;
            const y = 130 + (i % 2) * 70;
            return (
              <g key={i} opacity={isDark ? 0.24 : 0.16}>
                <polygon points={`${x},${y - 40} ${x + 42},${y - 18} ${x},${y + 4} ${x - 42},${y - 18}`} stroke={c1} strokeWidth="1.2" />
                <polygon points={`${x - 42},${y - 18} ${x},${y + 4} ${x},${y + 52} ${x - 42},${y + 30}`} stroke={c2} strokeWidth="1.2" />
                <polygon points={`${x + 42},${y - 18} ${x},${y + 4} ${x},${y + 52} ${x + 42},${y + 30}`} stroke={subtle} strokeWidth="1.2" />
              </g>
            );
          })}
        </>
      )}

      {art === 'orbit-arcs' && (
        <>
          <path d="M 760 420 A 340 340 0 0 1 1200 70" stroke={c1} strokeOpacity="0.26" strokeWidth="1.5" />
          <path d="M 860 420 A 250 250 0 0 1 1200 160" stroke={c2} strokeOpacity="0.22" strokeWidth="1.3" strokeDasharray="6 6" />
          <path d="M 960 420 A 160 160 0 0 1 1200 250" stroke={subtle} strokeOpacity="0.2" strokeWidth="1.2" />
        </>
      )}

      {art === 'pixel-cascade' &&
        Array.from({ length: 18 }).map((_, i) => (
          <rect
            key={i}
            x={760 + (i % 6) * 68}
            y={70 + Math.floor(i / 6) * 95 + (i % 2) * 20}
            width="24"
            height="24"
            fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : subtle}
            fillOpacity={isDark ? 0.14 : 0.1}
          />
        ))}

      {art === 'caustic-ribbon' && (
        <>
          <path d="M-40 320 C 280 180, 620 420, 1240 160" stroke={c1} strokeOpacity="0.28" strokeWidth="2.2" />
          <path d="M-40 355 C 280 215, 620 455, 1240 195" stroke={c2} strokeOpacity="0.22" strokeWidth="1.6" />
        </>
      )}

      {art === 'micro-crosshairs' &&
        Array.from({ length: 18 }).map((_, i) => {
          const x = 90 + (i % 6) * 205;
          const y = 70 + Math.floor(i / 6) * 140;
          return (
            <path
              key={i}
              d={`M${x - 6} ${y} H${x + 6} M${x} ${y - 6} V${y + 6}`}
              stroke={i % 2 === 0 ? c1 : subtle}
              strokeOpacity={isDark ? 0.25 : 0.18}
              strokeWidth="1.2"
            />
          );
        })}

      {art === 'vertical-bars' &&
        Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            x={640 + i * 38}
            y={420 - ((i * 53) % 240) - 80}
            width="14"
            height={((i * 53) % 240) + 80}
            rx="7"
            fill={i % 2 === 0 ? c1 : c2}
            fillOpacity={isDark ? 0.12 : 0.08}
          />
        ))}

      {art === 'origami-fold' && (
        <>
          <polygon points="620,0 1200,0 1200,420 460,420" fill={subtle} fillOpacity={isDark ? 0.05 : 0.04} />
          <line x1="620" y1="0" x2="460" y2="420" stroke={c1} strokeOpacity="0.24" strokeWidth="1.4" />
        </>
      )}

      {art === 'sine-mesh' && (
        <>
          {[0, 1, 2, 3].map((k) => (
            <path
              key={k}
              d={`M0 ${290 + k * 24} Q 300 ${230 + k * 20} 600 ${300 + k * 18} T 1200 ${260 + k * 22}`}
              stroke={k % 2 === 0 ? c1 : c2}
              strokeOpacity={0.22 - k * 0.03}
              strokeWidth="1.3"
            />
          ))}
        </>
      )}
    </svg>
  );
}

export default function HeroArtPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const isDark = mode === 'dark';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Option 18 (Liquid Chrome) + Option 15 (Cyan/Emerald Text) — 12 Hero Artwork Alternatives
            </h1>
            <p className="text-xs text-[#52525B]">
              Replaced the old line-and-dot constellation with 12 clean options. Reply with your favorite (1–12) to apply to `src/app/page.tsx`!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('light')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                !isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light Mode
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark Mode
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        {HERO_ART_OPTIONS.map((opt, idx) => (
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

            <div
              className={`font-luma-body relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-colors ${
                isDark
                  ? 'border-[rgba(226,232,240,0.18)] text-white'
                  : 'border-[rgba(100,116,139,0.20)] text-[#0F172A]'
              }`}
              style={{
                background: isDark
                  ? 'radial-gradient(800px 500px at 25% 20%, rgba(148,163,184,0.22) 0%, transparent 60%), linear-gradient(135deg, #07080A 0%, #14171F 55%, #090A0E 100%)'
                  : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
              }}
            >
              {/* Option 18 Liquid Chrome Base Sweep */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
                viewBox="0 0 1200 420"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M-40 380 C 260 120, 560 320, 1240 60"
                  stroke={isDark ? '#CBD5E1' : '#64748B'}
                  strokeWidth="18"
                  strokeOpacity="0.18"
                />
                <path
                  d="M-40 380 C 260 120, 560 320, 1240 60"
                  stroke={isDark ? '#38BDF8' : '#0284C7'}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Selected Hero Art Replacement */}
              <HeroArtSvg art={opt.id} isDark={isDark} />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-luma-title text-2xl sm:text-4xl leading-[1.12]">
                    A living graph of campus{' '}
                    <span className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>
                      engineering talent.
                    </span>
                  </h3>
                  <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                    Connecting <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>{projectCount} verified student builds</strong>{' '}
                    directly to alumni mentors, 5-minute architecture roasts, and{' '}
                    <strong className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>{dealCount} active hiring deals</strong>{' '}
                    across ITER.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold"
                      style={{
                        background: isDark
                          ? 'linear-gradient(90deg, #22D3EE 0%, #34D399 100%)'
                          : '#0F172A',
                        color: isDark ? '#041E24' : '#FFFFFF',
                      }}
                    >
                      Join the Graph <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold ${
                        isDark
                          ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06] text-white'
                          : 'border-[rgba(100,116,139,0.20)] bg-[rgba(15,23,42,0.05)] text-[#0F172A]'
                      }`}
                    >
                      Explore Talent Nodes
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-2xl border p-4 backdrop-blur-md ${
                      isDark
                        ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06]'
                        : 'border-[rgba(100,116,139,0.20)] bg-white/75'
                    }`}
                  >
                    <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      Repositories
                    </div>
                    <div className="font-luma-title text-2xl mt-1">{projectCount}</div>
                    <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      Live Campus Builds
                    </div>
                  </div>
                  <div
                    className={`rounded-2xl border p-4 backdrop-blur-md ${
                      isDark
                        ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06]'
                        : 'border-[rgba(100,116,139,0.20)] bg-white/75'
                    }`}
                  >
                    <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      Marketplace
                    </div>
                    <div className={`font-luma-title text-2xl mt-1 ${isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}`}>
                      {dealCount}
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                      Deals &amp; Paid Bounties
                    </div>
                  </div>
                  <div
                    className={`col-span-2 rounded-2xl border px-4 py-3 flex items-center justify-between backdrop-blur-md ${
                      isDark
                        ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06]'
                        : 'border-[rgba(100,116,139,0.20)] bg-white/75'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Real-Time Proof-of-Work Sync</div>
                      <div className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                        {STUDENTS_DATA.length} Students ↔ {ALUMNI_DATA.length} Alumni ↔ {OFFERS_DATA.length} Offers
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        isDark
                          ? 'bg-[#22D3EE]/15 border-[#22D3EE]/30 text-[#22D3EE]'
                          : 'bg-[#0891B2]/10 border-[#0891B2]/25 text-[#0891B2]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> 100% Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
