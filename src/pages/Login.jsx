import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import Header from "../components/Header"
import Notification from "../components/Notification"
import { useNotificationContext } from "../context/NotificationContext"
import RegisterForm from "../components/RegisterForm"
import RecoveryForm from "../components/RecoveryForm"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isRegisteredOpen, setIsRegisteredOpen] = useState(false)
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false)
    const [isPreRegisterModalOpen, setIsPreRegisterModalOpen] = useState(false)

    const { showNotification } = useNotificationContext()

    const navigate = useNavigate()

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
            showNotification(response.message, 'error')
          }
        } catch (error) {
          console.error('Error during login:', error)
          showNotification('Error en el servidor', 'error')
        }
    }

    const handleUserRegistered = () => {
        setIsRegisteredOpen(false)
    }

    const handlePasswordRecovered = () => {
        setIsRecoveryOpen(false)
        showNotification('Contraseña actualizada exitosamente', 'success')
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
            <Notification />
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
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="pre-register-modal">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-md">
                        <div className="mt-3 text-center">
                            <h3 className="text-sky-950 text-2xl font-bold mb-2">Información de Registro</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-md text-gray-500">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
              <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-md">
                <div>
                  <div>
                    <RegisterForm onUserRegistered={handleUserRegistered} showNotification={showNotification}/>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="recovery-modal">
              <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-md">
                <div>
                  <div>
                    <RecoveryForm onPasswordRecovered={handlePasswordRecovered} showNotification={showNotification}/>
                  </div>
                  <div className="items-center pt-3">
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