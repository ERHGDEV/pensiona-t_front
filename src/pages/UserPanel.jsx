import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import Header from "../components/Header"
import Notification from "../components/Notification"

let SALARIO_MINIMO
let UMA
const SEMANAS_MINIMAS = 500
const SEMANAS_MAXIMAS = 2600
const EDAD_MINIMA = 43
const EDAD_MAXIMA = 75

const tabulador = [
  { min: 1.00, max: 1.25, cuantiaBasica: 80.000, incrementoAnual: 0.563 },
  { min: 1.26, max: 1.5, cuantiaBasica: 77.110, incrementoAnual: 0.814 },
  { min: 1.51, max: 1.75, cuantiaBasica: 58.180, incrementoAnual: 1.178 },
  { min: 1.76, max: 2, cuantiaBasica: 49.230, incrementoAnual: 1.430 },
  { min: 2.01, max: 2.25, cuantiaBasica: 42.670, incrementoAnual: 1.615 },
  { min: 2.26, max: 2.5, cuantiaBasica: 37.650, incrementoAnual: 1.756 },
  { min: 2.51, max: 2.75, cuantiaBasica: 33.680, incrementoAnual: 1.868 },
  { min: 2.76, max: 3, cuantiaBasica: 30.480, incrementoAnual: 1.958 },
  { min: 3.01, max: 3.25, cuantiaBasica: 27.830, incrementoAnual: 2.033 },
  { min: 3.26, max: 3.5, cuantiaBasica: 25.600, incrementoAnual: 2.096 },
  { min: 3.51, max: 3.75, cuantiaBasica: 23.700, incrementoAnual: 2.149 },
  { min: 3.75, max: 4, cuantiaBasica: 22.070, incrementoAnual: 2.195 },
  { min: 4.01, max: 4.25, cuantiaBasica: 20.650, incrementoAnual: 2.235 },
  { min: 4.26, max: 4.5, cuantiaBasica: 19.390, incrementoAnual: 2.271 },
  { min: 4.51, max: 4.75, cuantiaBasica: 18.290, incrementoAnual: 2.302 },
  { min: 4.76, max: 5, cuantiaBasica: 17.300, incrementoAnual: 2.330 },
  { min: 5.01, max: 5.25, cuantiaBasica: 16.410, incrementoAnual: 2.355 },
  { min: 5.26, max: 5.5, cuantiaBasica: 15.610, incrementoAnual: 2.377 },
  { min: 5.51, max: 5.75, cuantiaBasica: 14.880, incrementoAnual: 2.398 },
  { min: 5.76, max: 6, cuantiaBasica: 14.220, incrementoAnual: 2.416 },
  { min: 6.01, max: 6.01, cuantiaBasica: 13.620, incrementoAnual: 2.433 },
  { min: 6.02, max: Infinity, cuantiaBasica: 13.000, incrementoAnual: 2.450 }
]

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

  // New state for Notification component
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState('error')

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }
        const response = await axios.get("https://pensiona-t-back.vercel.app/api/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.data.isLoggedIn) {
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          navigate("/login")
          return
        }
        handleNotification(`Bienvenido, ${response.data.username}`, 'success')
        
        // Calculate remaining days
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
    verifyUser()
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

  const validateInputs = () => {
    const newErrors = {}
    const { salarioPromedio, semanasCotizadas, edad } = formData
    const salarioMensual = parseFloat(salarioPromedio)
    const semanas = parseInt(semanasCotizadas)
    const edadActual = parseInt(edad)

    const SALARIO_MINIMO_MENSUAL = SALARIO_MINIMO * 30
    const SALARIO_MAXIMO_MENSUAL = UMA * 25 * 30

    if (isNaN(salarioMensual) || salarioMensual < SALARIO_MINIMO_MENSUAL || salarioMensual > SALARIO_MAXIMO_MENSUAL) {
      newErrors.salarioPromedio = `El salario mensual debe estar entre $${SALARIO_MINIMO_MENSUAL.toFixed(2)} y $${SALARIO_MAXIMO_MENSUAL.toFixed(2)} pesos.`
    }

    if (edadActual < EDAD_MINIMA || edadActual > EDAD_MAXIMA) {
      newErrors.edad = `La edad debe estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años.`
    }

    let semanasRequeridas = semanas
    if (edadActual < 60) {
      semanasRequeridas += (60 - edadActual) * 52
    }

    if (semanasRequeridas < SEMANAS_MINIMAS || semanasRequeridas > SEMANAS_MAXIMAS) {
      if (edadActual < 60) {
        newErrors.semanasCotizadas = `Con su edad actual, necesitaría entre ${Math.max(SEMANAS_MINIMAS - (60 - edadActual) * 52, 0)} y ${SEMANAS_MAXIMAS - (60 - edadActual) * 52} semanas cotizadas.`
      } else {
        newErrors.semanasCotizadas = `Las semanas cotizadas deben estar entre ${SEMANAS_MINIMAS} y ${SEMANAS_MAXIMAS}.`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calcularPension = (salarioMensual, semanasCotizadas, edad, estadoCivil, hijos) => {
    const salarioDiario = salarioMensual / 30
    const salarioEnVSM = salarioDiario / SALARIO_MINIMO
  
    const rango = tabulador.find(r => salarioEnVSM >= r.min && salarioEnVSM <= r.max)
    if (!rango) {
      throw new Error(`No se encontró un rango válido para el salario: ${salarioEnVSM} VSM`)
    }
    
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
    if (validateInputs()) {
      try {
        const valuesResponse = await axios.get('https://pensiona-t-back.vercel.app/api/values')
        if (!valuesResponse.data.salarioMinimo || !valuesResponse.data.uma) {
          throw new Error('No se pudieron obtener los valores actualizados de salario mínimo y UMA')
        }
        SALARIO_MINIMO = valuesResponse.data.salarioMinimo
        UMA = valuesResponse.data.uma

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
        handleNotification('Cálculo realizado con éxito', 'success')
      } catch (error) {
        console.error('Error:', error)
        handleNotification(error.message || 'Error al obtener los valores actualizados', 'error')
      }
    }
  }

  const getFormattedDate = () => {
    const date = new Date()
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const generarPDFButtonHandler = () => {
    if (!results) return

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      marginLeft: 15,
      marginRight: 15,
    })

    const lineHeight = 10
    const x = 0
    const y = 0
    const width = doc.internal.pageSize.width
    const height = lineHeight * 1
    const fillColor = 'c8c8c8'
    doc.setFillColor(fillColor)
    doc.rect(x, y, width, height, "F")

    doc.setTextColor(33, 53, 71)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text('Proyección de pensión', doc.internal.pageSize.width / 2, height + 10, { align: 'center' })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const currentDate = getFormattedDate()
    doc.text(`${currentDate}`, doc.internal.pageSize.width - 17, 15, { align: 'right' })
    doc.text(`Semanas cotizadas actuales: ${results.semanasCotizadas}`, 15, height + 20)
    doc.text(`Edad:  ${results.edad}`, 15, height + 25)

    const dataNuevaTabla =   [
      [ { content: 'Salario mínimo vigente:', styles: { fontStyle: 'normal', halign: 'right' }}, { content: '$' + SALARIO_MINIMO.toFixed(2), styles: { fontStyle: 'normal' }}, '', 'Cálculo Mensual' ],
      [ { content: 'Salario mensual promedio últimos 5 años:', colSpan: 3 }, `${'$' +   results.salarioPromedio.toFixed(2)}` ],
      [ { content: 'Porcentaje de Cuantía:', colSpan: 2}, `${results.porcentajeCuantia.toFixed(2)}%`, `${'$' +    results.cuantiaBasica.toFixed(2)}`],
      [ { content: 'Semanas Cotizadas', rowSpan: 3 }, 'Total:', `${results.semanasCotizadas}`, { content: '', rowSpan: 4 } ],
      [ 'Requisito:', '500' ],
      [ 'Excedentes:', `${results.semanasExcedentes}` ],
      [ { content: 'Incrementos por años excedentes:', colSpan: 2 }, `${results.aniosExcedentes}` ],
      [ { content: 'Porcentaje de incremento:', colSpan: 2 }, `${results.porcentajeIncremento.toFixed(2)}%`, `${'$' + results.incremento.toFixed(2)}` ],
      [ { content: 'Suma de cuantía e incrementos:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.sumaCuantiaIncrementos.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
      [ { content: 'Asignaciones familiares', rowSpan: 2 }, 'Esposa (o):', '15%', `${'$' + results.asignacionEsposa.toFixed(2)}` ],
      [ 'Hijos:', '10% c/u', `${'$' + results.asignacionHijos.toFixed(2)}` ],
      [ { content: 'Ayuda asistencial (15% a 20%):', colSpan: 2 }, '15%', `${'$' + results.ayudaAsistencial.toFixed(2)}` ],
      [ { content: 'Total de cuantía básica:', colSpan: 3, styles: { fillColor: [200, 200, 200] } }, { content: '$' + results.totalCuantiaBasica.toFixed(2), styles: { fontStyle: 'bold', fillColor: [200, 200, 200] }} ],
    ]

    const stylesPDF = {
      theme: 'grid',
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        cellPadding: 2,
        cellSpacing: 0,
        valign: 'middle',
        halign: 'center',
        fontStyle: 'normal',
        overflow: 'linebreak',
        fillColor: [255, 255, 255],
        textColor: [33, 53, 71],
        fillStyle: 'F',
      },
      headStyles: {
        fillColor: [200, 200, 200],
        fontStyle: 'bold',
      },
    }

    doc.autoTable({
      head: [dataNuevaTabla[0]], 
      body: dataNuevaTabla.slice(1), 
      startY: 40,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    const resultTableData = [
      ['Edad de retiro', 'Porcentaje', 'Pensión Mensual'],
      ...results.pensionPorEdad.map(r => [
        `${r.edad} años`,
        `${r.porcentaje.toFixed(0)}%`,
        `$${r.pension.toFixed(2)}`
      ])
    ]

    doc.autoTable({
      head: [resultTableData[0]],
      body: resultTableData.slice(1),
      startY: doc.lastAutoTable.finalY + 10,
      theme: stylesPDF.theme,
      styles: stylesPDF.styles,
      headStyles: stylesPDF.headStyles,
    })

    const bottomRectHeight = lineHeight * 1
    const bottomRectY = doc.internal.pageSize.height - bottomRectHeight

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text('Consideraciones para la proyección', 15, bottomRectY - 37)

    doc.setFont("helvetica", "normal")
    doc.text('• Este cálculo únicamente es una proyección, el IMSS realizará el cálculo final al momento del trámite.', 15, bottomRectY - 30)
    doc.text('• Asignaciones familiares y ayuda asistencial, Artículo 164 LSS 1973.', 15, bottomRectY - 25)
    doc.text('• Cuantía de las pensiones, Artículo 167 LSS 1973.', 15, bottomRectY - 20)
    doc.text('• Pensión mínima, Artículo 168 LSS 1973.', 15, bottomRectY - 15)
    doc.text('• Tope de pensión es el salario promedio, Artículo 169 LSS 1973.', 15, bottomRectY - 10)
    doc.text('• Tope 25 umas, Transitorio Cuarto inciso II LSS 1973.', 15, bottomRectY - 5)

    doc.setFillColor(fillColor)
    doc.rect(x, bottomRectY, width, bottomRectHeight, "F")

    doc.setTextColor(255, 255, 255)
    doc.text('Pensiona-T', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 3, { align: 'center' })

    doc.save('Proyección.pdf')
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
                onClick={generarPDFButtonHandler}
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

//revisar validación del input de salario promedio, al primer intento de cálculo no valida correctamente el salario mínimo y máximo