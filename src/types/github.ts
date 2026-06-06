export interface GitHubIntegration {
  id: string
  user_id: string
  github_id: number
  username: string
  avatar_url: string | null
  access_token: string
  public_repos: number
  total_stars: number
  followers: number
  following: number
  languages: Record<string, number>
  top_repos: GitHubRepo[]
  last_synced: string
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stars: number
  forks: number
  language: string | null
  languages: Record<string, number>
  updated_at: string
  topics: string[]
}

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  totalFollowers: number
  totalFollowing: number
  topLanguages: { name: string; percentage: number; color: string }[]
  contributionGraph: ContributionDay[]
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GitHubUserData {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  total_stars: number
}
