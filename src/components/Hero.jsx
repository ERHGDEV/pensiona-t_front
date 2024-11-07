import { useNavigate } from 'react-router-dom'
import ActionButton from './ActionButton'
import LinkButton from './LinkButton'

const Hero = () => {
    const navigate = useNavigate()

    const handleRegisterClick = () => {
        navigate('/login?register=true')
    }

    return (
        <>
            <header className="text-center max-w-3xl">
                <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-white">
                    Realiza proyecciones de <span className="text-sky-300">Pensión</span>
                </h1>
                <p className="mt-4 text-xl text-sky-100">
                    Herramienta especializada para trabajadores IMSS de la Ley 73
                </p>
            </header>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <LinkButton to="/login" children="Iniciar sesión" />
                <ActionButton onClick={handleRegisterClick}>Regístrate gratis</ActionButton>
            </div>
        </>
    )
}

export default Hero