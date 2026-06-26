import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderGit2, Building2, Activity } from 'lucide-react'

async function getAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')
  return user
}

export default async function AdminDashboardPage() {
  await getAdmin()
  const supabase = await createServerSupabaseClient()

  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true })
  const { count: totalDevs } = await supabase.from('developer_profiles').select('*', { count: 'exact', head: true })
  const { count: totalCompanies } = await supabase.from('company_profiles').select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Total Users', value: totalUsers ?? 0, icon: Users },
    { label: 'Developers', value: totalDevs ?? 0, icon: Activity },
    { label: 'Companies', value: totalCompanies ?? 0, icon: Building2 },
    { label: 'Projects', value: totalProjects ?? 0, icon: FolderGit2 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
