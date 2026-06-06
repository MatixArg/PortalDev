import { Users, Building2, FolderGit2 } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '0',
    label: 'Developers registered',
    suffix: '+',
  },
  {
    icon: Building2,
    value: '0',
    label: 'Companies registered',
    suffix: '+',
  },
  {
    icon: FolderGit2,
    value: '0',
    label: 'Projects published',
    suffix: '+',
  },
]

export function Stats() {
  return (
    <section className="border-t px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Growing developer community
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join developers and companies already building their reputation on PortalDev.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border p-8">
              <stat.icon className="mx-auto mb-4 h-6 w-6 text-primary" />
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
