-- Admin approval gate
-- New admins must be approved (by an already-approved super admin) before they
-- can access the admin panel or pass any RLS "manageable by admins" policy.
-- The approvals table has NO policies: it is only readable/writable through
-- the service role key (server-side API routes). Users can never edit their
-- own approval status from the client.

create table if not exists public.admin_approvals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  approved boolean not null default false,
  requested_at timestamptz default now() not null,
  decided_at timestamptz,
  decided_by uuid references auth.users(id)
);

alter table if exists public.admin_approvals enable row level security;

-- No policies created deliberately: deny-by-default for anon/authenticated.
-- Service role bypasses RLS and is the only writer (via server routes).

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_approvals aa
    join auth.users u on u.id = aa.user_id
    where aa.user_id = auth.uid()
      and aa.approved = true
      and u.raw_user_meta_data->>'role' = 'admin'
  );
$$;

-- Recreate every admin policy against the new gate.
-- (Drop first so this migration is safely re-runnable.)

drop policy if exists "Services are manageable by admins" ON public.services;
create policy "Services are manageable by admins" ON public.services
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Courses are manageable by admins" ON public.courses;
create policy "Courses are manageable by admins" ON public.courses
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Modules are manageable by admins" ON public.course_modules;
create policy "Modules are manageable by admins" ON public.course_modules
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Lessons are manageable by admins" ON public.course_lessons;
create policy "Lessons are manageable by admins" ON public.course_lessons
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Enrollments are manageable by admins" ON public.course_enrollments;
create policy "Enrollments are manageable by admins" ON public.course_enrollments
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Projects are manageable by admins" ON public.projects;
create policy "Projects are manageable by admins" ON public.projects
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Leads are manageable by admins" ON public.leads;
create policy "Leads are manageable by admins" ON public.leads
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Products are manageable by admins" ON public.products;
create policy "Products are manageable by admins" ON public.products
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Bundles are manageable by admins" ON public.bundles;
create policy "Bundles are manageable by admins" ON public.bundles
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Blog posts are manageable by admins" ON public.blog_posts;
create policy "Blog posts are manageable by admins" ON public.blog_posts
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Media is manageable by admins" ON public.media;
create policy "Media is manageable by admins" ON public.media
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Settings are manageable by admins" ON public.settings;
create policy "Settings are manageable by admins" ON public.settings
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Orders are viewable by admins only" ON public.orders;
create policy "Orders are viewable by admins only" ON public.orders
  FOR SELECT USING (auth.role() = 'service_role' OR public.is_admin());

drop policy if exists "Orders are manageable by admins" ON public.orders;
create policy "Orders are manageable by admins" ON public.orders
  FOR ALL USING (auth.role() = 'service_role' OR public.is_admin());
