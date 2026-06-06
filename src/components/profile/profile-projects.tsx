import type { Project } from '@/types/project'
import { ProjectCard } from '@/components/projects/project-card'

interface ProfileProjectsProps {
  projects: Project[]
}

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  if (!projects.length) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
