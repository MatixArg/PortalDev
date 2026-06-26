import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Globe, Users, ShieldCheck, Trash2, Pencil, Ban } from 'lucide-react'
import Link from 'next/link'

interface Company {
  id: string
  company_name: string
  logo_url: string | null
  website: string | null
  employees: string | null
  verified: boolean | null
  premium: boolean | null
  users: { email: string; full_name: string | null } | null
}

export default async function AdminCompaniesPage() {
  const role = await requireAdminRole('super_admin', 'moderator', 'support')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()

  const { data: companies } = await supabase
    .from('company_profiles')
    .select('*, users!inner(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const columns: Column<Company>[] = [
    {
      key: 'company_name',
      label: 'Company',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{c.company_name}</p>
            <p className="text-xs text-muted-foreground">{c.users?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'website',
      label: 'Website',
      render: (c) => c.website ? <Link href={c.website} className="text-sm text-primary hover:underline">{c.website}</Link> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'employees',
      label: 'Employees',
      render: (c) => <span>{c.employees ?? '—'}</span>,
    },
    {
      key: 'verified',
      label: 'Verified',
      render: (c) => c.verified ? <Badge className="bg-emerald-500">Verified</Badge> : <Badge variant="outline">No</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ShieldCheck className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500"><Ban className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground mt-1">Manage company accounts</p>
      </div>

      <DataTable columns={columns} data={companies ?? []} searchPlaceholder="Search companies..." />
    </div>
  )
}
