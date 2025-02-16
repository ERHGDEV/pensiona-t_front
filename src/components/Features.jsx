import { useEffect, useRef } from 'react'
import FeatureCard from "./FeatureCard"

export default function Features() {
  const featuresRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const features = featuresRef.current?.querySelectorAll('.feature-card')
    features?.forEach((feature) => observer.observe(feature))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={featuresRef} className="py-20 bg-sky-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-sky-300 font-semibold tracking-wide uppercase">Características</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            ¿Por qué elegir nuestra calculadora?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-sky-200 lg:mx-auto">
            Pensiona-T ofrece una solución completa para la planificación de tu pensión.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <FeatureCard
              icon="🧮"
              title="Cálculos Precisos"
              description="Algoritmos actualizados según las últimas normativas del IMSS."
            />
            <FeatureCard
              icon="👥"
              title="Modalidad 40"
              description="Compara la proyección de pensión con y sin Modalidad 40."
            />
            <FeatureCard
              icon="🔒"
              title="Seguridad Garantizada"
              description="No solicitamos datos sensibles. Tu información está segura con nosotros."
            />
            <FeatureCard
              icon="📊"
              title="Reportes Detallados"
              description="Obtén informes completos y fáciles de entender sobre tu futura pensión."
            />
            <FeatureCard
              icon="📍"
              title="Localización de Afore"
              description="Consulta en qué afore te encuentras actualmente. Consulta masiva disponible en plan Unlimited."
            />
            <FeatureCard
              icon="📅"
              title="Análisis de semanas cotizadas"
              description="Obten automáticamente el salario promedio de los últimos 5 años. Disponible en el plan Pro y Unlimited"
            />
          </div>
        </div>
      </div>
    </section>
  )
}