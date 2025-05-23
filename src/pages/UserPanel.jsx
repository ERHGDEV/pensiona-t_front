import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNotificationContext } from "../context/NotificationContext"
import { useUserContext } from "../context/UserContext"
import { useActiveSection } from "../context/ActiveSectionContext"
import { useCounterContext } from "../context/CounterContext"
import Dots from "../components/Dots"
import axiosInstance from "../services/axiosConfig"
import Calculator from "../components/Calculator"
import MyAccount from "../components/MyAccount"
import SubscriptionPayment from "../components/SubscriptionPayment"
import SubscriptionBar from "../components/SubscriptionBar"
import UpdatePayment from "../components/UpdatePayment"
import ComponentTransition from "../components/ComponentTransition"
import Afore from "../components/Afore"
import { AnimatePresence } from "framer-motion"
import DesktopNavBar from "../components/DesktopNavBar"
import MobileNavBar from "../components/MobileNavBar"

const UserPanel = () => {
    const [loading, setLoading] = useState(true)
    
    const { activeSection } = useActiveSection()
    const { setCounter } = useCounterContext()
    const { setUser } = useUserContext()
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()

    const verifyUser = async () => {
        try {
            const response = await axiosInstance.get("/user")
            if (!response.data.name) {
                throw new Error('No se pudo verificar tu sesión')
            }
            showNotification(`Bienvenid@`, 'success')
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
            <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)]">
                <p className="mb-8">Cargando</p>
                <Dots />
            </div>
        )
    }

    return (
        <>
            <main className="max-w-md mx-auto px-4 py-4 pb-24 md:pb-4">
                <SubscriptionBar />
                <DesktopNavBar />

                <AnimatePresence mode="wait">
                    <ComponentTransition key={activeSection}>
                        {activeSection === 'calculator' && <Calculator />}
                        {activeSection === 'afore' && <Afore />}
                        {activeSection === 'myAccount' && <MyAccount />}
                        {activeSection === 'subscription' && (
                            <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
                                <SubscriptionPayment />
                            </div>
                        )}
                        {activeSection === 'update' && (
                            <div className='text-sky-950 bg-white rounded-lg shadow-xl p-6 mt-4 max-w-md w-full mx-auto'>
                                <UpdatePayment />
                            </div>
                        )}
                    </ComponentTransition>
                </AnimatePresence>
            </main>

            <MobileNavBar />
        </>
    )
}

export default UserPanel