import React from 'react';

export default function AlumConnectLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Alum Connect Logo"
    >
      <rect x="14" y="5" width="8" height="5" className="fill-[#0891B2] dark:fill-[#22D3EE]" />
      <rect x="8" y="10" width="6" height="6" className="fill-[#0F172A] dark:fill-white" />
      <rect x="22" y="10" width="6" height="6" className="fill-[#0F172A] dark:fill-white" />
      <rect x="8" y="16" width="20" height="5" className="fill-[#059669] dark:fill-[#34D399]" />
      <rect x="6" y="21" width="6" height="10" className="fill-[#0F172A] dark:fill-white" />
      <rect x="24" y="21" width="6" height="10" className="fill-[#0F172A] dark:fill-white" />
    </svg>
  );
}
