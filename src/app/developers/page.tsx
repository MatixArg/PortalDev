import type { Metadata } from 'next'
import { DevelopersExplorer } from './developers-explorer'

export const metadata: Metadata = {
  title: 'Explore Developers',
  description: 'Discover real technical talent. Browse developers by technology, location, and availability.',
}

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Explore Developers</h1>
        <p className="mt-2 text-muted-foreground">
          Discover real technical talent based on projects, not profiles.
        </p>
      </div>
      <DevelopersExplorer />
    </div>
  )
}
