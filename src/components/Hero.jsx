import Button from './Button'

const Hero = () => {
    return (
        <>
            <header className="text-center max-w-3xl">
                <h1 className="text-4xl text-pretty sm:text-6xl font-bold leading-tight text-white">
                    Realiza proyecciones de <span className="text-sky-300">Pensión</span>
                </h1>
                <p className="mt-4 text-xl text-sky-100">
                    Herramienta especializada para trabajadores IMSS de la Ley 73
                </p>
            </header>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button to="/login" order="primary" children="Iniciar sesión" />
                <Button to="/register" children="Regístrate gratis"/>
            </div>
        </>
    )
}

export default Hero