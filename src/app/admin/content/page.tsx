import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, AlertTriangle, Ban } from 'lucide-react'
import type { ModerationItem } from '@/types/admin'

export default async function AdminContentPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: pending } = await supabase.from('moderation_queue').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(50)
  const { data: flagged } = await supabase.from('moderation_queue').select('*').eq('status', 'flagged').order('created_at', { ascending: false }).limit(50)
  const { data: approved } = await supabase.from('moderation_queue').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(50)

  const columns: Column<ModerationItem>[] = [
    { key: 'target_type', label: 'Type', render: (m) => <Badge variant="outline" className="capitalize">{m.target_type}</Badge> },
    { key: 'target_id', label: 'Content ID', render: (m) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{m.target_id.slice(0, 8)}...</code> },
    { key: 'report_count', label: 'Reports', render: (m) => <Badge variant={m.report_count > 0 ? 'destructive' : 'secondary'}>{m.report_count}</Badge> },
    {
      key: 'spam_score',
      label: 'Spam Score',
      render: (m) => {
        const score = m.spam_score
        const color = score > 0.7 ? 'text-red-500' : score > 0.4 ? 'text-amber-500' : 'text-emerald-500'
        return <span className={`font-mono ${color}`}>{(score * 100).toFixed(0)}%</span>
      },
    },
    {
      key: 'toxicity_score',
      label: 'Toxicity',
      render: (m) => {
        const score = m.toxicity_score
        const color = score > 0.7 ? 'text-red-500' : score > 0.4 ? 'text-amber-500' : 'text-emerald-500'
        return <span className={`font-mono ${color}`}>{(score * 100).toFixed(0)}%</span>
      },
    },
    {
      key: 'copyright_warning',
      label: 'Copyright',
      render: (m) => m.copyright_warning ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500"><Check className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500"><AlertTriangle className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Ban className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
        <p className="text-muted-foreground mt-1">Moderate posts, articles, comments, and repositories</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({flagged?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <DataTable columns={columns} data={pending ?? []} searchable={false} />
        </TabsContent>
        <TabsContent value="flagged" className="mt-4">
          <DataTable columns={columns} data={flagged ?? []} searchable={false} />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <DataTable columns={columns} data={approved ?? []} searchable={false} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
