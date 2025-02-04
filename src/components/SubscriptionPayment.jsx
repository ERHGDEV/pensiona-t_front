import { useState } from 'react'
import axios from 'axios'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import AuthService from '../services/authService'
import Button from './Button'
import PLANS from '../constants/suscriptionPlans'
import { formatFeature } from '../utils/formatFeaturePricing'

const SubscriptionPayment = () => {
  const [preferenceId, setPreferenceId] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  initMercadoPago('APP_USR-eb6253b5-cdbe-4f3a-b05f-7cccca59aca0', { locale: 'es-MX' })

  const createPreference = async () => {
    setIsLoading(true)
    try {
        const token = AuthService.getToken()
        const response = await axios.post(
            "http://localhost:5000/api/create_preference",
            {
                title: `Suscripción ${selectedPlan.title} a Pensiona-T`,
                quantity: 1,
                unit_price: Number(selectedPlan.price),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            }
        )
          const { id } = response.data;
          return id
        } catch (error) {
          console.error('Error al crear la preferencia:', error);
          throw error;
        } finally {
          setIsLoading(false);
        }
    }

    const onSubmit = async () => {
        const id = await createPreference()
        if (id) {
            setPreferenceId(id)
        }
    }

  const filteredPlans = PLANS.filter((plan) => plan.title !== 'Free')

  return (
    <main className="max-w-7xl mx-auto text-sky-950 pt-4 font-sans">
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
                            <Button onClick={() => setSelectedPlan(plan)}>
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
            <div className="mt-4">
              {preferenceId ? (
                <Wallet initialization={{ preferenceId }} />
              ) : (
                <div className="mt-8 gap-4 max-w-fit">
                <Button onClick={() => onSubmit()}>Continuar al pago</Button>
                </div>
              )}
            </div>
        </div>
      )}
    </main>
  )
}

export default SubscriptionPayment
