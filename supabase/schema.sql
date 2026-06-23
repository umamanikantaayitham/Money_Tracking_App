-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile for a new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INCOME TABLE
create table income (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric not null check (amount > 0),
  source text not null,
  category text not null,
  notes text,
  transaction_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table income enable row level security;
create policy "Users can manage own income" on income for all using (auth.uid() = user_id);

-- EXPENSES TABLE
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric not null check (amount > 0),
  expense_name text not null,
  category text not null,
  notes text,
  transaction_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table expenses enable row level security;
create policy "Users can manage own expenses" on expenses for all using (auth.uid() = user_id);

-- BUDGETS TABLE
create table budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  budget_amount numeric not null check (budget_amount > 0),
  month text not null, -- format: YYYY-MM
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, category, month)
);

alter table budgets enable row level security;
create policy "Users can manage own budgets" on budgets for all using (auth.uid() = user_id);
