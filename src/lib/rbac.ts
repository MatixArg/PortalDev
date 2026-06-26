import { createServerSupabaseClient } from './supabase/server';
import type { AdminRole } from '@/types/admin';

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 3,
  moderator: 2,
  support: 1,
};

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    'admin.manage',
    'admin.create',
    'users.view', 'users.edit', 'users.delete', 'users.ban', 'users.suspend',
    'users.verify', 'users.reset_password',
    'companies.view', 'companies.edit', 'companies.verify', 'companies.delete',
    'jobs.view', 'jobs.edit', 'jobs.delete', 'jobs.approve', 'jobs.feature',
    'reports.view', 'reports.manage',
    'appeals.view', 'appeals.manage',
    'premium.view', 'premium.manage',
    'ads.view', 'ads.create', 'ads.edit', 'ads.delete',
    'payments.view', 'payments.refund',
    'moderation.view', 'moderation.manage',
    'settings.view', 'settings.edit',
    'analytics.view',
    'audit.view',
    'security.view',
    'notifications.send',
    'feature_flags.manage',
  ],
  moderator: [
    'users.view', 'users.edit', 'users.ban', 'users.suspend',
    'companies.view', 'companies.edit',
    'jobs.view', 'jobs.edit', 'jobs.approve',
    'reports.view', 'reports.manage',
    'appeals.view', 'appeals.manage',
    'moderation.view', 'moderation.manage',
    'analytics.view',
  ],
  support: [
    'users.view', 'users.edit',
    'companies.view',
    'reports.view',
    'appeals.view',
  ],
};

export function hasPermission(userRole: AdminRole | null, permission: string): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function hasRole(userRole: AdminRole | null, requiredRole: AdminRole): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function getRoleLevel(role: AdminRole): number {
  return ROLE_HIERARCHY[role];
}

export async function getAdminRole(): Promise<AdminRole | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    return (data?.role as AdminRole) ?? null;
  } catch {
    return null;
  }
}

export async function requireAdminRole(...roles: AdminRole[]): Promise<AdminRole | null> {
  const role = await getAdminRole();
  if (!role) return null;
  if (roles.length > 0 && !roles.includes(role)) return null;
  return role;
}
