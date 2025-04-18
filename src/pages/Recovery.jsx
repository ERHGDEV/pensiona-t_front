import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import Dots from '../components/Dots'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { useNotificationContext } from '../context/NotificationContext'

const Recovery = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState({ message: 'Verificando token', success: null })
    const [isLoading, setIsLoading] = useState(true)
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { showNotification } = useNotificationContext()

    useEffect(() => {
        const token = searchParams.get('token')
        
        const validateToken = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_URL}/recovery?token=${token}`)
                setTimeout(() => {
                    setStatus({ message: 'Token verificado', success: true })
                    setIsLoading(false)
                }, 3000)
            } catch (error) {
                setTimeout(() => {
                    if (error.response && error.response.status === 429) {
                        setStatus({ message: 'Demasiados intentos, regresa más tarde', success: false })
                    } else {
                        setStatus({ message: 'Token inválido o expirado', success: false })
                    }
                    setIsLoading(false)
                }, 3000)
            }
        }

        if (token) {
            validateToken()
        } else {
            setTimeout(() => {
                setStatus({ message: 'Token no proporcionado', success: false })
                setIsLoading(false)
            }, 3000)
        }
    }, [searchParams])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (newPassword.length < 8 || confirmNewPassword.length < 8) {
            showNotification('La contraseña debe tener al menos 8 caracteres', 'error')
            return
        }

        if (newPassword !== confirmNewPassword) {
            showNotification('Las contraseñas no coinciden', 'error')
            return
        }
        
        setIsSubmitting(true)
        setStatus({ message: 'Actualizando contraseña', success: null })

        try {
            const token = searchParams.get('token')
            const response = await axios.post(`${import.meta.env.VITE_URL}/reset-password`, { token, newPassword })
            setTimeout(() => {
                setStatus({ message: 'Contraseña actualizada con éxito', success: true })
                setIsSubmitting(false)
            }, 3000)
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar la contraseña'
            setTimeout(() => {
                if (error.response && error.response.status === 429) {
                    setStatus({ message: 'Demasiados intentos, regresa más tarde', success: false })
                } else {
                    setStatus({ message: errorMessage, success: false })
                }
                setIsSubmitting(false)
            }, 3000)
        }
    }

    return (
        <>
            <main>
                <div className="max-w-sm mx-auto flex flex-col justify-center h-[calc(100vh-80px)]">
                    {isLoading ? (
                        <div className="text-center">
                            <p className="mb-5">{status.message}</p>
                            <Dots />
                        </div>
                    ) : status.success === false ? (
                        <div className="text-center">
                            <p className="mb-5">{status.message}</p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                                <Button to="/" order="primary" >Volver al inicio</Button>
                            </div>
                        </div>
                    ) : status.success === true && status.message === 'Contraseña actualizada con éxito' ? (
                        <div className="text-center mt-8">
                            <p>{status.message}</p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                                <Button to="/login" order="primary" >Iniciar sesión</Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <p className="text-xl mb-5">Recupera tu contraseña</p>
                            <div className="relative z-0 w-full mb-5 group">
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    id="newPassword" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="
                                        block py-2.5 px-0 w-full 
                                        text-md bg-transparent 
                                        border-0 border-b-2 border-gray-500 
                                        appearance-none 
                                        focus:outline-none focus:ring-0 
                                        focus:border-gray-100 peer" 
                                    placeholder=" " 
                                    required 
                                />
                                <label 
                                    htmlFor="newPassword"
                                    className="
                                        absolute text-md 
                                        text-gray-400 duration-300 
                                        transform -translate-y-6 scale-90 top-3 -z-10 
                                        origin-[0] peer-focus:start-0 
                                        rtl:peer-focus:translate-x-1/2 
                                        rtl:peer-focus:left-auto peer-focus:text-gray-100 
                                        peer-placeholder-shown:scale-100 
                                        peer-placeholder-shown:translate-y-0 
                                        peer-focus:scale-90 peer-focus:-translate-y-6"
                                >
                                    Nueva contraseña
                                </label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input 
                                    type="password" 
                                    name="confirmNewPassword" 
                                    id="confirmNewPassword" 
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="
                                        block py-2.5 px-0 w-full 
                                        text-md bg-transparent 
                                        border-0 border-b-2 border-gray-500 
                                        appearance-none 
                                        focus:outline-none focus:ring-0 
                                        focus:border-gray-100 peer" 
                                    placeholder=" " 
                                    required 
                                />
                                <label 
                                    htmlFor="confirmNewPassword"
                                    className="
                                        absolute text-md 
                                        text-gray-400 duration-300 
                                        transform -translate-y-6 scale-90 top-3 -z-10 
                                        origin-[0] peer-focus:start-0 
                                        rtl:peer-focus:translate-x-1/2 
                                        rtl:peer-focus:left-auto peer-focus:text-gray-100 
                                        peer-placeholder-shown:scale-100 
                                        peer-placeholder-shown:translate-y-0 
                                        peer-focus:scale-90 peer-focus:-translate-y-6"
                                >
                                    Confirmar nueva contraseña
                                </label>
                            </div>
                            
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                                <Button type="submit" order="primary" disable={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="text-center">
                                            Actualizando
                                            <Dots color='true' />
                                        </span>
                                    ): (
                                        'Cambiar contraseña'
                                    )}
                                </Button>
                            </div>                            
                        </form>
                    )}
                </div>
            </main>
            <Footer variant="fixed"/>
        </>
    )
}

export default Recovery
