import { useState } from 'react'
import WhatAforeAmI from './WhatAforeAmI'
import InviteToUnlimited from './InviteToUnlimited'
import ExcelAforeUploader from './ExcelAforeUploader'
import ComponentTransition from './ComponentTransition'
import { AnimatePresence } from 'framer-motion'


const Afore = ({ subscription, initialCount, onConsult, onSelection }) => {
    const [activeSection, setActiveSection] = useState('individual')

    return(
        <>
        <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 pb-0 mt-4 max-w-md w-full mx-auto'>
            {subscription === 'unlimited' ? (
                <>
                <h2 className="text-2xl font-bold mb-6 text-center text-sky-900">Consulta de Afore</h2>
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'individual' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700 shadow-md' }`}
                        onClick={() => setActiveSection('individual')}
                    >
                        Individual
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${activeSection === 'bulk' ? 'bg-sky-950 text-white font-semibold' : 'bg-yellow-200 text-sky-900 shadow-md' }`}
                        onClick={() => setActiveSection('bulk')}
                    >
                        Masiva
                    </button>
                </div>
                <AnimatePresence mode="wait">
                {activeSection === 'individual' && (
                    <ComponentTransition key="individual">
                        <WhatAforeAmI subscription={subscription} initialCount={initialCount} onConsult={onConsult} />
                    </ComponentTransition>
                )}
                {activeSection === 'bulk' && (
                    <ComponentTransition key="bulk">
                        <ExcelAforeUploader />
                    </ComponentTransition>
                )}
            </AnimatePresence>
                </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center text-sky-900">¿Cuál es mi AFORE?</h2>   
                        <WhatAforeAmI subscription={subscription} initialCount={initialCount} onConsult={onConsult} />
                        
                    </>
                )}
        </div>
        {subscription === 'free' &&
            <InviteToUnlimited onSelection={onSelection} />
        }        
        </>
    )
}

export default Afore