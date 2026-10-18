-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists vector;

-- ─── 1. Enums ─────────────────────────────────────────────────────────────────
create type vendor_category as enum (
  'Venue',
  'Catering',
  'Photography',
  'Decor & Flowers',
  'Entertainment'
);

create type sg_region as enum (
  'CBD',
  'Marina Bay',
  'Sentosa',
  'Orchard',
  'Bugis',
  'Changi',
  'Outram',
  'Raffles Place'
);

create type shortlist_status as enum ('Shortlisted', 'Passed', 'Booked');

-- ─── 2. Venues ────────────────────────────────────────────────────────────────
create table venues (
  id              uuid          primary key default gen_random_uuid(),
  name            text          not null,
  slug            text          unique not null,
  description     text,
  region          sg_region     not null,
  address         text          not null,
  max_capacity    integer       not null,
  min_pax_price   numeric(10,2) not null,
  est_total_price numeric(12,2) not null,
  venue_type      text[]        not null,   -- e.g. ['Hotel Ballroom', 'Heritage']
  image_url       text,                     -- card image on /recommendation
  rating          numeric(2,1)  check (rating between 1.0 and 5.0),
  review_count    integer       default 0,
  is_featured     boolean       default false,
  embedding       vector(1536),
  created_at      timestamptz   default now() not null,
  updated_at      timestamptz   default now() not null
);

-- ─── 3. Vendors ───────────────────────────────────────────────────────────────
create table vendors (
  id           uuid             primary key default gen_random_uuid(),
  name         text             not null,
  slug         text             unique not null,
  category     vendor_category  not null,
  description  text,
  base_price   numeric(10,2)    not null,
  specialties  text[]           not null,  -- e.g. ['Cinematic', 'Fine Dining']
  image_url    text,
  rating       numeric(2,1)     check (rating between 1.0 and 5.0),
  review_count integer          default 0,
  is_featured  boolean          default false,
  embedding    vector(1536),
  created_at   timestamptz      default now() not null,
  updated_at   timestamptz      default now() not null
);

-- ─── 4. Event Briefs ──────────────────────────────────────────────────────────
-- remaining_budget is NOT stored here — it is computed in the view below
-- to prevent it drifting out of sync with shortlisted items.
create table event_briefs (
  id           uuid          primary key default gen_random_uuid(),
  user_id      uuid          references auth.users(id) on delete cascade not null,
  event_name   text          not null,
  event_date   date          not null,
  guest_count  integer       not null,
  total_budget numeric(12,2) not null,
  raw_prompt   text,
  created_at   timestamptz   default now() not null
);

-- ─── 5. Shortlists ────────────────────────────────────────────────────────────
create table shortlists (
  id         uuid             primary key default gen_random_uuid(),
  brief_id   uuid             references event_briefs(id) on delete cascade not null,
  venue_id   uuid             references venues(id)  on delete cascade,
  vendor_id  uuid             references vendors(id) on delete cascade,
  status     shortlist_status default 'Shortlisted' not null,
  created_at timestamptz      default now() not null,

  constraint shortlist_one_target check (
    (venue_id is not null and vendor_id is null) or
    (vendor_id is not null and venue_id is null)
  )
);

-- ─── 6. Budget Summary View ───────────────────────────────────────────────────
-- Computes committed spend and remaining budget dynamically from shortlists.
create view brief_budget_summary as
select
  eb.id            as brief_id,
  eb.total_budget,
  coalesce(sum(
    case
      when s.venue_id  is not null then v.est_total_price
      when s.vendor_id is not null then vd.base_price
    end
  ) filter (where s.status in ('Shortlisted', 'Booked')), 0) as total_committed,
  eb.total_budget - coalesce(sum(
    case
      when s.venue_id  is not null then v.est_total_price
      when s.vendor_id is not null then vd.base_price
    end
  ) filter (where s.status in ('Shortlisted', 'Booked')), 0) as remaining_budget
from event_briefs eb
left join shortlists s  on s.brief_id  = eb.id
left join venues     v  on v.id        = s.venue_id
left join vendors    vd on vd.id       = s.vendor_id
group by eb.id, eb.total_budget;

-- ─── 7. updated_at Trigger ────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger venues_updated_at
  before update on venues
  for each row execute function set_updated_at();

create trigger vendors_updated_at
  before update on vendors
  for each row execute function set_updated_at();

-- ─── 8. Vector Indexes (HNSW) ─────────────────────────────────────────────────
-- Required for sub-second similarity search at scale.
create index venues_embedding_hnsw  on venues  using hnsw (embedding vector_cosine_ops);
create index vendors_embedding_hnsw on vendors using hnsw (embedding vector_cosine_ops);

-- ─── 9. AI Vector Matching Functions ─────────────────────────────────────────

-- Match venues by semantic similarity
create or replace function match_venues (
  query_embedding  vector(1536),
  match_threshold  float,
  match_count      int,
  min_capacity     int     default 0,
  max_budget       numeric default 99999999
)
returns table (
  id              uuid,
  name            text,
  region          sg_region,
  address         text,
  max_capacity    integer,
  min_pax_price   numeric,
  est_total_price numeric,
  venue_type      text[],
  image_url       text,
  rating          numeric,
  review_count    integer,
  is_featured     boolean,
  similarity      float
)
language sql stable as $$
  select
    id, name, region, address, max_capacity,
    min_pax_price, est_total_price, venue_type, image_url,
    rating, review_count, is_featured,
    1 - (embedding <=> query_embedding) as similarity
  from venues
  where 1 - (embedding <=> query_embedding) > match_threshold
    and max_capacity    >= min_capacity
    and est_total_price <= max_budget
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Match vendors by semantic similarity
create or replace function match_vendors (
  query_embedding  vector(1536),
  match_threshold  float,
  match_count      int,
  category_filter  vendor_category default null,
  max_budget       numeric         default 99999999
)
returns table (
  id           uuid,
  name         text,
  category     vendor_category,
  description  text,
  base_price   numeric,
  specialties  text[],
  image_url    text,
  rating       numeric,
  review_count integer,
  is_featured  boolean,
  similarity   float
)
language sql stable as $$
  select
    id, name, category, description, base_price,
    specialties, image_url, rating, review_count, is_featured,
    1 - (embedding <=> query_embedding) as similarity
  from vendors
  where 1 - (embedding <=> query_embedding) > match_threshold
    and base_price <= max_budget
    and (category_filter is null or category = category_filter)
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ─── 10. Row Level Security ───────────────────────────────────────────────────
alter table venues        enable row level security;
alter table vendors       enable row level security;
alter table event_briefs  enable row level security;
alter table shortlists    enable row level security;

-- Venues & vendors: public read, no public write
create policy "Public read venues"
  on venues for select using (true);

create policy "Public read vendors"
  on vendors for select using (true);

-- Event briefs: users see and manage only their own
create policy "Users manage own briefs"
  on event_briefs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Shortlists: users see only shortlists belonging to their briefs
create policy "Users manage own shortlists"
  on shortlists for all
  using (
    exists (
      select 1 from event_briefs eb
      where eb.id = shortlists.brief_id
        and eb.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from event_briefs eb
      where eb.id = shortlists.brief_id
        and eb.user_id = auth.uid()
    )
  );
