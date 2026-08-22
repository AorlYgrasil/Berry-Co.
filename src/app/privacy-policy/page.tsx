import PageHeader from '@/components/ui/page-header'

const sections: { title: string; body: string[] }[] = [
  {
    title: '1. Introduction',
    body: [
      'This Privacy Policy explains how Berry Co. ("we", "us", "our") collects, uses, and protects your information when you shop with us online. By using our site, you agree to the practices described here.',
    ],
  },
  {
    title: '2. Information We Collect',
    body: [
      'Account information: your name, email address, and phone number when you create an account.',
      'Order information: shipping address and order history, so we can fulfill and track your purchases.',
      'Payment information: processed through our payment providers at checkout — we do not store your full card or payment credentials on our own servers.',
      'Usage information: pages you visit and actions you take on our site, which helps us improve the shopping experience.',
    ],
  },
  {
    title: '3. How We Use Your Information',
    body: [
      'To process and deliver your orders, and to keep you updated on their status.',
      'To respond to your questions and provide customer support.',
      'To maintain the security of our platform and prevent fraud.',
      'To improve our product catalog, inventory, and overall shopping experience.',
    ],
  },
  {
    title: '4. How We Share Information',
    body: [
      'We do not sell your personal information. We share it only where necessary — for example, with payment processors to complete a transaction, or with delivery couriers to fulfill your order — and only to the extent needed for that purpose.',
    ],
  },
  {
    title: '5. Cookies',
    body: [
      'We use cookies to keep you signed in, remember items in your cart, and understand how our site is used. You can control cookies through your browser settings, though some features may not work properly if cookies are disabled.',
    ],
  },
  {
    title: '6. Data Security',
    body: [
      'We take reasonable technical and organizational measures to protect your information. No online platform can guarantee complete security, but we work to keep your data safe.',
    ],
  },
  {
    title: '7. Your Rights',
    body: [
      'Under the Philippine Data Privacy Act of 2012 (RA 10173), you have the right to access, correct, and request deletion of your personal information, and to object to or withdraw consent for certain uses of your data. Contact us to exercise any of these rights.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.',
    ],
  },
  {
    title: '9. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or how your information is handled, please reach out through our Contact page.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader title="Privacy Policy" subtitle="Last updated: August 22, 2026" />

      <div className="mx-auto max-w-3xl px-6 py-14">
        <div
          role="note"
          className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800"
        >
          This is a starting template, not a finished legal document. Have it reviewed by a
          lawyer familiar with the Philippine Data Privacy Act of 2012 (RA 10173) before
          publishing it live, and update the placeholders (support email, revision date) first.
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 text-lg font-semibold text-stone-900">{section.title}</h2>
              <div className="space-y-2 text-sm leading-relaxed text-stone-600">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}