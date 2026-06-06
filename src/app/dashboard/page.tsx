'use client'

import { useAuthContext } from '@/features/auth/auth-context'
import { useMyProfile } from '@/hooks/use-profile'
import { useProjects } from '@/hooks/use-projects'
import { useGitHub } from '@/hooks/use-github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProfileForm } from '@/features/profile/profile-form'
import { ProjectForm } from '@/components/projects/project-form'
import { ProjectList } from '@/components/projects/project-list'
import { GithubStats } from '@/components/github/github-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code2, FolderGit2, RefreshCw } from 'lucide-react'
import { GithubIcon } from '@/components/shared/icons'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user, userType } = useAuthContext()
  const { profile, loading: profileLoading, refetch } = useMyProfile()
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(user?.id)
  const { integration, loading: githubLoading, syncing, sync, refetch: refetchGithub } = useGitHub(user?.id)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null
  if (profileLoading) return <div className="mx-auto max-w-5xl px-4 py-12"><Skeleton className="h-96 w-full" /></div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and projects</p>
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <Link href={`/u/${profile.username}`}>
              <Button variant="outline">View public profile</Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {profile ? (
            <ProfileForm profile={profile} onSuccess={refetch} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Complete your profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Set up your developer profile to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            {user && <ProjectForm userId={user.id} onSuccess={refetchProjects} />}
          </div>
          {projectsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <ProjectList projects={projects} canEdit onRefresh={refetchProjects} />
          )}
        </TabsContent>

        <TabsContent value="github" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">GitHub Integration</h2>
            {integration && (
              <Button variant="outline" size="sm" onClick={sync} disabled={syncing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                Sync now
              </Button>
            )}
          </div>
          {githubLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : integration ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                   <GithubIcon className="h-6 w-6" />
                  <div>
                    <CardTitle>@{integration.username}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GithubStats integration={integration} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GithubIcon className="h-5 w-5" />
                  Connect GitHub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub account to automatically display your repositories, languages, and activity on your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
