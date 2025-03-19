import Button from './Button'
import { Link } from 'react-router-dom'

export default function CallToAction() {
  return (
    <section className="animate-gradient-x">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl text-pretty font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">¿Listo para planificar tu futuro?</span>
          <span className="block text-sky-300">Comienza a calcular tu pensión hoy.</span>
          <p className='text-white tracking-tight text-lg mt-2'>
            <Link to="/pricing" className='text-sky-100 hover:text-white transition-colors duration-500'>
              Ver planes disponibles
            </Link>
          </p>
        </h2>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow-lg">
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