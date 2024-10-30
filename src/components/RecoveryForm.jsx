import { useState } from 'react'
import axios from 'axios'
import URL from '../constants/url'

const RecoveryForm = ({ onPasswordRecovered, handleNotification }) => {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [secretAnswer, setSecretAnswer] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [secretQuestion, setSecretQuestion] = useState('')

    const handleStep1 = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${URL}/recovery/step1`, { email })
            if (response.data.success) {
                setSecretQuestion(response.data.secretQuestion)
                setStep(2)
            } else {
                handleNotification(response.data.message, 'error')
            }
        } catch (error) {
            console.error('Error during recovery step 1:', error)
            handleNotification('Error en el servidor', 'error')
        }
    }

    const handleStep2 = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${URL}/recovery/step2`, { email, secretAnswer })
            if (response.data.success) {
                setStep(3)
            } else {
                handleNotification(response.data.message, 'error')
            }
        } catch (error) {
            console.error('Error during recovery step 2:', error)
            handleNotification('Error en el servidor', 'error')
        }
    }

    const handleStep3 = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            handleNotification('Las contraseñas no coinciden', 'error')
            return
        }
        if (newPassword.length < 8) {
            handleNotification('La contraseña debe tener al menos 8 caracteres', 'error')
            return
        }
        try {
            const response = await axios.post(`${URL}/recovery/step3`, { email, newPassword })
            if (response.data.success) {
                onPasswordRecovered()
            } else {
                handleNotification(response.data.message, 'error')
            }
        } catch (error) {
            console.error('Error during recovery step 3:', error)
            handleNotification('Error en el servidor', 'error')
        }
    }

    return (
        <div>
            {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-4 text-sky-950">
                    <h2 className="text-sky-950 text-2xl font-bold mb-2">Recuperar Contraseña</h2>
                    <div>
                        <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            id="recovery-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Siguiente
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-4 text-sky-950">
                    <h2 className="text-sky-950 text-2xl font-bold mb-2">Pregunta Secreta</h2>
                    <p className="mb-2">{secretQuestion}</p>
                    <div>
                        <label htmlFor="secret-answer" className="block text-sm font-medium text-gray-700">Respuesta</label>
                        <input
                            type="text"
                            id="secret-answer"
                            value={secretAnswer}
                            onChange={(e) => setSecretAnswer(e.target.value)}
                            required
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Verificar
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleStep3} className="space-y-4 text-sky-950">
                    <h2 className="text-sky-950 text-2xl font-bold mb-2">Nueva Contraseña</h2>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Actualizar Contraseña
                    </button>
                </form>
            )}
        </div>
    )
}

export default RecoveryForm