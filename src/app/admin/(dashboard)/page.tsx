'use client'

import { logoutAdmin } from '@/lib/actions/auth'

export default function AdminNavbar({
  name,
  avatarUrl,
}: {
  name: string
  avatarUrl?: string | null
}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6">
      <div className="flex-1">
        <label htmlFor="admin-drawer" className="btn btn-square btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
      </div>

      <div className="flex-none dropdown dropdown-end">
        <button tabIndex={0} className="btn btn-ghost gap-2 normal-case">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-8 rounded-full">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name} />
              ) : (
                <span className="text-xs">{initials}</span>
              )}
            </div>
          </div>
          <span className="hidden sm:inline text-sm">{name}</span>
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu menu-sm mt-3 z-30 p-2 shadow bg-base-100 rounded-box w-44"
        >
          <li>
            <button onClick={() => logoutAdmin()}>Log out</button>
          </li>
        </ul>
      </div>
    </div>
  )
}