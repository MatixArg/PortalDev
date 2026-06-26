import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserManagement } from '@/components/admin/user-management'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const role = await requireAdminRole('super_admin', 'moderator', 'support')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()

  const { data: users } = await supabase
    .from('users')
    .select('*, developer_profiles(*), company_profiles(*), admin_roles(role)')
    .order('created_at', { ascending: false })
    .limit(100)

  return <UserManagement users={users ?? []} role={role} />
}
