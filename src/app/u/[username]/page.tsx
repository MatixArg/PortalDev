import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PublicProfile } from './public-profile'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('developer_profiles')
    .select('display_name, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!profile) {
    return { title: 'User Not Found' }
  }

  return {
    title: profile.display_name || username,
    description: profile.bio || `Developer profile on PortalDev`,
    openGraph: {
      title: `${profile.display_name || username} | PortalDev`,
      description: profile.bio || `Developer profile on PortalDev`,
      type: 'profile',
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: 'summary',
      title: `${profile.display_name || username} | PortalDev`,
      description: profile.bio || `Developer profile on PortalDev`,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createServerSupabaseClient()

  const { data: profile, error } = await supabase
    .from('developer_profiles')
    .select(`
      *,
      developer_skills(
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

  if (error || !profile) {
    notFound()
  }

  return <PublicProfile profile={profile} />
}
