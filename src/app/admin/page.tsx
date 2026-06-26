import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/dashboard'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true })
  const { count: totalDevs } = await supabase.from('developer_profiles').select('*', { count: 'exact', head: true })
  const { count: totalCompanies } = await supabase.from('company_profiles').select('*', { count: 'exact', head: true })
  const { count: premiumCount } = await supabase.from('premium_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')

  const today = new Date().toISOString().split('T')[0]
  const { count: activeToday } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('last_login', today)

  const { count: newRegistrations } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 86400000 * 7).toISOString())

  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')

  const revenue = payments?.reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0) ?? 0

  const { count: activeJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active')

  const { data: freelancers } = await supabase.from('users').select('account_type').eq('account_type', 'freelancer')
  const freelancerCount = freelancers?.length ?? 0

  const stats = {
    total_users: totalUsers ?? 0,
    active_today: activeToday ?? 0,
    premium_users: premiumCount ?? 0,
    companies: totalCompanies ?? 0,
    freelancers: freelancerCount,
    developers: totalDevs ?? 0,
    new_registrations: newRegistrations ?? 0,
    revenue,
    monthly_growth: totalUsers ? Math.round((newRegistrations! / totalUsers) * 100) : 0,
    active_jobs: activeJobs ?? 0,
  }

  return <AdminDashboard stats={stats} />
}
