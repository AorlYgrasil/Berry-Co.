import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-[#ebd2b4] px-8 py-5 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="text-4xl font-extrabold text-[#bd2a21] tracking-tight">
        Deckdrop
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-8 text-[#bd2a21] font-bold text-lg">
        <Link href="/products" className="hover:opacity-80 transition">
          Products
        </Link>
        <Link href="/cart" className="hover:opacity-80 transition">
          Cart
        </Link>
        <Link href="/login" className="hover:opacity-80 transition">
          Login/Sign up
        </Link>
      </nav>
    </header>
  );
}