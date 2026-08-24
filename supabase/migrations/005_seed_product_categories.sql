-- Seed the product taxonomy used by the admin product form.
-- Slugs make this safe to run more than once in Supabase or any shared deployment database.

insert into public.categories (name, slug, parent_id, level)
values
  ('Trading Card Games', 'trading-card-games', null, 0),
  ('Card Accessories', 'card-accessories', null, 0),
  ('Figurines and Collectibles', 'figurines-and-collectibles', null, 0)
on conflict (slug) do update set
  name = excluded.name,
  parent_id = excluded.parent_id,
  level = excluded.level;

insert into public.categories (name, slug, parent_id, level)
select child.name, child.slug, parent.id, 1
from (
  values
    ('Pokemon TCG', 'pokemon-tcg', 'trading-card-games'),
    ('Magic: The Gathering', 'magic-the-gathering', 'trading-card-games'),
    ('One Piece', 'one-piece', 'trading-card-games'),
    ('Card Protection', 'card-protection', 'card-accessories'),
    ('Storage', 'storage', 'card-accessories'),
    ('Play Accessories', 'play-accessories', 'card-accessories'),
    ('Pins', 'pins', 'figurines-and-collectibles'),
    ('Keychains', 'keychains', 'figurines-and-collectibles'),
    ('Figures', 'figures', 'figurines-and-collectibles')
) as child(name, slug, parent_slug)
join public.categories parent on parent.slug = child.parent_slug
on conflict (slug) do update set
  name = excluded.name,
  parent_id = excluded.parent_id,
  level = excluded.level;