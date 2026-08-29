-- ============================================================================
-- YAIdigitals brand/CMS upgrade — additive migration.
-- Extends projects, blog_posts and services; adds industries, technologies,
-- testimonials, team_members and redirects tables; tightens a few RLS gaps;
-- provisions the public media storage bucket with admin-only writes.
-- Safe to re-run: every statement is guarded (IF NOT EXISTS / drop-if-exists).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROJECTS — case-study fields (existing columns are preserved)
-- ---------------------------------------------------------------------------
alter table public.projects add column if not exists status text default 'published' not null;
alter table public.projects add column if not exists industry text;
alter table public.projects add column if not exists short_description text;
alter table public.projects add column if not exists cover_image text;
alter table public.projects add column if not exists thumbnail text;
alter table public.projects add column if not exists logo_url text;
alter table public.projects add column if not exists services_provided jsonb default '[]'::jsonb;
alter table public.projects add column if not exists key_features jsonb default '[]'::jsonb;
alter table public.projects add column if not exists business_requirement text;
alter table public.projects add column if not exists architecture_overview text;
alter table public.projects add column if not exists development_approach text;
alter table public.projects add column if not exists outcome text;
alter table public.projects add column if not exists cta_text text;
alter table public.projects add column if not exists cta_url text;
alter table public.projects add column if not exists og_title text;
alter table public.projects add column if not exists og_description text;
alter table public.projects add column if not exists og_image text;
alter table public.projects add column if not exists sort_order integer default 0 not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_status_check') then
    alter table public.projects add constraint projects_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

-- Drafts must not be publicly readable (admins are covered by the manage policy).
drop policy if exists "Projects are viewable by everyone" on public.projects;
create policy "Published projects are viewable by everyone" on public.projects
  for select using (status = 'published');

-- ---------------------------------------------------------------------------
-- 2. BLOG POSTS — author/SEO/featured support (active stays the publish flag)
-- ---------------------------------------------------------------------------
alter table public.blog_posts add column if not exists updated_at timestamptz default now() not null;
alter table public.blog_posts add column if not exists featured boolean default false not null;
alter table public.blog_posts add column if not exists cover_image text;
alter table public.blog_posts add column if not exists author_name text;
alter table public.blog_posts add column if not exists author_role text;
alter table public.blog_posts add column if not exists tags jsonb default '[]'::jsonb;
alter table public.blog_posts add column if not exists seo_title text;
alter table public.blog_posts add column if not exists seo_description text;

-- ---------------------------------------------------------------------------
-- 3. SERVICES — hero/process/FAQ support for rich service pages
-- ---------------------------------------------------------------------------
alter table public.services add column if not exists hero_title text;
alter table public.services add column if not exists hero_image text;
alter table public.services add column if not exists process jsonb default '[]'::jsonb;
alter table public.services add column if not exists faqs jsonb default '[]'::jsonb;
alter table public.services add column if not exists related_project_slugs jsonb default '[]'::jsonb;
alter table public.services add column if not exists og_image text;

-- ---------------------------------------------------------------------------
-- 4. LEADS — add 'proposal_sent' to the pipeline (keep 'in_progress' for data
--    already stored with the old value)
-- ---------------------------------------------------------------------------
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'in_progress', 'won', 'lost'));
alter table public.leads add column if not exists existing_website text;

-- ---------------------------------------------------------------------------
-- 5. NEW TABLES
-- ---------------------------------------------------------------------------
create table if not exists public.industries (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  name text not null,
  slug text not null unique,
  icon text,
  image_url text,
  short_description text,
  long_description text,
  services jsonb default '[]'::jsonb,
  seo_title text,
  seo_description text,
  featured boolean default false not null,
  published boolean default true not null,
  sort_order integer default 0 not null
);

create table if not exists public.technologies (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  name text not null unique,
  logo_url text,
  category text,
  website_url text,
  sort_order integer default 0 not null,
  active boolean default true not null
);

create table if not exists public.testimonials (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  client_name text not null,
  client_role text,
  company text,
  company_logo_url text,
  photo_url text,
  quote text not null,
  project_title text,
  rating integer check (rating between 1 and 5),
  source text,
  source_url text,
  featured boolean default false not null,
  published boolean default false not null,
  sort_order integer default 0 not null
);

create table if not exists public.team_members (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  name text not null,
  photo_url text,
  role text,
  short_bio text,
  linkedin_url text,
  github_url text,
  website_url text,
  sort_order integer default 0 not null,
  published boolean default false not null
);

create table if not exists public.redirects (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  old_path text not null unique,
  new_path text not null,
  status integer default 301 not null,
  active boolean default true not null
);

-- Media alt/title metadata for accessibility
alter table public.media add column if not exists alt text;
alter table public.media add column if not exists title text;

-- ---------------------------------------------------------------------------
-- 6. RLS FOR NEW TABLES (public reads only published/active rows)
-- ---------------------------------------------------------------------------
alter table public.industries enable row level security;
alter table public.technologies enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.redirects enable row level security;

create policy "Published industries are viewable by everyone" on public.industries
  for select using (published = true);
create policy "Industries are manageable by admins" on public.industries
  for all using (auth.role() = 'service_role' or public.is_admin());

create policy "Active technologies are viewable by everyone" on public.technologies
  for select using (active = true);
create policy "Technologies are manageable by admins" on public.technologies
  for all using (auth.role() = 'service_role' or public.is_admin());

create policy "Published testimonials are viewable by everyone" on public.testimonials
  for select using (published = true);
create policy "Testimonials are manageable by admins" on public.testimonials
  for all using (auth.role() = 'service_role' or public.is_admin());

create policy "Published team members are viewable by everyone" on public.team_members
  for select using (published = true);
create policy "Team members are manageable by admins" on public.team_members
  for all using (auth.role() = 'service_role' or public.is_admin());

-- Redirects are consumed server-side only; no public read policy (deny by default).
create policy "Redirects are manageable by admins" on public.redirects
  for all using (auth.role() = 'service_role' or public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. TIGHTEN course_modules — only modules of published courses leak publicly
-- ---------------------------------------------------------------------------
drop policy if exists "Modules are viewable by everyone" on public.course_modules;
create policy "Published course modules are viewable by everyone" on public.course_modules
  for select using (
    exists (
      select 1 from public.courses c
      where c.id = course_modules.course_id and c.published = true
    )
  );

-- ---------------------------------------------------------------------------
-- 8. MEDIA STORAGE BUCKET + POLICIES (public read, admin-only writes)
--    The bucket may already exist (created in the dashboard) — insert is idempotent.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Media files are publicly readable" on storage.objects;
create policy "Media files are publicly readable" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Media uploads are admin only" on storage.objects;
create policy "Media uploads are admin only" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Media updates are admin only" on storage.objects;
create policy "Media updates are admin only" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Media deletes are admin only" on storage.objects;
create policy "Media deletes are admin only" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. INDEXES for frequently queried lookups
-- ---------------------------------------------------------------------------
create index if not exists idx_projects_featured_sort on public.projects (featured desc, sort_order asc, created_at desc);
create index if not exists idx_projects_status on public.projects (status);
create index if not exists idx_services_active_sort on public.services (active, sort_order);
create index if not exists idx_blog_active_published on public.blog_posts (active, published_at desc);
create index if not exists idx_industries_published_sort on public.industries (published, sort_order);
create index if not exists idx_technologies_active_sort on public.technologies (active, sort_order);
create index if not exists idx_testimonials_published_sort on public.testimonials (published, sort_order);
create index if not exists idx_team_published_sort on public.team_members (published, sort_order);
create index if not exists idx_redirects_active on public.redirects (active, old_path);
