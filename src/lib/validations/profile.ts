import { z } from 'zod'

export const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  display_name: z.string().optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  availability: z.enum(['available', 'open', 'busy', 'unavailable']),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead']).optional(),
})

export const companyProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  size: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>
