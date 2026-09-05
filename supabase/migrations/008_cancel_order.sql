-- Allow customers to cancel their own orders before fulfillment begins.

create or replace function public.cancel_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  affected_rows integer;
begin
  update public.orders
  set status = 'cancelled', updated_at = now()
  where id = p_order_id
    and customer_id = auth.uid()
    and status in ('pending', 'processing');

  get diagnostics affected_rows = row_count;
  return affected_rows > 0;
end;
$$;

revoke all on function public.cancel_order(uuid) from public;
grant execute on function public.cancel_order(uuid) to authenticated;