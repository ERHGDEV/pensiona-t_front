import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"
import { differenceInDays, subDays } from "date-fns"

const SuscriptionBar = ({ onSelection }) => {
    const { user } = useUserContext()
    const { subscription, expiration } = user

    const daysToExpire = differenceInDays(new Date(expiration), new Date())
    const availableUntil = subDays(new Date(expiration), 26)

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
                {subscription === 'pro' && daysToExpire > 26 && (
                    <div className="flex flex-col justify-center">
                        <button 
                            onClick={() => onSelection('update')} 
                            className="text-yellow-100 text-center mt-2 font-semibold underline hover:text-sky-100"
                        >
                            Actualiza a plan Unlimited por $50.00 MXN
                        </button>
                        <p className="mt-2 text-center">hasta el {formatDate(availableUntil)}</p>
                    </div>
                )}
            </div>
        )}
        </>
    )
}

export default SuscriptionBar