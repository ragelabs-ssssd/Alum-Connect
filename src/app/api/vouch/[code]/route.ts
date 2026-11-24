import { NextResponse } from 'next/server';
import { verifyVouchByCodeQuery } from '@/modules/endorsements/queries';

/**
 * Public API endpoint for verifying a Vouch Certificate by code.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const decodedCode = decodeURIComponent(code).trim();

  if (!decodedCode) {
    return NextResponse.json(
      { ok: false, error: 'Vouch code is required.' },
      { status: 400 }
    );
  }

  const certificate = await verifyVouchByCodeQuery(decodedCode);
  if (!certificate) {
    return NextResponse.json(
      { ok: false, error: 'Vouch certificate not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, certificate }, { status: 200 });
}
