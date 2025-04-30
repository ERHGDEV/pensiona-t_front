import { useUserContext } from "../context/UserContext"
import { useActiveSection } from "../context/ActiveSectionContext"
import { formatDate } from "../utils/formatDate"
import { subscriptionNormalize } from "../utils/subscriptionNormalize"
import { differenceInDays, subDays } from "date-fns"
import DeviceMobileUpIcon from "./icons/DeviceMobileUpIcon"
import DeviceMobileStarIcon from "./icons/DeviceMobileStarIcon"
import DeviceMobileIcon from "./icons/DeviceMobileIcon"

const SuscriptionBar = () => {
    const { user } = useUserContext()
    const { setActiveSection } = useActiveSection()
    const { subscription, expiration } = user

    const daysToExpire = differenceInDays(new Date(expiration), new Date())
    const availableUntil = subDays(new Date(expiration), 24)

    return (
        <>
        {subscription === 'free' ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg flex justify-between items-center text-md">
                <p className="flex items-center justify-center text-sky-800">
                    <DeviceMobileIcon className="h-5 w-5 inline-block mr-1" />
                    Plan <span className="ml-1 font-semibold">{subscriptionNormalize(subscription)}</span>
                </p>
                <button 
                        onClick={() => setActiveSection('subscription')} 
                        className="flex items-center justify-center text-sky-800 font-semibold underline hover:text-yellow-900 transition-all"
                    >
                        <DeviceMobileUpIcon className="h-5 w-5 inline-block mr-1" />
                        Mejora tu plan
                </button>
            </div>
        ) : (
            <div className="px-4 mb-4 rounded-lg text-sm md:text-base">
                <p className="flex items-center justify-center text-sky-50 text-center">
                    <DeviceMobileStarIcon className="h-5 w-5 inline-block mr-1" />
                    Plan <span className="mx-1 font-semibold">{subscriptionNormalize(subscription)}</span> | Vence {formatDate(expiration)}
                </p>
                {subscription === 'pro' && daysToExpire > 24 && (
                    <div className="flex flex-col justify-center">
                        <button 
                            onClick={() => setActiveSection('update')} 
                            className="text-yellow-100 text-center mt-1 font-semibold underline hover:text-sky-100"
                        >
                            Mejora a plan Unlimited por $50.00 MXN
                        </button>
                        <p className="mt-1 text-center">disponible hasta el {formatDate(availableUntil)}</p>
                    </div>
                )}
            </div>
        )}
        </>
    )
}

export default SuscriptionBar