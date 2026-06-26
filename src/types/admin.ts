export type AdminRole = 'super_admin' | 'moderator' | 'support';

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'appealed' | 'closed';
export type AppealStatus = 'pending' | 'accepted' | 'rejected' | 'info_needed';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type NotificationAudience = 'everyone' | 'premium' | 'companies' | 'developers' | 'freelancers' | 'selected';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type AdStatus = 'active' | 'paused' | 'scheduled' | 'expired';

export interface AdminUser {
  id: string;
  role: AdminRole;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  moderator_id: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appeal {
  id: string;
  user_id: string;
  ban_reason: string;
  appeal_text: string;
  status: AppealStatus;
  moderator_id: string | null;
  decision: string | null;
  created_at: string;
  updated_at: string;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  amount: number | null;
  currency: string;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string | null;
  audience: NotificationAudience;
  target_user_ids: string[] | null;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
}

export interface Advertisement {
  id: string;
  title: string;
  image_url: string | null;
  target_url: string | null;
  status: AdStatus;
  impressions: number;
  clicks: number;
  budget: number | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface SecurityLog {
  id: string;
  event: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ModerationItem {
  id: string;
  target_type: string;
  target_id: string;
  status: ModerationStatus;
  report_count: number;
  spam_score: number;
  toxicity_score: number;
  copyright_warning: boolean;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  updated_at: string;
}

export interface DashboardStats {
  total_users: number;
  active_today: number;
  premium_users: number;
  companies: number;
  freelancers: number;
  developers: number;
  new_registrations: number;
  revenue: number;
  monthly_growth: number;
  active_jobs: number;
}
