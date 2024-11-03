import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../services/axiosConfig"
import Header from "../components/Header"
import Notification from "../components/Notification"
import generatePDF from "../utils/generatePDF"
import { validateInputs } from "../utils/userFormValidation"
import { calcularPension } from "../utils/calculatePension"
import PensionCalculatorForm from "../components/PensionCalculatorForm"
import PensionResults from "../components/PensionResults"

let SALARIO_MINIMO
let UMA

const UserPanel = () => {
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(true)
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
  
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState('error')

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
      handleNotification(error.message || 'Error al obtener los valores actualizados', 'error')
    }
  }

  const verifyUser = async () => {
    try {
      const response = await axiosInstance.get("/user")

      if (!response.data.isLoggedIn) {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        navigate("/login")
        return
      }
      handleNotification(`Bienvenido, ${response.data.username}`, 'success')
      
      const expirationDate = new Date(response.data.expiration)
      const today = new Date()
      const timeDiff = expirationDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setRemainingDays(daysDiff)
      
    } catch (error) {
      console.error('Error: ', error)
      handleNotification(error.message || "Ocurrió un error al verificar tu sesión", 'error')
      navigate("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyUser()
    getValues()
  }, [navigate])

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const handleNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
  }

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

  const handleSubmit = async (e) => {
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
        setResults(calculatedResults)
        setShowForm(false)
      } catch (error) {
        console.error('Error:', error)
        handleNotification(error.message || 'Error al obtener los valores actualizados', 'error')
      }
    }
  }

  const generatePDFButtonHandler = () => {
    if (!results) return

    generatePDF(results, SALARIO_MINIMO)
    handleNotification('PDF generado con éxito', 'success')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <>
      <Header />
      <Notification
        showNotification={showNotification}
        message={notificationMessage}
        type={notificationType}
      />

      <main className="mx-auto px-4  py-8">
        <h1 className="text-3xl font-bold mb-4">Calculadora</h1>
        {remainingDays !== null && (
          <p className="mb-4 text-yellow-400">
            Días restantes de tu suscripción: {remainingDays}
          </p>
        )}

        {showForm ? (
          <PensionCalculatorForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <PensionResults
            results={results}
            onBack={() => setShowForm(true)}
            onGeneratePDF={generatePDFButtonHandler}
          />
        )}
      </main>
    </>
  )
}

export default UserPanel