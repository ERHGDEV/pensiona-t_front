export default function Description() {
  return (
    <section className="relative mt-20 mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div className="relative">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
            Planifica tu futuro
          </h3>
          <p className="mt-3 text-lg text-sky-200">
            Nuestra calculadora de pensiones considera todas las variables relevantes para proporcionarte una proyección precisa y confiable de tu futura pensión.
          </p>

          <dl className="mt-10 space-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-sky-100">Cálculos precisos</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-sky-200">
                Nuestros algoritmos están actualizados según las últimas normativas del IMSS para garantizar la exactitud de tus proyecciones.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
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