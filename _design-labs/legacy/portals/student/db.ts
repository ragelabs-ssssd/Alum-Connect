import {
  CampusProduct,
  RoastAnnotation,
  StudentCohort,
  UserProfile,
  VouchEndorsement,
} from '../../types';
import { INITIAL_PRODUCTS, PRESET_USERS } from '../../data/seedData';
import { readJsonDb, writeJsonDb } from '../localDb';

const DB1_FILE = 'db1-students.json';

interface DB1Store {
  students: UserProfile[];
  products: CampusProduct[];
}

const COHORT_LABELS: Record<StudentCohort, { tag: string; yearLabel: string }> = {
  '1st_year': { tag: 'Campus Ops & Beta Scout', yearLabel: '1st Year (Batch 2028)' },
  '2nd_year': { tag: 'Core Squad Builder', yearLabel: '2nd Year (Batch 2027)' },
  '3rd_year': { tag: '10-Day Bounty Sprinter', yearLabel: '3rd Year (Batch 2026)' },
  '4th_year': { tag: 'Lead / Off-Campus / HS', yearLabel: '4th Year (Batch 2025)' },
};

function createInitialDB1(): DB1Store {
  return {
    students: PRESET_USERS.filter((u) => u.role === 'student').map((u) => ({ ...u })),
    products: INITIAL_PRODUCTS.map((p) => ({
      ...p,
      squadMembers: p.squadMembers.map((m) => ({ ...m })),
      vouches: p.vouches.map((v) => ({ ...v })),
      roasts: p.roasts.map((r) => ({ ...r })),
      tags: [...p.tags],
    })),
  };
}

function readDB1(): DB1Store {
  return readJsonDb<DB1Store>(DB1_FILE, createInitialDB1);
}

function writeDB1(store: DB1Store): void {
  writeJsonDb<DB1Store>(DB1_FILE, store);
}

export function getDB1Students(): UserProfile[] {
  return readDB1().students;
}

export function authenticateDB1Student(
  identifier: string,
  cohort?: StudentCohort
): UserProfile {
  const store = readDB1();
  const normalized = identifier.trim().toLowerCase();

  if (normalized) {
    const exactMatch = store.students.find(
      (s) =>
        s.email.toLowerCase() === normalized ||
        s.id.toLowerCase() === normalized ||
        s.name.toLowerCase() === normalized
    );

    if (exactMatch) {
      if (cohort && exactMatch.cohort !== cohort) {
        return {
          ...exactMatch,
          cohort,
          cohortTag: COHORT_LABELS[cohort].tag,
          studentYearLabel: COHORT_LABELS[cohort].yearLabel,
        };
      }
      return exactMatch;
    }

    const emailHandle = normalized.split('@')[0] || 'iter.builder';
    const displayName =
      emailHandle
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || 'ITER Student Builder';

    const selectedCohort: StudentCohort = cohort || '2nd_year';
    const newStudent: UserProfile = {
      id: `user_student_${Date.now()}`,
      name: displayName,
      role: 'student',
      email: normalized.includes('@') ? normalized : `${emailHandle}@soa.ac.in`,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      headline: `${COHORT_LABELS[selectedCohort].yearLabel} • Student Builder @ SOA ITER`,
      cohort: selectedCohort,
      cohortTag: COHORT_LABELS[selectedCohort].tag,
      studentYearLabel: COHORT_LABELS[selectedCohort].yearLabel,
      branch: 'Computer Science & Engineering',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      squadName: 'ITER Builders Squad',
      squadRole: 'Full Stack Builder',
      skillsEndorsed: [],
      vouchCardsCount: 0,
    };

    writeDB1({
      ...store,
      students: [newStudent, ...store.students],
    });
    return newStudent;
  }

  if (cohort) {
    const cohortMatch = store.students.find((s) => s.cohort === cohort);
    if (cohortMatch) return cohortMatch;
  }

  return store.students[0];
}

export function getDB1Products(): CampusProduct[] {
  return readDB1().products;
}

export function addDB1Product(product: CampusProduct): CampusProduct {
  const store = readDB1();
  const created: CampusProduct = {
    ...product,
    id: product.id || `prod_${Date.now()}`,
    publishedAt: product.publishedAt || 'Just now',
  };
  writeDB1({
    ...store,
    products: [created, ...store.products],
  });
  return created;
}

export function toggleDB1RoastResolved(
  productId: string,
  roastId: string
): CampusProduct | null {
  const store = readDB1();
  let updatedProduct: CampusProduct | null = null;

  const nextProducts = store.products.map((product) => {
    if (product.id !== productId) return product;
    const hasRoast = product.roasts.some((r) => r.id === roastId);
    if (!hasRoast) return product;

    updatedProduct = {
      ...product,
      roasts: product.roasts.map((roast) =>
        roast.id === roastId ? { ...roast, resolved: !roast.resolved } : roast
      ),
    };
    return updatedProduct;
  });

  if (updatedProduct) {
    writeDB1({ ...store, products: nextProducts });
  }

  return updatedProduct;
}

export function addDB1Roast(
  productId: string,
  roast: RoastAnnotation
): CampusProduct | null {
  const store = readDB1();
  let updatedProduct: CampusProduct | null = null;

  const nextProducts = store.products.map((product) => {
    if (product.id !== productId) return product;
    updatedProduct = {
      ...product,
      roasts: [roast, ...product.roasts],
    };
    return updatedProduct;
  });

  if (updatedProduct) {
    writeDB1({ ...store, products: nextProducts });
  }

  return updatedProduct;
}

export function addDB1Vouch(
  productId: string,
  vouch: VouchEndorsement
): CampusProduct | null {
  const store = readDB1();
  let updatedProduct: CampusProduct | null = null;

  const nextProducts = store.products.map((product) => {
    if (product.id !== productId) return product;
    updatedProduct = {
      ...product,
      status: 'verified',
      vouches: [vouch, ...product.vouches],
    };
    return updatedProduct;
  });

  if (updatedProduct) {
    writeDB1({ ...store, products: nextProducts });
  }

  return updatedProduct;
}
