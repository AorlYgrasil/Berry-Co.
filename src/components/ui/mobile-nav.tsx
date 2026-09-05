'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

type MobileNavProps = { isSignedIn: boolean };

export default function MobileNav({ isSignedIn }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ['/products', 'Products'],
    ['/cart', 'Cart'],
    ...(isSignedIn
      ? [['/wishlist', 'Wishlist'], ['/orders', 'Orders'], ['/page', 'Profile']]
      : [['/login', 'Login / Sign up']]),
  ];

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="rounded-xl p-2 text-dark hover:bg-cream"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <nav className="absolute right-0 top-14 z-30 w-56 rounded-2xl border border-dark/10 bg-highlights p-3 shadow-lg">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-dark hover:bg-cream hover:text-brand"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
