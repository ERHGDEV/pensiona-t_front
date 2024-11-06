import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import URL from "../constants/url"
import { motion } from 'framer-motion'

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
        const message = error.response?.data?.message || 'Error en el servidor'
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

  const ellipsisVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

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
                {isLoading ? ' ' : (status.verified ? '¡Listo!' : 'Error')}
              </h1>
              <div className="mt-2 text-gray-200">
                <p>{status.message}</p>
                {isLoading && (
                  <motion.span
                    variants={ellipsisVariants}
                    animate="animate"
                    className="inline-flex ml-1"
                  >
                    <motion.span variants={dotVariants} className="w-1 h-1 bg-gray-200 rounded-full mx-0.5" />
                    <motion.span variants={dotVariants} className="w-1 h-1 bg-gray-200 rounded-full mx-0.5" />
                    <motion.span variants={dotVariants} className="w-1 h-1 bg-gray-200 rounded-full mx-0.5" />
                  </motion.span>
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
                    <Link
                        to="/login"
                        className="max-w-fit mx-auto bg-white hover:bg-sky-100 text-sky-900 font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        Inicia sesión
                        <span className="ml-2">→</span>
                    </Link>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-6 text-red-500"
                >
                  Por favor, intenta verificar tu cuenta nuevamente o contacta a soporte.
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