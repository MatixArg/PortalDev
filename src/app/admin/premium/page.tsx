import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, RotateCcw, ArrowUp, ArrowDown, DollarSign } from 'lucide-react'
import type { PremiumSubscription } from '@/types/admin'

export default async function AdminPremiumPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: subs } = await supabase.from('premium_subscriptions').select('*').order('created_at', { ascending: false }).limit(100)
  const { data: revenue } = await supabase.from('payments').select('amount').eq('status', 'completed')

  const totalRevenue = revenue?.reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0) ?? 0
  const activeSubs = subs?.filter((s: { status: string }) => s.status === 'active').length ?? 0

  const columns: Column<PremiumSubscription>[] = [
    { key: 'user_id', label: 'User', render: (s) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.user_id.slice(0, 8)}...</code> },
    { key: 'plan', label: 'Plan', render: (s) => <Badge className="capitalize">{s.plan}</Badge> },
    {
      key: 'status',
      label: 'Status',
      render: (s) => {
        if (s.status === 'active') return <Badge className="bg-emerald-500">Active</Badge>
        if (s.status === 'cancelled') return <Badge variant="secondary">Cancelled</Badge>
        if (s.status === 'expired') return <Badge variant="outline">Expired</Badge>
        return <Badge variant="destructive">Refunded</Badge>
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (s) => <span>{s.amount ? `$${s.amount}` : '—'}</span>,
    },
    { key: 'expires_at', label: 'Renewal', render: (s) => <span className="text-sm text-muted-foreground">{s.expires_at ? new Date(s.expires_at).toLocaleDateString() : '—'}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><X className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><DollarSign className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><RotateCcw className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowUp className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowDown className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Premium</h1>
        <p className="text-muted-foreground mt-1">Manage premium subscriptions</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Subscriptions</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{activeSubs}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Subscriptions</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{subs?.length ?? 0}</p></CardContent></Card>
      </div>
      <DataTable columns={columns} data={subs ?? []} searchPlaceholder="Search subscriptions..." />
    </div>
  )
}
