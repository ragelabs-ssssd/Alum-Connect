'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, Repeat, Search, User, X } from 'lucide-react';
import AlumConnectLogo from '../AlumConnectLogo';
import ThemeToggle from '../ThemeToggle';
import type { UserRole, VerificationStatus } from '@/types/domain';
import { AlumniVerificationBadge } from './VerificationBadge';

export interface PortalNavTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

export interface PortalNavbarUser {
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  verificationStatus?: VerificationStatus;
  subtitle?: string;
}

export interface PortalNavbarProps {
  portalLabel?: string;
  tabs: PortalNavTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  // Search controls (props-driven, optional typeahead dropdown)
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchDropdown?: React.ReactNode;
  searchSlot?: React.ReactNode;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  // Right slots & user controls
  rightActions?: React.ReactNode;
  user?: PortalNavbarUser | null;
  onProfileClick?: () => void;
  onSignOut?: () => void;
  onSwitchPersona?: () => void;
  switchPersonaHref?: string;
  signOutHref?: string;
}

/**
 * Reusable sticky Liquid Chrome portal header shared across Student, Alumni, and Dean views.
 * Purely props-driven with zero direct DB or server auth imports.
 */
export function PortalNavbar({
  portalLabel,
  tabs,
  activeTab,
  onTabChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search people, projects, skills...',
  searchDropdown,
  searchSlot,
  onSearchFocus,
  onSearchBlur,
  rightActions,
  user,
  onProfileClick,
  onSignOut,
  onSwitchPersona,
  switchPersonaHref = '/login',
  signOutHref,
}: PortalNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const roleLabel =
    user?.role === 'alumni' ? 'Alumni' : user?.role === 'dean' ? 'Dean T&P' : 'Student';

  const initials =
    user?.fullName
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'AC';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#0B0D12]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand Wordmark + Search */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-9 w-9 rounded-lg bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1 shadow-xs overflow-hidden shrink-0 group-hover:border-[#0891B2] dark:group-hover:border-[#22D3EE] transition-colors">
              <AlumConnectLogo className="h-6 w-6" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-luma-title text-base tracking-tight text-[#0F172A] dark:text-white leading-none">
                AlmaConnect
              </span>
              {portalLabel && (
                <span className="rounded-full border border-[#0891B2]/30 dark:border-[#22D3EE]/30 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-2 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                  {portalLabel}
                </span>
              )}
            </div>
          </Link>

          {searchSlot ? (
            searchSlot
          ) : onSearchChange ? (
            <div className="relative hidden md:block w-52 lg:w-64">
              <Search className="w-3.5 h-3.5 text-[#52525B] dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 pl-8 pr-7 py-1.5 text-xs text-[#09090B] dark:text-zinc-100 placeholder:text-[#52525B] dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#0891B2] dark:focus:border-[#22D3EE] transition-colors"
              />
              {searchValue && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSearchChange('');
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525B] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchDropdown}
            </div>
          ) : null}
        </div>

        {/* Center: Desktop Tab Bar */}
        <nav
          aria-label="Portal sections"
          className="hidden lg:flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900/90 p-1 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-2xs'
                    : 'text-[#52525B] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      active
                        ? 'bg-[#22D3EE] text-[#041E24] dark:bg-[#041E24] dark:text-[#22D3EE]'
                        : 'bg-[#0891B2] dark:bg-[#22D3EE] text-white dark:text-[#041E24]'
                    }`}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Action Slot + Profile Pill + ThemeToggle */}
        <div className="flex items-center gap-2 shrink-0">
          {rightActions}

          {user && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#0891B2] dark:hover:border-[#22D3EE] pl-1 pr-2.5 py-1 text-xs transition-colors"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-6 w-6 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                  />
                ) : (
                  <span className="h-6 w-6 rounded-full bg-[#0891B2]/15 dark:bg-[#22D3EE]/20 text-[#0891B2] dark:text-[#22D3EE] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                )}
                <span className="hidden xl:inline font-semibold max-w-[120px] truncate text-[#0F172A] dark:text-zinc-100">
                  {user.fullName}
                </span>
                {user.role === 'alumni' && user.verificationStatus && (
                  <AlumniVerificationBadge
                    status={user.verificationStatus}
                    compact
                    className="hidden sm:inline-flex"
                  />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#52525B] dark:text-zinc-400" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E] shadow-2xl p-2 z-50 space-y-1.5"
                >
                  <div className="px-2.5 py-2 border-b border-[#E4E4E7] dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                        {user.fullName}
                      </span>
                      <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-[#52525B] dark:text-zinc-300 shrink-0">
                        {roleLabel}
                      </span>
                    </div>
                    {user.subtitle && (
                      <p className="text-[11px] text-[#52525B] dark:text-zinc-400 truncate">
                        {user.subtitle}
                      </p>
                    )}
                    {user.role === 'alumni' && user.verificationStatus && (
                      <div className="pt-0.5">
                        <AlumniVerificationBadge status={user.verificationStatus} />
                      </div>
                    )}
                  </div>

                  {onProfileClick && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onProfileClick();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#09090B] dark:text-zinc-200 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                      <span>Open My Profile</span>
                    </button>
                  )}

                  {onSwitchPersona ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onSwitchPersona();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#09090B] dark:text-zinc-200 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Repeat className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                      <span>Switch Persona</span>
                    </button>
                  ) : switchPersonaHref ? (
                    <Link
                      href={switchPersonaHref}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#09090B] dark:text-zinc-200 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Repeat className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                      <span>Switch Persona</span>
                    </Link>
                  ) : null}

                  {onSignOut ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : signOutHref ? (
                    <Link
                      href={signOutHref}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <ThemeToggle compact />
        </div>
      </div>

      {/* Mobile / Tablet Sub-navigation Bar */}
      <div className="lg:hidden border-t border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                  : 'bg-[#F4F4F5] dark:bg-zinc-900 text-[#52525B] dark:text-zinc-400'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="rounded-full bg-[#0891B2] dark:bg-[#041E24] text-white dark:text-[#22D3EE] px-1.5 text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
