import PageHeader from '@/components/ui/page-header'

const offerings = [
  {
    title: 'Trading Card Games',
    description: 'Pokémon TCG, Magic: The Gathering, and One Piece — singles, sealed product, and more.',
  },
  {
    title: 'Card Accessories',
    description: 'Sleeves, deck boxes, binders, playmats, and everything else to protect and play your cards.',
  },
  {
    title: 'Anime & Collectibles',
    description: 'Pins, keychains, and figurines for fans and collectors alike.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Berry Co."
        subtitle="A trusted home for TCG, hobby, and collectible fans across the Philippines."
      />

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-14 text-stone-700">
        <p>
          Berry Co. is an online store that specializes in trading card games (TCG), collectible
          card game accessories, anime merchandise, and hobby collectibles. We aim to provide
          collectors, players, and fans with authentic products at affordable prices, through a
          convenient and secure shopping experience.
        </p>

        <p>
          Through a single platform, customers can browse our catalog, place orders, pay online,
          and track their deliveries from start to finish.
        </p>

        <p>
          We&apos;re proud to support hobby communities by offering new releases, accessories, and
          collectible items that can be hard to find in local stores. With an organized product
          catalog and reliable inventory management, we&apos;re working to become a trusted store
          for collectors and hobbyists across the Philippines.
        </p>

        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          {offerings.map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-5">
              <h2 className="mb-1.5 font-semibold text-stone-900">{item.title}</h2>
              <p className="text-sm text-stone-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}