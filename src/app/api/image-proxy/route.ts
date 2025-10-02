import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SUPABASE_URL = 'https://hphuswfgqfnnxqncvpoj.supabase.co';
const DEFAULT_BUCKET = 'trusted-by';

const getSupabaseBaseUrl = () => {
  const configured = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (configured ?? DEFAULT_SUPABASE_URL).replace(/\/$/, '');
};

const getBucketName = () => process.env.SUPABASE_TRUSTED_BY_BUCKET || DEFAULT_BUCKET;

const getAuthHeaders = () => {
  const serviceKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!serviceKey) return undefined;

  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`
  } as Record<string, string>;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
    }

    const supabaseBase = getSupabaseBaseUrl();
    const bucket = encodeURIComponent(getBucketName());

    const normalisedFile = fileName
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    const encodedFile = normalisedFile;

    const publicUrl = `${supabaseBase}/storage/v1/object/public/${bucket}/${encodedFile}`;
    let response = await fetch(publicUrl);

    if (!response.ok) {
      const authHeaders = getAuthHeaders();

      if (authHeaders) {
  const privateUrl = `${supabaseBase}/storage/v1/object/${bucket}/${encodedFile}`;
        response = await fetch(privateUrl, {
          headers: authHeaders
        });
      }
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
