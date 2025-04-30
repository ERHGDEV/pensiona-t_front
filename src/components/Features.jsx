import FeatureCard from "./FeatureCard"
import CalculatorIcon from "./icons/CalculatorIcon"
import UserCogIcon from "./icons/UserCogIcon"
import LockIcon from "./icons/LockIcon"
import ChartColumnIcon from "./icons/ChartColumnIcon"
import MapPinIcon from "./icons/MapPinIcon"
import CalendarIcon from "./icons/CalendarIcon"

export default function Features() {
  return (
    <section className="py-20">
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
              icon={<CalculatorIcon className="h-12 w-12 text-white" />}
              title="Cálculos Precisos"
              description="Algoritmos actualizados según las últimas normativas del IMSS."
            />
            <FeatureCard
              icon={<UserCogIcon className="h-12 w-12 text-white" />}
              title="Modalidad 40"
              description="Compara la proyección de pensión con y sin Modalidad 40."
            />
            <FeatureCard
              icon={<LockIcon className="h-12 w-12 text-white" />}
              title="Seguridad Garantizada"
              description="No solicitamos datos sensibles. Tu información está segura con nosotros."
            />
            <FeatureCard
              icon={<ChartColumnIcon className="h-12 w-12 text-white" />}
              title="Reportes Detallados"
              description="Obtén informes completos y fáciles de entender sobre tu futura pensión."
            />
            <FeatureCard
              icon={<MapPinIcon className="h-12 w-12 text-white" />}
              title="Localización de Afore"
              description="Consulta en qué afore te encuentras actualmente. Consulta masiva disponible en plan Unlimited."
            />
            <FeatureCard
              icon={<CalendarIcon className="h-12 w-12 text-white" />}
              title="Análisis de semanas cotizadas"
              description="Obten automáticamente el salario promedio de los últimos 5 años. Disponible en el plan Pro y Unlimited."
            />
          </div>
        </div>
      </div>
    </section>
  )
}