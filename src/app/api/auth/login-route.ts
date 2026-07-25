import { NextRequest, NextResponse } from 'next/server';
import { demoAdmins } from '@/lib/demo-admins';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // TEMPORARY — swap this lookup for a real database query later
    const admin = demoAdmins.find((a) => a.username === username && a.password === password);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: admin.id, name: admin.name, role: admin.role });

    const response = NextResponse.json({
      message: 'Login successful',
      admin: { id: admin.id, name: admin.name, role: admin.role },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}