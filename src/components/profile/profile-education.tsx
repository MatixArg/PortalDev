import type { Education } from '@/types/profile'
import { formatDateRange } from '@/utils/formatters'
import { GraduationCap } from 'lucide-react'

interface ProfileEducationProps {
  education: Education[]
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  if (!education.length) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Education</h2>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="flex gap-3">
            <GraduationCap className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
              <p className="text-xs text-muted-foreground">{formatDateRange(edu.start_date, edu.end_date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
