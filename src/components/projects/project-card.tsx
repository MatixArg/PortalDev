import type { Project } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Star } from 'lucide-react'
import { GithubIcon } from '@/components/shared/icons'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      {project.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={project.image_url}
            alt={project.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{project.name}</span>
          {project.featured && <Star className="h-4 w-4 fill-primary text-primary" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          {project.github_url && (
            <Link href={project.github_url} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <GithubIcon className="h-4 w-4" />
            </Link>
          )}
          {project.project_url && (
            <Link href={project.project_url} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
