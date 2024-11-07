import FeatureCard from "./FeatureCard"

const Features = () => {
    return (
        <section className="mt-20 text-center max-w-3xl">
            <h2 
                className="text-3xl font-bold text-white mb-8"
            >
                ¿Por qué elegir nuestra calculadora?
            </h2>
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
    )
}

export default Features