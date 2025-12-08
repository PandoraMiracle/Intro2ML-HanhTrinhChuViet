import CTASection from '../components/CTASection'
import Concept from '../components/Concept'
import Features from '../components/Features'
import Hero from '../components/Hero'
import { featureHighlights, leaderboard, steps } from '../content'
import DrawingBoard from '../components/DrawingBoard'

function HomePage() {
  return (
    <>
      <Hero leaderboard={leaderboard} />
      <Features items={featureHighlights} />
      <Concept steps={steps} />
      <CTASection />
      <DrawingBoard />
    </>
  )
}

export default HomePage

