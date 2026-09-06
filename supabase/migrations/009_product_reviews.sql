-- Product reviews submitted by authenticated customers.
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(trim(comment)) between 10 and 1000),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.product_reviews enable row level security;

create index if not exists product_reviews_product_idx
  on public.product_reviews(product_id, created_at desc);

create policy "product_reviews_read_all"
on public.product_reviews for select
using (true);

create policy "product_reviews_insert_own"
on public.product_reviews for insert
with check (auth.uid() = user_id);

create policy "product_reviews_update_own_or_admin"
on public.product_reviews for update
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('super_admin', 'admin', 'staff')
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('super_admin', 'admin', 'staff')
  )
);

create policy "product_reviews_delete_own_or_admin"
on public.product_reviews for delete
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('super_admin', 'admin', 'staff')
  )
);
