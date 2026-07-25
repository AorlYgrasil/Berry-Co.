import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isLoginPage) {
    if (token && (await verifyToken(token))) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};