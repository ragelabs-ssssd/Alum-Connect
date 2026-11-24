import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { signUploadSchema, type SignUploadInput } from './validators';

export type MediaBucket = 'avatars' | 'project-media' | 'research-pdfs';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const PDF_MIME_TYPES = new Set(['application/pdf']);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 MB

export interface SignedUploadResult {
  ok: true;
  mode: 'supabase' | 'mock';
  bucket: MediaBucket;
  path: string;
  signedUrl: string | null;
  token: string;
  publicUrl: string | null;
  maxBytes: number;
}

export interface SignedUploadError {
  ok: false;
  error: string;
  code: 'VALIDATION_ERROR' | 'INTERNAL_ERROR';
}

function sanitizeFileName(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? 'upload.bin';
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || 'upload.bin';
}

function validateBucketMimeAndSize(input: SignUploadInput): {
  valid: boolean;
  error?: string;
  maxBytes: number;
} {
  const mime = input.mimeType.toLowerCase();

  if (input.bucket === 'avatars') {
    if (!IMAGE_MIME_TYPES.has(mime)) {
      return {
        valid: false,
        maxBytes: MAX_IMAGE_BYTES,
        error: 'Avatars only allow JPEG, PNG, or WebP images.',
      };
    }
    if (input.sizeBytes > MAX_IMAGE_BYTES) {
      return {
        valid: false,
        maxBytes: MAX_IMAGE_BYTES,
        error: 'Avatar image exceeds the 10 MB limit.',
      };
    }
    return { valid: true, maxBytes: MAX_IMAGE_BYTES };
  }

  if (input.bucket === 'research-pdfs') {
    if (!PDF_MIME_TYPES.has(mime)) {
      return {
        valid: false,
        maxBytes: MAX_PDF_BYTES,
        error: 'Research papers only allow application/pdf uploads.',
      };
    }
    if (input.sizeBytes > MAX_PDF_BYTES) {
      return {
        valid: false,
        maxBytes: MAX_PDF_BYTES,
        error: 'Research PDF exceeds the 25 MB limit.',
      };
    }
    return { valid: true, maxBytes: MAX_PDF_BYTES };
  }

  // project-media
  if (IMAGE_MIME_TYPES.has(mime)) {
    if (input.sizeBytes > MAX_IMAGE_BYTES) {
      return {
        valid: false,
        maxBytes: MAX_IMAGE_BYTES,
        error: 'Project image exceeds the 10 MB limit.',
      };
    }
    return { valid: true, maxBytes: MAX_IMAGE_BYTES };
  }

  if (VIDEO_MIME_TYPES.has(mime)) {
    if (input.sizeBytes > MAX_VIDEO_BYTES) {
      return {
        valid: false,
        maxBytes: MAX_VIDEO_BYTES,
        error: 'Project demo/pitch video exceeds the 150 MB limit.',
      };
    }
    return { valid: true, maxBytes: MAX_VIDEO_BYTES };
  }

  return {
    valid: false,
    maxBytes: MAX_VIDEO_BYTES,
    error:
      'Project media allows JPEG, PNG, WebP images (<=10MB) or MP4/WebM/MOV videos (<=150MB).',
  };
}

function getMockPublicUrl(bucket: MediaBucket, mimeType: string): string | null {
  if (bucket === 'research-pdfs') {
    return null;
  }
  if (bucket === 'avatars') {
    return '/images/avatar-male-1.jpg';
  }
  if (mimeType.toLowerCase().startsWith('video/')) {
    return 'https://youtu.be/demo-showcase-almaconnect';
  }
  return '/images/indian-student-tech.jpg';
}

/**
 * Generates a signed upload URL for Supabase Storage (`avatars`, `project-media`, `research-pdfs`)
 * or returns a deterministic mock signed response when Supabase Storage is unconfigured.
 */
export async function createSignedMediaUploadUrl(params: {
  userId: string;
  bucket: MediaBucket;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<SignedUploadResult | SignedUploadError> {
  const parsed = signUploadSchema.safeParse({
    bucket: params.bucket,
    fileName: params.fileName,
    mimeType: params.mimeType,
    sizeBytes: params.sizeBytes,
  });

  if (!parsed.success) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      error: parsed.error.issues[0]?.message ?? 'Invalid upload metadata.',
    };
  }

  const ruleCheck = validateBucketMimeAndSize(parsed.data);
  if (!ruleCheck.valid) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      error: ruleCheck.error ?? 'File violates bucket upload constraints.',
    };
  }

  const safeName = sanitizeFileName(parsed.data.fileName);
  const objectPath = `${params.userId}/${Date.now()}-${safeName}`;
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: true,
      mode: 'mock',
      bucket: parsed.data.bucket,
      path: objectPath,
      signedUrl: null,
      token: `mock-${Date.now().toString(36)}`,
      publicUrl: getMockPublicUrl(parsed.data.bucket, parsed.data.mimeType),
      maxBytes: ruleCheck.maxBytes,
    };
  }

  const { data, error } = await supabase.storage
    .from(parsed.data.bucket)
    .createSignedUploadUrl(objectPath);

  if (error || !data) {
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: error?.message ?? 'Failed to create signed upload URL.',
    };
  }

  let publicUrl: string | null = null;
  if (parsed.data.bucket !== 'research-pdfs') {
    const { data: pubData } = supabase.storage
      .from(parsed.data.bucket)
      .getPublicUrl(objectPath);
    publicUrl = pubData.publicUrl;
  }

  return {
    ok: true,
    mode: 'supabase',
    bucket: parsed.data.bucket,
    path: data.path,
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl,
    maxBytes: ruleCheck.maxBytes,
  };
}
