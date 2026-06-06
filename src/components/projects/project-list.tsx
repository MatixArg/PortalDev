'use client'

import { useState } from 'react'
import type { Project } from '@/types/project'
import { ProjectCard } from './project-card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { deleteProject, toggleFeatured } from '@/services/project-service'

interface ProjectListProps {
  projects: Project[]
  canEdit?: boolean
  onRefresh: () => void
}

export function ProjectList({ projects, canEdit, onRefresh }: ProjectListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    await deleteProject(id)
    toast.success('Project deleted')
    onRefresh()
    setDeleting(null)
  }

  async function handleToggleFeatured(id: string, featured: boolean) {
    await toggleFeatured(id, !featured)
    toast.success(featured ? 'Removed from featured' : 'Marked as featured')
    onRefresh()
  }

  if (!projects.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No projects yet</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <div key={project.id} className="group relative">
          {canEdit && (
            <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleToggleFeatured(project.id, project.featured)}
              >
                {project.featured ? 'Unfeature' : 'Feature'}
              </Badge>
              <Badge
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleDelete(project.id)}
              >
                {deleting === project.id ? '...' : 'Delete'}
              </Badge>
            </div>
          )}
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
