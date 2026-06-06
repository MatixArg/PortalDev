'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Star } from 'lucide-react'
import { getInitials, getLanguageColor } from '@/utils/formatters'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'

interface DeveloperResult {
  id: string
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  country: string | null
  availability: string
  experience_level: string | null
  skills: Record<string, number>
  project_count: number
  total_stars: number
}

export function DevelopersExplorer() {
  const [developers, setDevelopers] = useState<DeveloperResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [technology, setTechnology] = useState('')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const fetchDevelopers = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const { data } = await supabase
      .from('developer_profiles')
      .select(`
        *,
        developer_skills(proficiency, skill:skills(name)),
        projects(count),
        github:github_integrations(total_stars)
      `)
      .ilike('username', `%${debouncedSearch}%`)
      .limit(20)

    if (data) {
      const mapped = data.map((d: Record<string, unknown>) => ({
        id: d.id as string,
        user_id: d.user_id as string,
        username: d.username as string,
        display_name: d.display_name as string | null,
        avatar_url: d.avatar_url as string | null,
        bio: d.bio as string | null,
        location: d.location as string | null,
        country: d.country as string | null,
        availability: d.availability as string,
        experience_level: d.experience_level as string | null,
        skills: Object.fromEntries(
          ((d.developer_skills as { skill: { name: string } }[]) || []).map(
            (ds) => [ds.skill.name, 0]
          )
        ),
        project_count: ((d.projects as { count: number }[] | null) || []).length,
        total_stars: ((d.github as { total_stars: number } | null)?.total_stars) || 0,
      })) as DeveloperResult[]

      setDevelopers(
        selectedTech
          ? mapped.filter((dev) => selectedTech in dev.skills)
          : mapped
      )
    }

    setLoading(false)
  }, [debouncedSearch, selectedTech])

  useEffect(() => {
    fetchDevelopers()
  }, [fetchDevelopers])

  const commonTechnologies = ['TypeScript', 'JavaScript', 'Python', 'React', 'Go', 'Rust', 'Node.js', 'Next.js']

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or technology..."
            className="pl-9 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {commonTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTech === tech ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : developers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No developers found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {developers.map((dev) => (
            <Link key={dev.id} href={`/u/${dev.username}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={dev.avatar_url || ''} />
                      <AvatarFallback>{getInitials(dev.display_name || dev.username)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{dev.display_name || dev.username}</p>
                      <p className="text-sm text-muted-foreground truncate">@{dev.username}</p>
                    </div>
                  </div>

                  {dev.bio && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{dev.bio}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {dev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {dev.location}
                      </span>
                    )}
                    {dev.total_stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {dev.total_stars}
                      </span>
                    )}
                    {dev.project_count > 0 && (
                      <span>{dev.project_count} projects</span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.keys(dev.skills).slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                    {Object.keys(dev.skills).length > 4 && (
                      <Badge variant="outline" className="text-xs">+{Object.keys(dev.skills).length - 4}</Badge>
                    )}
                  </div>

                  {dev.availability === 'available' && (
                    <div className="mt-3">
                      <Badge variant="default" className="text-xs">Available</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
