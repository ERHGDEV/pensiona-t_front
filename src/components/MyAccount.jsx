import { useState } from 'react'
import UserProfile from './UserProfile'
import SubscriptionPayment from './SubscriptionPayment'
import ActiveSuscription from './ActiveSubscription'

const MyAccount = ({ history }) => {
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
                        className={`px-4 py-2 rounded-full ${activeSection === 'history' ? 'bg-gray-200 text-gray-700' : 'bg-sky-950 text-white font-semibold' }`}
                        onClick={() => setActiveSection('history')}
                    >
                        Historial
                    </button>
                </div>

                {activeSection === 'profile' ? (
                    <UserProfile />
                ) : (
                    <ActiveSuscription />
                )}
        </div>
    )
}

export default MyAccount