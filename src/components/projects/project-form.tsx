'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, X } from 'lucide-react'
import { createProject, updateProject } from '@/services/project-service'
import { toast } from 'sonner'
import type { Project } from '@/types/project'

interface ProjectFormProps {
  userId: string
  project?: Project
  onSuccess: () => void
  children?: React.ReactNode
}

export function ProjectForm({ userId, project, onSuccess, children }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [techInput, setTechInput] = useState('')

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      technologies: project?.technologies || [],
      project_url: project?.project_url || '',
      github_url: project?.github_url || '',
      image_url: project?.image_url || '',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
      featured: project?.featured || false,
    },
  })

  const technologies = form.watch('technologies')

  function addTechnology() {
    const tech = techInput.trim()
    if (tech && !technologies.includes(tech)) {
      form.setValue('technologies', [...technologies, tech])
      setTechInput('')
    }
  }

  function removeTechnology(tech: string) {
    form.setValue('technologies', technologies.filter((t) => t !== tech))
  }

  async function onSubmit(data: ProjectFormData) {
    setIsLoading(true)
    try {
      if (project) {
        await updateProject(project.id, data)
        toast.success('Project updated')
      } else {
        await createProject(userId, data)
        toast.success('Project created')
      }
      onSuccess()
      setOpen(false)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || <Button type="button"><Plus className="mr-2 h-4 w-4" />Add Project</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" placeholder="My Awesome Project" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="What does this project do?" {...form.register('description')} />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="TypeScript"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechnology() } }}
              />
              <Button type="button" variant="outline" onClick={addTechnology}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1">
                  {tech}
                  <button onClick={() => removeTechnology(tech)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {form.formState.errors.technologies && <p className="text-xs text-destructive">{form.formState.errors.technologies.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project_url">Project URL</Label>
              <Input id="project_url" placeholder="https://myproject.com" {...form.register('project_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" placeholder="https://github.com/user/repo" {...form.register('github_url')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" placeholder="https://example.com/image.png" {...form.register('image_url')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" {...form.register('start_date')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" type="date" {...form.register('end_date')} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
