import { createClient } from '@/lib/supabase/client'

export async function getGitHubIntegration(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('github_integrations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return { data, error }
}

export async function saveGitHubIntegration(userId: string, githubData: {
  github_id: number
  username: string
  avatar_url?: string
  access_token?: string
  public_repos?: number
  total_stars?: number
  followers?: number
  following?: number
  languages?: Record<string, number>
  top_repos?: unknown[]
}) {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('github_integrations')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('github_integrations')
      .update({ ...githubData, last_synced: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  }

  const { data, error } = await supabase
    .from('github_integrations')
    .insert({ user_id: userId, ...githubData, last_synced: new Date().toISOString() })
    .select()
    .single()
  return { data, error }
}

export async function disconnectGitHub(userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('github_integrations')
    .delete()
    .eq('user_id', userId)
  return { error }
}

export async function fetchGitHubUserData(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}`)
  if (!response.ok) throw new Error('Failed to fetch GitHub user')
  const userData = await response.json()

  const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
  if (!reposResponse.ok) throw new Error('Failed to fetch GitHub repos')
  const repos = await reposResponse.json()

  const languages: Record<string, number> = {}
  let totalStars = 0
  const topRepos = repos
    .filter((r: { fork: boolean }) => !r.fork)
    .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r: { id: number; name: string; description: string | null; html_url: string; stargazers_count: number; forks_count: number; language: string | null; topics: string[]; updated_at: string }) => {
      totalStars += r.stargazers_count
      if (r.language) {
        languages[r.language] = (languages[r.language] || 0) + 1
      }
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        topics: r.topics || [],
        updated_at: r.updated_at,
        languages: {},
      }
    })

  return {
    github_id: userData.id,
    username: userData.login,
    avatar_url: userData.avatar_url,
    public_repos: userData.public_repos,
    total_stars: totalStars,
    followers: userData.followers,
    following: userData.following,
    languages,
    top_repos: topRepos,
  }
}

export async function syncGitHubData(userId: string) {
  const supabase = createClient()
  const { data: integration } = await supabase
    .from('github_integrations')
    .select('username, access_token')
    .eq('user_id', userId)
    .single()

  if (!integration) throw new Error('GitHub not connected')

  const githubData = await fetchGitHubUserData(integration.username)
  return saveGitHubIntegration(userId, { ...githubData, access_token: integration.access_token })
}
