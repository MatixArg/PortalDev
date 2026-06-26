import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Send, Bell } from 'lucide-react'
import type { AdminNotification } from '@/types/admin'

export default async function AdminNotificationsPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: notifs } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(50)

  const audienceBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    everyone: 'default', premium: 'default', companies: 'secondary',
    developers: 'secondary', freelancers: 'outline', selected: 'destructive',
  }

  const columns: Column<AdminNotification>[] = [
    { key: 'title', label: 'Title', render: (n) => <span className="font-medium">{n.title}</span> },
    { key: 'body', label: 'Message', render: (n) => <span className="text-sm text-muted-foreground truncate max-w-[300px] inline-block">{n.body ?? '—'}</span> },
    { key: 'audience', label: 'Audience', render: (n) => <Badge variant={audienceBadge[n.audience] ?? 'secondary'} className="capitalize">{n.audience}</Badge> },
    { key: 'sent_at', label: 'Sent', render: (n) => <span className="text-sm text-muted-foreground">{n.sent_at ? new Date(n.sent_at).toLocaleDateString() : 'Not sent'}</span> },
    { key: 'created_at', label: 'Created', render: (n) => <span className="text-sm text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Send platform notifications</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create</Button>
      </div>
      <DataTable columns={columns} data={notifs ?? []} searchPlaceholder="Search notifications..." />
    </div>
  )
}
