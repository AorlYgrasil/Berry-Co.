'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types/database'

export type LoginState = {
  error: string | null
}

const SESSION_COOKIE = 'berryco_admin_session'

/**
 * ⚠️ TEMPORARY DEV-ONLY AUTH ⚠️
 * No Supabase Auth or database required — just a hardcoded credential list
 * and a cookie. This exists so you can build out the dashboard before your
 * database is wired up. Same function names/signatures as the real version
 * (loginAdmin, logoutAdmin, getCurrentAdmin), so swapping back later is a
 * drop-in replacement — nothing else in the app needs to change.
 *
 * Dev logins:
 *   superadmin@berryco.com / password123   (role: super_admin)
 *   admin@berryco.com      / password123   (role: admin)
 *   staff@berryco.com      / password123   (role: staff)
 */
const DEV_ADMINS: Record<string, { password: string; profile: Profile }> = {
  'superadmin@berryco.com': {
    password: 'password123',
    profile: {
      id: 'dev-super-admin',
      full_name: 'Super Admin',
      phone: null,
      avatar_url: null,
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  },
  'admin@berryco.com': {
    password: 'password123',
    profile: {
      id: 'dev-admin',
      full_name: 'Admin',
      phone: null,
      avatar_url: null,
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  },
  'staff@berryco.com': {
    password: 'password123',
    profile: {
      id: 'dev-staff',
      full_name: 'Staff',
      phone: null,
      avatar_url: null,
      role: 'staff',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  },
}

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }

  const account = DEV_ADMINS[email]

  if (!account || account.password !== password) {
    return { error: 'Incorrect email or password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

export async function getCurrentAdmin(): Promise<{
  user: { id: string; email: string | null }
  profile: Profile
} | null> {
  const cookieStore = await cookies()
  const email = cookieStore.get(SESSION_COOKIE)?.value

  if (!email) return null

  const account = DEV_ADMINS[email]
  if (!account) return null

  return {
    user: { id: account.profile.id, email },
    profile: account.profile,
  }
}