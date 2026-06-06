import type { WorkExperience } from '@/types/profile'
import { formatDateRange } from '@/utils/formatters'

interface ProfileExperienceProps {
  experience: WorkExperience[]
}

export function ProfileExperience({ experience }: ProfileExperienceProps) {
  if (!experience.length) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Experience</h2>
      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-px before:bg-border last:before:hidden">
            <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
            <div>
              <h3 className="font-medium">{exp.position}</h3>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
              <p className="text-xs text-muted-foreground">{formatDateRange(exp.start_date, exp.end_date)}</p>
              {exp.description && <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
