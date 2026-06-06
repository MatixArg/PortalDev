export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  technologies: string[]
  project_url: string | null
  github_url: string | null
  image_url: string | null
  start_date: string | null
  end_date: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  name: string
  description?: string
  technologies: string[]
  project_url?: string
  github_url?: string
  image_url?: string
  start_date?: string
  end_date?: string
  featured?: boolean
}
