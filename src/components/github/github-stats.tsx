import type { GitHubIntegration } from '@/types/github'
import { Star, GitFork, Users, BookOpen, Code2 } from 'lucide-react'
import { formatNumber, getLanguageColor } from '@/utils/formatters'

interface GitHubStatsProps {
  integration: GitHubIntegration
}

export function GithubStats({ integration }: GitHubStatsProps) {
  const languages = integration.languages as Record<string, number> | null
  const totalLanguageCount = languages ? Object.values(languages).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Repos</span>
          </div>
          <p className="mt-1 text-xl font-semibold">{formatNumber(integration.public_repos)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4" />
            <span className="text-xs">Stars</span>
          </div>
          <p className="mt-1 text-xl font-semibold">{formatNumber(integration.total_stars)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">Followers</span>
          </div>
          <p className="mt-1 text-xl font-semibold">{formatNumber(integration.followers)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span className="text-xs">Following</span>
          </div>
          <p className="mt-1 text-xl font-semibold">{formatNumber(integration.following)}</p>
        </div>
      </div>

      {languages && totalLanguageCount > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Languages</h3>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([lang, count]) => (
                <div
                  key={lang}
                  style={{
                    width: `${(count / totalLanguageCount) * 100}%`,
                    backgroundColor: getLanguageColor(lang),
                  }}
                  className="first:rounded-l-full last:rounded-r-full"
                />
              ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getLanguageColor(lang) }}
                  />
                  <span>{lang}</span>
                  <span className="text-muted-foreground">
                    {Math.round((count / totalLanguageCount) * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {integration.top_repos && Array.isArray(integration.top_repos) && integration.top_repos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Top Repositories</h3>
          <div className="space-y-2">
            {(integration.top_repos as { name: string; description: string | null; stars: number; language: string | null; html_url: string }[]).slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{repo.name}</p>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground truncate">{repo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  {repo.language && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {repo.stars}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
