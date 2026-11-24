'use client';

import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Printer } from 'lucide-react';

interface VouchCertificateActionsProps {
  vouchCode: string;
}

/**
 * Client action bar on the public Vouch Certificate page for copying the
 * canonical verification link, opening the JSON verification endpoint, or printing.
 */
export function VouchCertificateActions({
  vouchCode,
}: VouchCertificateActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/vouch/${encodeURIComponent(vouchCode)}`
        : `/vouch/${encodeURIComponent(vouchCode)}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-4 py-2 text-xs font-semibold transition-all shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Verification Link Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Verification Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-4 py-2 text-xs font-semibold text-[#09090B] dark:text-zinc-100 transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Certificate</span>
      </button>

      <a
        href={`/api/vouch/${encodeURIComponent(vouchCode)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#059669] dark:hover:border-[#34D399] px-3.5 py-2 text-xs font-semibold text-[#52525B] dark:text-zinc-300 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>Verify JSON</span>
      </a>
    </div>
  );
}
