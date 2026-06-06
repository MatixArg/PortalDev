'use client'

import type { DeveloperProfile, SkillWithProficiency } from '@/types/profile'
import type { Project } from '@/types/project'
import type { GitHubIntegration } from '@/types/github'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileSkills } from '@/components/profile/profile-skills'
import { ProfileProjects } from '@/components/profile/profile-projects'
import { ProfileExperience } from '@/components/profile/profile-experience'
import { ProfileEducation } from '@/components/profile/profile-education'
import { ProfileGitHub } from '@/components/profile/profile-github'
import { Separator } from '@/components/ui/separator'

interface PublicProfileProps {
  profile: DeveloperProfile & {
    developer_skills?: { proficiency: number; skill: SkillWithProficiency }[]
    projects?: Project[]
    education?: import('@/types/profile').Education[]
    certifications?: import('@/types/profile').Certification[]
    work_experience?: import('@/types/profile').WorkExperience[]
    github?: GitHubIntegration | null
  }
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const skills = (profile.developer_skills || []).map(ds => ({
    ...ds.skill,
    proficiency: ds.proficiency,
  }))
  const projects = (profile.projects || []) as Project[]
  const experience = (profile.work_experience || []) as import('@/types/profile').WorkExperience[]
  const education = (profile.education || []) as import('@/types/profile').Education[]
  const certifications = (profile.certifications || []) as import('@/types/profile').Certification[]
  const github = profile.github as GitHubIntegration | null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10 animate-fade-in">
      <ProfileHeader profile={profile as DeveloperProfile} />

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          {profile.bio && (
            <section>
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{profile.bio}</p>
            </section>
          )}

          <ProfileProjects projects={projects} />

          <ProfileExperience experience={experience} />
        </div>

        <aside className="space-y-8">
          <ProfileSkills skills={skills} />

          <ProfileEducation education={education} />

          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <ProfileGitHub github={github} />
        </aside>
      </div>
    </div>
  )
}
