'use client';

import { useRouter } from 'next/navigation';
import DeanPortal from '../../portals/dean/DeanPortal';

export default function DeanPage() {
  const router = useRouter();
  return <DeanPortal onBackToGateway={() => router.push('/')} />;
}
