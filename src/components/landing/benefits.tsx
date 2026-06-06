import { Code2, Globe, LineChart, Users, Search, Shield } from 'lucide-react'

const developerBenefits = [
  {
    icon: Code2,
    title: 'Modern professional profile',
    description: 'Showcase your work with a clean, professional profile that stands out.',
  },
  {
    icon: LineChart,
    title: 'GitHub integration',
    description: 'Import your repos, stars, and activity automatically. No manual updates needed.',
  },
  {
    icon: Globe,
    title: 'Show real projects',
    description: 'Your projects take center stage. Demonstrate what you can actually build.',
  },
  {
    icon: Users,
    title: 'Better visibility',
    description: 'Get discovered by companies looking for real technical talent.',
  },
]

const companyBenefits = [
  {
    icon: Search,
    title: 'Discover real talent',
    description: 'Find developers verified by their code and project history, not just their resume.',
  },
  {
    icon: Code2,
    title: 'Search by technology',
    description: 'Filter developers by the languages and frameworks you actually need.',
  },
  {
    icon: Globe,
    title: 'See real projects',
    description: 'Review actual code and live projects before reaching out.',
  },
  {
    icon: Shield,
    title: 'Evaluate technical activity',
    description: 'Assess candidates based on real metrics and consistent contribution patterns.',
  },
]

export function Benefits() {
  return (
    <section className="border-t px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for developers and companies
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to showcase and discover real technical talent.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 text-center text-lg font-semibold sm:text-left">For Developers</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {developerBenefits.map((benefit) => (
                <div key={benefit.title} className="group rounded-lg border p-5 transition-colors hover:border-primary/50">
                  <benefit.icon className="mb-3 h-5 w-5 text-primary" />
                  <h4 className="mb-1 font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-8 text-center text-lg font-semibold sm:text-left">For Companies</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {companyBenefits.map((benefit) => (
                <div key={benefit.title} className="group rounded-lg border p-5 transition-colors hover:border-primary/50">
                  <benefit.icon className="mb-3 h-5 w-5 text-primary" />
                  <h4 className="mb-1 font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
