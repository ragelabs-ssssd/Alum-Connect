import {
  UserProfile,
  AlumniPersona,
  BandwidthShield,
  Bounty,
  DealRoomAction,
} from '../../types';
import {
  PRESET_USERS,
  INITIAL_BOUNTIES,
  INITIAL_DEAL_ROOMS,
} from '../../data/seedData';
import { readJsonDb, writeJsonDb } from '../localDb';

const DB2_FILE = 'db2-alumni.json';

interface DB2Store {
  alumni: UserProfile[];
  bounties: Bounty[];
  dealRooms: DealRoomAction[];
}

function createInitialDB2(): DB2Store {
  return {
    alumni: PRESET_USERS.filter((u) => u.role === 'alumni').map((u) => ({ ...u })),
    bounties: INITIAL_BOUNTIES.map((b) => ({
      ...b,
      deliverables: [...b.deliverables],
      skillsRequired: [...b.skillsRequired],
    })),
    dealRooms: INITIAL_DEAL_ROOMS.map((d) => ({ ...d })),
  };
}

function readDB2(): DB2Store {
  return readJsonDb<DB2Store>(DB2_FILE, createInitialDB2);
}

function writeDB2(store: DB2Store): void {
  writeJsonDb<DB2Store>(DB2_FILE, store);
}

export function getDB2Alumni(): UserProfile[] {
  return readDB2().alumni;
}

export function authenticateDB2Alumni(
  identifier: string,
  persona?: AlumniPersona,
  shield?: BandwidthShield
): UserProfile {
  const store = readDB2();
  const query = identifier.trim().toLowerCase();
  const existingIdx = store.alumni.findIndex(
    (u) =>
      u.id.toLowerCase() === query ||
      u.email.toLowerCase() === query ||
      u.name.toLowerCase() === query
  );

  if (existingIdx !== -1) {
    const existing = { ...store.alumni[existingIdx] };
    if (persona) existing.alumniPersona = persona;
    if (shield) existing.bandwidthShield = shield;
    const nextAlumni = [...store.alumni];
    nextAlumni[existingIdx] = existing;
    writeDB2({ ...store, alumni: nextAlumni });
    return existing;
  }

  const namePart = identifier.includes('@') ? identifier.split('@')[0] : identifier;
  const formattedName =
    namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]/g, ' ');

  const chosenPersona: AlumniPersona = persona || 'ic';
  const chosenShield: BandwidthShield = shield || '2 async reviews/mo';

  const defaultRoleTitle =
    chosenPersona === 'manager'
      ? 'Senior Engineering Manager'
      : chosenPersona === 'founder'
      ? 'Founder & Tech Lead'
      : chosenPersona === 'chro'
      ? 'Head of Talent & Campus Hiring'
      : 'Staff Software Engineer';

  const defaultCompany =
    chosenPersona === 'founder'
      ? 'NextGen Ventures'
      : chosenPersona === 'chro'
      ? 'Talent Partners Global'
      : 'Enterprise Cloud Systems';

  const newUser: UserProfile = {
    id: `user_alumni_${Date.now()}`,
    name: formattedName || 'SOA ITER Alum',
    role: 'alumni',
    email: identifier.includes('@')
      ? identifier
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@alumni.soa.ac.in`,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: `ITER Alum • ${defaultRoleTitle} @ ${defaultCompany} • Marketplace Partner`,
    alumniPersona: chosenPersona,
    alumniTier:
      chosenPersona === 'chro'
        ? '15-25'
        : chosenPersona === 'founder'
        ? '10-15'
        : chosenPersona === 'manager'
        ? '5-10'
        : '0-5',
    bandwidthShield: chosenShield,
    company: defaultCompany,
    designation: defaultRoleTitle,
    batchYear: 2018,
    vouchCardsCount: 0,
    skillsEndorsed: [],
  };

  writeDB2({
    ...store,
    alumni: [newUser, ...store.alumni],
  });
  return newUser;
}

export function getDB2Bounties(): Bounty[] {
  return readDB2().bounties;
}

export function addDB2Bounty(bounty: Bounty): Bounty {
  const store = readDB2();
  const newBounty: Bounty = {
    ...bounty,
    id: bounty.id || `bounty_${Date.now()}`,
    appliedSquadsCount: bounty.appliedSquadsCount ?? 0,
    status: bounty.status || 'Open',
    deliverables: bounty.deliverables || [
      'Stateless microservice / module with documentation',
      'Unit & integration test suites',
      'Docker Compose deployment ready for staging',
    ],
  };

  writeDB2({
    ...store,
    bounties: [newBounty, ...store.bounties],
  });
  return newBounty;
}

export function incrementDB2BountyApplied(bountyId: string): Bounty | null {
  const store = readDB2();
  let updated: Bounty | null = null;

  const nextBounties = store.bounties.map((b) => {
    if (b.id !== bountyId) return b;
    updated = { ...b, appliedSquadsCount: b.appliedSquadsCount + 1 };
    return updated;
  });

  if (updated) {
    writeDB2({ ...store, bounties: nextBounties });
  }
  return updated;
}

export function getDB2DealRooms(): DealRoomAction[] {
  return readDB2().dealRooms;
}

export function addDB2DealRoom(deal: DealRoomAction): DealRoomAction {
  const store = readDB2();
  const newDeal: DealRoomAction = {
    ...deal,
    id: deal.id || `deal_${Date.now()}`,
    timestamp: deal.timestamp || 'Just now',
    status: deal.status || 'Pending Review',
  };

  writeDB2({
    ...store,
    dealRooms: [newDeal, ...store.dealRooms],
  });
  return newDeal;
}
