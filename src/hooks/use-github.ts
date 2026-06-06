'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getGitHubIntegration, syncGitHubData, disconnectGitHub, fetchGitHubUserData, saveGitHubIntegration } from '@/services/github-service'
import type { GitHubIntegration } from '@/types/github'

export function useGitHub(userId: string | undefined) {
  const [integration, setIntegration] = useState<GitHubIntegration | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchIntegration = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }
    const { data } = await getGitHubIntegration(userId)
    if (data) setIntegration(data as GitHubIntegration)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchIntegration()
  }, [fetchIntegration])

  const connectGitHub = async (username: string, userId: string, accessToken: string) => {
    setSyncing(true)
    try {
      const githubData = await fetchGitHubUserData(username)
      const { data } = await saveGitHubIntegration(userId, { ...githubData, access_token: accessToken })
      if (data) setIntegration(data as GitHubIntegration)
      return { success: true }
    } catch {
      return { success: false, error: 'Failed to connect GitHub' }
    } finally {
      setSyncing(false)
    }
  }

  const sync = async () => {
    if (!userId) return
    setSyncing(true)
    try {
      await syncGitHubData(userId)
      await fetchIntegration()
    } finally {
      setSyncing(false)
    }
  }

  const disconnect = async () => {
    if (!userId) return
    await disconnectGitHub(userId)
    setIntegration(null)
  }

  return { integration, loading, syncing, connectGitHub, sync, disconnect, refetch: fetchIntegration }
}
