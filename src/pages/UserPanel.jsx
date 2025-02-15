import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNotificationContext } from "../context/NotificationContext"
import { useUserContext } from "../context/UserContext"
import Dots from "../components/Dots"
import axiosInstance from "../services/axiosConfig"
import Calculator from "../components/Calculator"
import WhatAforeAmI from "../components/WhatAforeAmI"
import ExcelAforeUploader from "../components/ExcelAforeUploader"
import Notification from "../components/Notification"
import MyAccount from "../components/MyAccount"
import SubscriptionPayment from "../components/SubscriptionPayment"
import SubscriptionBar from "../components/SubscriptionBar"
import InviteToUnlimited from "../components/InviteToUnlimited"
import ComponentTransition from "../components/ComponentTransition"

const UserPanel = () => {
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('calculadora')
    const [counter, setCounter] = useState(0)
    
    const { user, setUser } = useUserContext()
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()

    const verifyUser = async () => {
        try {
            const response = await axiosInstance.get("/user")
            if (!response.data.name) {
                throw new Error('No se pudo verificar tu sesión')
            }
            showNotification(`Hola, ${response.data.name}`, 'info')
            setUser(response.data)
            setCounter(response.data.aforesConsultadasHoy)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn('Sesión expirada, redirigiendo a login...')
            } else {
                console.error('Error desconocido:', error)
            }
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        verifyUser()
    }, [navigate])

    if (loading) {
        return(
            <>
                <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)]" >
                    <p className="mb-8">Cargando</p>
                    <Dots />
                </div>
            </>
        )
    }
    return (
        <>
            <Notification />
            <main className="max-w-md mx-auto px-4 py-4">
                <SubscriptionBar onSelection={setActiveSection} />

                <div className="flex justify-center">
                    <button
                        className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'calculadora' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                        onClick={() => setActiveSection('calculadora')}
                    >
                        Calculadora
                    </button>
                    <button
                        className={`px-4 py-2 mr-4 rounded-full ${activeSection === 'afore' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                        onClick={() => setActiveSection('afore')}
                    >
                        Afore
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full ${activeSection === 'perfil' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                        onClick={() => setActiveSection('perfil')}
                    >
                        Perfil
                    </button>
                </div>
                
                <div className="relative overflow-hidden">
                    {activeSection === 'calculadora' && (
                        <ComponentTransition>
                        <Calculator subscription={user.subscription} />
                        </ComponentTransition>
                    )}

                    {activeSection === 'afore' && (
                        <ComponentTransition>
                        <>
                            <WhatAforeAmI subscription={user.subscription} initialCount={counter} onConsult={setCounter} />
                            {user.subscription === 'unlimited' ? (
                            <ExcelAforeUploader />
                            ) : user.subscription === 'fre' ? (
                            <InviteToUnlimited onSelection={setActiveSection} />
                            ) : null}
                        </>
                        </ComponentTransition>
                    )}

                    {activeSection === 'perfil' && (
                        <ComponentTransition>
                        <MyAccount subscription={user.subscription} />
                        </ComponentTransition>
                    )}

                    {activeSection === 'subscription' && (
                        <ComponentTransition>
                        <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
                            <SubscriptionPayment />
                        </div>
                        </ComponentTransition>
                    )}
                </div>
            </main>
        </>
    )
}

export default UserPanel