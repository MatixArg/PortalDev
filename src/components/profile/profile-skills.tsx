import type { SkillWithProficiency } from '@/types/profile'
import { Badge } from '@/components/ui/badge'

interface ProfileSkillsProps {
  skills: SkillWithProficiency[]
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  if (!skills.length) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Technologies</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="px-3 py-1">
            {skill.name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
