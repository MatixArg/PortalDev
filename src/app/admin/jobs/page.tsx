import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Pencil, Trash2, Star } from 'lucide-react'

interface Job {
  id: string
  title: string
  salary_min: number | null
  salary_max: number | null
  location: string | null
  type: string | null
  status: string
  created_at: string
  company_profiles: { company_name: string } | null
}

export default async function AdminJobsPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, company_profiles!inner(company_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const columns: Column<Job>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (j) => (
        <div>
          <p className="font-medium">{j.title}</p>
          <p className="text-xs text-muted-foreground">{j.company_profiles?.company_name}</p>
        </div>
      ),
    },
    { key: 'location', label: 'Location', render: (j) => <span>{j.location ?? 'Remote'}</span> },
    { key: 'type', label: 'Type', render: (j) => <Badge variant="outline" className="capitalize">{j.type ?? 'full-time'}</Badge> },
    {
      key: 'salary_min',
      label: 'Salary',
      render: (j) => j.salary_min ? <span>${j.salary_min.toLocaleString()} - ${j.salary_max?.toLocaleString()}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (j) => {
        if (j.status === 'active') return <Badge className="bg-emerald-500">Active</Badge>
        if (j.status === 'pending') return <Badge variant="secondary">Pending</Badge>
        return <Badge variant="destructive">{j.status}</Badge>
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (j) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500"><Check className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500"><Star className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground mt-1">Moderate job postings</p>
      </div>
      <DataTable columns={columns} data={jobs ?? []} searchPlaceholder="Search jobs..." />
    </div>
  )
}
