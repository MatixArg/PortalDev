import { createClient } from '@/lib/supabase/client'
import type { ProjectFormData } from '@/lib/validations/project'
import type { Project } from '@/types/project'

export async function getProjects(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data as Project[], error }
}

export async function createProject(userId: string, project: ProjectFormData) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: userId, ...project })
    .select()
    .single()
  return { data: data as Project, error }
}

export async function updateProject(projectId: string, project: Partial<ProjectFormData>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', projectId)
    .select()
    .single()
  return { data: data as Project, error }
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
  return { error }
}

export async function toggleFeatured(projectId: string, featured: boolean) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update({ featured })
    .eq('id', projectId)
    .select()
    .single()
  return { data: data as Project, error }
}
