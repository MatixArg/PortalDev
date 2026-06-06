'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DeveloperProfile, SkillWithProficiency } from '@/types/profile'
import type { Project } from '@/types/project'

export function usePublicProfile(username: string) {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null)
  const [skills, setSkills] = useState<SkillWithProficiency[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('developer_profiles')
        .select(`
          *,
          developer_skills(
            proficiency,
            skill:skills(*)
          ),
          projects(*),
          education(*),
          certifications(*),
          work_experience(*),
          github:github_integrations(*)
        `)
        .eq('username', username)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setProfile(data)
      if (data?.developer_skills) {
        setSkills(data.developer_skills.map((ds: { proficiency: number; skill: SkillWithProficiency }) => ({
          ...ds.skill,
          proficiency: ds.proficiency,
        })))
      }
      if (data?.projects) {
        setProjects(data.projects)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [username])

  return { profile, skills, projects, loading, error }
}

export function useMyProfile() {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('developer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, refetch: fetchProfile }
}
