import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"

const SuscriptionBar = ({ onSelection }) => {
    const { user } = useUserContext()
    const { subscription, expiration } = user

    return (
        <>
        {subscription === 'free' ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg flex justify-between items-center text-md">
                <p className="text-yellow-800">
                    Plan actual: <span className="font-semibold">{subscriptionNormalize(subscription)}</span>
                </p>
                <button 
                        onClick={() => onSelection('subscription')} 
                        className="text-yellow-800 font-semibold underline hover:text-yellow-900"
                    >
                        Quiero suscribirme
                </button>
            </div>
        ) : (
            <div className="px-4 mb-4 rounded-lg text-sm">
                <p className="text-sky-50 text-center">
                    Plan: <span className="font-semibold">{subscriptionNormalize(subscription)}</span> | Vence: {formatDate(expiration)}
                </p>
            </div>
        )}
        </>
    )
}

export default SuscriptionBar