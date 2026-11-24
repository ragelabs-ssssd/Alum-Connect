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

type BgMotionId =
  | 'chrome-waves'
  | 'aurora-curtains'
  | 'infinite-grid'
  | 'orbiting-mesh'
  | 'prism-sweep'
  | 'contour-flow'
  | 'drifting-sparks'
  | 'silk-curtain'
  | 'caustic-ripples'
  | 'blueprint-drift'
  | 'pixel-waterfall'
  | 'conic-chrome'
  | 'harmonic-waves'
  | 'mercury-blobs'
  | 'meteor-streaks'
  | 'breathing-facets'
  | 'eclipse-halo'
  | 'iso-drift'
  | 'laser-matrix'
  | 'flagship-shader';

const BG_MOTION_OPTIONS: { id: BgMotionId; name: string; desc: string }[] = [
  { id: 'chrome-waves', name: 'Flowing Liquid Chrome Waves', desc: 'Full-width undulating chrome, cyan & emerald waves rolling smoothly.' },
  { id: 'aurora-curtains', name: 'Aurora Curtain Drift', desc: 'Full-background northern lights ribbons swaying across the canvas.' },
  { id: 'infinite-grid', name: 'Scrolling 3D Perspective Grid', desc: 'Infinite forward-moving engineering horizon grid.' },
  { id: 'orbiting-mesh', name: 'Orbiting Cyan-Emerald Mesh', desc: 'Two large luminous light fields orbiting across the entire background.' },
  { id: 'prism-sweep', name: 'Sweeping Diagonal Prism Beams', desc: 'Wide translucent glass light shafts gliding continuously.' },
  { id: 'contour-flow', name: 'Shifting Topographic Flow', desc: 'Full-width elevation contour waves drifting organically.' },
  { id: 'drifting-sparks', name: 'Multi-Depth Drifting Sparks', desc: 'Full-canvas cyan, emerald & chrome particles rising at varied speeds.' },
  { id: 'silk-curtain', name: 'Kinetic Silk Curtain', desc: 'Layered full-width bezier ribbons breathing & gliding horizontally.' },
  { id: 'caustic-ripples', name: 'Expanding Water Caustics', desc: 'Overlapping luminous rings rippling outward across the background.' },
  { id: 'blueprint-drift', name: 'Drifting Blueprint + Scanline', desc: 'Slowly panning architectural drafting grid with a glowing scan beam.' },
  { id: 'pixel-waterfall', name: 'Stepped Pixel Cascade', desc: 'Subtle full-width pixel columns echoing Departure Mono, drifting down.' },
  { id: 'conic-chrome', name: 'Rotating Conic Chrome Sheen', desc: 'Full-backdrop metallic specular conic gradient rotating smoothly.' },
  { id: 'harmonic-waves', name: 'Harmonic Sine Horizon', desc: 'Five full-width overlapping cyan & emerald sine waves oscillating.' },
  { id: 'mercury-blobs', name: 'Morphing Liquid Mercury Fields', desc: 'Three large organic chrome/cyan blobs morphing across the background.' },
  { id: 'meteor-streaks', name: 'Diagonal Light Streaks', desc: 'Sleek cyan & chrome light trails gliding diagonally across the card.' },
  { id: 'breathing-facets', name: 'Luminous Geometric Facets', desc: 'Full-width polygonal glass facets pulsing in staggered light waves.' },
  { id: 'eclipse-halo', name: 'Rotating Chrome Eclipse Halo', desc: 'Large luminous cyan-chrome ring slowly rotating behind the hero.' },
  { id: 'iso-drift', name: 'Panning Isometric Diamond Mesh', desc: 'Full-background isometric diamond lattice drifting diagonally.' },
  { id: 'laser-matrix', name: 'Dual-Axis Sweeping Hairlines', desc: 'Clean horizontal & vertical cyan-emerald light beams crossing the canvas.' },
  { id: 'flagship-shader', name: 'Flagship Liquid Chrome Shader', desc: 'Flowing chrome wave + orbiting cyan/emerald mesh + rising micro-sparks.' },
];

function FullBackgroundMotion({ id, isDark }: { id: BgMotionId; isDark: boolean }) {
  const c1 = isDark ? '#22D3EE' : '#0891B2';
  const c2 = isDark ? '#34D399' : '#059669';
  const chrome = isDark ? '#CBD5E1' : '#64748B';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {id === 'chrome-waves' && (
        <svg className="h-full w-[200%]" viewBox="0 0 2400 420" preserveAspectRatio="none" fill="none" style={{ animation: 'bg-slide-x 14s linear infinite' }}>
          <path d="M0 240 Q 300 120 600 240 T 1200 240 T 1800 240 T 2400 240 V420 H0 Z" fill={c1} fillOpacity={isDark ? 0.08 : 0.06} />
          <path d="M0 290 Q 300 180 600 290 T 1200 290 T 1800 290 T 2400 290 V420 H0 Z" fill={c2} fillOpacity={isDark ? 0.07 : 0.05} />
          <path d="M0 240 Q 300 120 600 240 T 1200 240 T 1800 240 T 2400 240" stroke={c1} strokeOpacity="0.35" strokeWidth="2" />
          <path d="M0 290 Q 300 180 600 290 T 1200 290 T 1800 290 T 2400 290" stroke={chrome} strokeOpacity="0.28" strokeWidth="1.5" />
        </svg>
      )}

      {id === 'aurora-curtains' && (
        <>
          <div
            className="absolute -inset-x-24 -top-24 h-[140%] opacity-30 blur-3xl"
            style={{
              background: `linear-gradient(115deg, transparent 15%, ${c1} 35%, ${c2} 55%, transparent 78%)`,
              animation: 'bg-aurora 9s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -inset-x-24 -bottom-24 h-[120%] opacity-20 blur-3xl"
            style={{
              background: `linear-gradient(245deg, transparent 20%, ${c2} 45%, ${c1} 65%, transparent 85%)`,
              animation: 'bg-aurora-rev 11s ease-in-out infinite',
            }}
          />
        </>
      )}

      {id === 'infinite-grid' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(34,211,238,0.16)' : 'rgba(8,145,178,0.14)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(34,211,238,0.16)' : 'rgba(8,145,178,0.14)'} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            transform: 'perspective(500px) rotateX(48deg) scale(1.6)',
            transformOrigin: '50% 80%',
            animation: 'bg-grid-scroll 4s linear infinite',
          }}
        />
      )}

      {id === 'orbiting-mesh' && (
        <>
          <div
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full blur-3xl"
            style={{ background: c1, opacity: isDark ? 0.2 : 0.14, animation: 'bg-orbit-a 10s ease-in-out infinite' }}
          />
          <div
            className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full blur-3xl"
            style={{ background: c2, opacity: isDark ? 0.18 : 0.12, animation: 'bg-orbit-b 12s ease-in-out infinite' }}
          />
        </>
      )}

      {id === 'prism-sweep' && (
        <>
          <div
            className="absolute -inset-y-16 w-1/3 rotate-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(34,211,238,0.12)' : 'rgba(8,145,178,0.10)'}, transparent)`,
              animation: 'bg-sweep 5s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -inset-y-16 w-1/4 rotate-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(52,211,153,0.10)' : 'rgba(5,150,105,0.08)'}, transparent)`,
              animation: 'bg-sweep 7.5s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
        </>
      )}

      {id === 'contour-flow' && (
        <svg className="h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="none" fill="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M-80 ${70 + i * 75} C 280 ${20 + i * 60}, 760 ${150 + i * 65}, 1280 ${50 + i * 70}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeOpacity={isDark ? 0.26 : 0.18}
              strokeWidth="1.4"
              style={{ animation: `bg-float-y ${5 + i * 0.8}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>
      )}

      {id === 'drifting-sparks' &&
        Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${(i * 3.7) % 100}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              background: i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : chrome,
              opacity: isDark ? 0.45 : 0.3,
              animation: `bg-rise ${4.5 + (i % 5) * 1.1}s linear infinite`,
              animationDelay: `${(i * 0.37) % 4}s`,
            }}
          />
        ))}

      {id === 'silk-curtain' && (
        <svg className="h-full w-[140%]" viewBox="0 0 1600 420" preserveAspectRatio="none" fill="none" style={{ animation: 'bg-sway-x 9s ease-in-out infinite' }}>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M0 ${110 + i * 65} C 400 ${20 + i * 40}, 950 ${280 + i * 35}, 1600 ${90 + i * 65}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeOpacity="0.28"
              strokeWidth={2.2 - i * 0.3}
            />
          ))}
        </svg>
      )}

      {id === 'caustic-ripples' && (
        <svg className="h-full w-full" viewBox="0 0 1200 420" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx={i % 2 === 0 ? 320 : 880}
              cy={210}
              r={120 + i * 90}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth="1.5"
              style={{
                transformOrigin: `${i % 2 === 0 ? 320 : 880}px 210px`,
                animation: `bg-ripple 6s ease-out infinite`,
                animationDelay: `${i * 1.4}s`,
              }}
            />
          ))}
        </svg>
      )}

      {id === 'blueprint-drift' && (
        <>
          <div
            className="absolute -inset-12 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${c1} 1px, transparent 1px), linear-gradient(90deg, ${c1} 1px, transparent 1px)`,
              backgroundSize: '44px 44px',
              animation: 'bg-pan 12s linear infinite',
            }}
          />
          <div
            className="absolute inset-x-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${c1}, ${c2}, transparent)`,
              boxShadow: `0 0 16px ${c1}`,
              animation: 'bg-scan 5s ease-in-out infinite',
            }}
          />
        </>
      )}

      {id === 'pixel-waterfall' &&
        Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-2"
            style={{
              left: `${(i * 4.3) % 98}%`,
              height: `${18 + (i % 4) * 14}px`,
              background: i % 2 === 0 ? c1 : c2,
              opacity: isDark ? 0.2 : 0.14,
              animation: `bg-fall ${3.5 + (i % 4) * 0.9}s linear infinite`,
              animationDelay: `${(i * 0.45) % 3}s`,
            }}
          />
        ))}

      {id === 'conic-chrome' && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] opacity-20"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${c1} 45deg, transparent 120deg, ${c2} 210deg, transparent 300deg)`,
            animation: 'bg-spin-slow 16s linear infinite',
          }}
        />
      )}

      {id === 'harmonic-waves' && (
        <svg className="h-full w-[200%]" viewBox="0 0 2400 420" preserveAspectRatio="none" fill="none" style={{ animation: 'bg-slide-x 10s linear infinite' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M0 ${140 + i * 42} Q 300 ${70 + i * 35} 600 ${140 + i * 42} T 1200 ${140 + i * 42} T 1800 ${140 + i * 42} T 2400 ${140 + i * 42}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeOpacity={0.28 - i * 0.03}
              strokeWidth="1.6"
            />
          ))}
        </svg>
      )}

      {id === 'mercury-blobs' && (
        <>
          <div
            className="absolute left-[10%] top-[10%] h-64 w-64 blur-2xl"
            style={{ background: c1, opacity: isDark ? 0.16 : 0.1, animation: 'bg-morph 9s ease-in-out infinite' }}
          />
          <div
            className="absolute right-[12%] bottom-[8%] h-72 w-72 blur-2xl"
            style={{ background: c2, opacity: isDark ? 0.16 : 0.1, animation: 'bg-morph 11s ease-in-out infinite reverse' }}
          />
        </>
      )}

      {id === 'meteor-streaks' &&
        Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-36 -rotate-[25deg]"
            style={{
              top: `${10 + i * 9}%`,
              left: '-15%',
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? c1 : c2})`,
              opacity: isDark ? 0.45 : 0.3,
              animation: `bg-meteor ${3 + (i % 4) * 0.9}s linear infinite`,
              animationDelay: `${i * 0.55}s`,
            }}
          />
        ))}

      {id === 'breathing-facets' && (
        <svg className="h-full w-full" viewBox="0 0 1200 420" preserveAspectRatio="none" fill="none">
          {[
            '0,0 400,0 240,220 0,160',
            '400,0 840,0 680,210 240,220',
            '840,0 1200,0 1200,250 680,210',
            '0,160 240,220 460,420 0,420',
            '240,220 680,210 920,420 460,420',
            '680,210 1200,250 1200,420 920,420',
          ].map((pts, i) => (
            <polygon
              key={i}
              points={pts}
              fill={i % 2 === 0 ? c1 : c2}
              stroke={chrome}
              strokeOpacity="0.16"
              style={{
                animation: `bg-facet-pulse ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </svg>
      )}

      {id === 'eclipse-halo' && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${c1}, ${c2}, transparent, ${c1})`,
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            opacity: 0.45,
            animation: 'bg-spin-slow 12s linear infinite',
          }}
        />
      )}

      {id === 'iso-drift' && (
        <div
          className="absolute -inset-12 opacity-20"
          style={{
            backgroundImage: `linear-gradient(30deg, ${c1} 1px, transparent 1px), linear-gradient(150deg, ${c2} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            animation: 'bg-pan 10s linear infinite',
          }}
        />
      )}

      {id === 'laser-matrix' && (
        <>
          <div
            className="absolute inset-x-0 h-[1.5px]"
            style={{ background: `linear-gradient(90deg, transparent, ${c1}, transparent)`, animation: 'bg-scan 5s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-y-0 w-[1.5px]"
            style={{ background: `linear-gradient(180deg, transparent, ${c2}, transparent)`, animation: 'bg-scan-x 6.5s ease-in-out infinite' }}
          />
        </>
      )}

      {id === 'flagship-shader' && (
        <>
          <div
            className="absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: c1, opacity: isDark ? 0.18 : 0.12, animation: 'bg-orbit-a 11s ease-in-out infinite' }}
          />
          <div
            className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: c2, opacity: isDark ? 0.16 : 0.1, animation: 'bg-orbit-b 13s ease-in-out infinite' }}
          />
          <svg className="h-full w-[200%]" viewBox="0 0 2400 420" preserveAspectRatio="none" fill="none" style={{ animation: 'bg-slide-x 16s linear infinite' }}>
            <path d="M0 260 Q 300 140 600 260 T 1200 260 T 1800 260 T 2400 260" stroke={c1} strokeOpacity="0.28" strokeWidth="1.8" />
            <path d="M0 305 Q 300 195 600 305 T 1200 305 T 1800 305 T 2400 305" stroke={chrome} strokeOpacity="0.22" strokeWidth="1.4" />
          </svg>
        </>
      )}
    </div>
  );
}

export default function HeroMotionPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const isDark = mode === 'dark';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <style>{`
        @keyframes bg-slide-x { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes bg-aurora { 0%, 100% { transform: translate(-6%, -4%) rotate(0deg); } 50% { transform: translate(6%, 4%) rotate(4deg); } }
        @keyframes bg-aurora-rev { 0%, 100% { transform: translate(6%, 4%) rotate(0deg); } 50% { transform: translate(-6%, -4%) rotate(-4deg); } }
        @keyframes bg-grid-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 48px; } }
        @keyframes bg-orbit-a { 0%, 100% { transform: translate(0px, 0px) scale(1); } 50% { transform: translate(180px, 90px) scale(1.15); } }
        @keyframes bg-orbit-b { 0%, 100% { transform: translate(0px, 0px) scale(1.1); } 50% { transform: translate(-180px, -80px) scale(0.95); } }
        @keyframes bg-sweep { 0% { transform: translateX(-160%) rotate(12deg); } 100% { transform: translateX(420%) rotate(12deg); } }
        @keyframes bg-float-y { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes bg-rise { 0% { transform: translateY(20px); opacity: 0; } 20% { opacity: 0.45; } 80% { opacity: 0.35; } 100% { transform: translateY(-420px); opacity: 0; } }
        @keyframes bg-fall { 0% { transform: translateY(-40px); opacity: 0; } 20% { opacity: 0.3; } 80% { opacity: 0.25; } 100% { transform: translateY(440px); opacity: 0; } }
        @keyframes bg-sway-x { 0%, 100% { transform: translateX(0%); } 50% { transform: translateX(-18%); } }
        @keyframes bg-ripple { 0% { transform: scale(0.75); opacity: 0.4; } 100% { transform: scale(1.45); opacity: 0; } }
        @keyframes bg-pan { 0% { transform: translate(0px, 0px); } 100% { transform: translate(48px, 48px); } }
        @keyframes bg-scan { 0%, 100% { top: 6%; opacity: 0.25; } 50% { top: 94%; opacity: 0.75; } }
        @keyframes bg-scan-x { 0%, 100% { left: 4%; opacity: 0.25; } 50% { left: 96%; opacity: 0.75; } }
        @keyframes bg-spin-slow { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes bg-morph { 0%, 100% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; transform: translate(0,0) rotate(0deg); } 50% { border-radius: 60% 40% 38% 62% / 55% 60% 40% 45%; transform: translate(40px, -25px) rotate(35deg); } }
        @keyframes bg-meteor { 0% { transform: translate(0, 0) rotate(-25deg); opacity: 0; } 15% { opacity: 0.5; } 100% { transform: translate(1400px, -420px) rotate(-25deg); opacity: 0; } }
        @keyframes bg-facet-pulse { 0%, 100% { fill-opacity: 0.03; } 50% { fill-opacity: 0.11; } }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Full-Background Moving Animations — 20 Creative Options (Light &amp; Dark)
            </h1>
            <p className="text-xs text-[#52525B]">
              Every option animates the entire background in Option 18 Liquid Chrome + Option 15 Cyan/Emerald text. Reply with your pick (1–20) to apply &amp; push live!
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
        {BG_MOTION_OPTIONS.map((opt, idx) => (
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
              <FullBackgroundMotion id={opt.id} isDark={isDark} />

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
