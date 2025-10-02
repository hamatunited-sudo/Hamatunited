import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


const LOCAL_CONTENT_PATH = path.resolve(process.cwd(), 'content.json');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'content';
const SUPABASE_OBJECT_PATH = process.env.SUPABASE_STORAGE_OBJECT_PATH || 'content.json';

async function pushToSupabase(content: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { ok: false, message: 'supabase not configured' };
  const uploadUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${SUPABASE_OBJECT_PATH}`;
  try {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: content
    });
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, message: txt };
    }
    const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${SUPABASE_OBJECT_PATH}`;
    return { ok: true, publicUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}

export async function GET() {
  // Try Supabase public object first (if configured)
  if (SUPABASE_URL) {
    try {
      const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${SUPABASE_OBJECT_PATH}`;
      const supRes = await fetch(publicUrl);
      if (supRes.ok) {
        const text = await supRes.text();
        return NextResponse.json(JSON.parse(text));
      }
    } catch {
      // ignore and fallback
    }
  }

    try {
      const raw = await fs.promises.readFile(LOCAL_CONTENT_PATH, 'utf-8');
      return NextResponse.json(JSON.parse(raw));
    } catch {
      return NextResponse.json({}, { status: 500 });
    }
}

export async function POST(req: Request) {
  // basic server-side check: require admin key header
  const adminKey = req.headers.get('x-admin-key');
  // Accept either a server-side ADMIN_API_KEY or the public NEXT_PUBLIC_ADMIN_API_KEY
  const expected = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
  if (!expected || adminKey !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.text();
    // validate JSON
    JSON.parse(body);

    // Optionally write locally. By default we DO NOT write the repository's content.json
    // because changing files in the workspace triggers Next's rebuilds during dev.
    // Set ALLOW_LOCAL_CONTENT_WRITE=true in your environment if you intentionally want to overwrite the local file.
    const allowLocalWrite = String(process.env.ALLOW_LOCAL_CONTENT_WRITE || '').toLowerCase() === 'true';
    let localWriteOk = false;
    if (allowLocalWrite) {
      try {
        await fs.promises.writeFile(LOCAL_CONTENT_PATH, body, 'utf-8');
        localWriteOk = true;
      } catch {
        // ignore write errors but surface in response
        localWriteOk = false;
      }
    }

  // push to supabase if configured
  const sup = await pushToSupabase(body);

  return NextResponse.json({ ok: true, pushedToSupabase: sup.ok, pushedMessage: sup.message || null, publicUrl: sup.publicUrl || null, localWriteAttempted: allowLocalWrite, localWriteOk });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}


