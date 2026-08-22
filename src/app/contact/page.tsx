import { Clock, Mail } from 'lucide-react'
import PageHeader from '@/components/ui/page-header'

// NOTE: placeholder support inbox — swap for your real one before launch.
const SUPPORT_EMAIL = 'support@berryco.com'

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="Questions about an order, a product, or anything else? We'd love to hear from you."
      />

      <div className="mx-auto max-w-xl px-6 py-14">
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbe3df] text-[#c23f32]">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-medium text-stone-900">Email us</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-sm text-[#c23f32] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6e3c9] text-[#a97a2e]">
              <Clock size={18} />
            </div>
            <div>
              <p className="font-medium text-stone-900">Response time</p>
              <p className="text-sm text-stone-500">
                We typically reply within 1–2 business days. For order-related questions, include
                your order number so we can help faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}