import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  // Allow access to admin page - authentication is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
