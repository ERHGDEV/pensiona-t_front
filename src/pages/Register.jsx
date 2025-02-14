import { useState } from "react"
import axios from "axios"
import Notification from "../components/Notification"
import { useNotificationContext } from "../context/NotificationContext"
import Button from "../components/Button"
import Footer from "../components/Footer"
import Dots from "../components/Dots"

const Register = () => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [showForm, setShowForm] = useState(true)
    const [showModal, setShowModal] = useState(true)
    
    const { showNotification } = useNotificationContext()

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (newUser.password !== newUser.confirmPassword) {
            showNotification("Las contraseñas no coinciden", "error")
            return
        }
    
        if (newUser.password.length < 8) {
            showNotification("La contraseña debe tener al menos 8 caracteres", "error")
            return
        }
    
        setIsSubmitting(true)
        setStatusMessage("Registrando usuario")
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/register`, {
                name: newUser.name,
                email: (newUser.email).toLowerCase(),
                password: newUser.password
            })
    
            setTimeout(() => {
                if (response.data.success) {
                    setStatusMessage("Usuario registrado exitosamente, revisa tu bandeja de entrada")
                } else {
                    setStatusMessage(response.data.message || "Error al registrar usuario")
                }
                setIsSubmitting(false)
                setShowForm(false)
            }, 3000)
        } catch (error) {
            setTimeout(() => {
                if (error.response && error.response.status === 400) {
                    setStatusMessage(error.response.data.message || "Error al registrar usuario")
                } else if (error.response && error.response.status === 429) {
                    setStatusMessage('Demasiados intentos, regresa más tarde')
                } else {
                    setStatusMessage("Error en el servidor")
                }
                setIsSubmitting(false)
                setShowForm(false)
            }, 3000)
        }
    }

    return (
        <>
            <Notification />
            <main>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm text-sky-950">
                            <p className="text-xl">¡Bienvenido a Pensiona-T!</p>
                            <p className="my-5">Te sugerimos utilizar un correo electrónico con dominio
                                <strong> @gmail.com</strong> para asegurar que recibas el correo de verificación.
                            </p>
                            <div className='mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto'>
                                <Button onClick={() => setShowModal(false)} order="secundary" >Aceptar</Button>
                            </div>
                        </div>
                    </div>    
                )}
                {showForm ? (
                    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-sm mx-auto flex flex-col justify-center h-[calc(100vh-80px)]">
                        <p className="text-xl mb-5">Regístrate</p>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={newUser.name}
                                onChange={handleChange}
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
                                htmlFor="name"
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
                                Nombre
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={newUser.email}
                                onChange={handleChange}
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
                                htmlFor="email"
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
                                value={newUser.password}
                                onChange={handleChange}
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
                                htmlFor="password"
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
                                Contraseña
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                id="confirmPassword" 
                                value={newUser.confirmPassword}
                                onChange={handleChange}
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
                                htmlFor="confirmPassword"
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
                                Confirmar contraseña
                            </label>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                            <Button type="submit" order="primary" >Registrarme</Button>
                        </div>
                        {isSubmitting && (
                            <div className="text-center mt-8">
                                <p>Registrando usuario...</p>
                                <Dots />
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="text-center mt-48">
                        <p className="mb-5 max-w-sm mx-auto">{statusMessage}</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                            <Button to="/" order="primary" >Volver al inicio</Button>
                        </div>
                    </div>
                )}
            </main>
            <footer className="fixed bottom-0 text-center text-sky-200 flex py-8 justify-center w-full">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-4 flex justify-center space-x-6">
                        <a
                        href="https://www.facebook.com/calculadora.pensionat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-200 hover:text-white"
                        >
                        <span className="sr-only">Facebook</span>
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                            />
                        </svg>
                        </a>
                        <a
                        href="https://www.instagram.com/pensiona_t"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-200 hover:text-white"
                        >
                        <span className="sr-only">Instagram</span>
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                            />
                        </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Register
