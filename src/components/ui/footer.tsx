import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BsFacebook, BsInstagram, BsTiktok } from 'react-icons/bs'

const shopLinks = [
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/orders', label: 'Orders' },
]

const helpLinks = [
  { href: '/faqs', label: 'FAQs' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: '#', label: 'Facebook', icon: BsFacebook },
  { href: '#', label: 'Instagram', icon: BsInstagram },
  { href: '#', label: 'TikTok', icon: BsTiktok },
]

export default function Footer() {
  return (
    <footer className="w-full bg-dark text-highlights">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.35fr_0.8fr_0.8fr_1.2fr] md:px-8">
        <div>
          <Image
            src="/BerryCo-logo.png"
            alt="BerryCo. logo"
            width={72}
            height={72}
            className="mb-5 h-16 w-16 rounded-full object-cover"
          />
          <h2 className="text-xl font-black tracking-tight">Berry Co.</h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-cream">
            Your home for authentic TCG, hobby, and collectible finds across the Philippines.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-highlights/25 bg-highlights/5 text-highlights transition-colors hover:border-brand hover:bg-brand hover:text-white"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />

        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-gold">Stay in the loop</h2>
          <p className="mt-4 text-sm leading-6 text-cream">
            Get updates on new releases, restocks, and collectible finds.
          </p>
          <div className="mt-5 flex max-w-sm overflow-hidden rounded-lg border border-highlights/15 bg-highlights">
            <span className="flex flex-1 items-center gap-2 px-3 text-dark/50">
              <Mail size={15} />
              <span className="text-xs">Your email address</span>
            </span>
            <button type="button" className="bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
              Join
            </button>
          </div>
          <div className="mt-5 space-y-3 text-xs text-cream">
            <p className="flex items-center gap-2"><MapPin size={14} className="text-brand" /> Quezon City, Philippines</p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-brand" /> Customer support available online</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-brand" /> support@berryco.com</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-highlights/15 px-6 py-5 text-xs text-cream md:px-8">
        <p>Copyright © 2026 Berry Co. All rights reserved.</p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-gold">{title}</h2>
      <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-cream">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-brand">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}