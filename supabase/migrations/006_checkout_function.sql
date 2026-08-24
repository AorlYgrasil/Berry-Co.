-- Checkout runs as one database transaction without requiring the service-role key
-- in the customer-facing Railway runtime.

create or replace function public.checkout_cart(
  p_shipping_address jsonb,
  p_payment_method text,
  p_shipping_fee numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  current_cart_id uuid;
  item record;
  product record;
  subtotal numeric(12,2) := 0;
  order_row public.orders%rowtype;
begin
  if current_user_id is null then
    raise exception 'UNAUTHENTICATED' using errcode = 'P0001';
  end if;

  select id into current_cart_id
  from public.carts
  where user_id = current_user_id
  limit 1;

  if current_cart_id is null then
    raise exception 'Your cart is empty.' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.cart_items where cart_id = current_cart_id) then
    raise exception 'Your cart is empty.' using errcode = 'P0001';
  end if;

  for item in
    select product_id, quantity
    from public.cart_items
    where cart_id = current_cart_id
  loop
    select id, name, price, stock into product
    from public.products
    where id = item.product_id
    for update;

    if product.id is null then
      raise exception 'A product in your cart is no longer available.' using errcode = 'P0001';
    end if;
    if product.stock < item.quantity then
      raise exception 'Not enough stock for "%".' , product.name using errcode = 'P0001';
    end if;

    subtotal := subtotal + product.price * item.quantity;
  end loop;

  insert into public.orders (
    order_number,
    customer_id,
    customer_name,
    customer_email,
    total_amount,
    status,
    payment_status,
    shipping_address
  ) values (
    'BC-' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
    current_user_id,
    coalesce(p_shipping_address->>'fullName', ''),
    auth.email(),
    subtotal + coalesce(p_shipping_fee, 0),
    'pending',
    'pending',
    p_shipping_address::text
  ) returning * into order_row;

  for item in
    select product_id, quantity
    from public.cart_items
    where cart_id = current_cart_id
  loop
    select id, name, price, stock into product
    from public.products
    where id = item.product_id
    for update;

    insert into public.order_items (order_id, product_id, product_name, quantity, price)
    values (order_row.id, product.id, product.name, item.quantity, product.price);

    update public.products
    set stock = product.stock - item.quantity,
        updated_at = now()
    where id = product.id;
  end loop;

  delete from public.cart_items
  where cart_id = current_cart_id;

  return jsonb_build_object('order', to_jsonb(order_row));
end;
$$;

revoke all on function public.checkout_cart(jsonb, text, numeric) from public;
grant execute on function public.checkout_cart(jsonb, text, numeric) to authenticated;
