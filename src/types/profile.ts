export interface DeveloperProfile {
  id: string
  user_id: string
  username: string
  first_name: string | null
  last_name: string | null
  display_name: string | null
  bio: string | null
  location: string | null
  country: string | null
  website: string | null
  portfolio_url: string | null
  github_url: string | null
  linkedin_url: string | null
  avatar_url: string | null
  banner_url: string | null
  availability: 'available' | 'open' | 'busy' | 'unavailable'
  experience_level: 'junior' | 'mid' | 'senior' | 'lead' | null
  created_at: string
  updated_at: string
}

export interface DeveloperProfileWithRelations extends DeveloperProfile {
  skills: SkillWithProficiency[]
  projects: import('./project').Project[]
  education: import('./database').Database['public']['Tables']['education']['Row'][]
  certifications: import('./database').Database['public']['Tables']['certifications']['Row'][]
  work_experience: import('./database').Database['public']['Tables']['work_experience']['Row'][]
  github: import('./database').Database['public']['Tables']['github_integrations']['Row'] | null
}

export interface Skill {
  id: string
  name: string
  category: string | null
}

export interface SkillWithProficiency extends Skill {
  proficiency: number
}

export interface CompanyProfile {
  id: string
  user_id: string
  company_name: string
  description: string | null
  website: string | null
  logo_url: string | null
  banner_url: string | null
  size: string | null
  industry: string | null
  location: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
}

export interface Certification {
  id: string
  user_id: string
  name: string
  issuer: string
  credential_url: string | null
  issue_date: string | null
  expiry_date: string | null
}

export interface WorkExperience {
  id: string
  user_id: string
  company: string
  position: string
  description: string | null
  start_date: string | null
  end_date: string | null
  current: boolean
}

export type Availability = 'available' | 'open' | 'busy' | 'unavailable'
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead'
