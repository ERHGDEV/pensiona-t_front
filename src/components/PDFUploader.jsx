import { useState, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import Button from './Button'

const PDFUploader = () => {
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadWorker = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs')
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
    }
    loadWorker()
  }, [])

  const extractDataFromPDF = async (pdfData) => {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
  
    let totalSemanas = null
    const movimientos = []
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const pageText = textContent.items.map((item) => item.str).join(' ').replace(/\s+/g, ' ').trim()
  
      const semanasMatch = pageText.match(/(\d+)\s+(?=NSS)/i)
        if (semanasMatch) {
        totalSemanas = semanasMatch[1]
        }

      const movimientoRegex = /(\d{2}\/\d{2}\/\d{4})\s+([A-Z\s]+)\s+\$\s*([\d,.]+)/g
      let match
      while ((match = movimientoRegex.exec(pageText)) !== null) {
        movimientos.push({
          fecha: match[1],
          tipoMovimiento: match[2].trim(),
          salarioBase: parseFloat(match[3].replace(/,/g, ''))
        })
      }
    }

    if (movimientos.length === 0) {
      throw new Error("Se requiere el reporte detallado")
    }      
  
    movimientos.sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')) - new Date(b.fecha.split('/').reverse().join('-')))
  
    const movimientosConDias = movimientos.map((movimiento, index) => {
      const fechaActual = new Date(movimiento.fecha.split('/').reverse().join('-'))
      if (index === movimientos.length - 1) {
        const hoy = new Date()
        const dias = Math.floor((hoy - fechaActual) / (1000 * 60 * 60 * 24))
        return { ...movimiento, dias }
      }
  
      const fechaSiguiente = new Date(movimientos[index + 1].fecha.split('/').reverse().join('-'))
      const dias = Math.floor((fechaSiguiente - fechaActual) / (1000 * 60 * 60 * 24))
      return { ...movimiento, dias }
    })
  
    let diasAcumulados = 0
    let sumaSalariosPonderados = 0
  
    for (let i = movimientosConDias.length - 1; i >= 0; i--) {
      const movimiento = movimientosConDias[i]
      if (!movimiento.dias || movimiento.dias <= 0) continue
  
      const diasUsados = Math.min(1825 - diasAcumulados, movimiento.dias)
      sumaSalariosPonderados += movimiento.salarioBase * diasUsados
      diasAcumulados += diasUsados
  
      if (diasAcumulados >= 1825) break
    }
  
    const salarioPromedio = diasAcumulados > 0 ? sumaSalariosPonderados / diasAcumulados : 0
  
    const fechaMasAntigua = new Date(movimientos[0].fecha.split('/').reverse().join('-'))
    const fechaLey97 = new Date('1997-07-01')
    const ley = fechaMasAntigua < fechaLey97 ? 'Trabajador Ley 73' : 'Trabajador Ley 97'
  
    return { totalSemanas, salarioPromedio, ley }
  }  

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setError(null)
    setData(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo PDF.')
      return
    }
  
    setLoading(true)
    setError(null)
  
    try {
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result)
        try {
          const extractedData = await extractDataFromPDF(pdfData)
  
          // Verificar si el trabajador pertenece a la Ley 97
          if (extractedData.ley === 'Trabajador Ley 97') {
            console.log('Esta funcionalidad es para trabajadores de la ley 73')
            setError('Esta funcionalidad es para trabajadores de la ley 73')
            setData(null) // Limpiar los datos para evitar mostrar resultados
          } else {
            setData(extractedData)
            console.log(extractedData)
          }
        } catch (err) {
          setError(err.message) // Mostrar el mensaje de error capturado
          console.error(err.message)
        }
        setLoading(false)
      }
      fileReader.onerror = () => {
        setError('Error al leer el archivo.')
        console.error('Error al leer el archivo.')
        setLoading(false)
      }
      fileReader.readAsArrayBuffer(file)
    } catch (err) {
      setError('Error al procesar el archivo PDF: ' + err.message)
        console.error('Error al procesar el archivo PDF:', err.message)
      setLoading(false)
    }
  }
  
  return (
    <div className=" text-sky-900 max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <label htmlFor="queryType" className="block text-sm font-medium text-gray-700">
        PDF de semanas cotizadas
      </label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="w-full p-2 mb-4 mt-2 border border-gray-300 rounded"
      />
      <div className="flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
        <Button variant="primary" onClick={handleUpload} disabled={loading || !file}>
          Consultar
        </Button>
      </div>
    </div>
  )
}

export default PDFUploader
