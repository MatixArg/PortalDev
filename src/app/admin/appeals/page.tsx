import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, MessageCircle } from 'lucide-react'
import type { Appeal } from '@/types/admin'

export default async function AdminAppealsPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: pendingA } = await supabase.from('appeals').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(50)
  const { data: accepted } = await supabase.from('appeals').select('*').eq('status', 'accepted').limit(50)
  const { data: rejected } = await supabase.from('appeals').select('*').eq('status', 'rejected').limit(50)

  const statusBadge: Record<string, string> = {
    pending: 'secondary', accepted: 'default', rejected: 'destructive', info_needed: 'outline',
  }

  const columns: Column<Appeal>[] = [
    { key: 'user_id', label: 'User', render: (a) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{a.user_id.slice(0, 8)}...</code> },
    { key: 'ban_reason', label: 'Ban Reason', render: (a) => <span className="text-sm capitalize">{a.ban_reason.replace('_', ' ')}</span> },
    { key: 'appeal_text', label: 'Appeal', render: (a) => <span className="text-sm text-muted-foreground truncate max-w-[200px] inline-block">{a.appeal_text}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (a) => <Badge variant={(statusBadge[a.status] ?? 'secondary') as 'default' | 'secondary' | 'destructive' | 'outline'} className="capitalize">{a.status.replace('_', ' ')}</Badge>,
    },
    { key: 'created_at', label: 'Date', render: (a) => <span className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500"><Check className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MessageCircle className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appeals</h1>
        <p className="text-muted-foreground mt-1">Review ban appeals</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingA?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><DataTable columns={columns} data={pendingA ?? []} searchable={false} /></TabsContent>
        <TabsContent value="accepted"><DataTable columns={columns} data={accepted ?? []} searchable={false} /></TabsContent>
        <TabsContent value="rejected"><DataTable columns={columns} data={rejected ?? []} searchable={false} /></TabsContent>
      </Tabs>
    </div>
  )
}
