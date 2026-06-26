import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Star } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string | null
  technologies: string[] | null
  featured: boolean | null
  created_at: string
  user_id: string
}

export default async function AdminProjectsPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, description, technologies, featured, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(100)

  const columns: Column<Project>[] = [
    { key: 'name', label: 'Name', render: (p) => <span className="font-medium">{p.name}</span> },
    {
      key: 'description',
      label: 'Description',
      render: (p) => <span className="text-sm text-muted-foreground truncate max-w-[300px] inline-block">{p.description ?? '—'}</span>,
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {(p.technologies ?? []).slice(0, 3).map((t: string) => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
          {(p.technologies?.length ?? 0) > 3 && (
            <Badge variant="outline" className="text-xs">+{(p.technologies?.length ?? 0) - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (p) => p.featured ? <Badge className="bg-amber-500">Featured</Badge> : <Badge variant="outline">No</Badge>,
    },
    { key: 'created_at', label: 'Created', render: (p) => <span className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Star className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Manage all projects on the platform</p>
      </div>
      <DataTable columns={columns} data={projects ?? []} searchPlaceholder="Search projects..." />
    </div>
  )
}
