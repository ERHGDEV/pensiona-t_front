import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../services/axiosConfig"
import Header from "../components/Header"
import Notification from "../components/Notification"
import { useNotificationContext } from "../context/NotificationContext"
import generatePDF from "../utils/generatePDF"
import { validateInputs } from "../utils/userFormValidation"
import { calcularPension } from "../utils/calculatePension"
import PensionCalculatorForm from "../components/PensionCalculatorForm"
import PensionResults from "../components/PensionResults"
import WhatAforeAmI from "../components/WhatAforeAmI"
import Dots from "../components/Dots"

let SALARIO_MINIMO
let UMA

const UserPanel = () => {
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(true)
  const [activeSection, setActiveSection] = useState('calculadora')
  const [formData, setFormData] = useState({
    salarioPromedio: "",
    semanasCotizadas: "",
    edad: "",
    estadoCivil: "soltero",
    hijos: "No"
  })
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState({})
  const [remainingDays, setRemainingDays] = useState(null)
  
  const { showNotification } = useNotificationContext()
  const navigate = useNavigate()

  const getValues = async () => {
    try {
      const valuesResponse = await axiosInstance.get("/values")
      if (!valuesResponse.data.salarioMinimo || !valuesResponse.data.uma) {
        throw new Error('No se pudieron obtener los valores actualizados de salario mínimo y UMA')
      }
      SALARIO_MINIMO = valuesResponse.data.salarioMinimo
      UMA = valuesResponse.data.uma
    } catch (error) {
      console.error('Error:', error)
      showNotification(error.message || 'Error al obtener los valores actualizados', 'error')
    }
  }

  const incrementCalculationCount = async () => {
    try {
      await axiosInstance.put('/user/increment-calculos')
    } catch (error) {
      console.error('Error al incrementar el contador:', error)
    }
  }

  const verifyUser = async () => {
    try {
      const response = await axiosInstance.get("/user")
      if (!response.data.name) {
        throw new Error('No se pudo verificar tu sesión')
      }

      showNotification(`Bienvenido, ${response.data.name}`, 'success')
      
      const expirationDate = new Date(response.data.expiration)
      const today = new Date()
      const timeDiff = expirationDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setRemainingDays(daysDiff)
      
    } catch (error) {
      console.error('Error: ', error)
      showNotification(error.message || "Ocurrió un error al verificar tu sesión", 'error')
      navigate("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyUser()
    getValues()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }))
  }

  const handleSubmit = async (e, modalidad40Data) => {
    e.preventDefault()
    if (validateInputs(formData, setErrors, SALARIO_MINIMO, UMA)) {
      try {
        await getValues()

        const { salarioPromedio, semanasCotizadas, edad, estadoCivil, hijos } = formData
        const calculatedResults = calcularPension(
          parseFloat(salarioPromedio),
          parseInt(semanasCotizadas),
          parseInt(edad),
          estadoCivil,
          hijos,
          SALARIO_MINIMO
        )

        if (modalidad40Data.includeModalidad40) {
          const salarioPromedioModalidad40 = (
            (parseFloat(salarioPromedio) * (5 - parseInt(modalidad40Data.anosModalidad40))) +
            (parseFloat(modalidad40Data.salarioModalidad40) * parseInt(modalidad40Data.anosModalidad40))
          ) / 5

          const calculatedResultsModalidad40 = calcularPension(
            salarioPromedioModalidad40,
            parseInt(semanasCotizadas),
            parseInt(edad),
            estadoCivil,
            hijos,
            SALARIO_MINIMO
          )

          calculatedResults.salarioRegistradoM40 = parseFloat(modalidad40Data.salarioModalidad40)
          calculatedResults.salarioPromedioModalidad40 = salarioPromedioModalidad40
          calculatedResults.pensionModalidad40 = calculatedResultsModalidad40.pensionPorEdad
          calculatedResults.anosModalidad40 = parseInt(modalidad40Data.anosModalidad40)
          calculatedResults.inicioMes = modalidad40Data.inicioMes
          calculatedResults.inicioAnio = modalidad40Data.inicioAnio
        }

        setResults(calculatedResults)
        setShowForm(false)

        await incrementCalculationCount()
      } catch (error) {
        console.error('Error:', error)
        showNotification(error.message || 'Error al obtener los valores actualizados', 'error')
      }
    }
  }

  const generatePDFButtonHandler = async () => {
    if (!results) return;

    try {
        generatePDF(results, SALARIO_MINIMO)
        showNotification('PDF generado con éxito', 'success')

        await axiosInstance.put('/user/increment-reportes')
    } catch (error) {
        console.error('Error al incrementar el contador de reportes:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-8">Cargando</p>
        <Dots />
      </div>
    )
  }

  return (
    <>
      <Header />
      <Notification />

      <main className="max-w-md mx-auto px-4 py-8">
        
        {/* {remainingDays !== null && (
          <p className="mb-4 text-yellow-400">
            Días restantes de tu suscripción: {remainingDays}
          </p>
        )} */}

        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 mr-2 rounded-lg ${activeSection === 'calculadora' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveSection('calculadora')}
          >
            Calculadora
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeSection === 'afore' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveSection('afore')}
          >
            ¿En qué Afore estoy?
          </button>
        </div>

        {activeSection === 'calculadora' ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Calculadora de Pensión</h1>
            {showForm ? (
              <PensionCalculatorForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                UMA={UMA}
              />
            ) : (
              <PensionResults
                results={results}
                onBack={() => setShowForm(true)}
                onGeneratePDF={generatePDFButtonHandler}
              />
            )}
          </>
        ) : (
          <WhatAforeAmI />
        )}
      </main>
    </>
  )
}

export default UserPanel