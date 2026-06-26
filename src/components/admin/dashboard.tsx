'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Building2, Briefcase, DollarSign, TrendingUp, Activity, Shield, Star, Zap, Bell, Ban, UserCog, Send, Wrench } from 'lucide-react'
import type { DashboardStats } from '@/types/admin'
import Link from 'next/link'

interface DashboardProps {
  stats: DashboardStats
}

export function AdminDashboard({ stats }: DashboardProps) {
  const topCards = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), icon: Users, change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Today', value: stats.active_today.toLocaleString(), icon: Activity, change: '+5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Premium Users', value: stats.premium_users.toLocaleString(), icon: Shield, change: '+8%', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Companies', value: stats.companies.toLocaleString(), icon: Building2, change: '+3%', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Freelancers', value: stats.freelancers.toLocaleString(), icon: Briefcase, change: '+10%', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Developers', value: stats.developers.toLocaleString(), icon: Users, change: '+7%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'New Registrations', value: stats.new_registrations.toLocaleString(), icon: UserPlus, change: '+15%', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, change: '+20%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Monthly Growth', value: `${stats.monthly_growth}%`, icon: TrendingUp, change: '+2%', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Active Jobs', value: stats.active_jobs.toLocaleString(), icon: Star, change: '+4%', color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  const quickActions = [
    { label: 'Create Announcement', icon: Bell, href: '/admin/notifications', color: 'text-blue-600' },
    { label: 'Ban User', icon: Ban, href: '/admin/users', color: 'text-red-600' },
    { label: 'Create Admin', icon: UserCog, href: '/admin/settings', color: 'text-purple-600' },
    { label: 'Send Notification', icon: Send, href: '/admin/notifications', color: 'text-emerald-600' },
    { label: 'Maintenance Notice', icon: Wrench, href: '/admin/settings', color: 'text-amber-600' },
  ]

  const recentActivity = [
    { type: 'new_user', label: 'New user registered', time: '2 min ago', user: 'johndoe' },
    { type: 'report', label: 'New report filed', time: '5 min ago', user: 'janedoe' },
    { type: 'premium', label: 'Premium purchase', time: '12 min ago', user: 'alexsmith' },
    { type: 'appeal', label: 'Appeal submitted', time: '18 min ago', user: 'bobwilson' },
    { type: 'payment', label: 'Payment received', time: '25 min ago', user: 'caroldavis' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and quick actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Live</Badge>
          <span className="text-xs text-muted-foreground">Updated just now</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {topCards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className={`p-1.5 rounded-md ${card.bg}`}>
                <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.label}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chart Placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Charts will render here (recharts or chart.js)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
