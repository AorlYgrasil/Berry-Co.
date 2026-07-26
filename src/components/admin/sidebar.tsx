'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-full bg-base-100 border-r border-base-300 flex flex-col">
      <div className="px-6 py-5 border-b border-base-300">
        <span className="font-serif italic text-xl text-primary">Berry Co.</span>
        <p className="text-xs text-base-content/50 uppercase tracking-wide mt-0.5">Admin</p>
      </div>

      <ul className="menu p-3 gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link href={href} className={active ? 'active' : ''}>
                <Icon size={18} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}