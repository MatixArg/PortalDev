-- PortalDev Enterprise Admin
-- Migration 00003: RBAC, Logs, Reports, Premium, Ads, Settings

-- ============================================
-- ADMIN ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'moderator', 'support')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  UNIQUE(role, resource, action)
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'appealed', 'closed')),
  moderator_id UUID REFERENCES public.users(id),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_type, target_id);

-- ============================================
-- APPEALS
-- ============================================
CREATE TABLE IF NOT EXISTS public.appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  ban_reason TEXT NOT NULL,
  appeal_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'info_needed')),
  moderator_id UUID REFERENCES public.users(id),
  decision TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BANNED USERS
-- ============================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- ============================================
-- PREMIUM
-- ============================================
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'refunded')),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_premium_user ON public.premium_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_status ON public.premium_subscriptions(status);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  audience TEXT DEFAULT 'everyone' CHECK (audience IN ('everyone', 'premium', 'companies', 'developers', 'freelancers', 'selected')),
  target_user_ids UUID[],
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- ============================================
-- PLATFORM SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.platform_settings (key, value) VALUES
  ('general', '{"name":"PortalDev","logo":"","maintenance":false,"registration":true,"default_language":"en","timezone":"UTC"}'),
  ('seo', '{"title":"PortalDev","description":"Build your reputation with projects","og_image":""}'),
  ('auth', '{"github":true,"google":true,"email":true}'),
  ('legal', '{"terms":"","privacy":"","cookies":"","guidelines":""}'),
  ('content', '{"max_upload_size":10,"allowed_types":["jpg","png","webp","svg"],"image_compression":true}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- FEATURE FLAGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('premium', false, 'Premium subscription system'),
  ('ads', false, 'Advertisement platform'),
  ('jobs', false, 'Job posting board'),
  ('articles', false, 'Blog and articles system'),
  ('messaging', false, 'Direct messaging between users')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ADS
-- ============================================
CREATE TABLE IF NOT EXISTS public.advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  target_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'scheduled', 'expired')),
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  budget DECIMAL(10,2),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECURITY LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id),
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_event ON public.security_logs(event);
CREATE INDEX IF NOT EXISTS idx_security_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_created ON public.security_logs(created_at);

-- ============================================
-- MODERATION QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  report_count INTEGER DEFAULT 0,
  spam_score DECIMAL(5,2) DEFAULT 0,
  toxicity_score DECIMAL(5,2) DEFAULT 0,
  copyright_warning BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STORED PROCEDURE: check permission
-- ============================================
CREATE OR REPLACE FUNCTION public.has_permission(p_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
    AND role = ANY(p_roles)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Admin can see everything
DROP POLICY IF EXISTS "admin_full_access_audit" ON public.audit_logs;
CREATE POLICY "admin_full_access_audit" ON public.audit_logs FOR ALL USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_full_access_reports" ON public.reports;
CREATE POLICY "admin_full_access_reports" ON public.reports FOR ALL USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_full_access_appeals" ON public.appeals;
CREATE POLICY "admin_full_access_appeals" ON public.appeals FOR ALL USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_read_premium" ON public.premium_subscriptions;
CREATE POLICY "admin_read_premium" ON public.premium_subscriptions FOR SELECT USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_full_access_notifications" ON public.admin_notifications;
CREATE POLICY "admin_full_access_notifications" ON public.admin_notifications FOR ALL USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_read_settings" ON public.platform_settings;
CREATE POLICY "admin_read_settings" ON public.platform_settings FOR SELECT USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_write_settings" ON public.platform_settings;
CREATE POLICY "admin_write_settings" ON public.platform_settings FOR UPDATE USING (public.has_permission(ARRAY['super_admin']));

DROP POLICY IF EXISTS "admin_full_access_ads" ON public.advertisements;
CREATE POLICY "admin_full_access_ads" ON public.advertisements FOR ALL USING (public.has_permission(ARRAY['super_admin']));

DROP POLICY IF EXISTS "admin_read_security" ON public.security_logs;
CREATE POLICY "admin_read_security" ON public.security_logs FOR SELECT USING (public.has_permission(ARRAY['super_admin']));

DROP POLICY IF EXISTS "admin_full_access_moderation" ON public.moderation_queue;
CREATE POLICY "admin_full_access_moderation" ON public.moderation_queue FOR ALL USING (public.has_permission(ARRAY['super_admin', 'moderator']));

DROP POLICY IF EXISTS "admin_full_access_roles" ON public.admin_roles;
CREATE POLICY "admin_full_access_roles" ON public.admin_roles FOR ALL USING (public.has_permission(ARRAY['super_admin']));


-- ============================================
-- STORED PROCEDURE: log audit
-- ============================================
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.audit_logs (admin_id, action, target_type, target_id, metadata, ip_address)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_metadata, current_setting('request.headers', true)::json->>'x-forwarded-for')
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored procedure check permission was moved to the top of RLS policies section.

-- Update trigger for reports
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appeals_updated_at ON public.appeals;
CREATE TRIGGER update_appeals_updated_at
  BEFORE UPDATE ON public.appeals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

