import { useState, useEffect } from "react"
import axios from "axios"
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import AuthService from "../services/authService"
import Dots from "./Dots"
import { formatFeature } from "../utils/formatFeaturePricing"

const UpdatePayment = () => {
  const [preferenceId, setPreferenceId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const customization = {
    theme: 'default',
    texts: {
      action: 'pay',
      valueProp: 'security_safety',
    },
    customStyle: {
      hideValueProp: true,
    },
  }

  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, { locale: "es-MX" })

  useEffect(() => {
    const createPreference = async () => {
      try {
        const token = AuthService.getToken()
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/create_preference`,
          {
            title: "Actualización de plan a Unlimited",
            quantity: 1,
            unit_price: 50.0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setPreferenceId(response.data.id)
      } catch (error) {
        console.error("Error al crear la preferencia:", error)
      } finally {
        setIsLoading(false)
      }
    }

    createPreference()
  }, [])

  const selectedPlan = {
    title: "Actualización a plan Unlimited",
    price: 50.0,
    features: [
      "🔍 Consulta individual de Afore: <strong>Ilimitada</strong>",
      "📂 Consulta Masiva de Afore: <strong>Ilimitada</strong>",
    ],
  }

  return (
    <div className="h-[350px] border border-sky-300 rounded-lg p-6 bg-gray-50 w-full">
      <h2 className="text-sky-700 text-xl font-semibold">{selectedPlan.title}</h2>
      <p className="text-2xl font-bold">${selectedPlan.price} MXN</p>
      <p className="mt-4">Incluye:</p>
      <ul className="list-none mt-4 text-sm space-y-2">
        {selectedPlan.features.map((feature, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: formatFeature(feature, selectedPlan.title) }}></li>
        ))}
      </ul>
      <div className="mt-4">
        <p className='text-sm font-semibold text-center'>Pagar con</p>
        {preferenceId 
          ? <Wallet 
              initialization={{ preferenceId }}
              customization={ customization }
            /> 
          : <div className="flex justify-center items-center mt-8">
              <Dots color='true'/>
            </div>}
      </div>
    </div>
  )
}

export default UpdatePayment
