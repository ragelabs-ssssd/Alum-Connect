import { NextResponse } from 'next/server';
import { isAuthError, requireAuth } from '@/lib/auth';
import { createSignedMediaUploadUrl } from '@/modules/builds/storage';
import { signUploadSchema } from '@/modules/builds/validators';

export async function POST(request: Request) {
  let userId: string;
  try {
    const user = await requireAuth();
    userId = user.id;
  } catch (err) {
    if (isAuthError(err)) {
      return NextResponse.json(
        { ok: false, error: err.message, code: err.code },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { ok: false, error: 'Authentication required.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON request body.', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const parsed = signUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid upload parameters.',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  const result = await createSignedMediaUploadUrl({
    userId,
    bucket: parsed.data.bucket,
    fileName: parsed.data.fileName,
    mimeType: parsed.data.mimeType,
    sizeBytes: parsed.data.sizeBytes,
  });

  if (!result.ok) {
    const status = result.code === 'VALIDATION_ERROR' ? 400 : 500;
    return NextResponse.json(
      { ok: false, error: result.error, code: result.code },
      { status }
    );
  }

  return NextResponse.json({ ok: true, data: result }, { status: 200 });
}
