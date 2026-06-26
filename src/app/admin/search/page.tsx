'use client'

import { useState, useCallback } from 'react'
import { Search, Users, Building2, Briefcase, FolderGit2, Flag, FileText, Loader2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'user' | 'company' | 'job' | 'project' | 'report' | 'content'
  id: string
  title: string
  subtitle: string
  href: string
}

export default function AdminSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    const q = `%${query}%`
    const allResults: SearchResult[] = []

    const { data: users } = await supabase
      .from('users')
      .select('id, username, full_name, email, avatar_url, account_type')
      .or(`username.ilike.${q},full_name.ilike.${q},email.ilike.${q}`)
      .limit(5)

    users?.forEach((u: { id: string; username: string; full_name?: string | null; email: string; account_type?: string | null }) => {
      allResults.push({
        type: 'user',
        id: u.id,
        title: u.full_name ?? u.username,
        subtitle: `@${u.username} • ${u.account_type ?? 'user'}`,
        href: `/admin/users`,
      })
    })

    const { data: companies } = await supabase
      .from('company_profiles')
      .select('id, company_name, users!inner(email)')
      .or(`company_name.ilike.${q}`)
      .limit(5)

    companies?.forEach((c: { id: string; company_name: string; users?: { email: string } | null }) => {
      allResults.push({
        type: 'company',
        id: c.id,
        title: c.company_name,
        subtitle: c.users?.email ?? '',
        href: '/admin/companies',
      })
    })

    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, company_profiles!inner(company_name)')
      .or(`title.ilike.${q}`)
      .limit(5)

    jobs?.forEach((j: { id: string; title: string; company_profiles?: { company_name: string } | null }) => {
      allResults.push({
        type: 'job',
        id: j.id,
        title: j.title,
        subtitle: j.company_profiles?.company_name ?? '',
        href: '/admin/jobs',
      })
    })

    const { data: reports } = await supabase
      .from('reports')
      .select('id, reason, target_type')
      .or(`reason.ilike.${q}`)
      .limit(5)

    reports?.forEach((r: { id: string; reason: string; target_type: string }) => {
      allResults.push({
        type: 'report',
        id: r.id,
        title: r.reason.replace(/_/g, ' '),
        subtitle: `Report on ${r.target_type}`,
        href: '/admin/reports',
      })
    })

    setResults(allResults)
    setLoading(false)
  }, [query, supabase])

  const typeIcon: Record<string, React.ElementType> = {
    user: Users, company: Building2, job: Briefcase,
    project: FolderGit2, report: Flag, content: FileText,
  }

  const typeColor: Record<string, string> = {
    user: 'text-blue-500', company: 'text-amber-500', job: 'text-emerald-500',
    project: 'text-purple-500', report: 'text-red-500', content: 'text-cyan-500',
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground mt-1">Search across users, companies, jobs, reports, and more</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search anything..."
          className="w-full pl-12 pr-4 py-3.5 text-lg bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{results.length} results found</p>
          {results.map((result) => {
            const Icon = typeIcon[result.type]
            return (
              <Card key={`${result.type}-${result.id}`} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(result.href)}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`p-2 rounded-lg bg-muted ${typeColor[result.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{result.type}</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Type a query and press Enter to search</p>
          <p className="text-sm text-muted-foreground mt-1">Find users, companies, jobs, reports, and more</p>
        </div>
      )}
    </div>
  )
}
