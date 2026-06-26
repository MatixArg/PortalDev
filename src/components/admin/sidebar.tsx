'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Building2, Briefcase, Flag,
  Scale, Shield, BarChart3, Settings, CreditCard,
  Bell, Megaphone, FileText, Search, MessageSquare,
  Store, FolderGit2, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles?: string[]
}

interface NavGroup {
  label: string
  items: NavItem[]
  roles?: string[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/search', label: 'Search', icon: Search },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/companies', label: 'Companies', icon: Building2 },
      { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    ],
  },
  {
    label: 'Moderation',
    items: [
      { href: '/admin/content', label: 'Content', icon: MessageSquare },
      { href: '/admin/reports', label: 'Reports', icon: Flag },
      { href: '/admin/appeals', label: 'Appeals', icon: Scale },
    ],
  },
  {
    label: 'Monetization',
    items: [
      { href: '/admin/premium', label: 'Premium', icon: Shield },
      { href: '/admin/payments', label: 'Payments', icon: CreditCard },
      { href: '/admin/advertisements', label: 'Ads', icon: Megaphone },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
      { href: '/admin/security', label: 'Security', icon: Store },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "border-r bg-background flex flex-col overflow-y-auto transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-lg tracking-tight">
            PortalDev
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-90" : "-rotate-90")} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Back to app' : undefined}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to app</span>}
        </Link>
      </div>
    </aside>
  )
}
