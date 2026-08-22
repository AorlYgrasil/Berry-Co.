import PageHeader from '@/components/ui/page-header'
import FaqAccordion, { type FaqItem } from '@/components/ui/faq-accordion'

const faqs: FaqItem[] = [
  {
    question: 'What kind of products does Berry Co. sell?',
    answer:
      'Trading card games (Pokémon TCG, Magic: The Gathering, and One Piece), card accessories like sleeves, deck boxes, and playmats, plus anime and hobby collectibles such as pins, keychains, and figurines.',
  },
  {
    question: 'Are your products authentic?',
    answer:
      'Yes. We only source authentic products so collectors and players can shop with confidence.',
  },
  {
    question: 'How do I place an order?',
    answer:
      'Browse the catalog, add items to your cart, and check out. You\u2019ll get an order confirmation and can track its status from your account.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We support the online payment methods shown at checkout. If you don\u2019t see an option that works for you, reach out and we\u2019ll try to help.',
  },
  {
    question: 'Do you ship nationwide in the Philippines?',
    answer: 'Yes, we ship to customers across the Philippines.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you can check its status from your account\u2019s order history.',
  },
  {
    question: 'What if an item is out of stock?',
    answer:
      'Popular and new-release items can sell out quickly. Check back regularly, or contact us to ask about restocks.',
  },
  {
    question: 'What\u2019s your return or exchange policy?',
    answer:
      'If there\u2019s a problem with your order, contact our support team as soon as possible and we\u2019ll do our best to sort it out.',
  },
  {
    question: 'How do I get in touch with support?',
    answer: 'Visit our Contact page or email us directly \u2014 we\u2019re happy to help.',
  },
]

export default function FaqsPage() {
  return (
    <div>
      <PageHeader title="Frequently Asked Questions" subtitle="Everything you need to know before you shop." />
      <div className="mx-auto max-w-2xl px-6 py-14">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  )
}