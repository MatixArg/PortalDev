import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, Search, Clock } from 'lucide-react'
import type { Report } from '@/types/admin'

export default async function AdminReportsPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: pendingR } = await supabase.from('reports').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(50)
  const { data: inReview } = await supabase.from('reports').select('*').eq('status', 'in_review').order('created_at', { ascending: false }).limit(50)
  const { data: resolved } = await supabase.from('reports').select('*').eq('status', 'resolved').order('created_at', { ascending: false }).limit(50)

  const reasonBadge: Record<string, string> = {
    spam: 'destructive', fake_account: 'destructive', harassment: 'destructive',
    malware: 'destructive', scam: 'destructive', phishing: 'destructive',
    impersonation: 'destructive', illegal_content: 'destructive',
  }

  const columns: Column<Report>[] = [
    { key: 'reason', label: 'Reason', render: (r) => <Badge variant={(reasonBadge[r.reason] ?? 'secondary') as 'destructive' | 'secondary'} className="capitalize">{r.reason.replace('_', ' ')}</Badge> },
    { key: 'target_type', label: 'Target', render: (r) => <span className="capitalize text-sm">{r.target_type}</span> },
    { key: 'target_id', label: 'Target ID', render: (r) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.target_id.slice(0, 8)}...</code> },
    { key: 'reporter_id', label: 'Reporter', render: (r) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.reporter_id.slice(0, 8)}...</code> },
    { key: 'created_at', label: 'Date', render: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500"><Check className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Manage user reports</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingR?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="review">In Review ({inReview?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolved?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><DataTable columns={columns} data={pendingR ?? []} searchable={false} /></TabsContent>
        <TabsContent value="review"><DataTable columns={columns} data={inReview ?? []} searchable={false} /></TabsContent>
        <TabsContent value="resolved"><DataTable columns={columns} data={resolved ?? []} searchable={false} /></TabsContent>
      </Tabs>
    </div>
  )
}
