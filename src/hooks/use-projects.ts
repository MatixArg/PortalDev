'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types/project'
import { getProjects } from '@/services/project-service'

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }
    const { data } = await getProjects(userId)
    if (data) setProjects(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, refetch: fetchProjects }
}

export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient()
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6)
      if (data) setProjects(data as Project[])
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  return { projects, loading }
}
