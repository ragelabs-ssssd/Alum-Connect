'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, UserPlus, Users } from 'lucide-react';
import { toggleFollowUserAction } from '@/modules/identity/actions';

interface FollowProfileButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
  initialFollowersCount: number;
  isSelf: boolean;
  isAuthenticated: boolean;
}

export function FollowProfileButton({
  targetUserId,
  initialFollowing,
  initialFollowersCount,
  isSelf,
  isAuthenticated,
}: FollowProfileButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [errorMsg, setErrorMsg] = useState('');

  if (isSelf) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.24)] dark:border-[rgba(226,232,240,0.18)] bg-white/75 dark:bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#475569] dark:text-[#94A3B8]">
        <Users className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
        <span>
          {followersCount} {followersCount === 1 ? 'Follower' : 'Followers'} • Your Profile
        </span>
      </div>
    );
  }

  const handleToggle = () => {
    setErrorMsg('');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const prevFollowing = following;
    const prevCount = followersCount;
    setFollowing(!prevFollowing);
    setFollowersCount(prevFollowing ? Math.max(0, prevCount - 1) : prevCount + 1);

    startTransition(async () => {
      const result = await toggleFollowUserAction(targetUserId);
      if (!result.ok) {
        setFollowing(prevFollowing);
        setFollowersCount(prevCount);
        if (result.code === 'UNAUTHORIZED') {
          router.push('/login');
          return;
        }
        setErrorMsg(result.error);
        return;
      }
      setFollowing(result.data.following);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/70 dark:bg-white/[0.05] px-3 py-2 text-xs font-semibold text-[#475569] dark:text-[#94A3B8]">
          <Users className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
          {followersCount} {followersCount === 1 ? 'Follower' : 'Followers'}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 ${
            following
              ? 'border border-[#0891B2]/35 dark:border-[#22D3EE]/35 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 text-[#0E7490] dark:text-[#22D3EE]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] shadow-xs'
          }`}
        >
          {following ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>
      {errorMsg && (
        <span className="text-[11px] text-rose-600 dark:text-rose-400">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
