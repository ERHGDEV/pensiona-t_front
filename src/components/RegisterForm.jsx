import { useState } from "react"
import axios from "axios"
import URL from "../constants/url"

const RegisterForm = ({ onUserRegistered, handleNotification }) => {
    const [newUser, setNewUser] = useState({
        numeroConsar: '',
        firstname: '',
        username: '',
        password: '',
        confirmPassword: '',
        secretQuestion: '',
        secretAnswer: ''
    })

    const [isConsarValid, setIsConsarValid] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewUser((prev) => ({ ...prev, [name]: value }))
    }

    const validateConsar = async () => {
        try {
            const consarResponse = await axios.post(`${URL}/verify-consar`, {
                numeroConsar: newUser.numeroConsar,
            })

            if (consarResponse.data.estatus === "ACTIVO") {
                setNewUser((prev) => ({
                    ...prev,
                    firstname: consarResponse.data.nombre,
                }))
                setIsConsarValid(true)
                handleNotification("Número CONSAR verificado, continúa con el registro", "success")
            } else {
                handleNotification("El número CONSAR no es válido o está inactivo", "error")
                setIsConsarValid(false)
            }
        } catch (error) {
            handleNotification("Error al verificar el número CONSAR", "error")
            setIsConsarValid(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newUser.password !== newUser.confirmPassword) {
            handleNotification("Las contraseñas no coinciden", "error")
            return
        }

        if (newUser.password.length < 8) {
            handleNotification("La contraseña debe tener al menos 8 caracteres", "error")
            return
        }

        try {
            const response = await axios.post(`${URL}/register`, {
                numeroConsar: newUser.numeroConsar,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                password: newUser.password,
                secretQuestion: newUser.secretQuestion,
                secretAnswer: newUser.secretAnswer,
            })

            if (response.data.success) {
                setNewUser({
                    numeroConsar: '',
                    firstname: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    secretQuestion: '',
                    secretAnswer: ''
                })
                setIsConsarValid(false)
                onUserRegistered()
                handleNotification("Usuario registrado exitosamente", "success")
            } else {
                handleNotification(response.data.message, "error")
            }
        } catch (error) {
            handleNotification("Error en el servidor", "error")
            console.error("Error al crear usuario:", error)
        }
    }

    return (
        <>
            <h2 className="text-sky-950 text-2xl font-bold mb-2">Regístrate</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label htmlFor="numeroConsar" className="block text-sm font-medium text-gray-700">Número CONSAR</label>
                    <input
                        type="number"
                        id="numeroConsar"
                        name="numeroConsar"
                        value={newUser.numeroConsar}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                    <button
                        type="button"
                        onClick={validateConsar}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Validar Número CONSAR
                    </button>
                </div>

                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={newUser.firstname}
                        onChange={handleChange}
                        required
                        disabled
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        id="username"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        required
                        disabled={!isConsarValid}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        disabled={!isConsarValid}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={newUser.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        disabled={!isConsarValid}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="secretQuestion" className="block text-sm font-medium text-gray-700">Pregunta Secreta</label>
                    <select
                        id="secretQuestion"
                        name="secretQuestion"
                        value={newUser.secretQuestion}
                        onChange={handleChange}
                        required
                        disabled={!isConsarValid}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    >
                        <option value="">Selecciona una pregunta</option>
                        <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                        <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                        <option value="¿Cuál es el nombre de tu mejor amigo de la infancia?">¿Cuál es el nombre de tu mejor amigo de la infancia?</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="secretAnswer" className="block text-sm font-medium text-gray-700">Respuesta Secreta</label>
                    <input
                        type="text"
                        id="secretAnswer"
                        name="secretAnswer"
                        value={newUser.secretAnswer}
                        onChange={handleChange}
                        required
                        disabled={!isConsarValid}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!isConsarValid}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${!isConsarValid ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Finalizar registro
                </button>
            </form>
        </>
    )
}

export default RegisterForm
