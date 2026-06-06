import type { GitHubIntegration } from '@/types/github'
import { GithubStats } from '@/components/github/github-stats'

interface ProfileGitHubProps {
  github: GitHubIntegration | null
}

export function ProfileGitHub({ github }: ProfileGitHubProps) {
  if (!github) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">GitHub Activity</h2>
      <GithubStats integration={github} />
    </section>
  )
}
