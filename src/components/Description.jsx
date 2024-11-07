const Description = () => {
    return (
        <section className="relative mt-16 max-w-xl w-full">
            <img
                src="/calc.webp"
                alt="Preview de la calculadora"
                className="rounded-lg shadow-2xl max-w-lg w-full mx-auto"
            />

            <div className="absolute top-4 left-4 sm:left-14 transform sm:-translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-auto">
                <div className="text-sky-500 text-4xl mb-2">🧮</div>
                <p className="text-xl font-bold text-gray-900">Genera confianza</p>
                <p className="text-sky-700 text-sm mt-1">Considera todas las variables</p>
            </div>

            <div className="absolute bottom-4 right-4 sm:right-14 transform sm:translate-x-1/2 bg-white p-6 rounded-lg shadow-md w-auto">
                <div className="text-sky-500 text-4xl mb-2">🛡️</div>
                <p className="text-xl font-bold text-gray-900">Modalidad 40</p>
                <div className="mt-2 text-sm text-gray-600">
                <p>• Aportaciones detalladas</p>
                <p>• Comparativa clara</p>
                </div>
            </div>
        </section>
    )
}

export default Description