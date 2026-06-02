import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Mengecek apakah ada jejak token Supabase di Cookies browser
  const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('-auth-token'));

  // Jika user mencoba masuk ke area /auth/dashboard/...
  if (request.nextUrl.pathname.startsWith('/auth/dashboard')) {
    
    // Tapi sistem tidak menemukan kunci akses (belum login)
    if (!hasAuthCookie) {
      // TENDANG user kembali ke halaman Login!
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Jika ada kunci akses, biarkan lewat
  return NextResponse.next();
}

// Menentukan rute mana saja yang mau dijaga oleh Satpam Middleware ini
export const config = {
  matcher: ['/auth/dashboard/:path*'],
};