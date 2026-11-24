/**
 * Shared domain inference, formatting, and Liquid Chrome visual utilities.
 */

export const COVER_GRADIENTS: readonly string[] = [
  'from-[#0C0F16] via-[#14171E] to-[#0891B2]',
  'from-[#090D16] via-[#111827] to-[#059669]',
  'from-[#0B1120] via-[#1E293B] to-[#0E7490]',
  'from-[#09090B] via-[#18181B] to-[#065F46]',
  'from-[#0F172A] via-[#1E1B4B] to-[#0891B2]',
];

export const DOMAIN_OPTIONS: readonly string[] = [
  'All',
  'Research Papers',
  'Product & FinTech',
  'Applied AI',
  'IoT & Systems',
  'Full-Stack & Cloud',
];

/**
 * Deterministically picks a cover gradient from COVER_GRADIENTS based on a string or index.
 */
export function getCoverGradient(seed?: string | number | null): string {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    const idx = Math.abs(Math.floor(seed)) % COVER_GRADIENTS.length;
    return COVER_GRADIENTS[idx];
  }
  if (typeof seed === 'string' && seed.length > 0) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
  }
  return COVER_GRADIENTS[0];
}

/**
 * Infers a canonical AlmaConnect project domain from tech stack tags and descriptive text.
 */
export function inferProjectDomain(techStack: string[], text = ''): string {
  const hay = `${techStack.join(' ')} ${text}`.toLowerCase();

  if (
    hay.includes('fintech') ||
    hay.includes('upi') ||
    hay.includes('equity') ||
    hay.includes('ledger') ||
    hay.includes('payment') ||
    hay.includes('trading') ||
    hay.includes('razorpay') ||
    hay.includes('stripe')
  ) {
    return 'Product & FinTech';
  }

  if (
    hay.includes('langgraph') ||
    hay.includes('langchain') ||
    hay.includes('whisper') ||
    hay.includes('yolo') ||
    hay.includes('pytorch') ||
    hay.includes('tensorflow') ||
    hay.includes('rag') ||
    hay.includes('llm') ||
    hay.includes('pgvector') ||
    hay.includes('openai') ||
    hay.includes('gemini') ||
    hay.includes('ml')
  ) {
    return 'Applied AI';
  }

  if (
    hay.includes('esp') ||
    hay.includes('ebpf') ||
    hay.includes('rust') ||
    hay.includes('arm') ||
    hay.includes('iot') ||
    hay.includes('mqtt') ||
    hay.includes('kernel') ||
    hay.includes('fpga') ||
    hay.includes('verilog') ||
    hay.includes('embedded')
  ) {
    return 'IoT & Systems';
  }

  if (
    hay.includes('arxiv') ||
    hay.includes('ieee') ||
    hay.includes('preprint') ||
    hay.includes('benchmark') ||
    hay.includes('paper')
  ) {
    return 'Research Papers';
  }

  return 'Full-Stack & Cloud';
}

/**
 * Returns light/dark Tailwind pill classes tuned for each canonical domain.
 */
export function getDomainBadgeClass(domain: string): string {
  const normalized = domain.toLowerCase();

  if (normalized.includes('fintech') || normalized.includes('product')) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-[#34D399]';
  }

  if (normalized.includes('ai') || normalized.includes('ml')) {
    return 'border-[#0891B2]/30 bg-[#0891B2]/10 text-[#0891B2] dark:border-[#22D3EE]/35 dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]';
  }

  if (normalized.includes('iot') || normalized.includes('systems')) {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300';
  }

  if (normalized.includes('research') || normalized.includes('paper')) {
    return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-300';
  }

  return 'border-slate-300/80 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200';
}

/**
 * Safely extracts a clean host label (e.g. "github.com") from a URL string.
 */
export function formatHostLabel(url?: string | null): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed === '#' || trimmed.startsWith('/')) {
    return trimmed === '#' ? '' : 'Internal Link';
  }
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return '';
  }
}

/**
 * Converts arbitrary text into a clean URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats an ISO timestamp or date string into a concise readable label.
 */
export function formatShortDate(iso?: string | null): string {
  if (!iso || !iso.trim()) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}
