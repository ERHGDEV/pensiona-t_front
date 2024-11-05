import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FeatureCard from '../components/FeatureCard'

const Landing = () => {
    const navigate = useNavigate()

    const handleRegisterClick = () => {
        navigate('/login?register=true')
    }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-12 sm:pt-16 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-white">
            Realiza proyecciones de <span className="text-sky-300">Pensión</span>
          </h1>
          <p className="mt-4 text-xl text-sky-100">
            Herramienta especializada para trabajadores IMSS de la Ley 73
          </p>
        </header>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="bg-white hover:bg-sky-100 text-sky-900 font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            Inicia sesión
            <span className="ml-2">→</span>
          </Link>
          <button
            onClick={handleRegisterClick}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            Regístrate gratis
            <span className="ml-2">→</span>
          </button>
        </div>

        <div className="relative mt-16 max-w-lg w-full">
          <img
            src="/calc.webp"
            alt="Preview de la calculadora"
            className="rounded-lg shadow-2xl w-full"
          />

          <div className="absolute top-4 left-4 sm:left-0 transform sm:-translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-auto">
            <div className="text-sky-500 text-4xl mb-2">🧮</div>
            <p className="text-xl font-bold text-gray-900">Genera confianza</p>
            <p className="text-sky-700 text-sm mt-1">Considera todas las variables</p>
          </div>

          <div className="absolute bottom-4 right-4 sm:right-0 transform sm:translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-auto">
            <div className="text-sky-500 text-4xl mb-2">🛡️</div>
            <p className="text-xl font-bold text-gray-900">Modalidad 40</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>• Aportaciones detalladas</p>
              <p>• Comparativa clara</p>
            </div>
          </div>
        </div>

        <section className="mt-20 text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8">¿Por qué elegir nuestra calculadora?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              description="No solicitamos datos sensibles."
            />
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para planificar tu futuro?</h2>
          <p className="text-xl text-sky-100 mb-8">Comienza hoy mismo a calcular tu pensión</p>
          <button
            onClick={handleRegisterClick}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out inline-flex items-center"
          >
            Empieza Ahora
            <span className="ml-2">→</span>
          </button>
        </section>
      </main>

      <footer className="mt-20 py-4 text-center text-sky-200">
        <p>&copy; 2024 Pensiona-T</p>
      </footer>
    </div>
  )
}

export default Landing