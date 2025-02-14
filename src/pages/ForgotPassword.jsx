import { useState } from "react"
import axios from "axios"
import Footer from "../components/Footer"
import Button from "../components/Button"
import Dots from "../components/Dots"

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState('')
    const [showForm, setShowForm] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus("Solicitando recuperación")

        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/recovery`, { email })
            setTimeout(() => {
                if (response.data.success) {
                    setStatus("Te enviamos un correo electrónico para recuperar tu contraseña. Por favor revisa tu bandeja de entrada")
                } else {
                    setStatus(response.data.message || "Error al solicitar recuperación")
                }
                setIsSubmitting(false)
                setShowForm(false)
            }, 3000)
        } catch (error) {
            setTimeout(() => {
                if (error.response && error.response.status === 429) {
                    setStatus("Demasiados intentos, regresa más tarde")
                } else {
                    setStatus("Error en el servidor")
                }
                setIsSubmitting(false)
                setShowForm(false)
            }, 3000)
        }
    }

    return (
        <>
            <main>
                {showForm ? (
                    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-sm mx-auto flex flex-col justify-center h-[calc(100vh-80px)]">
                        <p className="text-xl mb-5">Recupera tu contraseña</p>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                            <Button type="submit" order="primary" >Recuperar contraseña</Button>
                        </div>
                        {isSubmitting && (
                            <div className="text-center mt-8">
                                <p className="mt-4">Solicitando recuperación...</p>
                                <Dots />
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="text-center mt-48">
                        <p className="mb-5 max-w-sm mx-auto">{status}</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                            <Button to="/" order="primary" >Volver al inicio</Button>
                        </div>
                    </div>
                )}
            </main>
            <Footer variant="fixed"/>
        </>
    )
}

export default ForgotPassword

