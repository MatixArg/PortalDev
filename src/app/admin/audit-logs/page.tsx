import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import type { AuditLog } from '@/types/admin'

export default async function AdminAuditLogsPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const columns: Column<AuditLog>[] = [
    { key: 'action', label: 'Action', render: (l) => <Badge variant="secondary" className="font-mono text-xs">{l.action.replace(/_/g, ' ')}</Badge> },
    { key: 'admin_id', label: 'Admin', render: (l) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.admin_id?.slice(0, 8) ?? 'System'}</code> },
    { key: 'target_type', label: 'Target', render: (l) => <span className="text-sm capitalize text-muted-foreground">{l.target_type ?? '—'}</span> },
    { key: 'target_id', label: 'Target ID', render: (l) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.target_id?.slice(0, 12) ?? '—'}</code> },
    { key: 'ip_address', label: 'IP', render: (l) => <span className="text-xs text-muted-foreground font-mono">{l.ip_address ?? '—'}</span> },
    { key: 'created_at', label: 'Date', render: (l) => <span className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Track every admin action</p>
      </div>
      <DataTable columns={columns} data={logs ?? []} searchPlaceholder="Search logs..." pageSize={25} />
    </div>
  )
}
