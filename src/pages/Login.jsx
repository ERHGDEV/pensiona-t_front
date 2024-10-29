import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import Header from "../components/Header"
import Notification from "../components/Notification"
import RegisterForm from "../components/RegisterForm"
import RecoveryForm from "../components/RecoveryForm"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isRegisteredOpen, setIsRegisteredOpen] = useState(false)
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false)
    const [isPreRegisterModalOpen, setIsPreRegisterModalOpen] = useState(false)

    const navigate = useNavigate()

    //Estados, useEfect y función para mostrar notificaciones
    const [notificationMessage, setNotificationMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [notificationType, setNotificationType] = useState('error')

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showNotification])

    const handleNotification = (message, type) => {
        setNotificationMessage(message)
        setNotificationType(type)
        setShowNotification(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await authService.login(username, password)
          if (response.success) {
            if (response.role === 'admin') {
              navigate('/admin')
            } else {
              navigate('/user')
            }
          } else {
            handleNotification(response.message, 'error')
          }
        } catch (error) {
          console.error('Error during login:', error)
          handleNotification('Error en el servidor', 'error')
        }
    }

    const handleUserRegistered = () => {
        setIsRegisteredOpen(false)
    }

    const handlePasswordRecovered = () => {
        setIsRecoveryOpen(false)
        handleNotification('Contraseña actualizada exitosamente', 'success')
    }

    const handlePreRegisterClick = () => {
        setIsPreRegisterModalOpen(true)
    }

    const handlePreRegisterAccept = () => {
        setIsPreRegisterModalOpen(false)
        setIsRegisteredOpen(true)
    }

    return (
        <>
            <Header />
            <Notification showNotification={showNotification} message={notificationMessage} type={notificationType}/>
            <main>
                <form
                    onSubmit={handleSubmit} 
                    autoComplete='off' 
                    className="max-w-sm mx-auto mt-48"
                >
                    <p className='text-xl mb-5'>Inicia sesión</p>
                    <div className="relative z-0 w-full mb-5 group">
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            htmlFor='username'
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
                                Correo electrónico
                            </label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            htmlFor='password'
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
                                Password
                            </label>
                    </div>

                <button 
                    type="submit" 
                    className="bg-gray-200 text-cyan-950 
                    hover:bg-white focus:ring-2 focus:outline-none 
                    focus:ring-blue-300 font-medium rounded-lg 
                    text-md w-full px-5 py-2.5 text-center mt-5"
                >
                    Entrar
                </button>
            </form>

            {isPreRegisterModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="pre-register-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información de Registro</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    El registro incluye una prueba gratuita de 30 días naturales
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={handlePreRegisterAccept}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isRegisteredOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
              <div className="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-gray-100">
                <div>
                  <div>
                    <RegisterForm onUserRegistered={handleUserRegistered} handleNotification={handleNotification}/>
                  </div>
                  <div className="items-center py-3">
                    <button
                      id="ok-btn"
                      className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => setIsRegisteredOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            {isRecoveryOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="recovery-modal">
              <div className="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-gray-100">
                <div>
                  <div>
                    <RecoveryForm onPasswordRecovered={handlePasswordRecovered} handleNotification={handleNotification}/>
                  </div>
                  <div className="items-center py-3">
                    <button
                      id="close-recovery-btn"
                      className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => setIsRecoveryOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            <div className="max-w-sm mx-auto">
                <button
                    onClick={handlePreRegisterClick}
                    className="text-gray-200 bg-sky-800
                    hover:text-white hover:bg-sky-900 font-medium 
                    text-md w-full px-5 py-2.5 text-center rounded-lg mt-5"
                >
                    Registrarme
                </button>
                <button
                    onClick={() => setIsRecoveryOpen(true)}
                    className="text-gray-200 bg-sky-800
                    hover:text-white hover:bg-sky-900 font-medium 
                    text-md w-full px-5 py-2.5 text-center rounded-lg mt-3"
                >
                    Recuperar Contraseña
                </button>
            </div>

            </main>
        </>
    )
}

export default Login