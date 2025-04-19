import CalculatorIcon from "./icons/CalculatorIcon"
import ChartColumnIcon from "./icons/ChartColumnIcon"

export default function Description() {
  return (
    <section className="relative mt-20 mb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div className="relative">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
            Planifica tu futuro
          </h3>
          <p className="mt-3 text-lg text-sky-200">
            Nuestra calculadora considera todas las variables para proporcionarte una proyección precisa y confiable de tu futura pensión.
          </p>

          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute h-12 w-12">
                  <CalculatorIcon className="h-12 w-12" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-sky-100">Cálculos precisos</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-sky-200">
                Nuestros algoritmos están actualizados según las últimas normativas del IMSS para garantizar la exactitud de tus proyecciones.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute h-12 w-12">
                  <ChartColumnIcon className="h-12 w-12" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-sky-100">Comparativas claras</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-sky-200">
                Compara fácilmente diferentes escenarios, incluyendo proyecciones con y sin Modalidad 40.
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
          <img
            className="relative mx-auto rounded-lg shadow-lg"
            width={490}
            src="/calc.webp"
            alt="Calculadora de pensiones"
          />
        </div>
      </div>
    </section>
  )
}