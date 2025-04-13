import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"
import UserIcon from "./icons/UserIcon"

const UserProfile = () => {
  const { user } = useUserContext()
  const { name, email, created, subscription, expiration, pdfAnalizados, calculosRealizados, reportesGenerados, aforesConsultadas } = user

  return (
    <>
      <div className="flex flex-col items-center pt-2">
        <UserIcon 
          className="w-16 h-16 rounded-full mb-3 text-sky-700"
        />
        <h2 className="text-lg text-center font-bold mb-1">{name}</h2>
        <p className="text-gray-600 mb-1">{email}</p>
        <p className="text-gray-500 text-sm mb-1">Miembro desde: {formatDate(created)}</p>
        {subscription === 'free' ? (
          <p className="text-gray-500 font-semibold text-md mt-2 mb-3">No tienes un plan activo</p>
        ) : (
          <>
            <p className="text-gray-500 font-semibold text-md mt-4 mb-1">Plan: {subscriptionNormalize(subscription)}</p>
            <p className="text-gray-500 text-sm mb-4">Vence: <strong>{formatDate(expiration)}</strong></p>
          </>
        )}
      </div>
      <h2 className='mb-2 text-center'>Has realizado</h2>
      <div className="text-center grid grid-cols-2 gap-3">
        <div>
          <h3 className="text-sm font-semibold mb-1">Semanas analizadas</h3>
          <div className={`bg-yellow-50 h-14 rounded flex items-center justify-center shadow-sm`}>
            <span className="text-xl font-bold">{pdfAnalizados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Cálculos de pensión</h3>
          <div className={`bg-yellow-50 h-14 rounded flex items-center justify-center shadow-sm`}>
            <span className="text-xl font-bold">{calculosRealizados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Detalles en PDF</h3>
          <div className={`bg-yellow-50 h-14 rounded flex items-center justify-center shadow-sm`}>
            <span className="text-xl font-bold">{reportesGenerados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Consultas de Afore</h3>
          <div className={`bg-yellow-50 h-14 rounded flex items-center justify-center shadow-sm`}>
            <span className="text-xl font-bold">{aforesConsultadas || 0}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile