import { useState } from 'react'
import UserProfile from './UserProfile'
import ActiveSuscription from './ActiveSubscription'
import ComponentTransition from './ComponentTransition'
import { AnimatePresence } from 'framer-motion'
import UserPill from './UserPill'
import UserCogIcon from './icons/UserCogIcon'
import UserDollarIcon from './icons/UserDollarIcon'

const MyAccount = () => {
    const [activeSection, setActiveSection] = useState('profile')

    return (
        <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
            <nav className="flex justify-center space-x-4 mb-6">
                <UserPill activeSection={activeSection} setActiveSection={setActiveSection} section="profile" text="Perfil" icon={<UserCogIcon className="h-5 w-5 inline-block mr-1" />} />
                <UserPill activeSection={activeSection} setActiveSection={setActiveSection} section="history" text="Historial" icon={<UserDollarIcon className="h-5 w-5 inline-block mr-1" />} />
            </nav>

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
