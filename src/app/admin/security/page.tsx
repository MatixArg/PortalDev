import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, Activity, KeyRound } from 'lucide-react'
import type { SecurityLog } from '@/types/admin'

export default async function AdminSecurityPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: logs } = await supabase.from('security_logs').select('*').order('created_at', { ascending: false }).limit(100)
  const { count: failedLogins } = await supabase.from('security_logs').select('*', { count: 'exact', head: true }).eq('event', 'failed_login')
  const { count: suspicious } = await supabase.from('security_logs').select('*', { count: 'exact', head: true }).eq('event', 'suspicious_activity')

  const columns: Column<SecurityLog>[] = [
    { key: 'event', label: 'Event', render: (l) => <Badge variant={l.event === 'failed_login' ? 'destructive' : l.event === 'suspicious_activity' ? 'secondary' : 'outline'} className="capitalize font-mono text-xs">{l.event.replace(/_/g, ' ')}</Badge> },
    { key: 'user_id', label: 'User', render: (l) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.user_id?.slice(0, 8) ?? '—'}</code> },
    { key: 'ip_address', label: 'IP', render: (l) => <span className="text-xs font-mono">{l.ip_address ?? '—'}</span> },
    { key: 'country', label: 'Country', render: (l) => <span className="text-sm">{l.country ?? '—'}</span> },
    { key: 'created_at', label: 'Date', render: (l) => <span className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground mt-1">Monitor security events and threats</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4" />Total Events</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{logs?.length ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" />Failed Logins</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{failedLogins ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4 text-amber-500" />Suspicious</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{suspicious ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><KeyRound className="h-4 w-4" />Rate Limits</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">0</p></CardContent></Card>
      </div>
      <DataTable columns={columns} data={logs ?? []} searchPlaceholder="Search security events..." />
    </div>
  )
}
