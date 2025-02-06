import Button from './Button'
import { Link } from 'react-router-dom'
import PLANS from '../constants/subscriptionPlans'
import { formatFeature } from '../utils/formatFeaturePricing'

const Pricing = () => {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sky-950 py-4 font-sans">
            <h1 className="text-gray-100 text-3xl text-center font-bold mb-4">Planes</h1>
            <div className={`grid grid-cols-1 max-w-sm mx-auto md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl gap-6`}>
            {PLANS.map((plan, index) => (
                <div key={index} className="flex flex-col items-center relative">
                    {plan.title === 'Unlimited' && (
                        <div className="absolute -top-2 bg-yellow-50 text-yellow-950 text-sm font-bold px-3 py-1 rounded-full">
                        ⭐ El más solicitado ⭐
                        </div>
                    )}
                    <div
                        className={`border border-gray-300 rounded-lg p-6 bg-gray-50 w-full h-full flex flex-col justify-between ${
                        plan.title === 'Unlimited' ? 'shadow-lg' : ''
                        }`}
                    >
                        <div>
                        <h2 className="text-sky-700 text-xl font-semibold">{plan.title}</h2>
                        <p className="text-2xl font-bold">
                            {plan.price > 0 ? `$${plan.price} MXN/mes` : 'Sin costo'}
                        </p>
                        <p className="mt-4">Incluye:</p>
                        <ul className="list-none mt-2 text-sm space-y-2">
                            {plan.features.map((feature, i) => (
                            <li
                                key={i}
                                dangerouslySetInnerHTML={{
                                __html: formatFeature(feature, plan.title),
                                }}
                            ></li>
                            ))}
                        </ul>
                        </div>
                        <>
                            {plan.title === 'Free' && (
                            <p className="text-sm font-semibold text-sky-900 mt-4">
                                <Link to="/register" className="text-sky-600 hover:underline">
                                Regístrate gratis para comenzar o
                                </Link>
                            </p>
                            )}
                            <div className="mt-4 gap-4 max-w-fit">
                            <Button to="/login">Iniciar sesión</Button>
                            </div>
                        </>
                    </div>
                </div>
            ))}
            </div>
            <div className="text-center mt-8 text-sky-50 px-4">
                <p>
                    Si tienes alguna duda o necesitas un plan personalizado, no dudes en <a href="mailto:contacto@pensiona-t.com" className="text-sky-200 hover:underline">contactarnos</a>.
                </p>
            </div>
        </main>
    )
}

export default Pricing