import Button from "./Button"

const CallToAction = () => {
    return (
        <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para planificar tu futuro?</h2>
            <p className="text-xl text-sky-100 mb-8">
                Comienza hoy mismo a calcular tu pensión</p>
            <div className="mt-8 max-w-fit mx-auto gap-4">
                <Button to="/register" children="Regístrate gratis" />
            </div>
            
        </section>
    )
}

export default CallToAction