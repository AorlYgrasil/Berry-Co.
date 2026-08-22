import Link from 'next/link'

const links = [
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About Us' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-[#383535] py-8 text-center text-gray-200">
      <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-white hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="text-base font-medium">Copyright © 2026 - All right reserved by Berry Co.</p>
    </footer>
  )
}