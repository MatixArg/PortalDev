import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, RotateCcw } from 'lucide-react'
import type { Payment } from '@/types/admin'

export default async function AdminPaymentsPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: payments } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100)
  const total = payments?.reduce((s: number, p: { amount: number; status: string }) => s + Number(p.amount), 0) ?? 0
  const completed = payments?.filter((p: { status: string }) => p.status === 'completed').length ?? 0
  const refunded = payments?.filter((p: { status: string }) => p.status === 'refunded').length ?? 0

  const columns: Column<Payment>[] = [
    { key: 'user_id', label: 'User', render: (p) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.user_id.slice(0, 8)}...</code> },
    { key: 'amount', label: 'Amount', render: (p) => <span className="font-medium">${p.amount.toLocaleString()}</span> },
    { key: 'currency', label: 'Currency', render: (p) => <span className="text-sm text-muted-foreground">{p.currency}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (p) => {
        if (p.status === 'completed') return <Badge className="bg-emerald-500">Completed</Badge>
        if (p.status === 'pending') return <Badge variant="secondary">Pending</Badge>
        if (p.status === 'failed') return <Badge variant="destructive">Failed</Badge>
        return <Badge variant="outline">Refunded</Badge>
      },
    },
    { key: 'description', label: 'Description', render: (p) => <span className="text-sm text-muted-foreground">{p.description ?? '—'}</span> },
    { key: 'created_at', label: 'Date', render: (p) => <span className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><RotateCcw className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">View transactions and manage refunds</p>
        </div>
        <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${total.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{completed}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Refunded</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{refunded}</p></CardContent></Card>
      </div>
      <DataTable columns={columns} data={payments ?? []} searchPlaceholder="Search payments..." />
    </div>
  )
}
