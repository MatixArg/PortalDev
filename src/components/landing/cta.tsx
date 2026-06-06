import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="border-t px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start building your reputation.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join PortalDev today and let your projects speak for themselves.
          No fluff, just code.
        </p>
        <div className="mt-8">
          <Link href="/auth/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Create your profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
