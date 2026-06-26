import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pb-32 sm:pt-32 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium">
          Your reputation is built with projects, not words
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Show what you
          <span className="block text-primary">build.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          PortalDev helps developers build a reputation based on real projects
          and helps companies find technical talent that ships.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Create profile
            </Button>
          </Link>
          <Link href="/developers">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Explore developers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
