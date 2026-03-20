create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  brand text not null default 'WEARVIO',
  sku text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  image_url text,
  sizes jsonb not null default '[]'::jsonb,
  tag text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'paid', 'shipped', 'cancelled')),
  total_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.stock_logs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  changed_by uuid references public.users(id) on delete set null,
  quantity_before integer not null,
  quantity_after integer not null,
  delta integer not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  topics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_stock_logs_product_id on public.stock_logs(product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.sync_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.sync_auth_user();

create or replace function public.log_product_stock_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_user text;
  requested_reason text;
begin
  if new.quantity is distinct from old.quantity then
    requested_user := current_setting('app.changed_by', true);
    requested_reason := current_setting('app.stock_reason', true);

    insert into public.stock_logs (
      product_id,
      changed_by,
      quantity_before,
      quantity_after,
      delta,
      reason
    )
    values (
      new.id,
      nullif(requested_user, '')::uuid,
      old.quantity,
      new.quantity,
      new.quantity - old.quantity,
      coalesce(nullif(requested_reason, ''), 'Inventory update')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute procedure public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute procedure public.set_updated_at();

drop trigger if exists trg_products_stock_log on public.products;
create trigger trg_products_stock_log
after update on public.products
for each row
execute procedure public.log_product_stock_change();

create or replace function public.create_order_with_items(
  p_user_id uuid,
  p_items jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_qty integer;
  v_total numeric(10,2) := 0;
begin
  if p_user_id is null then
    raise exception 'Authenticated user is required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one cart item is required';
  end if;

  insert into public.orders (user_id, status, total_amount)
  values (p_user_id, 'processing', 0)
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1, coalesce((v_item ->> 'quantity')::integer, 1));

    select *
      into v_product
      from public.products
     where id = (v_item ->> 'product_id')::uuid
       and is_active = true
     for update;

    if not found then
      raise exception 'One of the products is no longer available';
    end if;

    if v_product.quantity < v_qty then
      raise exception 'Not enough stock for %', v_product.name;
    end if;

    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order.id, v_product.id, v_qty, v_product.price);

    perform set_config('app.changed_by', p_user_id::text, true);
    perform set_config('app.stock_reason', format('Order %s placed', v_order.id), true);

    update public.products
       set quantity = quantity - v_qty
     where id = v_product.id;

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update public.orders
     set total_amount = v_total,
         status = 'paid'
   where id = v_order.id
  returning * into v_order;

  return v_order;
end;
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.stock_logs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public categories read" on public.categories;
create policy "Public categories read"
on public.categories
for select
using (true);

drop policy if exists "Public active products read" on public.products;
create policy "Public active products read"
on public.products
for select
using (is_active = true);

drop policy if exists "User reads own profile" on public.users;
create policy "User reads own profile"
on public.users
for select
to authenticated
using (id = auth.uid());

drop policy if exists "User updates own profile" on public.users;
create policy "User updates own profile"
on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "User reads own orders" on public.orders;
create policy "User reads own orders"
on public.orders
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "User reads own order items" on public.order_items;
create policy "User reads own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
      from public.orders
     where public.orders.id = order_items.order_id
       and public.orders.user_id = auth.uid()
  )
);

