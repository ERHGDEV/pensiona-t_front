import { useState } from "react"
import axios from "axios"
import { useNotificationContext } from "../context/NotificationContext"
import Button from "../components/Button"
import Dots from "../components/Dots"
import RegisterModal from "../components/RegisterModal"

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

        if (!newUser.email.endsWith("@gmail.com")) {
            showNotification("Favor de utilizar un correo de gmail", "error")
            return
        }

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
                    setShowForm(false)
                } else {
                    showNotification(response.data.message || "Error al registrar usuario", "error")
                }
                setIsSubmitting(false)
            }, 3000)
        } catch (error) {
            setTimeout(() => {
                if (error.response && error.response.status === 400) {
                    showNotification(error.response.data.message || "Error al registrar usuario", "error")
                } else if (error.response && error.response.status === 429) {
                    showNotification('Demasiados intentos, regresa más tarde', "error")
                } else {
                    showNotification("Error en el servidor", "error")
                }
                setIsSubmitting(false)
            }, 3000)
        }
    }

    return (
        <main>
            {showModal && (
                <RegisterModal onClose={setShowModal} />   
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
                        <Button type="submit" order="primary" >
                            {isSubmitting ? (
                                <span className="text-center">
                                    Registrando 
                                    <Dots />
                                </span>
                            ) : (
                                'Registrarme'
                            )}
                        </Button>
                    </div>
                    
                </form>
            ) : (
                <div className="flex flex-col justify-center h-[calc(100vh-80px)]">
                    <p className="mb-5 max-w-sm mx-auto text-pretty text-center">{statusMessage}</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                        <Button to="/" order="primary" >Volver al inicio</Button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Register
