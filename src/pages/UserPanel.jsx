import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNotificationContext } from "../context/NotificationContext"
import Dots from "../components/Dots"
import axiosInstance from "../services/axiosConfig"
import Header from "../components/Header"
import Calculator from "../components/Calculator"
import WhatAforeAmI from "../components/WhatAforeAmI"
import ExcelAforeUploader from "../components/ExcelAforeUploader"
import Notification from "../components/Notification"
import UsageModal from "../components/UsageModal"

const UserPanel = () => {
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('calculadora')
    const [showUsageModal, setShowUsageModal] = useState(true)
    
    const { showNotification } = useNotificationContext()
    const navigate = useNavigate()

    const verifyUser = async () => {
        try {
            const response = await axiosInstance.get("/user");
            if (!response.data.name) {
                throw new Error('No se pudo verificar tu sesión');
            }
            showNotification(`Hola, ${response.data.name}`, 'success');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn('Sesión expirada, redirigiendo a login...');
            } else {
                console.error('Error desconocido:', error);
            }
            navigate('/login');
        } finally {
            setLoading(false);
            setShowUsageModal(true)
        }
    };

    useEffect(() => {
        verifyUser()
    }, [navigate])

    if (loading) {
        return(
            <>
                <Header />
                <div className="flex flex-col justify-center items-center h-screen" >
                    <p className="mb-8">Cargando</p>
                    <Dots />
                </div>
            </>
        )
    }
    return (
        <>
            <Header />
            <Notification />
            <UsageModal show={showUsageModal} handleClose={() => setShowUsageModal(false)} /> 
            <main className="max-w-md mx-auto px-4 py-4">

                <div className="flex justify-center">
                    <button
                        className={`px-4 py-2 mr-4 rounded-lg ${activeSection === 'calculadora' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                        onClick={() => setActiveSection('calculadora')}
                    >
                        Calculadora
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${activeSection === 'afore' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                        onClick={() => setActiveSection('afore')}
                    >
                        ¿En qué Afore estoy?
                    </button>
                </div>

                {activeSection === 'calculadora' ? (
                    <>
                        <Calculator />
                    </>
                ) : (
                    <>
                        <WhatAforeAmI />
                        <ExcelAforeUploader />
                    </>
                )}
            </main>
        </>
    )
}

export default UserPanel