import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"

const UserProfile = () => {
  const { user } = useUserContext()
  const { name, email, created, subscription, expiration, profileImage, pdfAnalizados, calculosRealizados, reportesGenerados, aforesConsultadas } = user

  return (
    <>
      <div className="flex flex-col items-center pt-4">
        <img 
          src={profileImage || '/placeholder.svg'} 
          alt="Profile" 
          className="w-16 h-16 rounded-full mb-3 bg-gray-200"
        />
        <h2 className="text-lg font-bold mb-1">{name}</h2>
        <p className="text-gray-600 mb-1">{email}</p>
        <p className="text-gray-500 text-sm mb-1">Miembro desde: {formatDate(created)}</p>
        {subscription === 'free' ? (
          <p className="text-gray-500 font-semibold text-md mb-3">No tienes una suscripción activa</p>
        ) : (
          <>
            <p className="text-gray-500 font-semibold text-md mb-1">Plan: {subscription}</p>
            <p className="text-gray-500 text-sm mb-3">Vence: <strong>{formatDate(expiration)}</strong></p>
          </>
        )}
      </div>
      <h2 className='mb-2 text-center'>Has realizado</h2>
      <div className="text-center grid grid-cols-2 gap-3">
        <div>
          <h3 className="text-sm font-semibold mb-1">Semanas analizadas</h3>
          <div className={`bg-gray-200 h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{pdfAnalizados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Cálculos</h3>
          <div className={`bg-gray-200 h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{calculosRealizados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Reportes</h3>
          <div className={`bg-gray-200 h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{reportesGenerados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Afore consultadas</h3>
          <div className={`bg-gray-200 h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{aforesConsultadas || 0}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile