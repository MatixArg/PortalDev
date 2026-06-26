import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import type { Advertisement } from '@/types/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pause, Play, Trash2, BarChart3, Plus } from 'lucide-react'

export default async function AdminAdsPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: ads } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false }).limit(100)

  const totalImpressions = ads?.reduce((s: number, a: Advertisement) => s + Number(a.impressions), 0) ?? 0
  const totalClicks = ads?.reduce((s: number, a: Advertisement) => s + Number(a.clicks), 0) ?? 0
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'

  const columns: Column<Advertisement>[] = [
    { key: 'title', label: 'Title', render: (a) => <span className="font-medium">{a.title}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (a) => {
        if (a.status === 'active') return <Badge className="bg-emerald-500">Active</Badge>
        if (a.status === 'paused') return <Badge variant="secondary">Paused</Badge>
        if (a.status === 'scheduled') return <Badge variant="outline">Scheduled</Badge>
        return <Badge variant="destructive">Expired</Badge>
      },
    },
    { key: 'impressions', label: 'Impressions', render: (a) => <span className="font-mono">{a.impressions.toLocaleString()}</span> },
    { key: 'clicks', label: 'Clicks', render: (a) => <span className="font-mono">{a.clicks.toLocaleString()}</span> },
    {
      key: 'ctr',
      label: 'CTR',
      render: (a) => <span className="font-mono text-sm">{a.impressions > 0 ? ((a.clicks / a.impressions) * 100).toFixed(2) : '0.00'}%</span>,
    },
    { key: 'budget', label: 'Budget', render: (a) => <span>{a.budget ? `$${a.budget}` : '—'}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (a) => (
        <div className="flex items-center gap-1">
          {a.status === 'paused' ? (
            <Button variant="ghost" size="icon" className="h-8 w-8"><Play className="h-3.5 w-3.5" /></Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8"><Pause className="h-3.5 w-3.5" /></Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8"><BarChart3 className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advertisements</h1>
          <p className="text-muted-foreground mt-1">Manage platform ads</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Ad</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Impressions</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Clicks</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">CTR</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{ctr}%</p></CardContent></Card>
      </div>
      <DataTable columns={columns} data={ads ?? []} searchPlaceholder="Search ads..." />
    </div>
  )
}
