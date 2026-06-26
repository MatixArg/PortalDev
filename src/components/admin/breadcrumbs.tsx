'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const labelMap: Record<string, string> = {
  admin: 'Admin',
  users: 'Users',
  companies: 'Companies',
  jobs: 'Jobs',
  projects: 'Projects',
  content: 'Content Moderation',
  reports: 'Reports',
  appeals: 'Appeals',
  premium: 'Premium',
  payments: 'Payments',
  advertisements: 'Advertisements',
  notifications: 'Notifications',
  'audit-logs': 'Audit Logs',
  security: 'Security',
  settings: 'Settings',
  analytics: 'Analytics',
  search: 'Search',
  create: 'Create',
  edit: 'Edit',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      <Link href="/admin" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.slice(1).map((segment, index) => {
        const href = '/' + segments.slice(0, index + 2).join('/')
        const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === segments.length - 2

        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
