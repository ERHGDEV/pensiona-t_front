import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../services/axiosConfig"
import Header from "../components/Header"
import Notification from "../components/Notification"
import { SEMANAS_MINIMAS, TABULADOR } from "../constants/calculateData"
import generatePDF from "../utils/generatePDF"
import { validateInputs } from "../utils/userFormValidation"

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
  const navigate = useNavigate()

  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState('error')

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

  const calcularPension = (salarioMensual, semanasCotizadas, edad, estadoCivil, hijos) => {
    const salarioDiario = salarioMensual / 30
    const salarioEnVSM = salarioDiario / SALARIO_MINIMO
  
    const rango = TABULADOR.find(r => salarioEnVSM >= r.min && salarioEnVSM <= r.max)
    
    const cuantiaBasica = (rango.cuantiaBasica / 100) * salarioMensual
    const semanasExcedentes = Math.max(0, semanasCotizadas - SEMANAS_MINIMAS)
    const aniosExcedentes = Math.floor(semanasExcedentes / 52)
    const incrementoAnual = aniosExcedentes * (rango.incrementoAnual / 100) * salarioMensual
  
    let sumaCuantiaIncrementos = cuantiaBasica + incrementoAnual
  
    const asignacionEsposa = estadoCivil === 'casado' ? sumaCuantiaIncrementos * 0.15 : 0
    const asignacionHijos = hijos === '1' ? sumaCuantiaIncrementos * 0.10 : (hijos === '2' ? sumaCuantiaIncrementos * 0.20 : 0)
    const ayudaAsistencial = sumaCuantiaIncrementos * 0.15
  
    const totalCuantiaBasica = sumaCuantiaIncrementos + asignacionEsposa + asignacionHijos + ayudaAsistencial
  
    const porcentajes = [
      { edad: 60, porcentaje: 0.75 },
      { edad: 61, porcentaje: 0.80 },
      { edad: 62, porcentaje: 0.85 },
      { edad: 63, porcentaje: 0.90 },
      { edad: 64, porcentaje: 0.95 },
      { edad: 65, porcentaje: 1.00 }
    ]
  
    const pensionPorEdad = porcentajes.map(p => {
      let pension = totalCuantiaBasica * p.porcentaje
      pension = Math.max(pension, SALARIO_MINIMO * 30)
      pension = Math.min(pension, salarioMensual)
  
      return {
        edad: p.edad,
        porcentaje: p.porcentaje * 100,
        pension: pension
      }
    })
  
    return {
      salarioPromedio: salarioMensual,
      semanasCotizadas,
      edad,
      salarioMinimo: SALARIO_MINIMO,
      porcentajeCuantia: rango.cuantiaBasica,
      cuantiaBasica,
      semanasExcedentes,
      aniosExcedentes,
      porcentajeIncremento: rango.incrementoAnual,
      incremento: incrementoAnual,
      sumaCuantiaIncrementos,
      asignacionEsposa,
      asignacionHijos,
      ayudaAsistencial,
      totalCuantiaBasica,
      pensionPorEdad
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateInputs( formData, setErrors, SALARIO_MINIMO, UMA )) {
      try {
        getValues()

        const { salarioPromedio, semanasCotizadas, edad, estadoCivil, hijos } = formData
        const calculatedResults = calcularPension(
          parseFloat(salarioPromedio),
          parseInt(semanasCotizadas),
          parseInt(edad),
          estadoCivil,
          hijos
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

      <main className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Calculadora</h1>
        {remainingDays !== null && (
          <p className="mb-4 text-yellow-400">
            Días restantes de tu suscripción: {remainingDays}
          </p>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-6 pb-8 mb-4">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="salarioPromedio"
                id="salarioPromedio"
                className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
                placeholder=" " 
                required 
                value={formData.salarioPromedio}
                onChange={handleInputChange}
              />
              <label 
                className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
              >
                Salario promedio
              </label>
              {errors.salarioPromedio && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.salarioPromedio}</p>}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="semanasCotizadas"
                id="semanasCotizadas"
                className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
                placeholder=" " 
                required 
                value={formData.semanasCotizadas}
                onChange={handleInputChange}
              />
              <label 
                className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
              >
                Semanas cotizadas
              </label>
              {errors.semanasCotizadas && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.semanasCotizadas}</p>}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="edad"
                id="edad"
                className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
                placeholder=" " 
                required 
                value={formData.edad}
                onChange={handleInputChange}
              />
              <label 
                className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
              >
                Edad
              </label>
              {errors.edad && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.edad}</p>}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="estadoCivil"
                id="estadoCivil"
                className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
                placeholder=" " 
                required 
                value={formData.estadoCivil}
                onChange={handleInputChange}
              >
                <option className="text-sky-950" value="soltero">Soltero</option>
                <option className="text-sky-950" value="casado">Casado</option>
              </select>
              <label 
                className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
              >
                Estado civil
              </label>
              {errors.estadoCivil && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.estadoCivil}</p>}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="hijos"
                id="hijos"
                className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
                placeholder=" " 
                required 
                value={formData.hijos}
                onChange={handleInputChange}
              >
                <option className="text-sky-950" value="No">No</option>
                <option className="text-sky-950" value="1">1</option>
                <option className="text-sky-950" value="2">2</option>
              </select>
              <label 
                className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
              >
                Hijos
              </label>
            </div>
            <div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Calcular
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto text-gray-100 pt-6 pb-8 mb-4">
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center" style={{ width: '35%' }}>Edad</th>
                  <th className="px-4 py-2 text-center" style={{ width: '20%' }}>%</th>
                  <th className="px-4 py-2 text-center" style={{ width: '45%' }}>Pensión</th>
                </tr>
              </thead>
              <tbody>
                {results && results.pensionPorEdad.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-sky-900' : ''}>
                    <td className="border px-4 py-2 text-center whitespace-nowrap">{result.edad} años</td>
                    <td className="border px-4 py-2 text-center whitespace-nowrap">{result.porcentaje}%</td>
                    <td className="border px-4 py-2 text-center font-bold whitespace-nowrap">${result.pension.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setShowForm(true)}
              >
                Volver
              </button>
              <button
                onClick={generatePDFButtonHandler}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Generar PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default UserPanel