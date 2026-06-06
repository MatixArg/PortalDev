import { createClient } from '@/lib/supabase/client'
import type { ProfileFormData, CompanyProfileFormData } from '@/lib/validations/profile'

export async function getDeveloperProfile(username: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('developer_profiles')
    .select(`
      *,
      skills:developer_skills(
        proficiency,
        skill:skills(*)
      ),
      projects(*),
      education(*),
      certifications(*),
      work_experience(*),
      github:github_integrations(*)
    `)
    .eq('username', username)
    .single()
  return { data, error }
}

export async function getDeveloperProfileByUserId(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('developer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function updateDeveloperProfile(userId: string, profile: ProfileFormData) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('developer_profiles')
    .update(profile)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

export async function createDeveloperProfile(userId: string, username: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('developer_profiles')
    .insert({ user_id: userId, username })
    .select()
    .single()
  return { data, error }
}

export async function checkUsername(username: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('developer_profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()
  return { available: !data, error }
}

export async function getCompanyProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function createCompanyProfile(userId: string, profile: CompanyProfileFormData) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('company_profiles')
    .insert({ user_id: userId, ...profile })
    .select()
    .single()
  return { data, error }
}

export async function updateCompanyProfile(userId: string, profile: Partial<CompanyProfileFormData>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('company_profiles')
    .update(profile)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

export async function getSkills() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name')
  return { data, error }
}

export async function addUserSkills(userId: string, skills: { skill_id: string; proficiency: number }[]) {
  const supabase = createClient()
  const { error } = await supabase
    .from('developer_skills')
    .upsert(
      skills.map(s => ({ user_id: userId, ...s }))
    )
  return { error }
}

export async function updateEducation(userId: string, education: import('@/types/profile').Education) {
  const supabase = createClient()
  if (education.id) {
    const { data, error } = await supabase
      .from('education')
      .update(education)
      .eq('id', education.id)
      .select()
      .single()
    return { data, error }
  }
  const { user_id, id, ...educationData } = education
  const { data, error } = await supabase
    .from('education')
    .insert({ user_id: userId, ...educationData })
    .select()
    .single()
  return { data, error }
}

export async function deleteEducation(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
  return { error }
}
