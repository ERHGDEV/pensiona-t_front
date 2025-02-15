import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import Dots from "../components/Dots"
import Button from "../components/Button"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { useNotificationContext } from "../context/NotificationContext"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const { showNotification } = useNotificationContext()
  const navigate = useNavigate()
  const userIsAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    if (userIsAuthenticated) {
      const role = authService.getUserRole()
      if (role === 'admin') navigate('/admin')
      else navigate('/user')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage("Iniciando sesión")

    try {
      const response = await authService.login(email, password)

      setTimeout(() => {
        setLoading(false)
        if (response.success) {
            if (response.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/user')
            }
        } else {
            setStatusMessage(response.message)
            showNotification(response.message, 'error')
        }
      }, 3000)
    } catch (error) {
      console.error('Error during login:', error)
      setLoading(false)
      if (error.response && error.response.status === 429) {
        setStatusMessage('Demasiados intentos, regresa más tarde')
        showNotification('Demasiados intentos, regresa más tarde', 'error')
      } else {
        setStatusMessage('Error en el servidor')
        showNotification('Error en el servidor', 'error')
      }
    }
  }

  return (
    <>
      <main>
        <form
          onSubmit={handleSubmit} 
          autoComplete='off' 
          className="max-w-sm mx-auto flex flex-col justify-center h-[calc(100vh-80px)]"
        >
          <p className='text-xl mb-5'>Inicia sesión</p>
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
              htmlFor='email'
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
          <Link 
            className="text-sm text-gray-300 hover:text-white active:text-gray-500
              transition duration-300 ease-in-out cursor-pointer" 
            to="/password">
              Olvidé mi contraseña
          </Link>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
            <Button type="submit" order="primary" disabled={loading}>
              {loading ? (
                <span className="text-center">
                  {statusMessage}
                  <Dots color='true' />
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </div>
        </form>
      </main>

      <Footer variant="fixed"/>
    </>
  )
}

export default Login
