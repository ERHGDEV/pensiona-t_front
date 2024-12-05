import { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosConfig'
import Dots from "./Dots"
import Button from "./Button"
import { AFORE_INFO } from '../constants/infoAfore'

const WhatAforeAmI = () => {
  const [nss, setNss] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [afore, setAfore] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isValidNSS, setIsValidNSS] = useState(false)

  useEffect(() => {
    setIsValidNSS(nss.length === 11 && /^\d+$/.test(nss))
  }, [nss])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidNSS) return

    setIsLoading(true)
    setAfore(null)
    setErrorMessage('')

    try {
      const response = await axiosInstance.post('/afore-info', { nss })
      setTimeout(() => {
        if (AFORE_INFO[response.data]) {
          setAfore(AFORE_INFO[response.data])
          setShowForm(false)
        } else {
          setErrorMessage('Intenta consultar tu NSS de nuevo mañana')
        }
        setIsLoading(false)
      }, 3000)
    } catch (err) {
      setTimeout(() => {
        setErrorMessage('Error al obtener la información de AFORE. Por favor, intente de nuevo.')
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleReset = () => {
    setNss('')
    setAfore(null)
    setShowForm(true)
    setErrorMessage('')
    setIsValidNSS(false)
  }

  const handleNssChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11)
    setNss(value)
    setErrorMessage('')
  }

  return (
    <div className="max-w-md h-[290px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-900">¿Cuál es mi AFORE?</h2>
      
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nss" className="block text-sm font-medium text-gray-700">
              Número de Seguridad Social
            </label>
            <input
              type="text"
              id="nss"
              value={nss}
              onChange={handleNssChange}
              className={`mt-2 w-full px-3 py-2 border rounded-md ${
                nss.length > 0 ? (isValidNSS ? 'border-green-500' : 'border-red-500') : 'border-sky-300'
              } text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent`}
              required
              disabled={isLoading}
              placeholder="11 dígitos"
            />
          </div>
          <div className='mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto'>
            <Button variant="primary" type="submit" disabled={isLoading || !isValidNSS} children="Consultar" />
          </div>
          {nss.length > 0 && !isValidNSS && (
              <p className="mt-1 text-center w-full text-sm text-red-500">El NSS debe tener 11 dígitos</p>
            )}
        </form>
      ) : (
        <div className="text-sky-950 text-center mt-8">
          <p className="text-xl font-semibold mb-4">Tu AFORE actual es:</p>
          <img src={afore.logo} alt={afore.name} className="mx-auto mb-4 h-16" />
          <div className='mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto'>
            <Button variant="secondary" onClick={handleReset} children="Volver" />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-sky-950 text-center mt-2">
          <p className="text-center mb-2">Consultando tu AFORE</p>
          <Dots color={true} />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 text-center mt-4">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default WhatAforeAmI