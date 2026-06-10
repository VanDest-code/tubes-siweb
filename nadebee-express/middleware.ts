import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cek tiket masuk
  const authToken = request.cookies.get('nadebee-auth-token')?.value;

  // 2. Jika memaksa masuk area dashboard tanpa tiket...
  if (!authToken && request.nextUrl.pathname.startsWith('/auth/dashboard')) {
    
    // 3. Lempar ke UI "Akses Dibatasi" buatanmu yang cakep itu!
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/dashboard/:path*'],
};