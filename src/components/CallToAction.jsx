import ActionButton from "./ActionButton"
import { useNavigate } from "react-router-dom"

const CallToAction = () => {
    const navigate = useNavigate()

    const handleRegisterClick = () => {
        navigate('/login?register=true')
    }

    return (
        <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para planificar tu futuro?</h2>
            <p className="text-xl text-sky-100 mb-8">
                Comienza hoy mismo a calcular tu pensión</p>
            <ActionButton onClick={handleRegisterClick}>
                Registrate gratis</ActionButton>
        </section>
    )
}

export default CallToAction