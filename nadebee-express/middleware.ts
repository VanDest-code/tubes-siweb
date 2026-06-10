import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('nadebee-auth-token')?.value;
  const role = request.cookies.get('nadebee-role')?.value; // <-- Satpam ngecek stempel role!
  const path = request.nextUrl.pathname;

  // 1. Belum login sama sekali -> Lempar ke Unauthorized
  if (!authToken && path.startsWith('/auth/dashboard')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 2. Kurir nyasar ke area Pelanggan -> Lempar ke Unauthorized
  if (authToken && role === 'kurir' && path.startsWith('/auth/dashboard/pelanggan')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 3. Pelanggan nyasar ke area Kurir -> Lempar ke Unauthorized
  if (authToken && role === 'pelanggan' && path.startsWith('/auth/dashboard/kurir')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/dashboard/:path*'],
};