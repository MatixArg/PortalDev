'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2 } from 'lucide-react'
import { GithubIcon } from '@/components/shared/icons'
import { toast } from 'sonner'
import type { GitHubIntegration } from '@/types/github'
import { GithubStats } from './github-stats'

interface GitHubConnectProps {
  integration: GitHubIntegration | null
  loading: boolean
  syncing: boolean
  onSync: () => Promise<void>
  onDisconnect: () => Promise<void>
}

export function GitHubConnect({ integration, loading, syncing, onSync, onDisconnect }: GitHubConnectProps) {
  const [disconnecting, setDisconnecting] = useState(false)

  const handleSync = async () => {
    await onSync()
    toast.success('GitHub data synced')
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    await onDisconnect()
    setDisconnecting(false)
    toast.success('GitHub disconnected')
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (integration) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GithubIcon className="h-6 w-6" />
                <div>
                  <CardTitle>GitHub Connected</CardTitle>
                  <CardDescription>@{integration.username}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
                  <RefreshCw className={`mr-1 h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  Sync
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDisconnect} disabled={disconnecting}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GithubStats integration={integration} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect GitHub</CardTitle>
        <CardDescription>Import your repositories and activity to showcase on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          You&apos;ll need to enter your GitHub username to fetch public data.
          No write access is required.
        </p>
      </CardContent>
    </Card>
  )
}
