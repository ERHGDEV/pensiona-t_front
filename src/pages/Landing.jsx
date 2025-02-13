import Hero from '../components/Hero'
import Description from '../components/Description'
import Features from '../components/Features'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

export default function Landing() {
    return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-700 text-white">
      <main className="max-w-7xl mx-auto pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <Hero />
        <Description />
        <Features />
        <CallToAction />
      </main>

      <Footer />
    </div>
  )
}