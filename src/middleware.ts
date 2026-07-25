import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const admin = token ? await verifyToken(token) : null;
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin' || pathname === '/admin/';

  if (isLoginPage) {
    if (admin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoot) {
    return admin
      ? NextResponse.redirect(new URL('/admin/dashboard', req.url))
      : NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (pathname.startsWith('/admin')) {
    if (!admin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};