import { useState } from 'react'
import UserProfile from './UserProfile'
import ActiveSuscription from './ActiveSubscription'
import ComponentTransition from './ComponentTransition'
import { AnimatePresence } from 'framer-motion'

const MyAccount = () => {
    const [activeSection, setActiveSection] = useState('profile')

    return (
        <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
            {/* Botones de navegación */}
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'profile' ? 'bg-gray-300 text-gray-800 font-semibold' : 'bg-sky-800 text-white'}`}
                    onClick={() => setActiveSection('profile')}
                >
                    Cuenta
                </button>
                <button
                    className={`px-4 py-2 rounded-full ${activeSection === 'history' ? 'bg-gray-300 text-gray-800 font-semibold' : 'bg-sky-800 text-white'}`}
                    onClick={() => setActiveSection('history')}
                >
                    Historial
                </button>
            </div>

            {/* Secciones con transiciones */}
            <AnimatePresence mode="wait">
                {activeSection === 'profile' && (
                    <ComponentTransition key="profile">
                        <UserProfile />
                    </ComponentTransition>
                )}
                {activeSection === 'history' && (
                    <ComponentTransition key="history">
                        <ActiveSuscription />
                    </ComponentTransition>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MyAccount
