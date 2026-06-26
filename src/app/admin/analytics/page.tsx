import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Users, DollarSign, Activity, MousePointerClick } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const role = await requireAdminRole('super_admin', 'moderator')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: premium } = await supabase.from('premium_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { data: payments } = await supabase.from('payments').select('amount')
  const revenue = payments?.reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0) ?? 0
  const { count: companies } = await supabase.from('company_profiles').select('*', { count: 'exact', head: true })
  const { count: jobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true })

  const charts = [
    { label: 'User Growth', icon: Users, color: 'text-blue-500' },
    { label: 'Premium Growth', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Revenue', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Active Users', icon: Activity, color: 'text-amber-500' },
    { label: 'Page Views', icon: MousePointerClick, color: 'text-rose-500' },
    { label: 'Churn Rate', icon: TrendingUp, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform metrics and trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Users</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalUsers ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Premium</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{premium ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${revenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Companies</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{companies ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Jobs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{jobs ?? 0}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="growth" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charts.map((chart) => (
              <Card key={chart.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <chart.icon className={`h-4 w-4 ${chart.color}`} />
                    {chart.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Chart placeholder</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Revenue chart (requires recharts)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader><CardTitle>User Demographics</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Country distribution chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Content Metrics</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Device & browser usage chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
