'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
  Maximize2,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import {
  ALUMNI_DATA,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
} from '../../data/alumConnectData';

type ArtStyle =
  | 'ocean-waves'
  | 'topographic'
  | 'pcb-circuit'
  | 'radar-pulse'
  | 'prism-beams'
  | 'halftone-dots'
  | 'perspective-grid'
  | 'blueprint'
  | 'pixel-dither'
  | 'voronoi-facets'
  | 'orbital-rings'
  | 'bauhaus-geo'
  | 'silk-ribbons'
  | 'hex-mesh'
  | 'vertical-bars'
  | 'origami-folds'
  | 'swiss-grid'
  | 'liquid-chrome'
  | 'ink-wash'
  | 'constellation-pro';

interface ModeTokens {
  bgStyle: string;
  headerBg: string;
  cardBg: string;
  innerTileBg: string;
  borderColor: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accent2: string;
  ctaBg: string;
  ctaText: string;
  pillBg: string;
  artStroke: string;
  artOpacity: number;
}

interface PaletteOption {
  id: number;
  name: string;
  concept: string;
  art: ArtStyle;
  dark: ModeTokens;
  light: ModeTokens;
}

const PALETTES: PaletteOption[] = [
  {
    id: 1,
    name: 'Luma Ocean Caustics',
    concept: 'Flowing oceanic caustic waves + stippled shader grain in deep teal & cyan',
    art: 'ocean-waves',
    dark: {
      bgStyle:
        'radial-gradient(900px 520px at 14% 18%, rgba(0,211,230,0.34) 0%, transparent 60%), radial-gradient(820px 500px at 85% 80%, rgba(56,189,248,0.28) 0%, transparent 60%), linear-gradient(135deg, #021a26 0%, #05364a 52%, #07475e 100%)',
      headerBg: 'rgba(3, 28, 40, 0.65)',
      cardBg: 'rgba(5, 42, 58, 0.56)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(124,232,255,0.18)',
      textPrimary: '#FFFFFF',
      textMuted: '#BBE2EE',
      accent: '#7CE8FF',
      accent2: '#38BDF8',
      ctaBg: '#FFFFFF',
      ctaText: '#042433',
      pillBg: 'rgba(124,232,255,0.14)',
      artStroke: '#7CE8FF',
      artOpacity: 0.22,
    },
    light: {
      bgStyle:
        'radial-gradient(900px 520px at 14% 18%, rgba(6,182,212,0.18) 0%, transparent 60%), linear-gradient(135deg, #ECF9FD 0%, #D9F2FA 55%, #F2FBFE 100%)',
      headerBg: 'rgba(255,255,255,0.75)',
      cardBg: 'rgba(255,255,255,0.78)',
      innerTileBg: 'rgba(4,36,51,0.05)',
      borderColor: 'rgba(8,145,178,0.18)',
      textPrimary: '#042433',
      textMuted: '#3B6475',
      accent: '#0284C7',
      accent2: '#0891B2',
      ctaBg: '#042433',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(2,132,199,0.1)',
      artStroke: '#0284C7',
      artOpacity: 0.16,
    },
  },
  {
    id: 2,
    name: 'Topographic Talent Contours',
    concept: 'Cartographic elevation contours symbolizing rising campus builders',
    art: 'topographic',
    dark: {
      bgStyle:
        'radial-gradient(850px 500px at 80% 20%, rgba(245,158,11,0.20) 0%, transparent 58%), linear-gradient(135deg, #091512 0%, #102620 55%, #0B191C 100%)',
      headerBg: 'rgba(10, 24, 20, 0.72)',
      cardBg: 'rgba(14, 34, 28, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(110,231,183,0.18)',
      textPrimary: '#F4FBF8',
      textMuted: '#B3D6C8',
      accent: '#FBBF24',
      accent2: '#34D399',
      ctaBg: 'linear-gradient(90deg, #FBBF24 0%, #34D399 100%)',
      ctaText: '#062016',
      pillBg: 'rgba(251,191,36,0.14)',
      artStroke: '#34D399',
      artOpacity: 0.24,
    },
    light: {
      bgStyle:
        'radial-gradient(850px 500px at 80% 20%, rgba(245,158,11,0.14) 0%, transparent 58%), linear-gradient(135deg, #F6FAF7 0%, #E7F2EC 100%)',
      headerBg: 'rgba(255,255,255,0.8)',
      cardBg: 'rgba(255,255,255,0.82)',
      innerTileBg: 'rgba(6,78,59,0.05)',
      borderColor: 'rgba(5,150,105,0.18)',
      textPrimary: '#062C22',
      textMuted: '#3E6356',
      accent: '#059669',
      accent2: '#D97706',
      ctaBg: '#064E3B',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(5,150,105,0.1)',
      artStroke: '#059669',
      artOpacity: 0.16,
    },
  },
  {
    id: 3,
    name: 'Silicon PCB Circuit Graph',
    concept: 'Motherboard traces & glowing node pads — literal engineering talent graph',
    art: 'pcb-circuit',
    dark: {
      bgStyle:
        'radial-gradient(800px 500px at 20% 20%, rgba(37,99,235,0.30) 0%, transparent 60%), linear-gradient(135deg, #050914 0%, #0A152E 55%, #060C1C 100%)',
      headerBg: 'rgba(7, 13, 28, 0.76)',
      cardBg: 'rgba(11, 20, 44, 0.64)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(96,165,250,0.20)',
      textPrimary: '#F8FAFC',
      textMuted: '#9FBCE0',
      accent: '#38BDF8',
      accent2: '#818CF8',
      ctaBg: 'linear-gradient(90deg, #38BDF8 0%, #6366F1 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(56,189,248,0.15)',
      artStroke: '#38BDF8',
      artOpacity: 0.25,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F4F7FF 0%, #E8EFFD 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.84)',
      innerTileBg: 'rgba(30,58,138,0.05)',
      borderColor: 'rgba(37,99,235,0.18)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#2563EB',
      accent2: '#4F46E5',
      ctaBg: '#1E3A8A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(37,99,235,0.1)',
      artStroke: '#2563EB',
      artOpacity: 0.14,
    },
  },
  {
    id: 4,
    name: 'Talent Radar Pulse',
    concept: 'Concentric sonar rings radiating from campus builders to hiring alumni',
    art: 'radar-pulse',
    dark: {
      bgStyle:
        'radial-gradient(650px 650px at 50% 50%, rgba(16,185,129,0.22) 0%, transparent 65%), linear-gradient(135deg, #040B0E 0%, #091B20 100%)',
      headerBg: 'rgba(6, 16, 20, 0.74)',
      cardBg: 'rgba(10, 26, 30, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(52,211,153,0.18)',
      textPrimary: '#ECFDF5',
      textMuted: '#99C7BA',
      accent: '#34D399',
      accent2: '#22D3EE',
      ctaBg: '#34D399',
      ctaText: '#022C22',
      pillBg: 'rgba(52,211,153,0.15)',
      artStroke: '#34D399',
      artOpacity: 0.25,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F0FDF8 0%, #E0F7EE 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.84)',
      innerTileBg: 'rgba(5,150,105,0.05)',
      borderColor: 'rgba(5,150,105,0.18)',
      textPrimary: '#022C22',
      textMuted: '#3B6356',
      accent: '#059669',
      accent2: '#0891B2',
      ctaBg: '#065F46',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(5,150,105,0.1)',
      artStroke: '#059669',
      artOpacity: 0.16,
    },
  },
  {
    id: 5,
    name: 'Raycast Diagonal Prism Beams',
    concept: 'Sweeping diagonal refraction beams in ultraviolet, coral & cyan',
    art: 'prism-beams',
    dark: {
      bgStyle:
        'linear-gradient(135deg, #0C0717 0%, #170E2E 50%, #091624 100%)',
      headerBg: 'rgba(16, 10, 30, 0.72)',
      cardBg: 'rgba(22, 15, 42, 0.6)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(216,180,254,0.18)',
      textPrimary: '#FFFFFF',
      textMuted: '#D6CCF0',
      accent: '#F472B6',
      accent2: '#38BDF8',
      ctaBg: 'linear-gradient(90deg, #F472B6 0%, #A855F7 50%, #38BDF8 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(244,114,182,0.16)',
      artStroke: '#C084FC',
      artOpacity: 0.28,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 52%, #F0F9FF 100%)',
      headerBg: 'rgba(255,255,255,0.78)',
      cardBg: 'rgba(255,255,255,0.8)',
      innerTileBg: 'rgba(126,34,206,0.05)',
      borderColor: 'rgba(147,51,234,0.16)',
      textPrimary: '#1E1035',
      textMuted: '#574673',
      accent: '#9333EA',
      accent2: '#DB2777',
      ctaBg: 'linear-gradient(90deg, #9333EA 0%, #DB2777 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(147,51,234,0.1)',
      artStroke: '#A855F7',
      artOpacity: 0.16,
    },
  },
  {
    id: 6,
    name: 'Teenage Eng. Halftone Matrix',
    concept: 'Swiss hardware dot-matrix wave field with crisp tangerine-orange spark',
    art: 'halftone-dots',
    dark: {
      bgStyle: 'linear-gradient(135deg, #111113 0%, #1B1B1F 100%)',
      headerBg: 'rgba(20, 20, 24, 0.8)',
      cardBg: 'rgba(28, 28, 32, 0.72)',
      innerTileBg: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.13)',
      textPrimary: '#FAFAFA',
      textMuted: '#B4B4BC',
      accent: '#FF6B2C',
      accent2: '#FACC15',
      ctaBg: '#FF6B2C',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(255,107,44,0.16)',
      artStroke: '#FF6B2C',
      artOpacity: 0.28,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F5F4F0 0%, #EAE8E1 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.86)',
      innerTileBg: 'rgba(24,24,27,0.05)',
      borderColor: 'rgba(24,24,27,0.14)',
      textPrimary: '#18181B',
      textMuted: '#52525B',
      accent: '#EA580C',
      accent2: '#18181B',
      ctaBg: '#18181B',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(234,88,12,0.12)',
      artStroke: '#18181B',
      artOpacity: 0.16,
    },
  },
  {
    id: 7,
    name: '3D Horizon Perspective Grid',
    concept: 'Retro-futuristic vanishing-point grid with neon horizon glow',
    art: 'perspective-grid',
    dark: {
      bgStyle:
        'radial-gradient(900px 420px at 50% 42%, rgba(236,72,153,0.34) 0%, transparent 62%), linear-gradient(180deg, #090617 0%, #1B0F36 55%, #070A1A 100%)',
      headerBg: 'rgba(13, 9, 32, 0.74)',
      cardBg: 'rgba(20, 14, 46, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(244,114,182,0.20)',
      textPrimary: '#FFFFFF',
      textMuted: '#D6CCEC',
      accent: '#22D3EE',
      accent2: '#F472B6',
      ctaBg: 'linear-gradient(90deg, #22D3EE 0%, #EC4899 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(34,211,238,0.16)',
      artStroke: '#F472B6',
      artOpacity: 0.28,
    },
    light: {
      bgStyle:
        'radial-gradient(900px 420px at 50% 42%, rgba(56,189,248,0.22) 0%, transparent 62%), linear-gradient(180deg, #F5F3FF 0%, #E0F2FE 100%)',
      headerBg: 'rgba(255,255,255,0.8)',
      cardBg: 'rgba(255,255,255,0.82)',
      innerTileBg: 'rgba(49,46,129,0.05)',
      borderColor: 'rgba(99,102,241,0.18)',
      textPrimary: '#1E1B4B',
      textMuted: '#4C4A78',
      accent: '#DB2777',
      accent2: '#0284C7',
      ctaBg: 'linear-gradient(90deg, #4F46E5 0%, #DB2777 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(219,39,119,0.1)',
      artStroke: '#6366F1',
      artOpacity: 0.18,
    },
  },
  {
    id: 8,
    name: 'Engineering Cyanotype Blueprint',
    concept: 'Architectural drafting grid, crosshairs (+) & technical measurement lines',
    art: 'blueprint',
    dark: {
      bgStyle: 'linear-gradient(135deg, #072247 0%, #0B356B 55%, #061D3D 100%)',
      headerBg: 'rgba(7, 34, 71, 0.76)',
      cardBg: 'rgba(10, 46, 94, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.07)',
      borderColor: 'rgba(186,230,253,0.24)',
      textPrimary: '#FFFFFF',
      textMuted: '#BAE6FD',
      accent: '#7DD3FC',
      accent2: '#FDE047',
      ctaBg: '#FFFFFF',
      ctaText: '#072247',
      pillBg: 'rgba(125,211,252,0.18)',
      artStroke: '#BAE6FD',
      artOpacity: 0.24,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F0F6FF 0%, #E2EEFF 100%)',
      headerBg: 'rgba(255,255,255,0.85)',
      cardBg: 'rgba(255,255,255,0.88)',
      innerTileBg: 'rgba(29,78,216,0.05)',
      borderColor: 'rgba(37,99,235,0.20)',
      textPrimary: '#0A2247',
      textMuted: '#3E5A8A',
      accent: '#1D4ED8',
      accent2: '#0284C7',
      ctaBg: '#1D4ED8',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(29,78,216,0.1)',
      artStroke: '#3B82F6',
      artOpacity: 0.16,
    },
  },
  {
    id: 9,
    name: 'Pixel Dither (Departure Harmony)',
    concept: 'Stepped pixel-art mosaic bands crafted specifically to match Departure Mono',
    art: 'pixel-dither',
    dark: {
      bgStyle:
        'radial-gradient(850px 500px at 80% 20%, rgba(16,185,129,0.28) 0%, transparent 60%), linear-gradient(135deg, #090D16 0%, #131B2E 55%, #0D1F22 100%)',
      headerBg: 'rgba(11, 16, 28, 0.76)',
      cardBg: 'rgba(17, 24, 42, 0.66)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(110,231,183,0.18)',
      textPrimary: '#F8FAFC',
      textMuted: '#B6C7DC',
      accent: '#4ADE80',
      accent2: '#38BDF8',
      ctaBg: 'linear-gradient(90deg, #4ADE80 0%, #22D3EE 100%)',
      ctaText: '#052E16',
      pillBg: 'rgba(74,222,128,0.15)',
      artStroke: '#4ADE80',
      artOpacity: 0.22,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F5F7FA 0%, #E8F4F0 100%)',
      headerBg: 'rgba(255,255,255,0.84)',
      cardBg: 'rgba(255,255,255,0.88)',
      innerTileBg: 'rgba(15,23,42,0.05)',
      borderColor: 'rgba(5,150,105,0.18)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#059669',
      accent2: '#0284C7',
      ctaBg: '#0F172A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(5,150,105,0.1)',
      artStroke: '#10B981',
      artOpacity: 0.16,
    },
  },
  {
    id: 10,
    name: 'Crystal Voronoi Facets',
    concept: 'Low-poly stained-glass facets catching iridescent light',
    art: 'voronoi-facets',
    dark: {
      bgStyle:
        'radial-gradient(850px 520px at 15% 15%, rgba(14,165,233,0.28) 0%, transparent 60%), radial-gradient(850px 520px at 85% 85%, rgba(168,85,247,0.28) 0%, transparent 60%), linear-gradient(135deg, #090E1A 0%, #15142E 100%)',
      headerBg: 'rgba(12, 16, 32, 0.72)',
      cardBg: 'rgba(18, 22, 44, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(196,181,253,0.18)',
      textPrimary: '#FFFFFF',
      textMuted: '#CBD5E1',
      accent: '#38BDF8',
      accent2: '#C084FC',
      ctaBg: 'linear-gradient(90deg, #38BDF8 0%, #C084FC 100%)',
      ctaText: '#090E1A',
      pillBg: 'rgba(56,189,248,0.15)',
      artStroke: '#A78BFA',
      artOpacity: 0.25,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F0F9FF 0%, #F5F3FF 100%)',
      headerBg: 'rgba(255,255,255,0.8)',
      cardBg: 'rgba(255,255,255,0.82)',
      innerTileBg: 'rgba(79,70,229,0.05)',
      borderColor: 'rgba(99,102,241,0.16)',
      textPrimary: '#1E1B4B',
      textMuted: '#4C4A78',
      accent: '#4F46E5',
      accent2: '#0284C7',
      ctaBg: '#312E81',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(79,70,229,0.1)',
      artStroke: '#6366F1',
      artOpacity: 0.16,
    },
  },
  {
    id: 11,
    name: 'Orbital Moonshot Rings',
    concept: 'Elliptical satellite trajectories orbiting the ITER talent core',
    art: 'orbital-rings',
    dark: {
      bgStyle:
        'radial-gradient(800px 500px at 50% 45%, rgba(250,204,21,0.14) 0%, transparent 60%), linear-gradient(135deg, #050814 0%, #0D1633 55%, #070B1A 100%)',
      headerBg: 'rgba(7, 11, 26, 0.76)',
      cardBg: 'rgba(12, 20, 46, 0.64)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(253,224,71,0.18)',
      textPrimary: '#FEFCE8',
      textMuted: '#CBD5E1',
      accent: '#FACC15',
      accent2: '#60A5FA',
      ctaBg: 'linear-gradient(90deg, #FACC15 0%, #FB923C 100%)',
      ctaText: '#1E1B08',
      pillBg: 'rgba(250,204,21,0.14)',
      artStroke: '#FACC15',
      artOpacity: 0.22,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FEFDF5 0%, #EFF4FF 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.85)',
      innerTileBg: 'rgba(30,58,138,0.05)',
      borderColor: 'rgba(30,58,138,0.16)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#B45309',
      accent2: '#1D4ED8',
      ctaBg: '#1E3A8A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(180,83,9,0.1)',
      artStroke: '#D97706',
      artOpacity: 0.16,
    },
  },
  {
    id: 12,
    name: 'Bauhaus Editorial Geometry',
    concept: 'Bold artistic Bauhaus circles, arcs & blocks in primary cobalt, crimson & gold',
    art: 'bauhaus-geo',
    dark: {
      bgStyle: 'linear-gradient(135deg, #121216 0%, #1B1C24 100%)',
      headerBg: 'rgba(20, 20, 26, 0.8)',
      cardBg: 'rgba(28, 29, 36, 0.72)',
      innerTileBg: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.14)',
      textPrimary: '#FAFAFA',
      textMuted: '#C4C4CC',
      accent: '#FACC15',
      accent2: '#F43F5E',
      ctaBg: '#3B82F6',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(59,130,246,0.18)',
      artStroke: '#3B82F6',
      artOpacity: 0.26,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FAF7F2 0%, #F1ECE1 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.86)',
      innerTileBg: 'rgba(24,24,27,0.05)',
      borderColor: 'rgba(24,24,27,0.14)',
      textPrimary: '#18181B',
      textMuted: '#52525B',
      accent: '#2563EB',
      accent2: '#E11D48',
      ctaBg: '#18181B',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(37,99,235,0.1)',
      artStroke: '#2563EB',
      artOpacity: 0.16,
    },
  },
  {
    id: 13,
    name: 'Kinetic Silk Ribbons',
    concept: 'Smooth layered audio/wave ribbons flowing behind frosted glass',
    art: 'silk-ribbons',
    dark: {
      bgStyle:
        'radial-gradient(850px 500px at 80% 20%, rgba(244,63,94,0.24) 0%, transparent 60%), linear-gradient(135deg, #120918 0%, #24102B 55%, #12152E 100%)',
      headerBg: 'rgba(22, 11, 28, 0.72)',
      cardBg: 'rgba(32, 16, 40, 0.62)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(253,164,175,0.18)',
      textPrimary: '#FFF5F7',
      textMuted: '#E5CAD6',
      accent: '#FB7185',
      accent2: '#C084FC',
      ctaBg: 'linear-gradient(90deg, #FB7185 0%, #C084FC 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(251,113,133,0.16)',
      artStroke: '#FB7185',
      artOpacity: 0.26,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FFF5F7 0%, #F5F3FF 100%)',
      headerBg: 'rgba(255,255,255,0.8)',
      cardBg: 'rgba(255,255,255,0.82)',
      innerTileBg: 'rgba(190,18,60,0.05)',
      borderColor: 'rgba(219,39,119,0.16)',
      textPrimary: '#3B0A18',
      textMuted: '#6D4250',
      accent: '#E11D48',
      accent2: '#9333EA',
      ctaBg: 'linear-gradient(90deg, #E11D48 0%, #9333EA 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(225,29,72,0.1)',
      artStroke: '#F43F5E',
      artOpacity: 0.16,
    },
  },
  {
    id: 14,
    name: 'Hexagonal Hive Mesh',
    concept: 'Interlocking honeycomb cells representing student-alumni-company squads',
    art: 'hex-mesh',
    dark: {
      bgStyle:
        'radial-gradient(850px 500px at 20% 20%, rgba(245,158,11,0.22) 0%, transparent 60%), linear-gradient(135deg, #0E1117 0%, #181E29 100%)',
      headerBg: 'rgba(16, 20, 28, 0.76)',
      cardBg: 'rgba(22, 28, 38, 0.66)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(251,191,36,0.18)',
      textPrimary: '#FFFBEB',
      textMuted: '#CBD5E1',
      accent: '#FBBF24',
      accent2: '#38BDF8',
      ctaBg: '#FBBF24',
      ctaText: '#1C1404',
      pillBg: 'rgba(251,191,36,0.15)',
      artStroke: '#FBBF24',
      artOpacity: 0.2,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FFFDF5 0%, #F1F5F9 100%)',
      headerBg: 'rgba(255,255,255,0.84)',
      cardBg: 'rgba(255,255,255,0.86)',
      innerTileBg: 'rgba(180,83,9,0.05)',
      borderColor: 'rgba(217,119,6,0.18)',
      textPrimary: '#1E293B',
      textMuted: '#475569',
      accent: '#D97706',
      accent2: '#0284C7',
      ctaBg: '#B45309',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(217,119,6,0.1)',
      artStroke: '#D97706',
      artOpacity: 0.14,
    },
  },
  {
    id: 15,
    name: 'Telemetry Equalizer Bars',
    concept: 'Vertical architectural light-bars pulsing like live sprint deployments',
    art: 'vertical-bars',
    dark: {
      bgStyle: 'linear-gradient(180deg, #06090F 0%, #0E1726 100%)',
      headerBg: 'rgba(8, 12, 20, 0.78)',
      cardBg: 'rgba(14, 22, 36, 0.66)',
      innerTileBg: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(56,189,248,0.18)',
      textPrimary: '#FFFFFF',
      textMuted: '#94A3B8',
      accent: '#22D3EE',
      accent2: '#34D399',
      ctaBg: 'linear-gradient(90deg, #22D3EE 0%, #34D399 100%)',
      ctaText: '#041E24',
      pillBg: 'rgba(34,211,238,0.14)',
      artStroke: '#22D3EE',
      artOpacity: 0.22,
    },
    light: {
      bgStyle: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
      headerBg: 'rgba(255,255,255,0.86)',
      cardBg: 'rgba(255,255,255,0.88)',
      innerTileBg: 'rgba(15,23,42,0.05)',
      borderColor: 'rgba(15,23,42,0.14)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#0891B2',
      accent2: '#059669',
      ctaBg: '#0F172A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(8,145,178,0.1)',
      artStroke: '#0284C7',
      artOpacity: 0.14,
    },
  },
  {
    id: 16,
    name: 'Origami Folded Planes',
    concept: 'Sharp diagonal light-and-shadow paper folds with mint & indigo contrast',
    art: 'origami-folds',
    dark: {
      bgStyle: 'linear-gradient(135deg, #0B121F 0%, #142238 100%)',
      headerBg: 'rgba(13, 21, 35, 0.76)',
      cardBg: 'rgba(18, 30, 50, 0.65)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(110,231,183,0.18)',
      textPrimary: '#F8FAFC',
      textMuted: '#B8C9DF',
      accent: '#6EE7B7',
      accent2: '#818CF8',
      ctaBg: '#6EE7B7',
      ctaText: '#062018',
      pillBg: 'rgba(110,231,183,0.15)',
      artStroke: '#6EE7B7',
      artOpacity: 0.2,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F4FBF9 0%, #EEF2FF 100%)',
      headerBg: 'rgba(255,255,255,0.84)',
      cardBg: 'rgba(255,255,255,0.86)',
      innerTileBg: 'rgba(15,23,42,0.05)',
      borderColor: 'rgba(13,148,136,0.16)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#0D9488',
      accent2: '#4F46E5',
      ctaBg: '#0F172A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(13,148,136,0.1)',
      artStroke: '#0D9488',
      artOpacity: 0.14,
    },
  },
  {
    id: 17,
    name: 'Swiss Editorial Zine Grid',
    concept: 'Clean gallery gridlines & registration marks with vermilion accent',
    art: 'swiss-grid',
    dark: {
      bgStyle: 'linear-gradient(180deg, #101012 0%, #18181B 100%)',
      headerBg: 'rgba(18, 18, 22, 0.82)',
      cardBg: 'rgba(26, 26, 30, 0.74)',
      innerTileBg: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.13)',
      textPrimary: '#FAFAFA',
      textMuted: '#A1A1AA',
      accent: '#F43F5E',
      accent2: '#38BDF8',
      ctaBg: '#F43F5E',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(244,63,94,0.16)',
      artStroke: '#F43F5E',
      artOpacity: 0.22,
    },
    light: {
      bgStyle: 'linear-gradient(180deg, #FAF9F6 0%, #F2F0EA 100%)',
      headerBg: 'rgba(250,249,246,0.86)',
      cardBg: 'rgba(255,255,255,0.88)',
      innerTileBg: 'rgba(24,24,27,0.04)',
      borderColor: 'rgba(24,24,27,0.14)',
      textPrimary: '#09090B',
      textMuted: '#52525B',
      accent: '#E11D48',
      accent2: '#2563EB',
      ctaBg: '#09090B',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(225,29,72,0.1)',
      artStroke: '#18181B',
      artOpacity: 0.12,
    },
  },
  {
    id: 18,
    name: 'Liquid Chrome Reflections',
    concept: 'Sculptural metallic specular arcs over deep obsidian & pearl',
    art: 'liquid-chrome',
    dark: {
      bgStyle:
        'radial-gradient(800px 500px at 25% 20%, rgba(148,163,184,0.22) 0%, transparent 60%), linear-gradient(135deg, #07080A 0%, #14171F 55%, #090A0E 100%)',
      headerBg: 'rgba(12, 14, 18, 0.78)',
      cardBg: 'rgba(20, 23, 30, 0.68)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(226,232,240,0.18)',
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
      accent: '#E2E8F0',
      accent2: '#38BDF8',
      ctaBg: 'linear-gradient(90deg, #F8FAFC 0%, #94A3B8 100%)',
      ctaText: '#090A0E',
      pillBg: 'rgba(226,232,240,0.14)',
      artStroke: '#CBD5E1',
      artOpacity: 0.24,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      headerBg: 'rgba(255,255,255,0.84)',
      cardBg: 'rgba(255,255,255,0.86)',
      innerTileBg: 'rgba(15,23,42,0.05)',
      borderColor: 'rgba(100,116,139,0.20)',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      accent: '#334155',
      accent2: '#0284C7',
      ctaBg: '#0F172A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(51,65,85,0.1)',
      artStroke: '#64748B',
      artOpacity: 0.16,
    },
  },
  {
    id: 19,
    name: 'Sumi-e Ink & Jade Wash',
    concept: 'Organic brushstrokes & botanical jade-indigo wash with warm paper feel',
    art: 'ink-wash',
    dark: {
      bgStyle:
        'radial-gradient(850px 520px at 20% 20%, rgba(20,184,166,0.26) 0%, transparent 60%), radial-gradient(850px 520px at 80% 80%, rgba(99,102,241,0.26) 0%, transparent 60%), linear-gradient(135deg, #091214 0%, #102024 100%)',
      headerBg: 'rgba(11, 22, 24, 0.74)',
      cardBg: 'rgba(16, 32, 36, 0.64)',
      innerTileBg: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(153,246,228,0.16)',
      textPrimary: '#F0FDFA',
      textMuted: '#B2D8D4',
      accent: '#5EEAD4',
      accent2: '#A5B4FC',
      ctaBg: '#5EEAD4',
      ctaText: '#042F2E',
      pillBg: 'rgba(94,234,212,0.14)',
      artStroke: '#5EEAD4',
      artOpacity: 0.24,
    },
    light: {
      bgStyle: 'linear-gradient(135deg, #FBFBF9 0%, #ECF5F3 100%)',
      headerBg: 'rgba(255,255,255,0.82)',
      cardBg: 'rgba(255,255,255,0.84)',
      innerTileBg: 'rgba(15,118,110,0.05)',
      borderColor: 'rgba(15,118,110,0.16)',
      textPrimary: '#0B2926',
      textMuted: '#466662',
      accent: '#0F766E',
      accent2: '#4F46E5',
      ctaBg: '#134E4A',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(15,118,110,0.1)',
      artStroke: '#0F766E',
      artOpacity: 0.14,
    },
  },
  {
    id: 20,
    name: 'Flagship Living Talent Graph',
    concept: 'Multi-layer bezier network arcs + fine drafting grid + Luma Ocean prism',
    art: 'constellation-pro',
    dark: {
      bgStyle:
        'radial-gradient(850px 520px at 12% 16%, rgba(0,211,230,0.34) 0%, transparent 58%), radial-gradient(800px 500px at 88% 20%, rgba(99,102,241,0.34) 0%, transparent 58%), radial-gradient(800px 500px at 55% 92%, rgba(244,114,182,0.24) 0%, transparent 58%), linear-gradient(135deg, #041421 0%, #092038 52%, #131229 100%)',
      headerBg: 'rgba(6, 22, 38, 0.68)',
      cardBg: 'rgba(9, 28, 48, 0.56)',
      innerTileBg: 'rgba(255,255,255,0.07)',
      borderColor: 'rgba(124,232,255,0.18)',
      textPrimary: '#FFFFFF',
      textMuted: '#CBE2EE',
      accent: '#7CE8FF',
      accent2: '#F472B6',
      ctaBg: 'linear-gradient(90deg, #7CE8FF 0%, #818CF8 55%, #F472B6 100%)',
      ctaText: '#051524',
      pillBg: 'rgba(124,232,255,0.15)',
      artStroke: '#7CE8FF',
      artOpacity: 0.26,
    },
    light: {
      bgStyle:
        'radial-gradient(850px 520px at 12% 16%, rgba(6,182,212,0.18) 0%, transparent 60%), radial-gradient(800px 500px at 88% 20%, rgba(99,102,241,0.16) 0%, transparent 60%), linear-gradient(135deg, #EFFBFF 0%, #F2F4FF 55%, #FFF4F8 100%)',
      headerBg: 'rgba(255,255,255,0.78)',
      cardBg: 'rgba(255,255,255,0.8)',
      innerTileBg: 'rgba(15,23,42,0.05)',
      borderColor: 'rgba(37,99,235,0.16)',
      textPrimary: '#082032',
      textMuted: '#3E5A70',
      accent: '#0284C7',
      accent2: '#7C3AED',
      ctaBg: 'linear-gradient(90deg, #0284C7 0%, #6366F1 100%)',
      ctaText: '#FFFFFF',
      pillBg: 'rgba(2,132,199,0.1)',
      artStroke: '#0284C7',
      artOpacity: 0.16,
    },
  },
];

function ArtisticBackdrop({
  art,
  stroke,
  accent2,
  opacity,
}: {
  art: ArtStyle;
  stroke: string;
  accent2: string;
  opacity: number;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 620"
      preserveAspectRatio="none"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {art === 'ocean-waves' && (
        <>
          <path d="M-40 180 Q 260 60 580 190 T 1240 160" stroke={stroke} strokeWidth="2" />
          <path d="M-40 240 Q 320 120 640 250 T 1240 220" stroke={accent2} strokeWidth="1.5" />
          <path d="M-40 320 Q 280 210 620 330 T 1240 290" stroke={stroke} strokeWidth="1.2" />
          <path d="M-40 430 Q 360 320 700 440 T 1240 400" stroke={accent2} strokeWidth="1.5" />
          <path d="M-40 520 Q 300 430 660 530 T 1240 500" stroke={stroke} strokeWidth="1" />
        </>
      )}

      {art === 'topographic' && (
        <>
          <ellipse cx="920" cy="140" rx="220" ry="120" stroke={stroke} strokeWidth="1.4" />
          <ellipse cx="920" cy="140" rx="310" ry="175" stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="920" cy="140" rx="410" ry="235" stroke={accent2} strokeWidth="1.2" strokeDasharray="6 6" />
          <ellipse cx="220" cy="480" rx="260" ry="150" stroke={stroke} strokeWidth="1.3" />
          <ellipse cx="220" cy="480" rx="380" ry="220" stroke={stroke} strokeWidth="1" />
        </>
      )}

      {art === 'pcb-circuit' && (
        <>
          <path d="M40 110 H240 L290 160 H540 L590 110 H920" stroke={stroke} strokeWidth="1.6" />
          <path d="M80 480 H320 L380 420 H740 L800 480 H1120" stroke={accent2} strokeWidth="1.6" />
          <path d="M980 40 V190 L910 260 V440" stroke={stroke} strokeWidth="1.4" />
          <circle cx="240" cy="110" r="5" fill={stroke} />
          <circle cx="590" cy="110" r="6" fill={accent2} />
          <circle cx="380" cy="420" r="5" fill={accent2} />
          <circle cx="910" cy="260" r="6" fill={stroke} />
        </>
      )}

      {art === 'radar-pulse' && (
        <>
          <circle cx="600" cy="310" r="95" stroke={stroke} strokeWidth="1.4" />
          <circle cx="600" cy="310" r="190" stroke={stroke} strokeWidth="1.2" strokeDasharray="6 6" />
          <circle cx="600" cy="310" r="295" stroke={accent2} strokeWidth="1.2" />
          <circle cx="600" cy="310" r="410" stroke={stroke} strokeWidth="1" />
          <line x1="600" y1="310" x2="1080" y2="90" stroke={accent2} strokeWidth="1.6" />
        </>
      )}

      {art === 'prism-beams' && (
        <>
          <polygon points="-80,0 220,0 620,620 260,620" fill={stroke} fillOpacity="0.18" />
          <polygon points="340,0 560,0 980,620 720,620" fill={accent2} fillOpacity="0.15" />
          <line x1="120" y1="0" x2="520" y2="620" stroke={stroke} strokeWidth="1.5" />
          <line x1="480" y1="0" x2="900" y2="620" stroke={accent2} strokeWidth="1.5" />
        </>
      )}

      {art === 'halftone-dots' &&
        Array.from({ length: 14 }).map((_, col) =>
          Array.from({ length: 7 }).map((__, row) => (
            <circle
              key={`${col}-${row}`}
              cx={55 + col * 86}
              cy={50 + row * 86}
              r={1.5 + ((col + row) % 4) * 1.1}
              fill={col % 3 === 0 ? accent2 : stroke}
            />
          ))
        )}

      {art === 'perspective-grid' && (
        <>
          <line x1="0" y1="260" x2="1200" y2="260" stroke={accent2} strokeWidth="1.5" />
          {[-500, -320, -160, 0, 160, 320, 500].map((dx) => (
            <line key={dx} x1="600" y1="260" x2={600 + dx * 1.9} y2="620" stroke={stroke} strokeWidth="1.2" />
          ))}
          {[300, 345, 405, 480, 565].map((y) => (
            <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke={stroke} strokeWidth="1" />
          ))}
        </>
      )}

      {art === 'blueprint' && (
        <>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="620" stroke={stroke} strokeWidth="0.7" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 75} x2="1200" y2={i * 75} stroke={stroke} strokeWidth="0.7" />
          ))}
          <circle cx="940" cy="180" r="90" stroke={accent2} strokeWidth="1.4" strokeDasharray="5 5" />
          <path d="M925 180 H955 M940 165 V195" stroke={accent2} strokeWidth="1.5" />
        </>
      )}

      {art === 'pixel-dither' &&
        Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x={(i * 97) % 1160}
            y={((i * 53) % 540) + 20}
            width="28"
            height="28"
            fill={i % 2 === 0 ? stroke : accent2}
            fillOpacity="0.24"
          />
        ))}

      {art === 'voronoi-facets' && (
        <>
          <polygon points="0,0 360,0 210,240 0,180" stroke={stroke} strokeWidth="1.3" fill={stroke} fillOpacity="0.06" />
          <polygon points="360,0 780,0 590,210 210,240" stroke={accent2} strokeWidth="1.3" />
          <polygon points="780,0 1200,0 1200,260 890,220 590,210" stroke={stroke} strokeWidth="1.3" fill={accent2} fillOpacity="0.06" />
          <polygon points="210,240 590,210 480,470 120,440" stroke={stroke} strokeWidth="1.2" />
          <polygon points="590,210 890,220 1050,510 480,470" stroke={accent2} strokeWidth="1.2" />
        </>
      )}

      {art === 'orbital-rings' && (
        <>
          <ellipse cx="600" cy="310" rx="460" ry="150" transform="rotate(-14 600 310)" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="600" cy="310" rx="340" ry="110" transform="rotate(16 600 310)" stroke={accent2} strokeWidth="1.4" strokeDasharray="6 6" />
          <circle cx="965" cy="185" r="8" fill={stroke} />
          <circle cx="290" cy="230" r="6" fill={accent2} />
        </>
      )}

      {art === 'bauhaus-geo' && (
        <>
          <circle cx="1010" cy="145" r="115" fill={stroke} fillOpacity="0.22" />
          <rect x="820" y="340" width="220" height="220" stroke={accent2} strokeWidth="2.5" />
          <path d="M80 620 A 220 220 0 0 1 520 620" stroke={stroke} strokeWidth="2.5" />
        </>
      )}

      {art === 'silk-ribbons' && (
        <>
          <path d="M0 140 C 320 20, 740 280, 1200 100" stroke={stroke} strokeWidth="2.2" />
          <path d="M0 175 C 340 55, 720 315, 1200 135" stroke={accent2} strokeWidth="1.6" />
          <path d="M0 440 C 380 310, 800 540, 1200 390" stroke={stroke} strokeWidth="2" />
          <path d="M0 475 C 380 345, 800 575, 1200 425" stroke={accent2} strokeWidth="1.4" />
        </>
      )}

      {art === 'hex-mesh' &&
        Array.from({ length: 8 }).map((_, c) =>
          Array.from({ length: 4 }).map((__, r) => {
            const cx = 90 + c * 150 + (r % 2) * 75;
            const cy = 85 + r * 135;
            return (
              <polygon
                key={`${c}-${r}`}
                points={`${cx},${cy - 44} ${cx + 38},${cy - 22} ${cx + 38},${cy + 22} ${cx},${cy + 44} ${cx - 38},${cy + 22} ${cx - 38},${cy - 22}`}
                stroke={c % 2 === 0 ? stroke : accent2}
                strokeWidth="1.2"
              />
            );
          })
        )}

      {art === 'vertical-bars' &&
        Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x={30 + i * 50}
            y={620 - ((i * 67) % 420) - 90}
            width="18"
            height={((i * 67) % 420) + 90}
            rx="9"
            fill={i % 2 === 0 ? stroke : accent2}
            fillOpacity="0.22"
          />
        ))}

      {art === 'origami-folds' && (
        <>
          <polygon points="0,0 520,0 280,620 0,620" fill={stroke} fillOpacity="0.12" />
          <polygon points="520,0 1200,0 920,380 280,620" fill={accent2} fillOpacity="0.09" />
          <line x1="520" y1="0" x2="280" y2="620" stroke={stroke} strokeWidth="1.6" />
          <line x1="280" y1="620" x2="920" y2="380" stroke={accent2} strokeWidth="1.4" />
        </>
      )}

      {art === 'swiss-grid' && (
        <>
          <line x1="300" y1="0" x2="300" y2="620" stroke={stroke} strokeWidth="1" />
          <line x1="600" y1="0" x2="600" y2="620" stroke={stroke} strokeWidth="1" />
          <line x1="900" y1="0" x2="900" y2="620" stroke={stroke} strokeWidth="1" />
          <line x1="0" y1="205" x2="1200" y2="205" stroke={stroke} strokeWidth="1" />
          <line x1="0" y1="415" x2="1200" y2="415" stroke={stroke} strokeWidth="1" />
          <circle cx="900" cy="205" r="24" stroke={accent2} strokeWidth="2" />
        </>
      )}

      {art === 'liquid-chrome' && (
        <>
          <path d="M-40 500 C 260 180, 560 440, 1240 120" stroke={stroke} strokeWidth="18" strokeOpacity="0.16" />
          <path d="M-40 500 C 260 180, 560 440, 1240 120" stroke={accent2} strokeWidth="2" />
        </>
      )}

      {art === 'ink-wash' && (
        <>
          <path d="M80 140 Q 320 40 480 210 T 940 160" stroke={stroke} strokeWidth="28" strokeLinecap="round" strokeOpacity="0.14" />
          <path d="M220 480 Q 520 340 780 480 T 1140 420" stroke={accent2} strokeWidth="22" strokeLinecap="round" strokeOpacity="0.14" />
        </>
      )}

      {art === 'constellation-pro' && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={i * 105} y1="0" x2={i * 105} y2="620" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.35" />
          ))}
          <path d="M120 120 Q 420 40 600 260 T 1060 140" stroke={stroke} strokeWidth="1.8" />
          <path d="M180 490 Q 480 340 600 260 T 1020 460" stroke={accent2} strokeWidth="1.6" strokeDasharray="5 5" />
          <circle cx="120" cy="120" r="6" fill={stroke} />
          <circle cx="600" cy="260" r="10" fill={stroke} />
          <circle cx="600" cy="260" r="24" stroke={stroke} strokeWidth="1.2" />
          <circle cx="1060" cy="140" r="7" fill={accent2} />
          <circle cx="1020" cy="460" r="7" fill={stroke} />
        </>
      )}
    </svg>
  );
}

function AlumConnectSnapshot({
  art,
  tokens,
  projectCount,
  dealCount,
  compact = true,
}: {
  art: ArtStyle;
  tokens: ModeTokens;
  projectCount: number;
  dealCount: number;
  compact?: boolean;
}) {
  const portals = [
    {
      title: 'Student Network',
      desc: 'Publish GitHub repository showcases, track sprint tasks, and follow what campus squads are shipping.',
      cta: 'Open Student Feed',
      badge: 'For Builders',
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      title: 'Alumni & Hiring',
      desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
      cta: 'Open Alumni Marketplace',
      badge: 'For Recruiters',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      title: 'Dean & T&P Cell',
      desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
      cta: 'Open Placement Telemetry',
      badge: 'For Leadership',
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className="font-luma-body relative overflow-hidden rounded-2xl border transition-all"
      style={{
        background: tokens.bgStyle,
        borderColor: tokens.borderColor,
        color: tokens.textPrimary,
      }}
    >
      <ArtisticBackdrop
        art={art}
        stroke={tokens.artStroke}
        accent2={tokens.accent2}
        opacity={tokens.artOpacity}
      />

      {/* Top Nav */}
      <div
        className="relative z-10 border-b px-4 sm:px-6 h-12 flex items-center justify-between gap-3 backdrop-blur-xl"
        style={{ background: tokens.headerBg, borderColor: tokens.borderColor }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-lg border flex items-center justify-center p-1"
            style={{ background: tokens.innerTileBg, borderColor: tokens.borderColor }}
          >
            <img src="/logo.png" alt="AlmaConnect" className="h-full w-full object-contain" />
          </div>
          <span className="font-luma-title text-xs sm:text-sm">AlmaConnect</span>
        </div>

        <div
          className="hidden sm:flex items-center gap-2 rounded-full border px-3 py-0.5 text-[11px]"
          style={{
            background: tokens.pillBg,
            borderColor: tokens.borderColor,
            color: tokens.textMuted,
          }}
        >
          <span>Quick Jump:</span>
          <span className="font-mono" style={{ color: tokens.accent }}>
            /student • /alumni • /dean
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 ${compact ? 'p-4 sm:p-5 space-y-3' : 'p-6 sm:p-8 space-y-5'}`}>
        <div
          className="rounded-2xl border backdrop-blur-xl p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
          style={{ background: tokens.cardBg, borderColor: tokens.borderColor }}
        >
          <div className="lg:col-span-7 space-y-3">
            <h3
              className={`font-luma-title leading-[1.15] ${
                compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-[42px]'
              }`}
            >
              A living graph of campus{' '}
              <span style={{ color: tokens.accent }}>engineering talent.</span>
            </h3>
            <p className="text-xs sm:text-[14px] leading-[1.6]" style={{ color: tokens.textMuted }}>
              Connecting{' '}
              <strong style={{ color: tokens.textPrimary }}>
                {projectCount} verified student builds
              </strong>{' '}
              directly to alumni mentors, 5-minute architecture roasts, and{' '}
              <strong style={{ color: tokens.accent }}>{dealCount} active hiring deals</strong>{' '}
              across ITER.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ background: tokens.ctaBg, color: tokens.ctaText }}
              >
                Join the Graph <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold"
                style={{
                  background: tokens.innerTileBg,
                  borderColor: tokens.borderColor,
                  color: tokens.textPrimary,
                }}
              >
                Explore Talent Nodes
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
            <div
              className="rounded-xl border p-3.5"
              style={{ background: tokens.innerTileBg, borderColor: tokens.borderColor }}
            >
              <div className="text-[10px] font-mono uppercase" style={{ color: tokens.textMuted }}>
                Repositories
              </div>
              <div className="font-luma-title text-2xl mt-1">{projectCount}</div>
              <div className="text-[11px]" style={{ color: tokens.textMuted }}>
                Live Campus Builds
              </div>
            </div>
            <div
              className="rounded-xl border p-3.5"
              style={{ background: tokens.innerTileBg, borderColor: tokens.borderColor }}
            >
              <div className="text-[10px] font-mono uppercase" style={{ color: tokens.textMuted }}>
                Marketplace
              </div>
              <div className="font-luma-title text-2xl mt-1" style={{ color: tokens.accent }}>
                {dealCount}
              </div>
              <div className="text-[11px]" style={{ color: tokens.textMuted }}>
                Deals &amp; Paid Bounties
              </div>
            </div>
            <div
              className="col-span-2 rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2"
              style={{ background: tokens.innerTileBg, borderColor: tokens.borderColor }}
            >
              <div>
                <div className="text-xs font-semibold">Real-Time Proof-of-Work Sync</div>
                <div className="text-[11px]" style={{ color: tokens.textMuted }}>
                  {STUDENTS_DATA.length} Students ↔ {ALUMNI_DATA.length} Alumni ↔ {OFFERS_DATA.length} Offers
                </div>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shrink-0"
                style={{
                  background: tokens.pillBg,
                  borderColor: tokens.borderColor,
                  color: tokens.accent,
                }}
              >
                <CheckCircle2 className="w-3 h-3" /> 100% Verified
              </span>
            </div>
          </div>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {portals.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border backdrop-blur-xl p-4 flex flex-col justify-between gap-3"
              style={{ background: tokens.cardBg, borderColor: tokens.borderColor }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className="h-8 w-8 rounded-lg border flex items-center justify-center"
                    style={{
                      background: tokens.pillBg,
                      borderColor: tokens.borderColor,
                      color: tokens.accent,
                    }}
                  >
                    {p.icon}
                  </div>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: tokens.innerTileBg,
                      borderColor: tokens.borderColor,
                      color: tokens.textMuted,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
                <div className="font-luma-title text-sm sm:text-base">{p.title}</div>
                <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: tokens.textMuted }}>
                  {p.desc}
                </p>
              </div>
              <div
                className="pt-2 border-t flex items-center justify-between text-[11px] font-semibold"
                style={{ borderColor: tokens.borderColor, color: tokens.accent }}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ThemePalettesPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);

  const [globalMode, setGlobalMode] = useState<'dark' | 'light'>('dark');
  const [perOptionMode, setPerOptionMode] = useState<Record<number, 'dark' | 'light'>>({});
  const [fullscreenOption, setFullscreenOption] = useState<PaletteOption | null>(null);

  const getMode = (id: number) => perOptionMode[id] ?? globalMode;

  const setAllMode = (mode: 'dark' | 'light') => {
    setGlobalMode(mode);
    setPerOptionMode({});
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Alum Connect — 20 Artistic &amp; Out-of-the-Box Background Concepts (Light &amp; Dark)
            </h1>
            <p className="text-xs text-[#52525B]">
              Crafted for hiring alumni &amp; founders: bespoke geometric, blueprint, contour, radar, pixel &amp; prism artworks behind the exact same fonts, sizes, positions &amp; content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllMode('light')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                globalMode === 'light'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-white text-zinc-700 border-[#E4E4E7] hover:bg-zinc-50'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> All Light
            </button>
            <button
              type="button"
              onClick={() => setAllMode('dark')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                globalMode === 'dark'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-white text-zinc-700 border-[#E4E4E7] hover:bg-zinc-50'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> All Dark
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        {PALETTES.map((opt) => {
          const mode = getMode(opt.id);
          const tokens = mode === 'dark' ? opt.dark : opt.light;
          return (
            <section key={opt.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white shrink-0">
                    {opt.id}
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#18181B]">{opt.name}</h2>
                    <p className="text-xs text-[#52525B]">{opt.concept}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-full border border-[#E4E4E7] bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setPerOptionMode((p) => ({ ...p, [opt.id]: 'light' }))}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        mode === 'light' ? 'bg-[#18181B] text-white' : 'text-zinc-600'
                      }`}
                    >
                      <Sun className="w-3 h-3" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setPerOptionMode((p) => ({ ...p, [opt.id]: 'dark' }))}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        mode === 'dark' ? 'bg-[#18181B] text-white' : 'text-zinc-600'
                      }`}
                    >
                      <Moon className="w-3 h-3" /> Dark
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFullscreenOption(opt)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] bg-white hover:bg-zinc-50 px-3 py-1.5 text-[11px] font-semibold text-zinc-800"
                  >
                    <Maximize2 className="w-3 h-3" /> Fullscreen
                  </button>
                </div>
              </div>

              <AlumConnectSnapshot
                art={opt.art}
                tokens={tokens}
                projectCount={projectCount}
                dealCount={dealCount}
                compact
              />
            </section>
          );
        })}
      </main>

      {fullscreenOption && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 sm:p-8 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-6xl space-y-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-white text-black px-2.5 py-0.5 text-xs font-bold">
                  Option {fullscreenOption.id}
                </span>
                <span className="font-bold text-sm">{fullscreenOption.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPerOptionMode((p) => ({
                      ...p,
                      [fullscreenOption.id]:
                        getMode(fullscreenOption.id) === 'dark' ? 'light' : 'dark',
                    }))
                  }
                  className="rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-xs font-semibold"
                >
                  Switch to {getMode(fullscreenOption.id) === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenOption(null)}
                  className="rounded-full bg-white/15 hover:bg-white/25 p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <AlumConnectSnapshot
              art={fullscreenOption.art}
              tokens={
                getMode(fullscreenOption.id) === 'dark'
                  ? fullscreenOption.dark
                  : fullscreenOption.light
              }
              projectCount={projectCount}
              dealCount={dealCount}
              compact={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
