'use client'

import { useActionState } from 'react'
import { loginAdmin, type LoginState } from '@/lib/actions/auth'

const initialState: LoginState = { error: null }

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState)

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel — hidden on small screens */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary to-secondary text-primary-content relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-56 h-56 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10">
          <span className="font-serif italic text-3xl tracking-tight">Berry Co.</span>
        </div>

        <div className="relative z-10 space-y-3 max-w-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-primary-content/70">
            Admin Console
          </p>
          <p className="text-2xl font-medium leading-snug">
            Manage products, inventory, and orders from one place.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-base-200">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="lg:hidden mb-1">
              <span className="font-serif italic text-2xl text-primary">Berry Co.</span>
            </div>

            <h1 className="text-xl font-semibold">Sign in to Admin</h1>
            <p className="text-sm text-base-content/60 mb-2">
              Use your administrator credentials to continue.
            </p>

            {state.error && (
              <div role="alert" className="alert alert-error text-sm py-2">
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-3">
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@berryco.com"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="label cursor-pointer gap-2 px-0">
                  <input
                    type="checkbox"
                    name="remember"
                    defaultChecked
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="label-text">Remember me</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={pending}>
                {pending && <span className="loading loading-spinner loading-sm" />}
                {pending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}