import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import URL from "../constants/url"
import { motion } from 'framer-motion'
import Dots from '../components/Dots'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState({ verified: false, message: 'Verificando tu cuenta' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')
  
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${URL}/verify?token=${token}`)
        setTimeout(() => {
          setStatus({ verified: true, message: response.data.message })
          setIsLoading(false)
        }, 3000)
      } catch (error) {
        const message = error.response?.data?.message
        setTimeout(() => {
          setStatus({ verified: false, message })
          setIsLoading(false)
        }, 3000)
      }
    }
  
    if (token) {
      verifyUser()
    } else {
      setTimeout(() => {
        setStatus({ verified: false, message: 'Token no proporcionado' })
        setIsLoading(false)
      }, 3000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto overflow-hidden md:max-w-2xl"
        >
          <div className="mx-auto">
            <div className="p-8 text-center">
              <h1 className="block mt-1 text-lg leading-tight font-medium text-gray-100">
                {isLoading ? ' ' : (status.verified ? '¡Listo!' : 'Algo salió mal')}
              </h1>
              <div className="mt-6 text-gray-200">
                <p>{status.message}</p>
                {isLoading && (
                  <Dots />
                )}
              </div>
              
              {isLoading ? (
                <div className="mt-6 h-10" /> 
              ) : status.verified ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-6"
                >
                  <div className='className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto'>
                    <Button to="/login" children="Iniciar sesión" />
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-6"
                >
                  <p className='mb-4'>Por favor, contacta a <a className="font-bold" href="mailto:pensionat.calculadora@gmail.com">soporte</a>.</p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                    <Button to="/" order="primary" children="Volver al inicio" />
                  </div>
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Verify