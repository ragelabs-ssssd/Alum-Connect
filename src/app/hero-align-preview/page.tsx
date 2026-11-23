'use client';

import React, { useState } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../../data/alumConnectData';

type AlignId =
  | 'grid-buttons-match'
  | 'stretch-baseline'
  | 'centered-symmetry'
  | 'flush-right-baseline'
  | 'compact-6-6'
  | 'top-aligned-grid'
  | 'paired-modules'
  | 'unified-right-panel'
  | 'full-width-action-row'
  | 'bento-balanced';

const ALIGN_OPTIONS: { id: AlignId; name: string; desc: string }[] = [
  { id: 'grid-buttons-match', name: 'Exact 2-Col Matched Buttons (grid-cols-2)', desc: 'Join the Graph matches Repositories width; Explore Talent Nodes matches Marketplace width. Zero dead space.' },
  { id: 'stretch-baseline', name: 'Equal-Height Stretch + Bottom Baseline', desc: 'Left & right columns stretch to exact same height; buttons sit flush at the bottom.' },
  { id: 'paired-modules', name: 'Paired Vertical Modules (50+Join | 32+Explore)', desc: 'Each button sits directly under its matching metric card in a 2-column sub-grid.' },
  { id: 'unified-right-panel', name: 'Unified Right Glass Command Panel', desc: '50, 32, and both buttons framed inside one cohesive frosted glass container.' },
  { id: 'compact-6-6', name: 'Balanced 6 / 6 Equal Split', desc: '50% / 50% column split so headline & telemetry cards carry equal visual weight.' },
  { id: 'top-aligned-grid', name: 'Strict Top-Edge Alignment (items-start)', desc: 'Headline top edge aligns with Repositories card top edge; matched 2-col buttons below.' },
  { id: 'flush-right-baseline', name: 'Flush-Right Buttons + Bottom Alignment', desc: 'Buttons right-aligned with the Marketplace card outer edge.' },
  { id: 'bento-balanced', name: 'Bento Proportion (8 / 4 Tight Stack)', desc: 'Headline breathes in 8 cols; compact 4-col telemetry + full-width stacked CTAs.' },
  { id: 'full-width-action-row', name: 'Split Header Row + Dedicated CTA Bar', desc: 'Headline + 50/32 on top row, clean aligned CTA row right above the company scroll.' },
  { id: 'centered-symmetry', name: 'Centered Editorial Showcase', desc: 'Centered Departure Mono headline, centered 50 | 32 tiles, and centered CTAs.' },
];

export default function HeroAlignPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const isDark = mode === 'dark';

  const c1 = isDark ? '#22D3EE' : '#0891B2';
  const c2 = isDark ? '#34D399' : '#059669';

  const cardSurface = isDark
    ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06]'
    : 'border-[rgba(100,116,139,0.22)] bg-white/65';
  const mutedText = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const primaryBtnStyle = {
    background: isDark ? 'linear-gradient(90deg, #22D3EE 0%, #34D399 100%)' : '#0F172A',
    color: isDark ? '#041E24' : '#FFFFFF',
  };
  const secondaryBtnCls = `inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
    isDark
      ? 'border-[rgba(226,232,240,0.18)] bg-white/[0.06] text-white'
      : 'border-[rgba(100,116,139,0.20)] bg-white/70 text-[#0F172A]'
  }`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Hero Area Alignment — 10 Layout Options (Local Review)
            </h1>
            <p className="text-xs text-[#52525B]">
              Compare how the headline, Repositories (50), Marketplace (32), buttons, and company scroll align. Reply with 1–10 to apply &amp; push live!
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
        {ALIGN_OPTIONS.map((opt, idx) => (
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
              className={`font-luma-body relative overflow-hidden rounded-3xl border p-6 sm:p-7 transition-colors ${
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
              <div
                className="pointer-events-none absolute -inset-12"
                style={{
                  opacity: isDark ? 0.18 : 0.3,
                  backgroundImage: `linear-gradient(30deg, ${c1} 1px, transparent 1px), linear-gradient(150deg, ${c2} 1px, transparent 1px)`,
                  backgroundSize: '48px 48px',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-5">
                {opt.id === 'centered-symmetry' ? (
                  <div className="text-center max-w-3xl mx-auto space-y-5">
                    <h3 className="font-luma-title text-3xl sm:text-4xl leading-[1.12]">
                      A living graph of campus{' '}
                      <span className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>
                        engineering talent.
                      </span>
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${mutedText}`}>
                      Connecting <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>{projectCount} verified student builds</strong>{' '}
                      directly to alumni mentors, 5-minute architecture roasts, and{' '}
                      <strong className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>{dealCount} active hiring deals</strong>{' '}
                      across ITER.
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                      <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                        <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Repositories</span>
                        <div className="font-luma-title text-2xl mt-1">{projectCount}</div>
                        <div className={`text-[11px] ${mutedText}`}>Live Campus Builds</div>
                      </div>
                      <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                        <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Marketplace</span>
                        <div className={`font-luma-title text-2xl mt-1 ${isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}`}>{dealCount}</div>
                        <div className={`text-[11px] ${mutedText}`}>Deals &amp; Paid Bounties</div>
                      </div>
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold" style={primaryBtnStyle}>
                        Join the Graph <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className={secondaryBtnCls}>Explore Talent Nodes</span>
                    </div>
                  </div>
                ) : opt.id === 'full-width-action-row' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-7 space-y-2.5">
                        <h3 className="font-luma-title text-3xl sm:text-4xl leading-[1.12]">
                          A living graph of campus{' '}
                          <span className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>engineering talent.</span>
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed ${mutedText}`}>
                          Connecting <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>{projectCount} verified student builds</strong>{' '}
                          directly to alumni mentors, 5-minute architecture roasts, and{' '}
                          <strong className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>{dealCount} active hiring deals</strong>{' '}
                          across ITER.
                        </p>
                      </div>
                      <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                        <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                          <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Repositories</span>
                          <div className="font-luma-title text-2xl mt-1">{projectCount}</div>
                          <div className={`text-[11px] ${mutedText}`}>Live Campus Builds</div>
                        </div>
                        <div className={`rounded-2xl border p-4 ${cardSurface}`}>
                          <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Marketplace</span>
                          <div className={`font-luma-title text-2xl mt-1 ${isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}`}>{dealCount}</div>
                          <div className={`text-[11px] ${mutedText}`}>Deals &amp; Paid Bounties</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold" style={primaryBtnStyle}>
                          Join the Graph <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <span className={secondaryBtnCls}>Explore Talent Nodes</span>
                      </div>
                      <span className={`text-[11px] font-mono ${mutedText}`}>ITER • Siksha &apos;O&apos; Anusandhan</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${
                      opt.id === 'top-aligned-grid'
                        ? 'items-start'
                        : opt.id === 'stretch-baseline'
                        ? 'items-stretch'
                        : 'items-center'
                    }`}
                  >
                    <div
                      className={`${
                        opt.id === 'compact-6-6'
                          ? 'lg:col-span-6'
                          : opt.id === 'bento-balanced'
                          ? 'lg:col-span-8'
                          : 'lg:col-span-7'
                      } flex flex-col justify-between space-y-3`}
                    >
                      <h3 className="font-luma-title text-3xl sm:text-4xl leading-[1.12]">
                        A living graph of campus{' '}
                        <span className={isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}>
                          engineering talent.
                        </span>
                      </h3>
                      <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${mutedText}`}>
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
                    </div>

                    <div
                      className={`${
                        opt.id === 'compact-6-6'
                          ? 'lg:col-span-6'
                          : opt.id === 'bento-balanced'
                          ? 'lg:col-span-4'
                          : 'lg:col-span-5'
                      } ${
                        opt.id === 'unified-right-panel'
                          ? `rounded-2xl border p-4 backdrop-blur-md ${cardSurface}`
                          : ''
                      } flex flex-col justify-between gap-3`}
                    >
                      {opt.id === 'paired-modules' ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2.5">
                            <div className={`rounded-2xl border p-4 min-h-[112px] flex flex-col justify-between ${cardSurface}`}>
                              <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Repositories</span>
                              <div>
                                <div className="font-luma-title text-2xl">{projectCount}</div>
                                <div className={`text-[11px] ${mutedText}`}>Live Campus Builds</div>
                              </div>
                            </div>
                            <span className="w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold" style={primaryBtnStyle}>
                              Join the Graph <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            <div className={`rounded-2xl border p-4 min-h-[112px] flex flex-col justify-between ${cardSurface}`}>
                              <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Marketplace</span>
                              <div>
                                <div className={`font-luma-title text-2xl ${isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}`}>{dealCount}</div>
                                <div className={`text-[11px] ${mutedText}`}>Deals &amp; Paid Bounties</div>
                              </div>
                            </div>
                            <span className={`w-full ${secondaryBtnCls}`}>Explore Talent Nodes</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className={`rounded-2xl border p-4 min-h-[112px] flex flex-col justify-between ${cardSurface}`}>
                              <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Repositories</span>
                              <div>
                                <div className="font-luma-title text-2xl">{projectCount}</div>
                                <div className={`text-[11px] ${mutedText}`}>Live Campus Builds</div>
                              </div>
                            </div>
                            <div className={`rounded-2xl border p-4 min-h-[112px] flex flex-col justify-between ${cardSurface}`}>
                              <span className={`text-[10px] font-mono uppercase ${mutedText}`}>Marketplace</span>
                              <div>
                                <div className={`font-luma-title text-2xl ${isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]'}`}>{dealCount}</div>
                                <div className={`text-[11px] ${mutedText}`}>Deals &amp; Paid Bounties</div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={
                              opt.id === 'flush-right-baseline'
                                ? 'flex flex-wrap items-center justify-end gap-2.5'
                                : opt.id === 'bento-balanced'
                                ? 'flex flex-col gap-2'
                                : 'grid grid-cols-2 gap-3'
                            }
                          >
                            <span
                              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
                              style={primaryBtnStyle}
                            >
                              Join the Graph <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <span className={secondaryBtnCls}>Explore Talent Nodes</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Always-visible company marquee strip */}
                <div
                  className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs ${
                    isDark ? 'border-white/[0.12] text-[#94A3B8]' : 'border-slate-300/70 text-[#475569]'
                  }`}
                >
                  <span className="font-medium shrink-0">Alumni Reviewing &amp; Hiring From:</span>
                  <div className="w-full sm:flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                    <div className={`animate-marquee-left gap-8 items-center text-xs sm:text-sm font-semibold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((c, i) => (
                        <span key={`${c.name}-${i}`} className="shrink-0">{c.name}</span>
                      ))}
                    </div>
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
