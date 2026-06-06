import { Hero } from '@/components/landing/hero'
import { Benefits } from '@/components/landing/benefits'
import { Stats } from '@/components/landing/stats'
import { CTA } from '@/components/landing/cta'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Stats />
      <CTA />
    </>
  )
}
