'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Code2,
  Flame,
  GraduationCap,
  Star,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

type CardAccent = 'cyan' | 'emerald' | 'sky';

interface CardBgOption {
  id: number;
  name: string;
  vibe: string;
  cardClass: string;
  renderInnerBg: (accent: CardAccent) => React.ReactNode;
}

const ACCENT_HEX: Record<CardAccent, { main: string; secondary: string }> = {
  cyan: { main: '#22D3EE', secondary: '#2563EB' },
  emerald: { main: '#34D399', secondary: '#0891B2' },
  sky: { main: '#38BDF8', secondary: '#818CF8' },
};

const PORTAL_CARDS: Array<{
  title: string;
  badge: string;
  desc: string;
  cta: string;
  icon: typeof Code2;
  accent: CardAccent;
  accentText: string;
  iconBox: string;
  topBar: string;
}> = [
  {
    title: 'Student Network',
    badge: 'For Builders',
    desc: 'Publish GitHub repository showcases, track sprint tasks, and follow what campus squads are shipping.',
    cta: 'Open Student Feed',
    icon: Code2,
    accent: 'cyan',
    accentText: 'text-[#22D3EE]',
    iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-[#22D3EE]',
    topBar: 'bg-gradient-to-r from-[#22D3EE] to-[#34D399]',
  },
  {
    title: 'Alumni & Hiring',
    badge: 'For Recruiters',
    desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
    cta: 'Open Alumni Marketplace',
    icon: Briefcase,
    accent: 'emerald',
    accentText: 'text-emerald-400',
    iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    topBar: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
  },
  {
    title: 'Dean & T&P Cell',
    badge: 'For Leadership',
    desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
    cta: 'Open Placement Telemetry',
    icon: GraduationCap,
    accent: 'sky',
    accentText: 'text-sky-400',
    iconBox: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
    topBar: 'bg-gradient-to-r from-sky-400 to-indigo-400',
  },
];

const CARD_BG_OPTIONS: CardBgOption[] = [
  {
    id: 1,
    name: 'Aurora Corner Bloom',
    vibe: 'Luminous northern-lights bloom glowing softly from the top-right corner',
    cardClass: 'bg-[#0F131C]/90 border-white/15',
    renderInnerBg: (a) => (
      <>
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-40 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${ACCENT_HEX[a].main}, ${ACCENT_HEX[a].secondary}, transparent 70%)`,
          }}
        />
      </>
    ),
  },
  {
    id: 2,
    name: 'Constellation Nodes Inside Card',
    vibe: 'Connected SVG talent-graph nodes & edges subtly woven inside each box',
    cardClass: 'bg-[#0C1018]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
      >
        <g stroke={ACCENT_HEX[a].main} strokeWidth="1" strokeOpacity="0.45">
          <line x1="250" y1="20" x2="320" y2="90" />
          <line x1="320" y1="90" x2="380" y2="40" />
          <line x1="320" y1="90" x2="280" y2="170" />
          <line x1="280" y1="170" x2="370" y2="190" />
        </g>
        {[
          [250, 20],
          [320, 90],
          [380, 40],
          [280, 170],
          [370, 190],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill={ACCENT_HEX[a].main} />
        ))}
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Kinetic Bottom Wave',
    vibe: 'Layered translucent SVG wave ribbon flowing across the card floor',
    cardClass: 'bg-[#0D1119]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full opacity-40"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,55 C120,10 260,95 400,35 L400,100 L0,100 Z"
          fill={ACCENT_HEX[a].main}
          fillOpacity="0.18"
        />
        <path
          d="M0,72 C140,95 280,25 400,65 L400,100 L0,100 Z"
          fill={ACCENT_HEX[a].secondary}
          fillOpacity="0.22"
        />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Topographic Contour Corner',
    vibe: 'Artistic elevation contour rings radiating from bottom-right',
    cardClass: 'bg-[#0B0F17]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute -bottom-8 -right-8 h-52 w-52 opacity-35"
        viewBox="0 0 200 200"
        fill="none"
      >
        {[35, 58, 81, 104, 127].map((r) => (
          <circle
            key={r}
            cx="140"
            cy="140"
            r={r}
            stroke={ACCENT_HEX[a].main}
            strokeWidth="1.2"
          />
        ))}
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Dot-Matrix Spotlight Fade',
    vibe: 'Crisp radial dot-matrix texture masked smoothly from top-right',
    cardClass: 'bg-[#0E1118]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: `radial-gradient(${ACCENT_HEX[a].main} 1.2px, transparent 1.2px)`,
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(circle at 85% 20%, black, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at 85% 20%, black, transparent 70%)',
        }}
      />
    ),
  },
  {
    id: 6,
    name: 'Holographic Iridescent Wash',
    vibe: 'Multi-point pastel-neon silk gradient blended into dark glass',
    cardClass: 'bg-[#0D101A]/90 border-white/20',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: `
            radial-gradient(at 90% 10%, ${ACCENT_HEX[a].main}55 0px, transparent 55%),
            radial-gradient(at 10% 90%, ${ACCENT_HEX[a].secondary}55 0px, transparent 55%)
          `,
        }}
      />
    ),
  },
  {
    id: 7,
    name: 'Stained-Glass Crystal Shards',
    vibe: 'Faceted polygonal glass shards catching subtle corner light',
    cardClass: 'bg-[#0B0E16]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
      >
        <polygon points="240,0 400,0 400,130 290,90" fill={ACCENT_HEX[a].main} fillOpacity="0.18" />
        <polygon points="290,90 400,130 400,220 220,220" fill={ACCENT_HEX[a].secondary} fillOpacity="0.18" />
      </svg>
    ),
  },
  {
    id: 8,
    name: 'Cybernetic Perspective Floor',
    vibe: '3D-tilted glowing grid receding along the bottom of each card',
    cardClass: 'bg-[#090D16]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-35"
        style={{
          backgroundImage: `linear-gradient(to right, ${ACCENT_HEX[a].main}55 1px, transparent 1px), linear-gradient(to bottom, ${ACCENT_HEX[a].main}55 1px, transparent 1px)`,
          backgroundSize: '26px 18px',
          transform: 'perspective(260px) rotateX(55deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />
    ),
  },
  {
    id: 9,
    name: 'Bauhaus Geometric Shapes',
    vibe: 'Playful overlapping translucent circle, ring & rotated square',
    cardClass: 'bg-[#0E121B]/95 border-white/15',
    renderInnerBg: (a) => (
      <>
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full border-[14px] opacity-20"
          style={{ borderColor: ACCENT_HEX[a].main }}
        />
        <div
          className="pointer-events-none absolute bottom-4 right-12 h-14 w-14 rotate-12 opacity-15"
          style={{ backgroundColor: ACCENT_HEX[a].secondary }}
        />
      </>
    ),
  },
  {
    id: 10,
    name: 'Architectural Blueprint Grid',
    vibe: 'Fine engineering grid + glowing crosshair arc inside the card',
    cardClass: 'bg-[#091523]/95 border-sky-400/20',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, ${ACCENT_HEX[a].main}44 1px, transparent 1px), linear-gradient(to bottom, ${ACCENT_HEX[a].main}44 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    ),
  },
  {
    id: 11,
    name: 'Dual-Orb Liquid Glass',
    vibe: 'Two contrasting glowing orbs creating rich frosted-glass depth',
    cardClass: 'bg-[#0D1018]/85 border-white/20 backdrop-blur-2xl',
    renderInnerBg: (a) => (
      <>
        <div
          className="pointer-events-none absolute -top-12 left-1/2 h-36 w-36 rounded-full opacity-35 blur-2xl"
          style={{ backgroundColor: ACCENT_HEX[a].main }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full opacity-25 blur-2xl"
          style={{ backgroundColor: ACCENT_HEX[a].secondary }}
        />
      </>
    ),
  },
  {
    id: 12,
    name: 'Circuit Trace Accent',
    vibe: 'Glowing PCB traces running cleanly into the top-right corner',
    cardClass: 'bg-[#0A0E14]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute top-0 right-0 h-36 w-48 opacity-40"
        viewBox="0 0 200 140"
        fill="none"
      >
        <path d="M40 0 V40 L80 80 H200" stroke={ACCENT_HEX[a].main} strokeWidth="1.5" />
        <path d="M100 0 V25 L130 55 H200" stroke={ACCENT_HEX[a].secondary} strokeWidth="1.5" />
        <circle cx="80" cy="80" r="3" fill={ACCENT_HEX[a].main} />
        <circle cx="130" cy="55" r="3" fill={ACCENT_HEX[a].secondary} />
      </svg>
    ),
  },
  {
    id: 13,
    name: 'Diagonal Light Beam',
    vibe: 'Sleek angled specular light streak sweeping across dark metal',
    cardClass: 'bg-[#0D1016]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute -inset-y-10 left-1/3 w-36 rotate-25 opacity-20 blur-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT_HEX[a].main}, transparent)`,
        }}
      />
    ),
  },
  {
    id: 14,
    name: 'Solar Eclipse Rim',
    vibe: 'Glowing crescent halo arc peeking behind the right edge',
    cardClass: 'bg-[#090B10]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-52 w-52 rounded-full border-2 opacity-35"
        style={{
          borderColor: ACCENT_HEX[a].main,
          boxShadow: `0 0 40px 6px ${ACCENT_HEX[a].main}44`,
        }}
      />
    ),
  },
  {
    id: 15,
    name: 'Pixel Mosaic Corner',
    vibe: 'Departure-Mono-inspired glowing pixel blocks in the corner',
    cardClass: 'bg-[#0C0F16]/95 border-white/15',
    renderInnerBg: (a) => (
      <div className="pointer-events-none absolute bottom-3 right-3 grid grid-cols-3 gap-1.5 opacity-35">
        {[1, 0, 1, 0, 1, 1, 1, 1, 0].map((on, i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 rounded-[2px]"
            style={{
              backgroundColor: on ? ACCENT_HEX[a].main : 'transparent',
              opacity: on ? 0.6 : 0,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 16,
    name: 'Nebula Starlight',
    vibe: 'Subtle starlight specks + soft nebula cloud inside each card',
    cardClass: 'bg-[#070911]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 80% 25%, #fff, transparent),
            radial-gradient(1px 1px at 65% 55%, ${ACCENT_HEX[a].main}, transparent),
            radial-gradient(1px 1px at 88% 72%, #fff, transparent),
            radial-gradient(circle at 82% 35%, ${ACCENT_HEX[a].main}33, transparent 55%)
          `,
        }}
      />
    ),
  },
  {
    id: 17,
    name: 'Mesh Gradient Border + Tint',
    vibe: 'Rich tinted inner surface with glowing accent-tinted glass',
    cardClass: 'bg-[#101521]/95 border-white/20',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_HEX[a].main}33 0%, transparent 45%, ${ACCENT_HEX[a].secondary}33 100%)`,
        }}
      />
    ),
  },
  {
    id: 18,
    name: 'Isometric Diamond Sheen',
    vibe: 'Crisp diagonal diamond weave masked cleanly into the card corner',
    cardClass: 'bg-[#0D1119]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(30deg, ${ACCENT_HEX[a].main} 1px, transparent 1px), linear-gradient(150deg, ${ACCENT_HEX[a].secondary} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 90% 80%, black, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at 90% 80%, black, transparent 70%)',
        }}
      />
    ),
  },
  {
    id: 19,
    name: 'Vertical Pillar Glow',
    vibe: 'Soft vertical neon light curtain rising from the card footer',
    cardClass: 'bg-[#0B0E15]/95 border-white/15',
    renderInnerBg: (a) => (
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-35"
        style={{
          background: `linear-gradient(to top, ${ACCENT_HEX[a].main}33, transparent)`,
        }}
      />
    ),
  },
  {
    id: 20,
    name: 'Zen Ripple Arcs',
    vibe: 'Minimalist concentric sound/signal arcs from the icon corner',
    cardClass: 'bg-[#0C1018]/95 border-white/15',
    renderInnerBg: (a) => (
      <svg
        className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 opacity-25"
        viewBox="0 0 200 200"
        fill="none"
      >
        {[45, 75, 105, 135].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke={ACCENT_HEX[a].main}
            strokeWidth="1"
          />
        ))}
      </svg>
    ),
  },
];

export default function BgPreviewPage() {
  const [starred, setStarred] = useState<number[]>([1, 2, 6]);
  const [onlyStarred, setOnlyStarred] = useState(false);

  const toggleStar = (id: number) => {
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const visible = onlyStarred
    ? CARD_BG_OPTIONS.filter((o) => starred.includes(o.id))
    : CARD_BG_OPTIONS;

  return (
    <div className="min-h-screen bg-[#06080D] text-white pb-16">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Gateway
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#22D3EE]" />
                <h1 className="text-sm font-bold">
                  Portal Card Inner Background Lab — 20 Creative Options
                </h1>
              </div>
              <p className="text-[11px] text-zinc-400">
                20 artistic backgrounds applied directly inside the 3 portal boxes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyStarred((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                onlyStarred
                  ? 'border-amber-400 bg-amber-500/15 text-amber-400'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Shortlist ({starred.length})
            </button>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {visible.map((opt) => {
          const isStarred = starred.includes(opt.id);
          return (
            <section key={opt.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-[#22D3EE] text-[#041E24] px-2 py-0.5 text-xs font-mono font-bold">
                    #{String(opt.id).padStart(2, '0')}
                  </span>
                  <h2 className="text-sm font-bold">{opt.name}</h2>
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    — {opt.vibe}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStar(opt.id)}
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isStarred ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {isStarred ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PORTAL_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 flex flex-col justify-between min-h-[210px] ${opt.cardClass}`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 z-20 ${card.topBar}`} />
                    {opt.renderInnerBg(card.accent)}

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`h-10 w-10 rounded-xl border flex items-center justify-center ${card.iconBox}`}
                        >
                          <card.icon className="w-5 h-5" />
                        </div>
                        <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300">
                          {card.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-luma-title text-base sm:text-lg text-white">
                          {card.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`relative z-10 pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold ${card.accentText}`}
                    >
                      <span>{card.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
