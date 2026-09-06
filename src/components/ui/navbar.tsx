import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/lib/cart-service";
import { getWishlist } from "@/lib/wishlist-service";
import { getOrderCountForUser } from "@/lib/data/storefront";
import WishlistNavLink from "./wishlist-nav-link";
import CartNavLink from "./cart-nav-link";
import OrdersNavLink from "./orders-nav-link";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistItems = user ? await getWishlist(user.id) : [];
  const cart = user ? await getCart({ userId: user.id }) : null;
  const orderCount = user ? await getOrderCountForUser(user.id) : 0;

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

        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-dark">
          <Link href="/products" className="hover:text-brand transition">
            Products
          </Link>
          <CartNavLink initialCount={cart?.itemCount ?? 0} />
          {user ? (
            <>
              <WishlistNavLink initialCount={wishlistItems.length} />
              <OrdersNavLink initialCount={orderCount} />
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

        <div className="dropdown dropdown-end md:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-circle btn-ghost border-none text-dark hover:bg-brand-dark/80 focus:bg-brand-dark"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-4 shadow-xl bg-cream border border-dark/10 rounded-2xl w-60 z-50 mt-2 space-y-2 text-sm font-bold text-dark"
          >
            <li>
              <Link href="/products" className="hover:text-brand transition">
                Products
              </Link>
            </li>
            <li>
              <CartNavLink initialCount={cart?.itemCount ?? 0} />
            </li>
            {user ? (
              <>
                <li>
                  <WishlistNavLink initialCount={wishlistItems.length} />
                </li>
                <li>
                  <OrdersNavLink initialCount={orderCount} />
                </li>
                <li>
                  <Link href="/page" className="hover:text-brand transition">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="hover:text-brand transition">
                  Login/Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}