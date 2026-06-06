import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().max(2000).optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'Add at least one technology'),
  project_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  featured: z.boolean().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
