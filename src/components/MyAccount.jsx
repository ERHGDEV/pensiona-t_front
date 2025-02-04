import { useState } from 'react'
import UserProfile from './UserProfile'
import SubscriptionPayment from './SubscriptionPayment'
import ActiveSuscription from './ActiveSubscription'

const MyAccount = ({ user }) => {
    const [activeSection, setActiveSection] = useState('profile')

    return (
        <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
            <div className="flex justify-center">
                    <button
                        className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'profile' ? 'bg-gray-200 text-gray-700' : 'bg-sky-950 text-white font-semibold' }`}
                        onClick={() => setActiveSection('profile')}
                    >
                        Perfil
                    </button>
                    <button
                        className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'subscription' ? 'bg-gray-200 text-gray-700' : 'bg-sky-950 text-white font-semibold' }`}
                        onClick={() => setActiveSection('subscription')}
                    >
                        Suscripción
                    </button>
                </div>

                {activeSection === 'profile' ? (
                    <UserProfile user={user} />
                ) : user.subscription === 'free' ? (
                    <SuscriptionPayment />
                ) : (
                    <ActiveSuscription name={user.subscription} expirationDate={user.expiration} paymentHistory={user.paymentHistory} />
                )}
        </div>
    )
}

export default MyAccount