import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/client';

export async function logAdminAction(
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: metadata ?? {},
  });
}

export async function getAuditLogs(options?: {
  limit?: number;
  offset?: number;
  adminId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('audit_logs')
    .select('*, admin:admin_id(id, username, avatar_url)')
    .order('created_at', { ascending: false });

  if (options?.adminId) query = query.eq('admin_id', options.adminId);
  if (options?.action) query = query.eq('action', options.action);
  if (options?.startDate) query = query.gte('created_at', options.startDate);
  if (options?.endDate) query = query.lte('created_at', options.endDate);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1);

  const { data } = await query;
  return data ?? [];
}
