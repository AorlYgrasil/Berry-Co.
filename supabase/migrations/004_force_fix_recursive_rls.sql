-- Stronger follow-up for the profiles RLS recursion.
-- Run this once in the Supabase project used by localhost and Railway.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin', 'staff')
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Profiles must never query profiles from inside its own policy.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own_or_admin"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- Rebuild customer/admin access policies using the explicit RLS-safe helper.
drop policy if exists "orders_select_own_or_admin" on public.orders;
drop policy if exists "orders_modify_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders for select
using (auth.uid() = customer_id or public.is_admin());
create policy "orders_modify_admin"
on public.orders for all
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
drop policy if exists "order_items_modify_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.is_admin())
  )
);
create policy "order_items_modify_admin"
on public.order_items for all
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "carts_select_own_or_admin" on public.carts;
drop policy if exists "carts_manage_own_or_admin" on public.carts;
create policy "carts_select_own_or_admin"
on public.carts for select
using (auth.uid() = user_id or public.is_admin());
create policy "carts_manage_own_or_admin"
on public.carts for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "cart_items_select_own_or_admin" on public.cart_items;
drop policy if exists "cart_items_manage_own_or_admin" on public.cart_items;
create policy "cart_items_select_own_or_admin"
on public.cart_items for select
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
);
create policy "cart_items_manage_own_or_admin"
on public.cart_items for all
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "wishlists_select_own_or_admin" on public.wishlists;
drop policy if exists "wishlists_manage_own_or_admin" on public.wishlists;
create policy "wishlists_select_own_or_admin"
on public.wishlists for select
using (auth.uid() = user_id or public.is_admin());
create policy "wishlists_manage_own_or_admin"
on public.wishlists for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "wishlist_items_select_own_or_admin" on public.wishlist_items;
drop policy if exists "wishlist_items_manage_own_or_admin" on public.wishlist_items;
create policy "wishlist_items_select_own_or_admin"
on public.wishlist_items for select
using (
  exists (
    select 1 from public.wishlists w
    where w.id = wishlist_items.wishlist_id
      and (w.user_id = auth.uid() or public.is_admin())
  )
);
create policy "wishlist_items_manage_own_or_admin"
on public.wishlist_items for all
using (
  exists (
    select 1 from public.wishlists w
    where w.id = wishlist_items.wishlist_id
      and (w.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.wishlists w
    where w.id = wishlist_items.wishlist_id
      and (w.user_id = auth.uid() or public.is_admin())
  )
);
