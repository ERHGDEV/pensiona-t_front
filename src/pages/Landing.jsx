import Header from '../components/Header'
import Hero from '../components/Hero'
import Description from '../components/Description'
import Features from '../components/Features'
import CallToAction from '../components/CallToAction'

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto pt-12 sm:pt-16 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <Hero />
        <Description />
        <Features />
        <CallToAction />
      </main>

      <footer className="mt-20 py-2 text-center text-sky-200">
        <p>&copy; 2024 Pensiona-T</p>
      </footer>
    </div>
  )
}

export default Landing