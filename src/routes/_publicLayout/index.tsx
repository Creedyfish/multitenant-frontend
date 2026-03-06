import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/features/public/components/HeroSection'
import { FeaturesSection } from '@/features/public/components/FeaturesSection'
import { HowItWorksSection } from '@/features/public/components/HowItWorksSection'
import { PublicFooter } from '@/features/public/components/PublicFooter'

export const Route = createFileRoute('/_publicLayout/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PublicFooter />
    </>
  )
}
