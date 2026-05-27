-- Run this in Supabase → SQL Editor

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  price decimal not null,
  original_price decimal,
  description text,
  details text[],
  sizes text[],
  images text[],
  featured boolean default false,
  is_new boolean default false,
  is_sale boolean default false,
  stock int default 0,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  email text,
  items jsonb,
  shipping_address jsonb,
  subtotal decimal,
  shipping decimal,
  tax decimal,
  total decimal,
  payment_intent_id text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- Allow anyone to read products
alter table products enable row level security;
create policy "Products are public" on products for select using (true);
create policy "Admins can manage products" on products for all using (auth.role() = 'authenticated');

-- Orders: users see their own, create freely
alter table orders enable row level security;
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Anyone can create orders" on orders for insert with check (true);
