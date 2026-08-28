import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-highlights border-b border-dark/10 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-black tracking-tight text-brand"
        >
          <Image
            src="/BerryCo-logo.png"
            alt="BerryCo. logo"
            width={52}
            height={52}
            className="h-12 w-12 object-contain"
          />
          Berry Co.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-bold text-dark">
          <Link href="/products" className="hover:text-brand transition">
            Products
          </Link>
          <Link href="/cart" className="hover:text-brand transition">
            Cart
          </Link>
          {user ? (
            <>
              <Link href="/wishlist" className="hover:text-brand transition">
                Wishlist
              </Link>
              <Link href="/orders" className="hover:text-brand transition">
                Orders
              </Link>
              <Link href="/page" className="hover:text-brand transition">
                Profile
              </Link>
            </>
          ) : (
            <Link href="/login" className="hover:text-brand transition">
              Login/Sign up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}