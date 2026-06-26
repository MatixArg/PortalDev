-- PortalDev Admin Panel
-- Migration 00002: Add admin support

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create a security definer function to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Drop old policies to avoid collision
DROP POLICY IF EXISTS "admins_read_all" ON public.users;
DROP POLICY IF EXISTS "admins_read_all_profiles" ON public.developer_profiles;
DROP POLICY IF EXISTS "admins_read_all_projects" ON public.projects;
DROP POLICY IF EXISTS "admins_delete_projects" ON public.projects;

-- Recreate policies using the security definer function
CREATE POLICY "admins_read_all" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admins_read_all_profiles" ON public.developer_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admins_read_all_projects" ON public.projects
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admins_delete_projects" ON public.projects
  FOR DELETE USING (public.is_admin());

