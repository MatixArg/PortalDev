'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, Building2, Briefcase, Flag, Settings, BarChart3, FolderGit2, FileText, Shield, CreditCard, Megaphone, Bell, Scale, MessageSquare } from 'lucide-react'

interface Command {
  id: string
  label: string
  icon: React.ElementType
  href: string
  keywords: string[]
}

const commands: Command[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin', keywords: ['home', 'overview', 'stats'] },
  { id: 'search', label: 'Search', icon: Search, href: '/admin/search', keywords: ['find', 'global', 'lookup'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics', keywords: ['charts', 'data', 'metrics'] },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users', keywords: ['people', 'accounts', 'members'] },
  { id: 'companies', label: 'Companies', icon: Building2, href: '/admin/companies', keywords: ['organizations', 'business'] },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, href: '/admin/jobs', keywords: ['positions', 'careers'] },
  { id: 'projects', label: 'Projects', icon: FolderGit2, href: '/admin/projects', keywords: ['repos', 'repositories'] },
  { id: 'content', label: 'Content Moderation', icon: MessageSquare, href: '/admin/content', keywords: ['posts', 'articles', 'comments'] },
  { id: 'reports', label: 'Reports', icon: Flag, href: '/admin/reports', keywords: ['flags', 'abuse'] },
  { id: 'appeals', label: 'Appeals', icon: Scale, href: '/admin/appeals', keywords: ['disputes', 'ban appeal'] },
  { id: 'premium', label: 'Premium', icon: Shield, href: '/admin/premium', keywords: ['subscriptions', 'pro', 'plans'] },
  { id: 'payments', label: 'Payments', icon: CreditCard, href: '/admin/payments', keywords: ['transactions', 'billing', 'invoices'] },
  { id: 'ads', label: 'Advertisements', icon: Megaphone, href: '/admin/advertisements', keywords: ['ads', 'promotions', 'marketing'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/admin/notifications', keywords: ['alerts', 'messages'] },
  { id: 'audit', label: 'Audit Logs', icon: FileText, href: '/admin/audit-logs', keywords: ['logs', 'history', 'trail'] },
  { id: 'security', label: 'Security', icon: Shield, href: '/admin/security', keywords: ['login', 'sessions', 'threats'] },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings', keywords: ['config', 'preferences', 'general'] },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const filtered = query
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : commands

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = useCallback((href: string) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].href)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-background border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            className="flex-1 bg-transparent border-0 px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No results found</p>
          )}
          {filtered.map((cmd, index) => {
            const Icon = cmd.icon
            return (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  index === selectedIndex ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{cmd.label}</span>
              </button>
            )
          })}
        </div>
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center gap-4">
          <span><kbd className="bg-muted px-1 rounded">↑↓</kbd> Navigate</span>
          <span><kbd className="bg-muted px-1 rounded">↵</kbd> Open</span>
          <span><kbd className="bg-muted px-1 rounded">⌘K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  )
}
