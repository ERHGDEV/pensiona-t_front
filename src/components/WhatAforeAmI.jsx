import { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosConfig'
import Dots from "./Dots"
import Button from "./Button"
import { AFORE_INFO } from '../constants/infoAfore'
import UsageModal from './UsageModal'

const WhatAforeAmI = () => {
  const [queryType, setQueryType] = useState('nss')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [afore, setAfore] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isValidInput, setIsValidInput] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)

  useEffect(() => {
    if (queryType === 'nss') {
      setIsValidInput(inputValue.length === 11 && /^\d+$/.test(inputValue))
    } else if (queryType === 'curp') {
      setIsValidInput(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(inputValue.toUpperCase()))
    }
  }, [inputValue, queryType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    openModal()

    /* e.preventDefault()
    if (!isValidInput) return

    setIsLoading(true)
    setAfore(null)
    setErrorMessage('')

    try {
      const endpoint = queryType === 'nss' ? '/afore-info-nss' : '/afore-info-curp'
      const payload = queryType === 'nss' ? { nss: inputValue } : { curp: inputValue.toUpperCase() }

      const response = await axiosInstance.post(endpoint, payload)
      setTimeout(() => {
        if (AFORE_INFO[response.data.claveAfore]) {
          setAfore(AFORE_INFO[response.data.claveAfore])
          setShowForm(false)
        } else if (response.data.diagnostico === 'Recuerda que sólamente puedes realizar una consulta por día.') {
          setErrorMessage('Intenta consultar de nuevo mañana')
        } else if (response.data.diagnostico === 'Lo sentimos, tu consulta generó un error, el NSS o CURP no se encuentra registrado.Si tienes alguna duda sobre el proceso denominado Localiza tu AFORE, llama al 55 1328 5000  (sin costo desde todo el país).”') {
          setErrorMessage('No estás registrado en una Afore')
        } else {
          setErrorMessage('No se encontró información')
        }
        setIsLoading(false)
      }, 3000)
    } catch (err) {
      setTimeout(() => {
        setErrorMessage('Por favor, intente de nuevo.')
        console.error(err)
        setIsLoading(false)
      }, 3000)
    } */
  }

  const handleReset = () => {
    setInputValue('')
    setAfore(null)
    setShowForm(true)
    setErrorMessage('')
    setIsValidInput(false)
  }

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\s/g, '').slice(0, queryType === 'nss' ? 11 : 18)
    setInputValue(value)
    setErrorMessage('')
  }

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value)
    setInputValue('')
    setIsValidInput(false)
    setErrorMessage('')
  }

  return (
    <div className="max-w-md h-[340px] mx-auto mt-4 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-900">¿Cuál es mi AFORE?</h2>

      <UsageModal show={isModalOpen} handleClose={() => setIsModalOpen(false)} />

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="queryType" className="block text-sm font-medium text-gray-700">
              Consultar por
            </label>
            <select
              id="queryType"
              value={queryType}
              onChange={handleQueryTypeChange}
              className="mt-2 w-full px-3 py-2 border rounded-md text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="nss">Número de Seguridad Social</option>
              <option value="curp">CURP</option>
            </select>
          </div>

          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              {queryType === 'nss' ? 'Número de Seguridad Social' : 'CURP'}
            </label>
            <input
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={handleInputChange}
              className={`mt-2 w-full px-3 py-2 border rounded-md ${
                inputValue.length > 0 ? (isValidInput ? 'border-green-500' : 'border-red-500') : 'border-sky-300'
              } text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent`}
              required
              disabled={isLoading}
              placeholder={queryType === 'nss' ? '11 dígitos' : '18 caracteres'}
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
            <Button variant="primary" type="submit" disabled={isLoading || !isValidInput}>
              {isLoading ? (
                <span>
                    Consultando
                    <Dots />
                </span>
              ): (
                "Consultar"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-sky-950 text-center mt-6">
          <p className="text-xl font-semibold mb-8">Tu AFORE actual es:</p>
          <img src={afore.logo} alt={afore.name} className="mx-auto mb-8 h-24" />
          <div className="mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
            <Button variant="secondary" onClick={handleReset} disabled={isLoading}>
              Volver
            </Button>
          </div>
        </div>
      )}

      {inputValue.length > 0 && !isValidInput && (
        <p className="mt-2 text-center w-full text-sm text-red-500">
          {queryType === 'nss'
            ? 'El NSS debe tener 11 dígitos'
            : 'El CURP debe tener 18 caracteres'}
        </p>
      )}

      {errorMessage && (
        <div className="text-red-500 text-center text-sm mt-2">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default WhatAforeAmI