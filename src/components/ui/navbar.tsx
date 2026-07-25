import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-base-100 border-b border-base-200">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
            Berry Co.
          </Link>
        </div>

        <div className="navbar-end">

          <ul className="menu menu-horizontal px-1 gap-2 hidden md:flex">
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>

          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-200 rounded-box w-52 gap-1"
            >
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </nav>
  )
}