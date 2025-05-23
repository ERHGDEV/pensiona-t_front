import Button from './Button'

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl text-pretty tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                Realiza proyecciones de <span className="text-sky-300">Pensión</span>
              </h1>
              <p className="mt-3 text-base text-sky-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Herramienta especializada para trabajadores IMSS de la Ley 73. Planifica tu futuro financiero.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button to="/login" order="primary">
                    Iniciar sesión
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button to="/register">
                    Regístrate gratis
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-64 mx-auto rounded object-cover sm:h-72 md:h-96 lg:h-full animate-fade-in-left"
          src="/calculator.webp"
          alt="Planificación de pensiones"
        />
      </div>
    </div>
  )
}