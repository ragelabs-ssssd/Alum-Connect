export interface ThemePalette {
  id: number;
  name: string;
  primary: string;
  primaryHover: string;
  onPrimary: string;
  accent: string;
  bgMain: string;
  bgCard: string;
  textMain: string;
  textMuted: string;
  borderColor: string;
  isDark?: boolean;
}

export const LOGIN_THEME_PALETTES: ThemePalette[] = [
  {
    id: 1,
    name: 'Ecosystem Flow (Brand Match)',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    onPrimary: '#FFFFFF',
    accent: '#7C3AED',
    bgMain: '#F8FAFC',
    bgCard: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#475569',
    borderColor: '#E2E8F0',
  },
  {
    id: 2,
    name: 'ITER Academic Prestige',
    primary: '#1E3A8A',
    primaryHover: '#172554',
    onPrimary: '#FFFFFF',
    accent: '#D97706',
    bgMain: '#F9FAFB',
    bgCard: '#FFFFFF',
    textMain: '#111827',
    textMuted: '#4B5563',
    borderColor: '#E5E7EB',
  },
  {
    id: 3,
    name: 'Modern SaaS & Builder',
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    onPrimary: '#FFFFFF',
    accent: '#06B6D4',
    bgMain: '#F4F6FB',
    bgCard: '#FFFFFF',
    textMain: '#1E293B',
    textMuted: '#64748B',
    borderColor: '#E2E8F0',
  },
  {
    id: 4,
    name: 'Career Growth & Momentum',
    primary: '#0F766E',
    primaryHover: '#115E59',
    onPrimary: '#FFFFFF',
    accent: '#10B981',
    bgMain: '#F0FDF4',
    bgCard: '#FFFFFF',
    textMain: '#064E3B',
    textMuted: '#374151',
    borderColor: '#D1FAE5',
  },
  {
    id: 5,
    name: 'Warm Campus Community',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    onPrimary: '#FFFFFF',
    accent: '#1D4ED8',
    bgMain: '#FFFBEB',
    bgCard: '#FFFFFF',
    textMain: '#1C1917',
    textMuted: '#57534E',
    borderColor: '#FDE68A',
  },
  {
    id: 6,
    name: 'Midnight Dark Mode',
    primary: '#38BDF8',
    primaryHover: '#0EA5E9',
    onPrimary: '#0B1120',
    accent: '#818CF8',
    bgMain: '#0B1120',
    bgCard: '#1E293B',
    textMain: '#F8FAFC',
    textMuted: '#94A3B8',
    borderColor: '#334155',
    isDark: true,
  },
  {
    id: 7,
    name: 'Executive Slate & Mint',
    primary: '#0F172A',
    primaryHover: '#1E293B',
    onPrimary: '#FFFFFF',
    accent: '#14B8A6',
    bgMain: '#F1F5F9',
    bgCard: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#475569',
    borderColor: '#CBD5E1',
  },
  {
    id: 8,
    name: 'Future Unicorn',
    primary: '#6D28D9',
    primaryHover: '#5B21B6',
    onPrimary: '#FFFFFF',
    accent: '#F43F5E',
    bgMain: '#FAF5FF',
    bgCard: '#FFFFFF',
    textMain: '#18181B',
    textMuted: '#52525B',
    borderColor: '#E9D5FF',
  },
  {
    id: 9,
    name: 'Clean Monochrome + Spark',
    primary: '#18181B',
    primaryHover: '#27272A',
    onPrimary: '#FFFFFF',
    accent: '#2563EB',
    bgMain: '#FFFFFF',
    bgCard: '#F4F4F5',
    textMain: '#09090B',
    textMuted: '#52525B',
    borderColor: '#E4E4E7',
  },
  {
    id: 10,
    name: 'Sunset Campus Gradient',
    primary: '#DB2777',
    primaryHover: '#BE185D',
    onPrimary: '#FFFFFF',
    accent: '#F59E0B',
    bgMain: '#FFF1F2',
    bgCard: '#FFFFFF',
    textMain: '#1F2937',
    textMuted: '#4B5563',
    borderColor: '#FECDD3',
  },
];

export function formatThemeCss(theme: ThemePalette): string {
  return `:root {
  /* ${theme.name} */
  --primary: ${theme.primary};
  --primary-hover: ${theme.primaryHover};
  --accent: ${theme.accent};
  --bg-main: ${theme.bgMain};
  --bg-card: ${theme.bgCard};
  --text-main: ${theme.textMain};
  --text-muted: ${theme.textMuted};
  --border-color: ${theme.borderColor};
}`;
}
