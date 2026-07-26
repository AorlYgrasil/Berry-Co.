import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/actions/auth'
import Sidebar from '@/components/admin/sidebar'
import AdminNavbar from '@/components/admin/navbar'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <AdminNavbar
          name={admin.profile?.full_name ?? admin.user.email ?? 'Admin'}
          avatarUrl={admin.profile?.avatar_url}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  )
}