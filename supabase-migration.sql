-- Create requests table
create table if not exists public.requests (
  id uuid primary key,
  business_details text not null,
  website_structure text not null,
  output_link text,
  status text not null default 'pending' check (status in ('pending','ready','error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create updated_at trigger function
create or replace function public.touch_updated_at() returns trigger as $$
begin 
  new.updated_at = now(); 
  return new; 
end; 
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists trg_requests_updated_at on public.requests;
create trigger trg_requests_updated_at 
  before update on public.requests
  for each row execute function public.touch_updated_at();

-- Enable Row Level Security
alter table public.requests enable row level security;

-- Policies for anon key: allow insert/select/update of specific fields (no deletes)
create policy "allow insert" on public.requests
  for insert to anon with check (true);

create policy "allow select" on public.requests
  for select to anon using (true);

create policy "allow update output" on public.requests
  for update to anon using (true) with check (true);
