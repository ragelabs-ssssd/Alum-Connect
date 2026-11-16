import { NextResponse } from 'next/server';
import {
  getDB3DeanProfile,
  authenticateDB3Dean,
  getDB3Analytics,
  getDB3AuditLogs,
  addDB3AuditLog,
} from '../../../portals/dean/db';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    db: 'DB3_PLACEMENT_DEAN',
    dean: getDB3DeanProfile(),
    analytics: getDB3Analytics(),
    auditLogs: getDB3AuditLogs(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body || {};

    if (action === 'login') {
      const identifier = payload?.identifier || payload?.email;
      const user = authenticateDB3Dean(identifier);
      return NextResponse.json({ status: 'ok', user });
    }

    if (action === 'log_audit') {
      if (!payload || !payload.title || !payload.category) {
        return NextResponse.json(
          { status: 'error', message: 'Missing required audit fields: title, category' },
          { status: 400 }
        );
      }
      const log = addDB3AuditLog({
        category: payload.category,
        title: payload.title,
        actor: payload.actor || 'Prof. Sujit Kumar Patra (Dean T&P)',
        impact: payload.impact || 'Recorded in SOA Institutional T&P Ledger',
      });
      return NextResponse.json({ status: 'ok', log });
    }

    return NextResponse.json(
      { status: 'error', message: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
