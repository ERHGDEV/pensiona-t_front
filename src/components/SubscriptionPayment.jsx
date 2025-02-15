import { useState } from 'react'
import axios from 'axios'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import AuthService from '../services/authService'
import Button from './Button'
import Dots from './Dots'
import PLANS from '../constants/subscriptionPlans'
import { formatFeature } from '../utils/formatFeaturePricing'

const SubscriptionPayment = () => {
  const [preferenceId, setPreferenceId] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, { locale: 'es-MX' })

  const createPreference = async (plan) => {
    setIsLoading(true)
    try {
        const token = AuthService.getToken()
        const response = await axios.post(
            `${import.meta.env.VITE_URL}/create_preference`,
            {
                title: `Suscripción ${plan.title} de Pensiona-T`,
                quantity: 1,
                unit_price: Number(plan.price),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        )
          setPreferenceId(response.data.id)
        } catch (error) {
          console.error('Error al crear la preferencia:', error)
        } finally {
          setIsLoading(false)
        }
    }

    const handleSelectPlan = async (plan) => {
      setSelectedPlan(plan)
      await createPreference(plan)
    }

  const filteredPlans = PLANS.filter((plan) => plan.title !== 'Free')

  return (
    <main className="max-w-7xl mx-auto mt-2 text-sky-950 font-sans">
        {!selectedPlan ? (
            <>
                <p className='text-sm font-semibold pb-2'>Selecciona uno de los siguientes planes:</p>
                <div className={`grid grid-cols-1 max-w-sm mx-auto gap-6`}>
                {filteredPlans.map((plan, index) => (
                    <div key={index} className="flex flex-col items-center relative">
                    {plan.title === 'Unlimited' && (
                        <div className="absolute -top-2 bg-yellow-400 text-yellow-950 text-sm font-bold px-3 py-1 rounded-full">
                        El más solicitado
                        </div>
                    )}
                    <div
                        className={`border border-sky-300 rounded-lg p-6 bg-gray-50 w-full h-full flex flex-col justify-between ${
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
                        <div className="mt-4 gap-4 max-w-fit">
                            <Button onClick={() => handleSelectPlan(plan)}>
                                {isLoading ? 'Procesando...' : `Elegir ${plan.title}`}
                            </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </>
        ) : (
        <div className="h-[380px] border border-sky-300 rounded-lg p-6 bg-gray-50 w-full">
            <h2 className="text-sky-700 text-xl font-semibold">{selectedPlan.title}</h2>
            <p className="text-2xl font-bold">${selectedPlan.price} MXN/mes</p>
            <p className="mt-4">Incluye:</p>
            <ul className="list-none mt-4 text-sm space-y-2">
              {selectedPlan.features.map((feature, i) => (
                <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: formatFeature(feature, selectedPlan.title),
                }}
              ></li>
              ))}
            </ul>
            <div className="mt-2">
              {preferenceId 
                ? <Wallet initialization={{ preferenceId }} /> 
                : <div className="flex justify-center items-center mt-16">
                    <Dots color='true'/>
                  </div>}
            </div>
        </div>
      )}
    </main>
  )
}

export default SubscriptionPayment
