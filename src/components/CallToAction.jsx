import Button from './Button'

export default function CallToAction() {
  return (
    <section className="bg-sky-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl text-pretty font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">¿Listo para planificar tu futuro?</span>
          <span className="block text-sky-300">Comienza a calcular tu pensión hoy.</span>
        </h2>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow">
            <Button to="/register" order="primary">
              Empieza ahora
            </Button>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Button to="/login">
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}