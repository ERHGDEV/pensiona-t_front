import { Link } from 'react-router-dom'
import Header from '../components/Header'

const Landing = () => {
    
    return (
        <>
            <Header />

            <main className="pt-12 sm:pt-16 flex flex-col items-center 
                justify-center px-4 sm:px-6 lg:px-8">
                
                <header className="text-center max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                        Calculadora de <span className="text-sky-400">Pensión</span>
                    </h1>
                    <p className="mt-4 text-lg text-sky-50">
                        Para trabajadores IMSS de la Ley 73
                    </p>
                </header>

                <Link to="/login" 
                    className='mt-4 bg-white hover:bg-sky-200 text-sky-950 font-bold py-2 px-4 rounded'>Inicia sesión</Link>

                <div className="relative mt-8 max-w-2xl">
                    <img
                    src="/calc.webp"
                    alt="Preview"
                    className="rounded-lg shadow-lg w-full"
                    />

                    <div className="absolute top-4 left-4 sm:left-0 transform sm:-translate-x-1/2 bg-sky-50 p-4 rounded-lg shadow-md w-auto">
                        <p className="text-sm font-medium text-gray-500">Genera confianza</p>
                        <p className="text-xl font-bold text-gray-900">Conoce</p>
                        <p className="text-sky-700 text-sm">Todas las variables</p>
                    </div>

                    <div className="absolute bottom-4 right-4 sm:right-0 transform sm:translate-x-1/2 bg-sky-50 p-4 rounded-lg shadow-md w-auto">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/avatar.webp"
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Modalidad 40</p>
                                <p className="text-xs text-gray-500">Proximamente</p>
                            </div>
                        </div>
                    
                        <div className="mt-4 text-sm text-gray-600">
                            <p>Aportaciones</p>
                            <p>Comparativas</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Landing