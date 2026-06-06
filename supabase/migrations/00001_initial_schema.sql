-- PortalDev Database Schema
-- Migration 00001: Initial Schema

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('developer', 'company')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEVELOPER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.developer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  bio TEXT CHECK (char_length(bio) <= 500),
  location TEXT,
  country TEXT,
  website TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  availability TEXT NOT NULL DEFAULT 'open' CHECK (availability IN ('available', 'open', 'busy', 'unavailable')),
  experience_level TEXT CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_developer_profiles_username ON public.developer_profiles(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_developer_profiles_user_id ON public.developer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_profiles_availability ON public.developer_profiles(availability);
CREATE INDEX IF NOT EXISTS idx_developer_profiles_country ON public.developer_profiles(country);

-- ============================================
-- COMPANY PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  banner_url TEXT,
  size TEXT,
  industry TEXT,
  location TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_company_profiles_user_id ON public.company_profiles(user_id);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  project_url TEXT,
  github_url TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON public.projects USING GIN(technologies);

-- ============================================
-- SKILLS
-- ============================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

-- ============================================
-- DEVELOPER SKILLS (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.developer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_developer_skills_user_id ON public.developer_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_skills_skill_id ON public.developer_skills(skill_id);

-- ============================================
-- EDUCATION
-- ============================================
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education(user_id);

-- ============================================
-- CERTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  credential_url TEXT,
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON public.certifications(user_id);

-- ============================================
-- WORK EXPERIENCE
-- ============================================
CREATE TABLE IF NOT EXISTS public.work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON public.work_experience(user_id);

-- ============================================
-- GITHUB INTEGRATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.github_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  github_id BIGINT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  access_token TEXT NOT NULL,
  public_repos INTEGER DEFAULT 0,
  total_stars INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  languages JSONB DEFAULT '{}',
  top_repos JSONB DEFAULT '[]',
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_github_integrations_user_id ON public.github_integrations(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_github_integrations_github_id ON public.github_integrations(github_id);

-- ============================================
-- SAVED DEVELOPERS (for companies)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, developer_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_developers_company ON public.saved_developers(company_id);
CREATE INDEX IF NOT EXISTS idx_saved_developers_developer ON public.saved_developers(developer_id);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developer_profiles_updated_at
  BEFORE UPDATE ON public.developer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_github_integrations_updated_at
  BEFORE UPDATE ON public.github_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE USER ON AUTH.SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, email_verified, full_name, avatar_url, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'developer')
  );

  -- Auto-create developer profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'developer') = 'developer' THEN
    INSERT INTO public.developer_profiles (user_id, username, display_name)
    VALUES (
      NEW.id,
      LOWER(SPLIT_PART(NEW.email, '@', 1)),
      NEW.raw_user_meta_data->>'full_name'
    )
    ON CONFLICT (username) DO UPDATE
    SET username = LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTR(NEW.id::text, 1, 8);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_developers ENABLE ROW LEVEL SECURITY;

-- Users: can read own, admins can read all
CREATE POLICY "users_read_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Developer Profiles: public read, owner write
CREATE POLICY "profiles_public_select" ON public.developer_profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_owner_insert" ON public.developer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_owner_update" ON public.developer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_owner_delete" ON public.developer_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Company Profiles: public read, owner write
CREATE POLICY "company_public_select" ON public.company_profiles
  FOR SELECT USING (true);

CREATE POLICY "company_owner_insert" ON public.company_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "company_owner_update" ON public.company_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects: public read, owner write
CREATE POLICY "projects_public_select" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "projects_owner_insert" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_owner_update" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects_owner_delete" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Skills: public read
CREATE POLICY "skills_public_select" ON public.skills
  FOR SELECT USING (true);

-- Developer Skills: public read, owner write
CREATE POLICY "dev_skills_public_select" ON public.developer_skills
  FOR SELECT USING (true);

CREATE POLICY "dev_skills_owner_insert" ON public.developer_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dev_skills_owner_update" ON public.developer_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dev_skills_owner_delete" ON public.developer_skills
  FOR DELETE USING (auth.uid() = user_id);

-- Education: public read, owner write
CREATE POLICY "education_public_select" ON public.education
  FOR SELECT USING (true);

CREATE POLICY "education_owner_insert" ON public.education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "education_owner_update" ON public.education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "education_owner_delete" ON public.education
  FOR DELETE USING (auth.uid() = user_id);

-- Certifications: public read, owner write
CREATE POLICY "certs_public_select" ON public.certifications
  FOR SELECT USING (true);

CREATE POLICY "certs_owner_insert" ON public.certifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "certs_owner_update" ON public.certifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Work Experience: public read, owner write
CREATE POLICY "experience_public_select" ON public.work_experience
  FOR SELECT USING (true);

CREATE POLICY "experience_owner_insert" ON public.work_experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "experience_owner_update" ON public.work_experience
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "experience_owner_delete" ON public.work_experience
  FOR DELETE USING (auth.uid() = user_id);

-- GitHub Integrations: public read, owner write
CREATE POLICY "github_public_select" ON public.github_integrations
  FOR SELECT USING (true);

CREATE POLICY "github_owner_insert" ON public.github_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "github_owner_update" ON public.github_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "github_owner_delete" ON public.github_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Saved Developers: company read/write
CREATE POLICY "saved_company_select" ON public.saved_developers
  FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "saved_company_insert" ON public.saved_developers
  FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "saved_company_delete" ON public.saved_developers
  FOR DELETE USING (auth.uid() = company_id);

-- ============================================
-- SEARCH FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.search_developers(
  search_query TEXT DEFAULT NULL,
  technology TEXT DEFAULT NULL,
  country_filter TEXT DEFAULT NULL,
  availability_filter TEXT DEFAULT NULL,
  limit_num INTEGER DEFAULT 20,
  offset_num INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  country TEXT,
  availability TEXT,
  experience_level TEXT,
  skills JSONB,
  project_count BIGINT,
  total_stars INTEGER
) LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    dp.id,
    dp.user_id,
    dp.username,
    dp.display_name,
    dp.avatar_url,
    dp.bio,
    dp.location,
    dp.country,
    dp.availability,
    dp.experience_level,
    COALESCE(
      (SELECT JSONB_OBJECT_AGG(s.name, ds.proficiency)
       FROM public.developer_skills ds
       JOIN public.skills s ON s.id = ds.skill_id
       WHERE ds.user_id = dp.user_id),
      '{}'::jsonb
    ) AS skills,
    (SELECT COUNT(*)::bigint FROM public.projects p WHERE p.user_id = dp.user_id) AS project_count,
    COALESCE((SELECT gi.total_stars FROM public.github_integrations gi WHERE gi.user_id = dp.user_id), 0) AS total_stars
  FROM public.developer_profiles dp
  WHERE
    (search_query IS NULL OR dp.username ILIKE '%' || search_query || '%' OR dp.display_name ILIKE '%' || search_query || '%')
    AND (country_filter IS NULL OR dp.country = country_filter)
    AND (availability_filter IS NULL OR dp.availability = availability_filter)
    AND (
      technology IS NULL OR
      EXISTS (
        SELECT 1 FROM public.developer_skills ds
        JOIN public.skills s ON s.id = ds.skill_id
        WHERE ds.user_id = dp.user_id AND s.name ILIKE '%' || technology || '%'
      )
    )
  ORDER BY total_stars DESC, dp.created_at DESC
  LIMIT limit_num
  OFFSET offset_num;
END;
$$;
