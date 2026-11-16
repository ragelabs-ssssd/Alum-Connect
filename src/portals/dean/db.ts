import { UserProfile } from '../../types';
import { PRESET_USERS, TP_ANALYTICS } from '../../data/seedData';
import { readJsonDb, writeJsonDb } from '../localDb';

export interface InstitutionalAuditLog {
  id: string;
  timestamp: string;
  category: 'vouch' | 'deal_room' | 'mvp_ship' | 'drive_slot';
  title: string;
  actor: string;
  impact: string;
}

const DB3_FILE = 'db3-dean.json';

interface DB3Store {
  dean: UserProfile;
  analytics: typeof TP_ANALYTICS;
  auditLogs: InstitutionalAuditLog[];
}

const defaultDeanUser: UserProfile = PRESET_USERS.find((u) => u.role === 'tp_admin') || {
  id: 'user_tp_admin',
  name: 'Prof. Sujit Kumar Patra',
  role: 'tp_admin',
  email: 'training.placement@soa.ac.in',
  avatar:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  headline:
    'Head of Training & Placement • SOA (ITER) Deemed to be University • Institutional Analytics',
  company: 'ITER, SOA University',
  designation: 'Dean & Head of Placement Operations',
  bandwidthShield: '1 session/quarter',
  vouchCardsCount: 89,
};

const initialAuditLogs: InstitutionalAuditLog[] = [
  {
    id: 'audit_1',
    timestamp: 'Nov 13, 2026, 04:30 PM',
    category: 'deal_room',
    title: 'PayPulse (YC W23) Acqui-Hire Deal Room Finalized',
    actor: 'Alok Tripathy (Founder, PayPulse)',
    impact: '₹14 LPA Pre-Placement Offer for 3 builders of CampusCart v2.0',
  },
  {
    id: 'audit_2',
    timestamp: 'Nov 12, 2026, 11:15 AM',
    category: 'vouch',
    title: 'Tier-1 Certified Vouch Certificate Registered',
    actor: 'Ankit Mohanty (SDE-2 @ Microsoft)',
    impact: 'Direct SDE-1 interview bypass granted for Ananya Dash (NoteHub ITER)',
  },
  {
    id: 'audit_3',
    timestamp: 'Nov 10, 2026, 02:45 PM',
    category: 'mvp_ship',
    title: 'New Production MVP Deployment Verified',
    actor: 'HostelBite Squad (Batch 2027)',
    impact: '1,200+ monthly hostel transactions verified by T&P incubator',
  },
  {
    id: 'audit_4',
    timestamp: 'Nov 08, 2026, 09:00 AM',
    category: 'drive_slot',
    title: 'Exclusive Alumni Keynote & Fast-Track Drive Approved',
    actor: 'Debashis Tripathy (Senior Engineering Manager @ Oracle)',
    impact: '120 auditorium slots booked for Banshee Auditorium Dec 5 session',
  },
];

function createInitialDB3(): DB3Store {
  return {
    dean: { ...defaultDeanUser },
    analytics: TP_ANALYTICS,
    auditLogs: [...initialAuditLogs],
  };
}

function readDB3(): DB3Store {
  return readJsonDb<DB3Store>(DB3_FILE, createInitialDB3);
}

function writeDB3(store: DB3Store): void {
  writeJsonDb<DB3Store>(DB3_FILE, store);
}

export function getDB3DeanProfile(): UserProfile {
  return readDB3().dean;
}

export function authenticateDB3Dean(emailOrId?: string): UserProfile {
  const dean = readDB3().dean;
  if (
    emailOrId &&
    (emailOrId === dean.email ||
      emailOrId === dean.id ||
      emailOrId.toLowerCase().includes('dean') ||
      emailOrId.toLowerCase().includes('placement') ||
      emailOrId.toLowerCase().includes('soa.ac.in'))
  ) {
    return dean;
  }
  return dean;
}

export function getDB3Analytics() {
  return readDB3().analytics;
}

export function getDB3AuditLogs(): InstitutionalAuditLog[] {
  return readDB3().auditLogs;
}

export function addDB3AuditLog(
  entry: Omit<InstitutionalAuditLog, 'id' | 'timestamp'>
): InstitutionalAuditLog {
  const store = readDB3();
  const newLog: InstitutionalAuditLog = {
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
  writeDB3({
    ...store,
    auditLogs: [newLog, ...store.auditLogs],
  });
  return newLog;
}
