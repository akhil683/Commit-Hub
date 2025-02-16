import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import CTA from '@/components/CTA'
import Pricing from '@/components/Pricing'

export default function Home() {
  return (
    <main className=' min-h-screen bg-black text-white'>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </main>
  )
}

