import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"
import PaymentHistory from "./PaymentHistory"

const ActiveSubscription = () => {
    const { user } = useUserContext()
    const { subscription, expiration } = user
    const isFreePlan = subscription.toLowerCase() === "free"

    return (
        <div className="bg-white pt-4 max-w-md w-full mx-auto">
            <h1 className="text-xl text-center font-bold text-sky-950">
                {isFreePlan ? "Actualmente no tienes un plan activo" : "Tienes un plan activo"}
            </h1>
                <div className="mt-4">
                    
                    {!isFreePlan && (
                        <>
                            <p className="text-gray-700"><span className="font-semibold">Plan:</span> {subscriptionNormalize(subscription)}</p>
                            <p className="text-gray-700"><span className="font-semibold">Vence:</span> {formatDate(expiration)}</p>
                        </>
                    )}
                </div>
            <PaymentHistory />
        </div>
    )
}

export default ActiveSubscription
