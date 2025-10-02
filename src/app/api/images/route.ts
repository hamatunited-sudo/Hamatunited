import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || 'images';

type UploadFile = {
  name?: string;
  type?: string;
  arrayBuffer?: () => Promise<ArrayBuffer>;
};

export async function POST(req: Request) {
  const adminKey = req.headers.get('x-admin-key');
  // Accept either a server-side ADMIN_API_KEY or the public NEXT_PUBLIC_ADMIN_API_KEY
  const expected = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
  if (!expected || adminKey !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false, error: 'supabase not configured' }, { status: 500 });
  }

  try {
  const form = await req.formData();
  const file = form.get('file') as UploadFile | null;
  // optional target filename (when provided we use it so callers can overwrite a known object)
  const targetRaw = form.get('target') as string | null;
  if (!file || !file.name) {
      return NextResponse.json({ ok: false, error: 'no file' }, { status: 400 });
    }

    // Basic size and type limits
    const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES || '5242880'); // default 5MB
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    const mime = file.type || 'application/octet-stream';

    if (!allowed.includes(mime)) {
      return NextResponse.json({ ok: false, error: 'unsupported file type' }, { status: 400 });
    }

    const arrayBuffer = await (file.arrayBuffer ? file.arrayBuffer() : Promise.resolve(new ArrayBuffer(0)));
    if (arrayBuffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: 'file too large' }, { status: 413 });
    }

    const buf = Buffer.from(arrayBuffer);

    // sanitize filename. If caller provided a target, use it (allows overwrite); otherwise uniquify.
    const originalName = file.name || 'upload';
    const sanitized = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    let finalName = sanitized;
    if (targetRaw && typeof targetRaw === 'string' && targetRaw.trim()) {
      // sanitize provided target as well
      const t = targetRaw.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      finalName = t;
    } else {
      const timestamp = Date.now();
      finalName = `${timestamp}_${sanitized}`;
    }
    const objectPath = encodeURIComponent(finalName);

    const uploadUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${objectPath}`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': mime,
      },
      body: buf,
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ ok: false, error: txt }, { status: 500 });
    }

  const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${objectPath}`;
  return NextResponse.json({ ok: true, name: finalName, publicUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
