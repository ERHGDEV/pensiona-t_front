import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"
import UserIcon from "./icons/UserIcon"

const UserProfile = () => {
  const { user } = useUserContext()
  const {
    name,
    email,
    created,
    subscription,
    expiration,
    pdfAnalizados,
    calculosRealizados,
    reportesGenerados,
    aforesConsultadas,
  } = user

  return (
    <>
      <div className="flex flex-col items-center pt-2">
        <UserIcon className="w-20 h-20 rounded-full mb-4 text-sky-700" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{name}</h2>
        <p className="text-gray-500 text-sm mb-1">{email}</p>
        <p className="text-gray-400 text-sm">Miembro desde: {formatDate(created)}</p>
        {subscription === "free" ? (
          <p className="text-red-500 font-semibold text-md mt-4">No tienes un plan activo</p>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-gray-600 font-semibold text-md">Plan: {subscriptionNormalize(subscription)}</p>
            <p className="text-gray-500 text-sm">Vence: <strong>{formatDate(expiration)}</strong></p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Estadísticas</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard title={<>Semanas<br />analizadas</>} value={pdfAnalizados || 0} />
          <StatCard title={<>Cálculos de<br />pensión</>} value={calculosRealizados || 0} />
          <StatCard title={<>Detalles en<br />PDF</>} value={reportesGenerados || 0} />
          <StatCard title={<>Consultas de<br />Afore</>} value={aforesConsultadas || 0} />
        </div>
      </div>
    </>
  )
}

const StatCard = ({ title, value }) => (
  <div className="bg-sky-50 rounded-lg shadow-md p-4 text-center">
    <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
    <p className="text-2xl font-bold text-sky-700">{value}</p>
  </div>
)

export default UserProfile