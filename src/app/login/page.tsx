import React, { Suspense } from 'react';
import { listDemoPersonas } from '@/lib/auth';
import { isDemoModeEnabled, isSupabaseConfigured } from '@/lib/env';
import LoginClient from './LoginClient';

export default function LoginPage() {
  const demoEnabled = isDemoModeEnabled();
  const supabaseEnabled = isSupabaseConfigured();
  const demoPersonas = demoEnabled ? listDemoPersonas() : [];

  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080A] text-sm text-[#475569] dark:text-[#94A3B8]">
          Loading AlmaConnect sign in...
        </div>
      }
    >
      <LoginClient
        demoEnabled={demoEnabled}
        supabaseEnabled={supabaseEnabled}
        demoPersonas={demoPersonas}
      />
    </Suspense>
  );
}
