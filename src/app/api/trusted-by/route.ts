import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_TRUSTED_BY_BUCKET || 'trusted-by';

type SupabaseObject = { name?: string };

async function listFromSupabase(): Promise<string[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/list/${encodeURIComponent(SUPABASE_BUCKET)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prefix: '', limit: 100, offset: 0 })
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    // supabase returns array of objects with { name, id, updated_at, ... }
    return Array.isArray(json) ? (json as SupabaseObject[]).map((o) => o.name ?? '').filter(Boolean) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // Prefer listing from Supabase bucket
  const list = await listFromSupabase();
  if (list && Array.isArray(list)) {
    return NextResponse.json(list);
  }

  // fallback to local public folder
  try {
    const dir = path.join(process.cwd(), 'public', 'Trusted_By');
    const files = await fs.promises.readdir(dir);
    const images = files.filter((f) => /\.(png|jpe?g|svg)$/i.test(f));
    return NextResponse.json(images);
  } catch (err) {
    console.error('Failed to read Trusted_By directory', err);
    return NextResponse.json([], { status: 500 });
  }
}

// Upload new logo to Supabase storage. Accepts multipart/form-data with field 'file'
export async function POST(req: Request) {
  // basic admin header check
  const adminKey = req.headers.get('x-admin-key');
  const expected = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
  if (!expected || adminKey !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false, error: 'supabase not configured' }, { status: 500 });
  }

  try {
    type UploadFile = { name?: string; type?: string; arrayBuffer?: () => Promise<ArrayBuffer> };
    const form = await req.formData();
    const file = form.get('file') as UploadFile | null;
    if (!file || !file.name) {
      return NextResponse.json({ ok: false, error: 'no file' }, { status: 400 });
    }

    const arrayBuffer = await (file.arrayBuffer ? file.arrayBuffer() : Promise.resolve(new ArrayBuffer(0)));
    const buf = Buffer.from(arrayBuffer);
    const objectPath = encodeURIComponent(file.name);
    const uploadUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${objectPath}`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: buf
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ ok: false, error: txt }, { status: 500 });
    }

    return NextResponse.json({ ok: true, name: file.name });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// Delete an object from the Supabase bucket
export async function DELETE(req: Request) {
  const adminKey = req.headers.get('x-admin-key');
  const expected = process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';
  if (!expected || adminKey !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false, error: 'supabase not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const key = body?.key;
    if (!key) return NextResponse.json({ ok: false, error: 'missing key' }, { status: 400 });

    const deleteUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${encodeURIComponent(key)}`;
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ ok: false, error: txt }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
