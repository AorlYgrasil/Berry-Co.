import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-highlights border-b border-dark/10 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight text-brand">
          Berry Co.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-bold text-dark">
          <Link href="/products" className="hover:text-brand transition">
            Products
          </Link>
          <Link href="/cart" className="hover:text-brand transition">
            Cart
          </Link>
          <Link href="/login" className="hover:text-brand transition">
            Login/Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}