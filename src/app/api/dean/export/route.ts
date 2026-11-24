import { NextResponse } from 'next/server';
import { isAuthError, requireRole } from '@/lib/auth';
import { buildDeanCsvReport } from '@/modules/governance/queries';

/**
 * Dean-only Route Handler exporting an RFC-4180 CSV institutional placement,
 * roster, and verification report.
 */
export async function GET() {
  try {
    await requireRole(['dean']);
  } catch (err) {
    if (isAuthError(err)) {
      return NextResponse.json(
        { ok: false, error: err.message, code: err.code },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { ok: false, error: 'Dean authorization required.', code: 'FORBIDDEN' },
      { status: 403 },
    );
  }

  const csv = await buildDeanCsvReport();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="almaconnect-placement-report.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
