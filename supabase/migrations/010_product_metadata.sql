-- Product metadata used by the admin form and storefront filters.

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists brand_id uuid references public.brands(id) on delete set null;
alter table public.products add column if not exists series_id uuid references public.series(id) on delete set null;

create table if not exists public.product_tags (
  product_id uuid not null references public.products(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, tag_id)
);

create index if not exists products_brand_idx on public.products(brand_id);
create index if not exists products_series_idx on public.products(series_id);
create index if not exists product_tags_tag_idx on public.product_tags(tag_id);

alter table public.brands enable row level security;
alter table public.series enable row level security;
alter table public.tags enable row level security;
alter table public.product_tags enable row level security;

drop policy if exists "brands_read_all" on public.brands;
create policy "brands_read_all" on public.brands for select using (true);
drop policy if exists "brands_admin_write" on public.brands;
create policy "brands_admin_write" on public.brands for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "series_read_all" on public.series;
create policy "series_read_all" on public.series for select using (true);
drop policy if exists "series_admin_write" on public.series;
create policy "series_admin_write" on public.series for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tags_read_all" on public.tags;
create policy "tags_read_all" on public.tags for select using (true);
drop policy if exists "tags_admin_write" on public.tags;
create policy "tags_admin_write" on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "product_tags_read_all" on public.product_tags;
create policy "product_tags_read_all" on public.product_tags for select using (true);
drop policy if exists "product_tags_admin_write" on public.product_tags;
create policy "product_tags_admin_write" on public.product_tags for all using (public.is_admin()) with check (public.is_admin());