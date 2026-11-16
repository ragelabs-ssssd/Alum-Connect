import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.local-db');

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function readJsonDb<T>(filename: string, createSeed: () => T): T {
  ensureDbDir();
  const filePath = path.join(DB_DIR, filename);

  if (!fs.existsSync(filePath)) {
    const seed = createSeed();
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    const seed = createSeed();
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export function writeJsonDb<T>(filename: string, data: T): void {
  ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
