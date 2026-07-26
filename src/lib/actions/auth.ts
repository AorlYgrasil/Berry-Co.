'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export type LoginState = {
  error: string | null
}

/**
 * Server Action backing the admin login form. Bound to the form via
 * `action={formAction}` from `useActionState` in the login page.
 */
export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { error: 'Incorrect email or password.' }
  }

  // Adjust "profiles" / "role" below to match your real schema.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: "This account doesn't have admin access." }
  }

  redirect('/admin')
}

/**
 * Server Action for logging out. Can be called directly from a Client
 * Component (e.g. onClick={() => logoutAdmin()}) without needing a <form>.
 */
export async function logoutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

/**
 * Shared helper for any Server Component that needs to know who's logged in
 * and whether they're an admin — used by the dashboard layout guard, and
 * safe to reuse in any other admin page or Server Action.
 */
export async function getCurrentAdmin(): Promise<{
  user: { id: string; email: string | null }
  profile: Profile | null
} | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: profile as Profile,
  }
}