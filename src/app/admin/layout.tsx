'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminPayload } from '@/lib/auth';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '🃏' },
  { label: 'Inventory', href: '/admin/inventory', icon: '📦' },
  { label: 'Orders', href: '/admin/orders', icon: '🧾' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Reports', href: '/admin/reports', icon: '📈' },
];

export default function Sidebar({ admin }: { admin: AdminPayload }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-60 bg-gray-900 text-gray-200 flex flex-col">
      <div className="px-5 py-6 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">Berry Co. Admin</h2>
        <p className="text-xs text-gray-400">TCG & Collectibles Store</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition ${
                active ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-800 text-xs">
        <p className="text-gray-400">Signed in as</p>
        <p className="font-medium text-white truncate">{admin.name}</p>
        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-700 text-white text-[10px] uppercase">
          {admin.role.replace('_', ' ')}
        </span>
        <button
          onClick={handleLogout}
          className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}