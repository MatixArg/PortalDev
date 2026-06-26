-- PortalDev Admin Panel
-- Migration 00002: Add admin support

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

CREATE POLICY "admins_read_all" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = TRUE)
  );

CREATE POLICY "admins_read_all_profiles" ON public.developer_profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = TRUE)
  );

CREATE POLICY "admins_read_all_projects" ON public.projects
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = TRUE)
  );

CREATE POLICY "admins_delete_projects" ON public.projects
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = TRUE)
  );
